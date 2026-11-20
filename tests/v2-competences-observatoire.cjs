'use strict';
// Contrat pédagogique : pas de maîtrise fictive, pas de verrou de prérequis,
// sauvegarde et catalogue identiques ; comptage à partir des sources effectives.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {report,rows}=require('../scripts/v2-competences-audit.cjs');
const html=fs.readFileSync(path.join(__dirname,
 '../preview/v2-eleve/parcours-sef-65-r1.html'),'utf8');
assert.equal(report.total,1523);
assert.equal(report.themes,22);
assert.equal(report.coverage.contextsByDeterministicHeuristic,903);
assert.equal(report.coverage.candidateClassificationsNeedingReview,79);
assert.equal(report.coverage.withoutFineMapping,541);
assert.equal(rows.filter(x=>x.status==='PRECLASSIFICATION_A_VALIDER').length,79);
assert.ok(rows.some(x=>x.id==='SEF-L06-029'&&x.status==='PRECLASSIFICATION_A_VALIDER'));
assert.equal(report.pedagogicalSafeguards.certifyMastery,false);
assert.equal(report.pedagogicalSafeguards.manualUnlock,false);
assert.equal(report.pedagogicalSafeguards.hardPrerequisites,false);
assert.equal(report.pedagogicalSafeguards.alterSaveSchema,false);
assert.ok(html.includes('function studentCompetences()'));
assert.ok(html.includes('readonly+studentProgress()+studentCompetences()+'));
assert.ok(html.includes("studentProgress()+studentCompetences()+"));
assert.ok(html.includes('une notion rencontrée n’est pas une notion maîtrisée'));
assert.ok(html.includes('Aucun de ces indicateurs ne bloque la séance suivante'));
assert.ok(html.includes("window.QPJBParcours.MICRO_LABELS"));
assert.ok(html.includes("Classification candidate"));
assert.ok(html.includes("qpjb-v2-eleve-65-pedago-r1"));
assert.ok(html.includes("schema:2,contentVersion:CONTENT_VERSION"));
let n=0;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
 const attrs=m[1],body=m[2];
 if(/\bsrc=/.test(attrs)||/application\/json/.test(attrs)||!body.trim())continue;
 new vm.Script(body,{filename:'v2-inline-'+(++n)+'.js'});
}
assert.ok(n>=3);
console.log('QPJB V2 OBSERVATOIRE PASS : provenance 903/79/541, vue sans maîtrise ni verrou');
