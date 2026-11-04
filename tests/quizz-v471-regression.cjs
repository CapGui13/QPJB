'use strict';
// V4.71 : 6 décisions pédagogiques distinctes après intervention du joueur 4.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'JSON embarqué présent');
const db=JSON.parse(mt[1]),xs=db.exercises,ref=require('./quizz-baseline-1004-gitsha.json');
const base=JSON.stringify(xs.slice(0,ref.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(base,'utf8')+'\0'+base,'utf8').digest('hex');
assert.equal(sha,ref.gitBlobSha,'Les 1004 objets V4.70 doivent rester identiques');
assert.equal(xs.length,1010,'1010 fiches V4.71, ni moins ni plus');
const lookup=new Map(xs.map(x=>[x.id,x]));
assert.equal(lookup.size,xs.length,'IDs uniques');
const answers=['Passe','1SA','2♥','2♦','2SA','1SA'];
const scores=[14,14,13,12,18,13];
const pts={A:4,R:3,D:2,V:1};
const free=['Vous : 1♦','Adversaire : Passe','Partenaire : 1♥','Adversaire : 1♠'];
const forced=['Vous : 1♦','Adversaire : 1♥','Partenaire : 1♠','Adversaire : Passe'];
for(let i=0;i<6;i++){
 const id='SEF-V471-'+String(i+1).padStart(3,'0'),x=lookup.get(id);
 assert.ok(x,id+' présent');
 assert.equal(x.theme,'red',id+' rubrique');
 assert.equal(x.h,scores[i],id+' points H');
 assert.deepEqual(x.hand.map(a=>a.length),x.shape,id+' distribution');
 assert.equal(x.hand.flat().length,13,id+' treize cartes');
 assert.equal(x.hand.flat().reduce((n,r)=>n+(pts[r]||0),0),x.h,id+' recomptage');
 for(const suit of x.hand)assert.equal(new Set(suit).size,suit.length,id+' cartes distinctes');
 assert.deepEqual(x.auction,i===5?forced:free,id+' quatre tours de table');
 assert.equal(x.choices.length,4,id+' quatre options');
 assert.equal(new Set(x.choices).size,4,id+' options uniques');
 assert.ok(x.choices.includes(x.answer),id+' bonne option proposée');
 assert.equal(x.answer,answers[i],id+' réponse attendue');
 assert.ok(x.explain.length>=100,id+' explication pédagogique');
 assert.ok(!x.whyNot&&!x.takeaway,id+' corrigé limité à la bonne réponse');
 assert.ok(x.caseFamily.startsWith('v471-'),id+' famille');
}
assert.deepEqual(lookup.get('SEF-V471-001').hand[0],['8','6','3'],'Passe sans arrêt Pique');
assert.deepEqual(lookup.get('SEF-V471-002').hand[0][0],'A','1SA libre avec As de Pique');
assert.equal(lookup.get('SEF-V471-003').shape[1],4,'2♥ avec fit quatrième');
assert.equal(lookup.get('SEF-V471-004').shape[2],6,'2♦ avec Carreaux sixièmes');
assert.deepEqual(lookup.get('SEF-V471-005').hand[0].slice(0,2),['A','R'],'2SA avec double arrêt');
assert.ok(!lookup.get('SEF-V471-006').hand[1].some(x=>['A','R','D','V'].includes(x)),'1SA forcé sans arrêt Cœur');
const situ=new Set();
for(const x of xs){const k=JSON.stringify([x.hand,x.auction]);assert.ok(!situ.has(k),'Main + séquence déjà rencontrées : '+x.id);situ.add(k)}
console.log('PASS | V4.71 : 1004 protégés + 6 situations contrastives SEF');
