'use strict';
// node tests/wave2-pedagogie-revue-restants.cjs : ne modifie pas le catalogue.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const raw=read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
validateApproved(raw);
// Les 32 avis historiques sont comparés aux QCM d'origine, après inversion contrôlée des cinq champs approuvés.
const parse=JSON.parse(restoreApprovedContexts(raw));
assert.equal(parse.exercises.length,1523);
const by=new Map(parse.exercises.map(x=>[x.id,x]));
const incomplete=JSON.parse(read('audits/wave2/pedagogie/BILAN_P12_INTEGRITE_HOLD.json')).remainingP9CandidatesNotIndividuallyCounterreadP10;
const reviews=JSON.parse(read('audits/wave2/pedagogie/REVUE_P13_32_HOLD.json'));
const excluded=new Set([
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals
].map(x=>x.id));assert.equal(excluded.size,36);
assert.equal(reviews.recordCount,32);assert.deepEqual(reviews.individualRecords.map(x=>x.id),incomplete);
const pts={A:4,R:3,D:2,V:1},hist={};
for(const entry of reviews.individualRecords){
 const x=by.get(entry.id);assert(x);assert(!excluded.has(entry.id));
 const original=Object.fromEntries(['hand','h','shape','auction','context','choices','answer','explain','difficultyReason'].map(k=>[k,x[k]]));
 assert.deepEqual(entry.before,original,'Snapshot mismatch '+entry.id);
 assert.equal(x.hand.flat().length,13);
 assert.deepEqual(x.hand.map(v=>v.length),x.shape);
 assert.equal(x.hand.flat().reduce((v,c)=>v+(pts[c]||0),0),x.h);
 assert.equal(new Set(x.choices).size,4);assert(x.choices.includes(x.answer));
 assert(x.explain.trim().length>0);
 assert.equal(entry.review.changeToAnswer,false);
 hist[entry.review.status]=(hist[entry.review.status]||0)+1;
}
assert.deepEqual(hist,reviews.summary);
assert.deepEqual(hist,{COHERENT_SOUS_ENONCE:25,CONVENTION_A_CADRER:5,PRECISION_REDACTIONNELLE:2});
assert.equal(reviews.proposedEditorialEditsNotApplied.length,2);
for(const p of reviews.proposedEditorialEditsNotApplied){
 const real=by.get(p.id);assert(real);
 assert.equal(p.status,'A_DISCUSS_NON_APPLIQUE');
 assert.equal(p.before.context,real.context);
 assert.equal(p.after.answer,p.before.answer);
 assert.deepEqual(p.after.choices,p.before.choices);
 assert.equal(p.after.explain,p.before.explain);
 assert.equal(p.after.difficulty,p.before.difficulty);
 assert.deepEqual(p.changedFields,['context']);
 assert.notEqual(p.after.context,p.before.context);
}
const corrupted=structuredClone(reviews.individualRecords[0]);corrupted.before.h+=1;assert.notEqual(corrupted.before.h,by.get(corrupted.id).h);
const dropped=reviews.individualRecords.slice(1).map(x=>x.id);assert.notDeepEqual(dropped,incomplete);
console.log('PASS wave2-pedagogie-revue-restants : 32 contre-lectures, 25 cohérents, 5 accords, 2 rédactions HOLD');
