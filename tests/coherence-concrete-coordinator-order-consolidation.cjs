'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const api=require('../quizz-parcours.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js');
const qs=JSON.parse(fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const opts={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
const copy=s=>JSON.parse(JSON.stringify(s)),canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const same=(a,b)=>assert.deepEqual(canonical(a),canonical(b)),core=s=>({skills:s.skills,entries:s.entries,micros:s.micros,axes:s.axes});
let a=api.empty(),b=api.empty(),consolidations=0,replays=0,resumes=0;
function outcome(q,s){const h=[...q.id].reduce((x,c)=>(x*31+c.charCodeAt(0))>>>0,s);return h%5===0?['skipped',null,false,false]:h%3===0?['wrong',q.choices.find(x=>x!==q.answer),false,false]:['correct',q.answer,h%7===0,h%11===0]}
function play(state,deck,s,options){
 for(let i=0;i<deck.length;i++){
  const q=deck[i];assert(api.record(state,q,...[outcome(q,s)[0],i,...outcome(q,s).slice(1)]));
  if(i===2){api.move(state,3);const raw=copy(state.active);state=api.importProgress(api.exportProgress(state,qs,{}));same(state.active,raw);same(api.start(state,qs,options).map(q=>q.id),deck.map(q=>q.id));resumes++}
 }
 assert(api.finish(state,qs));return state;
}
for(let s=1;s<=65;s++){
 const da=api.start(a,qs),db=api.start(b,qs,opts);
 same(da.map(q=>q.id).sort(),db.map(q=>q.id).sort());replays+=+!!b.active.orderSkillBase;
 a=play(a,da,s,{});b=play(b,db,s,opts);same(core(a),core(b));same(a.completed,b.completed);
 if(s%3!==0)continue;
 const pa=api.consolidationPlan(a,qs,10),pb=api.consolidationPlan(b,qs,10);
 same(pa,pb);
 if(!pa.available)continue;
 const ca=api.startConsolidation(a,qs),cb=api.startConsolidation(b,qs);same(ca,cb);
 assert(!b.active.orderSkillBase&&!b.active.orderReferenceIds);
 const proof=copy({skills:b.skills,micros:b.micros,axes:b.axes});
 a=play(a,ca,s+1000,{});b=play(b,cb,s+1000,opts);
 same(core(a),core(b));same(proof,{skills:b.skills,micros:b.micros,axes:b.axes});
 same(a.completed,s);same(b.completed,s);same(a.lastConsolidation,b.lastConsolidation);consolidations++;
}
assert(consolidations>0&&replays>0);console.log(JSON.stringify({status:'PASS',sessions:65,consolidations,replays,resumes}));
