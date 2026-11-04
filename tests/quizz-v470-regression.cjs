'use strict';
// Vérifie que les nouvelles fiches utiles demeurent valides au-delà de V4.70.
// En complément, quizz-integrity.cjs protège la sérialisation des 993 originaux.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'La base QPJB doit rester accessible');
const db=JSON.parse(mt[1]),arr=db.exercises;
const lookup=new Map(arr.map(x=>[x.id,x]));
assert.equal(lookup.size,arr.length,'Pas de duplication d ID');
assert.ok(arr.length>=1004,'Conserver les 993 anciens + 11 nouveaux');
const ids=Array.from({length:11},(_,i)=>'SEF-V470-'+String(i+1).padStart(3,'0'));
const points={A:4,R:3,D:2,V:1};
const legal=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
for(const id of ids){
 const x=lookup.get(id);
 assert.ok(x,'Fiche pilote absente : '+id);
 assert.equal(x.hand.length,4,id+' quatre couleurs');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 assert.deepEqual(x.hand.map(s=>s.length),x.shape,id+' distribution');
 assert.equal(x.hand.flat().reduce((sum,c)=>sum+(points[c]||0),0),x.h,id+' points H');
 for(const suit of x.hand){assert.equal(new Set(suit).size,suit.length,id+' cartes dupliquées');}
 assert.equal(x.choices.length,4,id+' quatre propositions');
 assert.equal(new Set(x.choices).size,4,id+' propositions différentes');
 for(const bid of x.choices)assert.match(bid,legal,id+' enchère illégale');
 assert.ok(x.choices.includes(x.answer),id+' bonne réponse proposée');
 assert.ok(x.explain.length>=80,id+' explication insuffisante');
 assert.ok(!x.whyNot&&!x.takeaway,id+' pas de faux corrigés');
 assert.ok(x.caseFamily?.startsWith('v470-'),id+' famille dédiée');
}
const simple=(id)=>lookup.get('SEF-V470-'+id);
assert.equal(simple('001').answer,'Passe');
assert.ok(simple('001').choices.includes('2♥'),'Piège : soutenir avec 2 Cœurs');
assert.equal(simple('002').h,8,'Réponse 1SA sans cas limite 6H');
assert.equal(simple('002').answer,'1SA');
assert.equal(simple('003').answer,'1♠');
assert.equal(simple('004').answer,'2♥');
assert.equal(simple('005').answer,'2SA');
assert.equal(simple('005').shape[1],4,'Truscott 4 atouts');
assert.equal(simple('006').answer,'Surcontre');
assert.equal(simple('006').shape[1],3,'Surcontre fitté seulement 3 cartes');
assert.equal(simple('007').answer,'Passe');
assert.equal(simple('008').answer,'Contre');
assert.equal(simple('009').answer,'2SA');
assert.deepEqual(simple('009').hand[1].slice(0,2),['A','R'],'Intervention SA deux arrêts sûrs');
assert.equal(simple('010').answer,'2♠');
assert.equal(simple('011').answer,'3♥');
for(const id of ids){const x=lookup.get(id);assert.ok(x.auction.length<=2);assert.ok(['apres_inter','intervenir'].includes(x.theme),id+' thème');}
console.log('PASS | 11 V4.70 fiches recensées, 33 distracteurs, mains et garde-fous SEF');
