'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'P24',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
const variants=[
  {key:'A',result:'correct'},
  {key:'H',result:'correct',assisted:true},
  {key:'F',result:'correct',hadFreeError:true},
  {key:'S',result:'skipped'},
  {key:'W',result:'wrong'}
];
function make(seq){
  const s=core.empty();
  for(const a of seq){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,a.result,0,null,!!a.assisted,!!a.hadFreeError),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
test('P24 matrice exhaustive 125 trajectoires de trois séances, preuves et pureté',()=>{
  const titleCounts={};let checked=0;
  for(const first of variants)for(const second of variants)for(const third of variants){
    const code=first.key+second.key+third.key,s=make([first,second,third]);
    const before=JSON.stringify(s),r=rec.buildReport(s,{maxRecommendations:10});
    const c=r.observations.parcours;
    assert.equal(c.autonomous+c.helped+c.wrong+c.skipped,3,code);
    assert.equal(r.completedSessions,3,code);
    assert.equal(r.observations.detailedSessions,3,code);
    assert.equal(r.observations.sessionsWithoutDetail,0,code);
    assert.ok(!r.recommendations.some(x=>x.type==='repeated_autonomous')||c.autonomous>=3,code);
    const area=r.recommendations.find(x=>x.evidence?.key==='majeur:1♠');
    if(c.wrong===0&&c.autonomous===0)
      assert.ok(!area?.title.startsWith('Difficulté persistante'),code);
    if(area?.evidence?.assistedOnly)
      assert.ok(c.helped>0&&c.skipped===0&&c.wrong===0&&c.autonomous===0,code);
    if(area?.evidence?.skippedOnly)
      assert.ok(c.skipped===3&&c.helped===0&&c.wrong===0&&c.autonomous===0,code);
    if(area?.evidence?.helpedAndSkipped)
      assert.ok(c.helped>0&&c.skipped>0&&c.wrong===0&&c.autonomous===0,code);
    assert.deepEqual(rec.buildReport(s,{maxRecommendations:10}),r,code);
    assert.equal(JSON.stringify(s),before,code);
    const category=area?.title?.split(':')[0]||'no-area';
    titleCounts[category]=(titleCounts[category]||0)+1;
    checked++;
  }
  assert.equal(checked,125);
  assert.equal(Object.values(titleCounts).reduce((a,b)=>a+b,0),125);
  process.stdout.write('M4-P24 '+JSON.stringify({cases:checked,titleCounts})+'\n');
});
