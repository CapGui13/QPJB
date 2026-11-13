'use strict';
// Phase D: mise en valeur de la progression et des explications, sans changement de contenu.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const dir=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const css=read('qpjb-bridge-ui.css');
for(const v of [
  'QPJB D — progression & corrections',
  '.app-shell #session-card #step',
  '.app-shell #session-card .session-progress',
  '.app-shell #body .answers button.good',
  '.app-shell #body .answers button.bad',
  '.app-shell #body .feedback',
  '.qpjb-embedded .topic-progress-track',
  '.qpjb-embedded .pbar',
  '.qpjb-embedded :is(.choice,.cq-option).correct',
  '.qpjb-embedded :is(.choice,.cq-option).wrong',
  'body:has(#app) .analysis',
  '@media(max-width:400px)'
])assert(css.includes(v),'Style D absent: '+v);
for(const v of ['[data-seat="north"]','[data-seat="south"]','[data-seat="east"]','[data-seat="west"]','#body .auc']){
  assert(css.includes(v),'Palette NS/EO endommagée: '+v);
}
for(const [name,html] of [['Quiz',read('quizz.html')],['Entraînement',read('entrainement/index.html')],['Originaux',read('entrainement/originaux.html')]]){
  assert(/qpjb-bridge-ui\.css\?v=20261113[de]/.test(html),name+': cache CSS non actualisé');
}
const d=css.slice(css.indexOf('QPJB D —'));
for(const v of ['localStorage','sessionStorage','pointer-events:none','display:none']){
  assert(!d.includes(v),'La phase D ne doit pas modifier les interactions: '+v);
}
assert(d.includes('prefers-reduced-motion'),'Le mode mouvement réduit doit être conservé');
console.log('QPJB UI D OK — avancement, bonnes/mauvaises réponses, explications, mobile, NS/EO');
