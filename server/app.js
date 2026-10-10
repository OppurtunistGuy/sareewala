import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {mkdirSync,existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {catalog,demoCoupon} from './catalog.js';
const hash=v=>createHash('sha256').update(v).digest('hex');
const token=()=>randomBytes(32).toString('hex');
const emailValid=v=>typeof v==='string'&&v.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const fail=(res,status,message)=>res.status(status).json({error:message});
export function createApp({dbPath=process.env.DB_PATH||resolve('data/store.sqlite'),testing=false}={}){
 if(process.env.DEMO_MODE==='false')throw Error('Live commerce is not configured. Keep DEMO_MODE=true until merchant data and payment/email providers are integrated.');
 if(dbPath!==':memory:')mkdirSync(dirname(dbPath),{recursive:true});
 const db=new DatabaseSync(dbPath);db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,salt TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER REFERENCES users(id),expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS stock(variant TEXT PRIMARY KEY,quantity INTEGER NOT NULL CHECK(quantity>=0));
 CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),idempotency TEXT NOT NULL,data TEXT NOT NULL,created INTEGER NOT NULL,UNIQUE(user_id,idempotency));
 CREATE TABLE IF NOT EXISTS payment_attempts(user_id INTEGER NOT NULL,key TEXT NOT NULL,status TEXT NOT NULL,UNIQUE(user_id,key));
 CREATE TABLE IF NOT EXISTS newsletters(email TEXT PRIMARY KEY,consent INTEGER NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS returns(id TEXT PRIMARY KEY,order_id TEXT NOT NULL REFERENCES orders(id),user_id INTEGER NOT NULL,product_id INTEGER NOT NULL,status TEXT NOT NULL,reason TEXT NOT NULL,created INTEGER NOT NULL,UNIQUE(order_id,product_id));
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,event TEXT NOT NULL,data TEXT NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS wishlist(user_id INTEGER PRIMARY KEY REFERENCES users(id),data TEXT NOT NULL);`);
 for(const p of catalog)for(const v of p.variants)db.prepare('INSERT OR IGNORE INTO stock VALUES (?,?)').run(v.id,v.stock);
 const app=express();app.disable('x-powered-by');app.use(compression());if(process.env.TRUST_PROXY==='true')app.set('trust proxy',1);app.use((req,res,next)=>{if(process.env.NODE_ENV==='production'&&!req.secure){const url=process.env.PUBLIC_URL;if(!url||!url.startsWith('https://'))return fail(res,503,'An HTTPS PUBLIC_URL is required for production.');return res.redirect(308,new URL(url).origin+req.originalUrl)}next()});
 app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'",...(existsSync(resolve('dist/index.html'))?[...readFileSync(resolve('dist/index.html'),'utf8').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>"'sha256-"+createHash('sha256').update(m[1]).digest('base64')+"'"):[])],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'","data:"],connectSrc:["'self'"],fontSrc:["'self'"],objectSrc:["'none'"],frameAncestors:["'none'"],upgradeInsecureRequests:process.env.NODE_ENV==='production'?[]:null}}}));
 app.use(express.json({limit:'24kb'}));app.use(cookieParser());
 const limits=new Map();app.use('/api',(req,res,next)=>{
  res.set('Cache-Control','no-store');
  const sid=req.cookies.session;const session=sid?db.prepare('SELECT * FROM sessions WHERE token=? AND expires>?').get(hash(sid),Date.now()):null;
  req.user=session?db.prepare('SELECT id,email,name FROM users WHERE id=?').get(session.user_id):null;
  if(!['GET','HEAD','OPTIONS'].includes(req.method)){
   const origin=req.get('origin');if(origin&&origin!==`${req.protocol}://${req.get('host')}`)return fail(res,403,'Cross-origin request denied.');
   if(!req.cookies.csrf||req.get('x-csrf-token')!==req.cookies.csrf)return fail(res,403,'Your session needs refreshing. Please reload and try again.');
  }
  if(['/auth/login','/auth/register','/newsletter'].includes(req.path)){
   const key=req.ip+req.path;const prev=limits.get(key)||{count:0,until:Date.now()+60000};if(prev.until<Date.now()){prev.count=0;prev.until=Date.now()+60000}prev.count++;limits.set(key,prev);if(prev.count>(testing?200:15))return fail(res,429,'Too many attempts. Please wait a minute.');
  }
  next();
 });
 const cookieOptions={httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/'};
 const requireUser=(req,res,next)=>req.user?next():fail(res,401,'Please sign in to continue.');
 const issueSession=(res,user)=>{const value=token();db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(hash(value),user.id,Date.now()+7*86400000);res.cookie('session',value,{...cookieOptions,maxAge:7*86400000});return {id:user.id,name:user.name,email:user.email}};
 app.get('/api/session',(req,res)=>{const csrf=req.cookies.csrf||token();res.cookie('csrf',csrf,{...cookieOptions,httpOnly:false,maxAge:7*86400000});res.json({user:req.user||null,csrf,demo:true})});
 app.get('/api/health',(req,res)=>res.json({ok:true,mode:'demo'}));
 app.get('/api/products',(req,res)=>{
  const products=catalog.map(p=>({...p,variants:p.variants.map(v=>({...v,stock:db.prepare('SELECT quantity FROM stock WHERE variant=?').get(v.id).quantity}))}));
  res.json(products);
 });
 app.post('/api/auth/register',(req,res)=>{
  const {name,email,password}=req.body||{};
  if(typeof name!=='string'||name.trim().length<2||name.length>80||!emailValid(email)||typeof password!=='string'||password.length<10||password.length>128)return fail(res,400,'Enter your name, a valid email and a password of 10–128 characters.');
  const salt=token();const passwordHash=scryptSync(password,salt,64).toString('hex');
  try{const r=db.prepare('INSERT INTO users(email,name,password,salt) VALUES (?,?,?,?)').run(email.toLowerCase().trim(),name.trim(),passwordHash,salt);res.status(201).json({user:issueSession(res,{id:r.lastInsertRowid,email:email.toLowerCase().trim(),name:name.trim()})})}catch(e){if((e.code?.includes('CONSTRAINT')||[1555,2067].includes(e.errcode)))return fail(res,409,'An account with that email already exists.');throw e}
 });
 app.post('/api/auth/login',(req,res)=>{const {email,password}=req.body||{};if(!emailValid(email)||typeof password!=='string'||password.length>128)return fail(res,400,'Enter a valid email and password.');const u=db.prepare('SELECT * FROM users WHERE email=?').get(email.toLowerCase().trim());const salt=u?.salt||'dummy';const candidate=scryptSync(password,salt,64);if(!u||!timingSafeEqual(candidate,Buffer.from(u.password,'hex')))return fail(res,401,'Email or password is incorrect.');res.json({user:issueSession(res,u)})});
 app.post('/api/auth/logout',(req,res)=>{if(req.cookies.session)db.prepare('DELETE FROM sessions WHERE token=?').run(hash(req.cookies.session));res.clearCookie('session',cookieOptions);res.json({ok:true})});
 app.get('/api/wishlist',requireUser,(req,res)=>res.json(JSON.parse(db.prepare('SELECT data FROM wishlist WHERE user_id=?').get(req.user.id)?.data||'[]')));
 app.put('/api/wishlist',requireUser,(req,res)=>{const ids=req.body?.ids;if(!Array.isArray(ids)||ids.length>100||ids.some(id=>!catalog.some(p=>p.id===id)))return fail(res,400,'Invalid wishlist.');const unique=[...new Set(ids)];db.prepare('INSERT INTO wishlist VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data').run(req.user.id,JSON.stringify(unique));res.json(unique)});
 app.post('/api/newsletter',(req,res)=>{const {email,consent}=req.body||{};if(!emailValid(email)||consent!==true)return fail(res,400,'A valid email and marketing consent are required.');try{db.prepare('INSERT INTO newsletters VALUES (?,?,?)').run(email.toLowerCase().trim(),1,Date.now());res.status(201).json({message:'Your interest is recorded in this demo. No marketing emails will be sent.'})}catch(e){if((e.code?.includes('CONSTRAINT')||[1555,2067].includes(e.errcode)))return fail(res,409,'This email is already subscribed in the demo.');throw e}});
 const totals=(items,coupon,userId)=>{
  if(!Array.isArray(items)||!items.length||items.length>30)throw Error('Your bag is empty or has too many items.');
  const lines=[];const seen=new Set();for(const item of items){const p=catalog.find(p=>p.id===item.id);const v=p?.variants.find(v=>v.id===item.variant);if(!p||!v||!Number.isInteger(item.qty)||item.qty<1||item.qty>10||seen.has(v.id))throw Error('Choose valid products, variants and quantities (maximum 10).');seen.add(v.id);const stock=db.prepare('SELECT quantity FROM stock WHERE variant=?').get(v.id)?.quantity||0;if(stock<item.qty)throw Error(`${p.name}: this variant is unavailable or has insufficient stock.`);lines.push({id:p.id,variant:v.id,qty:item.qty,name:p.name,image:p.image,price:p.price,mrp:p.mrp,returnable:p.returnable,color:v.color,size:v.size})}
  const subtotal=lines.reduce((s,x)=>s+x.price*x.qty,0);let discount=0,code='';
  if(coupon){if(typeof coupon!=='string'||coupon.length>30||coupon.trim().toUpperCase()!==demoCoupon.code)throw Error('Coupon is invalid. Only one coupon may be applied.');if(Date.now()>Date.parse(demoCoupon.expires))throw Error('Coupon has expired.');if(subtotal<demoCoupon.minSubtotal)throw Error('Coupon requires a minimum merchandise subtotal of ₹499.');if(userId){const used=db.prepare('SELECT id FROM orders WHERE user_id=?').get(userId);if(used)throw Error('WELCOME10 can only be used on your first demo order.')}discount=Math.min(Math.floor(subtotal*demoCoupon.percent/100),demoCoupon.maxDiscount);code=demoCoupon.code}
  const merchandise=subtotal-discount;const shipping=merchandise>=99900?0:7900;const includedTax=Math.round(merchandise-merchandise/1.05);return {lines,subtotal,discount,shipping,includedTax,total:merchandise+shipping,coupon:code,currency:'INR',demo:true};
 };
 app.post('/api/quote',(req,res)=>{try{res.json(totals(req.body.items,req.body.coupon,req.user?.id))}catch(e){fail(res,400,e.message)}});
 app.get('/api/commerce-config',(req,res)=>res.json({demo:true,coupon:demoCoupon,shipping:{fee:7900,freeAt:99900},tax:'Demo prices include 5% GST; merchant tax rules are not approved.',payments:['Demo UPI','Demo card','Demo wallet','Demo COD'],returns:{days:7,mode:'demo'},liveCheckoutEnabled:false}));
 app.post('/api/checkout',requireUser,(req,res)=>{
  const {items,coupon,address,method,key,outcome='confirmed'}=req.body||{};
  if(typeof key!=='string'||!/^[a-zA-Z0-9_-]{16,100}$/.test(key))return fail(res,400,'A valid checkout idempotency key is required.');
  const existing=db.prepare('SELECT id,data FROM orders WHERE user_id=? AND idempotency=?').get(req.user.id,key);if(existing)return res.json(JSON.parse(existing.data));
  if(!address||['name','street','city','state'].some(k=>typeof address[k]!=='string'||address[k].trim().length<2||address[k].length>200)||!/[1-9]\d{5}/.test(address.pin)||!String(address.pin).match(/^[1-9]\d{5}$/))return fail(res,400,'Enter a complete shipping address and a valid six-digit Indian PIN code.');
  if(!['upi','card','wallet','cod'].includes(method)||!['confirmed','pending','failed','cancelled'].includes(outcome))return fail(res,400,'Select a valid demo payment option.');
  const previous=db.prepare('SELECT status FROM payment_attempts WHERE user_id=? AND key=?').get(req.user.id,key);
  if(previous&&['failed','cancelled'].includes(previous.status))return fail(res,409,'This payment attempt has ended. Start a new attempt.');
  if(outcome!=='confirmed'){db.prepare('INSERT INTO payment_attempts VALUES (?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET status=excluded.status').run(req.user.id,key,outcome);return res.status(202).json({paymentStatus:outcome,demo:true,message:outcome==='pending'?'Demo payment is pending. No order has been created.':'No charge was made and no order was created.'})}
  try{db.exec('BEGIN IMMEDIATE');const quote=totals(items,coupon,req.user.id);for(const line of quote.lines)db.prepare('UPDATE stock SET quantity=quantity-? WHERE variant=?').run(line.qty,line.variant);const id='JH-'+randomBytes(6).toString('hex').toUpperCase();const data={...quote,id,userId:req.user.id,address:Object.fromEntries(['name','street','city','state','pin'].map(k=>[k,address[k].trim()])),method,paymentStatus:method==='cod'?'cod_due':'paid',status:'confirmed',createdAt:new Date().toISOString(),demo:true};db.prepare('INSERT INTO orders VALUES (?,?,?,?,?)').run(id,req.user.id,key,JSON.stringify(data),Date.now());db.prepare('INSERT INTO payment_attempts VALUES (?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET status=excluded.status').run(req.user.id,key,'confirmed');db.exec('COMMIT');res.status(201).json(data)}catch(e){db.exec('ROLLBACK');fail(res,400,e.message)}
 });
 app.get('/api/orders',requireUser,(req,res)=>res.json(db.prepare('SELECT data FROM orders WHERE user_id=? ORDER BY created DESC').all(req.user.id).map(o=>JSON.parse(o.data))));
 app.get('/api/orders/:id',requireUser,(req,res)=>{const o=db.prepare('SELECT data FROM orders WHERE id=? AND user_id=?').get(req.params.id,req.user.id);if(!o)return fail(res,404,'Order not found.');res.json(JSON.parse(o.data))});
 app.get('/api/returns',requireUser,(req,res)=>res.json(db.prepare('SELECT id,order_id,product_id,status,reason,created FROM returns WHERE user_id=?').all(req.user.id)));
 app.post('/api/returns',requireUser,(req,res)=>{const {orderId,productId,reason}=req.body||{};const row=db.prepare('SELECT data,created FROM orders WHERE id=? AND user_id=?').get(orderId,req.user.id);if(!row)return fail(res,404,'Order not found.');const o=JSON.parse(row.data);const line=o.lines.find(l=>l.id===productId);if(!line||!line.returnable)return fail(res,400,'This item is not eligible for return.');if(Date.now()-row.created>7*86400000)return fail(res,400,'The seven-day demo return window has ended.');if(typeof reason!=='string'||reason.trim().length<5||reason.length>500)return fail(res,400,'Explain the reason in 5–500 characters.');try{const id='RET-'+randomBytes(6).toString('hex');db.prepare('INSERT INTO returns VALUES (?,?,?,?,?,?,?)').run(id,orderId,req.user.id,productId,'requested',reason.trim(),Date.now());res.status(201).json({id,status:'requested',refundStatus:'not_issued',demo:true})}catch(e){if((e.code?.includes('CONSTRAINT')||[1555,2067].includes(e.errcode)))return fail(res,409,'A return request already exists for this item.');throw e}});
 app.post('/api/events',(req,res)=>{const {id,event,data,consent}=req.body||{};const permitted=['page_view','product_view','search','add_to_cart','begin_checkout','purchase','web_vital'];if(consent!==true)return fail(res,400,'Analytics consent is required.');if(typeof id!=='string'||id.length>100||!permitted.includes(event))return fail(res,400,'Invalid analytics event.');const safe={};for(const field of ['productId','count','orderId','value','metric','route'])if(['string','number'].includes(typeof data?.[field]))safe[field]=typeof data[field]==='string'?data[field].slice(0,100):data[field];if(safe.route&&!/^\/(?:collections\/(?:women|men|kids)|product\/\d+|account|checkout|orders\/JH-[A-F0-9]+)?$/.test(safe.route))delete safe.route;if(event==='purchase'){if(!req.user)return fail(res,401,'Confirmed order required.');const o=db.prepare('SELECT data FROM orders WHERE id=? AND user_id=?').get(safe.orderId,req.user.id);if(!o||!['paid','cod_due'].includes(JSON.parse(o.data).paymentStatus))return fail(res,400,'Purchase requires a confirmed order.');safe.value=JSON.parse(o.data).total;}
  db.prepare('INSERT OR IGNORE INTO events VALUES (?,?,?,?)').run(id,event,JSON.stringify(safe),Date.now());res.json({ok:true});
 });
 if(testing)app.get('/api/test/events',(req,res)=>res.json(db.prepare('SELECT id,event,data FROM events').all()));
 const publicUrl=process.env.PUBLIC_URL;
 app.get('/robots.txt',(req,res)=>{res.type('text').send(publicUrl?`User-agent: *\nDisallow: /api/\nDisallow: /account\nDisallow: /checkout\nSitemap: ${publicUrl.replace(/\/$/,'')}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n')});
 app.get('/sitemap.xml',(req,res)=>{if(!publicUrl)return res.status(503).type('text').send('Set PUBLIC_URL to the deployed HTTPS origin before publishing a sitemap.');const origin=new URL(publicUrl);if(origin.protocol!=='https:')return res.status(503).send('PUBLIC_URL must use HTTPS.');res.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin.origin}/</loc></url></urlset>`)});
 app.use('/api',(req,res)=>fail(res,404,'API route not found.'));
 app.use('/server',(req,res)=>res.status(404).send('Not found.'));
 if(existsSync(resolve('dist/index.html'))){
  app.use(express.static(resolve('dist'),{index:false,maxAge:'1d',setHeaders:(res,path)=>{if(path.includes('/assets/'))res.set('Cache-Control','public, max-age=31536000, immutable')}}));
  app.get('/{*path}',async(req,res,next)=>{try{
   let html=readFileSync(resolve('dist/index.html'),'utf8');
   if(existsSync(resolve('dist/server/entry-server.js'))){const {render}=await import('../dist/server/entry-server.js');html=html.replace('<div id="root"></div>','<div id="root">'+render(req.originalUrl)+'</div>');}
   const id=Number(req.path.split('/')[2]);const product=req.path.startsWith('/product/')?catalog.find(p=>p.id===id):null;
   const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   const title=product?product.name+' | Jai Hind Sarees':req.path==='/account'?'Your account | Jai Hind Sarees':req.path==='/checkout'?'Demo checkout | Jai Hind Sarees':req.path.startsWith('/collections/')?req.path.split('/')[2]+' collection | Jai Hind Sarees':null;
   if(title)html=html.replace(/<title>.*?<\/title>/,'<title>'+escapeHtml(title)+'</title>');
   const description=product?product.description:title?title+' — explore the clearly labelled Jai Hind Sarees demo.':'Visit Jai Hind Saree Centre, Shop No 106, Main Bazar, Pimpri, Pune 411017.';
   html=html.replace(/<meta name="description" content="[^"]*"\/?>(?:<\/meta>)?/, '<meta name="description" content="'+escapeHtml(description)+'"/>');
   res.set('Cache-Control','no-store').type('html').send(html);
  }catch(e){next(e)}});
 }
 app.use((err,req,res,next)=>{if(res.headersSent)return next(err);fail(res,err.type==='entity.too.large'?413:400,'The request could not be processed. Check your input and try again.');});
 app.locals.db=db;return app;
}
