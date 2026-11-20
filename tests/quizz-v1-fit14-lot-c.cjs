'use strict';
// LOT C. Executer : node tests/quizz-v1-fit14-lot-c.cjs
const assert=require('node:assert/strict');
const pilot=require('../scripts/pilot-v1-fit14-lot-c.cjs');
const data=pilot.audit();
const result=pilot.run();
assert.equal(result.sourceQcm,14);
assert.equal(result.sourceFamilies,14);
assert.equal(result.contextTemplates,10);
assert.equal(result.eligibleForSimulation,13);
assert.deepEqual(result.excluded,['SEF-V44-054']);
assert.deepEqual(result.skills.map(x=>x.proposed),[4,4,6]);
assert.deepEqual(result.skills.map(x=>x.eligible),[4,4,5]);
assert.equal(data.proposal.activationAllowed,false);
assert.equal(data.proposal.validatedSkills,0);
assert.equal(data.proposal.masteryEvidence,null);
assert.equal(data.proposal.reviewStatus,'A_VALIDER_EDITORIALEMENT');
// Quatre contextes apparies : une ouverture min (12 H, Passe)
// et une ouverture plus forte (15 H, 2SA) pour chaque meme majeure/forme.
const first=data.eligible.filter(x=>x.key!=='fit:ouvreur_essai_couleur');
assert.equal(first.length,8);
const shapes=new Map();
for(const x of first){
  const k=x.major+'/'+x.shape;
  if(!shapes.has(k))shapes.set(k,[]);
  shapes.get(k).push(x);
}
assert.equal(shapes.size,4);
for(const rows of shapes.values()){
  assert.deepEqual(rows.map(x=>x.h).sort((a,b)=>a-b),[12,15]);
  assert.deepEqual(rows.map(x=>x.answer).sort(),['2SA','Passe']);
}
// Toute candidature reste non active meme si elle passe les tests structurels.
assert.ok(data.proposal.groups.every(x=>x.candidateOnly===true));
assert.equal(data.proposal.blocked.length,1);
assert.ok(data.proposal.blocked[0].editorialDecisionRequired);
const expectation={
  MINIMUM_FRAGILE:{weak:'fit:ouvreur_minimum_passe',before:15,after:24},
  ESSAI_COULEUR_FRAGILE:{weak:'fit:ouvreur_essai_couleur',before:18,after:24}
};
for(const p of result.profiles){
  const e=expectation[p.profile];
  assert.ok(e,'Profil inconnu');
  assert.equal(p.weakKey,e.weak);
  assert.equal(p.before.presentations,48);
  assert.equal(p.after.presentations,48);
  assert.equal(p.before.weakPresentations,e.before);
  assert.equal(p.after.weakPresentations,e.after);
  assert.equal(p.weakExposureGain,e.after-e.before);
  assert.equal(p.before.uniqueFamilies,13);
  assert.equal(p.after.uniqueFamilies,13);
  assert.equal(p.before.skillsSeen,3);
  assert.equal(p.after.skillsSeen,3);
  assert.equal(p.before.duplicateFreeSessions,12);
  assert.equal(p.after.duplicateFreeSessions,12);
  assert.equal(p.after.otherPresentations,24);
  assert.ok(p.after.uniqueWeakFamilies>=4);
  assert.equal(p.after.syntheticWrong,p.after.weakPresentations);
  assert.equal(p.before.syntheticWrong,p.before.weakPresentations);
  assert.ok(p.weakExposureGain>0);
  assert.ok(p.after.sessions.every(ids=>ids.length===4 && new Set(ids).size===4));
  assert.ok(!p.after.sessions.flat().includes('SEF-V44-054'));
}
console.log('LOT C PASS : 14 QCM reels, 14 familles source, 10 contextes majeures/formes.');
console.log('13 admissibles au test, 1 cas SEF bloque, 0 etiquette active.');
for(const p of result.profiles)console.log(p.profile+': faible '+p.before.weakPresentations+' -> '+p.after.weakPresentations+
  ' / 48, familles 13 -> 13, autres sujets 24/48, 12 seances sans doublon.');
