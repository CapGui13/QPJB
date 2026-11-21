'use strict';
// Test indépendant : node tests/wave2-pedagogie-contre-expertise-avancee.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const payload=read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(payload,'Catalogue embarqué absent');const data=JSON.parse(payload[1]);assert.equal(data.exercises.length,1523);
const byId=new Map(data.exercises.map(x=>[x.id,x]));
const queue=JSON.parse(read('audits/wave2/pedagogie/FILE_REVUE_P9_47_HOLD.json'));
const pack=JSON.parse(read('audits/wave2/pedagogie/CONTRE_RELECTURE_P10_15_HOLD.json'));
const priorities=queue.candidates.filter(x=>x.priority==='P1_HIGH_NO_MARKER');
assert.equal(pack.state,'READ_ONLY_HOLD');assert.equal(pack.count,15);assert.equal(priorities.length,15);
assert.deepEqual(pack.caseAudits.map(x=>x.id),priorities.map(x=>x.id));
const old=[
...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals];
assert.equal(old.length,36);const excluded=new Set(old.map(x=>x.id));
const hcp={A:4,R:3,D:2,V:1};
const status={};
for(const item of pack.caseAudits){
 const x=byId.get(item.id);assert(x,'Unknown '+item.id);
 assert(!excluded.has(item.id));
 assert([4,5].includes(item.difficulty));
 assert(!Object.keys(x).some(k=>k.startsWith('pedagogicalReview')),'Priority marker changed');
 const original=Object.fromEntries(['hand','h','shape','auction','context','choices','answer','explain','difficultyReason'].map(k=>[k,x[k]]));
 assert.deepEqual(original,item.baseline,'Snapshot changed '+item.id);
 assert.equal(x.hand.flat().length,13);assert.deepEqual(x.hand.map(s=>s.length),x.shape);
 assert.equal(x.hand.flat().reduce((n,c)=>n+(hcp[c]||0),0),x.h);
 assert.equal(new Set(x.choices).size,4);assert(x.choices.includes(x.answer));
 assert.equal(item.review.answerChangeProposed,false);
 assert.equal(item.review.requiresHumanReview,item.review.status!=='COHERENT_SOUS_ENONCE');
 status[item.review.status]=(status[item.review.status]||0)+1;
}
assert.deepEqual(status,pack.statusCounts);
assert.deepEqual(Object.keys(status).sort(),['ACCORD_A_CONFIRMER','CLARIFICATION_PROPOSEE','COHERENT_SOUS_ENONCE'].sort());
const black=byId.get('SEF-L02-E-17'),proposal=pack.editorialProposalNotApplied;
assert.equal(proposal.id,black.id);assert.equal(black.answer,'5SA');
assert.equal(black.auction[1],'Partenaire : 5♦ (une ou quatre clés)');
assert.deepEqual(black.hand.map(x=>x.length),[4,3,3,3]);
assert.equal(black.hand.filter(s=>s.includes('A')).length,4,'Four Aces in demander hand');
assert(black.hand[0].includes('D'),'Trump Queen in asker hand');
assert(!black.hand[0].includes('R'),'Trump King absent from asker');
assert.equal(proposal.oldExplain,black.explain);
assert.equal(proposal.unchanged.answer,black.answer);
assert.deepEqual(proposal.unchanged.choices,black.choices);
assert(proposal.proposedExplain.includes('quatre As'));
assert(proposal.proposedExplain.includes('Roi de Pique'));
assert.notEqual(proposal.oldExplain,proposal.proposedExplain);
console.log('PASS wave2-pedagogie-contre-expertise : 15 snapshots et choix, Blackwood 4 As/5 clés, 36 exclusions, aucune réponse changée');
