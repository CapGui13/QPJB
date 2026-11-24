#!/usr/bin/env node
'use strict';
// M2 P14 : figer le contenu pedagogique JSON, sans bloquer la future UX M3.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
function blob(file){
 const bytes=fs.readFileSync(file);
 return crypto.createHash('sha1')
   .update('blob '+bytes.length+'\0').update(bytes).digest('hex');
}
function extractCatalogueJson(html){
 const regex=/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/g;
 const matches=[...html.matchAll(regex)];
 assert.equal(matches.length,1,'Un et un seul catalogue JSON embarque doit exister');
 return matches[0][1];
}
function fingerprint(str){
 let hash=0x811c9dc5;
 for(let i=0;i<str.length;i++)hash=Math.imul(hash^str.charCodeAt(i),0x01000193)>>>0;
 return hash.toString(16).padStart(8,'0');
}
function verify(){
 const root=path.join(__dirname,'..');
 const engine=path.join(root,'quizz-parcours.js');
 const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
 const {restoreEngine,gitBlob}=require('./qpjb-sef-global29-normalization.cjs');
 assert.equal(gitBlob(restoreEngine(require('./progression-guidee-historical.cjs').source())),'d0f06f1c259f7a766f2d1c8c47289374a74138dc',
   'Le moteur doit rester identique au contrat historique LOT B');
 const json=extractCatalogueJson(html);
 require('./progression-guidee-historical.cjs').catalogue();
 validateApproved(json);
 const historicalJson=restoreApprovedContexts(json);
 // Empreinte du JSON de la base figee, independamment du HTML (cf. quizz-ui-vnext-static.cjs).
 assert.equal(historicalJson.length,1741625,'Longueur du catalogue JSON pedagogique modifiee');
 assert.equal(fingerprint(historicalJson),'5eba3d0a','Contenu du catalogue JSON pedagogique modifie');
 const catalogue=JSON.parse(json);
 assert.equal(catalogue.exercises.length,1523);
 assert.equal(new Set(catalogue.exercises.map(x=>x.id)).size,1523);
 assert.equal(catalogue.themes.length,22);
 console.log('PASS: moteur historique et JSON pedagogique intacts, 1523 QCM/22 rubriques; UI HTML libre');
}
if(require.main===module)verify();
module.exports={extractCatalogueJson,fingerprint,verify};
