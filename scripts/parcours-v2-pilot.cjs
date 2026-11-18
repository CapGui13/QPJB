'use strict';
// QPJB V2-F — simulateur local, non branché à la plateforme ni à ses sauvegardes.
// Les « objectifs » ne valent ni compétences validées ni preuves de maîtrise.
const fs=require('node:fs');
const path=require('node:path');
const P=require('../quizz-parcours.js');
const ROOT=path.resolve(__dirname,'..');
const STANDARD_OPENINGS=['1♣','1♦','1♥','1♠','1SA'];
const STAGE_START={1:7,2:11,3:15,4:19,5:23};
const SA_STAGE={
  'sa:stayman_2sa_reponses':3,
  'sa:texas_majeur_2sa_fit':3,
  'sa:texas_trefle_1sa_modulation':4,
  'sa:quantitatif_2sa':4,
  'sa:texas_majeur_1sa_sans_fit':2,
  'sa:texas_carreau_1sa':4,
  'sa:texas_trefle_2sa':4,
  'sa:gambling_3sa_passe_corrige':5
};
function readJson(name){return JSON.parse(fs.readFileSync(path.join(ROOT,'Docs',name),'utf8'))}
function loadCatalog(){
  const html=fs.readFileSync(path.join(ROOT,'quizz.html'),'utf8');
  const tag='<script id="training-data" type="application/json">';
  const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
  if(start<0||end<0)throw Error('Catalogue Quiz SEF absent');
  return JSON.parse(html.slice(start+tag.length,end)).exercises;
}
function loadAnnotations(){
  const sa=readJson('PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json');
  const stayman=readJson('PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json');
  if(sa.assignments.length!==14||stayman.assignments.length!==65)
    throw Error('Périmètre des classifications candidates modifié');
  const entries=new Map();
  for(const x of sa.assignments){
    if(entries.has(x.id))throw Error('Doublon SA');
    entries.set(x.id,{concept:x.candidateSkill,stage:SA_STAGE[x.candidateSkill]});
  }
  const stageByKey=new Map(stayman.skills.map(x=>[x.id,x.stageCandidate]));
  for(const x of stayman.assignments){
    if(entries.has(x.id))throw Error('Doublon SA / Stayman: '+x.id);
    entries.set(x.id,{concept:'stayman:'+x.candidateSkill,
      stage:stageByKey.get(x.candidateSkill)});
  }
  if(entries.size!==79||[...entries.values()].some(x=>!Number.isInteger(x.stage)))
    throw Error('Métadonnées candidates invalides');
  return entries;
}
function hash(text){
  let h=2166136261;
  for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function family(q){return String(q.caseFamily||q.id)}
function roleOpening(q){
  if(q.theme==='ouv')return 'ouv:'+q.answer;
  if(['mineur','majeur','sa'].includes(q.theme)){
    const line=(q.auction||[]).find(x=>String(x).startsWith('Partenaire : 1'));
    const m=line&&String(line).match(/Partenaire : (1[♣♦♥♠]|1SA)/);
    if(m)return 'rep:'+m[1];
  }
  return '';
}
function concept(q,annotations){
  return annotations.get(q.id)?.concept||P.microKey(q)||'rubrique:'+q.theme;
}
function stage(q,annotations){
  const entry=annotations.get(q.id);
  return entry?entry.stage:null;
}
function newState(seed=13){
  if(!Number.isInteger(seed)||seed<0)throw Error('seed entier positif attendu');
  return {seed,history:Object.create(null),families:Object.create(null),
    concepts:Object.create(null),recentOpening:Object.create(null),session:0,
    reviewQueue:Object.create(null),reviewSupport:null,reviewEvents:[],
    lastSelection:[]};
}
// N'attribuer un rappel ciblé qu'aux catégories vérifiables et possédant au
// moins deux familles indépendantes. Une rubrique entière n'est PAS une notion.
function reviewEligible(q,annotations){
  return !!annotations.get(q.id)||!!P.microKey(q);
}
function ensureReviewSupport(exercises,state,annotations){
  if(state.reviewSupport)return;
  const familySets=new Map();
  for(const q of exercises){
    if(!reviewEligible(q,annotations))continue;
    const k=concept(q,annotations);
    if(!familySets.has(k))familySets.set(k,new Set());
    familySets.get(k).add(family(q));
  }
  state.reviewSupport=Object.fromEntries([...familySets].map(([k,v])=>[k,v.size]));
}
function pendingReviews(state,session){
  return Object.entries(state.reviewQueue).filter(([key,entry])=>
    (state.reviewSupport||{})[key]>=2&&entry.due<=session&&
    entry.lastSession<session-1&&
    (!state.concepts[key]||state.concepts[key].lastSession<session-1))
    .map(([key,entry])=>({key,...entry}));
}
function available(q,session,annotations){
  const intro=P.INTRO[q.theme];
  if(!Number.isInteger(intro)||session<intro||!Number.isInteger(q.difficulty))return false;
  const v=stage(q,annotations);
  return v===null||session>=STAGE_START[v];
}
function desiredSlots(session){
  if(session===0)return ['ouv:1♣','ouv:1♦','ouv:1♥','ouv:1♠','ouv:1SA',
    'ouv:Passe','ouv','ouv','ouv','ouv'];
  if(session<=3){
    const openCycle=[['ouv:1♣','ouv:1♦'],['ouv:1♥','ouv:1♠'],
      ['ouv:1SA','ouv:Passe']][session-1];
    return [openCycle[0],'rep:1♣',openCycle[1],'rep:1♦',
      'rep:1♥','rep:1♠',session>=2?'revision':'any',
      'any','any','any'];
  }
  // Une rotation explicite : jamais un créneau de 1♣ imposé 65 séances.
  const openingCycle=['1♣','1♦','1♥','1♠','1SA','Passe'];
  const slots=['ouv:'+openingCycle[(session-4)%openingCycle.length],
    session%2?'rep:1♣':'rep:1♦',
    session%2?'rep:1♠':'rep:1♥'];
  slots.push(session%3===0?'rep:1SA':'any');
  // Les créneaux de révision visent une AUTRE famille de la même notion.
  if(session>=2)slots.push('revision');
  if(session>=10)slots.push('revision');
  slots.push('any','any','any','any','any');
  return slots.slice(0,10);
}
function score(q,state,session,inDeck,annotations){
  const key=concept(q,annotations),c=state.concepts[key],rec=state.history[q.id];
  const fam=state.families[family(q)],group=roleOpening(q);
  const themeCount=inDeck.filter(x=>x.theme===q.theme).length;
  const groupCount=inDeck.filter(x=>roleOpening(x)===group).length;
  const answerCount=inDeck.filter(x=>x.answer===q.answer).length;
  const elapsed=fam?session-fam.lastSession:100;
  // On n'utilise pas les degrés SEF comme verrous : uniquement une préférence.
  const target=Math.min(5,1+Math.floor(session/12));
  let value=110-10*Math.abs(q.difficulty-target)-24*themeCount
    -21*groupCount-16*answerCount;
  if(!rec)value+=40;
  else value+=rec.due<=session?4:-85;
  if(elapsed<=2)value-=120;
  else if(elapsed<=4)value-=45;
  if(group.startsWith('ouv:'))value-=24*(state.recentOpening[group]||0);
  if(c){
    if(session>=c.due&&c.lastResult==='wrong')value+=60;
    if(session-c.lastSession<=1)value-=35;
  }
  const rank=hash(q.id+'|'+state.seed+'|'+session);
  return value+rank/4294967296;
}
function matches(q,slot){return slot==='any'||slot==='revision'||
  (slot==='ouv'&&q.theme==='ouv')||roleOpening(q)===slot}
function select(exercises,state,annotations,n=10){
  const session=state.session;
  ensureReviewSupport(exercises,state,annotations);
  const candidates=exercises.filter(q=>available(q,session,annotations));
  const chosen=[],ids=new Set(),families=new Set();
  state.lastSelection=[];
  const slots=desiredSlots(session).slice(0,n);
  while(slots.length<n)slots.push('any');
  for(const slot of slots){
    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));
    if(!pool.length)break;
    if(slot==='revision'){
      // Rappel après échec (2 séances) OU réussite (5, puis 8, 16...).
      // Rechercher une AUTRE famille de la même catégorie candidate.
      const alreadyTargeted=new Set(state.lastSelection
        .filter(x=>x.source==='scheduled-recall').map(x=>x.concept));
      const due=pool.filter(q=>{
        const k=concept(q,annotations),c=state.reviewQueue[k],recent=state.concepts[k];
        return !alreadyTargeted.has(k)&&c&&c.due<=session&&c.lastSession<session-1&&
          (!recent||recent.lastSession<session-1)&&
          c.lastFamily!==family(q)&&
          (state.reviewSupport[k]||0)>=2;
      });
      if(due.length)pool=due;
      else continue; // aucune révision explicitement éligible
    }else if(slot!=='any'){
      const specific=pool.filter(q=>matches(q,slot));
      // Quand le sous-groupe est épuisé, élargir la sélection plutôt que
      // recycler sans fin le même type d'ouverture ou la même famille.
      const unusedSpecific=specific.filter(q=>!state.families[family(q)]);
      if(unusedSpecific.length)pool=unusedSpecific;
      else if(specific.length&&!pool.some(q=>!state.families[family(q)]))pool=specific;
    }
    const globallyNew=pool.filter(q=>!state.families[family(q)]);
    if(globallyNew.length)pool=globallyNew;
    else {
      const notRecent=pool.filter(q=>{
        const f=state.families[family(q)];
        return !f||session-f.lastSession>=3;
      });
      if(notRecent.length)pool=notRecent;
    }
    if(slot==='revision'){
      pool.sort((a,b)=>{
        const A=state.reviewQueue[concept(a,annotations)];
        const B=state.reviewQueue[concept(b,annotations)];
        return (B.lastResult==='wrong'?1:0)-(A.lastResult==='wrong'?1:0)||
          A.due-B.due||
          score(b,state,session,chosen,annotations)-score(a,state,session,chosen,annotations)||
          a.id.localeCompare(b.id);
      });
    }else pool.sort((a,b)=>score(b,state,session,chosen,annotations)
      -score(a,state,session,chosen,annotations)||a.id.localeCompare(b.id));
    const picked=pool[0];
    chosen.push(picked);
    state.lastSelection.push({id:picked.id,concept:concept(picked,annotations),
      source:slot==='revision'?'scheduled-recall':'practice'});
    ids.add(picked.id);families.add(family(picked));
  }
  // Un créneau de révision vide ne doit jamais diminuer la taille de séance.
  while(chosen.length<n){
    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));
    if(!pool.length)break;
    const globallyNew=pool.filter(q=>!state.families[family(q)]);
    if(globallyNew.length)pool=globallyNew;
    else {
      const notRecent=pool.filter(q=>!state.families[family(q)]||
        session-state.families[family(q)].lastSession>=3);
      if(notRecent.length)pool=notRecent;
    }
    pool.sort((a,b)=>score(b,state,session,chosen,annotations)
      -score(a,state,session,chosen,annotations)||a.id.localeCompare(b.id));
    const picked=pool[0];ids.add(picked.id);families.add(family(picked));chosen.push(picked);
    state.lastSelection.push({id:picked.id,concept:concept(picked,annotations),
      source:'practice'});
  }
  return chosen;
}
function recordSession(state,deck,answers,annotations){
  if(deck.length!==answers.length)throw Error('Taille réponse/séance incohérente');
  if(new Set(deck.map(q=>family(q))).size!==deck.length)
    throw Error('Famille répétée au cours de la séance');
  const s=state.session,credited=new Set(),conceptOutcomes=new Map();
  const previousPractice=Object.fromEntries(Object.entries(state.concepts)
    .map(([key,entry])=>[key,entry.lastSession]));
  for(let i=0;i<deck.length;i++){
    const q=deck[i],ok=answers[i]===true,co=concept(q,annotations),fam=family(q);
    const old=state.history[q.id];
    const c=state.concepts[co];
    const prior=conceptOutcomes.get(co);
    const scheduled=state.lastSelection.some(p=>p.id===q.id&&
      p.source==='scheduled-recall');
    if(!prior){
      conceptOutcomes.set(co,{correct:ok,family:fam,questionId:q.id,
        families:[fam],scheduledFamily:scheduled?fam:null});
    }else{
      prior.families.push(fam);
      if(scheduled)prior.scheduledFamily=fam;
      if(!ok&&prior.correct){prior.correct=false;prior.questionId=q.id}
    }
    state.history[q.id]={lastSession:s,attempts:(old?.attempts||0)+1,due:s+(ok?5:2)};
    state.families[fam]={lastSession:s};
    // Une seule observation pédagogique *fictive* par notion et par séance.
    if(!credited.has(co)){
      const attempts=(c?.attempts||0)+1;
      state.concepts[co]={lastSession:s,lastResult:ok?'correct':'wrong',
        attempts,errors:(c?.errors||0)+(ok?0:1),due:s+(ok?5:2)};
      credited.add(co);
    }else if(!ok){
      // Une erreur prime sur une réussite dans la même séance.
      state.concepts[co].lastResult='wrong';
      state.concepts[co].due=s+2;
      state.concepts[co].errors++;
    }
  }
  // Les rappels concernent un seul résultat par catégorie et par séance :
  // un échec prime sur une réussite, et les cas isolés restent non évaluables.
  for(const [key,answer] of conceptOutcomes){
    if((state.reviewSupport||{})[key]<2)continue;
    const previous=state.reviewQueue[key],correct=answer.correct;
    const recallFamily=answer.scheduledFamily||
      answer.families.find(f=>f!==previous?.lastFamily);
    const originFamily=recallFamily||answer.family;
    const isDue=previous&&previous.due<=s&&previous.lastSession<s-1&&
      (previousPractice[key]===undefined||previousPractice[key]<s-1)&&
      previous.lastFamily!==originFamily;
    if(!previous){
      state.reviewQueue[key]={due:s+(correct?5:2),lastSession:s,
        lastFamily:originFamily,lastResult:correct?'correct':'wrong',
        interval:correct?5:2,round:0};
    }else if(isDue){
      const round=correct?previous.round+1:0;
      const interval=correct?Math.min(24,round===1?8:round===2?16:24):2;
      state.reviewEvents.push({session:s,concept:key,questionId:answer.questionId,
        source:answer.scheduledFamily?'scheduled':'incidental',
        previousResult:previous.lastResult,result:correct?'correct':'wrong',
        delay:s-previous.lastSession});
      state.reviewQueue[key]={due:s+interval,lastSession:s,
        lastFamily:originFamily,lastResult:correct?'correct':'wrong',interval,round};
    }else if(!correct){
      // Toute nouvelle erreur avance le rappel, sans attendre l'ancien délai.
      state.reviewQueue[key]={due:s+2,lastSession:s,lastFamily:originFamily,
        lastResult:'wrong',interval:2,round:0};
    }
  }
  const openings=Object.create(null);
  for(const q of deck){
    const k=roleOpening(q);
    if(k.startsWith('ouv:'))openings[k]=(openings[k]||0)+1;
  }
  const next=Object.create(null);
  for(const k of Object.keys(state.recentOpening))next[k]=state.recentOpening[k]*0.65;
  for(const k of Object.keys(openings))next[k]=(next[k]||0)+openings[k];
  state.recentOpening=next;
  state.session++;
}
function simulatedAnswers(deck,session,seed,profile='balanced'){
  return deck.map(q=>{
    const r=hash('answer|'+seed+'|'+session+'|'+q.id)%100;
    const weak=profile==='fragile-mineures'&&
      (q.theme==='mineur'||q.theme==='ouv'&&['1♣','1♦'].includes(q.answer));
    const threshold=profile==='facile'?97:weak?60:83;
    return r<threshold;
  });
}
function metrics(sessions){
  const all=sessions.flat(),unique=new Set(all.map(q=>q.id));
  const fams=new Set(all.map(family));
  const opening={},responses={},themes={};
  for(const q of all)themes[q.theme]=(themes[q.theme]||0)+1;
  for(const q of all.filter(x=>x.theme==='ouv'))
    opening[q.answer]=(opening[q.answer]||0)+1;
  for(const q of all.filter(x=>['mineur','majeur','sa'].includes(x.theme))){
    const c=roleOpening(q);
    if(c)responses[c]=(responses[c]||0)+1;
  }
  const repeatedFamiliesInside=sessions.filter(deck=>
    new Set(deck.map(family)).size!==deck.length).length;
  const overThreeSameAnswer=sessions.filter(deck=>
    Math.max(0,...Object.values(deck.reduce((m,q)=>
      (m[q.answer]=(m[q.answer]||0)+1,m),{})))>=4).length;
  return {sessionCount:sessions.length,questionCount:all.length,
    uniqueIds:unique.size,uniqueFamilies:fams.size,
    repeatedFamilySessions:repeatedFamiliesInside,
    sessionsWith4SameAnswer:overThreeSameAnswer,
    opening,responses,themes};
}
function simulateV2(exercises,annotations,options={}){
  const count=options.sessions??65,seed=options.seed??13;
  const state=newState(seed),sessions=[];
  let scheduledSlotsUsed=0, eligibleErrorSessions=0,eligibleSuccessSessions=0;
  for(let s=0;s<count;s++){
    ensureReviewSupport(exercises,state,annotations);
    const pending=pendingReviews(state,s);
    const open=q=>available(q,s,annotations)&&
      (!state.families[family(q)]||
        state.families[family(q)].lastSession<s-2)&&
      (!state.concepts[concept(q,annotations)]||
        state.concepts[concept(q,annotations)].lastSession<s-1);
    const viable=pending.filter(item=>exercises.some(q=>
      concept(q,annotations)===item.key&&
      family(q)!==item.lastFamily&&open(q)));
    if(viable.some(item=>item.lastResult==='wrong'))eligibleErrorSessions++;
    if(viable.some(item=>item.lastResult==='correct'))eligibleSuccessSessions++;
    const deck=select(exercises,state,annotations,10);
    if(deck.length!==10)throw Error('Séance V2 incomplète '+s+': '+deck.length);
    sessions.push(deck);
    scheduledSlotsUsed+=state.lastSelection.filter(x=>x.source==='scheduled-recall').length;
    recordSession(state,deck,simulatedAnswers(deck,s,seed,options.profile),annotations);
  }
  const reviewEvents=state.reviewEvents;
  const targeted=reviewEvents.filter(x=>x.source==='scheduled');
  return {sessions,state,metrics:{...metrics(sessions),revision:{
    scheduledSlotsUsed,actualDueRecalls:reviewEvents.length,
    scheduledDueRecalls:targeted.length,
    failedRecallOrigins:reviewEvents.filter(x=>x.previousResult==='wrong').length,
    successfulRecallOrigins:reviewEvents.filter(x=>x.previousResult==='correct').length,
    dueErrorOpportunitySessions:eligibleErrorSessions,
    dueSuccessOpportunitySessions:eligibleSuccessSessions,
    candidateOrContextQueueSize:Object.keys(state.reviewQueue).length,
    unsupportedSingleFamilyCategories:Object.keys(state.reviewSupport).filter(k=>
      state.reviewSupport[k]<2).length
  }}};
}
function simulateV1(exercises,options={}){
  const count=options.sessions??65,seed=options.seed??13;
  const state=P.empty(),sessions=[];
  for(let s=0;s<count;s++){
    const deck=P.start(state,exercises);
    if(deck.length!==10)throw Error('Séance V1 incomplète '+s);
    sessions.push(deck);
    const results=simulatedAnswers(deck,s,seed,options.profile);
    for(let j=0;j<deck.length;j++)
      if(!P.record(state,deck[j],results[j]?'correct':'wrong',j,
        results[j]?deck[j].answer:null,false,false))
        throw Error('Enregistrement V1 refusé: '+s+':'+j);
    if(!P.finish(state))throw Error('Séance V1 non terminée: '+s);
  }
  return {sessions,state,metrics:metrics(sessions)};
}
module.exports={STANDARD_OPENINGS,STAGE_START,SA_STAGE,loadCatalog,loadAnnotations,
  family,roleOpening,concept,newState,available,desiredSlots,select,recordSession,
  simulatedAnswers,metrics,simulateV1,simulateV2};
