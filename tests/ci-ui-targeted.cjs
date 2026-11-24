'use strict';
// Targeted UI gate on the real public archive; no application mutations.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const {execFileSync} = require('node:child_process');
const {chromium,webkit,devices} = require('playwright');
const root = path.resolve(__dirname,'..');
const engine = process.env.PW_BROWSER;
assert.ok(['chromium','webkit'].includes(engine),'PW_BROWSER must be chromium or webkit');
const mutation = process.env.QPJB_UI_MUTATION || '';
assert.ok(['','overflow','missing-css'].includes(mutation),'Unknown mutation');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml',
 '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif',
 '.ico':'image/x-icon','.pbn':'application/octet-stream'};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-ui-'));
const work = path.join(tmp,'checkout'), site = path.join(tmp,'public');
const run = (cmd,args,cwd=root) => execFileSync(cmd,args,{cwd,stdio:'inherit'});
async function geometry(frame,selector,label,minHeight=32) {
 const report = await frame.evaluate(({selector})=>{
  const nodes=[...document.querySelectorAll(selector)];
  const width=document.documentElement.clientWidth;
  return {width,scrollWidth:document.documentElement.scrollWidth,controls:nodes.map(n=>{
   const r=n.getBoundingClientRect(),s=getComputedStyle(n);
   return {left:r.left,right:r.right,width:r.width,height:r.height,font:parseFloat(s.fontSize),
    visible:s.visibility==='visible'&&s.display!=='none'&&Number(s.opacity)>0};
  })};
 },{selector});
 assert.ok(report.scrollWidth<=report.width+3,'UI_OVERFLOW '+label+' '+JSON.stringify(report));
 assert.equal(report.controls.length,4,label+' four choices');
 assert.ok(report.controls.every(c=>c.visible&&c.width>=44&&c.height>=minHeight&&c.font>=12&&
   c.left>=-3&&c.right<=report.width+3),'UI_CONTROLS '+label+' '+JSON.stringify(report));
}
async function noOverflow(frame,label){
 const result=await frame.evaluate(()=>({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));
 assert.ok(result.s<=result.w+3,'UI_OVERFLOW '+label+' '+JSON.stringify(result));
}
const server=http.createServer((req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost'), route=decodeURIComponent(url.pathname);
  if(!route.startsWith('/QPJB/'))throw Error('outside public site');
  let file=path.resolve(site,route.slice(6));
  if(file!==site&&!file.startsWith(site+path.sep))throw Error('unsafe path');
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const css=path.basename(file)==='qpjb-bridge-ui.css';
  if(css&&mutation==='missing-css'){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  if(css&&mutation==='overflow')res.end(fs.readFileSync(file,'utf8')+'\nhtml{min-width:2000px!important;overflow-x:visible!important}\n');
  else res.end(fs.readFileSync(file));
 }catch(e){if(!res.headersSent)res.writeHead(404);res.end();}
});
async function scenario(browser,base,mobile){
 const start=Date.now(), label=mobile?'mobile':'desktop';
 const context=await browser.newContext(mobile?
  {...devices['iPhone 12'],viewport:{width:360,height:640},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'}:
  {viewport:{width:1365,height:768},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage(), errors=[];
 page.setDefaultTimeout(20000);
 // External network is not part of this local archive gate. Local failures
 // are always recorded, including resource requests from embedded frames.
 await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
 page.on('pageerror',e=>errors.push('JS '+e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 page.on('requestfailed',r=>{if(r.url().startsWith(base)&&!/(ABORTED|cancelled|Cancellation)/i.test(r.failure()?.errorText||''))errors.push('REQUEST '+r.url()+' '+r.failure()?.errorText);});
 const resources=()=>assert.deepEqual(errors,[],'UI_RESOURCE '+label);
 try {
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const home=page.locator('.training-button[data-training-mode="quizz"]');
  await home.waitFor({state:'visible'});
  await noOverflow(page,'home '+label);
  const catalogue=JSON.parse(fs.readFileSync(path.join(site,'catalogue.json'),'utf8'));
  const cards=page.locator('#seance-grid .seance-card');
  await cards.first().waitFor({state:'visible'});
  assert.equal(await cards.count(),catalogue.seances.length,'Every session rendered');
  const actual=await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.folder));
  assert.deepEqual([...actual].sort(),catalogue.seances.map(s=>s.folder).sort(),'No missing/duplicate session');
  for(const card of await cards.all())assert.ok(await card.isVisible(),'Session card visible');
  await home.click();
  const q=page.frameLocator('#quizz-frame');
  await q.locator('#parcours-start').waitFor({state:'visible'});
  const qframe=page.frames().find(f=>f.url().includes('/quizz.html'));
  assert.ok(qframe,'Quiz iframe loaded');
  resources();
  await noOverflow(qframe,'quiz '+label);
  await q.locator('#parcours-start').click();
  await qframe.waitForFunction(()=>document.body.classList.contains('parcours-session'));
  await q.locator('#show-choices').click();
  await q.locator('#answers button').first().waitFor({state:'visible'});
  await geometry(qframe,'#answers button','Quiz '+label,44);
  await q.locator('#answers button').first().click();
  await q.locator('#answer-feedback').waitFor({state:'visible'});
  assert.ok((await q.locator('.feedback-explanation').textContent()).length>10,'Quiz correction readable');
  await q.locator('#next').click();
  await qframe.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  await q.locator('#previous').click();
  await q.locator('#answer-feedback').waitFor({state:'visible'});
  await q.locator('#next').click();
  await qframe.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.equal(await qframe.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')).active.index),1,'Quiz saved checkpoint');
  await q.locator('#back-home').click();
  await q.locator('#parcours-start').waitFor({state:'visible'});
  assert.match(await q.locator('#parcours-start').textContent(),/Reprendre/);
  await q.locator('#parcours-start').click();
  await qframe.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  resources();
  // Embedded Quiz creates a same-URL history entry; navigating to the
  // same URL can restore that entry rather than return to the home view.
  // Use the user's real browser Back action and assert the home is visible.
  await page.goBack({waitUntil:'domcontentloaded'});
  await home.waitFor({state:'visible'});
  await noOverflow(page,'return home '+label);
  console.log('UI_QUIZ_PASS',engine,label,Date.now()-start,'ms');
  await page.locator('.training-button[data-training-mode="bidding"]').click();
  const t=page.frameLocator('#training-frame');
  await t.locator('.topic-group .tile').filter({hasText:'Répondre et poursuivre après 2SA'}).first().click();
  await t.locator('.item').first().click();
  await t.locator('.qpjb-bid-quiz').waitFor({state:'visible'});
  const tf=page.frames().find(f=>f.url().includes('/entrainement/'));
  assert.ok(tf,'Training iframe loaded');
  await geometry(tf,'.qpjb-bid-quiz .choices>.choice','Training '+label);
  const suitSizes=await t.locator('.qpjb-bid-quiz .suits .suit').evaluateAll(nodes=>nodes.map(n=>parseFloat(getComputedStyle(n).fontSize)));
  assert.equal(suitSizes.length,4,'All four suits visible');
  assert.ok(suitSizes.every(n=>n>=12),'Hand text legible');
  await t.locator('.qpjb-bid-quiz .choices>.choice').first().click();
  await t.locator('.qpjb-answer-area.is-open').waitFor({state:'visible'});
  const saved=await tf.evaluate(()=>({id,history:saved[id]?.history?.length||0,persisted:!!JSON.parse(localStorage.getItem(KEY)||'{}')[id]}));
  assert.ok(saved.history>0&&saved.persisted,'Training answer persisted');
  await page.goBack({waitUntil:'domcontentloaded'});
  await t.locator('.item').first().waitFor({state:'visible'});
  await t.locator('.item').first().click();
  await t.locator('.qpjb-bid-quiz').waitFor({state:'visible'});
  assert.equal(await tf.evaluate(x=>JSON.parse(localStorage.getItem(KEY)||'{}')[x.id]?.history?.length,saved),saved.history,'Returning does not erase/duplicate history');
  resources();
  console.log('UI_SCENARIO_PASS',engine,label,Date.now()-start,'ms');
 }finally{await context.close();}
}
(async()=>{
 let browser;
 try{
  run('git',['clone','--quiet','--shared','--no-checkout',root,work]);
  const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  run('git',['checkout','--quiet','--detach',head],work);
  run('python3',['scripts/build_catalogue.py'],work);
  run('python3',['scripts/build_public_site.py','--output',site],work);
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const base='http://127.0.0.1:'+server.address().port+'/QPJB/';
  browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
  for(const mobile of [true,false])await scenario(browser,base,mobile);
  console.log('UI_PASS',engine,head);
 }finally{
  try{if(browser)await browser.close();}
  finally{if(server.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(tmp,{recursive:true,force:true});}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
