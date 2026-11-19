'use strict';
/* QPJB V2 phase V : audit documentaire des cas signales par U.
 * Lecture des mains originelles, aucune alteration de tirage ou de QCM.
 * La proximite d'une reponse ne vaut pas duplicat et ne prouve pas la maitrise.
 */
const F=require('./parcours-v2-pilot.cjs');
const SOURCE_GROUPS=Object.freeze({
  oneDiamondNoMajor:['SEF-N040-2','SEF-N043-1'],
  oneClubFiveDiamondsFourMajor:[
    'SEF-V49-005','SEF-V49-006','SEF-V426-001','SEF-V426-002'
  ],
  oneNoTrumpPass:['SEF-N088-1','SEF-N089-2']
});
const EXPECTED=Object.freeze({
  'SEF-N040-2':{auction:'Partenaire : 1♦',h:9,shape:'3-3-5-2',answer:'1SA',family:'cas-096'},
  'SEF-N043-1':{auction:'Partenaire : 1♦',h:9,shape:'3-3-3-4',answer:'1SA',family:'cas-099'},
  'SEF-V49-005':{auction:'Partenaire : 1♣',h:7,shape:'2-4-5-2',answer:'1♥',family:'v49-005'},
  'SEF-V49-006':{auction:'Partenaire : 1♣',h:14,shape:'2-4-5-2',answer:'1♦',family:'v49-006'},
  'SEF-V426-001':{auction:'Partenaire : 1♣',h:8,shape:'4-2-5-2',answer:'1♠',family:'v426-cas-001'},
  'SEF-V426-002':{auction:'Partenaire : 1♣',h:13,shape:'4-2-5-2',answer:'1♦',family:'v426-cas-002'},
  'SEF-N088-1':{auction:'Partenaire : 1SA',h:5,shape:'3-3-3-4',answer:'Passe',family:'cas-140'},
  'SEF-N089-2':{auction:'Partenaire : 1SA',h:4,shape:'3-3-5-2',answer:'Passe',family:'cas-141'}
});
const POINTS={A:4,R:3,D:2,V:1};
const SUITS=['♠','♥','♦','♣'];
function inspect(catalog){
  if(catalog.length!==1523)throw Error('Catalogue SEF attendu : 1523 QCM');
  const byId=new Map(catalog.map(q=>[q.id,q]));
  if(byId.size!==catalog.length)throw Error('IDs origine non uniques');
  const used=new Set(),groups={};
  for(const [group,ids] of Object.entries(SOURCE_GROUPS)){
    groups[group]=ids.map(id=>{
      if(used.has(id))throw Error('ID répété '+id);
      used.add(id);
      const q=byId.get(id),e=EXPECTED[id];
      if(!q||!e)throw Error('Original absent '+id);
      const shape=q.hand.map(cards=>cards.length).join('-');
      const h=q.hand.flat().reduce((n,c)=>n+(POINTS[c]||0),0);
      if(q.auction.length!==1||q.auction[0]!==e.auction||
        q.answer!==e.answer||q.caseFamily!==e.family||
        q.h!==e.h||h!==q.h||shape!==e.shape||
        q.shape.join('-')!==shape||q.hand.flat().length!==13)
        throw Error('Source différente de la revue V : '+id);
      if(!q.choices.includes(q.answer)||!q.explain||!q.context)
        throw Error('QCM incomplet : '+id);
      return {id,caseFamily:q.caseFamily,h:q.h,shape:q.shape,
        hand:Object.fromEntries(q.hand.map((v,i)=>[SUITS[i],v.join('')])),
        auction:q.auction.slice(),answer:q.answer,choices:q.choices.slice(),
        explain:q.explain,difficulty:q.difficulty};
    });
  }
  const four=groups.oneClubFiveDiamondsFourMajor;
  if(four.some(q=>q.shape[2]!==5||(q.shape[0]!==4&&q.shape[1]!==4)))
    throw Error('Les 4 cas de contraste ne portent pas sur 5♦+4M');
  const byMajor={heart:four.filter(q=>q.shape[1]===4),
    spade:four.filter(q=>q.shape[0]===4)};
  for(const variants of Object.values(byMajor))
    if(variants.length!==2||!variants.some(q=>q.answer==='1♦')||
      !variants.some(q=>q.answer==='1♥'||q.answer==='1♠'))
      throw Error('Contraste faible / forte incomplet');
  return {schema:'QPJB_V2_V_CASES_SOURCE_1',status:'READ_ONLY_ORIGINAL_SOURCE',
    catalogQuestions:catalog.length,reviewedCases:used.size,groups,
    contrastGrid:{
      weakHearts:'SEF-V49-005',strongHearts:'SEF-V49-006',
      weakSpades:'SEF-V426-001',strongSpades:'SEF-V426-002'},
    reviewVerdicts:{
      oneDiamondNoMajor:'CONTRASTE_LONGUEUR_5D_CONTRE_3D_A_CONSERVER',
      oneClubFiveDiamondsFourMajor:'MATRICE_2X2_FORCE_ET_MAJEURE_A_PRESERVER',
      oneNoTrumpPass:'CONTRASTE_FAIBLESSE_MINEURE_5E_A_CONSERVER'
    },
    meaning:'Le groupe quatre QCM oppose le choix de 1M et de 1♦ selon la force, pour les deux majeures',
    originalSourcesUnchanged:true,answerModified:false,
    pedagogicalMasteryInferred:false,publicRuntimeWired:false};
}
function exposures(sessions,report){
  const ids=new Set(Object.values(SOURCE_GROUPS).flat());
  const occurrences=Object.fromEntries([...ids].map(id=>[id,[]]));
  for(let i=0;i<sessions.length;i++)
    for(const q of sessions[i]){
      if(ids.has(q.id))occurrences[q.id].push(i+1);
    }
  const contrast=report.contrastGrid;
  const pairs={
    hearts:[contrast.weakHearts,contrast.strongHearts],
    spades:[contrast.weakSpades,contrast.strongSpades]
  };
  return {occurrences,
    seenAllFour:Object.values(contrast).every(id=>occurrences[id].length>0),
    majorPairsSeen:Object.fromEntries(Object.entries(pairs).map(([major,items])=>
      [major,items.every(id=>occurrences[id].length>0)])),
    anyTwoSameSession:Object.fromEntries(Object.entries(SOURCE_GROUPS).map(([group,items])=>
      [group,sessions.some(deck=>items.filter(id=>deck.some(q=>q.id===id)).length>=2)]))};
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations(),report=inspect(catalog);
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const s=F.simulateV2(catalog,annotations,{sessions:45,seed,profile});
      const x=exposures(s.sessions,report);
      rows.push({profile,seed,exposure:x,
        independentFamilies:s.metrics.uniqueFamilies,
        scheduledRecalls:s.metrics.revision.scheduledDueRecalls});
    }
  return {schema:'QPJB_V2_V_EXPOSITION_9_SCENARIOS_1',
    scenarios:rows.length,questionsPerScenario:450,
    catalogQuestions:catalog.length,
    cases:report.reviewedCases,
    fourContrastCasesSeenRange:[
      Math.min(...rows.map(r=>Object.values(report.contrastGrid).filter(id=>r.exposure.occurrences[id].length).length)),
      Math.max(...rows.map(r=>Object.values(report.contrastGrid).filter(id=>r.exposure.occurrences[id].length).length))],
    scenariosShowingBothForHearts:rows.filter(r=>r.exposure.majorPairsSeen.hearts).length,
    scenariosShowingBothForSpades:rows.filter(r=>r.exposure.majorPairsSeen.spades).length,
    anySameSessionContrast:rows.some(r=>r.exposure.anyTwoSameSession.oneClubFiveDiamondsFourMajor),
    rows,masteryInferred:false,selectionChanged:false,publicRuntimeWired:false};
}
module.exports={SOURCE_GROUPS,EXPECTED,inspect,exposures,matrix};
if(require.main===module){
  const catalog=F.loadCatalog();
  const output=process.argv.includes('--matrix')?matrix():inspect(catalog);
  process.stdout.write(JSON.stringify(output,null,2)+'\n');
}
