'use strict';
// Quiz V4.76 : défenses après 2 faible, 15 décisions et intégrité des 1046 historiques.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const mt=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(mt,'Base JSON intégrée');
const db=JSON.parse(mt[1]),xs=db.exercises,base=require('./quizz-baseline-1046-gitsha.json');
assert.ok(xs.length>=1061,'1046 historiques et 15 cas nouveaux présents');
const old=JSON.stringify(require('./quizz-v488-approved-revisions.cjs').normalizedPrefix(xs,base.count));
const oldSHA=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old,'utf8').digest('hex');
assert.equal(oldSHA,base.gitBlobSha,'1046 exercices V4.75 intacts et dans l’ordre');
const byId=new Map(xs.map(x=>[x.id,x]));
assert.equal(byId.size,xs.length,'IDs tous uniques');
const H={A:4,R:3,D:2,V:1};
const legal=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const openingH=['Adversaire : 2♥ (faible)','Partenaire : Contre (d\'appel)','Adversaire : Passe'];
const openingS=['Adversaire : 2♠ (faible)','Partenaire : Contre (d\'appel)','Adversaire : Passe'];
const rebid=['Adversaire : 2♥ (faible)','Vous : Contre (d\'appel)','Adversaire : Passe','Partenaire : 2SA (mini cue-bid)','Adversaire : Passe'];
const specs=[
['001','2♠',3,[4,2,4,3],openingH,'v476-reponse-faible-pique'],
['002','3♣',3,[2,3,3,5],openingH,'v476-reponse-faible-trefle'],
['003','2SA',9,[4,2,3,4],openingH,'v476-mini-cuebid-quatre-piques'],
['004','2SA',9,[3,2,4,4],openingH,'v476-mini-cuebid-sans-majeure'],
['005','3♠',12,[5,2,3,3],openingH,'v476-saut-fort-piques'],
['006','3♥',13,[3,2,4,4],openingH,'v476-cue-bid-fort-sans-arret'],
['007','3SA',14,[3,3,3,4],openingH,'v476-manche-sa-arret-coeur'],
['008','3♥',3,[2,4,4,3],openingS,'v476-reponse-faible-coeur'],
['009','2SA',9,[2,4,3,4],openingS,'v476-mini-cuebid-quatre-coeurs'],
['010','3♠',12,[2,3,4,4],openingS,'v476-cue-bid-fort-sur-pique'],
['011','3SA',13,[3,3,3,4],openingS,'v476-manche-sa-arret-pique'],
['012','3♣',13,[4,1,3,5],rebid,'v476-contre-minimum-meilleure-mineure'],
['013','3♠',12,[5,1,3,4],rebid,'v476-contre-minimum-cinq-piques'],
['014','3SA',19,[3,3,4,3],rebid,'v476-contre-maximum-3sa'],
['015','3♥',18,[4,1,4,4],rebid,'v476-contre-maximum-cuebid']
];
const ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const order={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const score=x=>{const m=x.match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+order[m[2]]:null;};
for(const [num,answer,h,shape,auction,family] of specs){
 const id='SEF-V476-'+num,x=byId.get(id);
 assert.ok(x,id+' présent');
 assert.equal(x.theme,'contre',id+' rubrique');
 assert.equal(x.answer,answer,id+' décision');
 assert.equal(x.h,h,id+' points d’honneur');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' cartes par couleur');
 assert.equal(x.hand.flat().length,13,id+' treize cartes');
 assert.equal(x.hand.flat().reduce((n,r)=>n+(H[r]||0),0),h,id+' H recomptés');
 for(const suit of x.hand){assert.ok(suit.every(r=>ranks.has(r)),id+' rang de carte');assert.equal(new Set(suit).size,suit.length,id+' carte dupliquée');}
 assert.deepEqual(x.auction,auction,id+' séquence exacte');
 assert.equal(x.choices.length,4,id+' 4 propositions');
 assert.equal(new Set(x.choices).size,4,id+' 4 différentes');
 assert.ok(x.choices.every(c=>legal.test(c)),id+' réponses au format enchère');
 assert.ok(x.choices.includes(x.answer),id+' bonne réponse parmi les quatre');
 assert.ok(x.context.length>=100 && x.explain.length>=100,id+' contexte et corrigé expliqués');
 assert.equal(x.caseFamily,family,id+' famille non répétitive');
 assert.ok(!x.whyNot&&!x.takeaway,id+' justification positive seulement');
 const last=x.auction.map(a=>score((a.match(/:\s*([1-7](?:♣|♦|♥|♠|SA))/)||[])[1]||'')).filter(s=>s!==null).at(-1);
 if(last!==undefined)assert.ok(x.choices.every(c=>score(c)===null||score(c)>last),id+' enchères légales au-dessus du contrat');
}
// Spécificités essentielles du bloc : 2SA de réponse est artificiel, 3SA de l'ouvreur est naturel.
const v=n=>byId.get('SEF-V476-'+n);
for(const n of ['003','004','009'])assert.equal(v(n).answer,'2SA','2SA mini-cue-bid en réponse '+n);
for(const n of ['001','002','008'])assert.ok(v(n).h<=7,'réponse faible '+n);
for(const n of ['006','010'])assert.ok(v(n).h>=12,'cue-bid fort '+n);
for(const n of ['007','011'])assert.ok(v(n).h>=12,'3SA conclusif du répondant '+n);
for(const n of ['005','013'])assert.equal(v(n).shape[0],5,'saut/annonce cinq Piques '+n);
assert.equal(v('012').shape[3],5,'contre minimum : cinq Trèfles');
assert.equal(v('014').hand[1].includes('A'),true,'contre maximum 3SA avec arrêt Cœur');
assert.equal(v('015').shape[1],1,'cue-bid du contreur sans arrêt Cœur');
const unique=new Set();
for(const x of xs){const key=JSON.stringify([x.hand,x.auction]);assert.ok(!unique.has(key),'collision main/séquence '+x.id);unique.add(key);}
assert.equal(db.themes.length,22,'22 thèmes conservés');
console.log('PASS | V4.76 : 1046 originaux immuables, 15 situations, 45 distracteurs vérifiés');
