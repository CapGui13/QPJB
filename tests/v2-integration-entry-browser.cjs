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
  const home=await context.newPage(),archive=await context.newPage();
  try{
   await home.goto(url+'index.html',{waitUntil:'domcontentloaded'});
   assert.equal(await home.locator('#qpjb-v2-quizz-entry').count(),0);
   assert.equal(await home.locator('#qpjb-v2-preview-entry').count(),0);
   assert.equal(await home.locator('a[href*="v2-eleve"]').count(),0);
   assert.equal(await home.locator('.training-button[data-training-mode="quizz"]').count(),1);
   assert.equal(await home.locator('.training-button[data-training-mode="bidding"]').count(),1);
   assert.equal(await home.locator('.training-button[data-training-mode="play"]').count(),1);
   await home.locator('.training-button[data-training-mode="quizz"]').click();
   assert.equal(await home.locator('#quizz-frame').count(),1);
   await home.waitForFunction(()=>document.querySelector('#quizz-frame')?.getAttribute('src')?.startsWith('./quizz.html?embedded=1')); 
   assert.equal(await home.locator('#quizz-frame').getAttribute('src'),'./quizz.html?embedded=1&rev=20261101-ux-clavier');
   const frame=home.frameLocator('#quizz-frame');
   await frame.locator('#parcours-start').waitFor({state:'visible'});
   assert.match(await frame.locator('#parcours-status').textContent(),/Séances terminées : 0/);
   await frame.locator('#parcours-start').click();
   await frame.locator('body.parcours-session').waitFor({state:'attached'});
   assert.equal(await frame.locator('#parcours-status').count(),1);
   const v1=await home.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
   assert.ok(v1,'La V1 garde sa cle de progression');
   assert.equal(await home.locator('a[href*="v2-eleve"]').count(),0);
   // L'URL V2 demeure consultable pour les historiques qui y existent encore.
   await archive.goto(url+'preview/v2-eleve/parcours-sef-65-r1.html',{waitUntil:'domcontentloaded'});
   await archive.locator('header h1').getByText('Parcours guidé SEF',{exact:true}).waitFor();
   assert.equal(await archive.locator('#backup-tools').count(),1);
   assert.equal(await home.evaluate(()=>localStorage.getItem('qpjb-v2-eleve-65-pedago-r1')),null);
   console.log('QPJB V1 UNIQUE ENTRY PASS '+which+'/'+(mobile?'mobile':'desktop'));
  }finally{await archive.close();await home.close();await context.close()}
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
