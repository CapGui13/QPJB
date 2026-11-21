'use strict';
// P20 : dossiers de décision reconstruits des vraies preuves; aucune approbation automatique.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../audits/wave2/pedagogie');
const load=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const d=load('DECISIONS_P20_HOLD.json'),reg=load('ARBITRAGES_P14_HOLD.json');
const m=load('MATRICE_REPRISE_P16_HOLD.json'),p8=load('PROPOSITIONS_P8_HOLD.json');
const p10=load('CONTRE_RELECTURE_P10_15_HOLD.json'),p13=load('REVUE_P13_32_HOLD.json');
const proofs=load('PREUVES_SEF_P15_HOLD.json'),texas=load('TEXAS_CONTRADICTOIRE_P17_HOLD.json');
const eq=(a,b,msg)=>assert.deepEqual(a,b,msg);
function validate(doc){
 assert.equal(doc.schema,'QPJB_WAVE2_M1_P20_DECISION_DOSSIER_HOLD');
 assert.equal(doc.status,'HOLD_NO_HUMAN_APPROVAL');
 assert.equal(doc.historicalProposalsUnapplied,36);
 assert.equal(doc.catalogueBlob,'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7');
 assert.equal(doc.editorial.length,6);assert.equal(doc.agreements.length,11);
 eq(doc.editorial.map(x=>x.id),reg.editorial.map(x=>x.id));
 eq(doc.agreements.map(x=>x.id),reg.agreements.map(x=>x.id));
 const edits=[
  ...p8.proposals.map(p=>({id:p.id,origin:'P8',before:p.before,after:{...p.before,...p.after}})),
  {id:p10.editorialProposalNotApplied.id,origin:'P10',before:{...p10.editorialProposalNotApplied.unchanged,explain:p10.editorialProposalNotApplied.oldExplain},after:{...p10.editorialProposalNotApplied.unchanged,explain:p10.editorialProposalNotApplied.proposedExplain}},
  ...p13.proposedEditorialEditsNotApplied.map(p=>({id:p.id,origin:'P13',before:p.before,after:p.after}))
 ];
 for(let i=0;i<doc.editorial.length;i++){
  const actual=doc.editorial[i],ref=edits[i],r=reg.editorial[i],approval=m.humanDecisions.editorial[i];
  assert.equal(actual.origin,ref.origin);
  eq(actual.changedFields,r.fields);
  assert.equal(actual.decision,'PENDING');
  assert.equal(actual.approvedByHuman,false);assert.equal(approval.approved,false);
  assert(actual.reviewQuestion.length>25,'Question manquante : '+actual.id);
  assert.equal(actual.answerUnchanged,true);assert.equal(actual.choicesUnchanged,true);
  eq(ref.before.choices,ref.after.choices);assert.equal(ref.before.answer,ref.after.answer);
  for(const field of r.fields){assert.equal(actual.before[field],ref.before[field]);assert.equal(actual.after[field],ref.after[field]);assert.notEqual(actual.before[field],actual.after[field]);}
 }
 for(let i=0;i<11;i++){
  const a=doc.agreements[i],ref=proofs.sourceChecks[i],approval=m.humanDecisions.agreements[i];
  assert.equal(a.tier,ref.tier);assert.equal(a.source,ref.source);assert.equal(a.evidence,ref.finding);
  assert.equal(a.caveat,ref.caveat);assert.equal(a.requestedAction,approval.action);
  assert.equal(a.decision,'PENDING');assert.equal(a.confirmedByHuman,false);assert.equal(approval.confirmedByHuman,false);
  assert.equal(a.answerUnchanged,true);assert(a.reviewQuestion.length>25);
 }
 assert.equal(new Set([...doc.editorial,...doc.agreements].map(x=>x.id)).size,17);
 assert.equal(doc.specialCaseTexas.id,'SEF-L25-004');
 assert.equal(doc.specialCaseTexas.diamondStopper,texas.case.diamondStopper);
 assert.equal(doc.specialCaseTexas.heartCount,texas.case.hand[1].length);
 assert.equal(doc.specialCaseTexas.diamondRanks,texas.case.diamondRanks);
 eq(doc.specialCaseTexas.policies,texas.simulatedAgreementPolicies.map(x=>({name:x.name,whenQcm:x.whenQcm})));
 assert.equal(doc.specialCaseTexas.decision,'PENDING');
 eq(doc.invariants,{quizzRecords:1523,themes:22,selected:92,replacementsCounterRead:47,noCatalogChanges:true,noMerge:true,noPublication:true});
}
validate(d);
const fake=JSON.parse(JSON.stringify(d));fake.editorial[3].after.explain='5SA signifie toujours 7♠';
assert.throws(()=>validate(fake),'Corrigé de Blackwood trafiqué indétecté');
const fakeVisa=JSON.parse(JSON.stringify(d));fakeVisa.agreements[8].confirmedByHuman=true;
assert.throws(()=>validate(fakeVisa),'Accord Texas validé sans preuve');
const fakeTier=JSON.parse(JSON.stringify(d));fakeTier.agreements[8].tier='SOURCE_EXPLICITE_CADRE';
assert.throws(()=>validate(fakeTier),'Degré de preuve Texas falsifié');
console.log('PASS wave2-pedagogie-decisions-p20 : 6 textes exacts + 11 accords, 3 corruptions détectées, HOLD');
