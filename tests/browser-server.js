import {createApp} from '../server/app.js';
const app=createApp({dbPath:':memory:',testing:true});
app.locals.db.exec('UPDATE stock SET quantity=200 WHERE quantity>0');
const server=app.listen(4173,'127.0.0.1',()=>console.log('Isolated browser test server ready'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{app.locals.db.close();process.exit(0)}));
