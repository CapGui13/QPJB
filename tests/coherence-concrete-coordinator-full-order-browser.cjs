'use strict';
// Candidate built site only. No external traffic or actual learner data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const root=path.resolve(process.argv[2]||'_public_site'),engine=process.env.PW_BROWSER||'chromium';
assert(['chromium','webkit'].includes(engine));
assert(!fs.existsSync(path.join(root,'quizz-durable-m6-lab.js')),'Lab must not be public');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/QPJB/'))throw Error('path');
  let file=path.resolve(root,decodeURIComponent(url.pathname.slice(6)));
  if(file!==root&&!file.startsWith(root+path.sep))throw Error('path');
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile())throw Error('file');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch(e){res.writeHead(404);res.end('Not found')}
});
async function main(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port,url=origin+'/QPJB/quizz.html';
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 const rows=[];
 try{
 for(const width of [360,1280]){
  const context=await browser.newContext({viewport:{width,height:800},serviceWorkers:'block',reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),errors=[];
   await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
   page.on('pageerror',e=>errors.push(e.message));
   const snapshot=()=>page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
   await page.goto(url,{waitUntil:'load',timeout:45000});
   await page.locator('#durable-study').waitFor({state:'visible'});
   assert(await page.evaluate(()=>window.QPJBDurableIntegration?.schema==='QPJB_DURABLE_INTEGRATION_V1'));
   assert.equal(await page.locator('#durable-lesson-output').textContent(),'');
   assert.equal(await page.locator('#answer-feedback').count(),0);
   const fixture=await page.evaluate(()=>{
    const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    const api=QPJBParcours,m3=QPJB_COHERENCE_M3,opts={coherenceM2:QPJBCoherenceM2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]},state=api.empty(),clone=x=>JSON.parse(JSON.stringify(x));
    if(opts.coherenceM2?.schema!=='QPJB_COHERENCE_M2_V1')throw Error('Missing M2');
    for(let s=1;s<=30;s++){
     const a=clone(state),b=clone(state),native=api.start(a,all),candidate=api.start(b,all,opts);
     if(b.active.orderSkillBase){
      const before=clone(state),expected=b.active.ids,reference=a.active.ids;
      const study=api.studySuggestions(before,all,{...opts,coherenceM5:QPJBCoherenceM5,phase:'before',questionActive:false,quizActive:false});
      api.record(a,native[0],'correct',0,native[0].answer,false,false);
      api.move(a,1);
      return {before,expected,reference,skillBase:b.active.orderSkillBase,studyTitles:study.before.map(x=>x.title),oldActive:a};
     }
     const actual=api.start(state,all,opts);
     for(const [i,q] of actual.entries())if(!api.record(state,q,'correct',i,q.answer,false,false))throw Error('record');
     if(!api.finish(state,all))throw Error('finish');
    }
    throw Error('No within-theme reorder in 30 sessions');
   });
   assert.notDeepEqual(fixture.expected,fixture.reference);
   assert.deepEqual(fixture.expected.slice().sort(),fixture.reference.slice().sort());
   await page.evaluate(state=>localStorage.setItem('qpjb-sef-parcours-01',JSON.stringify(state)),fixture.before);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#coherence-study summary').waitFor({state:'visible'});
   const savedBefore=await snapshot();
   await page.locator('#coherence-study summary').click();
   await page.locator('#coherence-study [data-study-list] button').first().waitFor({state:'visible'});
   const beforeTitles=await page.locator('#coherence-study [data-study-list] ul').first().locator('button').allTextContents();
   assert.deepEqual(beforeTitles,fixture.studyTitles);
   assert.equal(await snapshot(),savedBefore);
   await page.locator('#parcours-start').click();
   await page.locator('#question-heading').waitFor({state:'visible'});
   let state=JSON.parse(await snapshot());
   assert.deepEqual(state.active.ids,fixture.expected,'Actual UI uses candidate order');
   assert.deepEqual(state.active.orderReferenceIds,fixture.reference,'Historical reference persisted');
   assert.deepEqual(state.active.orderSkillBase,fixture.skillBase,'Skill snapshot persisted');
   assert.deepEqual(state.active.orderSkillRecordedIds,[]);
   assert(await page.locator('#coherence-study').isHidden());
   await page.locator('#pass').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   const activeBefore=JSON.parse(await snapshot()).active;
   assert.deepEqual(activeBefore.orderSkillRecordedIds,[fixture.expected[0]]);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   assert(await page.locator('#coherence-study').isHidden());
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   assert.deepEqual(JSON.parse(await snapshot()).active,activeBefore,'Exact resumed reference and answers');
   for(let i=2;i<=10;i++){
    await page.waitForFunction(n=>document.querySelector('#step')?.textContent.includes(n+' / 10'),i);
    await page.locator('#pass').click();
   }
   await page.locator('#done-home').waitFor({state:'visible'});
   const done=JSON.parse(await snapshot()),event=done.journal.at(-1);
   assert.deepEqual(event.answers.map(a=>a.id),fixture.expected,'Journal stores actually displayed order');
   assert.deepEqual(event.orderReferenceIds,fixture.reference,'Reference stored separately');
   const expectedCore=await page.evaluate(before=>{
    const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    const api=QPJBParcours,s=JSON.parse(JSON.stringify(before)),deck=api.start(s,all);
    for(const [i,q] of deck.entries())if(!api.record(s,q,'skipped',i,null,false,false))throw Error('reference record');
    if(!api.finish(s,all))throw Error('reference finish');
    return {skills:s.skills,entries:s.entries,micros:s.micros,axes:s.axes};
   },fixture.before);
   assert.deepEqual({skills:done.skills,entries:done.entries,micros:done.micros,axes:done.axes},expectedCore,'Real UI finish normalizes to historical mastery');
   assert.equal(done.active,null);
   const roundTrip=await page.evaluate(()=>{
    const s=JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')),all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    return QPJBParcours.importProgress(JSON.stringify(QPJBParcours.exportProgress(s,all,{}))).journal.at(-1);
   });
   assert.deepEqual(roundTrip,event,'Export/import retains real journal and reference');
   // Resume a pre-M2 saved active session: do not invent a reference or reorder.
   await page.evaluate(s=>localStorage.setItem('qpjb-sef-parcours-01',JSON.stringify(s)),fixture.oldActive);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   assert(await page.locator('#coherence-study').isHidden());
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   const old=JSON.parse(await snapshot()).active;
   assert.deepEqual(old,fixture.oldActive.active,'Historical active session preserved');
   assert.equal(old.orderReferenceIds,undefined,'No invented legacy reference');
   assert.equal(old.orderSkillBase,undefined,'No invented legacy snapshot');
   assert.deepEqual(errors,[]);
   rows.push({width,session:fixture.before.completed+1,changed:fixture.expected.filter((id,i)=>id!==fixture.reference[i]).length,actualOrder:fixture.expected,reference:fixture.reference,activeResume:true,legacyResume:true,masteryParity:true,skillSnapshot:true,realJournal:true,exportImport:true,studyPreview:true,pageErrors:errors});
  }finally{await context.close()}
 }
 console.log(JSON.stringify({status:'PASS',browser:engine,version:browser.version(),rows},null,2));
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>server.close());
