'use strict';
/* Test réel du parcours intégré, sur une page QPJB servie localement. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.PW_BROWSER||'chromium';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!p.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
  let file=path.resolve(root,p.slice('/QPJB/'.length));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  try{
    if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  }catch(_){res.writeHead(404);res.end()}
});
(async()=>{
 assert.ok(['chromium','webkit'].includes(engine));
 await new Promise(resolve=>server.listen(8801,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[engine].launch({headless:true,
   args:engine==='chromium'?['--no-sandbox']:[]});
 try{
   const context=await browser.newContext(engine==='webkit'?
     {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
     {viewport:{width:1365,height:768},locale:'fr-FR',reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8801/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   assert.match(await page.locator('#parcours-status').textContent(),/Séances terminées : 0/);
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
   let state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(state.active.ids.length,10);
   const themeMap=await page.evaluate(()=>{
     const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
     return Object.fromEntries(all.map(x=>[x.id,x.theme]));
   });
   assert.ok(state.active.ids.every(id=>themeMap[id]==='ouv'),'First session opens only');
   const openingBids=await page.evaluate(ids=>{
     const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
     const byId=new Map(all.map(x=>[x.id,x.answer]));
     return ids.map(id=>byId.get(id));
   },state.active.ids);
   const bidCount=openingBids.reduce((acc,bid)=>(acc[bid]=(acc[bid]||0)+1,acc),{});
   assert.ok((bidCount['1♣']||0)>=2&&(bidCount['1♦']||0)>=2,
     'Minor openings expected in first session: '+JSON.stringify(bidCount));
   assert.ok(Object.values(bidCount).every(n=>n<=2),
     'No repeated Passe / 1SA openings: '+JSON.stringify(bidCount));
   assert.ok(await page.locator('#restart-session').isHidden(),'Classic restart must not reset a guided deck');
   for(let i=0;i<10;i++){
     await page.locator('#pass').click();
     if(i<9)await page.waitForFunction(index=>document.querySelector('#step')?.textContent.includes((index+2)+' / 10'),i);
     else await page.locator('#repeat').waitFor({state:'visible'});
   }
   state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(state.completed,1);
   assert.equal(state.active,null);
   await page.locator('#repeat').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session')&&
     document.querySelector('#step')?.textContent.includes('1 / 10'));
   state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   const secondTopics=state.active.ids.map(id=>themeMap[id]);
   assert.ok(secondTopics.includes('majeur')&&secondTopics.includes('mineur'),
     'Second session mixes opening responses: '+secondTopics.join(','));
   const responseOpeners=await page.evaluate(ids=>{
     const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
     const byId=new Map(all.map(x=>[x.id,x]));
     return ids.map(id=>byId.get(id))
       .filter(x=>x.theme==='mineur'||x.theme==='majeur')
       .map(x=>({theme:x.theme,opening:String(x.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1]}));
   },state.active.ids);
   for(const [theme,expected] of [['mineur',['1♣','1♦']],['majeur',['1♥','1♠']]]){
     const got=responseOpeners.filter(x=>x.theme===theme).map(x=>x.opening);
     assert.ok(expected.every(x=>got.includes(x)),theme+' opening mix '+got);
   }
   await page.locator('#pass').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   const pending=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(pending.active.index,1);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   assert.match(await page.locator('#parcours-start').textContent(),/Reprendre/);
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.deepEqual(state.active.ids,pending.active.ids,'Resume same guided session and deck');
   await page.locator('#back-home').click();
   await page.locator('#new').waitFor({state:'visible'});
   await page.locator('#new').click();
   await page.waitForFunction(()=>document.body.classList.contains('session-mode')&&
      !document.body.classList.contains('parcours-session'));
   state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.deepEqual(state.active.ids,pending.active.ids,'Classic Quiz does not erase guided progress');
   assert.deepEqual(errors,[],'No browser JS errors');
   console.log('PARCOURS BROWSER '+engine+' PASS: varied openings incl 1♣/1♦, answers in second session, resume after reload, free Quiz preserved');
   await context.close();
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1}).finally(()=>server.close());
