'use strict';
// QPJB AJ: test the actual index->Quiz iframe->V2 opt-in route, plus V1 return.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const P=require('../quizz-parcours.js');
const root=path.resolve(__dirname,'..'),engine=process.env.PW_BROWSER||'chromium';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://127.0.0.1');}catch(_){res.writeHead(400);res.end();return;}
 if(!url.pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return;}
 let file=path.resolve(root,decodeURIComponent(url.pathname.slice('/QPJB/'.length)));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(_){res.writeHead(404);res.end();}
});
async function run(){
 assert.ok(['chromium','webkit'].includes(engine));
 await new Promise(resolve=>server.listen(8843,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[engine].launch({
  headless:true,args:engine==='chromium'?['--no-sandbox']:[]
 });
 try{
  for(const mode of ['desktop','mobile']){
   const options=mode==='mobile'?{...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
     {viewport:{width:1365,height:768},locale:'fr-FR',reducedMotion:'reduce'};
   const context=await browser.newContext(options);
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const base='http://127.0.0.1:8843/QPJB/';
   const v2=base+'preview/v2-ai/parcours-v2-cohabitation.html';
   const legacy=P.empty();legacy.completed=7;
   const old=JSON.stringify(legacy),free=JSON.stringify({sentinel:{seen:true,ok:true}});
   await page.goto(base+'quizz.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#parcours-v2-preview-wrap').isVisible(),false,
     'V2 link must not appear in normal Quiz');
   await page.evaluate(data=>{
    localStorage.setItem(data.legacyKey,data.old);
    localStorage.setItem(data.freeKey,data.free);
   },{legacyKey:'qpjb-sef-parcours-01',old,freeKey:'qpjb-sef-entrainement-01',free});

   // Test flag propagation from the real QPJB home into the existing Quiz iframe.
   await page.goto(base+'index.html?v2preview=1',{waitUntil:'domcontentloaded'});
   await page.locator('.training-button-quizz').click();
   const frame=page.frameLocator('#quizz-frame');
   await frame.locator('#parcours-v2-preview-link').waitFor({state:'visible'});
   const embedUrl=await page.locator('#quizz-frame').getAttribute('src');
   assert.ok(embedUrl.includes('&v2preview=1'),embedUrl);
   const popupPromise=page.waitForEvent('popup');
   await frame.locator('#parcours-v2-preview-link').click();
   const popup=await popupPromise;
   popup.on('pageerror',e=>errors.push(e.message));
   await popup.getByText('Un laboratoire pour tester').waitFor();
   assert.ok(popup.url().startsWith(v2),'Navigated to tracked V2 document');
   await popup.getByText('7 séance(s) terminée(s)',{exact:false}).waitFor();
   assert.ok(await popup.locator('#ai-return-v1').isVisible());
   await popup.locator('#nav-play').click();
   await popup.getByText('Question 1 sur 10').waitFor();
   await popup.locator('button.choice').first().click();
   await popup.getByText('Réponse du catalogue :').waitFor();
   await popup.reload({waitUntil:'domcontentloaded'});
   await popup.getByText('Question 1 sur 10').waitFor();
   assert.equal(await popup.locator('.feedback').count(),1);
   await popup.locator('#ai-return-v1').click();
   await popup.getByText(/Séances terminées : 7/).waitFor({state:'visible',timeout:30000});
   assert.match(await popup.locator('#parcours-status').textContent(),/Séances terminées : 7/);
   assert.deepEqual(await popup.evaluate(()=>({
     old:localStorage.getItem('qpjb-sef-parcours-01'),
     free:localStorage.getItem('qpjb-sef-entrainement-01')
   })),{old,free});

   await popup.goto(v2,{waitUntil:'domcontentloaded'});
   await popup.getByText('Question 1 sur 10').waitFor();
   await popup.locator('button[data-action=next]').click();
   await popup.getByText('Question 2 sur 10').waitFor();
   await popup.reload({waitUntil:'domcontentloaded'});
   await popup.getByText('Question 2 sur 10').waitFor();
   assert.equal(await popup.locator('.feedback').count(),0);
   await popup.locator('button[data-action=reset]').click();
   await popup.getByText('Un laboratoire pour tester').waitFor();
   const stored=await popup.evaluate(()=>({
     old:localStorage.getItem('qpjb-sef-parcours-01'),
     free:localStorage.getItem('qpjb-sef-entrainement-01'),
     v2:localStorage.getItem('qpjb-sef-parcours-v2-01')
   }));
   assert.deepEqual(stored,{old,free,v2:null},'Reset V2 must preserve V1 and Quiz results');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('.training-button-quizz').click();
   await page.frameLocator('#quizz-frame').locator('#parcours-v2-preview-link')
     .waitFor({state:'visible'});
   assert.deepEqual(errors,[],'No JS errors on actual QPJB/Quiz/V2 '+engine+'/'+mode);
   const widths=await popup.evaluate(()=>({
     page:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth
   }));
   assert.ok(widths.page<=widths.viewport+2,JSON.stringify(widths));
   console.log('QPJB AJ BROWSER PASS '+engine+' '+mode+
     ' default-hidden index-flag=OK V1-unchanged V2-restart=OK');
   await context.close();
  }
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
