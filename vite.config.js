import {defineConfig} from 'vite';
export default defineConfig({server:{host:'0.0.0.0',port:3000,proxy:{'/api':'http://127.0.0.1:3001','/robots.txt':'http://127.0.0.1:3001','/sitemap.xml':'http://127.0.0.1:3001'}},build:{sourcemap:false}});
