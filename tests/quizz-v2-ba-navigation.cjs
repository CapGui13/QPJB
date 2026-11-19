'use strict';
// BA: gardien statique de la navigation QPJB -> Quiz -> AZ.
// Aucun test ne peut publier la branche ni modifier les QCM.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const quiz=read('quizz.html');
const az=read('preview/v2-az/parcours-v2-adaptatif.html');
const student=read('preview/v2-eleve/parcours-sef-65.html');
const template=read('templates/parcours-v2-ay-live.html');
const start='<div id="parcours-v2-preview-wrap" hidden style="display:none;';
const section=quiz.slice(quiz.indexOf(start),quiz.indexOf('</div>',quiz.indexOf(start))+6);
assert.ok(section.startsWith(start),'Panneau de test masqué par défaut');
const target='./preview/v2-eleve/parcours-sef-65.html';
assert.equal((quiz.match(/id="parcours-v2-az-preview-link"/g)||[]).length,1);
assert.ok(section.includes('id="parcours-v2-preview-link"'));
assert.ok(section.includes('href="'+target+'"'));
assert.ok(section.includes('id="parcours-v2-az-preview-link"'));
assert.ok(section.includes('target="_blank" rel="noopener noreferrer"'));
assert.ok(quiz.includes("new URLSearchParams(location.search).get('v2preview')==='1'"));
assert.ok(quiz.includes('ajV2PreviewWrap.hidden=false'));
assert.ok(index.includes("new URLSearchParams(location.search).get('v2preview')==='1'?'&v2preview=1':''"));
assert.ok(az.includes('id="az-return-v1" href="../../quizz.html?v2preview=1"'));
assert.ok(!quiz.includes('href="./preview/v2-az/parcours-v2-adaptatif.html"'));
assert.ok(quiz.includes('65 séances de 10 QCM SEF'));
assert.ok(template.includes('id="az-return-v1" href="../../quizz.html?v2preview=1"'));
assert.equal((az.match(/id="az-return-v1"/g)||[]).length,1);
assert.ok(!quiz.includes('window.localStorage.setItem("qpjb-preview-v2-az-01"'));
const quizToken='<script id="training-data" type="application/json">';
const i=quiz.indexOf(quizToken);
assert.ok(i>=0);
const quizData=JSON.parse(quiz.slice(i+quizToken.length,quiz.indexOf('</script>',i+quizToken.length))).exercises;
assert.equal(quizData.length,1523);
assert.equal(new Set(quizData.map(x=>x.id)).size,1523);
const token='<script id="ay-payload" type="application/json">';
const j=az.indexOf(token);
assert.ok(j>=0);
const payload=JSON.parse(az.slice(j+token.length,az.indexOf('</script>',j+token.length)));
assert.equal(payload.catalog.length,1523);
assert.equal(payload.addons.length,8);
assert.equal(payload.releaseDecision,'HOLD');
assert.equal(payload.sourceModified,false);
const byId=new Map(quizData.map(x=>[x.id,x]));
for(const q of payload.catalog){
 assert.deepEqual(q,byId.get(q.id),'QCM source différent dans AZ : '+q.id);
}
assert.ok(payload.addons.every(x=>!byId.has(x.id)));
const studentTag='<script id="ay-payload" type="application/json">';
const s=student.indexOf(studentTag);
assert.ok(s>=0,'Données du parcours élève absentes');
const studentData=JSON.parse(student.slice(s+studentTag.length,
 student.indexOf('</script>',s+studentTag.length)));
assert.equal(studentData.schema,'QPJB_V2_BG_STUDENT_PREVIEW_1');
assert.equal(studentData.catalog.length,1523);
assert.equal(studentData.addons.length,0,'Aucun complément ne doit être embarqué dans le HTML élève');
assert.equal(studentData.releaseDecision,'HOLD');
assert.deepEqual(studentData.catalog,quizData,'Le corpus élève doit être le corpus SEF original');
assert.ok(student.includes('const STUDENT_ONLY=true;'));
assert.ok(student.includes('qpjb-preview-v2-eleve-01'));
assert.ok(student.includes('function studentProgress()'),'Tableau élève non chargé');
assert.ok(student.includes('id="sef-session-grid"'),'Grille des 65 séances absente');
assert.ok(student.includes('.sef-grid'),'Styles de progression absents');
assert.ok(student.includes('id="az-return-v1" href="../../quizz.html?v2preview=1"'));
const studentScripts=[...student.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(studentScripts.length,5);
for(const item of studentScripts.slice(1))
 assert.doesNotThrow(()=>new Function(item[1]),'Script élève invalide');

const scripts=[...az.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length,5);
for(const item of scripts.slice(1))assert.doesNotThrow(()=>new Function(item[1]));
console.log('QPJB BA NAV PASS — 1523 QCM SEF identiques, élève 0 supplément, AZ 8 suppléments, navigation privée et syntaxe');
