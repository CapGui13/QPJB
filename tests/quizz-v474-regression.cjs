'use strict';
// V4.74 : chaîne Blackwood 5 clés, question à la Dame, protection stricte des 1026 historiques.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'La base des exercices est embarquée');
const db=JSON.parse(mt[1]),xs=db.exercises,base=require('./quizz-baseline-1026-gitsha.json');
assert.ok(xs.length>=1036,'Les 1026 historiques et dix fiches V4.74 sont présents');
const old=JSON.stringify(xs.slice(0,base.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old,'utf8').digest('hex');
assert.equal(sha,base.gitBlobSha,'Empreinte immuable des 1026 exercices V4.73');
const map=new Map(xs.map(x=>[x.id,x]));
assert.equal(map.size,xs.length,'IDs uniques');
const points={A:4,R:3,D:2,V:1},valid=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const trumpSpade='Pique',trumpHeart='Cœur';
const qSpade5D=['Partenaire : 4SA (Blackwood 5 clés, atout Pique)','Vous : 5♦ (une clé)','Partenaire : 5♥ (question Dame de Pique)'];
const qSpade5C=['Partenaire : 4SA (Blackwood 5 clés, atout Pique)','Vous : 5♣ (trois clés)','Partenaire : 5♦ (question Dame de Pique)'];
const qHeart5C=['Partenaire : 4SA (Blackwood 5 clés, atout Cœur)','Vous : 5♣ (trois clés)','Partenaire : 5♦ (question Dame de Cœur)'];
const qHeart5D=['Partenaire : 4SA (Blackwood 5 clés, atout Cœur)','Vous : 5♦ (une clé)','Partenaire : 5♠ (question Dame de Cœur)'];
const specs=[
['001','5♥',14,[5,3,3,2],['Vous : 4SA (Blackwood 5 clés, atout Pique)','Partenaire : 5♦ (1 ou 4 clés)'], 'v474-question-pique-5d'],
['002','5♥',12,[3,5,3,2],['Vous : 4SA (Blackwood 5 clés, atout Cœur)','Partenaire : 5♦ (1 ou 4 clés)'], 'v474-arret-coeur-5d'],
['003','5♠',17,[3,5,2,3],['Vous : 4SA (Blackwood 5 clés, atout Cœur)','Partenaire : 5♦ (1 ou 4 clés)'], 'v474-question-coeur-5d'],
['004','5♠',6,[4,2,3,4],qSpade5D,'v474-pique-5d-non'],
['005','6♠',6,[4,2,3,4],qSpade5D,'v474-pique-5d-oui'],
['006','5♠',11,[4,2,3,4],qSpade5C,'v474-pique-5c-non'],
['007','6♠',13,[4,2,3,4],qSpade5C,'v474-pique-5c-oui'],
['008','5♥',11,[3,4,3,3],qHeart5C,'v474-coeur-5c-non'],
['009','6♥',13,[3,4,3,3],qHeart5C,'v474-coeur-5c-oui'],
['010','6♥',5,[3,4,3,3],qHeart5D,'v474-coeur-5d-non']
];
for(const [id,answer,h,shape,auction,family] of specs){
 const x=map.get('SEF-V474-'+id);assert.ok(x,'Missing V474 '+id);
 assert.equal(x.theme,'chelem',id+' thème');
 assert.equal(x.answer,answer,id+' réponse');
 assert.equal(x.h,h,id+' honneurs déclarés');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(z=>z.length),shape,id+' main de treize cartes');
 assert.equal(x.hand.flat().length,13,id+' main complète');
 assert.equal(x.hand.flat().reduce((n,c)=>n+(points[c]||0),0),h,id+' H recomptés');
 for(const suit of x.hand) assert.equal(new Set(suit).size,suit.length,id+' pas de cartes répétées');
 assert.deepEqual(x.auction,auction,id+' séquence exacte et réponse toujours légale');
 assert.equal(x.choices.length,4,id+' quatre options');
 assert.equal(new Set(x.choices).size,4,id+' choix uniques');
 assert.ok(x.choices.every(c=>valid.test(c)),id+' options au format valide');
 assert.ok(x.choices.includes(x.answer),id+' réponse incluse');
 assert.ok(x.context.length>100&&x.explain.length>100,id+' explications complètes');
 assert.ok(!x.whyNot&&!x.takeaway,id+' pas de justification affichée des distracteurs');
 assert.equal(x.caseFamily,family,id+' compétence propre');
}
const key=id=>map.get('SEF-V474-'+id);
const hasQ=(ex,suit)=>ex.hand[suit].includes('D');
assert.equal(key('001').hand[0].includes('D'),false,'001 question et Dame inconnue');
assert.equal(key('002').hand[1].includes('D'),false,'002 ne peut garantir la Dame');
assert.equal(key('003').hand[1].includes('D'),false,'003 interroge la Dame manquante');
for(const id of ['004','006'])assert.equal(hasQ(key(id),0),false,id+' Dame Pique absente');
for(const id of ['005','007'])assert.equal(hasQ(key(id),0),true,id+' Dame Pique présente');
for(const id of ['008','010'])assert.equal(hasQ(key(id),1),false,id+' Dame Cœur absente');
assert.equal(hasQ(key('009'),1),true,'009 Dame Cœur présente');
const keyCount=(ex,trump)=>ex.hand.reduce((n,s,i)=>n+(s.includes('A')?1:0)+(i===trump&&s.includes('R')?1:0),0);
assert.deepEqual([keyCount(key('001'),0),keyCount(key('002'),1),keyCount(key('003'),1)],[3,3,4],'Nombre de clés chez l’interrogateur');
for(const id of ['004','005','010'])assert.equal(keyCount(key(id),id==='010'?1:0),1,id+' a annoncé une clé');
for(const id of ['006','007','008','009'])assert.equal(keyCount(key(id),Number(id)>=8?1:0),3,id+' a annoncé trois clés');
const combos=new Set();
for(const x of xs){
 const signature=JSON.stringify([x.hand,x.auction]);
 assert.ok(!combos.has(signature),'Collision main/séquence '+x.id);
 combos.add(signature);
}
assert.equal(db.themes.length,22,'22 rubriques historiques conservées');
console.log('PASS | V4.74 1026 historiques protégés + 10 décisions de Dame d’atout et 30 distracteurs');
