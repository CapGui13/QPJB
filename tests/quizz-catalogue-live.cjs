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
function openingPassPositions(deck){
 return deck.flatMap((q,i)=>q.theme==='ouv'&&q.answer==='Passe'?[i+1]:[]);
}
function checkEarlyPasses(deck,s){
 if(s>2)return;
 const p=openingPassPositions(deck);
 if(s===0){
  assert.equal(p.length,3,'S1 three opening Passes');
  assert(p[0]<=2&&p[1]<=5&&p[2]<=7,'S1 opening Pass deadlines 2/5/7: '+p);
  assert(deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').every(q=>q.h<12&&q.difficulty===1),'S1 elementary Passes');
 }else if(s===1){
  assert(p.length>=1&&p.length<=2,'S2 one or two opening Passes');
  assert(p[0]<=4&&(p.length===1||p[1]<=7),'S2 early opening Passes: '+p);
 }else{
  assert(p.length<=1,'S3 at most one opening Pass');
  assert(!p.length||p[0]<=4,'S3 early opening Pass: '+p);
 }
 assert(p.every((pos,i)=>!i||pos-p[i-1]>=2),'separated opening Passes');
}
function verifyEarlyProfiles(data,api){
 const xs=data.exercises;
 for(const profile of ['correct','wrong','mixed','assisted','passwrong','skipped']){
  const state=api.empty();
  for(let s=0;s<3;s++){
   const deck=api.start(state,xs);
   assert.equal(deck.length,10);
   checkEarlyPasses(deck,s);
   console.log('EARLY_PASSES '+profile+' S'+(s+1)+' '+openingPassPositions(deck).join(','));
   deck.forEach((q,i)=>{
    const correct=profile==='correct'||profile==='assisted'||profile==='mixed'&&i%3!==0||profile==='passwrong'&&q.answer!=='Passe';
    assert(api.record(state,q,profile==='skipped'?'skipped':correct?'correct':'wrong',i,null,profile==='assisted',false));
   });
   assert(api.finish(state,xs));
  }
 }
 // Simulate a saved old order with Passes at the end, never played.
 const pending=api.empty(),deck=api.start(pending,xs);
 const late=[...deck.filter(q=>q.answer!=='Passe'),...deck.filter(q=>q.answer==='Passe')];
 const byId=new Map(pending.active.selection.map(x=>[x.id,x]));
 pending.active.ids=late.map(q=>q.id);
 pending.active.selection=pending.active.ids.map(id=>byId.get(id));
 const untouched=api.load(JSON.stringify(pending));
 checkEarlyPasses(api.start(untouched,xs),0);
 // The same old order, after an answer, cannot be rearranged.
 assert(api.record(pending,late[0],'correct',0,null,false,false));
 api.move(pending,1);
 const played=api.load(JSON.stringify(pending)),original=JSON.stringify(played.active);
 assert.deepEqual(api.start(played,xs).map(q=>q.id),late.map(q=>q.id));
 assert.equal(JSON.stringify(played.active),original,'answered old session unchanged');
 console.log('EARLY_PASSES_RESUME_PASS');
}
function simulate(data,api,horizon=65){
 const xs=data.exercises,known=new Set(xs.map(q=>q.id)),state=api.empty();
 for(let s=0;s<horizon;s++){
  const deck=api.start(state,xs);
  assert.equal(deck.length,10,'complete live session '+s);
  assert.equal(new Set(deck.map(q=>q.id)).size,10,'distinct live IDs');
  assert(deck.every(q=>known.has(q.id)),'live catalogue IDs only');
  checkEarlyPasses(deck,s);
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
 if(process.argv.includes('--simulate')){
  const api=require('../quizz-parcours.js');verifyEarlyProfiles(data,api);simulate(data,api);
 }
}
module.exports={readLive,validate,simulate,verifyEarlyProfiles};
