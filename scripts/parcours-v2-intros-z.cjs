'use strict';
/* Z: non-scored "before the first QCM" preparation, five verified originals.
 * Not a student feature or a change in the selection engine.
 * Not a proof of knowledge and NOT approved for classroom presentation.
 */
const F=require('./parcours-v2-pilot.cjs');
const Y=require('./parcours-v2-transitions-y.cjs');

const POLICY=Object.freeze({
  exposureScope:'FIRST_ENCOUNTER_OF_EXACT_THEME',
  activation:'EXPERIMENTAL_TEACHER_REVIEW_ONLY',
  delivery:'BEFORE_QUESTION_UNSCORED',
  studentMasteryRecorded:false,
  originalQcmEdited:false,
  scoreAffectsProgression:false,
  originalSelectionChanged:false
});
const CARDS=Object.freeze({
  'SEF-V486-022':{
    theme:'rubensohl',
    sourceAnchor:'2♣ (Landy',
    title:'Lire la défense après intervention sur 1SA',
    steps:[
      'Repère quel camp a ouvert de 1SA et quel camp intervient ensuite.',
      'Identifie précisément la signification de l’intervention adverse : une intervention artificielle ne se traite pas automatiquement comme une enchère naturelle.',
      'Avant de choisir, vérifie quel dispositif de réponse la paire utilise dans cette situation.'
    ]
  },
  'SEF-V481-009':{
    theme:'rubensohl',
    sourceAnchor:'Stayman artificiel 3♣',
    title:'Identifier le rôle de chaque enchère après 1SA',
    steps:[
      'Repère l’intervention naturelle adverse et la signification que la séquence attribue déjà au 3♣ du partenaire.',
      'Vérifie maintenant quel joueur doit répondre et quelle majeure possède quatre cartes.',
      'Évite d’attribuer à une enchère une longueur que la main ne possède pas.'
    ]
  },
  'SEF-L04-029':{
    theme:'michaels',
    sourceAnchor:'Vous avez déjà PASSÉ sur 3♠',
    title:'Décider après un cue-bid bicolore et une surenchère',
    steps:[
      'Relis les deux couleurs exactement promises par le cue-bid du partenaire.',
      'Compte le soutien réel que tu possèdes dans chacune de ces deux couleurs, sans confondre longueur personnelle et fit garanti.',
      'Relis la vulnérabilité et le palier atteint avant de décider si une nouvelle enchère se justifie.'
    ]
  },
  'SEF-C2-007':{
    theme:'michaels',
    sourceAnchor:'bicolore majeur 5–5',
    title:'Lire une convention bicolore en intervention',
    steps:[
      'Observe l’ouverture adverse et les deux couleurs longues de ta main.',
      'Repère le système convenu explicitement annoncé dans le contexte.',
      'Fais correspondre la description conventionnelle à la situation avant de regarder les propositions.'
    ]
  },
  'SEF-V45-044':{
    theme:'michaels',
    sourceAnchor:'Michaels précisés',
    title:'Reconnaître les couleurs d’un cue-bid',
    steps:[
      'Repère la couleur d’ouverture de l’adversaire.',
      'Identifie les deux couleurs qu’un bicolore conventionnel peut décrire dans l’accord annoncé.',
      'Compare ensuite la distribution réelle de la main aux différentes propositions.'
    ]
  }
});
const IDS=Object.freeze(Object.keys(CARDS));
function catalogGuard(catalog){
  if(catalog.length!==1523)throw Error('Z : 1523 sources attendues');
  const byId=new Map(catalog.map(q=>[q.id,q]));
  if(byId.size!==catalog.length)throw Error('Z : IDs sources dupliqués');
  const verified={};
  for(const [id,item] of Object.entries(CARDS)){
    const q=byId.get(id);
    if(!q||q.theme!==item.theme||!String(q.context).includes(item.sourceAnchor))
      throw Error('Z : contexte original incompatible avec '+id);
    if(!q.answer||!q.explain||!q.caseFamily||!q.choices.includes(q.answer)||
      !Array.isArray(q.hand)||q.hand.flat().length!==13)
      throw Error('Z : original invalide '+id);
    if(item.steps.length!==3||item.steps.some(s=>!s||s.length>230))
      throw Error('Z : aide non contrôlée '+id);
    const raw=(item.title+' '+item.steps.join(' ')).toLowerCase();
    // Guard only literal answer phrases; semantic effects need teacher review.
    if(raw.includes(q.answer.toLowerCase()))
      throw Error('Z : réponse littérale divulguée par aide '+id);
    verified[id]={theme:q.theme,caseFamily:F.family(q),
      difficulty:q.difficulty,sourceAnswer:q.answer};
  }
  return {checkedIds:IDS.length,verified};
}
function buildCard(first,catalog){
  if(!first||!first.first||!first.first.id)throw Error('Z : première exposition invalide');
  const id=first.first.id,template=CARDS[id];
  if(!template||template.theme!==first.theme)return null;
  const original=catalog.find(q=>q.id===id);
  if(!original||original!==undefined&&original.theme!==template.theme||
     original.answer!==first.first.answer||original.explain!==first.first.explain)
    throw Error('Z : exposition incohérente avec catalogue '+id);
  return {
    sourceId:id,theme:template.theme,sourceFamily:F.family(original),
    title:template.title,steps:template.steps.slice(),
    reviewStatus:'VALIDATION_ENSEIGNANTE_REQUISE',
    placement:'BEFORE_ORIGINAL_QCM',presentation:'UNSCORED',
    doesNotAnswerQuestion:true,doesNotReplaceOriginal:true,
    noMasteryOrProficiencyInferred:true
  };
}
function observe(report,catalog){
  catalogGuard(catalog);
  const first=report.observations.filter(x=>['rubensohl','michaels'].includes(x.theme));
  if(first.length!==2)throw Error('Z : 2 premières rubriques attendues');
  return first.map(obs=>{
    if(obs.status!=='OBSERVEE')throw Error('Z : rubrique non vue');
    const card=buildCard(obs,catalog);
    return {theme:obs.theme,firstQuestionId:obs.first.id,
      firstSession:obs.firstSession,firstPosition:obs.firstPosition,
      card,matched:!!card,
      originalAnswerRemains:obs.first.answer,
      originalContextRemains:obs.first.context,
      noQuestionOrAnswerRewritten:true};
  });
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  if(annotations.size!==79)throw Error('Z : annotations modifiées');
  const guard=catalogGuard(catalog),rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const sim=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
      const before=sim.sessions.map(deck=>deck.map(q=>q.id));
      const stateBefore=JSON.stringify(sim.state);
      const y=Y.firstEncounter(sim.sessions,catalog);
      const exposures=observe(y,catalog);
      if(JSON.stringify(sim.sessions.map(deck=>deck.map(q=>q.id)))!==JSON.stringify(before)||
        JSON.stringify(sim.state)!==stateBefore)
        throw Error('Z : simulation modifiée');
      rows.push({profile,seed,exposures,
        families:sim.metrics.uniqueFamilies,
        targetedReviews:sim.metrics.revision.scheduledDueRecalls,
        themesCovered:Object.keys(sim.metrics.themes).length});
    }
  const range=k=>[Math.min(...rows.map(r=>r[k])),Math.max(...rows.map(r=>r[k]))];
  const coverage=Object.fromEntries(IDS.map(id=>[id,rows.reduce((n,r)=>
    n+r.exposures.filter(x=>x.firstQuestionId===id&&x.matched).length,0)]));
  const all=rows.flatMap(x=>x.exposures),matched=all.filter(x=>x.matched);
  const good=rows.every(r=>r.exposures.length===2&&r.exposures.every(x=>x.matched)&&
    r.themesCovered===22);
  return {schema:'QPJB_V2_Z_9_SCENARIOS_1',
    status:'TEACHER_REVIEW_NON_ACTIVE',
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    catalogQuestions:catalog.length,sidecarCards:guard.checkedIds,
    themes:['rubensohl','michaels'],firstEncounters:all.length,
    coveredFirstEncounters:matched.length,sourceIdsFirstSeen:coverage,
    everyFirstEncounterCovered:good,
    familiesRange:range('families'),targetedReviewsRange:range('targetedReviews'),
    rows,
    policy:POLICY,originalQcmEdited:false,
    engineUnchanged:true,publicRuntimeWired:false,
    studentMasteryInferred:false,
    pedagogicalApprovalRequired:true,
    decision:'Only teacher-reviewed optional non-scored introductions; no production rollout'};
}
module.exports={POLICY,CARDS,IDS,catalogGuard,buildCard,observe,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');
