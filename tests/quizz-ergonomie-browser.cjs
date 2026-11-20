'use strict';
/* Recette réelle Chromium + WebKit : aucune écriture réseau ou publication. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
function server(){
 return http.createServer((req,res)=>{
   let file;
   try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname))}
   catch(_){res.writeHead(400).end();return}
   if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
   if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
   const mime=file.endsWith('.html')?'text/html; charset=utf-8':
     file.endsWith('.js')?'application/javascript; charset=utf-8':
     file.endsWith('.css')?'text/css; charset=utf-8':'application/octet-stream';
   res.writeHead(200,{'content-type':mime,'cache-control':'no-store'});
   fs.createReadStream(file).pipe(res);
 });
}
async function check(engine,mobile,url){
 const browser=await ({chromium,webkit})[engine].launch({headless:true,
   args:engine==='chromium'?['--no-sandbox']:[]});
 try{
   const ctx=await browser.newContext(mobile?
     {...devices['iPhone 12'],locale:'fr-FR',acceptDownloads:true,reducedMotion:'reduce',serviceWorkers:'block'}:
     {viewport:{width:1350,height:900},locale:'fr-FR',acceptDownloads:true,reducedMotion:'reduce',serviceWorkers:'block'});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url+'quizz.html',{waitUntil:'domcontentloaded'});
   await page.locator('#progress-export').waitFor();
   assert.ok(await page.locator('#progress-import').isVisible(),'Restauration V1 visible');
   assert.equal(await page.locator('#parcours-dashboard').count(),1);
   assert.equal(await page.locator('.notice').count(),0);
   assert.equal(await page.locator('#parcours-dashboard-content > .parcours-dashboard-note').count(),0);
   assert.ok(!(await page.content()).includes('100 % algorithmique, sans IA'));
   const lesson=await page.evaluate(()=>{
     const P=window.QPJBParcours,state=P.empty();
     state.completed=13;
     state.entries['EXAMPLE']={result:'correct',assisted:false,
       lastSession:12,due:21,seen:3,streak:3,family:'family-example'};
     state.skills.ouv={level:2,clean:2,errors:0,lastCleanSession:12};
     localStorage.setItem('qpjb-sef-parcours-01',JSON.stringify(state));
     localStorage.setItem('qpjb-sef-entrainement-01',JSON.stringify({
       EXAMPLE:{attempts:3,correct:3,history:[{at:'2026-11-20T10:00:00Z',result:'correct'}]}
     }));
     return state;
   });
   await page.reload({waitUntil:'domcontentloaded'});
   const downloadPromise=page.waitForEvent('download');
   await page.locator('#progress-export').click();
   const download=await downloadPromise;
   const json=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
   assert.equal(json.format,'QPJB_PROGRESS_EXPORT_1');
   assert.equal(json.summary.completedSessions,13);
   assert.equal(json.summary.recordedDetailedSessions,0);
   assert.equal(json.limitations.historicalSessionsWithoutDetailedAnswers,13);
   assert.equal(json.quizQuestionHistory.EXAMPLE.attempts,3);
   assert.equal(json.algorithmState.entries.EXAMPLE.streak,3);
   assert.equal(json.sessions.length,0,'Ne pas inventer 13 listes de réponses');
   const prior=await page.evaluate(()=>({
     guided:localStorage.getItem('qpjb-sef-parcours-01'),
     quiz:localStorage.getItem('qpjb-sef-entrainement-01')
   }));
   await page.locator('#new').click();
   await page.waitForFunction(()=>document.body.classList.contains('session-mode')&&
     !document.body.classList.contains('parcours-session'));
   const after=await page.evaluate(()=>({
     guided:localStorage.getItem('qpjb-sef-parcours-01'),
     quiz:localStorage.getItem('qpjb-sef-entrainement-01')
   }));
   assert.deepEqual(after,prior,'Nouvelle séance progressive ne supprime aucune progression');
   await page.locator('#back-home').click();
   await page.locator('#parcours-start').waitFor({state:'visible'});
   // Nouvelle progression de test, isolée dans le navigateur de recette.
   await page.evaluate(()=>localStorage.setItem('qpjb-sef-parcours-01',
     JSON.stringify(window.QPJBParcours.empty())));
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
   for(let i=0;i<10;i++){
     await page.locator('#pass').click();
     if(i<9)await page.waitForFunction(n=>
       document.querySelector('#step')?.textContent.includes((n+2)+' / 10'),i);
     else await page.locator('[data-difficulty-feedback="increase"]').waitFor({state:'visible'});
   }
   const finished=await page.evaluate(()=>
     JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(finished.completed,1);
   assert.equal(finished.journal.length,1);
   assert.equal(finished.journal[0].answers.length,10);
   assert.equal(finished.difficultyAdjustment,0);
   assert.equal(await page.locator('[data-difficulty-feedback]').count(),3);
   await page.locator('[data-difficulty-feedback="increase"]').click();
   await page.waitForFunction(()=>document.body.classList.contains('parcours-session')&&
     document.querySelector('#step')?.textContent.includes('1 / 10'));
   const active=await page.evaluate(()=>
     JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.equal(active.completed,1);
   assert.equal(active.journal.length,1,'La séance terminée est conservée');
   assert.equal(active.difficultyAdjustment,1);
   assert.equal(active.difficultyFeedback.length,1);
   assert.equal(active.skills.ouv.level,finished.skills.ouv.level,
     'Le ressenti ne remplace pas la maîtrise mesurée');
   assert.equal(active.active.ids.length,10);
   await page.locator('#back-home').click();
   await page.locator('#progress-export').waitFor({state:'visible'});
   const d2=page.waitForEvent('download');
   await page.locator('#progress-export').click();
   const saved=JSON.parse(fs.readFileSync(await (await d2).path(),'utf8'));
   assert.equal(saved.summary.recordedDetailedSessions,1);
   assert.equal(saved.sessions[0].answers.length,10);
   assert.equal(saved.summary.difficultyAdjustment,1);
   assert.equal(saved.currentSession.ids.length,10);
   // Import invalide : aucun remplacement de la progression de l'élève.
   const preceding=await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
   const invalid=JSON.parse(JSON.stringify(saved));
   invalid.algorithmState.entries['INCONNU']={result:'correct',lastSession:0};
   await page.locator('#progress-import-file').setInputFiles({
     name:'invalide.json',mimeType:'application/json',
     buffer:Buffer.from(JSON.stringify(invalid),'utf8')
   });
   assert.match(await page.locator('#progress-export-status').textContent(),/Restauration refusée/);
   assert.equal(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01')),preceding);
   // Confirmation explicitement annulée : ne rien effacer.
   page.once('dialog',dialog=>dialog.dismiss());
   await page.locator('#progress-import-file').setInputFiles({
     name:'annulation.json',mimeType:'application/json',
     buffer:Buffer.from(JSON.stringify(saved),'utf8')
   });
   assert.equal(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01')),preceding);
   // Restaurer une séance commencée après une réinitialisation volontaire de recette.
   await page.evaluate(()=>localStorage.setItem('qpjb-sef-parcours-01',
     JSON.stringify(window.QPJBParcours.empty())));
   await page.reload({waitUntil:'domcontentloaded'});
   page.once('dialog',dialog=>dialog.accept());
   await page.locator('#progress-import-file').setInputFiles({
     name:'sauvegarde.json',mimeType:'application/json',
     buffer:Buffer.from(JSON.stringify(saved),'utf8')
   });
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01'))?.completed===1);
   await page.reload({waitUntil:'domcontentloaded'});
   const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
   assert.deepEqual(final.active.ids,active.active.ids,'Sauvegarde de séance reprise');
   assert.deepEqual(final.journal,active.journal,'Journal conservé au rechargement');
   assert.deepEqual(errors,[],'Aucune erreur JS');
   const size=await page.evaluate(()=>({
     scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth
   }));
   assert.ok(size.scroll<=size.width+2,'Pas de débordement horizontal');
   console.log('QPJB ERGONOMIE BROWSER PASS '+engine+'/'+(mobile?'mobile':'desktop'));
   await ctx.close();
 }finally{await browser.close()}
}
(async()=>{
 const srv=server();
 await new Promise((resolve,reject)=>{
   srv.once('error',reject);srv.listen(0,'127.0.0.1',resolve);
 });
 try{
   const url='http://127.0.0.1:'+srv.address().port+'/';
   await check('chromium',false,url);
   await check('webkit',true,url);
 }finally{await new Promise(resolve=>srv.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});