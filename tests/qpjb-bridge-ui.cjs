'use strict';
// UI bridge : ne modifier ni les données du Quiz SEF ni la progression Entraînement.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('qpjb-bridge-ui.css');
const quiz=read('quizz.html');
const train=read('entrainement/index.html');
const orig=read('entrainement/originaux.html');
const app=read('entrainement/training-app.js');

for(const [name,html] of [['Quiz SEF',quiz],['Entraînement',train],['Originaux',orig]]){
  assert.match(html,/qpjb-bridge-ui\.css\?v=20261113a/,name+' : CSS commun absent');
}
for(const c of ['#e7f2ff','#cfe5ff','#fff0e3','#f8dfc9','#263f58','#513c30']){
  assert(css.includes(c),'Couleur NS/EO manquante : '+c);
}
assert(css.includes('data-seat="north"')&&css.includes('data-seat="south"'),'NS : utiliser les sièges réels');
assert(css.includes('data-seat="east"')&&css.includes('data-seat="west"'),'EO : utiliser les sièges réels');
assert(css.includes('#body .auc'),'Quiz SEF : styles enchères manquants');
assert(css.includes('.auction-table'),'Entraînement : styles enchères manquants');
assert(css.includes('.deal-marker'),'Repères des joueurs manquants');
assert(css.includes('td:not(.ask)'),'Ne pas colorer la case demandée comme une réponse validée');
assert(app.includes('physical=pos') && app.includes('data-seat='),'Entraînement : carte orientée doit garder son siège physique');
assert(quiz.includes('<script id="training-data" type="application/json">'),'Quiz : données historiques conservées');
assert(!css.includes('localStorage'),'La feuille ne doit pas modifier la progression');
console.log('QPJB BRIDGE UI OK — 3 modules, 2 camps, orientation réelle, état réponse préservé.');
