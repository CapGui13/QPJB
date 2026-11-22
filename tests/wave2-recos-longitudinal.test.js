'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');

const profileNames=['tout_juste','echecs_persistants','erreurs_moderees','aide','progression_graduelle'];
const pool=Array.from({length:7},(_,i)=>({id:'POOL-'+i,theme:'ouv',answer:'Passe',
  difficulty:1,caseFamily:'FAM-'+i,auction:[],difficultyReason:''}));
function question(i){
  if(i%4===0)return {id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
    caseFamily:'AXIS-PROBE',auction:['Partenaire : 1♠'],
    difficultyReason:'Soutien simple sur ouverture majeure'};
  const bid=['Passe','1♣','1♥'][(i-1)%3];
  return {id:'Q-'+i,theme:'ouv',answer:bid,difficulty:1,
    caseFamily:'F-'+i,auction:[],difficultyReason:''};
}
function choice(name,i){
  if(name==='tout_juste')return {result:'correct'};
  if(name==='echecs_persistants')return {result:'wrong'};
  if(name==='erreurs_moderees')return {result:i%5<2?'wrong':'correct'};
  if(name==='aide')return {result:'correct',assisted:i%2===0,hadFreeError:i%2!==0};
  if(name==='progression_graduelle')return i<22?{result:'wrong'}:
    i<28?{result:'correct',assisted:true}:{result:'correct'};
  throw Error('Profil inconnu');
}
function simulate(name,n){
  const s=core.empty();
  for(let i=0;i<n;i++){
    const q=question(i),v=choice(name,i);
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,v.result,0,null,!!v.assisted,!!v.hadFreeError),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
function measure(state,name,n){
  const before=JSON.stringify(state),catalogueBefore=JSON.stringify(pool);
  const top=rec.buildReport(state,{maxRecommendations:3,exercises:pool});
  const full=rec.buildReport(state,{maxRecommendations:10,exercises:pool});
  const again=rec.buildReport(state,{maxRecommendations:3,exercises:pool});
  assert.deepEqual(top,again,'résultat déterministe');
  assert.equal(JSON.stringify(state),before,'état conservé');
  assert.equal(JSON.stringify(pool),catalogueBefore,'catalogue conservé');
  assert.equal(top.status,'ok');assert.equal(top.completedSessions,n);
  assert.equal(top.observations.detailedSessions,n);
  assert.equal(top.observations.sessionsWithoutDetail,0);
  const counts=top.observations.parcours;
  assert.equal(counts.autonomous+counts.helped+counts.wrong+counts.skipped,n);
  assert.ok(top.recommendations.length<=3&&full.recommendations.length<=10);
  assert.equal(top.recommendations.some(x=>x.type==='not_evaluated'),false);
  if(name==='aide'||name==='echecs_persistants'){
    assert.equal(counts.autonomous,0);
    assert.ok(!full.recommendations.some(x=>x.type==='repeated_autonomous'));
  }
  if(name==='tout_juste'){
    assert.equal(counts.autonomous,n);
    assert.ok(full.recommendations.some(x=>x.type==='repeated_autonomous'));
    assert.equal(top.revision.available,false);
  }
  if(name==='progression_graduelle'){
    assert.ok(counts.wrong>0&&counts.helped>0&&counts.autonomous>0);
  }
  if(top.revision.available){
    assert.ok(full.recommendations.some(x=>x.type==='revision_session'));
    assert.ok(top.recommendations.some(x=>x.type==='revision_session'));
  }
  const result={profile:name,sessions:n,recorded:counts,
    all:full.recommendations.map(x=>x.id),
    visible:top.recommendations.map(x=>x.id),
    revisionAvailable:top.revision.available};
  process.stdout.write('M4-P4 '+JSON.stringify(result)+'\n');
  return result;
}
for(const name of profileNames){
  test('P4 profil '+name+' : 65 et 153 séances, visibilité et preuves constantes',()=>{
    const m65=measure(simulate(name,65),name,65);
    const m153=measure(simulate(name,153),name,153);
    assert.equal(m65.profile,m153.profile);
    assert.ok(m65.visible.length<=3&&m153.visible.length<=3);
  });
}
test('P4 profil progressif : première phase faible sans faux acquis',()=>{
  const r=rec.buildReport(simulate('progression_graduelle',20),{maxRecommendations:10});
  assert.equal(r.observations.parcours.autonomous,0);
  assert.ok(!r.recommendations.some(x=>x.type==='repeated_autonomous'));
});
