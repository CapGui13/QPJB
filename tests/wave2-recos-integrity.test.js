'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name));
function gitBlob(bytes){
  return crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
test('P9 garde-fou : moteur V1 conservé bit à bit depuis la base',()=>{
  assert.equal(gitBlob(read('quizz-parcours.js')),'d0f06f1c259f7a766f2d1c8c47289374a74138dc');
});
test('P9 garde-fou : le gros HTML contenant les 1523 QCM est intact',()=>{
  assert.equal(gitBlob(read('quizz.html')),'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7');
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
