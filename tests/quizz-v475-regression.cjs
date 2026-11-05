'use strict';
// V4.75 — Dix décisions SEF après les ouvertures fortes 2♣ et 2♦.
// Les 1036 fiches historiques doivent rester byte-for-byte identiques au JSON initial.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Base JSON embarquée');
const db=JSON.parse(match[1]), xs=db.exercises, base=require('./quizz-baseline-1036-gitsha.json');
assert.ok(xs.length>=1046,'1036 historiques et 10 exercices V4.75');
const obj=JSON.stringify(require('./quizz-v488-approved-revisions.cjs').normalizedPrefix(xs,base.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(obj,'utf8')+'\0'+obj,'utf8').digest('hex');
assert.equal(sha,base.gitBlobSha,'Les 1036 fiches précédentes sont strictement inchangées');
const byId=new Map(xs.map(x=>[x.id,x]));
assert.equal(byId.size,xs.length,'IDs uniques');
const p={A:4,R:3,D:2,V:1};
const good=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const s=['Partenaire : 2♦ (forcing de manche)'];
const r=['Vous : 2♣ (fort indéterminé)','Partenaire : 2♦ (relais)'];
const hearts=['Partenaire : 2♣ (fort indéterminé)','Vous : 2♦ (relais)','Partenaire : 2♥ (unicolore fort)'];
const pairs=[
['001','2SA',8,[4,3,3,3],s,'v475-2k-sans-as-8h'],
['002','2SA',6,[3,3,4,3],s,'v475-2k-deux-rois'],
['003','3♥',8,[3,4,3,3],s,'v475-2k-deux-as-couleur'],
['004','3♠',8,[4,3,3,3],s,'v475-2k-deux-as-rang'],
['005','3SA',8,[3,3,4,3],s,'v475-2k-deux-as-melanges'],
['006','3SA',21,[5,5,2,1],r,'v475-2t-bicolore-majeur'],
['007','3♣',18,[2,2,2,7],r,'v475-2t-unicolore-mineur'],
['008','4♥',5,[2,3,4,4],['Partenaire : 2♣ (fort indéterminé)','Vous : 2♦ (relais)','Partenaire : 3SA (bicolore majeur 5-5)'],'v475-2t-developpement-55'],
['009','Passe',0,[3,2,4,4],hearts,'v475-2t-apres-relais-passe'],
['010','4♥',8,[3,3,4,3],hearts,'v475-2t-apres-relais-manche']
];
for(const [id,answer,h,shape,auction,family] of pairs){
 const x=byId.get('SEF-V475-'+id);
 assert.ok(x,id+' présent');
 assert.equal(x.theme,'fortes',id+' rubrique');
 assert.equal(x.answer,answer,id+' réponse');
 assert.equal(x.h,h,id+' points H');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(v=>v.length),shape,id+' longueurs réelles');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 assert.equal(x.hand.flat().reduce((n,c)=>n+(p[c]||0),0),h,id+' recomptage H');
 for(const suit of x.hand)assert.equal(suit.length,new Set(suit).size,id+' aucune carte doublonnée');
 assert.deepEqual(x.auction,auction,id+' séquence');
 assert.equal(x.choices.length,4,id+' 4 choix');
 assert.equal(new Set(x.choices).size,4,id+' réponses distinctes');
 assert.ok(x.choices.every(c=>good.test(c)),id+' légalité des propositions');
 assert.ok(x.choices.includes(x.answer),id+' bonne réponse présente');
 assert.ok(x.context.length>=95 && x.explain.length>=110,id+' pédagogie suffisamment développée');
 assert.equal(x.caseFamily,family,id+' famille propre');
 assert.ok(!x.whyNot&&!x.takeaway,id+' un seul corrigé visible');
}
const g=id=>byId.get('SEF-V475-'+id);
const ace=x=>x.hand.reduce((n,s)=>n+(s.includes('A')?1:0),0);
for(const id of ['001','002'])assert.equal(ace(g(id)),0,id+' aucun As');
assert.equal(g('002').hand.flat().filter(x=>x==='R').length,2,'exception deux Rois');
for(const id of ['003','004','005'])assert.equal(ace(g(id)),2,id+' exactement deux As');
assert.equal(g('003').hand[1].includes('A')&&g('003').hand[2].includes('A'),true,'003 deux As rouges');
assert.equal(g('004').hand[0].includes('A')&&g('004').hand[1].includes('A'),true,'004 deux As majeurs');
assert.equal(g('005').hand[0].includes('A')&&g('005').hand[2].includes('A'),true,'005 deux As mélangés');
assert.deepEqual(g('006').shape.slice(0,2),[5,5],'3SA : majeure 5–5');
assert.deepEqual(g('007').hand[3],['A','R','D','V','10','9','8'],'Sept Trèfles maîtres');
assert.equal(ace(g('007')),3,'Deux As annexes plus As de Trèfle');
assert.equal(g('008').shape[1],3,'Fit à Cœur après 3SA bicolore');
assert.equal(g('009').h,0,'Le répondant peut passer avec zéro H');
assert.equal(g('010').shape[1],3,'Soutien au palier de manche avec 3 Cœurs');
const all=new Set();
for(const x of xs){const k=JSON.stringify([x.hand,x.auction]);assert.ok(!all.has(k),'Main + enchères identiques : '+x.id);all.add(k);}
assert.equal(db.themes.length,22,'22 rubriques conservées');
console.log('PASS | V4.75 : 1036 historiques protégés + 10 décisions fortes et 30 distracteurs revus');
