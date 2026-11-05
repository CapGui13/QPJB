'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mat=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mat,'Base intégrée au Quiz');
const db=JSON.parse(mat[1]),xs=db.exercises,base=require('./quizz-baseline-1119-gitsha.json');
assert.ok(xs.length>=1135,'1119 QCM historiques et au moins 16 réponses Rubensohl');
assert.equal(db.themes.length,22,'22 rubriques inchangées');
const historical=JSON.stringify(xs.slice(0,base.count));
const digest=createHash('sha1').update('blob '+Buffer.byteLength(historical,'utf8')+'\0'+historical,'utf8').digest('hex');
assert.equal(digest,base.gitBlobSha,'1119 anciens QCM inchangés et dans le même ordre');
const ids=new Map(xs.map(x=>[x.id,x]));assert.equal(ids.size,xs.length,'IDs distincts');
const hcp={A:4,R:3,D:2,V:1},ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']),order={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const rank=x=>{const m=String(x).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+order[m[2]]:null;};
const auction={
 HST:['Vous : 1SA (15-17 H)','Adversaire : 2♥ (naturel)','Partenaire : 3♦ (Texas impossible : Stayman forcing de manche)','Adversaire : Passe'],
 DST:['Vous : 1SA (15-17 H)','Adversaire : 2♦ (naturel)','Partenaire : 3♣ (Texas impossible : Stayman forcing de manche)','Adversaire : Passe'],
 TXC:['Vous : 1SA (15-17 H)','Adversaire : 2♥ (naturel)','Partenaire : 2SA (Rubensohl : Texas Trèfle)','Adversaire : Passe'],
 TXD:['Vous : 1SA (15-17 H)','Adversaire : 2♥ (naturel)','Partenaire : 3♣ (Rubensohl : Texas Carreau)','Adversaire : Passe'],
 TXH:['Vous : 1SA (15-17 H)','Adversaire : 2♦ (naturel)','Partenaire : 3♦ (Rubensohl : Texas Cœur)','Adversaire : Passe'],
 TXS:['Vous : 1SA (15-17 H)','Adversaire : 2♥ (naturel)','Partenaire : 3♥ (Rubensohl : Texas Pique)','Adversaire : Passe']
};
const proposals={HST:['3♥','3♠','3SA','4♠'],DST:['3♦','3♥','3♠','3SA'],TXC:['3♣','3♦','3♥','3SA'],TXD:['3♦','3♥','3♠','3SA'],TXH:['3♥','3♠','3SA','4♥'],TXS:['3♠','3SA','4♣','4♠']};
const spec=[
['001','HST',15,[4,2,4,3],'3♠'],['002','HST',17,[4,3,3,3],'3♠'],
['003','HST',15,[3,3,4,3],'3SA'],['004','HST',15,[3,4,3,3],'3SA'],
['005','HST',15,[3,2,4,4],'3♥'],['006','HST',15,[2,3,3,5],'3♥'],
['007','DST',17,[3,4,3,3],'3♥'],['008','DST',15,[2,4,4,3],'3♥'],
['009','DST',15,[4,3,3,3],'3♠'],['010','DST',15,[3,3,3,4],'3SA'],
['011','DST',15,[3,3,4,3],'3SA'],['012','DST',15,[3,3,2,5],'3♦'],
['013','TXC',15,[3,3,3,4],'3♣'],['014','TXD',15,[2,3,4,4],'3♦'],
['015','TXH',15,[3,2,3,5],'3♥'],['016','TXS',15,[2,3,3,5],'3♠']
];
const collisions=new Set();
for(const x of xs){const k=JSON.stringify([x.hand,x.auction]);assert.ok(!collisions.has(k),'Pas de doublon main+séquence : '+x.id);collisions.add(k);}
for(const [num,family,h,shape,answer] of spec){
 const id='SEF-V481-'+num,x=ids.get(id);assert.ok(x,id+' présent');
 assert.equal(x.theme,'rubensohl',id+' rubrique correcte');
 assert.equal(x.answer,answer,id+' réponse revue');
 assert.equal(x.h,h,id+' points recalculés');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' couleurs');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 for(const suit of x.hand){assert.ok(suit.every(r=>ranks.has(r)),id+' rangs valides');assert.equal(new Set(suit).size,suit.length,id+' aucune répétition dans une couleur');}
 assert.equal(x.hand.flat().reduce((sum,r)=>sum+(hcp[r]||0),0),h,id+' compte exact H');
 assert.ok(h>=15&&h<=17,id+' ouverture 1SA 15-17 H');
 const form=shape.slice().sort((a,b)=>a-b).join('-');
 assert.ok(['3-3-3-4','2-3-4-4','2-3-3-5'].includes(form),id+' distribution régulière admissible');
 assert.deepEqual(x.auction,auction[family],id+' déroulé 1SA, intervention naturelle, Rubensohl et passe');
 assert.deepEqual(x.choices,proposals[family],id+' propositions pertinentes à la séquence');
 assert.equal(x.choices.length,4,id+' quatre choix distincts');
 assert.equal(new Set(x.choices).size,4,id+' sans doublon de réponse');
 const prior=rank((x.auction[2].match(/^Partenaire : ([2-7](?:♣|♦|♥|♠|SA))/)||[])[1]||'');
 assert.ok(x.choices.every(b=>rank(b)!==null&&rank(b)>prior),id+' enchères au-dessus du dernier contrat');
 assert.deepEqual(x.choices.map(rank),x.choices.map(rank).toSorted((a,b)=>a-b),id+' ordre de cherté');
 assert.ok(x.context.length>=155&&x.explain.length>=160,id+' question et corrigé suffisamment précis');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté 1 à 5');
 assert.ok(!x.whyNot&&!x.takeaway,id+' l’élève ne voit que la bonne justification');
}
const v=n=>ids.get('SEF-V481-'+n);
for(const n of ['001','002'])assert.equal(v(n).shape[0],4,'3♠ : quatre Piques '+n);
for(const n of ['003','004'])assert.ok(v(n).shape[0]<4&&v(n).hand[1].includes('A'),'3SA : pas quatre Piques, arrêt Cœur '+n);
for(const n of ['005','006'])assert.ok(v(n).shape[0]<4&&!v(n).hand[1].some(r=>r==='A'||r==='R'),'3♥ cue-bid : pas quatre Piques, pas d’arrêt Cœur '+n);
for(const n of ['007','008'])assert.equal(v(n).shape[1],4,'3♥ après Texas impossible sur 2♦ : quatre Cœurs '+n);
assert.equal(v('009').shape[0],4,'3♠ sur 2♦ : quatre Piques');
for(const n of ['010','011'])assert.equal(v(n).shape[0],3,'3SA sans quatre Piques '+n);
assert.deepEqual(v('012').hand[2],['8','4'],'3♦ sur 3♣ : absence de tenue ♦');
assert.equal(v('013').answer,'3♣','2SA Texas ♣');
assert.equal(v('014').answer,'3♦','3♣ Texas ♦');
assert.equal(v('015').answer,'3♥','3♦ Texas ♥ sans arrêt ♦');
assert.equal(v('016').answer,'3♠','3♥ Texas ♠ sans arrêt ♥');
console.log('PASS | V4.81 : 1119 historiques immuables, 16 réponses Rubensohl, 48 distracteurs, 6 familles d’enchères');
