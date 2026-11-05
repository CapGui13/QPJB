const fs=require('node:fs');
const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const js=read('entrainement/training-pilot-v1.js');
const html=read('entrainement/index.html');
const app=read('entrainement/training-app.js');
const b=read('entrainement/training-data-bidding.js');
const p=read('entrainement/training-data-play.js');
const marker='const PILOT_9=';
const start=js.indexOf(marker)+marker.length;
const end=js.indexOf(';\n  const originalEnsureTrainingData',start);
assert(start>=marker.length && end>start,'Données pilote introuvables');
const pilot=JSON.parse(js.slice(start,end));
assert.equal(pilot.bidding.length,6);
assert.equal(pilot.play.length,3);
const cardCount=a=>a.reduce((n,s)=>n+String(s).replace(/10/g,'T').replace(/[\s-]/g,'').length,0);
const ids=new Set();
for(const q of pilot.bidding){
  assert(!ids.has(q.id));ids.add(q.id);
  assert.equal(cardCount(q.hand),13,q.id);
  assert.equal(q.choices.filter(v=>v===q.correct).length,1,q.id);
  assert(Array.isArray(q.auction),q.id);
}
for(const q of pilot.play){
  assert(!ids.has(q.id));ids.add(q.id);
  assert.equal(cardCount(q.north),13,q.id+' Nord');
  assert.equal(cardCount(q.south),13,q.id+' Sud');
  for(let suit=0;suit<4;suit++){
    const ranks=s=>String(s).replace(/10/g,'T').replace(/\s/g,'').split('');
    const all=[...ranks(q.north[suit]),...ranks(q.south[suit])];
    assert.equal(new Set(all).size,all.length,q.id+' doublon de cartes Nord/Sud');
  }
}
assert(html.includes('training-pilot-v1.js'));
assert(html.includes("get('pilot')!=='1'"));
assert(app.includes('QPJB_TRAINING_PILOT_9_V1'));
assert(js.includes('if(installed[kind])return'));
assert(js.includes('D.counts[kind]=D[kind].length'));
const idsAlready=JSON.parse(b.slice(b.indexOf('[')).replace(/;\s*$/,'')).map(x=>x.id)
 .concat(JSON.parse(p.slice(p.indexOf('[')).replace(/;\s*$/,'')).map(x=>x.id));
assert.equal(idsAlready.length,677);
assert.equal(idsAlready.filter(id=>ids.has(id)).length,0);
console.log('OK : 9 fiches, 677 fiches de référence, identifiants distincts, mains valides, chargement conditionnel et progression isolée.');
