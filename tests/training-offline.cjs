'use strict';
// End-to-end offline test, launched after the ordinary training browser scenario.
// A user must be able to open an exercise and its original image for the
// first time offline, after the application was installed online.
const {chromium,webkit,devices}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}
 try{
   if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
   fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 const name=process.env.PW_BROWSER||'chromium';
 const browser=await ({chromium,webkit})[name].launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
   const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR',serviceWorkers:'allow'});
   const page=await context.newPage();
   let errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8766/QPJB/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!navigator.serviceWorker?.controller,null,{timeout:35000});
   const before=await page.evaluate(async()=>{
     const cache=await caches.open('qpjb-v19');
     const assets=await Promise.all(Array.from({length:23},(_,i)=>
        cache.match('/QPJB/entrainement/assets/JC-'+String(i+1).padStart(3,'0')+'.webp')));
     return {
       images:assets.filter(Boolean).length,
       training:!!(await cache.match('/QPJB/entrainement/')),
       data:!!(await cache.match('/QPJB/entrainement/training-data.js?v=20261029p')),
       app:!!(await cache.match('/QPJB/entrainement/training-app.js?v=20261030n'))
     };
   });
   assert.deepEqual(before,{images:23,training:true,data:true,app:true},
     'Full training shell and all 23 original WebP images must already be cached');
   await context.setOffline(true);
   // The mode/rev URL has never been opened online; fallback to the precached index.
   await page.goto('http://127.0.0.1:8766/QPJB/entrainement/?embedded=1&rev=20261030n&mode=play',
     {waitUntil:'domcontentloaded',timeout:20000});
   await page.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:12000});
   await page.evaluate(()=>{playTopic('plan-libre');item('JC-001')});
   await page.locator('.play-source summary').click();
   await page.waitForFunction(()=>{
     const image=document.querySelector('.play-source .game-img');
     return !!image&&image.complete&&image.naturalWidth>0;
   },null,{timeout:12000});
   assert.ok((await page.locator('.play-source .game-img').getAttribute('src')).endsWith('/JC-001.webp'),
     'Image of a previously unopened exercise is displayed offline');
   assert.equal(errors.length,0,'No uncaught offline JavaScript exceptions: '+errors.join('; '));
   console.log(JSON.stringify({result:'PASS',browser:name,offline:true,precacheImages:before.images,firstOpenImage:'JC-001'}));
   await context.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
