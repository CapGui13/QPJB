'use strict';
/*
 * QPJB V2-N: observatoire purement documentaire des notions rencontrées
 * dans les séances produites par V2-F.
 * Ne sélectionne aucun QCM, ne modifie aucun état élève et ne déclare
 * jamais une notion "maîtrisée" ou "débloquée".
 */
const P=require('./parcours-v2-pilot.cjs');
const F=require('./parcours-v2-fondations.cjs');
const L=require('./parcours-v2-mix-l.cjs');

function loadIndex(catalog,base=F.load(),extension=L.loadExpansion()){
  if(base.unlockEngineEnabled!==false||base.gradingEnabled!==false||
     base.masteryInferenceEnabled!==false||base.status!=='CANDIDATURE_DOCUMENTAIRE_NON_ACTIVE'||
     extension.unlockEngineEnabled!==false||extension.gradingEnabled!==false||
     extension.masteryInferenceEnabled!==false||extension.status!=='CANDIDAT_DOCUMENTAIRE_NON_ACTIVE')
    throw Error('V2-N exige exclusivement les cartographies non actives');
  const byId=new Map(catalog.map(x=>[x.id,x]));
  if(byId.size!==catalog.length)throw Error('IDs QCM dupliqués');
  const foundationList=L.combinedFoundations(base,extension);
  const sourceIndex=new Map(),metadata=[];
  for(const f of foundationList){
    const unique=new Set(),families=new Set();
    for(const e of f.evidence){
      const original=byId.get(e.id);
      if(!original||original.theme!==e.theme||
        original.answer!==e.originalAnswer||
        P.family(original)!==e.caseFamily||
        original.difficultyReason!==e.editorialReason)
        throw Error('Source altérée ou absente : '+e.id);
      if(unique.has(e.id))throw Error('ID répété dans fondation '+f.id+' '+e.id);
      unique.add(e.id);families.add(e.caseFamily);
      if(!sourceIndex.has(e.id))sourceIndex.set(e.id,[]);
      sourceIndex.get(e.id).push(f.id);
    }
    metadata.push({id:f.id,label:f.label,status:f.coverageStatus,
      suggestedEarliestCompletedSessions:f.suggestedEarliestCompletedSessions,
      sourceQcmCount:unique.size,sourceFamilyCount:families.size});
  }
  if(metadata.length!==15||sourceIndex.size!==110)
    throw Error('Cartographie N ne correspond plus aux 15 fondations / 110 QCM');
  return {sourceIndex,metadata};
}
function analyzeSessions(sessions,index,state){
  if(!Array.isArray(sessions)||!sessions.length)
    throw Error('Séances simulées requises');
  const sourceIndex=index.sourceIndex;
  const found=new Map(index.metadata.map(f=>[f.id,{...f,
    presentationCount:0,seenIds:new Set(),seenFamilies:new Set(),
    seenSessions:new Set(),firstSession:null,lastSession:null}]));
  const bySession=[],uniqueCatalogFamilies=new Set(),allIds=new Set();
  let mappedPresentations=0;
  for(let i=0;i<sessions.length;i++){
    const deck=sessions[i];
    if(deck.length!==10||new Set(deck.map(P.family)).size!==10)
      throw Error('Séance incomplète ou famille répétée: '+(i+1));
    const linkedFoundations=new Set(),sessionLinkedIds=new Set();
    for(const q of deck){
      allIds.add(q.id);
      uniqueCatalogFamilies.add(P.family(q));
      const owners=sourceIndex.get(q.id)||[];
      if(owners.length)sessionLinkedIds.add(q.id);
      for(const foundationId of owners){
        const f=found.get(foundationId);
        f.presentationCount++;
        f.seenIds.add(q.id);
        f.seenFamilies.add(P.family(q));
        f.seenSessions.add(i+1);
        f.firstSession??=i+1;f.lastSession=i+1;
        linkedFoundations.add(foundationId);
      }
    }
    mappedPresentations+=sessionLinkedIds.size;
    bySession.push({
      session:i+1,
      themes:new Set(deck.map(q=>q.theme)).size,
      sourceQcmPresentations:sessionLinkedIds.size,
      foundationCandidates:[...linkedFoundations].sort(),
      oneOrMoreCandidates:linkedFoundations.size>0
    });
  }
  const byFoundation=[...found.values()].map(f=>({
    id:f.id,label:f.label,status:f.status,
    sourceQcmCount:f.sourceQcmCount,
    sourceFamilyCount:f.sourceFamilyCount,
    presentations:f.presentationCount,
    encounteredIds:f.seenIds.size,
    encounteredFamilies:f.seenFamilies.size,
    sessionsSeen:f.seenSessions.size,
    firstEncounterSession:f.firstSession,
    lastEncounterSession:f.lastSession,
    note:'Exposition observée uniquement — ni prérequis acquis, ni validation SEF'
  }));
  const windows=[];
  for(let a=0;a<sessions.length;a+=5){
    const subset=sessions.slice(a,a+5),flattened=subset.flat();
    windows.push({fromSession:a+1,toSession:a+subset.length,
      differentThemes:new Set(flattened.map(q=>q.theme)).size,
      differentFamilies:new Set(flattened.map(P.family)).size,
      mappedQcmPresentations:flattened.filter(q=>sourceIndex.has(q.id)).length});
  }
  const uncovered=byFoundation.filter(f=>f.presentations===0).map(f=>f.id);
  const oneFamilySeen=byFoundation.filter(f=>f.encounteredFamilies===1).map(f=>f.id);
  return {
    schema:'QPJB_V2_N_SHADOW_OBSERVATORY_20261118_1',
    status:'SIMULATION_FICTIVE_NON_ACTIVE',
    sessionCount:sessions.length,questions:sessions.length*10,
    distinctOriginalQcm:allIds.size,distinctOriginalFamilies:uniqueCatalogFamilies.size,
    mappedPresentations,uncoveredFoundations:uncovered,
    oneFamilyEncounteredFoundations:oneFamilySeen,
    foundationCandidatesSeen:byFoundation.length-uncovered.length,
    all22ThemesSeen:new Set(sessions.flat().map(q=>q.theme)).size===22,
    scheduledRecalls:state.reviewEvents.filter(e=>e.source==='scheduled').length,
    byFoundation,bySession,windows,
    masteryDeclared:false,unlocksEnabled:false,
    warning:'Observer des situations candidates n est pas mesurer les connaissances des élèves'
  };
}
function analyzeScenario(catalog,annotations,index,{sessions=45,seed=13,profile='balanced'}={}){
  const pilot=P.simulateV2(catalog,annotations,{sessions,seed,profile});
  return analyzeSessions(pilot.sessions,index,pilot.state);
}
function matrix({detail=false}={}){
  const catalog=P.loadCatalog(),annotations=P.loadAnnotations(),index=loadIndex(catalog);
  const profiles=['balanced','fragile-mineures','facile'],seeds=[13,29,47],rows=[];
  for(const profile of profiles)for(const seed of seeds){
    const result=analyzeScenario(catalog,annotations,index,{profile,seed,sessions:45});
    rows.push({profile,seed,
      themes:result.all22ThemesSeen?22:'moins_de_22',
      distinctFamilies:result.distinctOriginalFamilies,
      mappedPresentations:result.mappedPresentations,
      foundationCandidatesSeen:result.foundationCandidatesSeen,
      uncoveredFoundations:result.uncoveredFoundations,
      oneFamilyEncounteredFoundations:result.oneFamilyEncounteredFoundations,
      scheduledRecalls:result.scheduledRecalls,
      windows:detail?result.windows:undefined,
      byFoundation:detail?result.byFoundation:undefined,
      bySession:detail?result.bySession:undefined
    });
  }
  const range=pick=>[Math.min(...rows.map(pick)),Math.max(...rows.map(pick))];
  return {schema:'QPJB_V2_N_9_SHADOW_SCENARIOS_20261118_1',
    status:'LECTURE_SEULE_SIMULATIONS_FICTIVES',
    exercises:catalog.length,foundationCandidates:index.metadata.length,
    mappedOriginalIds:index.sourceIndex.size,scenarios:rows.length,
    questionsPerScenario:450,
    metrics:{
      uniqueFamilies:range(r=>r.distinctFamilies),
      mappedPresentations:range(r=>r.mappedPresentations),
      foundationCandidatesSeen:range(r=>r.foundationCandidatesSeen),
      targetedReviews:range(r=>r.scheduledRecalls),
      allThemes22InEveryScenario:rows.every(r=>r.themes===22),
      unencounteredCounts:range(r=>r.uncoveredFoundations.length)
    },
    rows,masteryDeclared:false,unlocksEnabled:false,
    warning:'Taxonomie candidate et réponses synthétiques; aucune performance d apprenant mesurée'};
}
module.exports={loadIndex,analyzeSessions,analyzeScenario,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(
  matrix({detail:process.argv.includes('--detail')}),null,2)+'\n');
