'use strict';
const {chromium,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const project=path.resolve(__dirname,'..');
const contentTypes={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 const relative=pathname.slice('/QPJB/'.length);
 let file=path.resolve(project,relative);
 if(!file.startsWith(project+path.sep)&&file!==project){res.writeHead(403);res.end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
     const ext=path.extname(file);
     res.writeHead(200,{'content-type':contentTypes[ext]||'application/octet-stream'});
     fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let errors=[];
 try{
  const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const frame=page.frameLocator('#training-frame');
  await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
  await frame.locator('.topic-group .tile').filter({hasText:'Répondre et poursuivre après 2SA'}).first().click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  await frame.locator('.item').first().click();
  const quiz=frame.locator('.qpjb-bid-quiz');
  await quiz.waitFor({state:'visible',timeout:15000});
  const auctionRows=await quiz.locator('.auc tbody tr').count();
  const choices=quiz.locator('.choices>.choice');
  assert.equal(auctionRows,3,'Test QCM must include three auction rows');
  assert.equal(await choices.count(),4,'Four proposals must be present');
  const metrics=await quiz.evaluate(el=>{
   const buttons=el.querySelector('.choices').getBoundingClientRect();
   const rect=el.getBoundingClientRect();
   return {buttonsBottom:buttons.bottom,viewport:el.ownerDocument.documentElement.clientHeight,quizWidth:rect.width,bodyWidth:el.ownerDocument.documentElement.clientWidth};
  });
  assert.ok(metrics.quizWidth>metrics.bodyWidth*0.85,'QCM must use available mobile width');
  await choices.nth(2).click();
  await frame.locator('.qpjb-answer-area.is-open').waitFor({state:'visible',timeout:5000});
  assert.equal(await quiz.locator('.choice.selected').count(),1,'Answer selected');
  await choices.nth(2).click();
  assert.equal(await quiz.locator('.choice.selected').count(),0,'Second tap unselects answer');
  assert.equal(await frame.locator('.qpjb-answer-area[aria-hidden="true"]').count(),1,'Explanation closes');
  await choices.nth(2).click();
  const extra=frame.locator('.postsolution-trigger');
  await extra.waitFor({state:'attached',timeout:5000});
  await extra.click();
  assert.equal(await extra.getAttribute('aria-expanded'),'true','Alternative explanations expand');
  await page.goBack({waitUntil:'domcontentloaded'});
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await quiz.count(),0,'Browser back returns to the list');
  assert.equal(errors.length,0,'No uncaught JavaScript errors: '+errors.join('; '));
  console.log(JSON.stringify({result:'PASS',device:'iPhone 12 / Chromium',auctionRows,choices:4,metrics,browserBack:'list',errors:0}));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
