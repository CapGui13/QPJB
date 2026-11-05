'use strict';
// V4.80 : protection des fiches historiques et contre-expertise des réponses à la 4e forcing.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Base Quizz disponible');
const db=JSON.parse(match[1]),xs=db.exercises,old=require('./quizz-baseline-1104-gitsha.json');
assert.ok(xs.length>=1119,'Au moins 1104 QCM historiques et 15 nouveaux');
assert.equal(db.themes.length,22,'Les 22 thèmes sont maintenus');
const historical=JSON.stringify(xs.slice(0,old.count));
const digest=createHash('sha1').update('blob '+Buffer.byteLength(historical,'utf8')+'\0'+historical,'utf8').digest('hex');
assert.equal(digest,old.gitBlobSha,'1104 QCM V4.79 inchangés, même ordre et mêmes données');
const idMap=new Map(xs.map(x=>[x.id,x]));
assert.equal(idMap.size,xs.length,'Tous les IDs sont uniques');
const suitOrder={'♣':0,'♦':1,'♥':2,'♠':3,SA:4},H={A:4,R:3,D:2,V:1};
const goodRanks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const bidRank=b=>{const m=String(b).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+suitOrder[m[2]]:null;};
const AUCTIONS={
 A:['Vous : 1♥','Partenaire : 1♠','Vous : 2♣','Partenaire : 2♦ (4e couleur forcing)'],
 B:['Vous : 1♦','Partenaire : 1♥','Vous : 1♠','Partenaire : 2♣ (4e couleur forcing)'],
 C:['Vous : 1♣','Partenaire : 1♥','Vous : 1♠','Partenaire : 2♦ (4e couleur forcing)']
};
const rows=[
 ['001','A',13,[3,5,1,4],'2♠'],
 ['002','A',17,[3,5,1,4],'3♠'],
 ['003','A',13,[2,5,2,4],'2SA'],
 ['004','A',13,[2,5,2,4],'2♥'],
 ['005','A',13,[2,5,1,5],'3♣'],
 ['006','B',13,[4,3,4,2],'2♥'],
 ['007','B',14,[4,3,4,2],'2♥'],
 ['008','B',16,[4,3,4,2],'3♥'],
 ['009','B',13,[4,2,4,3],'2SA'],
 ['010','B',13,[4,2,4,3],'2♠'],
 ['011','B',13,[4,2,5,2],'2♦'],
 ['012','B',15,[4,2,6,1],'3♦'],
 ['013','C',14,[4,3,2,4],'2♥'],
 ['014','C',12,[4,2,2,5],'2SA'],
 ['015','C',13,[4,2,1,6],'3♣']
];
const situations=new Set();
for(const x of xs){const key=JSON.stringify([x.hand,x.auction]);assert.ok(!situations.has(key),'Pas de donne répétée avec la même séquence : '+x.id);situations.add(key);}
for(const [num,family,h,shape,answer] of rows){
 const id='SEF-V480-'+num,x=idMap.get(id);assert.ok(x,id+' existe');
 assert.equal(x.theme,'forcing',id+' bonne rubrique');
 assert.equal(x.answer,answer,id+' décision vérifiée');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.equal(x.h,h,id+' H recomptés');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' longueurs réelles');
 assert.equal(x.hand.flat().length,13,id+' treize cartes');
 for(const group of x.hand){assert.ok(group.every(r=>goodRanks.has(r)),id+' cartes de rang valide');assert.equal(new Set(group).size,group.length,id+' aucune carte dupliquée dans une couleur');}
 assert.equal(x.hand.flat().reduce((sum,r)=>sum+(H[r]||0),0),h,id+' points H');
 assert.deepEqual(x.auction,AUCTIONS[family],id+' historique exact');
 if(family==='A'){assert.ok(shape[1]>=5&&shape[3]>=4,'Ouverture 1♥ et bicolore Cœur-Trèfle descriptif : '+id);}
 if(family==='B'){assert.ok(shape[0]===4&&shape[2]>=4&&shape[1]<=3,'Ouverture de 1♦ et redemande 1♠ cohérentes : '+id);}
 if(family==='C'){assert.ok(shape[0]===4&&shape[3]>=4,'Ouverture de 1♣ et redemande 1♠ cohérentes : '+id);}
 assert.equal(x.choices.length,4,id+' quatre distracteurs/réponses');
 assert.equal(new Set(x.choices).size,4,id+' propositions différentes');
 assert.ok(x.choices.includes(answer),id+' réponse disponible');
 const last=bidRank(family==='B'?'2♣':'2♦');
 assert.ok(x.choices.every(b=>bidRank(b)!==null&&bidRank(b)>last),id+' aucune enchère illégale ou Passe après forcing');
 const scores=x.choices.map(bidRank);assert.deepEqual(scores,scores.toSorted((a,b)=>a-b),id+' réponses ordonnées par cherté');
 assert.ok(x.context.length>=150&&x.explain.length>=150,id+' explication contextualisée');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté 1–5');
 assert.ok(!x.whyNot&&!x.takeaway,id+' seule la bonne enchère est justifiée au joueur');
}
const v=n=>idMap.get('SEF-V480-'+n);
assert.equal(v('001').shape[0],3,'Trois Piques et soutien simple');
assert.equal(v('002').shape[0],3,'Trois Piques et soutien avec saut');
assert.equal(v('003').hand[2][0],'A','Arrêt Carreau par As');
assert.equal(v('004').shape[1],5,'2♥ « poubelle » avec cinq Cœurs seulement');
assert.equal(v('005').shape[3],5,'3♣ annonce 5-5');
assert.equal(v('007').shape[1],3,'Soutien prioritaire malgré arrêt Trèfle');
assert.equal(v('008').h,16,'3♥ indique deuxième zone');
assert.equal(v('009').shape[1],2,'2SA dénie trois Cœurs');
assert.equal(v('010').shape[0],4,'2♠ attente avec seulement quatre Piques');
assert.equal(v('011').shape[2],5,'2♦ avec vraie longue');
assert.equal(v('012').shape[2],6,'3♦ montre six cartes');
assert.equal(v('013').shape[1],3,'2♥ priorité au fit malgré arrêt Carreau');
assert.equal(v('014').hand[2][0],'A','2SA avec arrêt Carreau');
assert.equal(v('015').shape[3],6,'3♣ indique six Trèfles après 2♦');
console.log('PASS | V4.80 : 1104 historiques intacts, 15 troisièmes enchères de l’ouvreur, 45 distracteurs, 3 séquences SEF');
