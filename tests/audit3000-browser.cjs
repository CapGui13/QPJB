'use strict';
// Browser acceptance of the audited revision. Use the actual pre-audit engine
// for the old fixture, then the built candidate site. No real student data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const {chromium,webkit}=require('playwright');
const C=require('./durable-m6-campaign.cjs'),current=require('../quizz-parcours.js');
const root=path.resolve(process.argv[2]||'_public_site'),engine=process.env.PW_BROWSER||'chromium';
const base='ccd8f20811b9531bbfccb8352ec60953dd7d07cb',key='qpjb-sef-parcours-01';
const git=p=>cp.execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:24*1024*1024});
const names=cp.execFileSync('git',['ls-tree','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js');
const prior=C.engine(Object.fromEntries([...new Set([...C.paths,...names])].map(p=>[p,git(p)])));
const currentData=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const byId=new Map(currentData.map(q=>[q.id,q])),risk=new Set(current.audit3000Risk());
const changed=prior.exercises.find(q=>risk.has(q.id)&&q.answer!==byId.get(q.id)?.answer);
assert(changed,'Real revised key required');
const stable=[],families=new Set([changed.caseFamily||changed.id]);
for(const q of prior.exercises){
 if(stable.length===9)break;
 const f=q.caseFamily||q.id;
 if(!risk.has(q.id)&&q.theme!==changed.theme&&!families.has(f)){families.add(f);stable.push(q)}
}
assert.equal(stable.length,9);
const deck=[stable[0],changed,...stable.slice(1)],ids=deck.map(q=>q.id),old=prior.api.empty();
old.active={mode:'parcours',ids,index:0,answers:{}};
for(let i=0;i<deck.length;i++)assert(prior.api.record(old,deck[i],'correct',i,deck[i].answer,false,false));
assert(prior.api.finish(old,prior.exercises));
old.active={mode:'parcours',ids,index:1,answers:{},createdAt:old.completed};
assert(prior.api.record(old,deck[0],'correct',0,deck[0].answer,false,false));
assert(prior.api.record(old,changed,'correct',1,changed.answer,false,false));
const oldRaw=JSON.stringify(old);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  const p=new URL(req.url,'http://localhost').pathname;
  if(!p.startsWith('/QPJB/'))throw Error('path');
  let file=path.resolve(root,decodeURIComponent(p.slice(6)));
  if(!file.startsWith(root+path.sep))throw Error('path');
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
 }catch(_){res.writeHead(404);res.end('Not found')}
});
async function main(){
 assert(['chromium','webkit'].includes(engine));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port,url=origin+'/QPJB/quizz.html';
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 const rows=[];
 try{
 for(const mode of ['compatible','old-engine','old-metadata']){
  const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  try{
   await context.addInitScript(({key,raw,origin})=>{
    if(location.origin===origin&&!sessionStorage.getItem('audit3000-fixture')){
     localStorage.setItem(key,raw);sessionStorage.setItem('audit3000-fixture','1');
    }
   },{key,raw:oldRaw,origin});
   const page=await context.newPage(),errors=[];
   await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
   if(mode==='old-engine')await page.route('**/quizz-parcours.js?v=26',r=>r.fulfill({contentType:'application/javascript',body:git('quizz-parcours.js')}));
   if(mode==='old-metadata')await page.route('**/quizz-prerequis.js?v=5',r=>r.fulfill({contentType:'application/javascript',body:git('quizz-prerequis.js')}));
   page.on('pageerror',e=>errors.push(e.message));
   const snapshot=()=>page.evaluate(k=>localStorage.getItem(k),key);
   await page.goto(url,{waitUntil:'domcontentloaded'});
   if(mode!=='compatible'){
    await page.getByText('Mise à jour QPJB incomplète.',{exact:false}).first().waitFor({state:'visible'});
    assert.equal(await snapshot(),oldRaw,'Version mismatch must not write guided progress');
    assert(errors.some(e=>/Incompatible QPJB/.test(e)),'Expected version guard');
    rows.push({mode,storageUnchanged:true});continue;
   }
   await page.locator('#progress-audit3000-notice').waitFor({state:'attached'});
   assert.match(await page.locator('#parcours-status').textContent(),/Séances terminées : 1/);
   assert.equal(await snapshot(),oldRaw,'Merely visiting does not rewrite guided history');
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
   const state=JSON.parse(await snapshot());
   assert.equal(state.completed,1);assert.deepEqual(state.active.ids,ids);
   assert.equal(state.active.answers[0].choice,deck[0].answer);
   assert(!Object.hasOwn(state.active.answers,1));
   assert.equal(state.active.index,1);
   assert.equal(state.audit3000Archive.active.answers[1].choice,changed.answer);
   assert.equal(state.audit3000Archive.journal[0].event.answers[1].choice,changed.answer);
   assert(!state.entries[changed.id]);
   await page.locator('#pass').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('3 / 10'));
   const after=JSON.parse(await snapshot());
   assert.equal(after.active.answers[1].result,'skipped');
   assert.deepEqual(after.audit3000Archive,state.audit3000Archive);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#parcours-start').click();
   await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('3 / 10'));
   const resumed=JSON.parse(await snapshot());
   assert.deepEqual(resumed.active,after.active);assert.deepEqual(resumed.audit3000Archive,after.audit3000Archive);
   assert.deepEqual(errors,[]);
   rows.push({mode,completed:resumed.completed,deckPreserved:true,archivePreserved:true,revisedQuestionReattempted:true});
  }finally{await context.close()}
 }
 console.log(JSON.stringify({status:'PASS',browser:engine,rows},null,2));
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>server.close());
