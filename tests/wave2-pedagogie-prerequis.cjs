'use strict';
// node tests/wave2-pedagogie-prerequis.cjs : contrat de présentation documentaire, pas de donnée élève.
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const contract=JSON.parse(read('audits/wave2/pedagogie/CONTRAT_PREREQUIS_P11_HOLD.json'));
const manifest=JSON.parse(read('audits/wave2/pedagogie/PROGRESSION_P7_HOLD.json'));
const review=JSON.parse(read('audits/wave2/pedagogie/CONTRE_RELECTURE_P10_15_HOLD.json'));
const engine=read('quizz-parcours.js');
const source=engine.match(/const ROADMAP=\[([\s\S]*?)\];/);assert(source,'No ROADMAP');
const ROADMAP=new Map([...source[1].matchAll(/\['([a-z_]+)',(\d+)\]/g)].map(m=>[m[1],Number(m[2])]));
assert.equal(ROADMAP.size,22);
const exclusions=new Set([
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals,
 ...JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals
].map(x=>x.id));assert.equal(exclusions.size,36);
assert.equal(contract.status,'NON_DEPLOYABLE_HOLD');
const adv=manifest.profiles.find(x=>x.id==='approfondissement');assert(adv);
const auditMap=new Map(review.caseAudits.map(x=>[x.id,x.review]));
assert.equal(contract.requirements.length,16);
const alls=new Set(adv.phases.flatMap(p=>p.cases.map(x=>x.id)));
for(const c of contract.requirements){
 assert(alls.has(c.id));
 const phase=adv.phases[c.phase-1];const actual=phase.cases.find(x=>x.id===c.id);assert(actual,'Phase mismatch');
 assert.equal(c.phase>=3,true);
 assert.equal(c.earliestIntroSessionIndex,ROADMAP.get(c.theme));
 assert.equal(c.actualDifficulty,actual.difficulty);assert.equal(c.targetLevel,phase.targetLevel);
 assert.equal(c.displayContract,'HOLD_ONLY_NO_MASTERY_ASSERTED');
 assert(!exclusions.has(c.id));
 const prior=adv.phases.filter(x=>x.phase<c.phase).flatMap(x=>x.cases.filter(y=>y.theme===c.theme).map(y=>y.id));
 assert.deepEqual(c.priorExposureIds,prior);assert.equal(prior.length,c.phase===3?2:3);
 assert(prior.every(id=>!exclusions.has(id)));
 const status=auditMap.get(c.id)?.status||'METADATA_REVIEW_PRESENT_NOT_P10';
 assert.equal(c.pedagogicalReviewStatus,status);
 assert.equal(c.requiresExplicitAgreement,status==='ACCORD_A_CONFIRMER');
 assert.equal(c.requiresEditorialDecision,status==='CLARIFICATION_PROPOSEE');
}
assert.equal(contract.requirements.filter(x=>x.requiresExplicitAgreement).length,6);
assert.equal(contract.requirements.filter(x=>x.requiresEditorialDecision).length,1);
assert.equal(contract.requirements.filter(x=>x.actualDifficulty!==x.targetLevel).length,1);
function gate(c,session,seen,agreements,editorials){
 if(session<c.earliestIntroSessionIndex)return 'NOT_INTRODUCED';
 if(c.priorExposureIds.some(id=>!seen.has(id)))return 'PRIOR_EXAMPLES_NOT_PRESENTED';
 if(c.requiresExplicitAgreement&&!agreements.has(c.id))return 'AGREEMENT_UNCONFIRMED';
 if(c.requiresEditorialDecision&&!editorials.has(c.id))return 'EDITORIAL_HOLD';
 return 'REVIEWABLE_HOLD_NOT_DEPLOYABLE';
}
function aggregate(session,seen,ag,ed){
 const out={};for(const c of contract.requirements){const st=gate(c,session,seen,ag,ed);out[st]=(out[st]||0)+1;}return out;
}
const none=new Set(),allSeen=new Set(adv.phases.slice(0,3).flatMap(x=>x.cases.map(y=>y.id)));
const agreements=new Set(contract.requirements.filter(x=>x.requiresExplicitAgreement).map(x=>x.id));
const editorials=new Set(contract.requirements.filter(x=>x.requiresEditorialDecision).map(x=>x.id));
const expected=[
 aggregate(0,none,none,none),
 aggregate(39,none,none,none),
 aggregate(39,allSeen,none,none),
 aggregate(39,allSeen,agreements,editorials),
 aggregate(24,allSeen,agreements,editorials)
];
assert.deepEqual(contract.scenarioMetrics.map(x=>x.counts),expected);
assert.equal(expected[0].NOT_INTRODUCED,16);
assert.equal(expected[1].PRIOR_EXAMPLES_NOT_PRESENTED,16);
assert.equal(expected[2].AGREEMENT_UNCONFIRMED,6);
assert.equal(expected[2].EDITORIAL_HOLD,1);
assert.equal(expected[2].REVIEWABLE_HOLD_NOT_DEPLOYABLE,9);
assert.equal(expected[3].REVIEWABLE_HOLD_NOT_DEPLOYABLE,16);
assert.equal(expected[4].NOT_INTRODUCED,12);
assert.equal(expected[4].REVIEWABLE_HOLD_NOT_DEPLOYABLE,4);
// Negative tests: approvals alone never replace a prerequisite or ROADMAP.
assert.equal(aggregate(0,allSeen,agreements,editorials).NOT_INTRODUCED,16);
assert.equal(aggregate(39,none,agreements,editorials).PRIOR_EXAMPLES_NOT_PRESENTED,16);
console.log('PASS wave2-pedagogie-prerequis : 16 cases, 6 accords, 1 éditorial HOLD, 5 scénarios, 2 contre-exemples');
