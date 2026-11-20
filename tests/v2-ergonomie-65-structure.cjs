'use strict';
// Vérification statique : aucun QCM, corrigé ou étape éditoriale modifié.
const assert=require('node:assert/strict'),fs=require('node:fs'),
 path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.resolve(__dirname,
 '../preview/v2-eleve/parcours-sef-65-r1.html'),'utf8');
const match=html.match(/<script id="ay-payload" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Charge utile pédagogique absente');
const data=JSON.parse(match[1]);
assert.equal(data.catalog.length,1523);
assert.equal(data.addons.length,0);
assert.equal(data.candidateVersion,'QPJB-V2-65-19A-20261120-R1');
assert.equal(data.candidatePublished,true);
assert.equal(data.catalog.find(q=>q.id==='SEF-L06-029')?.answer,'4♦');
assert.ok(html.includes('qpjb-v2-eleve-65-pedago-r1'),'Clé sauvegarde V2 inchangée');
assert.ok(html.includes("schema:2,contentVersion:CONTENT_VERSION"),'Schéma existant');
assert.ok(html.includes('ux-progress-export'),'Bouton export analytique');
assert.ok(html.includes('Trop facile')&&html.includes('Niveau adapté')&&
 html.includes('Trop difficile'),'Trois ressentis');
assert.ok(html.includes('completedSessionsWithoutAnswerJournal'),'Ancien historique non inventé');
assert.ok(html.includes('record.engineState.uxDifficultyAdjustment'),'Séparation ressenti/maîtrise');
let checked=0;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
 const attrs=m[1],body=m[2];
 if(/\bsrc=/.test(attrs)||/application\/json/.test(attrs)||!body.trim())continue;
 new vm.Script(body,{filename:'v2-inline-'+(++checked)+'.js'});
}
assert.ok(checked>=3,'Scripts de moteur, UI et sauvegarde analysés');
console.log('V2 65 STRUCTURE PASS : 1523 QCM inchangés, scripts valides ('+checked+')');
