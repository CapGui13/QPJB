'use strict';
// V4.78 — contre-expertise technique des réponses au Michaël après action du N°3.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'Données du Quiz présentes');
const db=JSON.parse(mt[1]),xs=db.exercises,base=require('./quizz-baseline-1075-gitsha.json');
assert.equal(xs.length,1089,'1075 historiques et 14 nouvelles décisions');
assert.equal(db.themes.length,22,'Rubriques inchangées');
const old=JSON.stringify(xs.slice(0,base.count));
const digest=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old,'utf8').digest('hex');
assert.equal(digest,base.gitBlobSha,'1075 QCM précédents intacts et dans le même ordre');
const ids=new Set(xs.map(x=>x.id));assert.equal(ids.size,xs.length,'IDs distincts');
const H={A:4,R:3,D:2,V:1},validRanks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const ord={'♣':0,'♦':1,'♥':2,'♠':3,SA:4},rank=s=>{const m=String(s).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+ord[m[2]]:null;};
const patterns={
 '1♥|2♥|3♥':[3,'3♠','4♣','Passe'],
 '1♥|2♥|4♥':[2,'4♠','Passe'],
 '1♠|2♠|3♠':[4,'4♥','4♣','Passe','Passe'],
 '1♦|2♦|3♦':[3,'3♥','3♠','Passe'],
 '1♣|2♦|3♣':[2,'3♠','3♥']
};
const specs=[
 ['001',3,[4,2,4,3],'3♠','1♥','2♥','3♥'],
 ['002',3,[2,2,4,5],'4♣','1♥','2♥','3♥'],
 ['003',9,[2,5,4,2],'Passe','1♥','2♥','3♥'],
 ['004',5,[5,2,4,2],'4♠','1♥','2♥','4♥'],
 ['005',5,[4,2,4,3],'Passe','1♥','2♥','4♥'],
 ['006',5,[2,5,4,2],'4♥','1♠','2♠','3♠'],
 ['007',7,[3,2,3,5],'4♣','1♠','2♠','3♠'],
 ['008',9,[5,2,4,2],'Passe','1♠','2♠','3♠'],
 ['009',3,[3,4,4,2],'Passe','1♠','2♠','3♠'],
 ['010',3,[2,4,2,5],'3♥','1♦','2♦','3♦'],
 ['011',4,[4,2,2,5],'3♠','1♦','2♦','3♦'],
 ['012',10,[2,2,5,4],'Passe','1♦','2♦','3♦'],
 ['013',3,[4,2,5,2],'3♠','1♣','2♦','3♣'],
 ['014',4,[2,4,5,2],'3♥','1♣','2♦','3♣']
];
const countFamily=new Map();
for(const [num,h,shape,answer,o,m,r] of specs){
 const id='SEF-V478-'+num,x=xs.find(x=>x.id===id);assert.ok(x,id+' présent');
 assert.equal(x.theme,'michaels',id+' bonne rubrique');
 assert.equal(x.answer,answer,id+' bonne enchère');
 assert.equal(x.h,h,id+' recomptage des points');
 assert.deepEqual(x.shape,shape,id+' forme');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' longueurs');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 assert.equal(x.hand.flat().reduce((sum,c)=>sum+(H[c]||0),0),h,id+' somme H');
 for(const suit of x.hand){
  assert.ok(suit.every(r=>validRanks.has(r)),id+' rangs de cartes');
  assert.equal(new Set(suit).size,suit.length,id+' cartes distinctes par couleur');
 }
 assert.deepEqual(x.auction,['Adversaire : '+o,'Partenaire : '+m+' (Michaël précisé)','Adversaire : '+r+' (soutien)'],id+' enchères et soutien du N°3');
 assert.equal(x.choices.length,4,id+' quatre choix');
 assert.equal(new Set(x.choices).size,4,id+' choix distincts');
 assert.ok(x.choices.includes(answer),id+' bonne proposition présente');
 const last=rank(r);
 assert.ok(x.choices.every(b=>b==='Passe'||(rank(b)!==null&&rank(b)>last)),id+' toutes les enchères au-dessus du palier');
 const validBids=x.choices.filter(x=>x!=='Passe');
 assert.deepEqual(validBids.map(rank),validBids.map(rank).toSorted((a,b)=>a-b),id+' réponses rangées par cherté');
 assert.ok(x.context.length>=150&&x.explain.length>=150,id+' contexte et justification individualisés');
 assert.ok(!x.whyNot&&!x.takeaway,id+' justification de la bonne enchère exclusivement');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté renseignée');
 const p=[o,m,r].join('|'),arr=countFamily.get(p)||[];arr.push(answer);countFamily.set(p,arr);
}
assert.equal(countFamily.size,5,'Cinq séquences de compétition réellement contrastées');
for(const [key,answers] of countFamily){assert.deepEqual(answers,patterns[key].slice(1),'Contrastes de décisions '+key);}
const byNum=n=>xs.find(x=>x.id==='SEF-V478-'+n);
assert.equal(byNum('004').shape[0],5,'4♠ sur 4♥ : dix atouts garantis');
assert.equal(byNum('005').shape[0],4,'Passe sur 4♥ : seulement neuf atouts garantis');
assert.equal(byNum('006').shape[1],5,'4♥ sur 3♠ : dix atouts Cœur');
assert.equal(byNum('009').shape[1],4,'Passe sur 3♠ : seulement neuf Cœurs et aucune force');
for(const n of ['003','008','012'])assert.equal(byNum(n).answer,'Passe','Pas de fit malgré les points H');
const keys=new Set();
for(const x of xs){const key=JSON.stringify([x.hand,x.auction]);assert.ok(!keys.has(key),'Situation nouvelle et non répétée : '+x.id);keys.add(key);}
console.log('PASS | V4.78 : 1075 historiques protégés, 14 décisions, 42 distracteurs, cinq enchères concurrentielles');
