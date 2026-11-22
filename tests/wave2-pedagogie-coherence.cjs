'use strict';
// Contrôle croisé des artefacts de M1. node tests/wave2-pedagogie-coherence.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const p=n=>JSON.parse(read('audits/wave2/pedagogie/'+n));
const m7=p('PROGRESSION_P7_HOLD.json'),m8=p('PROPOSITIONS_P8_HOLD.json'),m9=p('FILE_REVUE_P9_47_HOLD.json'),m10=p('CONTRE_RELECTURE_P10_15_HOLD.json'),m11=p('CONTRAT_PREREQUIS_P11_HOLD.json'),m12=p('BILAN_P12_INTEGRITE_HOLD.json');
const found=read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(found,'Missing embedded QCM');const data=JSON.parse(found[1]);assert.equal(data.exercises.length,1523);assert.equal(data.themes.length,22);
const dict=new Map(data.exercises.map(x=>[x.id,x]));
const excluded=new Set([
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals
].map(x=>x.id));
assert.equal(excluded.size,36);
const ids=m7.profiles.flatMap(p=>p.phases.flatMap(ph=>ph.cases.map(x=>x.id)));
assert.equal(ids.length,92);assert.equal(new Set(ids).size,92);assert(ids.every(id=>dict.has(id)&&!excluded.has(id)));
assert.equal(new Set(m7.profiles.flatMap(p=>p.themeOrder)).size,22);
assert.equal(m8.proposals.length,3);
for(const e of m8.proposals){
 const item=dict.get(e.id);assert(item&&!excluded.has(e.id));
 assert.equal(e.reviewStatus,'A_DISCUSS_NOT_VALIDATED');
 assert.equal(e.before.answer,item.answer);assert.equal(e.after.answer,item.answer);
 assert.deepEqual(e.before.choices,item.choices);assert.deepEqual(e.after.choices,item.choices);
}
const replacements=m9.candidates.map(x=>x.id);
assert.equal(replacements.length,47);assert.equal(new Set(replacements).size,47);
assert(replacements.every(id=>ids.includes(id)));
const prioritized=m9.candidates.filter(x=>x.priority==='P1_HIGH_NO_MARKER').map(x=>x.id);
assert.equal(prioritized.length,15);assert.deepEqual(m10.caseAudits.map(x=>x.id),prioritized);
const unreviewed=replacements.filter(id=>!prioritized.includes(id));
assert.equal(unreviewed.length,32);assert.deepEqual(m12.remainingP9CandidatesNotIndividuallyCounterreadP10,unreviewed);
assert.equal(m10.caseAudits.filter(x=>x.review.status==='ACCORD_A_CONFIRMER').length,6);
assert.equal(m10.caseAudits.filter(x=>x.review.status==='CLARIFICATION_PROPOSEE').length,1);
const adv=m7.profiles.find(x=>x.id==='approfondissement');assert(adv);
assert.equal(m11.requirements.length,16);
for(const x of m11.requirements){
 assert(ids.includes(x.id));assert(adv.phases[x.phase-1].cases.some(y=>y.id===x.id));
 assert(!excluded.has(x.id));assert(x.priorExposureIds.every(id=>ids.includes(id)&&!excluded.has(id)));
 const review=m10.caseAudits.find(y=>y.id===x.id)?.review;
 assert.equal(x.requiresExplicitAgreement,review?.status==='ACCORD_A_CONFIRMER');
 assert.equal(x.requiresEditorialDecision,review?.status==='CLARIFICATION_PROPOSEE');
}
assert.equal(m11.requirements.filter(x=>x.requiresExplicitAgreement).length,6);
assert.equal(m11.requirements.filter(x=>x.requiresEditorialDecision).length,1);
assert.equal(m12.metrics.p9NotReviewedInP10,32);
assert(m7.status.includes('HOLD'));assert(m8.status.includes('DO_NOT_APPLY'));assert(m10.state.includes('HOLD'));assert(m11.status.includes('HOLD'));
// Negative tests are in-memory only; no repository mutation.
const altered=[...ids];altered[0]=[...excluded][0];assert(altered.some(id=>excluded.has(id)));
const brokenProposals=structuredClone(m8.proposals);brokenProposals[0].after.answer='7SA';assert.notEqual(brokenProposals[0].after.answer,brokenProposals[0].before.answer);
const shortReview=prioritized.slice(1);assert.notDeepEqual(shortReview,m10.caseAudits.map(x=>x.id));
console.log('PASS wave2-pedagogie-coherence : P7–P11 concordants, 32 candidats non contre-lus P10, HOLD, 3 tests négatifs');
