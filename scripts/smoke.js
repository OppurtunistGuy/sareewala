const origin=process.env.SITE_URL||'http://127.0.0.1:3000';
for(const path of ['/','/product/1','/collections/women','/account','/api/health','/api/products','/favicon.svg','/images/rose-480.webp']){
 const response=await fetch(origin+path);if(!response.ok)throw Error(path+' failed: '+response.status);
 if(path==='/api/health'&&!(await response.json()).ok)throw Error('Health check failed.');
 console.log('PASS',path);
}
if(origin.startsWith('https://')){const r=await fetch(origin+'/');if(!r.headers.get('strict-transport-security'))throw Error('Missing HSTS on production origin.')}
console.log('Smoke check passed. This does not confirm live payments or merchant data.');
