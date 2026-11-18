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
    concepts:Object.create(null),recentOpening:Object.create(null),session:0};
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
  if(session<=3)return ['ouv:1♣','rep:1♣','ouv:1♦','rep:1♦',
    'rep:1♥','rep:1♠','ouv','ouv','any','any'];
  const slots=['ouv:1♣','rep:1♦','rep:1♥'];
  if(session>=3)slots.push('rep:1SA');
  // Les créneaux de révision visent une autre famille de la même notion.
  if(session>=6)slots.push('revision');
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
  const candidates=exercises.filter(q=>available(q,session,annotations));
  const chosen=[],ids=new Set(),families=new Set();
  const slots=desiredSlots(session).slice(0,n);
  while(slots.length<n)slots.push('any');
  for(const slot of slots){
    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));
    if(!pool.length)break;
    if(slot==='revision'){
      const due=pool.filter(q=>{
        const c=state.concepts[concept(q,annotations)];
        return c&&c.lastResult==='wrong'&&c.due<=session&&
          c.lastSession<session-1;
      });
      if(due.length)pool=due;
      else continue; // pas de révision artificielle
    }else if(slot!=='any'){
      const specific=pool.filter(q=>matches(q,slot));
      if(specific.length)pool=specific;
    }
    const notRecent=pool.filter(q=>{
      const f=state.families[family(q)];
      return !f||session-f.lastSession>=3;
    });
    if(notRecent.length)pool=notRecent;
    pool.sort((a,b)=>score(b,state,session,chosen,annotations)
      -score(a,state,session,chosen,annotations)||a.id.localeCompare(b.id));
    const picked=pool[0];
    chosen.push(picked);
    ids.add(picked.id);families.add(family(picked));
  }
  // Un créneau de révision vide ne doit jamais diminuer la taille de séance.
  while(chosen.length<n){
    let pool=candidates.filter(q=>!ids.has(q.id)&&!families.has(family(q)));
    if(!pool.length)break;
    const notRecent=pool.filter(q=>!state.families[family(q)]||
      session-state.families[family(q)].lastSession>=3);
    if(notRecent.length)pool=notRecent;
    pool.sort((a,b)=>score(b,state,session,chosen,annotations)
      -score(a,state,session,chosen,annotations)||a.id.localeCompare(b.id));
    const picked=pool[0];ids.add(picked.id);families.add(family(picked));chosen.push(picked);
  }
  return chosen;
}
function recordSession(state,deck,answers,annotations){
  if(deck.length!==answers.length)throw Error('Taille réponse/séance incohérente');
  if(new Set(deck.map(q=>family(q))).size!==deck.length)
    throw Error('Famille répétée au cours de la séance');
  const s=state.session,credited=new Set();
  for(let i=0;i<deck.length;i++){
    const q=deck[i],ok=answers[i]===true,co=concept(q,annotations),fam=family(q);
    const old=state.history[q.id];
    const c=state.concepts[co];
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
  const opening={},responses={};
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
    opening,responses};
}
function simulateV2(exercises,annotations,options={}){
  const count=options.sessions??65,seed=options.seed??13;
  const state=newState(seed),sessions=[];
  for(let s=0;s<count;s++){
    const deck=select(exercises,state,annotations,10);
    if(deck.length!==10)throw Error('Séance V2 incomplète '+s+': '+deck.length);
    sessions.push(deck);
    recordSession(state,deck,simulatedAnswers(deck,s,seed,options.profile),annotations);
  }
  return {sessions,state,metrics:metrics(sessions)};
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
  }
  if(args.includes('--summary'))
    process.stdout.write(JSON.stringify({assumptions:report.assumptions,
      catalogSize:report.catalogSize,annotatedQcm:report.annotatedQcm,
      V1:report.V1,V2pilot:report.V2pilot})+'\n');
  else process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
