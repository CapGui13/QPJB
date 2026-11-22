'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
const {requestPath,serveQPJBFile}=require('./wave2-ux-http.cjs');
(async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-ux-http-'));
 fs.writeFileSync(path.join(root,'quiz.js'),'window.quizReady=true;');
 fs.writeFileSync(path.join(root,'quiz.css'),'.quiz{display:block}');
 const server=http.createServer((req,res)=>{
  const pathname=requestPath(req,res);
  if(pathname!==null)serveQPJBFile(res,root,pathname);
 });
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  const addr='http://127.0.0.1:'+server.address().port;
  const get=pathname=>new Promise((resolve,reject)=>{
   http.get(addr+pathname,res=>{
    const chunks=[];res.on('data',chunk=>chunks.push(chunk));
    res.on('end',()=>resolve({status:res.statusCode,
     mime:res.headers['content-type'],body:Buffer.concat(chunks).toString('utf8')}));
   }).on('error',reject);
  });
  const js=await get('/QPJB/quiz.js?version=1');
  assert.equal(js.status,200);assert.match(js.mime,/javascript/);
  assert.equal(js.body,'window.quizReady=true;');
  const css=await get('/QPJB/quiz.css');
  assert.equal(css.status,200);assert.match(css.mime,/text\/css/);
  assert.equal((await get('/QPJB/missing.css')).status,404);
  assert.equal((await get('/outside.js')).status,404);
  assert.equal((await get('/QPJB/%2e%2e/quiz.js')).status,404);
  assert.equal((await get('/QPJB/%E0%A4%A')).status,400);
  const response={status:null,writeHead(status){this.status=status},end(){}};
  serveQPJBFile(response,root,'/QPJB/../outside.js');
  assert.equal(response.status,403,'Une traversée directe doit être interdite');
  console.log('PASS serveur M3 : JS/CSS 200, absence 404, entrée malformée 400, traversal 403');
 }finally{
  await new Promise(resolve=>server.close(resolve));
  fs.rmSync(root,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
