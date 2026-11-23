'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../quizz-parcours.js'),rec=require('../parcours-recommandations.js');
const exercise={id:'SEF-026-3',theme:'majeur',answer:'2♠',difficulty:1,
  caseFamily:'AIDE-VERIF',auction:['Partenaire : 1♠'],
  difficultyReason:'Soutien simple sur ouverture majeure'};
function sequence(answers){
  const s=core.empty();
  for(const a of answers){
    s.active={ids:[exercise.id],index:0,answers:{},createdAt:s.completed};
    assert.equal(core.record(s,exercise,a.result||'correct',0,null,!!a.assisted,!!a.hadFreeError),true);
    assert.equal(core.finish(s,[exercise]),true);
  }
  return s;
}
const build=s=>rec.buildReport(s,{maxRecommendations:10});
test('P21 réponses aidées : type historique préservé, diagnostic nuancé',()=>{
  const s=sequence(Array.from({length:3},()=>({assisted:true}))),before=JSON.stringify(s);
  const r=build(s);
  assert.equal(r.observations.parcours.helped,3);
  assert.equal(r.observations.parcours.wrong,0);
  assert.deepEqual(r.recommendations.map(x=>x.type),['persistent_difficulty']);
  const card=r.recommendations[0];
  assert.match(card.title,/Autonomie à consolider/);
  assert.equal(card.evidence.assistedOnly,true);
  assert.equal(card.evidence.sameAnswersAs[0].key,'fit');
  assert.match(card.explanation.caveat,/Aucune réussite autonome/);
  assert.match(card.explanation.action,/sans aide/);
  assert.equal(JSON.stringify(s),before);
});
test('P21 première erreur libre corrigée : même prudence',()=>{
  const r=build(sequence([{hadFreeError:true},{hadFreeError:true}]));
  assert.equal(r.observations.parcours.helped,2);
  assert.equal(r.observations.parcours.wrong,0);
  assert.equal(r.recommendations[0].evidence.assistedOnly,true);
  assert.match(r.recommendations[0].message,/première erreur libre/);
});
test('P21 aide et mauvaise réponse constatée : difficulté conservée',()=>{
  const r=build(sequence([{assisted:true},{result:'wrong'},{assisted:true}]));
  assert.equal(r.observations.parcours.wrong,1);
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.match(r.recommendations[0].title,/Difficulté persistante/);
  assert.equal(r.recommendations[0].evidence.assistedOnly,undefined);
});
test('P21 erreurs seules : ancien diagnostic intact',()=>{
  const r=build(sequence([{result:'wrong'},{result:'wrong'},{result:'wrong'}]));
  assert.equal(r.observations.parcours.wrong,3);
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.equal(r.recommendations[0].evidence.assistedOnly,undefined);
});
test('P21 sauvegarde ancienne sans journal : aucune origine aidée inventée',()=>{
  const s=core.empty();s.completed=65;
  s.micros['majeur:1♠']={score:-3,attempts:3,independent:0,lastSession:45,lastScoredSession:45};
  const r=build(s);
  assert.equal(r.recommendations[0].type,'persistent_difficulty');
  assert.equal(r.recommendations[0].evidence.assistedOnly,undefined);
});
test('P21 réponses uniquement sautées : conseil de réessai maintenu',()=>{
  const r=build(sequence([{result:'skipped'},{result:'skipped'}]));
  assert.equal(r.recommendations[0].type,'not_evaluated');
  assert.equal(r.recommendations[0].evidence.skippedOnly,true);
  assert.equal(r.recommendations[0].evidence.assistedOnly,undefined);
});
