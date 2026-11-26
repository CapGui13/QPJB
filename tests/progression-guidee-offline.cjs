#!/usr/bin/env node
'use strict';
// Candidate-only, against the public directory built from the same checkout.
// No network or publication; the worker really serves the cached first Quiz visit.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(process.argv[2]||'_public_site'),engine=process.env.PW_BROWSER||'chromium';
assert(['chromium','webkit'].includes(engine));assert(fs.existsSync(path.join(root,'quizz-prerequis.js')),'Module not in public build');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
let networkRequests=0,offline=false;
const server=http.createServer((req,res)=>{
 if(offline){networkRequests++;res.writeHead(503);return res.end('offline')}
 const url=new URL(req.url,'http://localhost'),prefix='/QPJB/';
 if(!url.pathname.startsWith(prefix)){res.writeHead(404);return res.end()}
 let file=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length)));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/QPJB/';
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{
  const context=await browser.newContext(engine==='webkit'?{...devices['iPhone 12'],serviceWorkers:'allow'}:{serviceWorkers:'allow'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Warm solely from the public home: never visit Quiz online before this test.
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{await navigator.serviceWorker.register('/QPJB/service-worker.js');await navigator.serviceWorker.ready});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:35000});
  const warm=await page.evaluate(()=>new Promise(resolve=>{
   const channel=new MessageChannel();channel.port1.onmessage=e=>resolve(e.data);
   navigator.serviceWorker.controller.postMessage({type:'QPJB_PREFETCH_OFFLINE'},[channel.port2]);
  }));
  assert.deepEqual(warm,{type:'QPJB_OFFLINE_READY',ok:true});
  const cached=await page.evaluate(async()=>{
   const keys=(await Promise.all((await caches.keys()).map(async k=>(await (await caches.open(k)).keys()).map(r=>r.url)))).flat();
   return ['/QPJB/quizz-prerequis.js?v=3','/QPJB/quizz-pedagogie-initiation.js?v=1','/QPJB/quizz-pedagogie-intermediaire.js?v=1','/QPJB/quizz-pedagogie-avancee.js?v=1','/QPJB/quizz-session-plan.js?v=2','/QPJB/quizz-parcours.js?v=17','/QPJB/quizz-apprentissage-concepts.js?v=1','/QPJB/quizz-diagnostic-erreurs.js?v=1','/QPJB/quizz-remediation.js?v=1','/QPJB/quizz-professeur.js?v=1','/QPJB/qpjb-bridge-ui.css?v=20261113e']
    .every(required=>keys.some(x=>new URL(x).pathname+new URL(x).search===required));
  });
  assert(cached,'Prerequisite module or Quiz CSS was not warmed by the service worker');
  // Server is also forced to refuse network, for browsers whose offline
  // emulation is incomplete. Cached worker responses must be sufficient.
  offline=true;await context.setOffline(true);
  await page.goto(url+'quizz.html',{waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').waitFor({state:'visible'});
  assert(await page.evaluate(()=>window.QPJBPrerequis?.schema==='QPJB_PREREQUIS_V1'&&window.QPJBSessionPlan?.schema==='QPJB_SESSION_PLAN_V1'&&window.QPJBSessionPlan.pedagogyReady&&window.QPJBPedagogieInitiation?.schema==='QPJB_PEDAGOGIE_V1'&&window.QPJBPedagogieIntermediaire?.schema==='QPJB_PEDAGOGIE_V1'&&window.QPJBPedagogieAvancee?.schema==='QPJB_PEDAGOGIE_V1'&&typeof window.QPJBParcours?.adaptiveDiagnostics==='function'));
  await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
  await page.locator('#pass').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
  assert.deepEqual(after.active,before.active);assert.deepEqual(errors,[]);
  console.log('PASS M3 offline '+engine+': public builder, first-ever offline Quiz, prerequisite module cached, exact resume; refused network='+networkRequests);
  await context.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>server.close());
