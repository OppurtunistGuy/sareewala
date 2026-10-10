import {createApp} from './app.js';
const port=Number(process.env.PORT||3001);const app=createApp();
const server=app.listen(port,'0.0.0.0',()=>console.log(`Jai Hind Sarees demo API listening on port ${port}. No real payments or live orders.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{app.locals.db.close();process.exit(0)}));
