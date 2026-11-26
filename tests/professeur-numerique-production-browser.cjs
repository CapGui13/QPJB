'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright'),engine=process.env.PW_BROWSER||'chromium',root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');let p=path.resolve(root,decodeURIComponent(u.pathname.replace(/^\/QPJB\//,'')));if(!p.startsWith(root+path.sep)){res.writeHead(404);return res.end()}try{res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).on('error',()=>res.end()).pipe(res)}catch(_){res.writeHead(404);res.end()}});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port+'/QPJB/quizz.html';
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{for(const width of [390,1280]){
  const page=await browser.newPage({viewport:{width,height:800},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url,{waitUntil:'domcontentloaded'});
  assert.equal(await page.evaluate(()=>window.QPJBProfesseur?.schema),'QPJB_PROFESSEUR_V1');
  const seed=async(id,legacyChoice=null)=>{const expected=await page.evaluate(({id,legacyChoice})=>{const data=JSON.parse(document.querySelector('#training-data').textContent).exercises,q=data.find(q=>q.id===id);const s=QPJBParcours.empty(),deck=QPJBParcours.start(s,data);let i=deck.findIndex(v=>v.id===q.id);if(i<0){i=deck.findIndex(v=>v.answer===q.answer&&v.theme===q.theme);if(i<0)i=0;s.active.ids[i]=id;s.active.selection[i].id=id} s.active.index=i;if(legacyChoice)QPJBParcours.record(s,q,'wrong',i,legacyChoice,true,false);localStorage.setItem('qpjb-sef-parcours-01',JSON.stringify(s));return {canonical:q.explain,id,index:i}},{id,legacyChoice});
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#parcours-start').click();return expected};
  const expect=await seed('SEF-001-1');
  assert.equal(await page.locator('#answer-feedback').count(),0);assert.equal(await page.locator('.professeur-feedback').count(),0);
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answer-feedback').count(),0);
  await page.locator('#answers button').filter({hasText:'2SA'}).click();
  await page.locator('#answer-feedback').waitFor();
  assert.equal(await page.locator('[aria-labelledby="feedback-explanation-heading"]').textContent(),expect.canonical);
  assert.match(await page.locator('.professeur-feedback').textContent(),/20–21 H/);
  assert.ok(await page.locator('#next').isEnabled());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')));assert.equal(state.active.answers[expect.index].choice,'2SA');assert.equal(state.active.answers[expect.index].result,'wrong');
  const again=await seed('SEF-001-1');
  await page.locator('#free-answer').fill('1SA');await page.locator('#free-form button[type=submit]').click();
  await page.locator('#answer-feedback').waitFor();assert.equal(await page.locator('.professeur-feedback').count(),0);assert.equal(await page.locator('[aria-labelledby="feedback-explanation-heading"]').textContent(),again.canonical);
  await seed('SEF-N013-2','1♠');await page.locator('#answer-feedback').waitFor();
  assert.equal(await page.locator('#answers button.bad').textContent(),'1♠');assert.equal(await page.locator('#answers button.good').textContent(),'1♦');
  assert.deepEqual(errors,[]);await page.close();
 }}finally{await browser.close();await new Promise(r=>server.close(r))}
 console.log('Production : feedback réel après réponse, reprise ancienne et affichage mobile/desktop OK');
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
