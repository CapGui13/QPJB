'use strict';
// Browser UMD smoke of the exact candidate injection on the frozen engine.
// No network, UI changes or cache claims: actual integrated UI remains M6/coordinator.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('quizz.html'),qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const scripts=[...html.matchAll(/<script[^>]*src=["']\.\/((?:quizz|parcours)-[\w-]+\.js)\?[^"']+["'][^>]*>/g)].map(m=>m[1]).filter(x=>x!=='quizz-parcours.js');
const raw=read('quizz-parcours.js'),anchor='const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)}));';
assert.equal(raw.split(anchor).length,2);
const injected=raw.replace(anchor,'const m1Context={session:s+1,candidates,metadataById:prerequis.byId,history:state,selected,category:category||null,priority,forcedReason};\n      const m1Deltas=new Map(curriculum.rank(m1Context).map(r=>[r.id,r.delta]));\n      const ranked=curriculum.prefer(m1Context).map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)+(m1Deltas.get(q.id)||0)}));');
const guarded=process.env.QPJB_M1_POLICY==='guarded';
const reference=JSON.parse(read(process.env.QPJB_M1_REFERENCE||'audits/coherence-concrete-20261126/m1/s1-s5-paired.json'));
(async()=>{
 const name=process.env.PW_BROWSER||'chromium',driver={chromium,webkit}[name];assert.ok(driver);
 const browser=await driver.launch();let count=0;
 try{
  const context=await browser.newContext({offline:true});
  const page=await context.newPage();await page.goto('about:blank');
  for(const name of scripts)await page.addScriptTag({content:read(name)});
  await page.addScriptTag({content:read('quizz-coherence-m1-curriculum.js')});
  if(guarded)await page.addScriptTag({content:read('quizz-coherence-m1-guarded.js')});
  await page.addScriptTag({content:guarded?'window.curriculum=window.QPJBCoherenceM1Guarded;':'window.curriculum=window.QPJBCoherenceCurriculum;'});
  for(const [side,source] of [['before',raw],['after',injected]]){
   await page.addScriptTag({content:source});
   for(const p of reference.results.filter(x=>x.seed===47&&['autonome','faible','aide'].includes(x.profile))){
    const result=await page.evaluate(({qs,trace})=>{
     const api=window.QPJBParcours,state=api.empty(),checks=[];
     for(const session of trace){
      const deck=api.start(state,qs);const ids=deck.map(q=>q.id);
      if(JSON.stringify(ids)!==JSON.stringify(session.items.map(x=>x.id)))throw Error('Different deck S'+session.session);
      for(const [i,q] of deck.entries()){
       const item=session.items[i];if(!api.record(state,q,item.wrong?'wrong':'correct',i,null,item.help,false))throw Error('Record');
       if(i===0){const restored=api.load(JSON.stringify(state));if(JSON.stringify(api.start(restored,qs).map(x=>x.id))!==JSON.stringify(ids))throw Error('Resume')}
      }
      if(!api.finish(state,qs))throw Error('Finish');checks.push(session.session);
     }
     return {checks,offline:navigator.onLine===false};
    },{qs,trace:p[side].trace});
    assert.equal(result.checks.length,5);assert.equal(result.offline,true);count+=5;
   }
  }
  await context.close();
  console.log(JSON.stringify({browser:name,version:browser.version(),sessions:count,offline:true,productionUI:false,passed:true}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
