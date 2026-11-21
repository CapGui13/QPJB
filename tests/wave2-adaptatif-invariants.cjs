#!/usr/bin/env node
'use strict';
// M2 P9 — garde de non-mutation des fichiers hors catalogue et du moteur.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function blob(file){
 const bytes=fs.readFileSync(file);
 return crypto.createHash('sha1')
   .update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
const root=path.join(__dirname,'..');
const engine=path.join(root,'quizz-parcours.js');
const htmlFile=path.join(root,'quizz.html');
assert.equal(blob(engine),'d0f06f1c259f7a766f2d1c8c47289374a74138dc',
 'Le moteur doit rester strictement identique à la base historique (test LOT B SHA)');
assert.equal(blob(htmlFile),'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7',
 'Le catalogue SEF doit rester strictement identique (aucun QCM modifié)');
const html=fs.readFileSync(htmlFile,'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(m,'Catalogue embarqué absent');
const cat=JSON.parse(m[1]);
assert.equal(cat.exercises.length,1523);
assert.equal(new Set(cat.exercises.map(x=>x.id)).size,1523);
assert.equal(cat.themes.length,22);
console.log('PASS: moteur et catalogue identiques au blob Git de référence, 1523 QCM/22 rubriques');
