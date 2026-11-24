'use strict';
// Current data invariants. Historical proofs belong to their own immutable edition.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const H=require('./progression-guidee-historical.cjs');
const root=path.resolve(__dirname,'..');
function readLive(){return JSON.parse(H.payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8')));}
function validate(data,meta,reference=H.catalogue()){
 assert(Array.isArray(data.exercises)&&Array.isArray(data.themes),'catalogue schema');
 const themes=new Set(data.themes.map(x=>x.id)),ids=new Set(data.exercises.map(q=>q.id));
 assert.equal(themes.size,data.themes.length,'unique themes');
 assert.equal(ids.size,data.exercises.length,'unique QCM IDs');
 for(const q of reference.exercises)assert(ids.has(q.id),'historical ID removed: '+q.id);
 for(const theme of reference.themes)assert(themes.has(theme.id),'historical theme removed: '+theme.id);
 assert.equal(meta.schema,'QPJB_PREREQUIS_V1');
 assert(meta.byId&&typeof meta.byId==='object');
 assert.equal(Object.keys(meta.byId).length,ids.size,'exact prerequisite coverage');
 const concepts=new Set(Object.values(meta.byId).map(m=>m.concept));
 for(const q of data.exercises){
  assert(typeof q.id==='string'&&q.id&&themes.has(q.theme),'known ID/theme');
  assert(!q.whyNot&&!q.takeaway,'only correct-bid explanation '+q.id);
  const m=meta.byId[q.id];assert(m&&typeof m.concept==='string'&&m.concept.length,'concept '+q.id);
  assert([0,1,2,3].includes(m.stage)&&Number.isInteger(m.minSession)&&m.minSession>=0,'stage '+q.id);
  assert(Array.isArray(m.requires),'requirements '+q.id);
  for(const r of m.requires)assert(concepts.has(r.concept)&&Number.isInteger(r.minExposure)&&r.minExposure>0,'known prerequisite '+q.id);
 }
 return data;
}
function simulate(data,api,horizon=65){
 const xs=data.exercises,known=new Set(xs.map(q=>q.id)),state=api.empty();
 for(let s=0;s<horizon;s++){
  const deck=api.start(state,xs);
  assert.equal(deck.length,10,'complete live session '+s);
  assert.equal(new Set(deck.map(q=>q.id)).size,10,'distinct live IDs');
  assert(deck.every(q=>known.has(q.id)),'live catalogue IDs only');
  if(s===0){
   const counts=Object.fromEntries([...new Set(deck.map(q=>q.answer))].map(a=>[a,deck.filter(q=>q.answer===a).length]));
   assert.equal(counts.Passe,3,'opening Pass balance');
   assert((counts['1♣']||0)>=2&&(counts['1♦']||0)>=2,'opening minor balance');
   assert(deck.every(q=>q.theme==='ouv'),'initial openings');
  }
  deck.forEach((q,i)=>assert(api.record(state,q,i%4===0?'wrong':'correct',i,null,false,false),'live answer'));
  assert(api.finish(state,xs),'finish live session');
  assert.equal(state.completed,s+1,'completed live session');
 }
 assert.deepEqual(api.load(JSON.stringify(state)).completed,horizon,'live resume');
 console.log('LIVE_GUIDED_PASS '+horizon+' sessions');
}
if(require.main===module){
 const data=validate(readLive(),require('../quizz-prerequis.js'));
 console.log('LIVE_CATALOGUE_PASS '+data.exercises.length+' QCM, stable IDs and exact prerequisites');
 if(process.argv.includes('--simulate'))simulate(data,require('../quizz-parcours.js'));
}
module.exports={readLive,validate,simulate};
