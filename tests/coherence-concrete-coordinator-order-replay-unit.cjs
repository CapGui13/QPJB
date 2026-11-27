'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const seed=api.empty(),original=api.start(seed,qs);
const indices=original.flatMap((q,i)=>q.answer!=='Passe'?[i]:[]);
const first=indices[0],last=indices.at(-1),order=original.map(q=>q.id);
[order[first],order[last]]=[order[last],order[first]];
const fixture={schema:'QPJB_COHERENCE_M2_V1',order:ctx=>({ids:ctx.preserveThemeOrder?ctx.deck.slice():order.slice()})};
const options={coherenceM2:fixture,coherenceFullOrder:true};
const state=()=>api.empty();
const core=s=>({skills:s.skills,entries:s.entries,micros:s.micros,axes:s.axes});
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
const same=(a,b)=>assert.deepEqual(stable(a),stable(b));
let cases=0,assertions=0,actualDifferences=0;
function check(v,m){assert(v,m);assertions++}
function setup(opts){const s=state(),deck=api.start(s,qs,opts);return {s,deck}}
function answer(arm,i,mask){const q=arm.deck[i],j=original.findIndex(x=>x.id===q.id),wrong=!!(mask&(1<<j));
 check(api.record(arm.s,q,wrong?'wrong':'correct',i,wrong?q.choices.find(x=>x!==q.answer):q.answer,false,false),'record');}
for(const mask of [0,1,2,3,7,17,31,85,127,255,341,511,682,1023]){
 const ref=setup(),candidate=setup(options);
 same(candidate.s.active.ids,order);
 same(candidate.s.active.orderReferenceIds,original.map(q=>q.id));
 check(!!candidate.s.active.orderSkillBase,'snapshot present');
 for(let i=0;i<10;i++)answer(ref,i,mask);
 for(const [at,i] of [1,0,2,3,4,5,6,7,8,9].entries()){
  answer(candidate,i,mask);
  if(at===3){
   const raw=candidate.s.active;
   const loaded=api.load(JSON.stringify(candidate.s)),imported=api.importProgress(api.exportProgress(candidate.s,qs,{}));
   same(loaded.active,raw);same(imported.active,raw);
   candidate.s=imported;check(api.start(candidate.s,qs,options).map(q=>q.id).join()===order.join(),'exact resume');
  }
 }
 if(JSON.stringify(stable(ref.s.skills))!==JSON.stringify(stable(candidate.s.skills)))actualDifferences++;
 check(api.finish(ref.s,qs)&&api.finish(candidate.s,qs),'finish');
 same(core(ref.s),core(candidate.s));
 same(candidate.s.journal[0].answers.map(a=>a.id),order);
 same(candidate.s.journal[0].orderReferenceIds,original.map(q=>q.id));
 cases++;
}
check(actualDifferences>0,'fixture detects order-sensitive skill differences');
const damaged=setup(options);for(let i=0;i<10;i++)answer(damaged,i,17);
const before=JSON.parse(JSON.stringify(damaged.s.skills));
damaged.s.active.orderSkillBase.ouv={level:999};
const restored=api.load(JSON.stringify(damaged.s));check(!restored.active.orderSkillBase,'invalid snapshot removed');
check(api.finish(restored,qs),'finish corrupt snapshot');same(restored.skills,before);
const noReference=setup();check(!noReference.s.active.orderSkillBase,'historical calls unchanged');
console.log(JSON.stringify({status:'PASS',cases,assertions,actualDifferences,corruptSnapshotPreservesObserved:true}));
