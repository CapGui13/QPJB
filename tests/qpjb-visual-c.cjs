'use strict';
// Phase C : architecture UI seulement ; pas de contenu pédagogique modifié.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..');
const get=p=>fs.readFileSync(path.join(dir,p),'utf8');
const css=get('qpjb-bridge-ui.css');
const quiz=get('quizz.html');
const training=get('entrainement/index.html');
const originals=get('entrainement/originaux.html');
assert.match(css,/QPJB C — hiérarchie/);
for(const s of [
 '.app-shell .qpjb-quiz-nav',
 'body.session-mode .app-shell #session-card',
 '.app-shell #body .seat-headline',
 '.app-shell #body .question',
 '.app-shell #body .free-answer-form',
 '.app-shell .nextrow.session-navigation',
 '.qpjb-embedded .quizgrid .panel',
 '.qpjb-embedded .quizgrid .q',
 '.qpjb-embedded .footnav',
 'body:has(#app) .question'
])assert(css.includes(s),'Style C non présent : '+s);
for(const [name,html] of [['Quiz',quiz],['Entraînement',training],['Originaux',originals]]){
 assert(/qpjb-bridge-ui\.css\?v=20261113[cde]/.test(html),name+': version CSS périmée');
}
for(const term of [
 '[data-seat="north"]','[data-seat="south"]','[data-seat="east"]','[data-seat="west"]',
 '#body .auc tbody td:not(.ask):nth-child(odd)',
 '#body .auc tbody td:not(.ask):nth-child(even)'
])assert(css.includes(term),'Couleurs des partenaires perdues : '+term);
assert(css.includes('@media(max-width:400px)'),'Traitement mobile absent');
assert(css.includes('prefers-reduced-motion'),'Animations réduites absentes');
for(const forbidden of ['localStorage','sessionStorage','pointer-events:none','display:none'])assert(!css.slice(css.indexOf('QPJB C —')).includes(forbidden),'CSS C modifie le comportement : '+forbidden);
console.log('QPJB C OK — question, navigation et progression stylées sur 3 parcours, axe réel et données préservés');
