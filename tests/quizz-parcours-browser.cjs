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
   const dash=page.locator('#parcours-dashboard');
   assert.equal(await dash.getAttribute('open'),null,'Progress dashboard starts collapsed');
   await page.locator('#parcours-dashboard > summary').click();
   assert.ok(await page.locator('#parcours-dashboard-content').isVisible());
   await page.locator('#parcours-dashboard-themes > summary').click();
   assert.equal(await page.locator('#parcours-dashboard-themes li').count(),22);
   assert.match(await page.locator('#parcours-dashboard-themes [data-item="ouv"]').textContent(),/Disponible/);
   assert.match(await page.locator('#parcours-dashboard-themes [data-item="chelem"]').textContent(),/À découvrir/);
   await page.locator('#parcours-dashboard-axes > summary').click();
   assert.equal(await page.locator('#parcours-dashboard-axes li').count(),3);
   await page.locator('#parcours-dashboard > summary').click();
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
   assert.equal(state.skills.ouv.level,1,'Skipped exercises cannot raise opening mastery');
   assert.equal(state.skills.ouv.clean,0,'Skipped exercises reset proof of mastery');
   assert.ok(Object.keys(state.micros).length>=3,'Micro-skill progress is persisted after session 1');
   assert.ok(Object.values(state.micros).every(x=>x.score<=0),
     'Skipped exercises cannot count as independent mastery');
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
   // Le profil transverse est chargé sans affecter la séance interrompue.
   await page.evaluate(()=>{
     const key='qpjb-sef-parcours-01',progress=JSON.parse(localStorage.getItem(key));
     progress.axes={force:{score:-2,attempts:3,independent:0,lastSession:0,
       lastScoredSession:0,sessionBase:-1,sessionResult:'weak'}};
     localStorage.setItem(key,JSON.stringify(progress));
   });
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-status').waitFor({state:'visible'});
   assert.match(await page.locator('#parcours-status').textContent(),/Évaluation de la force/,
     'An audited weak transversal skill is visible on guided home');
   await page.locator('#parcours-dashboard > summary').click();
   await page.locator('#parcours-dashboard-axes > summary').click();
   assert.match(await page.locator('#parcours-dashboard-axes [data-item="force"]').textContent(),/À retravailler/);
   await page.locator('#parcours-dashboard-themes > summary').click();
   assert.match(await page.locator('#parcours-dashboard-themes [data-item="ouv"]').textContent(),/0 sans aide/);
   assert.match(await page.locator('#parcours-dashboard-themes [data-item="ouv"]').textContent(),/passés/);
   await page.locator('#parcours-dashboard-micros > summary').click();
   assert.equal(await page.locator('#parcours-dashboard-micros li').count(),25);
   assert.equal(await page.locator('#parcours-dashboard-content').evaluate(el=>el.scrollWidth>el.clientWidth+2),false,
     'Dashboard fits mobile and desktop viewports');
   const withAxis=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.deepEqual(withAxis.active.ids,pending.active.ids,
     'Axis status must not modify the saved active session');
   // V1.6 : l'interface ne propose une séance ciblée que sur faiblesse étayée.
   await page.evaluate(()=>{
     const learner=window.QPJBParcours.empty();
     learner.completed=5;
     learner.micros['mineur:1♣']={score:-3,attempts:4,independent:0,lastSession:4,
       lastScoredSession:4,sessionBase:-2,sessionResult:'weak'};
     localStorage.setItem('qpjb-sef-parcours-01',JSON.stringify(learner));
   });
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-consolidation').waitFor({state:'visible'});
   assert.match(await page.locator('#parcours-consolidation-note').textContent(),/Répondre à 1♣/);
   assert.match(await page.locator('#parcours-start').textContent(),/Séance 6/);
   await page.locator('#parcours-consolidation').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
   const targeted=await page.evaluate(()=>{
     const state=JSON.parse(localStorage.getItem('qpjb-sef-parcours-01'));
     const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
     const byId=new Map(all.map(x=>[x.id,x]));
     return {state,keys:state.active.ids.map(id=>window.QPJBParcours.microKey(byId.get(id)))};
   });
   assert.equal(targeted.state.active.mode,'consolidation');
   assert.equal(targeted.state.active.ids.length,10);
   assert.ok(targeted.keys.every(key=>key==='mineur:1♣'));
   assert.match(await page.locator('#parcours-session-banner').textContent(),/Consolidation ciblée/);
   await page.reload({waitUntil:'domcontentloaded'});
   assert.match(await page.locator('#parcours-start').textContent(),/Reprendre ma consolidation/);
   assert.ok(await page.locator('#parcours-consolidation').isHidden(),
     'A targeted session in progress must not be restarted');
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
   assert.deepEqual((await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')))).active.ids,
     targeted.state.active.ids,'Targeted deck survives reload and resumes unchanged');
   for(let i=0;i<10;i++){
     await page.locator('#pass').click();
     if(i<9)await page.waitForFunction(index=>
       document.querySelector('#step')?.textContent.includes((index+2)+' / 10'),i);
     else await page.locator('#repeat').waitFor({state:'visible'});
   }
   assert.match(await page.locator('#body h2').textContent(),/Consolidation terminée/);
   const focusFinished=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(focusFinished.completed,5,'Targeted session cannot unlock normal lessons');
   assert.equal(focusFinished.lastConsolidatedAt,5,'Limited to one targeted session per main-session milestone');
   await page.locator('#done-home').click();
   await page.waitForFunction(()=>!document.body.classList.contains('session-mode'));
   assert.ok(await page.locator('#parcours-consolidation').isHidden(),
     'After finishing, consolidation is held until the next normal session');
   assert.match(await page.locator('#parcours-start').textContent(),/Séance 6/);
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
   assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')))).active.mode,
     undefined,'The regular session remains the normal parcours');

   assert.deepEqual(errors,[],'No browser JS errors');
   console.log('PARCOURS BROWSER '+engine+' PASS: varied openings incl 1♣/1♦, answers in second session, resume after reload, free Quiz preserved');
   await context.close();
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1}).finally(()=>server.close());
