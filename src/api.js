let csrf='';
export async function api(path,options={}){
 const {method='GET',body,signal}=options;
 let response;try{response=await fetch('/api'+path,{method,credentials:'same-origin',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000),headers:{'Content-Type':'application/json',...(method!=='GET'?{'X-CSRF-Token':csrf}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})})}catch(error){if(error.name==='TimeoutError')throw Error('The request took too long. Check your connection and try again.');throw error}
 let data;try{data=await response.json()}catch{throw Error('The server returned an unexpected response. Please try again.')}
 if(!response.ok){const error=new Error(data.error||'Request failed. Please try again.');error.status=response.status;throw error}
 if(data.csrf)csrf=data.csrf;return data;
}
export function readStorage(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v===null?fallback:v}catch{return fallback}}
export function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
export const money=p=>'₹'+(p/100).toLocaleString('en-IN',{maximumFractionDigits:2});
