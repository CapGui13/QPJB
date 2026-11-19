'use strict';
/* Phase W : audit des niveaux editoriaux, pas d'evaluation des eleves. */
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const W=require('../scripts/parcours-v2-progression-w.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
const originalDifficulty=Object.fromEntries(catalog.map(q=>[q.id,q.difficulty]));
const originalIds=catalog.map(q=>q.id);
const source=W.coverage(catalog);
assert.equal(source.count,1523);
assert.equal(Object.values(source.histogram).reduce((a,b)=>a+b,0),1523);
assert.equal(Object.keys(source.themes).length,22);
for(const profile of ['balanced','fragile-mineures']){
 const sim=F.simulateV2(catalog,annotations,{sessions:15,seed:13,profile});
 const before=JSON.stringify(sim.state),ids=sim.sessions.map(deck=>deck.map(q=>q.id));
 const a=W.trace(sim.sessions,catalog,annotations),b=W.trace(sim.sessions,catalog,annotations);
 assert.deepEqual(a,b,'Analyse deterministic');
 assert.equal(a.status,'EXPOSITION_SYNTHETIQUE_LECTURE_SEULE');
 assert.equal(a.sessions,15);
 assert.equal(a.questions,150);
 assert.equal(a.wholeCatalog,1523);
 assert.deepEqual(a.windows.map(w=>[w.from,w.to]),[[1,5],[6,10],[11,15]]);
 assert.equal(a.windows.reduce((n,w)=>n+w.questions,0),150);
 assert.equal(a.perSession.length,15);
 assert.equal(Object.values(a.difficultyHistogram).reduce((n,v)=>n+v,0),150);
 assert.equal(a.firstFiveDifficulty4Or5,
   sim.sessions.slice(0,5).flat().filter(q=>q.difficulty>=4).length);
 assert.equal(a.firstTenDifficulty4Or5,
   sim.sessions.slice(0,10).flat().filter(q=>q.difficulty>=4).length);
 assert.equal(new Set(a.firstThemeExposures.map(x=>x.theme)).size,a.themesSeen);
 assert.equal(new Set(a.firstMicroContextExposures.map(x=>x.key)).size,a.microContextsSeen);
 assert.ok(a.firstMicroContextExposures.every(x=>x.type==='ANNOTATION_CANDIDATE'||
   x.type==='MICRO_CONTEXTE'));
 assert.ok(a.firstThemeExposures.every(x=>x.session>=x.intro));
 assert.ok(a.windows.every(x=>x.questions===(x.to-x.from+1)*10));
 assert.ok(a.perSession.every(x=>x.difficultyHistogram[1]+x.difficultyHistogram[2]+
   x.difficultyHistogram[3]+x.difficultyHistogram[4]+x.difficultyHistogram[5]===10));
 assert.deepEqual(sim.sessions.map(deck=>deck.map(q=>q.id)),ids);
 assert.equal(JSON.stringify(sim.state),before);
 assert.equal(a.learnerDataUsed,false);
 assert.equal(a.proficiencyInferred,false);
 assert.equal(a.selectionChanged,false);
 assert.equal(a.publicRuntimeWired,false);
}
assert.deepEqual(catalog.map(q=>q.id),originalIds);
assert.deepEqual(Object.fromEntries(catalog.map(q=>[q.id,q.difficulty])),originalDifficulty);
const testSim=F.simulateV2(catalog,annotations,{sessions:5,seed:13});
const fake=testSim.sessions.map(deck=>deck.slice());
fake[0][0]={...fake[0][0],difficulty:5};
assert.throws(()=>W.trace(fake,catalog,annotations),/Source QCM remplacee/);
assert.throws(()=>W.trace([],catalog,annotations),/Dix QCM/);
assert.throws(()=>W.histogram([{id:'fake',difficulty:6}]),/hors echelle/);
console.log('QPJB V2 W PASS : 1523 labels, themes, premieres expositions, 0 mutation, 0 acquis');
