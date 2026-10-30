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
     const active=(await caches.keys()).find(k=>k.startsWith('qpjb-v'));
     const cache=await caches.open(active||'qpjb-empty');
     const stored=(await cache.keys()).map(req=>req.url);
     const assets=await Promise.all(Array.from({length:23},(_,i)=>
        cache.match('/QPJB/entrainement/assets/JC-'+String(i+1).padStart(3,'0')+'.webp')));
     return {
       images:assets.filter(Boolean).length,
       training:!!(await cache.match('/QPJB/entrainement/')),
       data:stored.some(url=>url.includes('/QPJB/entrainement/training-data-bootstrap.js?v=')),
       bidding:stored.some(url=>url.includes('/QPJB/entrainement/training-data-bidding.js?v=')),
       play:stored.some(url=>url.includes('/QPJB/entrainement/training-data-play.js?v=')),
       app:stored.some(url=>url.includes('/QPJB/entrainement/training-app.js?v='))
     };
   });
   assert.deepEqual(before,{images:23,training:true,data:true,bidding:true,play:true,app:true},
     'Full training shell and all 23 original WebP images must already be cached');
   await context.setOffline(true);
   // Repartir de l'accueil hors ligne, puis charger la vraie iframe d'entraînement.
   await page.reload({waitUntil:'domcontentloaded',timeout:20000});
   await page.locator('.training-button[data-training-mode="play"]').click({timeout:20000});
   const frame=page.frameLocator('#training-frame');
   await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:20000});
   const embeddedPage=page.frames().find(f=>f.url().includes('qp-training-corrige.html'));
   assert.ok(embeddedPage,'Offline mode restores the embedded training page');
   await embeddedPage.evaluate(()=>playTopic('plan-libre'));
   await frame.locator('.item').first().waitFor({state:'visible',timeout:12000});
   await embeddedPage.evaluate(()=>item('JC-001'));
   await frame.locator('.play-free-panel').waitFor({state:'visible',timeout:12000});
   // La source n'est plus affichée dans le QCM, mais son WebP reste dans le cache.
   const originalLoaded=await embeddedPage.evaluate(()=>new Promise(resolve=>{
     const image=new Image();
     image.onload=()=>resolve(image.naturalWidth>0);
     image.onerror=()=>resolve(false);
     image.src='/QPJB/entrainement/assets/JC-001.webp';
   }));
   assert.equal(originalLoaded,true,'A previously unopened source image remains usable offline');
   assert.equal(errors.length,0,'No uncaught offline JavaScript exceptions: '+errors.join('; '));
   console.log(JSON.stringify({result:'PASS',browser:name,offline:true,precacheImages:before.images,firstOpenImage:'JC-001'}));
   await context.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
