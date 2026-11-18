'use strict';
/* Phase T : audit exhaustif par rubrique originale et contexte observable.
 * Aucune retouche de V2-F; ne jamais confondre la présence d'un thème
 * et le niveau d'acquisition d'une notion.
 */
const F=require('./parcours-v2-pilot.cjs');
const P=require('./parcours-v2-observatoire-p.cjs');
const EARLY=25;
const COMPETITIVE=['intervenir','contre','reponse_inter','apres_inter'];
const WINDOW_RANGES=[[1,5],[6,10],[11,15],[16,20],[21,25],[26,35],[36,45]];
function isReplyToCounter(q){return q.theme==='apres_inter'&&
  (q.auction||[]).some(a=>/^Partenaire : 1[♣♦♥♠]/.test(a))&&
  (q.auction||[]).some(a=>/^Adversaire : Contre/.test(a))}
function isOurIntervention(q){return q.theme==='intervenir'&&
  (q.auction||[]).some(a=>/^Adversaire : 1[♣♦♥♠]/.test(a))}
function classify(q,source){
  return {
    broadCompetition:COMPETITIVE.includes(q.theme),
    themeIntervention:q.theme==='intervenir',
    themeAfterIntervention:q.theme==='apres_inter',
    ourIntervention:isOurIntervention(q),
    replyToAdversaryCounter:isReplyToCounter(q),
    respondOurTakeoutDouble:q.theme==='contre'&&
      (q.auction||[]).some(a=>/^Partenaire : Contre/.test(a)),
    mappedOurIntervention:source.our.has(q.id),
    mappedReplyToCounter:source.reply.has(q.id)
  }
}
function sources(mapping=P.load()){
  if(mapping.publicRuntimeWired!==false||mapping.proposedAxes!==16)
    throw Error('Source P attendue pour le contraste lecture seule');
  const f=id=>new Set(mapping.axes.find(x=>x.id===id)?.sourceIds||[]);
  const our=f('fondation:intervention'),reply=f('fondation:reponse_contre_adverse');
  if(our.size!==13||reply.size!==12)throw Error('P non correspondante');
  return {our,reply};
}
function trace(sessions,catalog,index=sources()){
  if(!sessions.length||sessions.some(d=>d.length!==10))throw Error('Séance invalide');
  const selected=sessions.flat();
  const whole=new Set(catalog.map(q=>q.id));
  if(selected.some(q=>!whole.has(q.id)))throw Error('ID inconnu');
  const keys=Object.keys(classify(selected[0],index));
  const totals=Object.fromEntries(keys.map(x=>[x,0]));
  const first=Object.fromEntries(keys.map(x=>[x,null]));
  const perSession=sessions.map((deck,i)=>{
    const counts=Object.fromEntries(keys.map(x=>[x,0]));
    for(const q of deck)for(const [key,present] of Object.entries(classify(q,index))){
      if(!present)continue;
      totals[key]++;counts[key]++;
      if(first[key]===null)first[key]=i+1;
    }
    return {session:i+1,counts,
      differentThemes:new Set(deck.map(x=>x.theme)).size,
      differentFamilies:new Set(deck.map(F.family)).size};
  });
  const windows=WINDOW_RANGES.filter(([from])=>from<=sessions.length).map(([from,to])=>{
    const selected=perSession.slice(from-1,Math.min(to,sessions.length));
    const counts=Object.fromEntries(keys.map(k=>[k,selected.reduce((n,s)=>n+s.counts[k],0)]));
    return {from,to:Math.min(to,sessions.length),counts};
  });
  const eligibleCheckpoints=[11,13,15,17,21,25].filter(x=>x<=sessions.length).map(s=>{
    const available=catalog.filter(q=>F.available(q,s-1,new Map()));
    // Attention: sans les 79 annotations précises, l'éligibilité peut
    // surestimer les situations spécialisées. Cette mesure n'est qu'un
    // plafond exploratoire. Les métriques de tirages n'ont pas ce biais.
    const counts=Object.fromEntries(keys.map(k=>[k,
      new Set(available.filter(q=>classify(q,index)[k]).map(F.family)).size]));
    return {session:s,eligibleFamilyUpperBound:counts,
      qualified:'Plafond hors contraintes de stage des 79 annotations'};
  });
  const early=perSession.slice(0,EARLY);
  return {schema:'QPJB_V2_T_FULL_CATALOG_TRACE_20261118_1',
    status:'READ_ONLY_SIMULATED',
    sessions:sessions.length,questions:selected.length,
    wholeCatalogQuestions:catalog.length,
    totals,firstSession:first,
    first25:Object.fromEntries(keys.map(k=>[k,early.reduce((n,s)=>n+s.counts[k],0)])),
    windows,eligibleCheckpoints,
    themesSeen:new Set(selected.map(q=>q.theme)).size,
    familiesSeen:new Set(selected.map(F.family)).size,
    originalDecksUnchanged:true,masteryInferred:false};
}
function matrix(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations(),index=sources();
  const rows=[];
  for(const profile of ['balanced','fragile-mineures','facile'])
    for(const seed of [13,29,47]){
      const r=F.simulateV2(catalog,annotations,{sessions:45,profile,seed});
      const audit=trace(r.sessions,catalog,index);
      rows.push({profile,seed,themes:audit.themesSeen,families:audit.familiesSeen,
        reviews:r.metrics.revision.scheduledDueRecalls,
        first:audit.firstSession,first25:audit.first25,
        windows:process.argv.includes('--detail')?audit.windows:undefined});
    }
  const range=fn=>[Math.min(...rows.map(fn)),Math.max(...rows.map(fn))];
  const keys=Object.keys(rows[0].first);
  const result={};
  for(const key of keys) {
    const observed=rows.map(r=>r.first[key]).filter(x=>x!==null);
    result[key]={
      firstSessionRange:observed.length?[Math.min(...observed),Math.max(...observed)]:null,
      scenariosNeverSeen:rows.length-observed.length,
      first25PresentationsRange:range(r=>r.first25[key])};
  }
  return {schema:'QPJB_V2_T_9_SCENARIOS_20261118_1',
    status:'SIMULATION_SYNTETIQUE_LECTURE_SEULE',
    scenarios:rows.length,sessionsPerScenario:45,questionsPerScenario:450,
    sourceQcmCount:catalog.length,themeFamiliesRange:range(r=>r.families),
    reviewCountRange:range(r=>r.reviews),
    all22ThemesEachRun:rows.every(r=>r.themes===22),
    coverage:result,rows,masteryInferred:false,publicRuntimeWired:false,
    decision:'Ne pas cibler une lacune à partir du seul sous-ensemble cartographié'};
}
module.exports={COMPETITIVE,WINDOW_RANGES,isReplyToCounter,isOurIntervention,classify,sources,trace,matrix};
if(require.main===module)process.stdout.write(JSON.stringify(matrix(),null,2)+'\n');
