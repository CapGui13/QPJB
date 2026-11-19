'use strict';
/* QPJB V2-W : observatoire de progression des difficultes et premieres expositions.
 * Les difficultes sont des etiquettes du catalogue, PAS des mesures cognitives.
 * Aucune modification de V2-F, aucun apprentissage/maitrise inferes.
 */
const F=require('./parcours-v2-pilot.cjs');
const P=require('../quizz-parcours.js');
const WINDOWS=[[1,5],[6,10],[11,20],[21,30],[31,45]];
const PROFILES=['balanced','fragile-mineures','facile'];
const SEEDS=[13,29,47];
const scoreTarget=sessionIndex=>Math.min(5,1+Math.floor(sessionIndex/12));
function histogram(questions){
  const h=Object.fromEntries([1,2,3,4,5].map(n=>[n,0]));
  for(const q of questions){
    if(!Number.isInteger(q.difficulty)||q.difficulty<1||q.difficulty>5)
      throw Error('Difficulte hors echelle '+q.id);
    h[q.difficulty]++;
  }
  return h;
}
function quant(x){return Math.round(x*100)/100}
function label(q){return {id:q.id,theme:q.theme,difficulty:q.difficulty,
  family:F.family(q),opening:F.roleOpening(q),answer:q.answer,
  explanationSource:q.difficultyReason||null}}
