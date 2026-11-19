'use strict';
/* Side-by-side REAL site + candidate V2 on same local origin.
 * Browser tests never contact the public QPJB website. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http');
const path=require('node:path');
const {chromium,webkit,devices}=require('playwright');
const P=require('../quizz-parcours.js');
const AI=require('../scripts/parcours-v2-build-cohabitation-ai.cjs');
const root=path.resolve(__dirname,'..');
const engine=process.env.PW_BROWSER||'chromium';
if(!['chromium','webkit'].includes(engine))throw Error('Unsupported engine');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
 const uri=new URL(req.url,'http://127.0.0.1');
 const prefix='/QPJB/';
 if(!uri.pathname.startsWith(prefix)){res.writeHead(404);res.end();return;}
 const filename=path.resolve(root,decodeURIComponent(uri.pathname.slice(prefix.length)));
 if(filename!==root&&!filename.startsWith(root+path.sep)){
   res.writeHead(403);res.end();return;
 }
 try{
   const item=fs.statSync(filename);
   if(!item.isFile())throw Error('Not file');
   res.writeHead(200,{'content-type':mime[path.extname(filename)]||'application/octet-stream'});
   fs.createReadStream(filename).pipe(res);
 }catch(_){res.writeHead(404);res.end();}
});
(async()=>{
 AI.create(path.join(root,'artifacts/v2-ai/parcours-v2-cohabitation.html'));
 await new Promise(resolve=>server.listen(8831,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[engine].launch({
   headless:true,args:engine==='chromium'?['--no-sandbox']:[]
 });
 try{
  for(const mode of ['desktop','mobile']){
   const opts=mode==='mobile'?
     {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
     {viewport:{width:1365,height:768},locale:'fr-FR',reducedMotion:'reduce'};
   const context=await browser.newContext(opts);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const base='http://127.0.0.1:8831/QPJB/';
   const v2=base+'artifacts/v2-ai/parcours-v2-cohabitation.html';
   await page.goto(v2,{waitUntil:'domcontentloaded'});
   await page.getByText('Un laboratoire pour tester').waitFor();
   const legacy=P.empty();legacy.completed=7;
   const old=JSON.stringify(legacy),training=JSON.stringify({sentinel:{seen:true,ok:true}});
   await page.evaluate(x=>{
     localStorage.setItem(x.v1,x.old);
     localStorage.setItem(x.trainingKey,x.training);
   },{v1:AI.V1_KEY,old,trainingKey:AI.V1_TRAINING_KEY,training});
   await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('7 séance(s) terminée(s)',{exact:false}).waitFor();
   assert.equal(await page.locator('#nav-review').isVisible(),false);
   assert.ok(await page.locator('#ai-return-v1').isVisible());
   await page.locator('#nav-play').click();
   await page.getByText('Question 1 sur 10').waitFor();
   await page.locator('button.choice').first().click();
   await page.getByText('Réponse du catalogue :').waitFor();
   await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('Question 1 sur 10').waitFor();
   assert.equal(await page.locator('.feedback').count(),1);
   await page.locator('#ai-return-v1').click();
   await page.locator('#parcours-status').waitFor();
   assert.match(await page.locator('#parcours-status').textContent(),/Séances terminées : 7/);
   assert.deepEqual(await page.evaluate(x=>({
     v1:localStorage.getItem(x.v1),training:localStorage.getItem(x.trainingKey)
   }),{v1:AI.V1_KEY,trainingKey:AI.V1_TRAINING_KEY}),{v1:old,training});
   await page.goto(v2,{waitUntil:'domcontentloaded'});
   await page.getByText('Question 1 sur 10').waitFor();
   await page.locator('button[data-action="next"]').click();
   await page.getByText('Question 2 sur 10').waitFor();
   await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('Question 2 sur 10').waitFor();
   assert.equal(await page.locator('.feedback').count(),0);
   for(let i=1;i<10;i++){
     await page.locator('button.choice').first().click();
     await page.getByText('Réponse du catalogue :').waitFor();
     await page.locator('button[data-action="next"]').click();
   }
   await page.getByText('Bilan de la séance 1').waitFor();
   await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText('Bilan de la séance 1').waitFor();
   await page.locator('button[data-action="start"]').last().click();
   await page.getByText('Séance fictive 2').waitFor();
   await page.locator('button[data-action="reset"]').click();
   await page.getByText('Un laboratoire pour tester').waitFor();
   const stored=await page.evaluate(x=>({
     v1:localStorage.getItem(x.v1),
     training:localStorage.getItem(x.trainingKey),
     v2:localStorage.getItem(x.v2)
   }),{v1:AI.V1_KEY,trainingKey:AI.V1_TRAINING_KEY,v2:AI.V2_KEY});
   assert.deepEqual(stored,{v1:old,training,v2:null},
     'Reset V2 must preserve every byte of existing V1 and training data');
   const sizes=await page.evaluate(()=>({
     viewport:document.documentElement.clientWidth,
     page:document.documentElement.scrollWidth
   }));
   assert.ok(sizes.page<=sizes.viewport+2,'Horizontal overflow '+JSON.stringify(sizes));
   assert.deepEqual(errors,[],'Browser console errors '+engine+'/'+mode);
   console.log('QPJB AI BROWSER PASS '+engine+' '+mode+
    ' V1=UNCHANGED V2=RESUME_AND_RESET site-navigation=OK');
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
