'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=source.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Bloc JSON du Quiz');
const db=JSON.parse(match[1]),xs=db.exercises;
const baseline=require('./quizz-baseline-1161-gitsha.json');
assert.equal(baseline.count,1161);
assert.ok(xs.length>=1175,'1161 historiques et 14 QCM Drury au minimum (extensions autorisées)');
assert.equal(db.themes.length,22,'22 rubriques');
const old=JSON.stringify(xs.slice(0,baseline.count)),digest=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old).digest('hex');
assert.equal(digest,baseline.gitBlobSha,'114? non : 1161 exercices historiques inchangés');
const found=new Map(xs.map(x=>[x.id,x]));assert.equal(found.size,xs.length,'IDs uniques');
const hcp={A:4,R:3,D:2,V:1};
const ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const rank=b=>{const m=b.match(/^([1-7])(♣|♦|♥|♠|SA)$/),s={'♣':0,'♦':1,'♥':2,'♠':3,'SA':4};return m?(+m[1]-1)*5+s[m[2]]:null};
const expectations=[
 ['001','respH',11,[3,3,4,3],'2♥'],
 ['002','respH',9,[3,4,3,3],'3♥'],
 ['003','respS',11,[3,3,4,3],'2♠'],
 ['004','respS',9,[4,3,3,3],'3♠'],
 ['005','singH',9,[4,4,4,1],'3♥'],
 ['006','singH',9,[4,4,1,4],'3♦'],
 ['007','singH',9,[1,4,4,4],'3♠'],
 ['008','singS',9,[4,4,4,1],'3♠'],
 ['009','singS',9,[4,4,1,4],'3♦'],
 ['010','singS',9,[4,1,4,4],'3♥'],
 ['011','openH',18,[2,6,3,2],'3♥'],
 ['012','openS',17,[6,2,3,2],'3♠'],
 ['013','openH',12,[3,5,4,1],'4♥'],
 ['014','openS',12,[5,3,4,1],'4♠']
];
const choices={
 respH:['2♥','2SA','3♥','4♥'],
 respS:['2♠','2SA','3♠','4♠'],
 singH:['3♦','3♥','3♠','4♥'],
 singS:['3♦','3♥','3♠','4♠'],
 openH:['2♦','2♥','3♥','4♥'],
 openS:['2♦','2♠','3♠','4♠']
};
const shapes=new Set();
for(const x of xs){
 const sig=JSON.stringify([x.auction,x.hand]);
 assert.ok(!shapes.has(sig),'Pas de main et séquence dupliquées '+x.id);
 shapes.add(sig);
}
for(const [n,fam,H,shape,answer] of expectations){
 const id='SEF-V484-'+n,x=found.get(id);
 assert.ok(x,id+' existe');
 assert.equal(x.theme,'drury',id+' rubrique Drury');
 assert.equal(x.answer,answer,id+' bonne réponse');
 assert.equal(x.h,H,id+' points H');
 assert.deepEqual(x.shape,shape,id+' forme');
 assert.deepEqual(x.hand.map(s=>s.length),shape,id+' longueurs');
 assert.equal(x.hand.flat().length,13,id+' 13 cartes');
 for(const s of x.hand){assert.ok(s.every(c=>ranks.has(c)),id+' rangs de cartes valides');assert.equal(s.length,new Set(s).size,id+' aucun doublon dans la même couleur');}
 assert.equal(x.hand.flat().reduce((sum,c)=>sum+(hcp[c]||0),0),H,id+' points H recomptés');
 assert.deepEqual(x.choices,choices[fam],id+' options');
 assert.equal(x.choices.length,4,id+' quatre options');
 assert.equal(new Set(x.choices).size,4,id+' options distinctes');
 assert.ok(x.choices.includes(x.answer),id+' réponse présente');
 assert.deepEqual(x.choices.map(rank),x.choices.map(rank).toSorted((a,b)=>a-b),id+' ordre des enchères');
 const last=x.auction.map(s=>s.match(/:\s*([1-7](?:♣|♦|♥|♠|SA))/)).filter(Boolean).at(-1)[1];
 assert.ok(x.choices.every(c=>rank(c)>rank(last)),id+' toutes les annonces sont licites');
 assert.ok(x.context.length>=250&&x.explain.length>=150,id+' énoncé et correction');
 assert.ok(!x.whyNot&&!x.takeaway,id+' pas de correction des fausses réponses affichée');
 assert.ok(x.difficulty>=1&&x.difficulty<=5,id+' difficulté');
 assert.ok(x.auction.some(s=>/Passe \(premier tour\)/.test(s)),id+' Passe préalable dans la séquence');
 if(fam.startsWith('resp')){
  const i=fam==='respH'?1:0,major=i===1?'♥':'♠';
  assert.ok(!shape.includes(1)&&!shape.includes(0),id+' 4 atouts sans courte pour Drury');
  assert.ok(H+(shape[i]===4?2:0)>=11,id+' zone Drury 11 HLD');
  assert.equal(answer,(shape[i]===3?'2':'3')+major,id+' sécurité distributionnelle après 2♦');
  assert.ok(x.auction.some(s=>s.includes('2♦ (enchère d’attente')),id+' 2♦');
 }else if(fam.startsWith('sing')){
  const i=fam==='singH'?1:0,major=i===1?'♥':'♠';
  assert.equal(shape[i],4,id+' fit de quatre');
  const shorts=shape.map((v,i)=>v===1?i:-1).filter(i=>i>=0);
  assert.equal(shorts.length,1,id+' singleton unique');
  assert.equal(H,9,id+' force H');
  assert.ok(H+2+2>=11,id+' au moins 11 HLD');
  const j=shorts[0],expected=j===3?'3'+major:'3'+['♠','♥','♦','♣'][j];
  assert.equal(answer,expected,id+' relais 3♣ : description de la courte');
  assert.ok(x.auction.some(s=>s.includes('3♣ (relais')),id+' 3♣ relais');
 }else if(fam.startsWith('open')){
  const i=fam==='openH'?1:0,major=i===1?'♥':'♠';
  assert.ok(shape[i]>=5,id+' longueur majeure ouvreur');
  assert.ok(x.auction.some(s=>s.includes('2♣ (Drury')),id+' 2♣ partenaire');
  if(answer.startsWith('3'))assert.ok(H>=17&&shape[i]>=6,id+' ambitieuse recherche de chelem');
  else assert.ok(H===12&&shape[3]===1&&shape[i]===5,id+' manche nette avec distribution');
  assert.equal(answer.endsWith(major),true,id+' atout cohérent');
 }
}
assert.equal(xs.filter(x=>x.id.startsWith('SEF-V484-')).length,14);
assert.deepEqual(xs.slice(1161,1175).map(x=>x.id),expectations.map(x=>'SEF-V484-'+x[0]),'Historique conservé, ajouts terminaux');
console.log('PASS | V4.84 : 1161 historiques intacts, 14 décisions Drury SEF2024, 42 distracteurs, 13 cartes, H et distributions validés');

