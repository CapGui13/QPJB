'use strict';
/* Exécution : PW_BROWSER=chromium|webkit node tests/wave2-ux-browser.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const route=decodeURIComponent(url.pathname);
 if(!route.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 const file=path.resolve(root,route.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{const data=fs.readFileSync(file);res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data)}
 catch(_){res.writeHead(404);res.end()}
});
async function scenario(browser,engine,width,base){
 const context=await browser.newContext({viewport:{width,height:844},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  const skip=page.locator('.qpjb-quiz-skip');
  assert.equal(await skip.getAttribute('href'),'#parcours-start','Lien disponible dès la préparation');
  await page.locator('#parcours-start').click();
  await page.locator('#question-heading').waitFor({state:'visible'});
  assert.equal(await skip.getAttribute('href'),'#question-heading');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading');
  const hand=await page.locator('.hand').evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns,display:getComputedStyle(el).display,font:parseFloat(getComputedStyle(el.querySelector('.suit')).fontSize)}));
  assert.equal(hand.display,'grid','Main mobile repliée en grille');
  assert.ok(hand.font>=18.5,'Main lisible, '+hand.font+'px');
  if(width===390){
   await page.locator('#free-answer').fill('???');
   await page.locator('#free-form button[type="submit"]').click();
   assert.equal(await page.locator('#free-answer').getAttribute('aria-describedby'),'bid-free-error');
   await page.locator('#free-answer').fill('1SA');
   assert.equal(await page.locator('#bid-free-error').count(),0);
   assert.equal(await page.locator('#free-answer').getAttribute('aria-describedby'),null);
  }
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answers button').count(),4);
  await page.locator('#answers button').first().click();
  await page.locator('#answer-feedback').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.activeElement?.id==='answer-feedback');
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.match(await page.locator('#session-progress-label').textContent(),/Question 2 \/ 10 · 1 réponse enregistrée/);
  const checkpoint=await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
  assert.equal(JSON.parse(checkpoint).active.index,1);
  await page.locator('#back-home').click();
  await page.waitForFunction(()=>document.activeElement?.id==='parcours-start');
  assert.equal(await skip.getAttribute('href'),'#parcours-start');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01')),checkpoint,'Sauvegarde identique après suspension');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.equal(await page.locator('#qpjb-quiz-announcement').textContent(),'Séance reprise. Question 2 sur 10.');
  assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'))).active.index,1);
  const size=await page.evaluate(()=>({total:document.documentElement.scrollWidth,visible:document.documentElement.clientWidth}));
  assert.ok(size.total<=size.visible+2,'Pas de débordement horizontal '+JSON.stringify(size));
  for(let i=1;i<10;i++){
   await page.locator('#pass').click();
   if(i<9)await page.waitForFunction(n=>document.querySelector('#step')?.textContent.includes((n+2)+' / 10'),i);
  }
  await page.locator('#session-summary-title').waitFor({state:'visible'});
  assert.equal(await skip.getAttribute('href'),'#session-summary-title');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'session-summary-title');
  const totals=(await page.locator('.session-summary-stats dd').allTextContents()).map(Number);
  assert.equal(totals.reduce((a,b)=>a+b,0),10);
  await page.locator('#done-home').click();
  await page.waitForFunction(()=>document.activeElement?.id==='parcours-start');
  assert.deepEqual(errors,[]);
  console.log('PASS M3 '+engine+'/'+width+'px : reprise, clavier, main et bilan');
 }finally{await context.close()}
}
(async()=>{
 const requested=process.env.PW_BROWSER;
 const engines=requested?[requested]:['chromium','webkit'];
 assert.ok(engines.every(x=>['chromium','webkit'].includes(x)));
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 try{
  for(const engine of engines){
   const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
   try{for(const width of [320,390])await scenario(browser,engine,width,'http://127.0.0.1:'+server.address().port)}
   finally{await browser.close()}
  }
 }finally{await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
