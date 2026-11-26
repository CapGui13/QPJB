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
  function instantiate(source){
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
function metrics(state,meta,exercises){
  const total=state.completed,allFamilies=new Set(),allIds=new Set(),allConcepts=new Set(),phase=new Map();
  const difficult=new Set(Object.values(meta).filter(m=>m.stage>=2).map(m=>m.concept));
  let hard=0,phaseN=0,phaseFamilyDup=0,phaseTheme=new Set(),eligibilityViolations=0;
  let previous=new Map(),gaps=[],fundGaps=[];
  const foundations=/^(ouv\.|mineur\.|majeur\.|sa1\.seuil|red\.base|second\.base)/;
  const byId=new Map(exercises.map(q=>[q.id,q]));
  const contrastGroups=[['chelem.quantitatif','chelem.controles','chelem.cles'],['rubensohl.naturel','rubensohl.init'],['multilandy.choix','multilandy.intervention','intervenir.base'],['michaels.choix','michaels.intervention','intervenir.base'],['competitif.spoutnik','contre.base','apres_inter.base'],['reveil.base','intervenir.base'],['apres_fit.essai','chelem.splinter','fit.2sa'],['forcing.troisieme','forcing.quatrieme','red.base']];
  let contrastSessions=0,openingPassViolations=0;
  for(const ev of state.journal){
    if(ev.mode!=='parcours')continue;
    const sf=new Set(),sc=new Set();let op=0;
    for(const a of ev.answers){
      const m=meta[a.id],k=m.concept;
      allIds.add(a.id);allFamilies.add(a.family);allConcepts.add(k);
      const q=byId.get(a.id);
      if(q.theme==='ouv'&&q.answer==='Passe')op++;
      if(ev.session>=66){
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
      previous.set(k,ev.session);
    }
    if(ev.session>=66){
      if(op>2)openingPassViolations++;
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
    tailOver30:tail.filter(x=>x[1]>30).length,oldest:tail.slice(0,8)};
}
function runPair(b,profile,seed,horizon=180){
  let a=b.base.empty();const before={},after={};
  for(let s=1;s<=65;s++){
    step(b.base,a,b.exercises,b.meta,profile,seed);
    if(s===20||s===65)before[s]=metrics(a,b.meta,b.exercises);
  }
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
