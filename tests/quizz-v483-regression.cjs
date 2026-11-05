'use strict';
const assert = require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Base intégrée au Quiz');
const db=JSON.parse(m[1]),xs=db.exercises;
const base=require('./quizz-baseline-1145-gitsha.json');
assert.ok(xs.length>=1161,'1145 anciens et 16 contrôles de chelem');
assert.equal(db.themes.length,22,'22 rubriques inchangées');
const serialized=JSON.stringify(xs.slice(0,base.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(serialized,'utf8')+'\0'+serialized,'utf8').digest('hex');
assert.equal(sha,base.gitBlobSha,'Empreinte des 1145 historiques, ordre et contenu');
const ids=new Map(xs.map(x=>[x.id,x]));
assert.equal(ids.size,xs.length,'IDs uniques');
const order={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const rank=b=>{const m=String(b).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+order[m[2]]:null};
const hcp={A:4,R:3,D:2,V:1},ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const ac=['Partenaire : 1♠','Adversaire : Passe','Vous : 3♠ (soutien avec quatre atouts)','Adversaire : Passe','Partenaire : 4♣ (contrôle Trèfle, exploration du chelem)','Adversaire : Passe'];
const ad=['Partenaire : 1♠','Adversaire : Passe','Vous : 3♠ (soutien avec quatre atouts)','Adversaire : Passe','Partenaire : 4♦ (contrôle Carreau, exploration du chelem)','Adversaire : Passe'];
const chC=['4♦','4♥','4♠','4SA'],chD=['4♥','4♠','4SA','5♣'];
const expected=[
['001','c',10,[4,3,3,3],'4♦'],
['002','c',10,[4,3,3,3],'4♦'],
['003','c',8,[4,4,1,4],'4♦'],
['004','c',6,[4,4,0,5],'4♦'],
['005','c',9,[4,3,3,3],'4♥'],
['006','c',9,[4,3,3,3],'4♥'],
['007','c',7,[4,1,4,4],'4♥'],
['008','c',10,[4,3,3,3],'4♠'],
['009','c',9,[4,3,3,3],'4♠'],
['010','c',9,[4,1,4,4],'4♦'],
['011','d',9,[4,3,3,3],'4♥'],
['012','d',9,[4,3,3,3],'4♥'],
['013','d',8,[4,1,4,4],'4♥'],
['014','d',10,[4,3,3,3],'4♠'],
['015','d',6,[4,0,4,5],'4♥'],
['016','d',10,[4,3,3,3],'4♠']
];
const signatures=new Set();
for(const x of xs){
 const key=JSON.stringify([x.auction,x.hand]);
 assert.ok(!signatures.has(key),'Aucune duplication séquence-main : '+x.id);
 signatures.add(key);
}
const control=cards=>cards.length<=1||cards.includes('A')||cards.includes('R');
for(const [n,k,H,shape,answer] of expected){
 const id='SEF-V483-'+n,x=ids.get(id);
 assert.ok(x,id+' présent');
 assert.equal(x.theme,'chelem',id+' bonne rubrique');
 assert.deepEqual(x.auction,k==='c'?ac:ad,id+' séquence validée');
 assert.equal(x.answer,answer,id+' réponse indépendante');
 assert.deepEqual(x.choices,k==='c'?chC:chD,id+' quatre choix comparables');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(c=>c.length),shape,id+' distribution affichée');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 for(const suit of x.hand){
  assert.ok(suit.every(c=>ranks.has(c)),id+' rangs valides');
  assert.equal(new Set(suit).size,suit.length,id+' sans doublon dans chaque couleur');
 }
 assert.equal(x.hand.flat().reduce((sum,c)=>sum+(hcp[c]||0),0),H,id+' points H recalculés');
 assert.equal(x.h,H,id+' points affichés');
 assert.equal(shape[0],4,id+' soutien Pique à quatre cartes');
 assert.equal(x.choices.length,4,id+' quatre distracteurs + réponse');
 assert.equal(new Set(x.choices).size,4,id+' options distinctes');
 assert.ok(x.choices.includes(x.answer),id+' réponse proposée');
 const last=rank(k==='c'?'4♣':'4♦');
 assert.ok(x.choices.every(c=>rank(c)!==null&&rank(c)>last),id+' contrats licites');
 assert.deepEqual(x.choices.map(rank),x.choices.map(rank).toSorted((a,b)=>a-b),id+' ordre de cherté');
 const expectedBid=k==='c'?(control(x.hand[2])?'4♦':control(x.hand[1])?'4♥':'4♠'):(control(x.hand[1])?'4♥':'4♠');
 assert.equal(x.answer,expectedBid,id+' bon contrôle/dénégation, validé sur les cartes');
 assert.ok(x.context.length>=220&&x.explain.length>=175,id+' énoncé et justification suffisants');
 assert.ok(!x.whyNot&&!x.takeaway,id+' justification de la bonne réponse seulement');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté');
}
assert.equal(expected.filter(x=>x[4]==='4♠').length,4,'Quatre coups de frein distincts');
assert.equal(expected.filter(x=>x[4]==='4♦').length,5,'Cinq contrôles Carreau');
assert.equal(expected.filter(x=>x[4]==='4♥').length,7,'Sept contrôles Cœur');
console.log('PASS | V4.83 : 1145 historiques intacts ; 16 contrôles de chelem, 48 distracteurs, courts, H et contrôle recalculés');

