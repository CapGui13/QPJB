'use strict';
// V4.72 : six décisions ciblées, protection stricte des 1010 fiches publiées.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const html = fs.readFileSync(path.join(__dirname, '..', 'quizz.html'), 'utf8');
const match = html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match, 'JSON des exercices embarqué');
const data = JSON.parse(match[1]), xs = data.exercises;
const baseline = require('./quizz-baseline-1010-gitsha.json');
assert.ok(xs.length >= 1016, '1010 historiques + six décisions V4.72');
const protectedJson = JSON.stringify(xs.slice(0,baseline.count));
const hash = createHash('sha1').update('blob '+Buffer.byteLength(protectedJson,'utf8')+'\0'+protectedJson,'utf8').digest('hex');
assert.equal(hash, baseline.gitBlobSha, 'Toutes les 1010 fiches historiques restent strictement inchangées');
const byId = new Map(xs.map(x => [x.id, x]));
assert.equal(byId.size, xs.length, 'IDs tous uniques');
const p = {A:4,R:3,D:2,V:1};
const cards = new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const legal = /^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const cases = [
 {id:'001',answer:'2SA',theme:'apres_inter',h:9,shape:[2,3,5,3],auction:['Partenaire : 1♦','Adversaire : Contre']},
 {id:'002',answer:'3♦',theme:'apres_inter',h:4,shape:[3,3,6,1],auction:['Partenaire : 1♦','Adversaire : Contre']},
 {id:'003',answer:'2♣',theme:'apres_inter',h:8,shape:[3,3,2,5],auction:['Partenaire : 1♣','Adversaire : Contre']},
 {id:'004',answer:'Surcontre',theme:'apres_inter',h:12,shape:[3,3,3,4],auction:['Partenaire : 1♣','Adversaire : Contre']},
 {id:'005',answer:'Contre',theme:'red',h:13,shape:[2,3,5,3],auction:['Vous : 1♦','Adversaire : Passe','Partenaire : 1♥','Adversaire : 1♠']},
 {id:'006',answer:'Surcontre',theme:'red',h:13,shape:[3,5,2,3],auction:['Vous : 1♥','Adversaire : Passe','Partenaire : 1♠','Adversaire : Contre']}
];
for(const c of cases){
 const id='SEF-V472-'+c.id, x=byId.get(id);
 assert.ok(x, 'Exercice absent : '+id);
 assert.equal(x.answer,c.answer,id+' bonne réponse');
 assert.equal(x.theme,c.theme,id+' rubrique');
 assert.equal(x.h,c.h,id+' points H');
 assert.deepEqual(x.shape,c.shape,id+' distribution prévue');
 assert.deepEqual(x.hand.map(s=>s.length),c.shape,id+' 13 cartes');
 assert.equal(x.hand.flat().length,13,id+' longueur de main');
 assert.equal(x.hand.flat().reduce((sum,r)=>sum+(p[r]||0),0),c.h,id+' recomptage honneurs');
 for(const suit of x.hand){
   assert.equal(new Set(suit).size,suit.length,id+' carte répétée');
   assert.ok(suit.every(r=>cards.has(r)),id+' hauteur valide');
 }
 assert.deepEqual(x.auction,c.auction,id+' séquence');
 assert.equal(x.choices.length,4,id+' quatre distracteurs');
 assert.equal(new Set(x.choices).size,4,id+' choix distincts');
 assert.ok(x.choices.includes(x.answer),id+' bonne réponse présente');
 assert.ok(x.choices.every(z=>legal.test(z)),id+' format enchères');
 assert.ok(x.context.length>80 && x.explain.length>=100,id+' énoncé et corrigé');
 assert.ok(!x.whyNot&&!x.takeaway,id+' pas de justification des mauvaises réponses visible');
 assert.ok(x.caseFamily.startsWith('v472-'),id+' famille');
}
assert.equal(byId.get('SEF-V472-001').shape[2],5,'2SA mineur : 5 Carreaux');
assert.equal(byId.get('SEF-V472-003').shape[3],5,'2 Trèfles simple : 5 cartes');
assert.equal(byId.get('SEF-V472-004').shape[3],4,'Surcontre : pas de fit cinquième');
assert.equal(byId.get('SEF-V472-005').shape[1],3,'Contre de soutien : exactement 3 Cœurs');
assert.equal(byId.get('SEF-V472-006').shape[0],3,'Surcontre de soutien : exactement 3 Piques');
const unique = new Set();
for(const x of xs){
 const key=JSON.stringify([x.hand,x.auction]);
 assert.ok(!unique.has(key),'Collision main/séquence '+x.id);
 unique.add(key);
}
console.log('PASS | V4.72 : 1010 historiques immuables et six QCM contrôlés');
