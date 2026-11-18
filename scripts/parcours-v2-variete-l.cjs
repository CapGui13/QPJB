'use strict';
/* Simulation comparée V2-F / V2-L, hors production, réponses 100% fictives. */
const assert=require('node:assert/strict');
const P=require('./parcours-v2-pilot.cjs');
const M=require('./parcours-v2-mix-l.cjs');
const exercises=P.loadCatalog(),annotations=P.loadAnnotations();
const profiles=['balanced','fragile-mineures','facile'];
const seeds=[13,29,47],sessionCount=45;
const rows=[];
for(const profile of profiles)for(const seed of seeds){
  const opts={profile,seed,sessions:sessionCount};
  const standard=P.simulateV2(exercises,annotations,opts);
  const blended=M.simulateBlend(exercises,annotations,opts);
  const a=M.windowMetrics(standard.sessions),b=M.windowMetrics(blended.sessions);
  const injections=blended.blend.injections;
  assert.equal(standard.metrics.questionCount,450);
  assert.equal(blended.metrics.questionCount,450);
  assert.equal(blended.metrics.repeatedFamilySessions,0);
  assert.equal(blended.sessions.length,45);
  assert.deepEqual(blended.sessions[0].map(x=>x.id),
    standard.sessions[0].map(x=>x.id),'Ne pas remplacer la séance initiale');
  const row={
    profile,seed,
    unmodifiedV2:{
      uniqueFamilies:standard.metrics.uniqueFamilies,
      averageThemesPerSession:a.averageThemesPerSession,
      sessionsWith4SameAnswer:a.sessionsWith4SameAnswer,
      sessionsWith5SameAnswer:a.sessionsWith5SameAnswer,
      targetedReviews:standard.metrics.revision.scheduledDueRecalls,
      themesTotal:Object.keys(standard.metrics.themes).length
    },
    experimentV2L:{
      uniqueFamilies:blended.metrics.uniqueFamilies,
      averageThemesPerSession:b.averageThemesPerSession,
      sessionsWith4SameAnswer:b.sessionsWith4SameAnswer,
      sessionsWith5SameAnswer:b.sessionsWith5SameAnswer,
      targetedReviews:blended.state.reviewEvents.filter(x=>x.source==='scheduled').length,
      themesTotal:Object.keys(blended.metrics.themes).length,
      foundationInjections:injections.length,
      distinctInjectedFoundations:new Set(injections.map(x=>x.foundation)).size,
      distinctInjectedQcm:new Set(injections.map(x=>x.id)).size
    }
  };
  rows.push(row);
}
const range=(key,which)=>[
  Math.min(...rows.map(r=>r[which][key])),
  Math.max(...rows.map(r=>r[which][key]))
];
const totalInjections=rows.reduce((n,r)=>n+r.experimentV2L.foundationInjections,0);
const report={
  schema:'QPJB_V2_L_VARIETE_SIMULEE_20261118_1',
  status:'SIMULATION_SYNTHETIQUE_NON_ELEVE_NON_DEPLOYEE',
  catalogSize:exercises.length,
  foundationIdsCumulative:110,
  scenarios:rows.length,
  sessionsPerScenario:sessionCount,
  comparisons:{
    baselineUniqueFamilies:range('uniqueFamilies','unmodifiedV2'),
    blendedUniqueFamilies:range('uniqueFamilies','experimentV2L'),
    baselineAverageThemesPerSession:range('averageThemesPerSession','unmodifiedV2'),
    blendedAverageThemesPerSession:range('averageThemesPerSession','experimentV2L'),
    baselineFourSameAnswerSessions:range('sessionsWith4SameAnswer','unmodifiedV2'),
    blendedFourSameAnswerSessions:range('sessionsWith4SameAnswer','experimentV2L'),
    baselineTargetedReviews:range('targetedReviews','unmodifiedV2'),
    blendedTargetedReviews:range('targetedReviews','experimentV2L'),
    blendedInjections:range('foundationInjections','experimentV2L')
  },
  totalInjections,
  warning:'L ajout de cas candidats montre un mélange exploratoire mais ne prouve ni meilleure pédagogie ni mémorisation réelle.',
  rows
};
assert.equal(report.scenarios,9);
const detail=process.argv.includes('--detail');
console.log(JSON.stringify(detail?report:{
  schema:report.schema,scenarios:9,sessionsPerScenario:45,
  comparisons:report.comparisons,totalInjections,
  rows:rows.map(x=>({profile:x.profile,seed:x.seed,
    base:x.unmodifiedV2,experimental:x.experimentV2L}))
},null,2));
