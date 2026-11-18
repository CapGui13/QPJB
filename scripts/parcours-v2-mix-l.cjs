'use strict';
/*
 * QPJB V2-L : banc d'essai DECONNECTE du parcours public.
 * Superpose au maximum UN exercice de fondation par séance à la sélection
 * V2 existante et laisse intactes les révisions programmées.
 * Les rattachements restent candidats : aucune notation, aucun déblocage,
 * aucune maîtrise d'élève, aucune sauvegarde.
 */
const fs=require('node:fs'),path=require('node:path');
const P=require('./parcours-v2-pilot.cjs');
const F=require('./parcours-v2-fondations.cjs');
const EXTRA=path.join(__dirname,'../Docs/PARCOURS_V2_PHASE_L_EXTENSION_FONDATIONS_20261118.json');
function loadExpansion(){return JSON.parse(fs.readFileSync(EXTRA,'utf8'))}
function combinedFoundations(base=F.load(),extra=loadExpansion()){
  if(base.status!=='CANDIDATURE_DOCUMENTAIRE_NON_ACTIVE'||
     extra.status!=='CANDIDAT_DOCUMENTAIRE_NON_ACTIVE'||
     base.unlockEngineEnabled!==false||extra.unlockEngineEnabled!==false||
     base.gradingEnabled!==false||extra.gradingEnabled!==false||
     base.masteryInferenceEnabled!==false||extra.masteryInferenceEnabled!==false)
    throw Error('Activer la cartographie dans un moteur élève est interdit');
  const groups=new Map(extra.groups.map(g=>[g.foundationId,g]));
  for(const group of extra.groups){
    if(!base.foundations.some(f=>f.id===group.foundationId))
      throw Error('Fondation inconnue dans extension '+group.foundationId);
  }
  return base.foundations.map(f=>({
    ...f,evidence:[...f.evidence,...(groups.get(f.id)?.evidence||[])]
  }));
}
function newBlendState(){return {exposures:Object.create(null),
  perQuestion:Object.create(null),lastFoundation:'',lastSession:-1,
  injections:[]};}