if(require.main===module){
  const args=process.argv.slice(2),json=args.includes('--json');
  const sessionsArg=args.find(x=>x.startsWith('--sessions='));
  const seedArg=args.find(x=>x.startsWith('--seed='));
  const n=sessionsArg?Number(sessionsArg.slice(11)):65;
  const seed=seedArg?Number(seedArg.slice(7)):13;
  const profile=args.includes('--fragile-mineures')?'fragile-mineures':'balanced';
  if(!Number.isInteger(n)||n<1||n>100||!Number.isInteger(seed)||seed<0)
    throw Error('Options: --sessions=1..100 --seed=entier >=0 --json --fragile-mineures');
  const catalog=loadCatalog(),annotations=loadAnnotations(),options={sessions:n,seed,profile};
  const old=simulateV1(catalog,options),pilot=simulateV2(catalog,annotations,options);
  const report={type:'SIMULATION_SYNTHETIQUE_NON_ELEVES',
    reference:'V1.10 production (exécutée uniquement localement)',
    pilot:'V2-F prototype déconnecté, taxonomie candidate non validée',
    assumptions:{sessions:n,questionsPerSession:10,seed,profile,
      correctResults:'déterministes et fictifs, pas des mesures d élèves'},
    catalogSize:catalog.length,annotatedQcm:annotations.size,
    V1:old.metrics,V2pilot:pilot.metrics,
    firstThreeSessions:pilot.sessions.slice(0,3).map(deck=>deck.map(q=>({
      id:q.id,theme:q.theme,answer:q.answer,openingContext:roleOpening(q)})))};
  if(args.includes('--check')){
    if(pilot.metrics.repeatedFamilySessions!==0||
      pilot.metrics.questionCount!==n*10)throw Error('Invariant du pilote violé');
    if(n>=30){
      const o=pilot.metrics.opening;
      if((o['1♣']||0)<5||(o['1♦']||0)<5)
        throw Error('Ouvertures mineures déséquilibrées');
      const keyOpenings=STANDARD_OPENINGS.map(k=>o[k]||0);
      if(Math.max(...keyOpenings)-Math.min(...keyOpenings)>12)
        throw Error('Concentration excessive sur un type d ouverture');
      const responseKeys=['rep:1♣','rep:1♦','rep:1♥','rep:1♠','rep:1SA'];
      const responseCounts=responseKeys.map(k=>pilot.metrics.responses[k]||0);
      if(Math.min(...responseCounts)<10||
        Math.max(...responseCounts)-Math.min(...responseCounts)>20)
        throw Error('Réponses trop peu diversifiées');
      if(Object.keys(pilot.metrics.themes).length!==P.ROADMAP.length)
        throw Error('Toutes les rubriques devraient être rencontrées');
      if(pilot.metrics.uniqueFamilies<n*9)
        throw Error('Réemploi excessif des familles sur '+n+' séances');
    }
  }
  if(args.includes('--summary'))
    process.stdout.write(JSON.stringify({assumptions:report.assumptions,
      catalogSize:report.catalogSize,annotatedQcm:report.annotatedQcm,
      V1:report.V1,V2pilot:report.V2pilot})+'\n');
  else process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
