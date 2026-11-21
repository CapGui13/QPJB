'use strict';
// QPJB M1 P9 : node tests/wave2-pedagogie-stress.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const raw=read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(raw,'Missing data');const data=JSON.parse(raw[1]);assert.equal(data.exercises.length,1523);
const dict=new Map(data.exercises.map(x=>[x.id,x]));
const manifest=JSON.parse(read('audits/wave2/pedagogie/PROGRESSION_P7_HOLD.json'));
const queue=JSON.parse(read('audits/wave2/pedagogie/FILE_REVUE_P9_47_HOLD.json'));
const hist=[
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals];
assert.equal(hist.length,36);const excluded=new Set(hist.map(x=>x.id));
const cfg=[{lo:1,hi:2,per:5},{lo:2,hi:3,per:4},{lo:3,hi:5,per:4}];
function baseline(i){
 const out=[],cfg0=cfg[i];
 for(const th of manifest.profiles[i].themeOrder){
 const families=new Set(),sigs=new Set();
 const eligible=data.exercises.filter(x=>x.theme===th&&!excluded.has(x.id)&&x.difficulty>=cfg0.lo&&x.difficulty<=cfg0.hi).sort((a,b)=>a.difficulty-b.difficulty||a.id.localeCompare(b.id));
 for(const x of eligible){
  const s=(x.auction||[]).join('>')+'|'+x.answer;
  if(families.has(x.caseFamily)||sigs.has(s))continue;
  families.add(x.caseFamily);sigs.add(s);out.push(x.id);
  if(families.size===cfg0.per)break;
 }
 assert.equal(families.size,cfg0.per);
 }return out;
}
const pts={A:4,R:3,D:2,V:1};
function faults(x){
 const a=[];
 if(x.hand.flat().length!==13)a.push('card-count');
 if(x.hand.flat().reduce((n,c)=>n+(pts[c]||0),0)!==x.h)a.push('H');
 if(x.shape.join('-')!==x.hand.map(s=>s.length).join('-'))a.push('shape');
 if(x.choices.length!==4||new Set(x.choices).size!==4)a.push('choices');
 if(!x.choices.includes(x.answer))a.push('answer');
 if(!String(x.explain||'').trim())a.push('explain');
 return a;
}
const diversity=ids=>{
 const cases=ids.map(id=>{const x=dict.get(id);assert(x,'Unknown '+id);return x;});
 const distinct=f=>new Set(cases.map(x=>x.theme+'|'+f(x))).size;
 return {answersByTheme:distinct(x=>x.answer),auctionsByTheme:distinct(x=>(x.auction||[]).join('>')),reasonsByTheme:distinct(x=>x.difficultyReason),markerCount:cases.filter(x=>Object.keys(x).some(k=>k.startsWith('pedagogicalReview'))).length};
};
const expectedOld=[[15,7,6,20],[28,27,16,34],[25,24,24,2]];
const expectedNew=[[20,8,11,19],[40,40,33,27],[32,32,30,2]];
const changes=[],all=[];
for(let i=0;i<3;i++){
 const profile=manifest.profiles[i],ids=profile.phases.flatMap(ph=>ph.cases.map(c=>c.id)),old=baseline(i);
 const a=diversity(old),z=diversity(ids),values=x=>[x.answersByTheme,x.auctionsByTheme,x.reasonsByTheme,x.markerCount];
 assert.deepEqual(values(a),expectedOld[i]);assert.deepEqual(values(z),expectedNew[i]);
 assert(z.answersByTheme>=a.answersByTheme);assert(z.auctionsByTheme>=a.auctionsByTheme);
 const added=ids.filter(id=>!old.includes(id));changes.push(...added);all.push(...ids);
 assert.equal(added.length,[8,23,16][i]);
 for(const id of ids)assert(!excluded.has(id));
}
assert.equal(all.length,92);assert.equal(new Set(all).size,92);
assert.equal(new Set(all.map(id=>dict.get(id).caseFamily)).size,92);
for(const id of all)assert.deepEqual(faults(dict.get(id)),[],'Invalid '+id);
assert.equal(changes.length,47);
assert.equal(queue.candidates.length,47);
assert.deepEqual(new Set(queue.candidates.map(x=>x.id)),new Set(changes));
assert.equal(queue.candidates.filter(x=>x.priority==='P1_HIGH_NO_MARKER').length,15);
for(const c of queue.candidates){
 const item=dict.get(c.id);const marker=Object.keys(item).some(k=>k.startsWith('pedagogicalReview'));
 assert.equal(c.priorEditorialReviewMarker,marker);
 assert.equal(c.priority,item.difficulty>=4&&!marker?'P1_HIGH_NO_MARKER':!marker?'P2_NO_MARKER':'P3_MARKER_PRESENT');
}
const f=structuredClone(dict.get(changes[0]));
f.h+=1;assert(faults(f).includes('H'));f.h-=1;
f.choices[0]=f.choices[1];assert(faults(f).includes('choices'));
f.choices=structuredClone(dict.get(changes[0]).choices);f.answer='7SA';assert(faults(f).includes('answer'));
console.log('PASS wave2-pedagogie-stress : 92 cas contrôlés, 47 remplacements, diversité P3/P7, 15 revues prioritaires, 3 tests négatifs');
