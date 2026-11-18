'use strict';
/* Phase M — audit comparatif à froid, sans données d'élèves. */
const P=require('./parcours-v2-pilot.cjs');
const M=require('./parcours-v2-mix-m.cjs');
const exercises=P.loadCatalog(),annotations=P.loadAnnotations();
const profiles=['balanced','fragile-mineures','facile'];
const seeds=[13,29,47];
const rows=[];
for(const profile of profiles)for(const seed of seeds){
  const {baseline,experimental,injections}=M.summarize(exercises,annotations,
    {sessions:45,profile,seed});
  rows.push({profile,seed,baseline,experimental,
    injections:injections.length,
    repairedRepetitions:injections.filter(x=>x.replacedFamilyPreviouslySeen).length,
    deltaFamilies:experimental.uniqueFamilies-baseline.uniqueFamilies,
    deltaThemesPerSession:Number((experimental.averageThemesPerSession-baseline.averageThemesPerSession).toFixed(2)),
    deltaTargetedReviews:experimental.targetedReviews-baseline.targetedReviews
  });
}
const range=(what)=>[Math.min(...rows.map(what)),Math.max(...rows.map(what))];
const summary={
  schema:'QPJB_V2_PHASE_M_SHADOW_COMPARISON_20261118_1',
  status:'SYNTHETIQUE_NON_ACTIVE',
  scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
  reference:'V2-F (moteur non modifié)',
  variant:'V2-M (correction opportuniste, pas d injection systématique)',
  baselineFamilies:range(x=>x.baseline.uniqueFamilies),
  experimentalFamilies:range(x=>x.experimental.uniqueFamilies),
  deltaFamilies:range(x=>x.deltaFamilies),
  deltaAverageThemesPerSession:range(x=>x.deltaThemesPerSession),
  baselineRecall:range(x=>x.baseline.targetedReviews),
  experimentalRecall:range(x=>x.experimental.targetedReviews),
  deltaRecall:range(x=>x.deltaTargetedReviews),
  injections:range(x=>x.injections),
  repairedRepetitions:range(x=>x.repairedRepetitions),
  baseline4SameAnswer:range(x=>x.baseline.fourSameAnswerSessions),
  experimental4SameAnswer:range(x=>x.experimental.fourSameAnswerSessions),
  rows
};
console.log(JSON.stringify(summary,null,2));
