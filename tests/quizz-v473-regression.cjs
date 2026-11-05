'use strict';
// V4.73 : 10 choix competitifs SEF 2024, protection stricte des 1016 historiques.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Base JSON embarquée');
const db=JSON.parse(match[1]), xs=db.exercises;
const old=require('./quizz-baseline-1016-gitsha.json');
assert.ok(xs.length>=1026,'Conserver les 1016 fiches et les 10 nouvelles V4.73');
const oldJSON=JSON.stringify(require('./quizz-v488-approved-revisions.cjs').normalizedPrefix(xs,old.count));
const oldSha=createHash('sha1').update('blob '+Buffer.byteLength(oldJSON,'utf8')+'\0'+oldJSON,'utf8').digest('hex');
assert.equal(oldSha,old.gitBlobSha,'Les 1016 objets V4.72 doivent être strictement identiques');
const map=new Map(xs.map(x=>[x.id,x]));
assert.equal(map.size,xs.length,'Tous les IDs sont distincts');
const P={A:4,R:3,D:2,V:1};
const ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const legal=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const inter=['Adversaire : 1♦','Partenaire : 1♠ (intervention)','Adversaire : 2♦ (soutien)'];
const open=['Partenaire : 1♠','Adversaire : 2♥ (naturel)'];
const minors=['Partenaire : 1♠','Adversaire : 2SA (bicolore mineur ♣ et ♦)'];
const cases=[
['001','reponse_inter',inter,'2SA',8,[4,2,3,4],'v473-mixed-raise'],
['002','reponse_inter',inter,'3♠',3,[4,4,1,4],'v473-barrage-intervenant'],
['003','reponse_inter',inter,'3♦',10,[4,3,2,4],'v473-cuebid-intervenant'],
['004','reponse_inter',inter,'3♥',10,[4,5,2,2],'v473-rencontre-intervenant'],
['005','apres_inter',open,'2SA',13,[3,3,2,5],'v473-2sa-fitte-intervention'],
['006','apres_inter',open,'3♠',9,[4,2,4,3],'v473-soutien3-majeure'],
['007','apres_inter',open,'3♥',10,[4,1,4,4],'v473-cuebid-manche'],
['008','apres_inter',open,'4♠',1,[5,1,4,3],'v473-manche-barrage'],
['009','apres_inter',minors,'3♣',12,[4,3,3,3],'v473-1er-cuebid-bicolore'],
['010','apres_inter',minors,'3♦',14,[2,6,3,2],'v473-2nd-cuebid-bicolore']
];
const newFamilies=new Set();
for(const [num,theme,auction,answer,h,shape,family] of cases){
 const id='SEF-V473-'+num,x=map.get(id);
 assert.ok(x,id+' présent');
 assert.equal(x.theme,theme,id+' thème');
 assert.deepEqual(x.auction,auction,id+' séquence sans omission');
 assert.equal(x.answer,answer,id+' réponse pédagogique');
 assert.equal(x.h,h,id+' points H déclarés');
 assert.deepEqual(x.shape,shape,id+' distribution déclarée');
 assert.deepEqual(x.hand.map(c=>c.length),shape,id+' distribution réelle');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 assert.equal(x.hand.flat().reduce((n,c)=>n+(P[c]||0),0),x.h,id+' H recomptés');
 for(const suit of x.hand){
  assert.ok(suit.every(c=>ranks.has(c)),id+' hauteurs valides');
  assert.equal(new Set(suit).size,suit.length,id+' aucun doublon de carte');
 }
 assert.equal(x.choices.length,4,id+' 4 propositions');
 assert.equal(new Set(x.choices).size,4,id+' propositions distinctes');
 assert.ok(x.choices.every(c=>legal.test(c)),id+' choix au format légal');
 assert.ok(x.choices.includes(x.answer),id+' réponse incluse');
 assert.ok(x.context.length>110 && x.explain.length>110,id+' contexte et explication suffisants');
 assert.ok(!x.whyNot&&!x.takeaway,id+' explication de la bonne réponse seulement');
 assert.equal(x.caseFamily,family,id+' famille propre');
 assert.ok(!newFamilies.has(family),id+' aucune famille de remplissage');
 newFamilies.add(family);
}
const v=n=>map.get('SEF-V473-'+n);
assert.equal(v('001').shape[0],4,'2SA mixed : 4 atouts');
assert.equal(v('005').shape[0],3,'2SA du répondant : 3 atouts');
assert.equal(v('003').h,10,'3♦ cue-bid 10 H');
assert.equal(v('004').shape[1],5,'3♥ rencontre : 5 cartes');
assert.equal(v('006').shape[0],4,'3♠ soutien invitant : 4 cartes');
assert.equal(v('007').shape[1],1,'3♥ cue-bid fort et singleton ennemi');
assert.equal(v('008').h,1,'4♠ est un barrage faible');
assert.equal(v('009').shape[0],4,'1er cuebid : fit majeur');
assert.equal(v('010').shape[1],6,'2nd cuebid : longue à Cœur');
const signatures=new Set();
for(const x of xs){
 const k=JSON.stringify([x.hand,x.auction]);
 assert.ok(!signatures.has(k),'Collision main et séquence : '+x.id);
 signatures.add(k);
}
assert.equal(db.themes.length,22,'Rubriques historiques conservées');
console.log('PASS | V4.73 : 1016 originaux inchangés + 10 décisions distinctes, 30 distracteurs et 22 rubriques');
