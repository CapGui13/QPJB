'use strict';
/*
 * Phase S, banc d'essai hors production : chaque QCM provient du catalogue.
 * Contraste exact entre V2-F inchangé et V2-S (quatre slots compétitifs).
 * Aucune donnée d'élève; ne déclenche jamais une publication.
 */
const F=require('./parcours-v2-pilot.cjs');
const S=require('./parcours-v2-pilot-s.cjs');
function competitor(q){return ['intervenir','contre','apres_inter','reponse_inter'].includes(q.theme)}
function ourIntervention(q){
  return q.theme==='intervenir'&&(q.auction||[]).some(x=>/^Adversaire : 1[♣♦♥♠]/.test(x));
}
function replyAfterAdversaryDouble(q){
  return q.theme==='apres_inter'&&
    (q.auction||[]).some(x=>/^Partenaire : 1[♣♦♥♠]/.test(x))&&
    (q.auction||[]).some(x=>/^Adversaire : Contre/.test(x));
}
function signal(run){
  const all=run.sessions.flat();
  function encounter(predicate){
    const sessions=run.sessions.map((d,i)=>({session:i+1,n:d.filter(predicate).length}))
      .filter(x=>x.n>0);
    return {firstSession:sessions[0]?.session??null,
      total:all.filter(predicate).length,
      first25:run.sessions.slice(0,25).flat().filter(predicate).length,
      sessionsFirst25:sessions.filter(x=>x.session<=25).length};
  }
  const total25=run.sessions.slice(0,25).flat();
  return {differentFamilies:run.metrics.uniqueFamilies,
    differentThemes:Object.keys(run.metrics.themes).length,
    repeatedFamiliesInsideSessions:run.metrics.repeatedFamilySessions,
    fourSameAnswerSessions:run.metrics.sessionsWith4SameAnswer,
    scheduledRecalls:run.metrics.revision.scheduledDueRecalls,
    dueRecalls:run.metrics.revision.actualDueRecalls,
    ourIntervention:encounter(ourIntervention),
    afterAdversaryDouble:encounter(replyAfterAdversaryDouble),
    broaderCompetition:encounter(competitor),
    first25MinorOpens:Object.fromEntries(['1♣','1♦'].map(x=>[x,
      total25.filter(q=>F.roleOpening(q)==='ouv:'+x).length])),
    first25MinorReplies:Object.fromEntries(['1♣','1♦'].map(x=>[x,
      total25.filter(q=>F.roleOpening(q)==='rep:'+x).length]))};
}
function inspect(exercises,annotations,options={}){
  const input={sessions:45,...options};
  const base=F.simulateV2(exercises,annotations,input);
  const pilot=S.simulateV2(exercises,annotations,input);
  const before=base.sessions.slice(0,12).map(d=>d.map(q=>q.id));
  const beforeS=pilot.sessions.slice(0,12).map(d=>d.map(q=>q.id));
  if(JSON.stringify(before)!==JSON.stringify(beforeS))
    throw Error('La variante S doit préserver exactement les 12 premières séances');
  const targeted=[
    {s:13,kind:'notre_intervention',check:ourIntervention},
    {s:17,kind:'reponse_apres_contre',check:replyAfterAdversaryDouble},
    {s:21,kind:'notre_intervention',check:ourIntervention},
    {s:25,kind:'reponse_apres_contre',check:replyAfterAdversaryDouble}
  ].filter(x=>x.s<=input.sessions).map(x=>({
    session:x.s,role:x.kind,
    present:pilot.sessions[x.s-1].filter(x.check).length,
    baseline:base.sessions[x.s-1].filter(x.check).length
  }));
  const a=signal(base),b=signal(pilot);
  const regressions=[];
  if(b.differentFamilies<a.differentFamilies)regressions.push('FAMILLES_PERDUES');
  if(b.differentThemes<a.differentThemes)regressions.push('THEMES_PERDUS');
  if(b.scheduledRecalls<a.scheduledRecalls)regressions.push('RAPPELS_CIBLES_PERDUS');
  if(b.fourSameAnswerSessions>a.fourSameAnswerSessions)regressions.push('QUATRE_REPONSES_IDENTIQUES');
  if(b.repeatedFamiliesInsideSessions>0)regressions.push('DOUBLONS_EN_SEANCE');
  for(const key of ['first25MinorOpens','first25MinorReplies'])
    for(const suit of ['1♣','1♦'])
      if(b[key][suit]<a[key][suit])regressions.push('MINEURE_REDUITE_'+key+'_'+suit);
  return {input,baseline:a,experiment:b,targetedSlots:targeted,regressions,
    baselineSessions:base.sessions,experimentalSessions:pilot.sessions,
    referenceCodeUnchanged:true,publicDeployment:false};
}
function batch(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const r=inspect(catalog,annotations,{profile,seed,sessions:45});
      rows.push({profile,seed,baseline:r.baseline,experiment:r.experiment,
        targetSlots:r.targetedSlots,regressions:r.regressions,
        deltaFamilies:r.experiment.differentFamilies-r.baseline.differentFamilies,
        deltaReviews:r.experiment.scheduledRecalls-r.baseline.scheduledRecalls,
        deltaEarlyCompetition:r.experiment.broaderCompetition.first25-
          r.baseline.broaderCompetition.first25,
        deltaCounter:r.experiment.afterAdversaryDouble.first25-
          r.baseline.afterAdversaryDouble.first25});
    }
  const range=key=>[Math.min(...rows.map(key)),Math.max(...rows.map(key))];
  const meaningful=rows.filter(r=>r.deltaEarlyCompetition>0).length;
  const safe=rows.filter(r=>r.regressions.length===0).length;
  return {schema:'QPJB_V2_S_COMPARISON_20261118_1',
    status:'EXPERIMENTAL_COMPARISON_NOT_FOR_PUBLICATION',
    catalogueQuestions:catalog.length,profiles:3,seeds:3,scenarios:9,
    sessionsPerScenario:45,questionsPerScenario:450,
    targetSlots:[13,17,21,25],
    results:{
      deltaUniqueFamilies:range(x=>x.deltaFamilies),
      deltaTargetedReviews:range(x=>x.deltaReviews),
      deltaCompetitiveBefore26:range(x=>x.deltaEarlyCompetition),
      deltaCounterBefore26:range(x=>x.deltaCounter),
      scenariosWithImprovedCompetition:meaningful,
      scenariosWithNoRegression:safe,
      scenariosFailingConservativeCriteria:9-safe,
      overallDecision:safe===9&&meaningful>=7?
        'TECHNICALLY_ELIGIBLE_FOR_EDITORIAL_REVIEW_NOT_PUBLICATION':
        'NOT_RETAINED_UNDER_CONSERVATIVE_CRITERIA'
    },
    rows,referenceCodeUnchanged:true,publicDeployment:false,
    warning:'Aucune performance élève mesurée ; S ne remplace pas V2-F.'};
}
module.exports={competitor,ourIntervention,replyAfterAdversaryDouble,signal,inspect,batch};
if(require.main===module)console.log(JSON.stringify(batch(),null,2));
