'use strict';
// Recette visible M4 / Chromium + WebKit ; données fictives de test, jamais publiées.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit}=require('playwright');
const engine=require('../quizz-parcours.js');
const {requestPath,serveQPJBFile}=require('./wave2-ux-http.cjs');
const root=path.resolve(__dirname,'..');
const KEY='qpjb-sef-parcours-01';
const state=engine.empty();
state.completed=2;
state.micros['ouv:mineure']={
  score:-2,attempts:2,independent:0,lastSession:1,lastScoredSession:1
};
const snapshot=JSON.stringify(state);
const server=http.createServer((req,res)=>{
  const pathname=requestPath(req,res);
  if(pathname!==null)serveQPJBFile(res,root,pathname);
});
async function verify(engineName,browser,base){
 const context=await browser.newContext({
  viewport:{width:390,height:844},locale:'fr-FR',reducedMotion:'reduce',
  serviceWorkers:'block'
 });
 await context.addInitScript(({key,value})=>localStorage.setItem(key,value),
  {key:KEY,value:snapshot});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e.message)));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  const panel=page.locator('#parcours-recommendations');
  await panel.waitFor({state:'visible'});
  const report=await page.evaluate(()=>{
   const state=JSON.parse(localStorage.getItem('qpjb-sef-parcours-01'));
   const exercises=JSON.parse(document.getElementById('training-data').textContent).exercises;
   return window.QPJBParcoursRecommandations.buildReport(state,{
    parcours:window.QPJBParcours,exercises,maxRecommendations:3
   });
  });
  assert.equal(report.status,'ok');
  assert.ok(report.recommendations.length>=1,'Conseils M4 attendus');
  const rows=panel.locator('#parcours-recommendations-list li');
  assert.equal(await rows.count(),report.recommendations.length);
  for(let i=0;i<report.recommendations.length;i++){
   const r=report.recommendations[i],row=rows.nth(i);
   assert.equal(await row.locator('strong').first().textContent(),r.title);
   assert.equal(await row.locator('span').first().textContent(),r.message);
   for(const [cls,prefix,key] of [
    ['parcours-advice-observed','Constat : ','observed'],
    ['parcours-advice-caveat','Réserve : ','caveat'],
    ['parcours-advice-action','Pour avancer : ','action']
   ]){
    assert.equal(await row.locator('.'+cls).textContent(),prefix+r.explanation[key],
      engineName+' : '+cls+' doit être visible et fidèle au module M4');
   }
  }
  const limits=page.locator('#parcours-recommendations-limits');
  assert.equal(await limits.count(),1);
  assert.equal(await limits.getAttribute('hidden')!==null,!report.limitations.length);
  if(report.limitations.length){
   await limits.locator('summary').click();
   const notes=limits.locator('li');
   assert.equal(await notes.count(),report.limitations.length);
   for(let i=0;i<report.limitations.length;i++)
    assert.equal(await notes.nth(i).textContent(),report.limitations[i]);
  }
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),snapshot,
   'Lecture M4 sans mutation de sauvegarde');
  const outDir=path.join(root,'artifacts','wave2-ux');
  fs.mkdirSync(outDir,{recursive:true});
  await page.screenshot({
   path:path.join(outDir,'m4-conseils-'+engineName+'.png'),
   fullPage:true,animations:'disabled'
  });
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#parcours-recommendations-list li').count(),report.recommendations.length);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),snapshot,
   'Sauvegarde inchangée après rechargement');
  assert.deepEqual(errors,[],'Aucune exception JavaScript');
  console.log('PASS M4/UI '+engineName+': '+report.recommendations.length+
   ' conseils complets, '+report.limitations.length+' limites et sauvegarde intacte');
 }finally{
  await context.close();
 }
}
(async()=>{
 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',resolve);
 });
 const base='http://127.0.0.1:'+server.address().port;
 try{
  for(const [name,launcher] of [['chromium',chromium],['webkit',webkit]]){
   const browser=await launcher.launch({headless:true});
   try{
    const context=await browser.newContext({viewport:{width:390,height:844}});
    try{
     const empty=await context.newPage();
     await empty.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
     assert.ok(await empty.locator('#parcours-recommendations').getAttribute('hidden')!==null,
      'Sans parcours commencé, aucun diagnostic affiché');
    }finally{await context.close();}
    await verify(name,browser,base);
   }finally{await browser.close();}
  }
 }finally{
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
