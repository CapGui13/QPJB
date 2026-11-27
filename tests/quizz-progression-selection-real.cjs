'use strict';
// Exécuter après réunion de M1 et M2 ; aucun substitut des données réelles.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const P=require('../quizz-parcours.js'),M=require('../quizz-prerequis.js');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const qs=data.exercises,by=new Map(qs.map(q=>[q.id,q]));
assert.equal(qs.length,1915);assert.equal(data.themes.length,22);
assert.equal(M.schema,'QPJB_PREREQUIS_V1');assert.equal(Object.keys(M.byId).length,qs.length);
const pass=q=>q.theme==='ouv'&&q.answer==='Passe',fam=q=>q.caseFamily||q.id;
const lead=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1];
// Les sept cas autorisés le 26/11 introduisent le soutien majeur simple.
// Garder le contrôle indépendant et les prérequis d'ouverture inchangés.
const introFitIds=new Set(['SEF-028-2','SEF-028-1','SEF-N048-3','SEF-N048-1','SEF-N053-2','SEF-N053-1','SEF-C-006']);
const effectiveById={...M.byId};
for(const id of introFitIds){
 const q=by.get(id),m=M.byId[id];
 assert.ok(q&&m,id);
 const opening=lead(q);
 assert.ok(q.theme==='majeur'&&q.auction.length===1&&/^1[♥♠]$/.test(opening)&&q.answer==='2'+opening[1]&&q.shape[opening==='1♠'?0:1]===3&&q.difficulty<=2,id+' introductory fit');
 assert.equal(m.concept,'majeur.soutien',id);
 assert.equal(m.minSession,1,id);
 effectiveById[id]={...m,stage:0,requires:m.requires.filter(r=>r.concept!=='majeur.soutien')};
 assert.equal(P.eligibility(q,P.empty(),qs).eligible,false,id+' not in S1');
}

