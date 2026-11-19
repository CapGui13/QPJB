'use strict';
/* QPJB phase X: experiment with an isolated scoring preference only.
 * The real V2-F source file is NEVER edited, rewritten, or monkey-patched.
 * A compiled local copy is produced from the exact audited score anchor.
 * This file is a CI/offline scientific simulation, not browser code.
 */
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const F=require('./parcours-v2-pilot.cjs');
const W=require('./parcours-v2-progression-w.cjs');

const FILE=require.resolve('./parcours-v2-pilot.cjs');
const ANCHOR='const target=Math.min(5,1+Math.floor(session/12));';
const TARGETS=Object.freeze({
  reference:null,
  mild:'Math.min(5,1+(session>=6?1:0)+(session>=22?1:0)+(session>=34?1:0)+(session>=48?1:0))',
  early:'Math.min(5,1+(session>=5?1:0)+(session>=18?1:0)+(session>=30?1:0)+(session>=48?1:0))'
});
const PROFILES=['balanced','fragile-mineures','facile'];
const SEEDS=[13,29,47];
function targetAt(variant,session){
  if(!Number.isInteger(session)||session<0)throw Error('Index de séance invalide');
  if(variant==='reference')return Math.min(5,1+Math.floor(session/12));
  if(variant==='mild')return Math.min(5,1+(session>=6?1:0)+(session>=22?1:0)+
    (session>=34?1:0)+(session>=48?1:0));
  if(variant==='early')return Math.min(5,1+(session>=5?1:0)+(session>=18?1:0)+
    (session>=30?1:0)+(session>=48?1:0));
  throw Error('Profil de sélection inconnu : '+variant);
}
function makeEngine(variant){
  if(!Object.hasOwn(TARGETS,variant))throw Error('Variante inconnue');
  if(variant==='reference')return F;
  const original=fs.readFileSync(FILE,'utf8');
  if(original.split(ANCHOR).length!==2)
    throw Error('Source V2-F différente : expérience refusée sans revoir le score');
  const modified=original.replace(ANCHOR,'const target='+TARGETS[variant]+';');
  if(modified.length===original.length&&modified===original)throw Error('Remplacement sans effet');
  const clone=new Module(FILE,module);
  clone.filename=FILE;
  clone.paths=Module._nodeModulePaths(path.dirname(FILE));
  clone._compile(modified,FILE);
  // This proves all unchanged helpers and the session recorder are obtained
  // from the same original source and not implemented a second time.
  for(const k of Object.keys(F))
    if(!(k in clone.exports))throw Error('Export V2-F absent : '+k);
  return clone.exports;
}
function summarize(run,catalog,annotations){
  const a=W.trace(run.sessions,catalog,annotations),m=run.metrics;
  const minor=Object.fromEntries(['1♣','1♦'].map(k=>[k,{
    openings:m.opening[k]||0,
    replies:m.responses['rep:'+k]||0
  }]));
  return {families:m.uniqueFamilies,
    scheduledRecalls:m.revision.scheduledDueRecalls,
    totalDueRecalls:m.revision.actualDueRecalls,
    themes:a.themesSeen,minor,
    firstFiveHigh:a.firstFiveDifficulty4Or5,
    firstTenHigh:a.firstTenDifficulty4Or5,
    firstTenIntermediate:run.sessions.slice(0,10).flat().filter(q=>q.difficulty===3).length,
    firstTenAverage:a.windows.slice(0,2).reduce((n,w)=>n+w.meanEditorialDifficulty,0)/2,
    first30High:run.sessions.slice(0,30).flat().filter(q=>q.difficulty>=4).length,
    last15High:a.windows[a.windows.length-1].highEditorialCount,
    difficultyWindows:a.windows.map(x=>({
      from:x.from,to:x.to,mean:x.meanEditorialDifficulty,high:x.highEditorialCount,
      low:x.lowEditorialCount})),
    microContexts:a.microContextsSeen,
    firstThemeDifficulty4Or5:a.firstThemeDifficulty4Or5,
    firstThemeExposures:a.firstThemeExposures.map(x=>({
      theme:x.theme,session:x.session,firstDifficulty:x.firstDifficulty}))
  };
}
function compare(before,after,baseRun,candidateRun){
  const dif=(k)=>after[k]-before[k];
  const slotsBaseline=baseRun.state.reviewEvents.filter(x=>x.source==='scheduled').length;
  const slotsCandidate=candidateRun.state.reviewEvents.filter(x=>x.source==='scheduled').length;
  if(slotsBaseline!==before.scheduledRecalls||slotsCandidate!==after.scheduledRecalls)
    throw Error('Comptage de rappels non cohérent');
  const baseFirst=baseRun.sessions.slice(0,5).map(d=>d.map(q=>q.id));
  const candidateFirst=candidateRun.sessions.slice(0,5).map(d=>d.map(q=>q.id));
  const earlyFiveIdentical=JSON.stringify(baseFirst)===JSON.stringify(candidateFirst);
  const firstTenMinor=Object.fromEntries(['1♣','1♦'].map(k=>[k,{
    reference:baseRun.sessions.slice(0,10).flat().filter(q=>F.roleOpening(q)==='rep:'+k).length,
    candidate:candidateRun.sessions.slice(0,10).flat().filter(q=>F.roleOpening(q)==='rep:'+k).length
  }]));
  // Strict "no significant regressions" policy; candidate rejected if ANY
  // synthetic profile/seed violates a guard.
  const reasons=[];
  if(after.themes!==22)reasons.push('RUBRIQUES_NON_COUVERTES');
  if(dif('families')< -2)reasons.push('FAMILLES_-3_OU_PIRE');
  if(dif('scheduledRecalls')< -2)reasons.push('RAPPELS_-3_OU_PIRE');
  for(const k of ['1♣','1♦']){
    if(after.minor[k].openings<before.minor[k].openings-2)
      reasons.push('OUVERTURE_'+k+'_EN_BAISSE');
    if(after.minor[k].replies<before.minor[k].replies-2)
      reasons.push('REPONSE_'+k+'_EN_BAISSE');
    if(firstTenMinor[k].candidate<firstTenMinor[k].reference-1)
      reasons.push('REPONSE_DEBUT_'+k+'_EN_BAISSE');
  }
  if(after.firstFiveHigh!==0)reasons.push('QCM_4_5_SUR_5_PREMIERES');
  if(after.firstTenHigh>before.firstTenHigh+2)reasons.push('QCM_4_5_PRECOCES');
  if(after.firstThemeDifficulty4Or5>before.firstThemeDifficulty4Or5+1)
    reasons.push('RUBRIQUES_ABORDEES_TROP_HAUT');
  // En début de parcours, ne pas garder plus de 5 séances inchangées
  // ni considérer un score moyen amélioré comme seul objectif pédagogique.
  return {familyDifference:dif('families'),recallDifference:dif('scheduledRecalls'),
    intermediateFirstTenDifference:dif('firstTenIntermediate'),
    highFirst30Difference:dif('first30High'),
    firstTenMeanDifference:Math.round(dif('firstTenAverage')*1000)/1000,
    earlyFiveIdentical,firstTenMinor,
    guardReasons:reasons,guardPass:reasons.length===0,
    editorialDifficultyImproved:after.firstTenIntermediate>before.firstTenIntermediate||
      after.firstTenAverage>before.firstTenAverage,
    changeIntroducedWithoutTouchingFirstFive:earlyFiveIdentical
  };
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)throw Error('Périmètre altéré');
  const engineMild=makeEngine('mild'),engineEarly=makeEngine('early');
  const rows=[];
  for(const profile of PROFILES)for(const seed of SEEDS){
    const settings={profile,seed,sessions:45};
    const b=F.simulateV2(catalog,annotations,settings);
    const m=engineMild.simulateV2(catalog,annotations,settings);
    const e=engineEarly.simulateV2(catalog,annotations,settings);
    const base=summarize(b,catalog,annotations),
      mild=summarize(m,catalog,annotations),early=summarize(e,catalog,annotations);
    rows.push({profile,seed,reference:base,
      mild:{metrics:mild,delta:compare(base,mild,b,m)},
      early:{metrics:early,delta:compare(base,early,b,e)}});
  }
  const digest=variant=>{
    const vals=rows.map(x=>x[variant].delta),nums=(key)=>vals.map(v=>v[key]);
    const range=x=>[Math.min(...x),Math.max(...x)];
    return {passingScenarios:vals.filter(x=>x.guardPass).length,
      scenariosWithEarlyMeanImproved:vals.filter(x=>x.editorialDifficultyImproved).length,
      identicalFirstFiveScenarios:vals.filter(x=>x.earlyFiveIdentical).length,
      independentFamiliesDeltaRange:range(nums('familyDifference')),
      scheduledRecallDeltaRange:range(nums('recallDifference')),
      earlyIntermediateDeltaRange:range(nums('intermediateFirstTenDifference')),
      earlyEditorialMeanDeltaRange:range(nums('firstTenMeanDifference')),
      highBeforeSession31DeltaRange:range(nums('highFirst30Difference')),
      failures:rows.filter(x=>!x[variant].delta.guardPass)
        .map(x=>({profile:x.profile,seed:x.seed,reasons:x[variant].delta.guardReasons}))};
  };
  const results={mild:digest('mild'),early:digest('early')};
  const acceptable=Object.entries(results).filter(([,x])=>
    x.passingScenarios===9&&x.scenariosWithEarlyMeanImproved===9&&
    x.identicalFirstFiveScenarios===9).map(([key])=>key);
  return {schema:'QPJB_V2_X_9_SCENARIOS_1',
    status:'EXPERIMENTAL_LOCAL_ONLY_NON_ACTIVE',
    candidates:Object.keys(TARGETS),scenarios:rows.length,
    sessionsPerScenario:45,questionsPerScenario:450,
    originalCatalog:catalog.length,referenceEngineUnmodified:true,
    targetedChange:'Only target used in editorial difficulty preference of scoring',
    targetTrajectories:Object.fromEntries(Object.keys(TARGETS).map(key=>[key,
      [1,5,6,10,12,18,22,24,30,34,36,45].map(s=>({
        session:s,level:targetAt(key,s-1)}))])),
    results,rows,fullyPassingCandidates:acceptable,
    decision:acceptable.length?'Candidate for teacher review; NEVER auto-deploy':
      'Keep V2-F reference; candidate regression and/or no robust gain',
    masteryInferred:false,studentsObserved:false,publicRuntimeWired:false,
    productionModified:false};
}
module.exports={ANCHOR,TARGETS,targetAt,makeEngine,summarize,compare,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');
