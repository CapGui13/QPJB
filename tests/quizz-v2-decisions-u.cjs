'use strict';
/* Phase U : integrite et lecture seule de l'observatoire des decisions. */
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const U=require('../scripts/parcours-v2-decisions-u.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
const opening={id:'TEST-O',theme:'ouv',answer:'1♣',auction:[],caseFamily:'T1'};
const reply={id:'TEST-R',theme:'mineur',answer:'1♥',
  auction:['Partenaire : 1♣'],caseFamily:'T2'};
const intervention={id:'TEST-I',theme:'intervenir',answer:'Contre',
  auction:['Adversaire : 1♥'],caseFamily:'T3'};
const ourCounter={id:'TEST-C',theme:'contre',answer:'1♠',
  auction:['Partenaire : Contre'],caseFamily:'T4'};
const enemyCounter={id:'TEST-A',theme:'apres_inter',answer:'2♥',
  auction:['Partenaire : 1♥','Adversaire : Contre'],caseFamily:'T5'};
assert.equal(U.context(opening),'choix_ouverture');
assert.equal(U.context(reply),'reponse_sur_1♣');
assert.deepEqual(U.describe(reply).auction,['Partenaire : 1♣']);
assert.equal(U.describe(reply).auctionSignature,'["Partenaire : 1♣"]');
assert.equal(U.actionClass(reply),'majeure');
assert.equal(U.actionClass(opening),'mineure');
assert.equal(U.context(intervention),'notre_intervention');
assert.equal(U.context(ourCounter),'reponse_au_contre_partenaire');
assert.equal(U.context(enemyCounter),'reponse_apres_contre_adverse');
for(const profile of ['balanced','fragile-mineures']){
  const sim=F.simulateV2(catalog,annotations,{sessions:15,seed:13,profile});
  const ids=sim.sessions.map(deck=>deck.map(q=>q.id));
  const reviewEvents=JSON.stringify(sim.state.reviewEvents);
  const stateBefore=JSON.stringify(sim.state);
  const a=U.trace(sim.sessions,catalog);
  assert.deepEqual(U.trace(sim.sessions,catalog),a);
  assert.equal(a.status,'OBSERVATION_SYNTHETIQUE_LECTURE_SEULE');
  assert.equal(a.sessions,15);
  assert.equal(a.questions,150);
  assert.equal(a.catalogQuestions,1523);
  assert.equal(a.windows.length,2);
  assert.deepEqual(a.windows.map(w=>[w.from,w.to]),[[1,5],[6,15]]);
  assert.equal(a.windows.reduce((n,w)=>n+w.presentations,0),150);
  assert.equal(Object.values(a.contexts).reduce((n,x)=>n+x,0),150);
  assert.equal(Object.values(a.actionClasses).reduce((n,x)=>n+x,0),150);
  assert.ok(a.distinctDecisionKeys>0);
  assert.ok(a.alerts.sameContextAnswerAdditionalPresentations>=0);
  assert.ok(a.alerts.sameAuctionAnswerAdditionalPresentations>=0);
  assert.ok(a.alerts.sameAuctionAnswerAdditionalPresentations<=
    a.alerts.sameContextAnswerAdditionalPresentations);
  assert.ok(a.alerts.contextAnswerGroupsWithDifferentAuctions>=0);
  assert.ok(a.sourceExamplesForPedagogicalReview.length<=20);
  for(const item of a.sourceExamplesForPedagogicalReview){
    assert.ok(item.independentFamilies>=2);
    assert.ok(item.distinctAuctionSequences>=1);
    assert.equal(item.examples.length,item.independentFamilies);
    assert.ok(item.examples.every(x=>Array.isArray(x.auction)&&x.id&&x.family));
  }
  assert.ok(a.perSession.every(x=>x.distinctDecisions<=10&&x.contexts<=10));
  assert.equal(a.selectionChanged,false);
  assert.equal(a.masteryInferred,false);
  assert.equal(a.publicRuntimeWired,false);
  assert.equal(a.repeatedContextAnswerIsNotProofOfRedundancy,true);
  assert.deepEqual(sim.sessions.map(deck=>deck.map(q=>q.id)),ids);
  assert.equal(JSON.stringify(sim.state.reviewEvents),reviewEvents);
  assert.equal(JSON.stringify(sim.state),stateBefore);
  const fake=sim.sessions.map(deck=>deck.slice());
  fake[0][0]={...fake[0][0]};
  assert.throws(()=>U.trace(fake,catalog),/recopie modifiée/);
  const duplicated=sim.sessions.map(deck=>deck.slice());
  duplicated[0][1]=duplicated[0][0];
  assert.throws(()=>U.trace(duplicated,catalog),/identiques/);
}
assert.throws(()=>U.trace([],catalog),/incomplètes/);
console.log('QPJB V2 U PASS : catalogue original, decisions par contexte, minor replies, 0 mutation, 0 verrous');
