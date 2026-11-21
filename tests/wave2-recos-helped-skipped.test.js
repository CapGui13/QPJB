'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const q={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'M23',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function state(actions){
  const s=core.empty();
  for(const a of actions){
    s.active={ids:[q.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,q,a.result||'correct',0,null,!!a.assisted,!!a.hadFreeError),true);
    assert.equal(core.finish(s,[q]),true);
  }
  return s;
}
test('P23 aide et saut : autonomie à consolider, aucune erreur finale inventée',()=>{
  const s=state([{assisted:true},{result:'skipped'}]),before=JSON.stringify(s);
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.deepEqual(r.observations.parcours,{autonomous:0,helped:1,wrong:0,skipped:1});
  const card=r.recommendations[0];
  assert.equal(card.type,'persistent_difficulty');
  assert.match(card.title,/Autonomie à consolider/);
  assert.equal(card.evidence.helpedAndSkipped,true);
  assert.equal(card.evidence.helpedCount,1);
  assert.equal(card.evidence.skippedCount,1);
  assert.match(card.explanation.caveat,/aucune réponse finale fausse/);
  assert.equal(JSON.stringify(s),before);
});
test('P23 première erreur libre suivie d’un saut : pas de faux échec final',()=>{
  const r=rec.buildReport(state([{hadFreeError:true},{result:'skipped'}]),{maxRecommendations:10});
  const card=r.recommendations[0];
  assert.equal(card.evidence.helpedAndSkipped,true);
  assert.equal(card.evidence.assistedOnly,undefined);
  assert.match(card.explanation.action,/sans aide/);
});
test('P23 toutes réponses aidées : indication assistedOnly reste distincte',()=>{
  const r=rec.buildReport(state([{assisted:true},{hadFreeError:true}]),{maxRecommendations:10});
  assert.equal(r.recommendations[0].evidence.assistedOnly,true);
  assert.equal(r.recommendations[0].evidence.helpedAndSkipped,undefined);
});
test('P23 aide plus mauvaise réponse : diagnostic de difficulté inchangé',()=>{
  const r=rec.buildReport(state([{assisted:true},{result:'wrong'}]),{maxRecommendations:10});
  assert.equal(r.observations.parcours.wrong,1);
  assert.match(r.recommendations[0].title,/Difficulté persistante/);
  assert.equal(r.recommendations[0].evidence.helpedAndSkipped,undefined);
});
test('P23 seulement des sauts : carte neutre, non aidée',()=>{
  const r=rec.buildReport(state([{result:'skipped'},{result:'skipped'}]),{maxRecommendations:10});
  assert.equal(r.recommendations[0].type,'not_evaluated');
  assert.equal(r.recommendations[0].evidence.skippedOnly,true);
});
test('P23 journal partiel : ne pas supposer que les réponses absentes étaient aidées',()=>{
  const s=state([{assisted:true},{result:'skipped'}]);
  s.journal.shift();
  const r=rec.buildReport(s,{maxRecommendations:10});
  assert.equal(r.recommendations[0].evidence.helpedAndSkipped,undefined);
  assert.equal(r.observations.sessionsWithoutDetail,1);
});
