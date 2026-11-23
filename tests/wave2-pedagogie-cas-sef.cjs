'use strict';
// Test autonome documentaire : node tests/wave2-pedagogie-cas-sef.cjs
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('quizz.html');
const found=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(found,'Catalogue QCM absent');
validateApproved(found[1]);
// Comparer les anciens dossiers à leur catalogue historique, pas à la rédaction approuvée.
const data=JSON.parse(restoreApprovedContexts(found[1]));
assert.equal(data.exercises.length,1523);
const pack=JSON.parse(read('audits/wave2/pedagogie/PROPOSITIONS_P8_HOLD.json'));
assert.equal(pack.status,'A_DISCUSS_NON_APPROVED_DO_NOT_APPLY');
assert.equal(pack.proposals.length,3);
const ids=['SEF-N051-2','SEF-N056-1','SEF-N067-1'];
assert.deepEqual(pack.proposals.map(p=>p.id),ids);
const previous=[
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals];
assert.equal(previous.length,36);
const excluded=new Set(previous.map(p=>p.id));
const points={A:4,R:3,D:2,V:1};
for(const p of pack.proposals){
 assert(!excluded.has(p.id),'Proposition P8 recouvrant les 36 : '+p.id);
 const current=data.exercises.find(x=>x.id===p.id);assert(current,p.id);
 const original=Object.fromEntries(['id','theme','hand','h','shape','auction','context','choices','answer','explain','difficulty','difficultyReason'].map(k=>[k,current[k]]));
 assert.deepEqual(p.before,original,'Le catalogue ou le snapshot a changé : '+p.id);
 assert.equal(original.hand.flat().length,13);
 assert.deepEqual(original.hand.map(x=>x.length),original.shape);
 assert.equal(original.hand.flat().reduce((n,r)=>n+(points[r]||0),0),original.h);
 assert.equal(new Set(original.choices).size,4);
 assert(original.choices.includes(original.answer));
 assert.deepEqual(p.after.choices,p.before.choices);
 assert.equal(p.after.answer,p.before.answer);
 assert.equal(p.after.difficulty,p.before.difficulty);
 assert.equal(p.after.difficultyReason,p.before.difficultyReason);
 assert.equal(p.reviewStatus,'A_DISCUSS_NOT_VALIDATED');
 assert.deepEqual(p.changedFields,p.id==='SEF-N067-1'?['explain']:['context']);
 if(p.id==='SEF-N067-1'){
   assert.equal(original.h,12);
   assert.equal(original.shape[2],6);
   assert.equal(original.h+Math.max(0,original.shape[2]-4),14);
   assert(p.after.explain.includes('auto-forcing'));
 }else{
   assert.equal(original.h,11); assert.equal(original.shape[1-(p.id==='SEF-N056-1'?1:0)],3);
   assert(p.after.context.includes('première position'));
 }
}
// Mutation volontaire : un choix différent est rejeté par l'invariant copie exacte.
const corruption=structuredClone(pack.proposals[0]);corruption.after.choices[0]='7SA';
assert.notDeepEqual(corruption.after.choices,corruption.before.choices);
console.log('PASS wave2-pedagogie-cas-sef : 3 snapshots exacts, 3 bonnes réponses conservées, 36 exclusions, 3 corrections HOLD');