function injectOne(deck,state,annotations,foundations,blend,options={}){
  const session=state.session;
  if(session<2||deck.length!==10)return {deck,injected:null};
  const byId=new Map(options.exercises.map(q=>[q.id,q]));
  const candidates=F.proposeFoundations(options.foundationMap,session,4)
    .map(x=>foundations.find(f=>f.id===x.id))
    // L'évaluation H indirecte, Texas mineur non arbitré et cas isolés
    // ne servent JAMAIS à forcer un exercice dans un parcours.
    .filter(x=>x&&x.coverageStatus==='CANDIDATE');
  const chosenIds=new Set(deck.map(q=>q.id));
  const chosenFamilies=new Set(deck.map(P.family));
  const maxDifficulty=Math.min(5,2+Math.floor(session/12));
  const qualified=[];
  for(const f of candidates){
    if(f.id===blend.lastFoundation&&session-blend.lastSession<=1)continue;
    for(const example of f.evidence){
      const q=byId.get(example.id);
      if(!q||chosenIds.has(q.id)||chosenFamilies.has(P.family(q))||
         !P.available(q,session,annotations)||q.difficulty>maxDifficulty)continue;
      const prior=state.families[P.family(q)];
      if(prior&&session-prior.lastSession<5)continue;
      qualified.push({foundation:f,q,used:blend.perQuestion[q.id]||0,
        foundationUsed:blend.exposures[f.id]||0});
    }
  }
  if(!qualified.length)return {deck,injected:null};
  qualified.sort((a,b)=>a.foundationUsed-b.foundationUsed||
    a.used-b.used||a.q.difficulty-b.q.difficulty||
    a.q.id.localeCompare(b.q.id));
  const selected=qualified[0];
  // Ne toucher ni aux créneaux explicites d'ouvertures/réponses du début,
  // ni aux rappels ciblés. Remplacement d'un créneau pratique de fin.
  const slots=[];
  for(let i=deck.length-1;i>=6;i--){
    if(state.lastSelection[i]?.source!=='practice')continue;
    slots.push(i);
  }
  if(!slots.length)return {deck,injected:null};
  const idx=slots.find(i=>deck[i].theme===selected.q.theme)??slots[0];
  const previous=deck[idx];
  const result=deck.slice();
  result[idx]=selected.q;
  if(new Set(result.map(P.family)).size!==10)throw Error('Famille double apres injection');
  if(new Set(result.map(q=>q.id)).size!==10)throw Error('ID double apres injection');
  state.lastSelection[idx]={id:selected.q.id,
    concept:P.concept(selected.q,annotations),source:'practice'};
  blend.exposures[selected.foundation.id]=(blend.exposures[selected.foundation.id]||0)+1;
  blend.perQuestion[selected.q.id]=(blend.perQuestion[selected.q.id]||0)+1;
  blend.lastFoundation=selected.foundation.id;blend.lastSession=session;
  const injected={session,foundation:selected.foundation.id,
    id:selected.q.id,replacedId:previous.id,replacedSlot:idx};
  blend.injections.push(injected);
  return {deck:result,injected};
}
function simulateBlend(exercises,annotations,options={}){
  const sessionCount=options.sessions??45,seed=options.seed??13;
  const profile=options.profile??'balanced';
  const base=F.load(),ext=loadExpansion();
  const foundations=combinedFoundations(base,ext);
  const byId=new Map(exercises.map(q=>[q.id,q]));
  for(const f of foundations)for(const x of f.evidence){
    const q=byId.get(x.id);
    if(!q||P.family(q)!==x.caseFamily||q.answer!==x.originalAnswer)
      throw Error('Cartographie hors catalogue '+x.id);
  }
  const blend=newBlendState(),state=P.newState(seed),sessions=[];
  for(let s=0;s<sessionCount;s++){
    let deck=P.select(exercises,state,annotations,10);
    deck=injectOne(deck,state,annotations,foundations,blend,
      {exercises,foundationMap:base}).deck;
    if(deck.length!==10||new Set(deck.map(P.family)).size!==10)
      throw Error('Séance mélangée invalide '+s);
    sessions.push(deck);
    P.recordSession(state,deck,P.simulatedAnswers(deck,s,seed,profile),annotations);
  }
  return {sessions,state,blend,metrics:P.metrics(sessions)};
}
function windowMetrics(sessions){
  const answers=deck=>{
    const count=Object.create(null);
    for(const q of deck)count[q.answer]=(count[q.answer]||0)+1;
    return Math.max(0,...Object.values(count));
  };
  const perSession=sessions.map((deck,index)=>({
    session:index,
    differentThemes:new Set(deck.map(q=>q.theme)).size,
    maximumIdenticalAnswers:answers(deck),
    differentFamilies:new Set(deck.map(P.family)).size
  }));
  const windows=[];
  for(let i=0;i<sessions.length;i+=5){
    const slice=sessions.slice(i,i+5),flat=slice.flat();
    windows.push({from:i,to:i+slice.length-1,
      differentThemes:new Set(flat.map(q=>q.theme)).size,
      differentFamilies:new Set(flat.map(P.family)).size,
      presentations:flat.length});
  }
  return {perSession,windows,
    averageThemesPerSession:Math.round(perSession.reduce((n,s)=>n+s.differentThemes,0)*100/perSession.length)/100,
    sessionsWith4SameAnswer:perSession.filter(s=>s.maximumIdenticalAnswers>=4).length,
    sessionsWith5SameAnswer:perSession.filter(s=>s.maximumIdenticalAnswers>=5).length
  };
}
module.exports={loadExpansion,combinedFoundations,newBlendState,injectOne,simulateBlend,windowMetrics};
