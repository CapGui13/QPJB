'use strict';
// Contrat non-régression de l'affichage M4; aucune mutation du catalogue/stockage.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const test=require('node:test');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const read=name=>fs.readFileSync(path.join(root,name));
const marker='<script id="training-data" type="application/json">';
const start=html.indexOf(marker),end=html.indexOf('</script>',start+marker.length);
test('M4/UI - catalogue QCM conservé octet pour octet',()=>{
  assert.ok(start>=0&&end>start,'JSON embarqué manquant');
  const raw=html.slice(start+marker.length,end);
  assert.equal(crypto.createHash('sha256').update(raw,'utf8').digest('hex'),
    '22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a');
  const catalogue=JSON.parse(raw);
  assert.equal(catalogue.exercises.length,1523);
  assert.equal(catalogue.themes.length,22);
});
test('M4/UI - l’interface ne modifie pas le moteur adaptatif',()=>{
  const bytes=read('quizz-parcours.js');
  const blob=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(blob,'d0f06f1c259f7a766f2d1c8c47289374a74138dc');
});
test('M4/UI - panneau relié à l’API de lecture seule',()=>{
  assert.match(html,/id="parcours-recommendations"/);
  assert.match(html,/id="parcours-recommendations-list"/);
  assert.match(html,/id="parcours-recommendations-limits"/);
  assert.match(html,/<script src="\.\/parcours-recommandations\.js\?v=1"><\/script>/);
  assert.match(html,/QPJBParcoursRecommandations\.buildReport\(parcoursState/);
  assert.match(html,/parcoursRecommendations\(\);/);
  assert.match(html,/parcours-advice-observed/);
  assert.match(html,/parcours-advice-caveat/);
  assert.match(html,/parcours-advice-action/);
  assert.match(html,/const limitsHost=\$\('parcours-recommendations-limits'\)/);
  assert.match(html,/heading\.textContent=item\.title/);
  assert.match(html,/detail\.textContent=item\.message/);
});
test('M4/UI - les textes de preuve sont injectés comme texte, jamais comme HTML',()=>{
  const fragment=html.slice(html.indexOf('function parcoursRecommendations(){'),html.indexOf('function parcoursHomeStatus(){'));
  assert.match(fragment,/document\.createElement\('p'\)/);
  assert.match(fragment,/document\.createTextNode\(value\)/);
  assert.ok(!/innerHTML\s*=|insertAdjacentHTML/.test(fragment));
  assert.ok(!/localStorage\.setItem|QPJBParcours\.record|saveParcours\(/.test(fragment));
});
console.log('PASS M4/UI : garde-fous QCM, moteur, preuves et pureté');
