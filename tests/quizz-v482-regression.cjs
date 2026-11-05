'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Données Quiz intégrées');
const db=JSON.parse(m[1]),xs=db.exercises,base=require('./quizz-baseline-1135-gitsha.json');
assert.ok(xs.length>=1145,'1135 exercices antérieurs et 10 nouveaux');
assert.equal(db.themes.length,22,'22 rubriques préservées');
const historical=JSON.stringify(require('./quizz-v488-approved-revisions.cjs').normalizedPrefix(xs,base.count));
const digest=createHash('sha1').update('blob '+Buffer.byteLength(historical,'utf8')+'\0'+historical,'utf8').digest('hex');
assert.equal(digest,base.gitBlobSha,'Les 1135 exercices historiques sont intacts, ordre compris');
const map=new Map(xs.map(x=>[x.id,x]));
assert.equal(map.size,xs.length,'Identifiants distincts');
const hcp={A:4,R:3,D:2,V:1},ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const order={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const rank=v=>{const m=String(v).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+order[m[2]]:null};
const a0=['Partenaire : 1SA (15–17 H)','Adversaire : Passe'];
const ac=['Partenaire : 1SA (15–17 H)','Vous : 2♠ (Texas pour les Trèfles)','Partenaire : 3♣ (rectification du Texas)','Adversaire : Passe'];
const ad=['Partenaire : 1SA (15–17 H)','Vous : 3♣ (Texas pour les Carreaux)','Partenaire : 3♦ (rectification du Texas)','Adversaire : Passe'];
const first=['2♣','2♦','2♠','3♣'],club=['3♥','3♠','3SA','4♣'],diamond=['3♥','3♠','3SA','4♦'];
// Numéro, thème, H, distribution ♠/♥/♦/♣, réponse, choix, enchères
const specs=[
['001','sa',4,[3,2,2,6],'2♠',first,a0],
['002','sa',3,[3,3,6,1],'3♣',first,a0],
['003','stayman',3,[3,2,2,6],'Passe',['Passe','3♦','3♥','3SA'],ac],
['004','stayman',4,[3,3,6,1],'Passe',['Passe','3♥','3♠','3SA'],ad],
['005','stayman',12,[3,1,3,6],'3♥',club,ac],
['006','stayman',12,[1,3,3,6],'3♠',club,ac],
['007','stayman',10,[3,3,1,6],'3SA',club,ac],
['008','stayman',10,[3,1,6,3],'3♥',diamond,ad],
['009','stayman',10,[1,3,6,3],'3♠',diamond,ad],
['010','stayman',10,[3,3,6,1],'3SA',diamond,ad]
];
const collisions=new Set();
for(const x of xs){const k=JSON.stringify([x.auction,x.hand]);assert.ok(!collisions.has(k),'Aucun doublon main + enchères : '+x.id);collisions.add(k);}
for(const [num,theme,H,shape,answer,choices,auction] of specs){
 const id='SEF-V482-'+num,x=map.get(id);
 assert.ok(x,id+' doit exister');
 assert.equal(x.theme,theme,id+' rubrique');
 assert.equal(x.answer,answer,id+' bonne enchère');
 assert.deepEqual(x.choices,choices,id+' distracteurs');
 assert.deepEqual(x.auction,auction,id+' séquence');
 assert.equal(x.h,H,id+' H');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' décompte de chaque couleur');
 assert.equal(x.hand.flat().length,13,id+' treize cartes');
 for(const cards of x.hand){assert.equal(new Set(cards).size,cards.length,id+' aucune carte répétée');assert.ok(cards.every(r=>ranks.has(r)),id+' rangs valides');}
 assert.equal(x.hand.flat().reduce((v,r)=>v+(hcp[r]||0),0),H,id+' honneurs recalculés');
 assert.ok(x.choices.includes(x.answer)&&x.choices.length===4&&new Set(x.choices).size===4,id+' quatre choix');
 const prev=auction===a0?rank('1SA'):rank(auction===ac?'3♣':'3♦');
 const contractChoices=x.choices.filter(v=>v!=='Passe');
 assert.ok(contractChoices.every(v=>rank(v)!==null&&rank(v)>prev),id+' annonces légales');
 assert.deepEqual(contractChoices.map(rank),contractChoices.map(rank).toSorted((a,b)=>a-b),id+' ordre croissant des enchères');
 assert.ok(x.context.length>=155&&x.explain.length>=145,id+' énoncé et correction explicites');
 assert.ok(!x.whyNot&&!x.takeaway,id+' aucune explication des mauvaises enchères affichée');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté définie');
}
for(const num of ['005','008'])assert.equal(map.get('SEF-V482-'+num).shape[1],1,'3♥ annonce singleton ♥');
for(const num of ['006','009'])assert.equal(map.get('SEF-V482-'+num).shape[0],1,'3♠ annonce singleton ♠');
assert.equal(map.get('SEF-V482-007').shape[2],1,'3SA annonce singleton ♦ après Texas ♣');
assert.equal(map.get('SEF-V482-010').shape[3],1,'3SA annonce singleton ♣ après Texas ♦');
assert.equal(map.get('SEF-V482-004').shape[3],1,'faible avec singleton : Passe malgré la courte');
console.log('PASS | V4.82 : 1135 intacts, 10 QCM SEF 2024, 30 distracteurs, 13 cartes, bonnes enchères, courtes vérifiées');
