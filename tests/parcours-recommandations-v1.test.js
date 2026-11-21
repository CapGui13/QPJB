'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const parcours=require('../quizz-parcours.js');
const reco=require('../parcours-recommandations.js');

const exercise=(id,answer='Passe')=>({id,theme:'ouv',answer,difficulty:1,
  caseFamily:id,auction:[],difficultyReason:''});
function answer(state,q,result='correct',{assisted=false,hadFreeError=false,mode='parcours'}={}){
  state.active={ids:[q.id],index:0,answers:{},createdAt:state.completed,
    ...(mode==='consolidation'?{mode}:{} )};
  assert.equal(parcours.record(state,q,result,0,null,assisted,hadFreeError),true);
  assert.equal(parcours.finish(state,[q]),true);
}
const kinds=report=>report.recommendations.map(r=>r.type);

// Ces profils fictifs sont construits via record/finish du véritable moteur V1.
test('sans évaluation : information neutre, aucun acquis inventé',()=>{
  const s=parcours.empty();
  const out=reco.buildReport(s);
  assert.equal(out.status,'ok');
  assert.deepEqual(kinds(out),['not_evaluated']);
  assert.equal(out.observations.detailedSessions,0);
  assert.equal(out.observations.parcours.autonomous,0);
});

test('outcome distingue quatre résultats dont première erreur libre',()=>{
  assert.equal(reco.outcome({result:'correct'}),'autonomous');
  assert.equal(reco.outcome({result:'correct',assisted:true}),'helped');
  assert.equal(reco.outcome({result:'correct',hadFreeError:true}),'helped');
  assert.equal(reco.outcome({result:'wrong'}),'wrong');
  assert.equal(reco.outcome({result:'skipped'}),'skipped');
  assert.equal(reco.outcome({result:'n/a'}),null);
});

test('profil aides : aucune réussite autonome revendiquée',()=>{
  const s=parcours.empty();
  answer(s,exercise('AIDE-1'),'correct',{assisted:true});
  answer(s,exercise('AIDE-2'),'correct',{hadFreeError:true});
  const out=reco.buildReport(s);
  assert.equal(out.observations.parcours.helped,2);
  assert.equal(out.observations.parcours.autonomous,0);
  assert.ok(kinds(out).includes('persistent_difficulty'));
  assert.ok(!kinds(out).includes('repeated_autonomous'));
});

test('profil échecs persistants : preuve par deux séances ordinaires',()=>{
  const s=parcours.empty();
  answer(s,exercise('ERR-1'),'wrong');
  answer(s,exercise('ERR-2'),'wrong');
  const out=reco.buildReport(s);
  const item=out.recommendations.find(r=>r.type==='persistent_difficulty');
  assert.ok(item);
  assert.equal(item.evidence.source,'micros');
  assert.equal(item.evidence.key,'ouv:passe');
  assert.equal(item.evidence.attempts,2);
  assert.equal(item.evidence.score,-2);
  assert.equal(out.observations.parcours.wrong,2);
});

test('profil réussites répétées : pas de promesse de maîtrise globale',()=>{
  const s=parcours.empty();
  for(let i=1;i<=3;i++)answer(s,exercise('AUT-'+i));
  const out=reco.buildReport(s);
  const item=out.recommendations.find(r=>r.type==='repeated_autonomous');
  assert.ok(item);
  assert.equal(item.evidence.independent,3);
  assert.equal(item.evidence.score,3);
  assert.match(item.message,/ne garantit pas la maîtrise/);
  assert.equal(out.observations.parcours.autonomous,3);
});

test('profil mixte : à consolider, sans assimiler une aide à une erreur',()=>{
  const s=parcours.empty();
  answer(s,exercise('MIX-1'),'correct');
  answer(s,exercise('MIX-2'),'correct',{assisted:true});
  answer(s,exercise('MIX-3'),'correct');
  const out=reco.buildReport(s);
  assert.ok(kinds(out).includes('consolidate'));
  assert.ok(!kinds(out).includes('persistent_difficulty'));
  assert.equal(out.observations.parcours.helped,1);
  assert.equal(out.observations.parcours.wrong,0);
});

test('profil révisions ciblées : la consolidation ne crédite pas la maîtrise',()=>{
  const s=parcours.empty();
  for(let i=1;i<=4;i++)answer(s,exercise('REV-'+i),'correct',{mode:'consolidation'});
  const out=reco.buildReport(s);
  assert.equal(s.completed,0);
  assert.equal(out.observations.consolidation.autonomous,4);
  assert.equal(out.observations.parcours.autonomous,0);
  assert.ok(!kinds(out).includes('repeated_autonomous'));
});

test('reprise : priorité à la séance en cours, sans lire les réponses comme une maîtrise',()=>{
  const s=parcours.empty();
  s.active={ids:['Q1','Q2'],index:1,answers:{0:{result:'correct',choice:null,
    assisted:false,hadFreeError:false}},createdAt:0};
  const out=reco.buildReport(s);
  assert.equal(out.currentSession.answered,1);
  assert.equal(out.currentSession.total,2);
  assert.equal(out.recommendations[0].type,'resume');
  assert.equal(out.revision,null);
});

test('legacy incomplet : pas de journal reconstruit ni de succès répété inféré',()=>{
  const s=parcours.empty();
  s.completed=9;
  s.entries.X={result:'correct',assisted:false,lastSession:8,due:12,seen:15,
    streak:4,family:'X'};
  const out=reco.buildReport(JSON.stringify(s));
  assert.equal(out.observations.sessionsWithoutDetail,9);
  assert.equal(out.observations.detailedSessions,0);
  assert.ok(!kinds(out).includes('repeated_autonomous'));
  assert.match(out.limitations.join(' '),/9 séance/);
});

test('classification hors taxonomie V1 ignorée',()=>{
  const s=parcours.empty();
  s.completed=3;
  s.micros['apres_fit:essai_invente']={score:-3,attempts:3,independent:0,lastSession:2};
  const out=reco.buildReport(s);
  assert.equal(out.observations.evaluatedMicros,0);
  assert.ok(!kinds(out).includes('persistent_difficulty'));
});

test('révision : ne promet la disponibilité que si le moteur la confirme',()=>{
  const s=parcours.empty();
  answer(s,exercise('P-1'),'wrong');
  answer(s,exercise('P-2'),'wrong');
  const pool=Array.from({length:6},(_,i)=>exercise('POOL-'+i));
  const available=reco.buildReport(s,{exercises:pool});
  assert.equal(available.revision.available,true);
  assert.ok(kinds(available).includes('revision_session'));
  const unavailable=reco.buildReport(s,{exercises:pool.slice(0,2)});
  assert.equal(unavailable.revision.available,false);
  assert.ok(!kinds(unavailable).includes('revision_session'));
});

test('journal dupliqué, options limitées et lecture seule du state',()=>{
  const s=parcours.empty();
  answer(s,exercise('DUP-1'),'wrong');
  answer(s,exercise('DUP-2'),'wrong');
  s.journal.push(structuredClone(s.journal[0]));
  const before=JSON.stringify(s);
  const out=reco.buildReport(s,{maxRecommendations:1});
  assert.equal(out.observations.parcours.wrong,2);
  assert.equal(out.recommendations.length,1);
  assert.equal(JSON.stringify(s),before);
});

test('invalide : état absent ou incompatible et aucune suggestion',()=>{
  const out=reco.buildReport('{mauvais json');
  assert.equal(out.status,'unavailable');
  assert.deepEqual(out.recommendations,[]);
  assert.equal(reco.buildReport({version:999}).status,'unavailable');
});
