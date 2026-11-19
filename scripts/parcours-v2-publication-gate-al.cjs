'use strict';
// QPJB V2-AL : porte de recette éditoriale, strictement hors production.
// Vérifie les 19 sources, l'intégrité du manifeste et le caractère explicite d'un GO.
// En fonctionnement normal, HOLD est un résultat attendu, PAS une réussite pédagogique.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const report=JSON.parse(fs.readFileSync(path.join(ROOT,'Docs',
  'PARCOURS_V2_PHASE_AL_MANIFESTE_ARBITRAGE_20261119.json'),'utf8'));
function embeddedJson(html,id){
  const script=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(([,attributes])=>new RegExp('\\bid="'+id+'"').test(attributes));
  assert.ok(script,'Bloc JSON introuvable : '+id);
  return JSON.parse(script[2]);
}
const html=fs.readFileSync(path.join(ROOT,'preview/parcours-v2-autonome.html'),'utf8');
const site=fs.readFileSync(path.join(ROOT,'quizz.html'),'utf8');
const flags=embeddedJson(html,'review-flags');
const catalog=embeddedJson(site,'training-data').exercises;
assert.equal(report.schema,'QPJB_V2_AL_PEDAGOGICAL_RELEASE_REVIEW_1');
assert.equal(report.sourceQcmModified,false,'Ne pas déclarer de modification source dans cette phase');
assert.equal(catalog.length,1523,'Le catalogue SEF doit rester à 1523');
assert.equal(flags.length,19,'Les flags historiques doivent rester au nombre de 19');
assert.equal(report.cases.length,flags.length,'Couverture incomplète des alertes');
const sourceById=new Map(catalog.map(q=>[q.id,q]));
assert.equal(sourceById.size,catalog.length,'IDs originaux répétés');
const flagById=new Map(flags);
assert.equal(flagById.size,flags.length,'Flags répétés');
const seen=new Set();
const allowed=new Set(['A_REVOIR','CLARIFICATION_CONVENTION',
  'HARMONISATION_PEDAGOGIQUE','RECLASSEMENT_PEDAGOGIQUE',
  'VALIDE_DANS_ACCORD','CORRECTION_JUSTIFIEE']);
for(const item of report.cases){
  assert.ok(item&&typeof item.id==='string',"ID d'arbitrage absent");
  assert.ok(!seen.has(item.id),'ID répété : '+item.id);
  seen.add(item.id);
  assert.ok(flagById.has(item.id),"ID d'arbitrage hors des 19 flags : "+item.id);
  assert.equal(item.sourceNote,flagById.get(item.id),'Note source altérée : '+item.id);
  assert.ok(sourceById.has(item.id),'QCM source absent : '+item.id);
  assert.ok(['P1','P2'].includes(item.priority),'Priorité inconnue : '+item.id);
  assert.ok(allowed.has(item.proposedDecision),'Proposition inconnue : '+item.id);
  assert.ok(typeof item.observation==='string'&&item.observation.length>30,
    'Justification trop courte : '+item.id);
  assert.ok(item.reference===null||
    (typeof item.reference==='string'&&item.reference.startsWith('https://')),
    'Référence non fiable : '+item.id);
  assert.ok(['PENDING','APPROVED','REJECTED'].includes(item.editorialApproval),
    'Approbation inconnue : '+item.id);
  const q=sourceById.get(item.id);
  assert.ok(q.choices.includes(q.answer),'Réponse QCM hors des choix : '+item.id);
}
const pending=report.cases.filter(x=>x.editorialApproval!=='APPROVED');
const critical=pending.filter(x=>x.priority==='P1');
const ready=report.releaseDecision==='GO'&&report.teacherApproval===true&&
  pending.length===0;
assert.ok(['HOLD','GO'].includes(report.releaseDecision),'Décision de publication inconnue');
if(report.releaseDecision==='GO')assert.ok(ready,
  'GO interdit tant que la validation enseignante et les 19 cas manquent');
if(ready)assert.equal(critical.length,0);
const result={
 schema:'QPJB_V2_AL_RELEASE_GATE_1',catalog:catalog.length,flags:flags.length,
 manifestCases:report.cases.length,notEditoriallyApproved:pending.length,
 criticalUnapproved:critical.map(x=>x.id),
 teacherApproval:report.teacherApproval,releaseDecision:report.releaseDecision,
 publicationReady:ready,mergedByThisScript:false,deployedByThisScript:false
};
console.log('QPJB-V2-AL-GATE '+JSON.stringify(result));
if(process.argv.includes('--require-ready')&&!ready){
  console.error('QPJB V2 : PUBLICATION BLOQUÉE — arbitrages et validation explicite requis');
  process.exitCode=1;
}
module.exports={result};
