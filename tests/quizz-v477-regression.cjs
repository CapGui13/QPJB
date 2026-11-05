'use strict';
// Quiz V4.77 — réponses aux Michaël précisés : intégrité et 14 décisions utiles.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'La base JSON intégrée doit exister');
const db=JSON.parse(mt[1]),xs=db.exercises,base=require('./quizz-baseline-1061-gitsha.json');
assert.equal(xs.length,1075,'1061 QCM historiques et 14 nouvelles décisions');
const old=JSON.stringify(xs.slice(0,base.count));
const oldSHA=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old,'utf8').digest('hex');
assert.equal(oldSHA,base.gitBlobSha,'1061 exercices V4.76 strictement inchangés et dans le même ordre');
assert.equal(db.themes.length,22,'Conservation de toutes les rubriques');
const byId=new Map(xs.map(x=>[x.id,x]));
assert.equal(byId.size,xs.length,'Identifiants tous distincts');
const hcp={A:4,R:3,D:2,V:1},ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const ord={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const score=x=>{const m=x.match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+ord[m[2]]:null;};
const defs={
  '1♣|2♦':['♥','♠'],'1♦|2♦':['♥','♠'],
  '1♥|2♥':['♠','♣'],'1♠|2♠':['♥','♣'],
  '1♥|2SA':['♣','♦'],'1♠|2SA':['♣','♦'],
  '1♥|3♣':['♠','♦'],'1♠|3♣':['♥','♦']
};
const specs=[
['001','1♣','2♦',3,[2,4,3,4],'2♥'],
['002','1♦','2♦',5,[4,2,3,4],'2♠'],
['003','1♣','2♦',6,[3,3,3,4],'2♥'],
['004','1♦','2♦',9,[3,4,5,1],'3♥'],
['005','1♥','2♥',4,[4,2,4,3],'2♠'],
['006','1♥','2♥',3,[2,3,3,5],'3♣'],
['007','1♠','2♠',5,[3,4,4,2],'3♥'],
['008','1♠','2♠',7,[3,2,3,5],'3♣'],
['009','1♥','2SA',4,[3,3,2,5],'3♣'],
['010','1♠','2SA',3,[3,3,5,2],'3♦'],
['011','1♥','3♣',5,[2,3,5,3],'3♦'],
['012','1♥','3♣',5,[4,2,2,5],'3♠'],
['013','1♠','3♣',5,[3,2,5,3],'3♦'],
['014','1♠','3♣',5,[2,4,2,5],'3♥']
];
for(const [num,opening,bid,h,shape,answer] of specs){
 const id='SEF-V477-'+num,x=byId.get(id);
 assert.ok(x,'Exercice présent : '+id);
 assert.equal(x.theme,'michaels',id+' doit être dans Michaels');
 assert.equal(x.answer,answer,id+' décision');
 assert.equal(x.h,h,id+' force H');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' nombre de cartes par couleur');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 assert.equal(x.hand.flat().reduce((n,r)=>n+(hcp[r]||0),0),h,id+' recomptage H');
 for(const suit of x.hand){
  assert.ok(suit.every(r=>ranks.has(r)),id+' cartes valides');
  assert.equal(new Set(suit).size,suit.length,id+' aucune carte répétée');
 }
 assert.deepEqual(x.auction,['Adversaire : '+opening,'Partenaire : '+bid+' (Michaël précisé)','Adversaire : Passe'],id+' séquence');
 assert.ok(defs[opening+'|'+bid],id+' intervention conventionnelle vérifiée');
 assert.equal(x.choices.length,4,id+' quatre propositions');
 assert.equal(new Set(x.choices).size,4,id+' propositions distinctes');
 assert.ok(x.choices.includes(answer),id+' bonne enchère présente');
 assert.ok(x.choices.every(v=>score(v)!==null&&score(v)>score(bid)),id+' toutes les enchères sont légales');
 assert.deepEqual(x.choices.map(score),x.choices.map(score).toSorted((a,b)=>a-b),id+' choix rangés par cherté');
 assert.ok(x.context.length>=120&&x.explain.length>=120,id+' enseignement individuel explicité');
 assert.ok(x.caseFamily?.startsWith('v477-'),id+' famille documentée');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté');
 assert.ok(!x.whyNot&&!x.takeaway,id+' corrigé positif uniquement');
}
const v=n=>byId.get('SEF-V477-'+n);
assert.equal(v('004').shape[3],1,'Saut à 3♥ : singleton et fit neuvième');
assert.equal(v('004').answer,'3♥','Effort de manche distinct de la préférence simple');
for(const n of ['005','006'])assert.equal(v(n).auction[1],'Partenaire : 2♥ (Michaël précisé)');
assert.notEqual(v('005').answer,v('006').answer,'Majeure versus mineure, même séquence');
for(const n of ['007','008'])assert.equal(v(n).auction[1],'Partenaire : 2♠ (Michaël précisé)');
assert.notEqual(v('007').answer,v('008').answer,'Cœur versus Trèfle');
assert.notEqual(v('011').answer,v('012').answer,'3♣ artificiel sur 1♥, deux vrais choix');
assert.notEqual(v('013').answer,v('014').answer,'3♣ artificiel sur 1♠, deux vrais choix');
const situations=new Set();
for(const x of xs){const key=JSON.stringify([x.hand,x.auction]);assert.ok(!situations.has(key),'Situation redondante '+x.id);situations.add(key);}
console.log('PASS | Quiz V4.77 : 1061 historiques immuables, 14 choix pédagogiques, 42 distracteurs, aucune collision');
