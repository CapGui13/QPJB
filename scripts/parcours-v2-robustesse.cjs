'use strict';
// Parcours V2-J : simulations multiples, sans données d'élèves et sans activation.
// Métriques de diversité/exposition uniquement ; pas d'estimation de maîtrise.
const assert=require('node:assert/strict');
const P=require('./parcours-v2-pilot.cjs');
const CATALOG=P.loadCatalog(),ANNOTATIONS=P.loadAnnotations();
const profiles=['balanced','fragile-mineures','facile'];
const seeds=[13,29,47];
const sessions=45;
function metric(profile,seed){
  const r=P.simulateV2(CATALOG,ANNOTATIONS,{profile,seed,sessions});
  const m=r.metrics,v=m.revision;
  assert.equal(m.questionCount,sessions*10);
  assert.equal(m.repeatedFamilySessions,0);
  assert.equal(m.sessionCount,sessions);
  assert.ok(m.uniqueFamilies>=sessions*7.5,'Réutilisation massive de familles : '+profile+'/'+seed);
  assert.ok(m.uniqueIds>=sessions*7.5);
  assert.equal(Object.keys(m.themes).length,P.ROADMAP?P.ROADMAP.length:22);
  assert.ok(v.scheduledDueRecalls>=10,'Rappels absents : '+profile+'/'+seed);
  assert.ok(v.successfulRecallOrigins>0,'Aucun rappel après réussite : '+profile+'/'+seed);
  assert.ok(v.failedRecallOrigins>=0);
  assert.equal(v.scheduledDueRecalls,v.scheduledSlotsUsed);
  for(const bid of P.STANDARD_OPENINGS)
    assert.ok((m.opening[bid]||0)>=2,'Ouverture trop rare '+bid);
  for(const bid of ['rep:1♣','rep:1♦','rep:1♥','rep:1♠','rep:1SA'])
    assert.ok((m.responses[bid]||0)>=5,'Réponse trop rare '+bid);
  const repeatedEvent=new Set();
  for(const e of r.state.reviewEvents){
    assert.ok(!e.concept.startsWith('rubrique:'),'Catégorie générale utilisée comme maîtrise');
    assert.ok(e.delay>=(e.previousResult==='wrong'?2:5),'Révision trop précoce');
    const key=e.session+'|'+e.concept;
    assert.ok(!repeatedEvent.has(key),'Bilan doublé pour même notion et séance');
    repeatedEvent.add(key);
  }
  return {profile,seed,sessions,questions:m.questionCount,
    differentExercises:m.uniqueIds,differentFamilies:m.uniqueFamilies,
    categoriesCovered:Object.keys(m.themes).length,
    duplicateFamilySessions:m.repeatedFamilySessions,
    sessionsWith4SameAnswer:m.sessionsWith4SameAnswer,
    scheduledReviews:v.scheduledDueRecalls,allDueReviews:v.actualDueRecalls,
    afterFailure:v.failedRecallOrigins,afterSuccess:v.successfulRecallOrigins,
    opening:m.opening,responses:m.responses};
}
const rows=[];
for(const profile of profiles)
  for(const seed of seeds)rows.push(metric(profile,seed));
const grouped=Object.fromEntries(profiles.map(profile=>{
  const subset=rows.filter(x=>x.profile===profile);
  const range=key=>({min:Math.min(...subset.map(x=>x[key])),
    max:Math.max(...subset.map(x=>x[key]))});
  return [profile,{differentFamilies:range('differentFamilies'),
    scheduledReviews:range('scheduledReviews'),
    afterFailure:range('afterFailure'),
    afterSuccess:range('afterSuccess')}];
}));
const report={schema:'QPJB_V2_J_ROBUSTESSE_20261118_1',
  status:'SIMULATION_NON_ACTIVE_SANS_DONNEES_ELEVES',
  policy:'Trois profils fictifs, trois graines fixes, aucune conclusion causale sur la mémorisation',
  catalogCount:CATALOG.length,annotations:ANNOTATIONS.size,
  scenarios:rows.length,sessionsPerScenario:sessions,rows,rangeByProfile:grouped};
assert.equal(rows.length,9);
const args=process.argv.slice(2);
console.log(args.includes('--detail')?JSON.stringify(report,null,2):
  JSON.stringify({schema:report.schema,scenarios:report.scenarios,
    sessionsPerScenario:sessions,rangeByProfile:grouped,rows:rows.map(x=>({
      profile:x.profile,seed:x.seed,differentFamilies:x.differentFamilies,
      scheduledReviews:x.scheduledReviews,afterFailure:x.afterFailure,
      afterSuccess:x.afterSuccess}))}));
