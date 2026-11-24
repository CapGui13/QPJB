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
assert.equal(at(advanced,s).eligible,false,'One session is not independent progression');
s.journal=base.map((q,i)=>({mode:'parcours',session:25+i,answers:[{id:q.id,result:'correct'}]}));
assert.equal(at(advanced,s).eligible,true);
assert.deepEqual(E.select(qs,s),E.select(qs,s));
// Une reprise existante n'est ni reclassée ni mélangée, même si M1 est absent.
const old=E.empty();
old.active={ids:qs.slice(0,3).map(q=>q.id),index:1,answers:{0:{result:'correct',choice:'1♣',assisted:false,hadFreeError:false}},createdAt:0};
const restored=E.load(JSON.stringify(old));
assert.deepEqual(P.start(restored,qs).map(q=>q.id),old.active.ids);
assert.equal(restored.active.index,1);
assert.deepEqual(restored.active.answers,old.active.answers);
// Un catalogue synthétique épuisé ne peut pas ouvrir un cas non éligible.
const blocked=[...qs.filter(q=>q.difficulty===5)];
assert.deepEqual(E.select(blocked,E.empty()),[]);
// Les séances complémentaires ne doivent pas contournent la porte commune.
const con=E.empty();con.completed=4;
con.micros['ouv:passe']={score:-3,attempts:4};
assert.equal(E.consolidationPlan(con,qs).available,false,'Pas de série de dix Passes pour contourner la progression');
con.micros={'ouv:mineure':{score:-3,attempts:4}};
const plan=E.consolidationPlan(con,qs);
assert.ok(plan.available);
assert.ok(plan.items.every(v=>at(qs.find(q=>q.id===v.id),con).eligible));
assert.equal(new Set(plan.items.map(v=>v.id)).size,plan.items.length);
assert.equal(E.startConsolidation(con,qs).length,plan.items.length);
assert.deepEqual(E.load(JSON.stringify(con)).active.targets,plan.items.map(v=>v.target));
// Pré-requis de découverte sans maîtrise, même avec une notion de niveau 3
// dont aucune variante de difficulté 1/2 n'existe.
const q3={id:'fixture-only-3',theme:'sa',answer:'3SA',difficulty:3,h:13,caseFamily:'only-3'};
const q4={id:'fixture-advanced',theme:'sa',answer:'4SA',difficulty:4,h:15,caseFamily:'adv'};
const local=E.createForTests({schema:'QPJB_PREREQUIS_V1',byId:{
 ...byId,[q3.id]:{concept:'only-3',stage:1,minSession:3,requires:[]},
 [q4.id]:{concept:'advanced-new',stage:3,minSession:8,requires:[{concept:'sa-basic',minExposure:2}]}
}});
assert.equal(local.eligibility(q3,s,[...qs,q3,q4]).eligible,true);
assert.equal(local.eligibility(q4,s,[...qs,q3,q4]).eligible,true);
assert.equal(local.eligibility(q4,E.empty(),[...qs,q3,q4]).eligible,false);
console.log('M2: ouverture, profils, prérequis, difficulté, déterminisme, reprise, consolidation : OK');
