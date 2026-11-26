/* Recette M3 : node tests/coherence-progression-m3-bench.cjs [profil] [graine] [horizon]
   Le seul patch en mémoire est un bonus au classement, après tous les filtres.
   Aucune modification du moteur ou de la sélection déjà sauvegardée. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const profiles=['autonome','intermediaire','faible','cible','aide'];
const seeds=[11,47,103];
const horizons=[20,65,153,180];
function loadModule(source,req=()=>{throw Error('unexpected require')}){
  const module={exports:{}};
  new Function('module','require',source)(module,req);
  return module.exports;
}
function build({engine,metadata,plan,html,policy}){
  const meta=loadModule(metadata),sessionPlan=loadModule(plan),ranker=loadModule(policy);
  const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
  assert.equal(exercises.length,1879);
  assert.equal(Object.keys(meta.byId).length,1879);
  const hook='const ranked=candidates.map(q=>({q,v:score(q,category)}));';
  assert.equal(engine.split(hook).length,2);
  const patch=`const pedagogical = s>=65&&!explicitRecall ? new Map(pedagogy.rank({
      session:s+1,candidates,metadataById:prerequis.byId,history:state,
      selected,category:category||null
    }).map(x=>[x.id,x.delta])) : new Map();
    const ranked=candidates.map(q=>({q,v:score(q,category)+(pedagogical.get(q.id)||0)}));`;
  const guard='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
  assert.equal(engine.split(guard).length,2);
  const guarded=`for(const item of selected)if(!evaluate(item.exercise,state,e).eligible)
      throw Error('M3: exercice inéligible '+item.exercise.id+' S'+(s+1));
    if(passCount()>passCap)throw Error('M3: plafond Passe dépassé S'+(s+1));
    `+guard;
  function instantiate(source){
    source=source.replace(guard,guarded);
    const req=p=>p.includes('prerequis')?meta:p.includes('session-plan')?sessionPlan:assert.fail(p);
    const module={exports:{}};
    new Function('module','require','pedagogy',source)(module,req,ranker);
    return module.exports;
  }
  return {base:instantiate(engine),candidate:instantiate(engine.replace(hook,patch)),exercises,meta:meta.byId};
}
function random(seed,id,s){
  let x=seed^Math.imul(s,0x9e3779b1);
  for(const c of id)x=Math.imul(x^c.charCodeAt(0),16777619);
  x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;
  return (x>>>0)/4294967296;
}
function response(profile,seed,q,s,meta){
  const u=random(seed,q.id,s);
  const v=random(seed^0x7f4a,q.id,s);
  if(profile==='autonome')return ['correct',false,false];
  if(profile==='passe'&&q.theme==='ouv'&&q.answer==='Passe')return [u<.9?'wrong':'correct',false,false];
  let p=profile==='faible'?.58:profile==='intermediaire'?.23:profile==='cible'?
    (/^(chelem|competitif|rubensohl|michaels|multilandy)\./.test(meta[q.id].concept)?.64:.14):.12;
  p=Math.min(.91,p+Math.max(0,q.difficulty-2)*.05);
  if(profile==='aide'&&v<.48)return ['correct',true,false];
  if(u<p)return ['wrong',false,false];
  if(v<.08)return ['correct',false,true];
  return ['correct',false,false];
}
function step(engine,state,exercises,meta,profile,seed){
  const s=state.completed+1,deck=engine.start(state,exercises);
  assert.equal(deck.length,10,'session '+s);
  assert.equal(new Set(deck.map(q=>q.id)).size,deck.length);
  for(let i=0;i<deck.length;i++){
    const q=deck[i], [result,assisted,free]=response(profile,seed,q,s,meta);
    assert(engine.record(state,q,result,i,result==='correct'?q.answer:null,assisted,free));
  }
  assert(engine.finish(state,exercises));
}
// Définition des miroirs reprise de #376 uniquement comme indicateur, sans
// modifier logicalOrder ni le code réservé M4.
function decisionPattern(q){
  if(q.auction?.length!==1)return '';
  const o=String(q.auction[0]||'').match(/:\s*([1-7](?:SA|[♣♦♥♠])|Passe|Contre|Surcontre)/)?.[1]||'';
  const a=String(q.answer||'').replace(/[\uFE0E\uFE0F\s]/g,'').trim();
  if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&/^[2-7][♥♠]$/.test(a)&&a[1]===o[1])return 'fit-majeur|'+a[0];
  if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^[2-7][♣♦]$/.test(a)&&a[1]===o[1])return 'fit-mineur|'+a[0];
  if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^1[♥♠]$/.test(a))return 'reponse-majeure-sur-mineure';
  if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-mineure';
  if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-majeure';
  return '';
}
function metrics(state,meta,exercises){
  const total=state.completed,allFamilies=new Set(),allIds=new Set(),allConcepts=new Set(),phase=new Map();
  const difficult=new Set(Object.values(meta).filter(m=>m.stage>=2).map(m=>m.concept));
  let hard=0,phaseN=0,phaseFamilyDup=0,phaseTheme=new Set(),eligibilityViolations=0;
  let previous=new Map(),gaps=[],fundGaps=[];
  const foundations=/^(ouv\.|mineur\.|majeur\.|sa1\.seuil|red\.base|second\.base)/;
  const byId=new Map(exercises.map(q=>[q.id,q]));
  const contrastGroups=[['chelem.quantitatif','chelem.controles','chelem.cles'],['rubensohl.naturel','rubensohl.init'],['multilandy.choix','multilandy.intervention','intervenir.base'],['michaels.choix','michaels.intervention','intervenir.base'],['competitif.spoutnik','contre.base','apres_inter.base'],['reveil.base','intervenir.base'],['apres_fit.essai','chelem.splinter','fit.2sa'],['forcing.troisieme','forcing.quatrieme','red.base']];
  let contrastSessions=0,openingPassViolations=0,ageDebt=0,foundationAgeDebt=0;
  const detail={motifs:{},levels:[0,0,0,0,0],conceptLevels:{},mirrorAdjacency:0,identicalAdjacency:0,themeTriples:0,firstPasses:[],maxThemeGap:{},maxConceptGap:{}};
  const themeLast=new Map();
  for(const ev of state.journal){
    if(ev.mode!=='parcours')continue;
    const sf=new Set(),sc=new Set();let op=0,prev=null,prev2=null;
    for(const a of ev.answers){
      const m=meta[a.id],k=m.concept;
      allIds.add(a.id);allFamilies.add(a.family);allConcepts.add(k);
      const q=byId.get(a.id);
      if(q.theme==='ouv'&&q.answer==='Passe')op++;
      if(ev.session>=66){
        const pattern=decisionPattern(q),previousPattern=prev&&decisionPattern(prev);
        if(prev&&q.answer===prev.answer)detail.identicalAdjacency++;
        if(prev&&pattern&&pattern===previousPattern&&q.answer!==prev.answer)detail.mirrorAdjacency++;
        if(prev&&prev2&&q.theme===prev.theme&&q.theme===prev2.theme)detail.themeTriples++;
        const reason=a.selectionReason||'non-documente';detail.motifs[reason]=(detail.motifs[reason]||0)+1;
        detail.levels[a.difficulty-1]++;const levels=detail.conceptLevels[k]??=[0,0,0,0,0];levels[a.difficulty-1]++;
        if(themeLast.has(a.theme))detail.maxThemeGap[a.theme]=Math.max(detail.maxThemeGap[a.theme]||0,ev.session-themeLast.get(a.theme));
        if(previous.has(k))detail.maxConceptGap[k]=Math.max(detail.maxConceptGap[k]||0,ev.session-previous.get(k));
        if(ev.session-1<m.minSession)eligibilityViolations++;
        phaseN++;phaseTheme.add(a.theme);sc.add(k);
        if(sf.has(a.family))phaseFamilyDup++;
        sf.add(a.family);
        if(a.difficulty>=4)hard++;
        if(!phase.has(k))phase.set(k,{f:new Set(),clean:new Set(),sessions:new Set(),last:0});
        const v=phase.get(k);v.f.add(a.family);v.last=ev.session;
        if(a.result==='correct'&&!a.assisted&&!a.hadFreeError){v.clean.add(a.family);v.sessions.add(ev.session);}
        if(previous.has(k)&&previous.get(k)!==ev.session){
          const gap=ev.session-previous.get(k);gaps.push(gap);if(foundations.test(k))fundGaps.push(gap);
        }
      }
      previous.set(k,ev.session);themeLast.set(a.theme,ev.session);prev2=prev;prev=q;
    }
    if(ev.session<=3)detail.firstPasses.push(op);
    if(ev.session>=66){
      if(op>2)openingPassViolations++;
      for(const [k,last] of previous){if(ev.session-last>20){ageDebt++;if(foundations.test(k))foundationAgeDebt++;}}
      if(contrastGroups.some(g=>g.filter(k=>sc.has(k)).length>=2))contrastSessions++;
    }
  }
  const concepts=[...new Set(Object.values(meta).map(m=>m.concept))];
  const missing=concepts.filter(k=>!phase.has(k));
  const tail=concepts.map(k=>[k,total-(previous.get(k)||0)]).sort((a,b)=>b[1]-a[1]);
  const advanced=[...difficult];
  return {session:total,ids:allIds.size,families:allFamilies.size,concepts:allConcepts.size,
    phaseConcepts:phase.size,phaseThemes:phaseTheme.size,missing,
    advancedCovered:advanced.filter(k=>phase.has(k)).length,
    advancedMultiFamily:advanced.filter(k=>(phase.get(k)?.f.size||0)>=2).length,
    advancedProof:advanced.filter(k=>(phase.get(k)?.clean.size||0)>=2&&(phase.get(k)?.sessions.size||0)>=2).length,
    hard,phaseN,phaseFamilyDup,openingPassViolations,calendarViolations:eligibilityViolations,contrastSessions,
    longGaps:gaps.filter(g=>g>20).length,foundationLongGaps:fundGaps.filter(g=>g>20).length,
    tailOver30:tail.filter(x=>x[1]>30).length,tailOver60:tail.filter(x=>x[1]>60).length,ageDebt,foundationAgeDebt,oldest:tail.slice(0,8),detail};
}
function runPair(b,profile,seed,horizon=180){
  let a=b.base.empty();const before={},after={};
  for(let s=1;s<=Math.min(65,horizon);s++){
    step(b.base,a,b.exercises,b.meta,profile,seed);
    if(s===20||s===65)before[s]=metrics(a,b.meta,b.exercises);
  }
  if(horizon<66)return {profile,seed,before,after:{...before}};
  let c=JSON.parse(JSON.stringify(a));
  after[20]=before[20];after[65]=before[65];
  for(let s=66;s<=horizon;s++){
    step(b.base,a,b.exercises,b.meta,profile,seed);
    step(b.candidate,c,b.exercises,b.meta,profile,seed);
    if(s===153||s===horizon){
      before[s]=metrics(a,b.meta,b.exercises);after[s]=metrics(c,b.meta,b.exercises);
    }
  }
  return {profile,seed,before,after};
}
function readLocal(){
  const read=p=>fs.readFileSync(path.join(root,p),'utf8');
  return build({engine:read('quizz-parcours.js'),metadata:read('quizz-prerequis.js'),
    plan:read('quizz-session-plan.js'),html:read('quizz.html'),policy:read('quizz-pedagogie-avancee.js')});
}
module.exports={build,runPair,metrics,step,profiles,seeds};
if(require.main===module){
  const b=readLocal();
  const ps=process.argv[2]?[process.argv[2]]:profiles;
  const ss=process.argv[3]?[Number(process.argv[3])]:seeds;
  const h=Number(process.argv[4]||180);
  for(const p of ps)for(const seed of ss)console.log(JSON.stringify(runPair(b,p,seed,h)));
}
