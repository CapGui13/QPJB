'use strict';
// Native browser performance probe on the exact built public site.
// No external requests and no real student data.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const engine=process.env.PW_BROWSER||'chromium',root=path.resolve(process.argv[2]||'_public_site');
assert(['chromium','webkit'].includes(engine));assert(fs.existsSync(path.join(root,'quizz.html')));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/QPJB/'))throw Error('path');
  let file=path.resolve(root,decodeURIComponent(url.pathname.slice(6)));
  if(file!==root&&!file.startsWith(root+path.sep))throw Error('path');
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile())throw Error('path');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch(e){res.writeHead(404);res.end('Not found')}
});
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port,url=origin+'/QPJB/quizz.html';
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 const rows=[];
 try{
 for(const width of [390,1280])for(let repetition=1;repetition<=3;repetition++){
  const context=await browser.newContext({viewport:{width,height:800},serviceWorkers:'block',reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
   page.on('pageerror',e=>errors.push(e.message));
   const cdp=engine==='chromium'?await context.newCDPSession(page):null;
   if(cdp)await cdp.send('Performance.enable');
   const metrics=async()=>cdp?Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(v=>[v.name,v.value])):null;
   const before=await metrics();
   await page.goto(url,{waitUntil:'load',timeout:45000});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   const loaded=await metrics();
   const values=await page.evaluate(()=>{
    const nav=performance.getEntriesByType('navigation')[0];
    const resources=performance.getEntriesByType('resource').filter(r=>new URL(r.name).origin===location.origin);
    const begin=performance.now(),data=JSON.parse(document.querySelector('#training-data').textContent).exercises,parseMs=performance.now()-begin;
    if(typeof QPJBParcours?.start!=='function')throw Error('Missing production engine');
    const timings=[];let size=0;
    for(let i=0;i<12;i++){
     const start=performance.now(),state=QPJBParcours.empty(),deck=QPJBParcours.start(state,data);
     timings.push(performance.now()-start);size=deck.length;
     if(new Set(deck.map(q=>q.id)).size!==size||new Set(deck.map(q=>q.caseFamily||q.id)).size!==size)throw Error('Duplicate');
    }
    timings.sort((a,b)=>a-b);
    return {domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd,htmlDecodedBytes:nav.decodedBodySize,
      localResourceDecodedBytes:resources.reduce((n,r)=>n+r.decodedBodySize,0),localResourceTransferBytes:resources.reduce((n,r)=>n+r.transferSize,0),
      resourceCount:resources.length,parseMs,selectionP50:timings[6],selectionP95:timings[11],deckSize:size,catalogue:data.length,
      browserHeapBytes:performance.memory?.usedJSHeapSize??null};
   });
   const after=await metrics();
   assert.equal(values.deckSize,10);assert.equal(await page.locator('#answer-feedback').count(),0);
   assert.deepEqual(errors,[]);
   rows.push({width,repetition,...values,cdp:cdp?{
    heapBefore:before.JSHeapUsedSize??null,heapLoaded:loaded.JSHeapUsedSize??null,heapAfter:after.JSHeapUsedSize??null,
    loadScriptMs:1000*((loaded.ScriptDuration||0)-(before.ScriptDuration||0)),
    loadTaskMs:1000*((loaded.TaskDuration||0)-(before.TaskDuration||0)),
    selectionScriptMs:1000*((after.ScriptDuration||0)-(loaded.ScriptDuration||0)),
    selectionTaskMs:1000*((after.TaskDuration||0)-(loaded.TaskDuration||0))}:null});
  }finally{await context.close()}
 }
 console.log(JSON.stringify({engine,version:browser.version(),root,rows,limitations:'Cold contexts; unthrottled loopback; WebKit CDP metrics unavailable; browser heap is not whole-process RSS.'},null,2));
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>server.close());
