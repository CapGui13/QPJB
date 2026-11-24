'use strict';
const assert=require('node:assert/strict');
const P=require('../quizz-parcours.js');
const qs=[],byId={};
function add(theme,answer,n,concept,difficulty=1,minSession=0,requires=[],lead='',stage=0){
 for(let i=0;i<n;i++){
  const id='fixture-'+qs.length;
  qs.push({id,theme,answer,difficulty,h:answer==='Passe'?8:13+i%5,shape:[4,3,3,3],
   caseFamily:id,auction:lead?['N: '+lead]:[]});
  byId[id]={concept,stage,minSession,requires};
 }
}
for(const a of ['1♣','1♦','1♥','1♠','1SA','Passe'])add('ouv',a,8,'opening-'+a);
for(const [t,a] of [['mineur','1♣'],['mineur','1♦'],['majeur','1♥'],['majeur','1♠']])
 add(t,'1SA',8,'response-'+a,1,1,[],a);
add('sa','2SA',8,'sa-basic',1,3,[],'1SA');
add('sa','2♣',8,'stayman',2,4,[{concept:'sa-basic',minExposure:2}],'1SA',1);
add('sa','3SA',4,'sa-basic',4,3,[],'1SA',2);
add('sa','4SA',4,'sa-basic',5,3,[],'1SA',3);
add('ouv','2♣',4,'strong',2,26);
const E=P.createForTests({schema:'QPJB_PREREQUIS_V1',byId});
assert.throws(()=>P.createForTests({schema:'QPJB_PREREQUIS_V1',byId:{'SEF-001-1':{}}}),/Fixtures/);
assert.equal(P.eligibility({id:'SEF-missing',theme:'ouv',difficulty:1},P.empty(),[]).eligible,false);
assert.throws(()=>E.select([...qs,{id:'missing',theme:'ouv',difficulty:1}],E.empty()),/prérequis/);
const at=(q,s)=>E.eligibility(q,s,qs);
function complete(s,mode){
 const first=E.start(s,qs);
 assert.equal(first.length,10);
 assert.equal(new Set(first.map(x=>x.id)).size,10);
 assert.equal(new Set(first.map(x=>x.caseFamily)).size,10);
 for(const q of first)assert.equal(at(q,s).eligible,true);
 assert.deepEqual(E.start(E.load(JSON.stringify(s)),qs).map(x=>x.id),first.map(x=>x.id));
 first.forEach((q,i)=>E.record(s,q,mode==='weak'||(mode==='pass'&&q.answer==='Passe'&&q.theme==='ouv')?'wrong':'correct',i,q.answer,false,false));
 assert.equal(E.finish(s,qs),true);
 return first;
}
for(const mode of ['strong','weak','pass']){
 const s=E.empty();
 const first=complete(s,mode),passes=first.filter(q=>q.answer==='Passe');
 assert.equal(passes.length,3);
 assert.ok(first.findIndex(q=>q.answer==='Passe')<=2);
 assert.ok(first.every((q,i)=>q.answer!=='Passe'||i===0||first[i-1].answer!=='Passe'));
 for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])assert.ok(first.filter(q=>q.answer===a).length>=n);
 const second=complete(s,mode);
 const op=second.filter(q=>q.theme==='ouv');
 assert.ok(op.some(q=>q.answer==='1♣')&&op.some(q=>q.answer==='1♦'));
 assert.ok(op.filter(q=>q.answer==='Passe').length>=1&&op.filter(q=>q.answer==='Passe').length<=(mode==='strong'?1:2));
 assert.ok(second.filter(q=>q.theme==='mineur'||q.theme==='majeur').length>=6);
 for(const lead of ['1♣','1♦','1♥','1♠'])assert.ok(second.some(q=>q.auction[0]==='N: '+lead));
 let sawSA=false;
 for(let i=2;i<12;i++){
  const deck=complete(s,mode);
  assert.ok(deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').length<=(mode==='strong'?1:2));
  assert.ok(!deck.some(q=>q.answer==='2♣'&&q.theme==='ouv'));
  if(mode==='weak')assert.ok(deck.every(q=>q.difficulty<4));
  if(i<=7&&deck.some(q=>q.theme==='sa'))sawSA=true;
 }
 assert.ok(sawSA);
}
const s=E.empty();s.completed=30;
const advanced=qs.find(q=>q.difficulty===5),stayman=qs.find(q=>q.theme==='sa'&&q.answer==='2♣');
assert.ok(at(advanced,s).reasons.includes('difficulty-independent'));
assert.ok(at(stayman,s).reasons.some(r=>r.startsWith('exposure:')));
assert.equal(E.select(qs,s).some(v=>v.id===advanced.id),false);
const base=qs.filter(q=>q.theme==='sa'&&q.answer==='2SA').slice(0,3);
s.journal=[{mode:'consolidation',session:25,answers:base.map(q=>({id:q.id,result:'correct'}))}];
assert.equal(at(stayman,s).eligible,false);
s.journal=[{mode:'parcours',session:25,answers:base.map(q=>({id:q.id,result:'wrong'}))}];
assert.equal(at(stayman,s).eligible,true);
assert.equal(at(advanced,s).eligible,false);
s.journal=[{mode:'parcours',session:25,answers:base.map(q=>({id:q.id,result:'correct'}))}];
assert.equal(at(advanced,s).eligible,true);
assert.deepEqual(E.select(qs,s),E.select(qs,s));
console.log('M2: ouverture, profils, prérequis, difficulté, déterminisme, reprise : OK');
