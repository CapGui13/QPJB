'use strict';
const assert=require('node:assert/strict');
const C=require('../quizz-coherence-m1-curriculum.js');
const M=require('../quizz-prerequis.js').byId;
const concepts=new Set(Object.values(M).map(m=>m.concept));
assert.equal(C.schema,'QPJB_COHERENCE_M1_V1');
assert.equal(C.curriculum.length,65);
for(let s=1;s<=65;s++){
 const row=C.curriculum[s-1];assert.equal(row.session,s);assert.ok(row.title);
 assert.ok(row.primary.length);assert.ok(row.window[0]<=s&&s<=row.window[1]);
 for(const k of [...row.primary,...row.secondary])assert.ok(concepts.has(k),s+' unknown '+k);
 const p=C.plan({session:s,candidates:[],metadataById:M,history:{}});
 assert.equal(p.objective,row.title);assert.deepEqual(p.targetConcepts,[]);assert.ok(p.fallback);
}
const q=(id,answer,difficulty=1)=>({id,answer,difficulty,theme:id==='A'?'majeur':'ouv',caseFamily:id});
const candidates=[q('A','2♥'),q('B','2SA'),q('C','Passe'),q('D','2♠'),q('E','3♥',4)];
const metadataById={A:{concept:'majeur.soutien',stage:0,requires:[{concept:'ouv.majeure',minExposure:1}]},B:{concept:'ouv.sa2',stage:0},C:{concept:'majeur.base',stage:0},D:{concept:'majeur.soutien',stage:0},E:{concept:'majeur.soutien',stage:3}};
const ctx={session:3,candidates,metadataById,selected:[{exercise:candidates[1]}],history:{},category:'discovery'};
const snapshot=JSON.stringify(ctx);
assert.deepEqual(C.prefer(ctx).map(q=>q.id),['A','D']);
assert.ok(C.rank(ctx).every(x=>candidates.some(q=>q.id===x.id)&&Math.abs(x.delta)<=100));
assert.deepEqual(C.rank(ctx),C.rank(ctx));assert.equal(JSON.stringify(ctx),snapshot);
const p=C.plan(ctx);assert.deepEqual(p.targetConcepts,['majeur.soutien','majeur.base']);assert.deepEqual(p.prerequisites['majeur.soutien'][0].requires,[{concept:'ouv.majeure',minExposure:1}]);
assert.equal(C.role(ctx,candidates[0]),'objectif');
for(const delta of [{session:1},{session:2},{session:66},{priority:true},{forcedReason:'rappel_erreur_aide'},{category:'maintenance'},{category:'weakness'},{category:'transfer'},{history:{active:{ids:['A']}}}]){
 const c={...ctx,...delta};assert.equal(C.prefer(c),c.candidates);assert.deepEqual(C.rank(c),[]);
}
const missing={...ctx,candidates:[candidates[1]]};assert.equal(C.prefer(missing),missing.candidates);
const firstSA={...ctx,selected:[]};assert.equal(C.prefer(firstSA),firstSA.candidates);
const selected=[candidates[0],candidates[3],candidates[2],candidates[0]];
assert.equal(C.prefer({...ctx,selected}),candidates);
const old={...ctx,history:{entries:{A:{result:'correct',assessment:{lastSession:0}}}}};
assert.equal(C.plan(old).evidence['majeur.soutien'].autonomousFamilies,0);
const helped={...ctx,history:{journal:[{mode:'parcours',session:1,answers:[{id:'A',family:'a',result:'correct',assisted:true}]}]}};
assert.equal(C.plan(helped).evidence['majeur.soutien'].autonomousFamilies,0);
const proof={...ctx,history:{journal:[{mode:'parcours',session:1,answers:[{id:'A',family:'a',result:'correct'}]},{mode:'consolidation',session:2,answers:[{id:'D',family:'d',result:'correct'}]}]}};
assert.equal(C.plan(proof).evidence['majeur.soutien'].autonomousFamilies,1);
console.log('M1 contract: 65 sessions, metadata, fallback, protected categories, no invented proof, purity PASS');
