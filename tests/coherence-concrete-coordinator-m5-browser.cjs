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
   const before=await snapshot();
   assert(await page.locator('#coherence-study').isVisible(),'Targeted study mounted');
   await page.locator('#coherence-study summary').click();
   const targeted=page.locator('#coherence-study [data-study-list] button');
   await targeted.first().waitFor({state:'visible'});
   assert.equal(await targeted.count(),4,'S1 four targeted preparations');
   const expected=await page.evaluate(()=>{
    const all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    const state=QPJBParcours.empty();
    const deck=QPJBParcours.start(state,all);
    const concepts=new Set(deck.map(q=>QPJBPrerequis.byId[q.id].concept));
    return QPJBDurableIntegration.available({history:QPJBParcours.empty(),mode:'discovery',questionActive:false}).filter(x=>concepts.has(x.concept)).map(x=>x.title);
   });
   assert((await targeted.allTextContents()).every(t=>expected.includes(t)),'Targeted titles align with native deck');
   await targeted.first().click();
   const rule=page.locator('#coherence-study [data-study-rule]');
   assert.equal(await rule.locator('h4').count(),1);
   assert.equal(await rule.locator('p').count(),1);
   assert.equal(await rule.locator('details,button,ul').count(),0,'No worked examples or checks');
   assert.equal(await snapshot(),before,'Targeted lesson is read-only');

   await page.locator('#durable-lessons > summary').click();
   const options=await page.locator('#durable-concept option').count();
   assert(options>1,'Discovery notions available');
   await page.locator('#durable-concept').selectOption({index:1});
   await page.locator('#durable-open-lesson').click();
   await page.locator('#durable-lesson-output h4').waitFor({state:'visible'});
   assert((await page.locator('#durable-lesson-output').textContent()).length>40);
   assert.equal(await snapshot(),before,'Lessons cannot mutate stored progression');
   await page.locator('#parcours-start').click();
   await page.locator('#question-heading').waitFor({state:'visible'});
   assert(await page.locator('#durable-study').isHidden());
   assert(await page.locator('#coherence-study').isHidden());
   assert.equal(await page.locator('#coherence-study [data-study-list]').textContent(),'');
   assert.equal(await page.locator('#coherence-study [data-study-rule]').textContent(),'');
   assert.equal(await page.locator('#durable-lesson-output').textContent(),'');
   const q=await page.evaluate(()=>{
    const state=JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')),all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    const exercise=all.find(x=>x.id===state.active.ids[0]);
    return {answer:exercise.answer,wrong:exercise.choices.find(c=>c!==exercise.answer),explain:exercise.explain};
   });
   await page.locator('#free-answer').fill(q.wrong);
   await page.locator('#free-form button[type=submit]').click();
   await page.locator('#answers').waitFor({state:'visible'});
   const index=await page.locator('#answers button').evaluateAll((buttons,answer)=>buttons.findIndex(b=>b.textContent.trim()===answer),q.answer);
   assert(index>=0,'Correct proposition found');
   await page.locator('#answers button').nth(index).click();
   await page.locator('#answer-feedback').waitFor({state:'visible'});
   assert((await page.locator('#answer-feedback').textContent()).includes(q.explain));
   const activeBefore=JSON.parse(await snapshot()).active;
   assert.equal(activeBefore.answers[0].firstGuess,q.wrong);
   assert.equal(activeBefore.answers[0].hadFreeError,true);
   assert.equal(activeBefore.answers[0].assisted,true);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').waitFor({state:'visible'});
   assert(await page.locator('#durable-study').isHidden(),'Resumable session blocks lesson access');
   assert(await page.locator('#coherence-study').isHidden(),'Resumable session blocks targeted suggestions');
   await page.locator('#parcours-start').click();
   await page.locator('#answer-feedback').waitFor({state:'visible'});
   assert.deepEqual(JSON.parse(await snapshot()).active,activeBefore,'Exact resumed evidence');
   await page.locator('#next').click();
   for(let i=2;i<=10;i++){
    await page.waitForFunction(n=>document.querySelector('#step')?.textContent.includes(n+' / 10'),i);
    await page.locator('#pass').click();
   }
   await page.locator('#done-home').waitFor({state:'visible'});
   const finished=JSON.parse(await snapshot());
   assert.equal(finished.completed,1);assert.equal(finished.journal[0].answers[0].firstGuess,q.wrong);
   assert.equal(finished.journal[0].answers[0].hadFreeError,true);
   await page.locator('#done-home').click();
   await page.locator('#durable-study').waitFor({state:'visible'});
   const beforeMastery=await snapshot();
   await page.locator('#coherence-study summary').click();
   await page.locator('#coherence-study [data-study-list] h4').last().waitFor({state:'visible'});
   const headings=await page.locator('#coherence-study [data-study-list] h4').allTextContents();
   assert(headings.includes('Avant la prochaine séance'));
   assert(headings.includes('À revoir après la dernière séance'),'Assisted answer triggers eligible reminder');
   const studyAfter=await page.evaluate(()=>{
    const state=JSON.parse(localStorage.getItem('qpjb-sef-parcours-01')),all=JSON.parse(document.querySelector('#training-data').textContent).exercises;
    return QPJBParcours.studySuggestions(state,all,{coherenceM5:QPJBCoherenceM5,phase:'after',questionActive:false,quizActive:false}).after.map(x=>x.title);
   });
   assert.equal(studyAfter.length,1,'Only assisted answer, not skips');
   assert((await targeted.allTextContents()).includes(studyAfter[0]));
   await targeted.last().click();
   assert.equal(await rule.locator('p').count(),1);
   assert.equal(await snapshot(),beforeMastery,'Targeted recap is read-only');

   await page.locator('#durable-mastery > summary').click();
   await page.locator('#durable-mastery-output ul').waitFor({state:'visible'});
   assert((await page.locator('#durable-mastery-output').textContent()).includes('fragilité observée'));
   assert.equal(await snapshot(),beforeMastery,'Mastery report read-only');
   await page.locator('#new').click();
   await page.locator('#question-heading').waitFor({state:'visible'});
   assert(await page.locator('#durable-study').isHidden(),'Classic question also blocks lessons');
   assert(await page.locator('#coherence-study').isHidden(),'Classic question blocks targeted suggestions');
   assert.equal(await rule.textContent(),'');
   assert.equal(await page.locator('#durable-lesson-output').textContent(),'');
   assert.deepEqual(errors,[]);
   rows.push({width,initialLessons:options-1,targetedLessonReadOnly:true,targetedRecap:true,observedFirstBidPreserved:true,canonicalPreserved:true,lessonReadOnly:true,masteryReadOnly:true,activeLessonBlocked:true,pageErrors:errors});
  }finally{await context.close()}
 }
 console.log(JSON.stringify({status:'PASS',browser:engine,version:browser.version(),rows},null,2));
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>server.close());
