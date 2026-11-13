'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const tokens=read('qpjb-design-tokens.css'),css=read('qpjb-bridge-ui.css');
for(const prop of ['--qpjb-card-radius','--qpjb-control-radius','--qpjb-control-height','--qpjb-component-gap','--qpjb-focus-outline']){
  assert(tokens.includes(prop+':'), 'Token absent : '+prop);
  assert(css.includes(prop+':'), 'Valeur de secours absente : '+prop);
}
for(const selector of ['.app-shell .stage','.app-shell .exercise-card','.app-shell .answers',
  '.qpjb-embedded :is(.panel,.tile,.item,.hero)',
  'body:has(#app) :is(.card,.item)']){
  assert(css.includes(selector), 'Parcours non harmonisé : '+selector);
}
for(const orig of ['[data-seat="north"]','[data-seat="south"]','[data-seat="east"]','[data-seat="west"]','#body .auc']){
  assert(css.includes(orig),'Le code couleur NS/EO original a été perdu : '+orig);
}
assert(!css.includes('display:none')&&!css.includes('pointer-events:none'),
  'B2 ne doit pas masquer les contrôles');
assert(!css.includes('localStorage')&&!css.includes('sessionStorage'),'Le CSS ne touche pas la progression');
console.log('QPJB B2 OK — trois parcours unifiés, axes NS/EO conservés.');
