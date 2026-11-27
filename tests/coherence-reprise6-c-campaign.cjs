'use strict';
// Reproducible, dependency-injected runner: Node or V8, actual frozen sources.
// The historical D campaign is reused without altering its response or metrics.
function resolve(from,p){const a=from.split('/');a.pop();for(const x of p.split('/')){if(x==='..')a.pop();else if(x!=='.')a.push(x)}return a.join('/')}
const check=(x,m)=>{if(!x)throw Error(m)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function loader(sources){
 const modules=new Map(),loading=new Set();
 const req=(from,p)=>load(resolve(from,p));
 function compile(path,code=sources[path]){check(typeof code==='string'&&code.length,'Missing '+path);const m={exports:{}};new Function('module','exports','require',code)(m,m.exports,p=>req(path,p));return m.exports}
 function load(path){if(modules.has(path))return modules.get(path);check(!loading.has(path),'Circular '+path);loading.add(path);try{const m=compile(path);modules.set(path,m);return m}finally{loading.delete(path)}}
 return {load,compile,req};
}
function runPair(sources,profile,seed,horizon=180,model='both',clock=()=>Date.now(),variant='strict'){
 const {load,compile,req}=loader(sources),T=load('quizz-coherence-m6-traces.js'),D=load('quizz-coherence-m4p-d-lab.js');
 const m2=load('quizz-coherence-m2-ordre.js'),m3=load('quizz-coherence-m3-prerequis.js');
 check(['strict','recent'].includes(variant),'unknown variant');
 const candidate=load(variant==='recent'?'quizz-coherence-reprise6-c-recent-credit.js':'quizz-coherence-reprise6-c-debt-credit.js'),adapter=load('tests/coherence-reprise6-c-adapter.cjs');
 const base=sources['quizz-parcours.js'],patched=adapter.instrument(base);
 const opts={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
 const result={profile,seed,horizon,variant,models:{}};
 const early=(a,b)=>{for(let i=0;i<Math.min(65,horizon);i++)check(same(a.sessions[i].rows.map(q=>q.id),b.sessions[i].rows.map(q=>q.id)),'pre-S66 drift S'+(i+1))};
 const pack=(t,model)=>t.sessions.map(s=>s.rows.map(r=>model==='M6'?[r.id,r.kind,r.selectionReason,r.result,r.choice,r.assisted,r.hadFreeError,r.eligibility.eligible]:[r.id,r.role,r.reason,r.response.result,r.response.choice,r.response.assisted,r.response.hadFreeError,r.eligible]));
 const core=t=>{const last=new Map(),debt={},proof=new Map(),out=[];for(const s of t.sessions){for(const r of s.rows){last.set(r.concept,s.session);if(r.result==='correct'&&!r.assisted&&!r.hadFreeError){const v=proof.get(r.concept)||{f:new Set(),s:new Set()};v.f.add(r.family);v.s.add(s.session);proof.set(r.concept,v)}}for(const c of D.CORE)if(last.has(c))debt[c]=(debt[c]||0)+Math.max(0,s.session-last.get(c)-6);if(T.HORIZONS.includes(s.session))out.push({session:s.session,debt:{...debt},total:Object.values(debt).reduce((a,b)=>a+b,0),terminal:Object.fromEntries(D.CORE.map(c=>[c,last.has(c)?s.session-last.get(c):null])),proof:[...proof].filter(([,v])=>v.f.size>=2&&v.s.size>=2).map(([c])=>c).sort()})}return out};
 const strict=(a,b,aa,bb)=>{const alerts=[];for(let i=0;i<a.length;i++){const x=a[i],y=b[i],h=x.session;for(const c of D.CORE){if((y.debt[c]||0)>(x.debt[c]||0))alerts.push({h,metric:'conceptDebt',concept:c,before:x.debt[c]||0,after:y.debt[c]||0});if(x.terminal[c]!==null&&(y.terminal[c]===null||y.terminal[c]>x.terminal[c]))alerts.push({h,metric:'terminalGap',concept:c,before:x.terminal[c],after:y.terminal[c]})}for(const c of x.proof)if(!y.proof.includes(c))alerts.push({h,metric:'proofConceptLost',concept:c});for(const k of ['hard','nearFamily','nearId'])if(bb[i][k]>aa[i][k])alerts.push({h,metric:k,before:aa[i][k],after:bb[i][k]});for(const k of ['families','autonomous'])if(bb[i][k]<aa[i][k])alerts.push({h,metric:k,before:aa[i][k],after:bb[i][k]})}return alerts};
 if(model==='both'||model==='M6'){
  const C=load('tests/coherence-concrete-m6-campaign.cjs'),legacy=load('tests/durable-m6-campaign.cjs');
  function arm(label,src,policy){
   const e=C.engine({...sources,'quizz-parcours.js':src}),{api,exercises,meta,effectiveMeta}=e,state=api.empty(),sessions=[],events=[],resumes=[];
   const settings={...opts,...(policy?{reprise6C:candidate}:{}),observe:x=>events.push(x)};
   for(let s=1;s<=horizon;s++){
    e.clock((s-1)*86400000);const t=clock(),deck=api.start(state,exercises,settings),latencyMs=Math.max(0,clock()-t),elig=api.eligibilityBatch(deck,state,exercises);
    legacy.verifyEarly(deck,s);check(deck.length===10&&new Set(deck.map(q=>q.id)).size===10&&new Set(deck.map(q=>q.caseFamily||q.id)).size===10&&elig.every(x=>x.eligible),'M6 deck S'+s);
    const trace=T.traceSession({deck,selection:state.active.selection,meta:effectiveMeta,rawMeta:meta,elig,pattern:q=>api.decisionPatternForM6(q),s,history:sessions,profile,seed,latencyMs});
    for(let i=0;i<deck.length;i++){
     const q=deck[i],r=trace.rows[i];r.choice=r.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
     check(api.record(state,q,r.result,i,r.choice,r.assisted,r.hadFreeError),'M6 record');
     if(i===0&&[1,2,3,5,20,21,65,66,153,180].includes(s)){
      for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){
       check(same(restored.active,state.active)&&same(api.start(restored,exercises,settings).map(q=>q.id),deck.map(q=>q.id)),'M6 resume S'+s);
      }resumes.push(s);
     }
    }
    check(api.finish(state,exercises),'M6 finish');sessions.push(trace);
   }
   const checkpoints=T.HORIZONS.filter(n=>n<=horizon).map(n=>({session:n,...T.metrics(sessions.slice(0,n))}));
   check(checkpoints.every(x=>!x.violations.length),'M6 structure');
   return {label,profile,seed,horizon,policy:'fixed-385-395-v1',catalogueKey:'frozen-1915',sessions,checkpoints,events,resumes,core:core({sessions})};
  }
  const a=arm('Full',base,false),b=arm('Credit',patched,true);early(a,b);const comp=T.compare(a,b);
  result.models.M6={before:a.checkpoints,after:b.checkpoints,coreBefore:a.core,coreAfter:b.core,strict:strict(a.core,b.core,a.checkpoints,b.checkpoints),review:comp.checkpoints.flatMap(x=>x.review.map(y=>({h:x.session,metric:y}))),changes:comp.changes.filter(x=>!x.sameSet),direct:b.events.filter(x=>x.reprise6C),resumes:[a.resumes,b.resumes],traces:{before:pack(a,'M6'),after:pack(b,'M6')}};
 }
 if(model==='both'||model==='D'){
  const path='tests/coherence-concrete-m4-campaign.cjs';let harness=sources[path];
  function patch(a,b,n=1){check(harness.split(a).length===n+1,'D exact anchor '+a);harness=harness.replaceAll(a,b)}
  patch('verify=true,measure=()=>0})','verify=true,measure=()=>0,options={}})');
  patch('const api=mod.exports,state=api.empty(),sessions=[]','const settings={...options,observe:r=>changes.push(r)};\n  const api=mod.exports,state=api.empty(),sessions=[]');
  patch('api.start(state,exercises)','api.start(state,exercises,settings)',2);
  const campaign=compile(path,harness),html=sources['quizz.html'],exercises=JSON.parse(html.split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
  const meta=load('quizz-prerequis.js').byId,features=load('quizz-coherence-m4-diversite.js').features;
  check(exercises.length===1915&&new Set(Object.values(meta).map(m=>m.concept)).size===99,'D catalogue');
  const common={requireBase:p=>req('quizz-parcours.js',p),exercises,meta,profile,seed,horizon,verify:true,measure:clock};
  const a=campaign.run({...common,source:base,options:opts}),b=campaign.run({...common,source:patched,options:{...opts,reprise6C:candidate}});early(a,b);
  const pair=D.comparePair({profile,seed,horizon,before:a,after:b},{catalogue:exercises,metadata:meta,features,verifyResponse:true,legacy:true});
  check(!pair.structure.length,'D structure');
  result.models.D={before:pair.before,after:pair.after,regressions:pair.regressions,structure:pair.structure,changes:pair.changes,reservations:pair.reservations,fullGate:D.compareCheckpoints([pair],{fullMatrix:false}),direct:b.changes.filter(x=>x.reprise6C),traces:{before:pack(a,'D'),after:pack(b,'D')}};
 }
 return result;
}
module.exports={runPair,loader,resolve};