function coverage(catalog){
  const themes={};
  for(const q of catalog){
    if(!Number.isInteger(P.INTRO[q.theme]))throw Error('Theme hors feuille de route '+q.theme);
    const v=themes[q.theme]||(themes[q.theme]={count:0,intro:P.INTRO[q.theme]+1,
      histogram:Object.fromEntries([1,2,3,4,5].map(n=>[n,0]))});
    v.count++;v.histogram[q.difficulty]=(v.histogram[q.difficulty]||0)+1;
  }
  return {count:catalog.length,histogram:histogram(catalog),
    themes:Object.fromEntries(Object.entries(themes).sort((a,b)=>a[1].intro-b[1].intro))};
}
function trace(sessions,catalog,annotations){
  if(!sessions.length||sessions.some(d=>d.length!==10))throw Error('Dix QCM par seance attendus');
  const original=new Map(catalog.map(q=>[q.id,q]));
  if(original.size!==catalog.length)throw Error('IDs source doubles');
  const seenTheme=new Map(),seenConcept=new Map(),all=[],perSession=[],cases=[];
  let editorialHighAtFirstTheme=0,editorialHighAtFirstConcept=0;
  for(let i=0;i<sessions.length;i++){
    const deck=sessions[i],s=i+1,target=scoreTarget(i);
    if(new Set(deck.map(F.family)).size!==10)throw Error('Famille dupliquee seance '+s);
    const newThemes=[],newMicroConcepts=[];
    for(const q of deck){
      if(original.get(q.id)!==q)throw Error('Source QCM remplacee '+q.id);
      if(!F.available(q,i,annotations))throw Error('QCM presente avant son introduction '+q.id);
      if(!Number.isInteger(q.difficulty)||q.difficulty<1||q.difficulty>5)
        throw Error('Difficulte non classable '+q.id);
      if(!seenTheme.has(q.theme)){
        const t={theme:q.theme,session:s,intro:P.INTRO[q.theme]+1,
          firstDifficulty:q.difficulty,firstId:q.id,
          sessionLagFromIntroduction:s-(P.INTRO[q.theme]+1)};
        seenTheme.set(q.theme,t);newThemes.push(t);
        if(q.difficulty>=4){editorialHighAtFirstTheme++;cases.push({
          signal:'FIRST_THEME_DIFFICULTY_4PLUS',session:s,...label(q)})}
      }
      const key=F.concept(q,annotations);
      // "rubrique:*" is too wide and not a validated micro-objective.
      if(!key.startsWith('rubrique:')&&!seenConcept.has(key)){
        const c={key,session:s,firstDifficulty:q.difficulty,id:q.id,
          type:annotations.has(q.id)?'ANNOTATION_CANDIDATE':'MICRO_CONTEXTE'};
        seenConcept.set(key,c);newMicroConcepts.push(c);
        if(q.difficulty>=4){editorialHighAtFirstConcept++;cases.push({
          signal:'FIRST_MICRO_CONTEXT_DIFFICULTY_4PLUS',session:s,
          concept:key,...label(q)})}
      }
      all.push(q);
    }
    const hist=histogram(deck);
    perSession.push({session:s,targetEditorialLevel:target,
      meanEditorialDifficulty:quant(deck.reduce((n,q)=>n+q.difficulty,0)/10),
      difficultyHistogram:hist,highEditorialCount:hist[4]+hist[5],
      newThemeCount:newThemes.length,
      newMicroContextCount:newMicroConcepts.length,
      firstThemes:newThemes,firstMicroContexts:newMicroConcepts});
  }
  const windows=WINDOWS.filter(([a])=>a<=sessions.length).map(([from,end])=>{
    const to=Math.min(end,sessions.length),qs=sessions.slice(from-1,to).flat(),
      hist=histogram(qs);
    return {from,to,questions:qs.length,
      meanEditorialDifficulty:quant(qs.reduce((n,q)=>n+q.difficulty,0)/qs.length),
      histogram:hist,highEditorialCount:hist[4]+hist[5],
      highEditorialSharePct:quant(100*(hist[4]+hist[5])/qs.length),
      lowEditorialCount:hist[1]+hist[2],
      newThemeCount:perSession.slice(from-1,to).reduce((n,x)=>n+x.newThemeCount,0),
      newMicroContextCount:perSession.slice(from-1,to)
        .reduce((n,x)=>n+x.newMicroContextCount,0)};
  });
  const firstThemes=[...seenTheme.values()].sort((a,b)=>a.session-b.session||a.theme.localeCompare(b.theme));
  const firstMicroContexts=[...seenConcept.values()].sort((a,b)=>a.session-b.session||a.key.localeCompare(b.key));
  const early=all.slice(0,100);
  const firstTenHigh=early.filter(q=>q.difficulty>=4).length;
  const firstFiveHigh=all.slice(0,50).filter(q=>q.difficulty>=4).length;
  const lastTenLow=all.slice(Math.max(0,all.length-100)).filter(q=>q.difficulty<=2).length;
  const out={schema:'QPJB_V2_W_PROGRESSION_1',status:'EXPOSITION_SYNTHETIQUE_LECTURE_SEULE',
    sessions:sessions.length,questions:all.length,wholeCatalog:catalog.length,
    editorialDifficultyLabelsOnly:true,
    difficultyHistogram:histogram(all),windows,
    firstThemeExposures:firstThemes,firstMicroContextExposures:firstMicroContexts,
    firstThemeDifficulty4Or5:editorialHighAtFirstTheme,
    firstMicroContextDifficulty4Or5:editorialHighAtFirstConcept,
    firstFiveDifficulty4Or5:firstFiveHigh,firstTenDifficulty4Or5:firstTenHigh,
    lastTenDifficulty1Or2:lastTenLow,
    sampleFirstHighCases:cases.slice(0,20),
    perSession,
    themesSeen:seenTheme.size,
    microContextsSeen:seenConcept.size,
    proficiencyInferred:false,learnerDataUsed:false,
    selectionChanged:false,publicRuntimeWired:false};
  return out;
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(catalog.length!==1523||annotations.size!==79)throw Error('Périmètre QPJB modifie');
  const originalCoverage=coverage(catalog),rows=[];
  for(const profile of PROFILES)for(const seed of SEEDS){
    const sim=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
    const a=trace(sim.sessions,catalog,annotations);
    rows.push({profile,seed,uniqueFamilies:sim.metrics.uniqueFamilies,
      scheduledRecalls:sim.metrics.revision.scheduledDueRecalls,
      themesSeen:a.themesSeen,microContextsSeen:a.microContextsSeen,
      firstThemeDifficulty4Or5:a.firstThemeDifficulty4Or5,
      firstMicroContextDifficulty4Or5:a.firstMicroContextDifficulty4Or5,
      firstFiveDifficulty4Or5:a.firstFiveDifficulty4Or5,
      firstTenDifficulty4Or5:a.firstTenDifficulty4Or5,
      lastTenDifficulty1Or2:a.lastTenDifficulty1Or2,
      windows:a.windows,
      firstThemeExposures:a.firstThemeExposures,
      firstMicroContextExposures:a.firstMicroContextExposures,
      firstHighCases:a.sampleFirstHighCases});
  }
  const range=fn=>[Math.min(...rows.map(fn)),Math.max(...rows.map(fn))];
  const themes=Object.keys(originalCoverage.themes);
  const themeExposures=Object.fromEntries(themes.map(theme=>[theme,{
    catalogFirstEligibleSession:originalCoverage.themes[theme].intro,
    firstObservedSessionRange:range(r=>r.firstThemeExposures.find(x=>x.theme===theme)?.session??46),
    firstDifficultyRange:range(r=>r.firstThemeExposures.find(x=>x.theme===theme)?.firstDifficulty??0),
    firstObservedAtLeastDifficulty4:rows.filter(r=>
      (r.firstThemeExposures.find(x=>x.theme===theme)?.firstDifficulty||0)>=4).length
  }]));
  const periodRanges=WINDOWS.map(([from,to],idx)=>({
    from,to,
    meanEditorialDifficultyRange:range(r=>r.windows[idx].meanEditorialDifficulty),
    highEditorialSharePctRange:range(r=>r.windows[idx].highEditorialSharePct),
    newThemeCountRange:range(r=>r.windows[idx].newThemeCount),
    newMicroContextCountRange:range(r=>r.windows[idx].newMicroContextCount)
  }));
  return {schema:'QPJB_V2_W_9_SCENARIOS_1',
    status:'OBSERVATION_NON_ELEVES_NON_ACTIVE',
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    originalCatalog:originalCoverage,
    periodRanges,themeExposures,
    firstThemeDifficulty4Or5Range:range(r=>r.firstThemeDifficulty4Or5),
    firstMicroContextDifficulty4Or5Range:range(r=>r.firstMicroContextDifficulty4Or5),
    firstFiveDifficulty4Or5Range:range(r=>r.firstFiveDifficulty4Or5),
    firstTenDifficulty4Or5Range:range(r=>r.firstTenDifficulty4Or5),
    lastTenDifficulty1Or2Range:range(r=>r.lastTenDifficulty1Or2),
    firstMicroContextsSeenRange:range(r=>r.microContextsSeen),
    themeCoverage22EveryScenario:rows.every(r=>r.themesSeen===22),
    referenceFamiliesRange:range(r=>r.uniqueFamilies),
    referenceRecallsRange:range(r=>r.scheduledRecalls),
    rows,selectionChanged:false,publicRuntimeWired:false,
    learnerDifficultyMeasured:false,masteryInferred:false};
}
module.exports={WINDOWS,scoreTarget,histogram,coverage,trace,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');
