'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const target={id:'SEF-026-3',theme:'majeur',answer:'2♠',
  difficulty:1,caseFamily:'AXIS-PROBE',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function simulate(n,perSession){
  const s=core.empty();
  for(let session=0;session<n;session++){
    const qs=[target,...Array.from({length:perSession-1},(_,i)=>({
      id:'STAY-'+session+'-'+i,theme:'stayman',answer:'2♣',
      difficulty:1,caseFamily:'STAY-FAM-'+session+'-'+i,auction:[],difficultyReason:''
    }))];
    s.active={ids:qs.map(x=>x.id),index:0,answers:{},createdAt:s.completed};
    for(let i=0;i<qs.length;i++)
      assert.equal(core.record(s,qs[i],'wrong',i,null,false,false),true);
    assert.equal(core.finish(s,qs),true);
  }
  return s;
}

for(const n of [65,153]){
  test('P17 '+n+' séances complètes : regroupement et coût bornés sans seuil artificiel',()=>{
    const s=simulate(n,10),before=JSON.stringify(s);
    const start=Date.now();
    let report;
    for(let i=0;i<20;i++)report=rec.buildReport(s,{maxRecommendations:3});
    const elapsed=Date.now()-start;
    assert.equal(report.observations.parcours.wrong,n*10);
    assert.equal(report.observations.detailedSessions,n);
    assert.equal(report.observations.sessionsWithoutDetail,0);
    assert.equal(report.recommendations.filter(x=>x.type==='persistent_difficulty').length,1);
    assert.equal(report.recommendations[0].evidence.source,'micros');
    assert.deepEqual(report.recommendations[0].evidence.sameAnswersAs,
      [{source:'axes',key:'fit',label:core.AXIS_LABELS.fit}]);
    assert.equal(JSON.stringify(s),before);
    process.stdout.write('M4-P17 '+JSON.stringify({sessions:n,answers:n*10,
      runs:20,elapsedMs:elapsed,observed:report.observations.parcours.wrong})+'\n');
  });
}

test('P17 1001 séances : troncature du journal V1, regroupement interdit',()=>{
  const s=simulate(1001,1),before=JSON.stringify(s);
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(s.completed,1001);
  assert.equal(r.observations.detailedSessions,1000);
  assert.equal(r.observations.sessionsWithoutDetail,1);
  assert.equal(r.observations.parcours.wrong,1000);
  const difficulties=r.recommendations.filter(x=>x.type==='persistent_difficulty');
  assert.equal(difficulties.length,2);
  assert.ok(difficulties.every(x=>x.evidence.sameAnswersAs===undefined));
  assert.match(r.limitations.join(' '),/1 séance\(s\) terminée\(s\) sans journal/);
  assert.equal(JSON.stringify(s),before);
});
