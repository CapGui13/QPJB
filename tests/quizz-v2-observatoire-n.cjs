'use strict';
/* Phase N: l'observatoire est en lecture seule, sans notion de maîtrise. */
const assert=require('node:assert/strict');
const P=require('../scripts/parcours-v2-pilot.cjs');
const O=require('../scripts/parcours-v2-observatoire-n.cjs');
const catalog=P.loadCatalog(),annotations=P.loadAnnotations(),index=O.loadIndex(catalog);
assert.equal(catalog.length,1523);
assert.equal(index.metadata.length,15);
assert.equal(index.sourceIndex.size,110);
assert.ok(index.metadata.some(f=>f.status==='INDIRECTE'));
assert.ok(index.metadata.some(f=>f.status==='CONVENTION_A_ARBITRER'));
assert.equal(index.metadata.filter(f=>f.status==='INSUFFISANTE').length,2);
assert.equal([...index.sourceIndex.values()].reduce((n,v)=>n+v.length,0),122);
for(const profile of ['balanced','fragile-mineures']){
  const options={sessions:20,seed:13,profile};
  const pilot=P.simulateV2(catalog,annotations,options);
  const snapshot=pilot.sessions.map(deck=>deck.map(q=>[q.id,q.answer,P.family(q)]));
  const stateBefore=JSON.stringify(pilot.state.reviewEvents);
  const report=O.analyzeSessions(pilot.sessions,index,pilot.state);
  const twice=O.analyzeSessions(pilot.sessions,index,pilot.state);
  assert.deepEqual(report,twice,'Audit deterministe');
  assert.deepEqual(pilot.sessions.map(deck=>deck.map(q=>[q.id,q.answer,P.family(q)])),snapshot,
    'Les séances ne doivent pas être modifiées par l audit');
  assert.equal(JSON.stringify(pilot.state.reviewEvents),stateBefore,
    'Les rappels ne doivent pas être modifiés par l audit');
  assert.equal(report.sessionCount,20);
  assert.equal(report.questions,200);
  assert.equal(report.bySession.length,20);
  assert.equal(report.windows.length,4);
  assert.ok(report.windows.every(w=>w.differentFamilies>=1&&w.differentFamilies<=50));
  assert.equal(report.byFoundation.length,15);
  assert.equal(report.masteryDeclared,false);
  assert.equal(report.unlocksEnabled,false);
  assert.equal(report.scheduledRecalls,pilot.metrics.revision.scheduledDueRecalls);
  const count=pilot.sessions.flat().filter(q=>index.sourceIndex.has(q.id)).length;
  assert.equal(report.mappedPresentations,count);
  assert.equal(report.bySession.reduce((n,x)=>n+x.sourceQcmPresentations,0),count);
  for(const f of report.byFoundation){
    assert.ok(f.encounteredFamilies<=f.sourceFamilyCount);
    assert.ok(f.encounteredIds<=f.sourceQcmCount);
    assert.ok(f.encounteredFamilies<=f.encounteredIds);
    assert.ok(f.presentations>=f.encounteredIds);
    assert.ok(!('mastered' in f)&&!('mastery' in f)&&!('graded' in f),
      'Ne jamais certifier une notion observée');
    assert.ok(f.firstEncounterSession===null||f.firstEncounterSession>=1);
    assert.ok(f.lastEncounterSession===null||f.lastEncounterSession<=20);
  }
  assert.equal(new Set(report.bySession.map(s=>s.session)).size,20);
}
assert.throws(()=>O.analyzeSessions([],index,{reviewEvents:[]}));
assert.throws(()=>O.loadIndex(catalog,{...require('../scripts/parcours-v2-fondations.cjs').load(),unlockEngineEnabled:true}));
console.log('QPJB V2 N PASS : 15 fondations, 110 QCM, 122 associations, observation sans mutation ni maîtrise');
