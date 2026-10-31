'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 const engine=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(engine));
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 const errors=[];
 try{
  const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8766/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#selection-mode option').count(),5);
  assert.equal(await page.locator('#topic option').count(),23);
  const dimensions=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  assert.ok(dimensions.width<=dimensions.viewport+2,'No horizontal overflow on iPhone: '+JSON.stringify(dimensions));
  // A known convention case must retain its decision-relevant note.
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#topic').selectOption('roudi');
  await page.locator('#difficulty').selectOption('5');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  let hasMaxNote=false;
  const totalRoudi=Number(await page.locator('#total').textContent());
  assert.ok(totalRoudi>=5,'Roudi level-five pool exists');
  for(let i=0;i<totalRoudi;i++){
   hasMaxNote=hasMaxNote||(await page.locator('#body .context-note').allTextContents()).some(t=>t.includes('fit, maximum'));
   await page.locator('#pass').click();
  }
  assert.ok(hasMaxNote,'Roudi maximum fit is visible without hover');
  await page.locator('#done-home').click();
  await page.locator('#topic').selectOption('ouv');
  await page.locator('#difficulty').selectOption('1');
  await page.locator('#mode').selectOption('10');
  await page.locator('#new').click();
  assert.equal(await page.locator('#body .hand .suit').count(),4,'Hand displays four suits');
  assert.equal(await page.locator('#answers button').count(),4,'Four choices');
  assert.equal(await page.locator('#next').isDisabled(),true,'Next is blocked until answered');
  assert.equal(await page.locator('#done').textContent(),'0','A viewed card is not a completed card');
  const initialOrder=await page.locator('#answers button').allTextContents();
  await page.locator('#answers button').first().click();
  assert.equal(await page.locator('#done').textContent(),'1','Answered card counts as completed');
  assert.equal(await page.locator('#next').isEnabled(),true,'Next becomes available');
  const before=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01')||'{}')).reduce((s,x)=>s+(x.history?.length||0),0));
  await page.locator('#next').click();
  assert.equal(await page.locator('#next').isDisabled(),true,'New card needs its own response');
  await page.locator('#previous').click();
  assert.deepEqual(await page.locator('#answers button').allTextContents(),initialOrder,'Choices are stable when returning');
  assert.equal(await page.locator('.feedback').count(),1,'Previous answer is preserved');
  await page.locator('#next').click();
  const after=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01')||'{}')).reduce((s,x)=>s+(x.history?.length||0),0));
  assert.equal(after,before,'Navigating backward does not add an attempt');
  await page.locator('#pass').click();
  assert.equal(await page.locator('#done').textContent(),'2','Skipped question counts as processed');
  assert.equal(await page.locator('#progressbar').evaluate(el=>el.style.width),'20%','Progress follows processed questions');
  for(let i=2;i<10;i++)await page.locator('#pass').click();
  assert.ok((await page.locator('#body').textContent()).includes('Fin de la séance'),'Session ends after ten treated questions');
  assert.ok((await page.locator('#body').textContent()).includes('9 passé(s)'),'Summary distinguishes skipped questions');
  await page.locator('#done-home').click();
  await page.locator('#selection-mode').selectOption('review');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  assert.ok(Number(await page.locator('#total').textContent())>=9,'Skipped questions appear in review mode');
  // New users start their smart session at the easiest level.
  await page.locator('#back-home').click();
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  assert.ok((await page.locator('#level-name').textContent()).includes('Niveau 1'),'New learner starts at level one');
  assert.deepEqual(errors,[],'No JavaScript runtime exceptions');
  console.log('Quizz browser: PASS ('+engine+')');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
