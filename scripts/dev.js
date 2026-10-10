import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['--watch','server/index.js'],{stdio:'inherit'}),spawn(process.execPath,['node_modules/vite/bin/vite.js'],{stdio:'inherit'})];
let stopping=false;const stop=()=>{if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM')};
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,stop);
for(const child of children)child.on('exit',code=>{stop();if(code)process.exitCode=code});
