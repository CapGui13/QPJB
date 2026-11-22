'use strict';
/* Captures authentiques M3 avant/après : PW_BROWSER=chromium|webkit node tests/wave2-ux-visual.cjs.
 * Ce test exige le commit de référence, sans remplacer une preuve manquante par une fausse image.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {chromium,webkit}=require('playwright');
const {projectStorage,assertProgressEvidence}=require('./wave2-ux-storage-projection.cjs');
const {watchLocalAssets}=require('./wave2-ux-asset-watch.cjs');
const {assertHandReflow}=require('./wave2-ux-reflow-check.cjs');
const root=path.resolve(__dirname,'..');
const BASE='2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a';
const artifactDir=process.env.PW_ARTIFACT_DIR||path.join(root,'artifacts','wave2-ux');
function baselineHTML(){
 const read=()=>execFileSync('git',['show',BASE+':quizz.html'],{
  cwd:root,encoding:'utf8',maxBuffer:12*1024*1024,stdio:['ignore','pipe','pipe']});
 try{return read()}catch(_){
  try{
   execFileSync('git',['fetch','--no-tags','--depth=1','origin',BASE],{
    cwd:root,stdio:['ignore','ignore','pipe'],timeout:60000});
   return read();
  }catch(error){throw new Error('Baseline manquante : récupérer le commit '+BASE+
    ' (git fetch --no-tags origin '+BASE+') avant une recette visuelle fiable',{cause:error})}
 }
}
const before=baselineHTML(),after=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
function qcmJSON(html){
 const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
 assert.ok(match,'JSON QCM absent');return match[1];
}
assert.equal(qcmJSON(before),qcmJSON(after),'Catalogue inchangé entre les deux versions');
const {requestPath,serveQPJBFile}=require('./wave2-ux-http.cjs');
const server=http.createServer((req,res)=>{
 const pathname=requestPath(req,res);
 if(pathname===null)return;
 if(pathname==='/QPJB/avant-m3.html'){
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
  res.end(before);return;
 }
 serveQPJBFile(res,root,pathname);
});
async function capture(browser,engine,width,height,version,url){
 const context=await browser.newContext({viewport:{width,height},locale:'fr-FR',
  reducedMotion:'reduce',serviceWorkers:'block'});
 await context.addInitScript(()=>{Math.random=()=>0.42});
 const page=await context.newPage(),errors=[];
 const assets=watchLocalAssets(page,url);
 page.on('pageerror',e=>errors.push(e.message));
 const images=[];
 try{
  await page.goto(url+(version==='avant'?'avant-m3.html':'quizz.html'),{waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').click();
  await page.locator('.hand').waitFor({state:'visible'});
  const metrics=await page.evaluate(()=>{
   const hand=document.querySelector('#body .hand');
   const suit=hand.querySelector('.suit');
   return {display:getComputedStyle(hand).display,
    columns:getComputedStyle(hand).gridTemplateColumns,
    suitFontPx:parseFloat(getComputedStyle(suit).fontSize),
    handText:hand.textContent.replace(/\s+/g,' ').trim(),
    auctionText:document.querySelector('#body .auc')?.textContent.replace(/\s+/g,' ').trim()||'',
    documentWidth:document.documentElement.scrollWidth,
    viewportWidth:document.documentElement.clientWidth,
    handScrollWidth:hand.scrollWidth,handClientWidth:hand.clientWidth,
    handRect:(()=>{const {left,right}=hand.getBoundingClientRect();return {left,right}})(),
    rankRects:Array.from(hand.querySelectorAll('.suit .rank'),node=>{
     const {left,right}=node.getBoundingClientRect();return {left,right};
    })};
  });
  for(const [stage,action,selector] of [
   ['question',null,'.hand'],
   ['propositions',()=>page.locator('#show-choices').click(),'#answers button'],
   ['correction',()=>page.locator('#answers button').first().click(),'.feedback']
  ]){
   if(action)await action();
   await page.locator(selector).first().waitFor({state:'visible'});
   const filename=[engine,width+'x'+height,version,stage].join('-')+'.png';
   const destination=path.join(artifactDir,filename);
   await page.screenshot({path:destination,fullPage:true,animations:'disabled'});
   const bytes=fs.readFileSync(destination);
   images.push({stage,file:filename,bytes:bytes.length,
    sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  assert.deepEqual(errors,[],'Aucune exception JavaScript pour '+engine+'/'+version);
  assets.assertClean(engine+'/'+version+'/'+width+'px');
  const storageRaw=await page.evaluate(()=>({
   parcours:localStorage.getItem('qpjb-sef-parcours-01'),
   records:localStorage.getItem('qpjb-sef-entrainement-01')
  }));
  const stableProgress=projectStorage(storageRaw);
  assertProgressEvidence(stableProgress);
  return {engine,width,height,version,...metrics,stableProgress,images};
 }finally{await context.close()}
}
(async()=>{
 const engine=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(engine),'PW_BROWSER doit être chromium ou webkit');
 fs.mkdirSync(artifactDir,{recursive:true});
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 const url='http://127.0.0.1:'+server.address().port+'/QPJB/';
 const rows=[];
 let browser;
 try{
  browser=await ({chromium,webkit})[engine].launch({headless:true,
   args:engine==='chromium'?['--no-sandbox']:[]});
  for(const [width,height] of [[320,844],[390,844],[844,390]]){
   const first=await capture(browser,engine,width,height,'avant',url);
   const second=await capture(browser,engine,width,height,'apres',url);
   assert.equal(first.handText,second.handText,'Même main avant/après : '+width);
   assert.equal(first.auctionText,second.auctionText,'Même séquence avant/après : '+width);
   assert.deepEqual(first.stableProgress,second.stableProgress,
    'Les mêmes actions doivent produire la même progression, sans divergence de stockage : '+width);
   assert.ok(second.documentWidth<=second.viewportWidth+2,
    'Débordement dans la version M3 '+width+' : '+second.documentWidth+'/'+second.viewportWidth);
   if(width<=390){
    assertHandReflow(second,engine+'/'+width+'px comparaison');
    assert.equal(second.display,'grid','Main en grille sur mobile');
    assert.ok(second.suitFontPx>=18.5,'Police mobile M3 à 19px');
    assert.ok(second.suitFontPx>first.suitFontPx,
     'Amélioration de taille de main non démontrée : '+first.suitFontPx+' → '+second.suitFontPx);
   }
   rows.push({width,height,avant:first,apres:second,
    gainPolicePx:Number((second.suitFontPx-first.suitFontPx).toFixed(2))});
   console.log('M3 VISUEL '+engine+' '+width+'x'+height+
    ' : main '+first.suitFontPx+'→'+second.suitFontPx+' px, capturée');
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(ok=>server.close(ok));
 }
 const file=path.join(artifactDir,'comparatif-'+engine+'.json');
 fs.writeFileSync(file,JSON.stringify({baseline:BASE,engine,generatedAt:new Date().toISOString(),
  datasetPreserved:true,rows},null,2)+'\n');
 console.log('PASS M3 comparaison visuelle '+engine+' : '+rows.length+' formats / '+rows.length*6+' captures ; '+file);
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