const advanced=['SEF-V44-002','SEF-L06-029','SEF-L37-004','SEF-L38-001','SEF-L40-001','SEF-L41-002','SEF-L28-001','SEF-L09-029'];
for(const id of advanced)assert.equal(P.eligibility(by.get(id),P.empty(),qs).eligible,false,'Premature '+id);
assert.deepEqual(P.select(advanced.map(id=>by.get(id)),P.empty()),[]);
const foundations=['ouv','mineur','majeur','sa','red','second','stayman'];
const report=[];
for(const profile of ['autonome','echecs','modere','aides','progression','faiblesse_passe']){
 const state=P.empty(),exposed={},basic=new Set(),first={},last={},gaps={},families=new Set();
 let seed=11,adj=0,triples=0,hard=0;const passes=[];
 const rng=()=>((seed=(Math.imul(1664525,seed)+1013904223)>>>0)/4294967296);
 for(let s=0;s<20;s++){
  const weakPass=(state.micros?.['ouv:passe']?.score||0)<0||Object.entries(state.entries).some(([id,r])=>pass(by.get(id))&&r.lastSession>=s-3&&(r.result!=='correct'||r.assisted));
  const deck=P.start(state,qs),selection=state.active.selection;
  assert.equal(deck.length,10);assert.equal(new Set(deck.map(fam)).size,10);
  assert.deepEqual(selection.map(x=>x.id),deck.map(q=>q.id));
  assert.deepEqual(P.load(JSON.stringify(state)).active,state.active);
  const openingPass=deck.flatMap((q,i)=>pass(q)?[i]:[]);
  if(s<3)passes.push(openingPass.length);
  if(s===0){
   assert.ok(deck.every(q=>q.theme==='ouv'));
   assert.equal(openingPass.length,3);assert.ok(openingPass[0]<3);
   assert.ok(openingPass.every((i,j)=>j===0||i-openingPass[j-1]>1));
   assert.ok(openingPass.every(i=>deck[i].difficulty===1&&deck[i].h<12));
   for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])
    assert.ok(deck.filter(q=>q.answer===a).length>=n);
  }else{
   assert.ok(openingPass.length<=(weakPass?2:1),profile+' S'+(s+1)+' Passe cap');
   if(s===1){
    assert.ok(openingPass.length>=1);
    assert.ok(deck.some(q=>q.theme==='ouv'&&q.answer==='1♣'));
    assert.ok(deck.some(q=>q.theme==='ouv'&&q.answer==='1♦'));
    assert.ok(deck.filter(q=>q.theme==='mineur'||q.theme==='majeur').length>=6);
    for(const [t,a] of [['mineur','1♣'],['mineur','1♦'],['majeur','1♥'],['majeur','1♠']])
     assert.ok(deck.some(q=>q.theme===t&&lead(q)===a));
   }
  }
  const themes=new Set(deck.map(q=>q.theme));
  for(const t of themes){first[t]??=s+1;if(last[t]!==undefined)gaps[t]=Math.max(gaps[t]||0,s-last[t]);last[t]=s;}
  for(let i=0;i<deck.length;i++){
   const q=deck[i],meta=effectiveById[q.id];
   assert.equal(P.eligibility(q,state,qs).eligible,true,q.id);
   assert.ok(s>=meta.minSession&&meta.requires.every(r=>(exposed[r.concept]||0)>=r.minExposure),q.id+' independent requirement');
   if(q.difficulty>=4){
    hard++;
    if(qs.some(v=>effectiveById[v.id].concept===meta.concept&&effectiveById[v.id].stage<=1&&v.difficulty<=3))
     assert.ok(basic.has(meta.concept),q.id+' local basic');
   }
   if(i&&q.answer===deck[i-1].answer)adj++;
   if(s>0&&i>=2&&q.theme===deck[i-1].theme&&q.theme===deck[i-2].theme)triples++;
   families.add(fam(q));
  }
  for(let i=0;i<deck.length;i++){
   const q=deck[i],assisted=profile==='aides'&&rng()<.72;
   const rate=profile==='autonome'?0:profile==='echecs'?.94:profile==='modere'?.33:profile==='aides'?.15:Math.max(.07,.83-s*.006);
   const wrong=profile==='faiblesse_passe'?pass(q):rng()<rate;
   assert.ok(P.record(state,q,wrong?'wrong':'correct',i,null,assisted,false));
   const meta=effectiveById[q.id];
   exposed[meta.concept]=(exposed[meta.concept]||0)+1;
   if(meta.stage<=1&&q.difficulty<=3)basic.add(meta.concept);
  }
  assert.ok(P.finish(state,qs));
 }
 assert.ok(first.sa>=4&&first.sa<=8,profile+' discovery SA');
 assert.ok(foundations.every(t=>(gaps[t]||0)<=6),profile+' spiral gaps');
 if(profile==='autonome'){assert.ok(adj<=2);assert.ok(triples<=2);assert.deepEqual(passes,[3,1,0]);}
 if(profile==='faiblesse_passe'){assert.equal(passes[0],3);assert.ok(passes[1]>=1&&passes[1]<=2);assert.ok(passes[2]<=2);}
 if(profile==='echecs'||profile==='aides')assert.equal(hard,0);
 report.push({profile,passes,firstSA:first.sa,families:families.size,adj,triples,hard});
}
// Reachability under the exact metadata plus the local-difficulty structural
// constraints. Each reachable lower family can earn successive independent
// successes; this is a graph test, not a claim of actual learner mastery.
const byConcept=new Map();
for(const q of qs){const key=effectiveById[q.id].concept;if(!byConcept.has(key))byConcept.set(key,[]);byConcept.get(key).push(q);}
const reachable=new Set();let change=true;
while(change){
 change=false;
 for(const q of qs){
  if(reachable.has(q.id))continue;
  const m=effectiveById[q.id],lower=key=>(byConcept.get(key)||[]).filter(v=>v.difficulty<q.difficulty);
  if(m.requires.some(r=>(byConcept.get(r.concept)||[]).filter(v=>reachable.has(v.id)).length<r.minExposure))continue;
  if(q.difficulty>=4){
   const keys=lower(m.concept).length?[m.concept]:[...new Set(m.requires.map(r=>r.concept))];
   const available=new Set(keys.flatMap(k=>lower(k).map(fam)));
   const proof=new Set(keys.flatMap(k=>lower(k).filter(v=>reachable.has(v.id)).map(fam)));
   const ownBasic=(byConcept.get(m.concept)||[]).filter(v=>v.difficulty<=3&&effectiveById[v.id].stage<=1);
   if(!available.size||proof.size<Math.min(q.difficulty===5?3:2,available.size)||
      (ownBasic.length&&!ownBasic.some(v=>reachable.has(v.id))))continue;
  }else if(q.difficulty===3&&m.stage>=1&&lower(m.concept).length&&!lower(m.concept).some(v=>reachable.has(v.id)))continue;
  reachable.add(q.id);change=true;
 }
}
assert.equal(reachable.size,qs.length,'Local difficulty cannot permanently block a real QCM');
console.log(JSON.stringify({report,reachable:reachable.size}));
