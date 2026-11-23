'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'P28',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
const variants=[
  {key:'A',result:'correct'},
  {key:'H',result:'correct',assisted:true},
  {key:'F',result:'correct',hadFreeError:true},
  {key:'S',result:'skipped'},
  {key:'W',result:'wrong'}
];
function fixture(steps){
  const s=core.empty();
  for(const step of steps){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,step.result,0,null,!!step.assisted,!!step.hadFreeError),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
const byKey=(keys)=>fixture([...keys].map(k=>variants.find(v=>v.key===k)));
function card(state){
  return rec.buildReport(state,{maxRecommendations:10}).recommendations
    .find(x=>x.evidence?.key==='majeur:1♠');
}
test('P28 autonome et aides : pas de difficulté finale inventée',()=>{
  const s=byKey('AHHH'),before=JSON.stringify(s),r=rec.buildReport(s,{maxRecommendations:10});
  const x=card(s);
  assert.equal(x.type,'persistent_difficulty');
  assert.match(x.title,/Autonomie à consolider/);
  assert.equal(x.evidence.noFinalWrong,true);
  assert.equal(x.evidence.autonomousCount,1);
  assert.equal(x.evidence.helpedCount,3);
  assert.equal(x.evidence.skippedCount,0);
  assert.match(x.explanation.observed,/aucune réponse finale incorrecte/);
  assert.equal(r.observations.parcours.wrong,0);
  assert.equal(JSON.stringify(s),before);
});
test('P28 autonome et sauts : pas de fausse difficulté finale',()=>{
  const x=card(byKey('ASSS'));
  assert.equal(x.evidence.noFinalWrong,true);
  assert.equal(x.evidence.autonomousCount,1);
  assert.equal(x.evidence.skippedCount,3);
  assert.match(x.title,/Autonomie à consolider/);
});
test('P28 une réponse réellement fausse : ancien classement préservé',()=>{
  const x=card(byKey('AHWH'));
  assert.equal(x.type,'persistent_difficulty');
  assert.match(x.title,/Difficulté persistante/);
  assert.equal(x.evidence.noFinalWrong,undefined);
});
test('P28 historique partiel : ne déduit aucun zéro erreur absent du journal',()=>{
  const s=byKey('AHHH');s.journal.shift();
  const x=card(s);
  assert.equal(x.evidence.noFinalWrong,undefined);
  assert.match(x.title,/Difficulté persistante/);
});
test('P28 succès autonomes répétitifs : pas de baisse ni de faux signalement',()=>{
  const x=card(byKey('AAAA'));
  assert.equal(x.type,'repeated_autonomous');
  assert.equal(x.evidence.noFinalWrong,undefined);
});
test('P28 matrice 625 trajectoires : zéro fausse difficulté sans erreur finale',()=>{
  let n=0,previous=0;
  for(const a of variants)for(const b of variants)
    for(const c of variants)for(const d of variants){
      const s=fixture([a,b,c,d]),r=rec.buildReport(s,{maxRecommendations:10});
      const x=r.recommendations.find(item=>item.evidence?.key==='majeur:1♠');
      const counts=r.observations.parcours;
      if(counts.wrong===0)
        assert.ok(!x?.title.startsWith('Difficulté persistante'),a.key+b.key+c.key+d.key);
      if(x?.evidence?.noFinalWrong){
        assert.equal(counts.wrong,0);
        assert.ok(counts.autonomous>0);
        assert.equal(x.evidence.autonomousCount,counts.autonomous);
        assert.equal(x.evidence.helpedCount,counts.helped);
        assert.equal(x.evidence.skippedCount,counts.skipped);
      }
      if(counts.wrong===0&&counts.autonomous>0&&x?.type==='persistent_difficulty')
        previous++;
      n++;
    }
  assert.equal(n,625);
  process.stdout.write('M4-P28 '+JSON.stringify({sequences:n,neutralized:previous})+'\n');
});
