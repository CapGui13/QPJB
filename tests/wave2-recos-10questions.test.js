'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),reco=require('../parcours-recommandations.js');
function exercise(i){
  const bid=i<5?'Passe':i<8?'1♣':'1♥';
  if(i===9)return {id:'SEF-026-3',theme:'majeur',answer:'2♠',
    difficulty:1,difficultyReason:'Soutien simple sur ouverture majeure',
    auction:['Partenaire : 1♠'],caseFamily:'AXIS-FIT'};
  return {id:'TEN-'+i,theme:'ouv',answer:bid,difficulty:1,
    difficultyReason:'',auction:[],caseFamily:'TEN-FAM-'+i};
}
const ten=Array.from({length:10},(_,i)=>exercise(i));
// La sonde d'axe SEF conserve son ID réel. Le plan de révision utilise le vrai catalogue,
// et non des métadonnées inventées pour cet ID de production.
const realCatalogue=require('./progression-guidee-historical.cjs').catalogue().exercises;
function doSession(state,mode='wrong'){
  state.active={ids:ten.map(x=>x.id),index:0,answers:{},createdAt:state.completed};
  for(let i=0;i<10;i++){
    const result=mode==='autonomous'?'correct':mode==='helped'?'correct':
      (state.completed+i)%4===0?'correct':'wrong';
    const assisted=mode==='helped',hadFreeError=false;
    assert.equal(core.record(state,ten[i],result,i,null,assisted,hadFreeError),true);
  }
  assert.equal(core.finish(state,ten),true);
}
function many(n,mode){
  const state=core.empty();
  for(let i=0;i<n;i++)doSession(state,mode);
  return state;
}
const counts=r=>r.observations.parcours;
for(const n of [65,153]){
  test('P7 '+n+' séances de dix réponses : fidélité et absence de faux acquis',()=>{
    const s=many(n,'helped'),before=JSON.stringify(s);
    assert.equal(s.journal.length,n);
    assert.ok(s.journal.every(e=>e.answers.length===10));
    const r=reco.buildReport(s,{maxRecommendations:3,exercises:realCatalogue});
    assert.equal(r.observations.detailedSessions,n);
    assert.equal(r.observations.sessionsWithoutDetail,0);
    assert.equal(counts(r).helped,n*10);
    assert.equal(counts(r).autonomous,0);
    assert.ok(!r.recommendations.some(x=>x.type==='repeated_autonomous'));
    assert.ok(r.recommendations.length<=3);
    assert.equal(JSON.stringify(s),before);
    process.stdout.write('M4-P7 '+JSON.stringify({sessions:n,questions:n*10,
      visible:r.recommendations.map(x=>x.id),revisionAvailable:r.revision.available})+'\n');
  });
}

test('P7 65 séances complètes puis 9/10 réponses : reprise et non-achèvement',()=>{
  const s=many(65,'autonomous');
  s.active={ids:ten.map(x=>x.id),index:9,answers:{},createdAt:s.completed};
  for(let i=0;i<9;i++)
    assert.equal(core.record(s,ten[i],'wrong',i,null,false,false),true);
  const before=JSON.stringify(s),r=reco.buildReport(s,{exercises:ten,maxRecommendations:3});
  assert.equal(r.completedSessions,65);
  assert.equal(r.observations.parcours.autonomous,650);
  assert.equal(r.currentSession.answered,9);
  assert.equal(r.currentSession.total,10);
  assert.equal(r.revision,null);
  assert.equal(r.recommendations[0].type,'resume');
  assert.equal(JSON.stringify(s),before);
  assert.equal(core.finish(s,ten),false);
  assert.equal(s.completed,65);
});

test('P7 mesures dix questions sur trajectoire autonome intacte',()=>{
  const s=many(153,'autonomous'),r=reco.buildReport(s,{maxRecommendations:10});
  assert.equal(counts(r).autonomous,1530);
  assert.equal(counts(r).helped,0);
  assert.ok(r.recommendations.some(x=>x.type==='repeated_autonomous'));
  assert.equal(r.observations.detailedSessions,153);
});
