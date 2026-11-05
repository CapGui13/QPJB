'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Base Quiz intégrée');
const db=JSON.parse(m[1]),xs=db.exercises,base=require('./quizz-baseline-1088-gitsha.json');
assert.ok(xs.length>=1104,'1088 exercices existants et 16 décisions Multi-Landy');
assert.equal(db.themes.length,22,'Les 22 rubriques sont conservées');
const older=JSON.stringify(xs.slice(0,base.count));
const digest=createHash('sha1').update('blob '+Buffer.byteLength(older,'utf8')+'\0'+older,'utf8').digest('hex');
assert.equal(digest,base.gitBlobSha,'1088 exercices antérieurs inchangés et dans le même ordre');
const byId=new Map(xs.map(x=>[x.id,x]));assert.equal(byId.size,xs.length,'IDs uniques');
const H={A:4,R:3,D:2,V:1},ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const ord={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const score=s=>{const m=String(s).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+ord[m[2]]:null;};
const auctions={
 L:['Adversaire : 1SA (15-17 H)','Partenaire : 2♣ (Landy)','Adversaire : Passe'],
 LR:['Adversaire : 1SA (15-17 H)','Vous : 2♣ (Landy)','Adversaire : Passe','Partenaire : 2♦ (relais)','Adversaire : Passe'],
 M:['Adversaire : 1SA (15-17 H)','Partenaire : 2♦ (Multi-Landy, unicolore majeur)','Adversaire : Passe'],
 ML:['Adversaire : 1SA (15-17 H)','Vous : 2♦ (Multi-Landy, unicolore majeur)','Adversaire : Passe','Partenaire : 2♥ (relais faible)','Adversaire : Passe'],
 MH:['Adversaire : 1SA (15-17 H)','Vous : 2♦ (Multi-Landy, unicolore majeur)','Adversaire : Passe','Partenaire : 2♠ (relais accepte 3♥)','Adversaire : Passe'],
 MM:['Adversaire : 1SA (15-17 H)','Vous : 2♥ (Multi-Landy : Cœur et mineure)','Adversaire : Passe','Partenaire : 3♣ (passe ou corrige)','Adversaire : Passe'],
 MR:['Adversaire : 1SA (15-17 H)','Partenaire : 2♠ (Multi-Landy : Pique et mineure)','Adversaire : Passe']
};
const specs=[
['001',4,[2,4,4,3],'2♥','L'],['002',3,[4,2,4,3],'2♠','L'],
['003',6,[3,3,4,3],'2♦','L'],['004',10,[4,4,3,2],'2SA','L'],
['005',9,[4,5,2,2],'2♥','LR'],['006',9,[5,4,2,2],'2♠','LR'],
['007',6,[4,1,4,4],'2♥','M'],['008',6,[2,3,4,4],'2♠','M'],
['009',13,[3,3,4,3],'2SA','M'],['010',10,[2,6,3,2],'Passe','ML'],
['011',10,[6,2,3,2],'2♠','ML'],['012',10,[2,6,3,2],'3♥','MH'],
['013',10,[6,2,3,2],'Passe','MH'],['014',10,[2,5,1,5],'Passe','MM'],
['015',10,[2,5,5,1],'3♦','MM'],['016',12,[3,3,4,3],'2SA','MR']
];
const situations=new Set();
for(const x of xs){const key=JSON.stringify([x.hand,x.auction]);assert.ok(!situations.has(key),'Aucune collision main/séquence '+x.id);situations.add(key);}
for(const [num,h,shape,answer,auctionKey] of specs){
 const id='SEF-V479-'+num,x=byId.get(id);assert.ok(x,id+' est présent');
 assert.equal(x.theme,'multilandy',id+' rubrique');
 assert.equal(x.answer,answer,id+' décision');
 assert.equal(x.h,h,id+' points H');
 assert.deepEqual(x.shape,shape,id+' distribution');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' longueurs par couleur');
 assert.equal(x.hand.flat().length,13,id+' treize cartes');
 assert.equal(x.hand.flat().reduce((n,c)=>n+(H[c]||0),0),h,id+' recomptage H');
 for(const suit of x.hand){assert.ok(suit.every(r=>ranks.has(r)),id+' rangs valides');assert.equal(new Set(suit).size,suit.length,id+' rangs différents dans chaque couleur');}
 assert.deepEqual(x.auction,auctions[auctionKey],id+' séquence de convention');
 assert.equal(x.choices.length,4,id+' quatre propositions');
 assert.equal(new Set(x.choices).size,4,id+' propositions distinctes');
 assert.ok(x.choices.includes(answer),id+' bonne réponse proposée');
 const prior=x.auction.map(a=>score((a.match(/:\s*([1-7](?:♣|♦|♥|♠|SA))/)||[])[1]||'')).filter(s=>s!==null).at(-1);
 assert.ok(x.choices.every(c=>c==='Passe'||(score(c)!==null&&score(c)>prior)),id+' enchères légales au-dessus du dernier contrat');
 const bids=x.choices.filter(c=>c!=='Passe').map(score);
 assert.deepEqual(bids,bids.toSorted((a,b)=>a-b),id+' propositions ordonnées par cherté');
 assert.ok(x.context.length>=120&&x.explain.length>=120,id+' corrigé individualisé');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté renseignée');
 assert.ok(!x.whyNot&&!x.takeaway,id+' explication positive uniquement');
}
const v=n=>byId.get('SEF-V479-'+n);
assert.equal(v('005').shape[0],4,'Landy à cinq Cœurs et quatre Piques minimum');
assert.equal(v('006').shape[1],4,'Landy à cinq Piques et quatre Cœurs minimum');
assert.notEqual(v('001').answer,v('002').answer,'Préférences contrastives Landy');
assert.equal(v('003').answer,'2♦','2♦ relay avec trois-trois en majeures');
assert.equal(v('004').answer,'2SA','Landy constructif, deux fits quatrièmes');
assert.notEqual(v('010').answer,v('011').answer,'Redemandes du Multi sur 2♥');
assert.notEqual(v('012').answer,v('013').answer,'Redemandes du Multi sur 2♠');
assert.notEqual(v('014').answer,v('015').answer,'3♣ passe ou corrige après 2♥');
console.log('PASS | Quiz V4.79 : 1088 historiques immuables, 16 décisions, 48 distracteurs, relais Landy et Multi');
