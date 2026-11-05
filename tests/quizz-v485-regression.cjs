'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'La base du Quiz SEF est présente');
const db=JSON.parse(m[1]),xs=db.exercises,baseline=require('./quizz-baseline-1175-gitsha.json');
assert.equal(baseline.count,1175,'1175 historiques');
assert.equal(xs.length,1186,'1175 historiques + 11 nouveaux');
assert.equal(db.themes.length,22,'22 thèmes historiques');
const original=JSON.stringify(xs.slice(0,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original).digest('hex');
assert.equal(sha,baseline.gitBlobSha,'empreinte bit-à-bit des 1175 historiques');
const ids=new Map(xs.map(x=>[x.id,x]));assert.equal(ids.size,xs.length,'IDs uniques');
const pts={A:4,R:3,D:2,V:1},cards=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const ord={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const rank=s=>{if(s==='Passe')return -2;if(s==='Surcontre')return -1;const m=s.match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+ord[m[2]]:null};
const cases=[
['001','♣',9,[2,3,3,5],'2SA',['1SA','2♣','2SA','3♣'],'truscott'],
['002','♣',3,[3,3,1,6],'3♣',['Passe','2♣','2SA','3♣'],'barrage'],
['003','♦',8,[3,4,3,3],'1♥',['Passe','1♥','1SA','2♥'],'majorH'],
['004','♦',7,[4,3,3,3],'1♠',['1♥','1♠','1SA','2♠'],'majorS'],
['005','♣',7,[3,4,3,3],'1♥',['1♦','1♥','1♠','1SA'],'majorH'],
['006','♣',8,[4,3,3,3],'1♠',['1♥','1♠','1SA','2♠'],'majorS'],
['007','♣',7,[3,3,4,3],'1♦',['Passe','1♦','1SA','2♦'],'diamond'],
['008','♦',5,[3,2,2,6],'2♣',['1SA','2♣','2SA','3SA'],'clubs'],
['009','♦',9,[3,3,3,4],'1SA',['Passe','1SA','2♣','2SA'],'nt'],
['010','♣',3,[3,3,4,3],'Passe',['Passe','1♦','1SA','2♣'],'pass'],
['011','♦',6,[2,3,5,3],'2♦',['1SA','2♦','2SA','3♦'],'support']
];
const duplicates=new Set();
for(const x of xs){const k=JSON.stringify([x.auction,x.hand]);assert.ok(!duplicates.has(k),'main + séquence unique : '+x.id);duplicates.add(k);}
for(const [n,minor,H,shape,answer,options,skill] of cases){
 const id='SEF-V485-'+n,x=ids.get(id);assert.ok(x,id);
 assert.equal(x.theme,'apres_inter',id+' rubrique');
 assert.deepEqual(x.auction,['Partenaire : 1'+minor,'Adversaire : Contre (d’appel)'],id+' enchère actuelle');
 assert.equal(x.answer,answer,id+' solution');assert.deepEqual(x.choices,options,id+' 4 propositions');
 assert.equal(x.h,H,id+' H affichés');assert.deepEqual(x.shape,shape,id+' distribution affichée');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' distribution calculée');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 for(const suit of x.hand){assert.equal(new Set(suit).size,suit.length,id+' pas de cartes identiques dans une couleur');assert.ok(suit.every(c=>cards.has(c)),id+' rangs valides');}
 assert.equal(x.hand.flat().reduce((t,c)=>t+(pts[c]||0),0),H,id+' honneurs recomptés');
 assert.ok(x.choices.length===4&&new Set(x.choices).size===4&&x.choices.includes(x.answer),id+' quatre propositions distinctes');
 const minimum=rank('1'+minor);
 assert.ok(x.choices.every(c=>rank(c)!==null&&(c==='Passe'||c==='Surcontre'||rank(c)>minimum)),id+' annonces légales et supérieures au contrat actuel');
 assert.deepEqual(x.choices.map(rank),x.choices.map(rank).toSorted((a,b)=>a-b),id+' ordre de cherté');
 assert.ok(x.context.length>=270&&x.explain.length>=170,id+' contexte et explication présents');
 assert.ok(!x.whyNot&&!x.takeaway,id+' seule la bonne réponse est justifiée dans le Quiz');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté');
 const hearts=shape[1],spades=shape[0],trumps=shape[minor==='♣'?3:2];
 if(skill==='majorH'||skill==='majorS'){
  const suit=skill==='majorH'?1:0;
  assert.equal(shape[suit],4,id+' majeure quatrième');
  assert.ok(H>=7,id+' seuil minimal 7HL après contre');
  assert.equal(answer,skill==='majorH'?'1♥':'1♠',id+' changement de couleur au palier 1');
  assert.ok((skill==='majorH'?spades:hearts)<4,id+' pas de majeure concurrente');
 }
 if(skill==='diamond'){assert.equal(shape[2],4,id+' ♦ quatrième');assert.ok(H>=7&&hearts<4&&spades<4,id+' nouvelle mineure 1♦');}
 if(skill==='truscott'){assert.ok(trumps>=5&&H>=9&&hearts<4&&spades<4,id+' truscott mineur 5+ atouts 9+ H');}
 if(skill==='barrage'){assert.ok(trumps>=6&&H<7&&x.context.includes('non vulnérable'),id+' barrage court et faible en vulnérabilité favorable');}
 if(skill==='clubs'){assert.ok(shape[3]>=6&&trumps<=2&&H<=10&&hearts<4&&spades<4,id+' 2♣ naturel non forcing');}
 if(skill==='nt'){assert.ok(H>=8&&H<=10&&hearts<4&&spades<4&&trumps<5&&shape.every(v=>v<=4),id+' 1SA naturel régulier');}
 if(skill==='pass'){assert.ok(H<6&&hearts<4&&spades<4&&trumps<5,id+' pas de réponse défendable');}
 if(skill==='support'){assert.ok(trumps>=5&&H<9&&x.context.includes('camp est vulnérable'),id+' soutien simple sous le Truscott');}
}
assert.equal(xs.filter(x=>/^SEF-V485-\d{3}$/.test(x.id)).length,11,'onze QCM V4.85 exactement');
assert.deepEqual(xs.slice(-11).map(x=>x.id),cases.map(c=>'SEF-V485-'+c[0]),'seuls les 11 derniers QCM sont nouveaux');
console.log('PASS | V4.85 : 1175 historiques intacts, 11 décisions après mineure contrée, 33 distracteurs, 13 cartes, H, formes, enchères et vulnérabilité vérifiés');

