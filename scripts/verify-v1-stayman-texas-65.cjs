'use strict';
// Contrôle en lecture seule : ne certifie pas le fond des enchères ni ne modifie la V1.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const registry=read('audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json');
const review=read('audits/QPJB_V1_STAYMAN_TEXAS_65_REVUE_20261120.json');
assert.equal(review.publicationAllowed,false);
assert.equal(review.answersModified,false);
assert.equal(review.liveEngineModified,false);
assert.equal(review.sourceQuestionCount,65);
assert.equal(review.sourceSkillCount,25);
const sources=registry.rows.filter(x=>x.sourceProposal==='STAYMAN_TEXAS_65');
assert.equal(sources.length,65);assert.equal(review.questions.length,65);
const byId=new Map(sources.map(x=>[x.id,x]));
assert.equal(byId.size,65);
const seen=new Set(),values={A:4,R:3,D:2,V:1};
for(const r of review.questions){
 assert.ok(!seen.has(r.id),'Review duplicate '+r.id);seen.add(r.id);
 const original=byId.get(r.id);assert.ok(original,'Unknown question '+r.id);
 const q=original.originalV1;
 assert.equal(r.candidateSkill,original.candidateSkill);
 assert.equal(r.sourceV1Answer,q.answer);
 assert.equal(r.sourceArchiveV2Answer,original.v2Answer);
 assert.deepEqual(r.sourceV1Shape,q.shape);
 assert.equal(r.sourceV1HandPoints,q.h);
 assert.equal(r.structuralReview,'CONTROLE_STATIQUE_OK');
 assert.equal(r.pedagogicalReview,'A_VALIDER_SEF_AVANT_ACTIVATION');
 const hand=q.hand,shape=hand.map(x=>x.length);
 assert.equal(shape.reduce((a,b)=>a+b,0),13,'Cartes totales '+r.id);
 assert.deepEqual(shape,q.shape,'Distribution incohérente '+r.id);
 assert.equal(hand.flat().reduce((n,x)=>n+(values[x]||0),0),q.h,'Points H incohérents '+r.id);
 assert.ok(Array.isArray(q.choices)&&q.choices.length>=2,'Choix absents '+r.id);
 assert.equal(new Set(q.choices).size,q.choices.length,'Choix répétés '+r.id);
 assert.equal(q.choices.filter(x=>x===q.answer).length,1,'Corrigé non unique '+r.id);
 assert.equal(r.approvedEarlier?.approvedAnswer, null === r.approvedEarlier ? undefined : r.approvedEarlier.approvedAnswer);
 assert.ok(Array.isArray(r.flags)&&Array.isArray(r.notes));
 if(r.id==='SEF-V416-008')assert.equal(r.sourceV1Answer,'4♥');
 if(r.id==='SEF-V416-009')assert.equal(r.sourceV1Answer,'4♠');
}
const flags=Object.fromEntries([...new Set(review.questions.flatMap(x=>x.flags))]
 .map(k=>[k,review.questions.filter(x=>x.flags.includes(k)).length]));
assert.deepEqual(flags,review.flagsCounts,'Décompte des alertes incohérent');
assert.deepEqual(flags,{
 COMPETENCE_UN_SEUL_QCM:6,
 CONSIGNE_TROP_GENERIQUE:10,
 V1_V2_OBJECTIF_DIFFERENT:2,
 CONSIGNE_PRECISER_2SA:2,
 MOTIF_DIFFICULTE_TEXAS_APPELE_STAYMAN:2
});
assert.equal(review.questions.filter(x=>x.approvedEarlier).length,16);
const prior=review.questions.filter(x=>x.approvedEarlier);
assert.equal(prior.filter(x=>x.approvedEarlier.decision==='VALIDER_PROPOSITION').length,2);
assert.ok(prior.filter(x=>x.approvedEarlier.decision==='CONSERVER_REPONSE_ORIGINALE')
 .every(x=>x.approvedEarlier.approvedAnswer===x.sourceV1Answer));
assert.deepEqual([...seen].sort(),[...byId.keys()].sort());
console.log('QPJB V1 AUDIT 65 PASS : 65/65 controles structurels, 25 groupes, 16 decisions anterieures,');
console.log('6 cas uniques, 10 consignes generiques, 2 precisions 2SA, 2 motifs Texas/Stayman, 2 objectifs V1/V2.');
console.log('Aucune competence homologuee ni aucun corrigé ou stockage modifie.');
