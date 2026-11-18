'use strict';
/* QPJB phase U : observatoire des decisions effectivement presentees par V2-F.
 * Un libelle identique ne prouve ni redondance pedagogique ni competence acquise.
 * Aucun appel a select(), aucun changement des questions ou de leurs reponses.
 */
const F=require('./parcours-v2-pilot.cjs');
const T=require('./parcours-v2-audit-competition-t.cjs');
const WINDOWS=[[1,5],[6,15],[16,30],[31,45]];
const MINORS=['rep:1♣','rep:1♦'];
const PROFILES=['balanced','fragile-mineures','facile'];
const SEEDS=[13,29,47];
function answer(q){return String(q.answer==null?'(sans réponse)':q.answer).trim()}
function actionClass(q){
  const a=answer(q);
  if(a==='Passe')return 'passe';
  if(a==='Contre')return 'contre';
  if(a==='Surcontre')return 'surcontre';
  const m=a.match(/^([1-7])(SA|[♣♦♥♠])$/);
  if(!m)return 'autre_ou_non_normalise';
  if(m[2]==='SA')return 'sans_atout';
  return '♣♦'.includes(m[2])?'mineure':'majeure';
}
function context(q){
  if(q.theme==='ouv')return 'choix_ouverture';
  if(T.isReplyToCounter(q))return 'reponse_apres_contre_adverse';
  if(T.isOurIntervention(q))return 'notre_intervention';
  if(q.theme==='contre'&&(q.auction||[]).some(x=>/^Partenaire : Contre/.test(x)))
    return 'reponse_au_contre_partenaire';
  const r=F.roleOpening(q);
  if(r.startsWith('rep:'))return 'reponse_sur_'+r.slice(4);
  // Le libelle de rubrique d'origine est conserve si le role precis est inconnu.
  return 'rubrique_'+q.theme;
}
function describe(q){
  const ctx=context(q),a=answer(q);
  const auction=Array.isArray(q.auction)?q.auction.map(String):[];
  return {id:q.id,family:F.family(q),theme:q.theme,context:ctx,
    answer:a,actionClass:actionClass(q),decisionKey:JSON.stringify([ctx,a]),
    auction,auctionSignature:JSON.stringify(auction)};
}
function add(obj,key,n=1){obj[key]=(obj[key]||0)+n}
function ordered(obj){return Object.fromEntries(Object.entries(obj).sort((a,b)=>a[0].localeCompare(b[0],'fr')))}
function summarise(rows){
  const contexts={},actions={},byContext={},minorAnswers={};
  const families=new Set(),decisionKeys=new Set();
  for(const r of rows){
    add(contexts,r.context);add(actions,r.actionClass);
    if(!byContext[r.context])byContext[r.context]={};
    add(byContext[r.context],r.actionClass);
    if(MINORS.includes(r.context.replace('reponse_sur_','rep:'))){
      if(!minorAnswers[r.context])minorAnswers[r.context]={};
      add(minorAnswers[r.context],r.answer);
    }
    families.add(r.family);decisionKeys.add(r.decisionKey);
  }
  return {presentations:rows.length,independentFamilies:families.size,
    distinctDecisionKeys:decisionKeys.size,contexts:ordered(contexts),
    actionClasses:ordered(actions),
    actionsByContext:Object.fromEntries(Object.entries(byContext).sort()
      .map(([k,v])=>[k,ordered(v)])),
    minorResponseAnswers:Object.fromEntries(Object.entries(minorAnswers).sort()
      .map(([k,v])=>[k,ordered(v)]))};
}
function trace(sessions,catalog){
  if(!Array.isArray(sessions)||!sessions.length||
    sessions.some(x=>!Array.isArray(x)||x.length!==10))
    throw Error('Phase U : séances incomplètes');
  const source=new Map(catalog.map(q=>[q.id,q]));
  if(source.size!==catalog.length)throw Error('IDs catalogue non uniques');
  const seen=new Set(),perSession=[],all=[];
  let withinSessionRepeatedContextAnswer=0,adjacentContextAnswerOverlaps=0;
  let sameAuctionAnswerAdditional=0,contextAnswerWithDistinctAuctions=0;
  let answerOnlyRepeatAcrossContexts=0,previousKeys=new Set();
  for(let s=0;s<sessions.length;s++){
    const deck=sessions[s],qrows=deck.map(q=>{
      if(source.get(q.id)!==q)throw Error('QCM absent ou recopie modifiée : '+q.id);
      return describe(q);
    });
    if(new Set(qrows.map(x=>x.id)).size!==10||
      new Set(qrows.map(x=>x.family)).size!==10)
      throw Error('Deux IDs ou familles identiques dans une séance');
    const group=new Map(),answerGroups=new Map();
    for(const r of qrows){
      if(!group.has(r.decisionKey))group.set(r.decisionKey,[]);
      group.get(r.decisionKey).push(r);
      if(!answerGroups.has(r.answer))answerGroups.set(r.answer,new Set());
      answerGroups.get(r.answer).add(r.context);
      seen.add(r.id);all.push(r);
    }
    const repeats=[...group.entries()].filter(([,v])=>v.length>1);
    const sameContextAnswer=repeats.reduce((n,[,v])=>n+v.length-1,0);
    const exactGroups=new Map();
    for(const r of qrows){
      const key=JSON.stringify([r.decisionKey,r.auctionSignature]);
      exactGroups.set(key,(exactGroups.get(key)||0)+1);
    }
    const sameExactAuction=[...exactGroups.values()].reduce((n,v)=>n+Math.max(0,v-1),0);
    const differentAuctions=repeats.filter(([,v])=>
      new Set(v.map(x=>x.auctionSignature)).size>1).length;
    const overlap=[...group.keys()].filter(k=>previousKeys.has(k)).length;
    const acrossContexts=[...answerGroups.values()].filter(v=>v.size>1).length;
    withinSessionRepeatedContextAnswer+=sameContextAnswer;
    sameAuctionAnswerAdditional+=sameExactAuction;
    contextAnswerWithDistinctAuctions+=differentAuctions;
    adjacentContextAnswerOverlaps+=overlap;
    answerOnlyRepeatAcrossContexts+=acrossContexts;
    perSession.push({session:s+1,contexts:new Set(qrows.map(x=>x.context)).size,
      distinctDecisions:group.size,distinctAnswers:answerGroups.size,
      sameContextAnswerAdditionalPresentations:sameContextAnswer,
      sameAuctionAnswerAdditionalPresentations:sameExactAuction,
      repeatedContextAnswerGroupsWithDifferentAuctions:differentAuctions,
      repeatedContextsAndAnswers:repeats.map(([,v])=>({
        context:v[0].context,answer:v[0].answer,
        independentFamilies:v.length,distinctAuctionSequences:
          new Set(v.map(x=>x.auctionSignature)).size,
        examples:v.map(x=>({id:x.id,family:x.family,auction:x.auction}))})),
      previousSessionDecisionOverlaps:overlap,
      sameAnswerInMultipleContexts:acrossContexts});
    previousKeys=new Set(group.keys());
  }
  const windows=WINDOWS.filter(([first])=>first<=sessions.length)
    .map(([first,last])=>{
      const to=Math.min(last,sessions.length);
      const rows=sessions.slice(first-1,to).flat().map(describe);
      const sessionsIn=perSession.slice(first-1,to);
      return {from:first,to,
        ...summarise(rows),
        repeatedContextAnswerExtra: sessionsIn.reduce((n,x)=>
          n+x.sameContextAnswerAdditionalPresentations,0),
        sameAuctionAnswerExtra: sessionsIn.reduce((n,x)=>
          n+x.sameAuctionAnswerAdditionalPresentations,0)};
    });
  return {schema:'QPJB_V2_U_DECISIONS_1',status:'OBSERVATION_SYNTHETIQUE_LECTURE_SEULE',
    sessions:sessions.length,questions:all.length,catalogQuestions:catalog.length,
    originalIdsSeen:seen.size,originalFamiliesSeen:new Set(all.map(x=>x.family)).size,
    ...summarise(all),windows,perSession,
    alerts:{sameContextAnswerAdditionalPresentations:withinSessionRepeatedContextAnswer,
      sameAuctionAnswerAdditionalPresentations:sameAuctionAnswerAdditional,
      contextAnswerGroupsWithDifferentAuctions:contextAnswerWithDistinctAuctions,
      adjacentSessionDecisionOverlaps:adjacentContextAnswerOverlaps,
      sameAnswerInMultipleContexts:answerOnlyRepeatAcrossContexts},
    sourceExamplesForPedagogicalReview:perSession.flatMap(row=>
      row.repeatedContextsAndAnswers.map(item=>({session:row.session,...item})))
      .sort((a,b)=>b.independentFamilies-a.independentFamilies||a.session-b.session)
      .slice(0,20),
    sameAnswerIsNotNecessarilySamePedagogicalDecision:true,
    repeatedContextAnswerIsNotProofOfRedundancy:true,
    masteryInferred:false,selectionChanged:false,publicRuntimeWired:false};
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523)throw Error('Catalogue attendu : 1523 QCM');
  const scenarios=[];
  for(const profile of PROFILES)for(const seed of SEEDS){
    const result=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
    const a=trace(result.sessions,catalog);
    scenarios.push({profile,seed,
      originalFamilies:result.metrics.uniqueFamilies,
      targetedReviews:result.metrics.revision.scheduledDueRecalls,
      contextsSeen:Object.keys(a.contexts).length,
      distinctDecisions:a.distinctDecisionKeys,
      alertCounts:a.alerts,
      windows:a.windows.map(w=>({from:w.from,to:w.to,
        minorResponseAnswers:w.minorResponseAnswers,
        contexts:w.contexts,actionClasses:w.actionClasses,
        distinctDecisions:w.distinctDecisionKeys,
        repeatedContextAnswerExtra:w.repeatedContextAnswerExtra}))});
  }
  const range=fn=>[Math.min(...scenarios.map(fn)),Math.max(...scenarios.map(fn))];
  const minorPresence=Object.fromEntries(['reponse_sur_1♣','reponse_sur_1♦']
    .map(k=>[k,{
      scenariosWithFirstFivePresence:scenarios.filter(x=>x.windows[0].contexts[k]>0).length,
      distinctAnswersAcrossNine:new Set(scenarios.flatMap(x=>
        Object.keys(x.windows[0].minorResponseAnswers[k]||{}))).size,
      firstFiveCountRange:range(x=>x.windows[0].contexts[k]||0)
    }]));
  return {schema:'QPJB_V2_U_9_SCENARIOS_1',
    scenarios:9,sessionsPerScenario:45,questionsPerScenario:450,
    catalogQuestions:catalog.length,reference:'V2-F sans modification',
    originalFamiliesRange:range(x=>x.originalFamilies),
    targetedReviewsRange:range(x=>x.targetedReviews),
    distinctDecisionsRange:range(x=>x.distinctDecisions),
    sameContextAnswerAdditionalPresentationsRange:range(x=>
      x.alertCounts.sameContextAnswerAdditionalPresentations),
    sameAuctionAnswerAdditionalPresentationsRange:range(x=>
      x.alertCounts.sameAuctionAnswerAdditionalPresentations),
    contextAnswerGroupsWithDifferentAuctionsRange:range(x=>
      x.alertCounts.contextAnswerGroupsWithDifferentAuctions),
    adjacentSessionDecisionOverlapsRange:range(x=>
      x.alertCounts.adjacentSessionDecisionOverlaps),
    minorPresence,scenarios,masteryInferred:false,publicRuntimeWired:false,
    decision:'Audit de diversité, aucun algorithme de substitution activé'};
}
module.exports={WINDOWS,answer,actionClass,context,describe,summarise,trace,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');
