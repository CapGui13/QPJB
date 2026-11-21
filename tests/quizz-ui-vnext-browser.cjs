'use strict';
/* Mission 3 — recette Chromium/WebKit et captures avant/après réelles.
 * Exécution : node tests/quizz-ui-vnext-browser.cjs
 * Option : PW_BROWSER=webkit (ou chromium), PW_ARTIFACT_DIR=/chemin/captures
 * Pour les vues « avant », récupère le commit de référence si nécessaire.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const BASE='1736c99561dd83b0d9e279747066f32274ec8771';
const artifactDir=process.env.PW_ARTIFACT_DIR||path.join(root,'artifacts','quizz-ui-vnext');
fs.mkdirSync(artifactDir,{recursive:true});
let baseline=null;
try{
 baseline=execFileSync('git',['show',BASE+':quizz.html'],{
  cwd:root,encoding:'utf8',maxBuffer:8*1024*1024,stdio:['ignore','pipe','ignore']
 });
}catch(_){
 try{
  execFileSync('git',['fetch','--no-tags','--depth=1','origin',BASE],{
   cwd:root,stdio:['ignore','ignore','ignore'],timeout:60000
  });
  baseline=execFileSync('git',['show',BASE+':quizz.html'],{
   cwd:root,encoding:'utf8',maxBuffer:8*1024*1024,stdio:['ignore','pipe','ignore']
  });
 }catch(err){
  throw new Error('Capture AVANT impossible : récupérer le commit '+BASE+' dans ce checkout', {cause:err});
 }
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml',
 '.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
 const route=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 if(!route.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 if(route==='/QPJB/quizz-before.html'){
  if(!baseline){res.writeHead(404);res.end();return}
  res.writeHead(200,{'content-type':mime['.html'],'cache-control':'no-store'});
  res.end(baseline);return;
 }
 let file=path.resolve(root,route.slice('/QPJB/'.length));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream',
   'cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(_){res.writeHead(404);res.end()}
});
const errors=[];
function shotName(engine,device,version,stage){
 return path.join(artifactDir,[engine,device,version,stage].join('-')+'.png');
}
async function scenario(browser,engine,device,version,url){
 const mobile=device==='mobile';
 const context=await browser.newContext(mobile?
  {...devices['iPhone 12'],viewport:{width:390,height:844},locale:'fr-FR',
   reducedMotion:'reduce',serviceWorkers:'block'}:
  {viewport:{width:1280,height:900},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 // Stabilise le tirage aléatoire : captures comparables sur la même séance.
 await context.addInitScript(()=>{Math.random=()=>0.42});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(version+'/'+engine+'/'+device+': '+e.message));
 try{
  await page.goto(url+(version==='before'?'quizz-before.html':'quizz.html'),{
   waitUntil:'domcontentloaded'
  });
  await page.locator('#parcours-start').waitFor({state:'visible'});
  await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.body.classList.contains('parcours-session'));
  if(version==='after'){
   assert.equal(await page.locator('#question-heading').count(),1,'Question identifiable');
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading',
    'Focus guidé à l’arrivée dans la question');
   assert.match(await page.locator('#back-home').textContent(),/Suspendre ma séance/);
  }
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answers button').count(),4,'Les quatre propositions sont présentes');
  if(version==='after'){
   assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-choice')),'0',
    'La première proposition prend le focus après révélation');
   const sizes=await page.locator('#answers button').evaluateAll(buttons=>
    buttons.map(b=>({height:b.getBoundingClientRect().height,
     label:b.getAttribute('aria-label'),counter:getComputedStyle(b,'::before').content})));
   assert.ok(sizes.every(s=>s.height>=60),'Cibles tactiles >= 60px sur 390px ou bureau');
   assert.ok(sizes.every((s,i)=>s.label?.startsWith('Proposition '+(i+1)+' : ')),
    'Les propositions sont annoncées avec leur numéro');
   assert.ok(sizes.every(s=>s.counter.includes('qpjb-answer')),
    'Le compteur CSS des numéros de choix est bien présent');
   assert.equal(await page.locator('#answers').getAttribute('role'),'group');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=
    document.documentElement.clientWidth+2),true,'Pas de débordement horizontal');
  }
  await page.screenshot({path:shotName(engine,device,version,'propositions'),fullPage:true});
  if(version==='after')await page.keyboard.press('Enter');
  else await page.locator('#answers button').first().click();
  await page.locator(version==='after'?'#answer-feedback':'.feedback').waitFor({state:'visible'});
  if(version==='after'){
   await page.waitForFunction(()=>document.activeElement?.id==='answer-feedback');
   assert.equal(await page.locator('.feedback-heading').textContent(),'Explication');
   assert.ok((await page.locator('.feedback-explanation').textContent()).length>10,
    'Correction complète et distincte du verdict');
  }
  await page.screenshot({path:shotName(engine,device,version,'correction'),fullPage:true});
  if(version==='before')return;
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading',
   'Focus sur la question suivante');
  await page.locator('#previous').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('1 / 10'));
  assert.ok(await page.locator('#answer-feedback').isVisible(),
   'La correction reste visible en revenant à une question traitée');
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  const checkpoint=await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
  const checkpointState=JSON.parse(checkpoint);
  assert.equal(checkpointState.active.index,1);
  await page.locator('#back-home').click();
  await page.locator('#parcours-start').waitFor({state:'visible'});
  assert.match(await page.locator('#parcours-start').textContent(),/Reprendre/);
  assert.ok(await page.locator('#parcours-resume-help').isVisible(),
   'Reprise et sauvegarde explicitées sans recréer de stockage');
  assert.ok(await page.locator('#parcours-recommendations').isVisible(),
   'Les conseils V1 apparaissent à la reprise et sont calculés sans nouveau stockage');
  assert.match(await page.locator('#parcours-recommendations-list').textContent(),/Reprendre la séance/,
   'La recommandation de reprise se fonde sur la séance V1 réellement interrompue');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01')),
   checkpoint,'Suspendre n’altère pas la sauvegarde');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.match(await page.locator('#parcours-start').textContent(),/Reprendre/);
  assert.ok(await page.locator('#parcours-resume-help').isVisible());
  await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  const resumed=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
  assert.deepEqual(resumed.active.ids,checkpointState.active.ids,'Tirage conservé après rechargement');
  assert.equal(resumed.active.index,1,'Position conservée');
  for(let i=1;i<10;i++){
   await page.locator('#pass').click();
   if(i<9)await page.waitForFunction(n=>
    document.querySelector('#step')?.textContent.includes((n+2)+' / 10'),i);
  }
  await page.locator('#session-summary-title').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'session-summary-title',
   'Focus du clavier sur le bilan');
  const totals=await page.locator('.session-summary-stats dd').allTextContents();
  assert.equal(totals.length,3,'Bilan du parcours : trois indicateurs existants');
  assert.equal(totals.map(Number).reduce((a,b)=>a+b,0),10,
   'Bilan cohérent avec les dix situations traitées');
  assert.equal(await page.locator('[data-difficulty-feedback]').count(),3,
   'Le choix du ressenti pédagogique reste présent');
  await page.screenshot({path:shotName(engine,device,version,'bilan'),fullPage:true});
  const finished=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));
  assert.equal(finished.completed,1);
  assert.equal(finished.active,null);
  console.log('QUIZZ UI VNEXT '+engine+'/'+device+' : navigation, réponses, reprise, clavier, bilan OK');
 }finally{await context.close()}
}
(async()=>{
 const selected=process.env.PW_BROWSER;
 const engines=selected?[selected]:['chromium','webkit'];
 assert.ok(engines.every(e=>e==='chromium'||e==='webkit'));
 await new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
 });
 const url='http://127.0.0.1:'+server.address().port+'/QPJB/';
 try{
  for(const engine of engines){
   const browser=await ({chromium,webkit})[engine].launch({headless:true,
    args:engine==='chromium'?['--no-sandbox']:[]});
   try{
    for(const device of ['desktop','mobile']){
     if(baseline)await scenario(browser,engine,device,'before',url);
     await scenario(browser,engine,device,'after',url);
    }
   }finally{await browser.close()}
  }
  assert.deepEqual(errors,[],'Aucune exception JavaScript');
  console.log('QUIZZ UI VNEXT BROWSER OK — captures : '+artifactDir);
 }finally{await new Promise(resolve=>server.close(resolve))}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
