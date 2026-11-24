'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name));
function gitBlob(bytes){
  return crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
test('P9 garde-fou : moteur V1 conservé bit à bit depuis la base',()=>{
  const {restoreEngine}=require('./qpjb-sef-global29-normalization.cjs');
  const historical=require('./progression-guidee-historical.cjs');
  assert.equal(gitBlob(Buffer.from(restoreEngine(historical.source()),'utf8')),'d0f06f1c259f7a766f2d1c8c47289374a74138dc');
  // #293 : version candidate M2 et correctif de provenance #301 explicitement autorisés.
  assert.equal(gitBlob(read('quizz-parcours.js')),'fd2e478f4836808928e8e94f442684b06045695c','Moteur candidat différent du livrable M2 et du correctif de provenance #301');
});
test('P9 garde-fou : le JSON des 1523 QCM est intact malgré l’UI M3',()=>{
  const html=read('quizz.html').toString('utf8');
  const marker='<script id="training-data" type="application/json">';
  const start=html.indexOf(marker),end=html.indexOf('</script>',start+marker.length);
  assert.ok(start>=0&&end>start,'Charge JSON des QCM absente');
  const raw=html.slice(start+marker.length,end);
  validateApproved(raw);
  assert.equal(crypto.createHash('sha256').update(restoreApprovedContexts(raw),'utf8').digest('hex'),'22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a');
  assert.equal(JSON.parse(raw).exercises.length,1523);
});
test('P9 garde-fou : module recommandations sans DOM, stockage ni réseau',()=>{
  const src=read('parcours-recommandations.js').toString('utf8');
  for(const signature of ['localStorage','sessionStorage','indexedDB','document.','XMLHttpRequest','fetch(']){
    assert.equal(src.includes(signature),false,signature);
  }
  assert.match(src,/return \{VERSION,OUTCOMES,outcome,buildReport\}/);
});

test('P13 garde-fou : aucun chargeur CI éphémère ne reste en production',()=>{
  const src=read('parcours-recommandations.js').toString('utf8');
  assert.equal(src.includes('GITHUB_HEAD_REF'),false);
  assert.equal(src.includes('SONDE CI TEMPORAIRE'),false);
  assert.equal(src.includes("require('./tests/wave2-recos-"),false);
});

test('P25 garde-fou : aucun crochet GitHub Actions ni exploration de tests dans le module',()=>{
  const src=read('parcours-recommandations.js').toString('utf8');
  for(const snippet of ['GITHUB_ACTIONS','PASSE 22 : adaptateur',
    'process.argv[1]','readdirSync(',"require('node:fs')"]){
    assert.equal(src.includes(snippet),false,snippet);
  }
});
