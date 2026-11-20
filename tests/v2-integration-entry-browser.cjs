'use strict';
// Test d'usage depuis l'accueil QPJB : aucun déploiement, aucun appel distant.
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
function server(){
 return http.createServer((req,res)=>{
  let route;
  try{route=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}
  catch{res.writeHead(400).end();return}
  let filename=path.resolve(root,'.'+route);
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return}
  if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory())
   filename=path.join(filename,'index.html');
  if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){
   res.writeHead(404).end();return;
  }
  const type=filename.endsWith('.html')?'text/html; charset=utf-8':
   filename.endsWith('.js')?'application/javascript; charset=utf-8':
   filename.endsWith('.css')?'text/css; charset=utf-8':
   filename.endsWith('.json')?'application/json; charset=utf-8':'application/octet-stream';
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});
  fs.createReadStream(filename).pipe(res);
 });
}
async function check(which,mobile,url){
 const browser=await ({chromium,webkit})[which].launch({headless:true,args:which==='chromium'?['--no-sandbox']:[]});
 try{
  const context=await browser.newContext({
   ...(mobile?devices['iPhone 12']:{viewport:{width:1365,height:850}}),
   locale:'fr-FR',serviceWorkers:'block'
  });
  const home=await context.newPage();let candidate=null;
  try{
   await home.goto(url+'index.html',{waitUntil:'domcontentloaded'});
   assert.equal(await home.locator('#qpjb-v2-quizz-entry').isVisible(),false);
   assert.equal(await home.locator('#qpjb-v2-preview-entry').count(),0);
   await home.locator('.training-button[data-training-mode="quizz"]').click();
   const entry=home.locator('#qpjb-v2-quizz-entry');
   await entry.waitFor({state:'visible'});
   assert.equal(await home.locator('#quizz-frame').count(),1);
   assert.equal(await home.locator('#quizz-frame').getAttribute('src'),'./quizz.html?embedded=1&rev=20261101-ux-clavier');
   const link=entry.locator('a');
   assert.equal(await link.count(),1);
   assert.equal(await link.getAttribute('target'),'_blank');
   assert.equal(await link.getAttribute('href'),'./preview/v2-eleve/parcours-sef-65-r1.html');
   const popup=context.waitForEvent('page');
   await link.click();
   candidate=await popup;
   await candidate.waitForLoadState('domcontentloaded');
   await candidate.locator('header h1').getByText('Parcours guidé SEF',{exact:true}).waitFor();
   const publicText=await candidate.locator('body').innerText();
   assert.doesNotMatch(publicText,/Aperçu privé|HORS PRODUCTION|19 DÉCISIONS PÉDAGOGIQUES|V1\/V2-F/);
   const verified=await candidate.evaluate(()=>{
    const v=JSON.parse(document.querySelector('#ay-payload').textContent);
    return {questions:v.catalog.length,addons:v.addons.length,
     decision:v.releaseDecision,approval:v.editorialApproval,
     version:v.candidateVersion,published:v.candidatePublished};
   });
   assert.deepEqual(verified,{questions:1523,addons:0,decision:'PUBLISHED',
    approval:'APPROVED_BY_USER',version:'QPJB-V2-65-19A-20261120-R1',published:true});
   assert.equal(new URL(candidate.url()).pathname,'/preview/v2-eleve/parcours-sef-65-r1.html');
   assert.equal(await candidate.locator('#backup-tools').count(),1);
   assert.equal(await home.locator('.training-button[data-training-mode="quizz"]').count(),1);
   assert.equal(await home.locator('.training-button[data-training-mode="bidding"]').count(),1);
   assert.equal(await home.locator('.training-button[data-training-mode="play"]').count(),1);
   console.log('QPJB V2 OPTIN BROWSER PASS '+which+'/'+(mobile?'mobile':'desktop'));
  }finally{
   if(candidate)await candidate.close();
   await context.close();
  }
 }finally{await browser.close()}
}
(async()=>{
 const s=server();await new Promise((resolve,reject)=>{
  s.once('error',reject);s.listen(0,'127.0.0.1',resolve)
 });
 try{
  const url='http://127.0.0.1:'+s.address().port+'/';
  await check('chromium',false,url);
  await check('webkit',true,url);
 }finally{await new Promise(resolve=>s.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
