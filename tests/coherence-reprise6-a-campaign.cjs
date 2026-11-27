'use strict';
// Reprise 6 A, paired M6 and original D. No production modification.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const T=require('../quizz-coherence-m6-traces.js'),D=require('../quizz-coherence-m4p-d-lab.js'),C=require('./coherence-concrete-m6-campaign.cjs'),legacy=require('./durable-m6-campaign.cjs'),F=require('../quizz-coherence-m4-diversite.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js'),A=require('../quizz-coherence-reprise6-a-composition.js');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa',root=path.resolve(__dirname,'..');
const [profile='autonome',rawSeed='11',rawHorizon='180',dest='reprise6-a-output',...variants]=process.argv.slice(2);
const seed=Number(rawSeed),horizon=Number(rawHorizon),armsToTest=variants.length?variants:['saturation'];
assert(T.PROFILES.includes(profile)&&T.SEEDS.includes(seed)&&T.HORIZONS.includes(horizon));
assert(armsToTest.every(v=>['contrast','composition','early','balance','contrast-balance','saturation'].includes(v)));
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
function sources(ref){return Object.fromEntries(git('ls-tree','--name-only',ref).trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js').map(p=>[p,git('show',ref+':'+p)]))}
const base=sources(BASE),historic=sources(T.BASE),head=git('rev-parse','HEAD').trim(),current=sources(head);
const embedded=html=>html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(embedded(base['quizz.html']),embedded(historic['quizz.html']));
assert.equal(base['quizz-prerequis.js'],historic['quizz-prerequis.js']);
for(const [p,src] of Object.entries(base))assert.equal(current[p],src,'A must not modify existing production source '+p);
const full={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
const ids=d=>d.map(q=>q.id),sorted=d=>ids(d).sort(),copy=x=>JSON.parse(JSON.stringify(x));
const settingsFor=v=>v==='historic'?{}:v==='native'?full:{...full,coherenceM1:A.make(v)};
const core=D.CORE, objective=s=>A.targets[s]?{source:'declared',principal:A.targets[s].primary[0],secondary:A.targets[s].primary.slice(1).concat(A.targets[s].secondary),title:A.targets[s].title}:null;
function checkResume(api,state,exercises,options,deck){
 for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){
  assert.deepEqual(restored.active,state.active);assert.deepEqual(ids(api.start(restored,exercises,options)),ids(deck));
 }
}
function checkConsolidation(api,state,exercises,options){
 const probe=copy(state),a=api.consolidationPlan(probe,exercises),deck=api.startConsolidation(probe,exercises);
 if(!a.available){assert.equal(deck.length,0);return 0}
 assert.deepEqual(ids(deck),a.items.map(x=>x.id));assert.equal(probe.active.mode,'consolidation');
 assert(api.record(probe,deck[0],'correct',0,deck[0].answer,false,false));checkResume(api,probe,exercises,options,deck);
 for(let i=1;i<deck.length;i++)assert(api.record(probe,deck[i],'correct',i,deck[i].answer,false,false));
 assert(api.finish(probe,exercises));assert.equal(probe.completed,state.completed);return 1;
}
function m6(v){
 const e=C.engine(v==='historic'?historic:base),{api,exercises,meta,effectiveMeta}=e,state=api.empty(),sessions=[],events=[];
 const options={...settingsFor(v),observe:r=>events.push(r)},catalogue=JSON.stringify(exercises),metadata=JSON.stringify(meta);
 let resume=0,consolidations=0;
 for(let s=1;s<=horizon;s++){
  e.clock(s*86400000);
  const started=performance.now(),deck=api.start(state,exercises,options),latencyMs=performance.now()-started;
  legacy.verifyEarly(deck,s);assert.equal(deck.length,10);assert.equal(new Set(ids(deck)).size,10);assert.equal(new Set(deck.map(q=>q.caseFamily||q.id)).size,10);
  const elig=api.eligibilityBatch(deck,state,exercises);assert(elig.every(x=>x.eligible));
  const trace=T.traceSession({deck,selection:state.active.selection,meta:effectiveMeta,rawMeta:meta,elig,pattern:q=>api.decisionPatternForM6(q),s,history:sessions,profile,seed,latencyMs,objective:objective(s)});
  for(let i=0;i<deck.length;i++){
   const q=deck[i],r=trace.rows[i],choice=r.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
   assert(api.record(state,q,r.result,i,choice,r.assisted,r.hadFreeError));r.choice=choice;
   if(i===0&&[1,2,3,5,20,21,65,66,153,180].includes(s)){checkResume(api,state,exercises,options,deck);resume+=2}
  }
  assert(api.finish(state,exercises));sessions.push(trace);
  if([5,20,65,153,180].includes(s))consolidations+=checkConsolidation(api,state,exercises,options);
 }
 assert.equal(JSON.stringify(exercises),catalogue);assert.equal(JSON.stringify(meta),metadata);
 const checkpoints=T.HORIZONS.filter(n=>n<=horizon).map(n=>({session:n,...T.metrics(sessions.slice(0,n))}));assert(checkpoints.every(x=>!x.violations.length));
 return {profile,seed,horizon,policy:'fixed-385-395-v1',catalogueKey:'frozen-1915',sessions,events,checkpoints,resume,consolidations};
}
function strict(a,b){
 const last=new Map(),debt={},proof=new Map(),out=[];
 function summary(t){last.clear();for(const k of Object.keys(debt))delete debt[k];proof.clear();const result=[];for(const s of t.sessions){for(const r of s.rows){last.set(r.concept,s.session);if(r.result==='correct'&&!r.assisted&&!r.hadFreeError){const p=proof.get(r.concept)||{f:new Set(),s:new Set()};p.f.add(r.family);p.s.add(s.session);proof.set(r.concept,p)}}for(const c of core)if(last.has(c))debt[c]=(debt[c]||0)+Math.max(0,s.session-last.get(c)-6);if(T.HORIZONS.includes(s.session))result.push({session:s.session,debt:{...debt},terminal:Object.fromEntries(core.map(c=>[c,last.has(c)?s.session-last.get(c):null])),proof:[...proof].filter(([,p])=>p.f.size>=2&&p.s.size>=2).map(([c])=>c)});}return result}
 const x=summary(a),y=summary(b);for(let i=0;i<x.length;i++){const u=x[i],v=y[i],h=u.session;for(const c of core){if((v.debt[c]||0)>(u.debt[c]||0))out.push({h,metric:'conceptDebt',concept:c,before:u.debt[c]||0,after:v.debt[c]||0});if(u.terminal[c]!==null&&(v.terminal[c]===null||v.terminal[c]>u.terminal[c]))out.push({h,metric:'terminalGap',concept:c,before:u.terminal[c],after:v.terminal[c]})}for(const c of u.proof)if(!v.proof.includes(c))out.push({h,metric:'proofConceptLost',concept:c});const p=a.checkpoints[i],q=b.checkpoints[i];for(const k of ['hard','nearFamily','nearId'])if(q[k]>p[k])out.push({h,metric:k,before:p[k],after:q[k]});for(const k of ['families','autonomous'])if(q[k]<p[k])out.push({h,metric:k,before:p[k],after:q[k]})}return out;
}
// Exact original D campaign (same adapter as #505) with options supplied.
// Full D comparator rechecks every response and all original metrics.
const original=fs.readFileSync(path.join(__dirname,'coherence-concrete-m4-campaign.cjs'),'utf8');let harness=original;
function replace(a,b,n=1){assert.equal(harness.split(a).length,n+1,'D adapter anchor');harness=harness.replaceAll(a,b)}
replace("verify=true,measure=()=>0})","verify=true,measure=()=>0,options={}})");
replace("const api=mod.exports,state=api.empty(),sessions=[]","const settings={...options,observe:r=>changes.push(r)};\n  const api=mod.exports,state=api.empty(),sessions=[]");
replace("api.start(state,exercises)","api.start(state,exercises,settings)",2);
const mod={exports:{}};new Function('module','exports','require',harness)(mod,mod.exports,require);
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js')),exercises=JSON.parse(embedded(base['quizz.html'])).exercises,meta=requireBase('./quizz-prerequis.js').byId;
function d(v){
 const t=mod.exports.run({source:base['quizz-parcours.js'],requireBase,exercises,meta,profile,seed,horizon,verify:true,measure:()=>performance.now(),options:settingsFor(v)});
 assert(t.checkpoints.every(c=>!c.violations&&!c.dupes&&!c.short&&!c.earlyViolations));
 D.analyze(t,{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true});return t;
}
const m6arms={historic:m6('historic'),native:m6('native')},darms={native:d('native')},results={};
function objectiveS3(t){
 const s=t.sessions[2],rows=s.rows,roles=new Set(rows.map(r=>A.role({session:3,metadataById:meta},{...r,shape:r.shape})).filter(Boolean));
 return {support:+roles.has('support-5-3'),passFit:+roles.has('passe-avec-fit'),excess2SA:Math.max(0,rows.filter(r=>r.concept==='ouv.sa2').length-1),concepts:[...new Set(rows.map(r=>r.concept))]};
}
for(const v of armsToTest){
 const b=m6arms.native,a=m6arms[v]=m6(v),bd=darms.native,ad=darms[v]=d(v),c=T.compare(b,a),changes=ad.sessions.flatMap((s,i)=>sorted(s.rows).join()===sorted(bd.sessions[i].rows).join()?[]:[{session:s.session,kind:'deck-set',removed:ids(bd.sessions[i].rows).filter(id=>!ids(s.rows).includes(id)),added:ids(s.rows).filter(id=>!ids(bd.sessions[i].rows).includes(id))}]);
 ad.changes=changes;
 assert(c.changes.slice(0,2).every(x=>x.sameSet&&x.sameOrder));assert(!changes.some(x=>x.session<3));
 const pair=D.comparePair({profile,seed,horizon,before:bd,after:ad},{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true,legacy:true});
 const objective={m6:[objectiveS3(b),objectiveS3(a)],d:[objectiveS3(bd),objectiveS3(ad)]};
 results[v]={m6:{comparison:c,strict:strict(b,a),historic:T.compare(m6arms.historic,a),resumes:a.resume,consolidations:a.consolidations},d:pair,objective};
}
const summary={profile,seed,horizon,base:BASE,head,results};
fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify(summary));fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify({m6:m6arms,d:darms}));
for(const [name,arm] of Object.entries(m6arms))fs.writeFileSync(path.join(dest,'fiche-'+name+'.md'),C.fiche({...arm,revision:head}));
console.log(JSON.stringify({profile,seed,horizon,head,results:Object.fromEntries(Object.entries(results).map(([v,r])=>[v,{m6Changes:r.m6.comparison.changes.filter(x=>!x.sameSet).length,m6Strict:r.m6.strict.length,m6Review:r.m6.comparison.checkpoints.flatMap(x=>x.review),dChanges:r.d.changes,dRegressions:r.d.regressions.filter(x=>x.metric!=='latency-observation').length,objective:r.objective,resumes:r.m6.resumes,consolidations:r.m6.consolidations}]))}));
