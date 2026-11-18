'use strict';
/* QPJB V2-M — test conservateur, hors production.
 * Jamais de modification des scripts ou des sauvegardes d'apprenants.
 * V2-F reste le moteur de référence. V2-M n'intervient que pour corriger
 * une repetition inter-seances ou une seance objectivement trop homogene.
 */
const P=require('./parcours-v2-pilot.cjs');
const F=require('./parcours-v2-fondations.cjs');
const L=require('./parcours-v2-mix-l.cjs');
function newState(){
  return {injections:[],lastFoundation:'',lastSession:-1};
}
function tryImprove(deck,state,annotations,exercises,mapping,foundations,meta){
  const session=state.session,themeCount=Object.create(null);
  if(session<2||deck.length!==10)return {deck,improvement:null};
  const byId=new Map(exercises.map(q=>[q.id,q]));
  for(const q of deck)themeCount[q.theme]=(themeCount[q.theme]||0)+1;
  const oldThemes=Object.keys(themeCount).length;
  const selectedIds=new Set(deck.map(x=>x.id));
  const selectedFamilies=new Set(deck.map(P.family));
  const options=F.proposeFoundations(mapping,session,4)
    .map(x=>foundations.find(f=>f.id===x.id))
    .filter(f=>f&&f.coverageStatus==='CANDIDATE'&&
      (f.id!==meta.lastFoundation||session-meta.lastSession>2));
  const swaps=[];
  for(let i=6;i<10;i++){
    const old=deck[i],slot=state.lastSelection[i];
    if(!slot||slot.source!=='practice'||themeCount[old.theme]<2)continue;
    const previouslySeen=!!state.families[P.family(old)];
    // En pratique, V2-F est deja tres diversifie : on evite de forcer
    // un exercice juste parce qu'une fondation est presente dans la liste.
    if(!previouslySeen&&oldThemes>4)continue;
    for(const f of options)for(const example of f.evidence){
      const q=byId.get(example.id);
      if(!q||selectedIds.has(q.id)||selectedFamilies.has(P.family(q))||
        state.families[P.family(q)]||themeCount[q.theme]||
        !P.available(q,session,annotations)||
        q.difficulty>Math.min(5,2+Math.floor(session/12)))continue;
      // Eviter de perturber une notion qui a deja un rappel en attente.
      const projected=deck.reduce((counts,entry,index)=>{
        if(index===i)entry=q;
        counts[entry.answer]=(counts[entry.answer]||0)+1;
        return counts;
      },Object.create(null));
      // Le melange ne doit pas recreer le probleme de quatre reponses identiques.
      if(Math.max(...Object.values(projected))>=4)continue;
      const concept=P.concept(q,annotations);
      if(state.reviewQueue[concept]?.due<=session)continue;
      swaps.push({idx:i,old,q,foundation:f,
        previouslySeen,themeCount:themeCount[old.theme],
        score:(previouslySeen?100:0)+themeCount[old.theme]*10-
          q.difficulty+(meta.injections.filter(x=>x.foundation===f.id).length*-4)});
    }
  }
  if(!swaps.length)return {deck,improvement:null};
  swaps.sort((a,b)=>b.score-a.score||
    a.idx-b.idx||a.foundation.id.localeCompare(b.foundation.id)||
    a.q.id.localeCompare(b.q.id));
  const best=swaps[0],result=deck.slice();
  result[best.idx]=best.q;
  if(new Set(result.map(P.family)).size!==10)throw Error('Doublon de famille V2-M');
  if(new Set(result.map(q=>q.id)).size!==10)throw Error('Doublon ID V2-M');
  if(new Set(result.map(q=>q.theme)).size<=oldThemes)
    throw Error('Aucun gain de diversite locale V2-M');
  state.lastSelection[best.idx]={id:best.q.id,
    concept:P.concept(best.q,annotations),source:'practice'};
  meta.lastFoundation=best.foundation.id;
  meta.lastSession=session;
  const improvement={session,replacedSlot:best.idx,replacedId:best.old.id,
    replacedFamilyPreviouslySeen:best.previouslySeen,
    addedId:best.q.id,addedFoundation:best.foundation.id,
    themeGain:1,foundation:best.foundation.id,
    originalTheme:best.old.theme,newTheme:best.q.theme};
  meta.injections.push(improvement);
  return {deck:result,improvement};
}
function simulate(exercises,annotations,options={}){
  const {sessions=45,seed=13,profile='balanced'}=options;
  const mapping=F.load(),expansion=L.loadExpansion();
  const foundations=L.combinedFoundations(mapping,expansion);
  const byId=new Map(exercises.map(q=>[q.id,q]));
  for(const f of foundations)for(const e of f.evidence){
    const q=byId.get(e.id);
    if(!q||P.family(q)!==e.caseFamily||q.answer!==e.originalAnswer)
      throw Error('Famille candidate invalide '+e.id);
  }
  const state=P.newState(seed),meta=newState(),decks=[];
  for(let i=0;i<sessions;i++){
    const standard=P.select(exercises,state,annotations,10);
    const {deck}=tryImprove(standard,state,annotations,exercises,mapping,foundations,meta);
    if(deck.length!==10||new Set(deck.map(P.family)).size!==10)
      throw Error('Séance V2-M invalide '+i);
    decks.push(deck);
    P.recordSession(state,deck,P.simulatedAnswers(deck,i,seed,profile),annotations);
  }
  return {sessions:decks,state,meta,metrics:P.metrics(decks)};
}
function summarize(exercises,annotations,options={}){
  const base=P.simulateV2(exercises,annotations,options);
  const m=simulate(exercises,annotations,options);
  const measures=L.windowMetrics(base.sessions),change=L.windowMetrics(m.sessions);
  const x=z=>({
    uniqueFamilies:z.metrics.uniqueFamilies,
    coverageThemes:Object.keys(z.metrics.themes).length,
    targetedReviews:z.state.reviewEvents.filter(r=>r.source==='scheduled').length,
    averageThemesPerSession:z===base?measures.averageThemesPerSession:change.averageThemesPerSession,
    fourSameAnswerSessions:z===base?measures.sessionsWith4SameAnswer:change.sessionsWith4SameAnswer
  });
  return {baseline:x(base),experimental:x(m),injections:m.meta.injections};
}
module.exports={newState,tryImprove,simulate,summarize};
