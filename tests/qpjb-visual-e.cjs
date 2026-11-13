'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('qpjb-bridge-ui.css');
const e=css.slice(css.indexOf('QPJB E —'));
assert(css.includes('QPJB E —'),'Phase E absente');
for(const s of [
  '@media (max-width:600px)',
  '@media (max-width:360px)',
  'safe-area-inset-bottom',
  'safe-area-inset-left',
  'safe-area-inset-right',
  'touch-action:manipulation',
  'font-size:16px',
  '.app-shell .nextrow.session-navigation',
  '.app-shell #body .free-entry-row',
  '.qpjb-embedded .footnav',
  'body:has(#app) .filters',
  'prefers-reduced-motion'
])assert(e.includes(s),'Règle de confort mobile manquante : '+s);
for(const [name,file] of [
 ['Quiz','quizz.html'],['Entraînement','entrainement/index.html'],
 ['Originaux','entrainement/originaux.html']
])assert(read(file).includes('qpjb-bridge-ui.css?v=20261113e'),name+': CSS non chargé en version E');
for(const seat of ['north','south','east','west'])
  assert(css.includes('[data-seat="'+seat+'"]'),'Position réelle du joueur perdue : '+seat);
for(const required of ['QPJB B2','QPJB C —','QPJB D —'])
  assert(css.includes(required),'Phase antérieure manquante : '+required);
for(const forbidden of ['position:fixed','position:sticky','overflow-x:hidden','localStorage',
  'sessionStorage','pointer-events:none','display:none'])
  assert(!e.includes(forbidden),'Effet potentiellement intrusif dans CSS E : '+forbidden);
console.log('QPJB E OK — mobile 320–600 px, cibles tactiles, encoches, clavier, NS/EO et progression préservés.');
