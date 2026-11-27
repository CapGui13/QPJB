'use strict';
const T=require('../quizz-coherence-m6-traces.js');
const C=require('./durable-m6-campaign.cjs');
const G=require('../quizz-durable-m6-guards.js');
// C.prepare inserts eligibilityBatch at its anchor. Preserve it exactly by inserting the additional export before the return, not by replacing the anchor.
function engine(sources){
 const src=sources['quizz-parcours.js'],anchor='return {eligibility,adaptiveDiagnostics,createForTests:';
 T.check(src.split(anchor).length===2,'Exact instrumentation anchor');
 const marker='function decisionPattern(q,mode){';
 T.check(src.split(marker).length===2,'Exact decision pattern marker');
 // Use the existing campaign loader with a return-object insertion after its anchor, at the end of the public API.
 const end='SELECTION_REASONS,summary,levelFor};';
 T.check(src.split(end).length===2,'Exact public export marker');
 const e=C.prepare({...sources,'quizz-parcours.js':src.replace(end,'SELECTION_REASONS,summary,levelFor,decisionPatternForM6:decisionPattern,metadataForM6:metadata};')});
 T.check(e.exercises.length===1915&&Object.keys(e.meta.byId).length===1915,'Frozen catalogue size');
 T.check(new Set(Object.values(e.meta.byId).map(m=>m.concept)).size===99,'Concept coverage');
 const effectiveMeta={...e.meta,byId:Object.fromEntries(e.exercises.map(q=>[q.id,e.api.metadataForM6(q)]))};
 T.check(Object.values(effectiveMeta.byId).every(Boolean),'Effective metadata coverage');
 return {...e,effectiveMeta};
}
function run(sources,profile,seed,horizon=180,{revision=T.BASE,measure=()=>Date.now(),objectiveFor=null}={}){
 T.check(T.PROFILES.includes(profile)&&T.SEEDS.includes(seed)&&Number.isInteger(horizon)&&horizon>=1&&horizon<=180,'Invalid matrix');
 const e=engine(sources),{api,exercises,meta}=e;
 const state=api.empty(),sessions=[],resumes=[];
 const catalogueKey=G.universeKey(exercises,meta); // provenance; candidate comparison below uses catalogue-only key
 const original=JSON.stringify(exercises),originalMeta=JSON.stringify(meta);
 for(let s=1;s<=horizon;s++){
  e.clock((s-1)*86400000);
  const a=measure(),deck=api.start(state,exercises),latencyMs=Math.max(0,measure()-a);
  C.verifyEarly(deck,s);
  const elig=api.eligibilityBatch(deck,state,exercises);
  T.check(deck.length===10&&new Set(deck.map(q=>q.id)).size===10&&new Set(deck.map(q=>q.caseFamily||q.id)).size===10,'Native deck invariants S'+s);
  T.check(elig.every(x=>x.eligible),'Native ineligible question S'+s);
  const selection=state.active.selection;
  const objective=objectiveFor?objectiveFor({session:s,history:JSON.parse(JSON.stringify(state)),selected:deck.map(q=>q.id)}):null;
  const t=T.traceSession({deck,selection,meta:e.effectiveMeta,rawMeta:meta,elig,pattern:q=>api.decisionPatternForM6(q),s,history:sessions,profile,seed,latencyMs,objective});
  for(const [i,q] of deck.entries()){
   const row=t.rows[i],choice=row.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
   T.check(api.record(state,q,row.result,i,choice,row.assisted,row.hadFreeError),'Record S'+s);
   row.choice=choice;
   if(i===0&&[1,2,3,5,20,21,65,66,153,180].includes(s)){
    for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){
     T.check(T.same(restored.active,state.active),'Resume evidence S'+s);
     T.check(T.same(api.start(restored,exercises).map(x=>x.id),deck.map(x=>x.id)),'Resume deck S'+s);
    }resumes.push(s);
   }
  }
  T.check(api.finish(state,exercises),'Finish S'+s);
  sessions.push(t);
 }
 T.check(JSON.stringify(exercises)===original&&JSON.stringify(meta)===originalMeta,'Native input mutation');
 const catalogueById=new Map(exercises.map(q=>[q.id,q]));
 for(const [idx,session] of sessions.entries()){
  const expected=T.traceSession({deck:session.rows.map(r=>catalogueById.get(r.id)),selection:session.rows.map(r=>({id:r.id,kind:r.kind,reason:r.selectionReason})),meta:e.effectiveMeta,rawMeta:meta,elig:session.rows.map(r=>r.eligibility),pattern:q=>api.decisionPatternForM6(q),s:idx+1,history:sessions.slice(0,idx),profile,seed,latencyMs:session.latencyMs,objective:session.objective});
  T.check(T.same(expected.summary,session.summary),'Summary integrity S'+session.session);
  for(const [i,row] of session.rows.entries()){
   const {choice,...rest}=row,q=catalogueById.get(row.id);
   T.check(T.same(rest,expected.rows[i]),'Recomputed trace evidence S'+session.session+' '+row.id);
   T.check(q.choices.includes(choice)&&((choice===q.answer)===(row.result==='correct')),'Response trace S'+session.session+' '+row.id);
  }
 }
 const checkpoints=T.HORIZONS.filter(n=>n<=horizon).map(n=>({session:n,...T.metrics(sessions.slice(0,n))}));
 T.check(checkpoints.every(x=>!x.violations.length),'Trace structural violations');
 return {revision,profile,seed,horizon,policy:'fixed-385-395-v1',catalogueKey,checkpoints,resumes,sessions};
}
function pair(base,candidate,profile,seed,horizon=180,options={}){
 const b=engine(base),c=engine(candidate);
 T.check(T.same(b.exercises,c.exercises),'Historical catalogue changed');
 const patches=Object.keys(b.meta.byId).filter(id=>!T.same(b.meta.byId[id],c.meta.byId[id])).map(id=>({id,old:b.meta.byId[id],new:c.meta.byId[id]}));
 const approved=options.approvedPatches||[];
 T.check(patches.every(p=>approved.some(a=>a.id===p.id&&T.same(a.old,p.old)&&T.same(a.new,p.new)&&a.preuve&&a.accord)),'Unapproved metadata patch');
 const effectivePatches=Object.keys(b.effectiveMeta.byId).filter(id=>!T.same(b.effectiveMeta.byId[id],c.effectiveMeta.byId[id])).map(id=>({id,old:b.effectiveMeta.byId[id],new:c.effectiveMeta.byId[id]}));
 T.check(effectivePatches.every(p=>approved.some(a=>a.id===p.id&&T.same(a.old,p.old)&&T.same(a.new,p.new)&&a.preuve&&a.accord)),'Unapproved effective metadata patch');
 const crossResume=C.crossResume(b,c);
 const before=run(base,profile,seed,horizon,{revision:T.BASE}),after=run(candidate,profile,seed,horizon,{revision:options.revision||'candidate',objectiveFor:options.objectiveFor});
 // Catalogue parity is independently checked above; approved metadata changes are recorded rather than hidden.
 const comparison=T.compare(before,{...after,catalogueKey:before.catalogueKey});
 return {before,after,patches,effectivePatches,crossResume,comparison};
}
function fiche(run){
 const lines=['# '+run.profile+' / '+run.seed+' — '+run.revision,'','Rôles déduits des motifs natifs ; observations de position, non causalité.'];
 for(const s of run.sessions.slice(0,5)){
  lines.push('','## S'+s.session+' — '+s.objective.principal+' ('+s.objective.source+')');
  for(const r of s.rows)lines.push(r.position+'. '+r.id+' | '+r.concept+' | N'+r.difficulty+' | '+r.role+' / '+r.selectionReason+' | '+r.h+' H | '+r.hand.map((cards,i)=>['P','C','K','T'][i]+':'+cards.join(' ')).join(' ; ')+' | '+(r.auction.join(' / ')||'ouverture')+' | '+r.context+' → **'+r.answer+'** | '+r.positionObservations.join('; '));
 }
 lines.push('','## Synthèse S6–65','');
 for(const s of run.sessions.slice(5,65)){const f=s.summary;lines.push('- S'+s.session+' | '+s.objective.principal+' | '+Object.entries(f.conceptCounts).map(([k,n])=>k+':'+n).join(', ')+' | rôles '+Object.entries(f.roleCounts).map(([k,n])=>k+':'+n).join(', ')+' | nouvelles familles '+f.newFamilies+' | répétitions proches '+f.nearFamily+' | niveaux '+f.difficulty.join(',')+' | transitions '+f.themeSwitches);}
 return lines.join('\n')+'\n';
}
module.exports={engine,run,pair,fiche};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
 const root=path.join(__dirname,'..'),[mode='baseline',profile='autonome',seedString='47',hString='180',out='m6-output']=process.argv.slice(2);
 const seed=Number(seedString),horizon=Number(hString);
 const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
 const loadRef=ref=>{const files=git('ls-tree','--name-only',ref).trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js');
  return Object.fromEntries(files.map(p=>[p,git('show',ref+':'+p)]));};
 const base=loadRef(T.BASE);
 const rev=git('rev-parse','HEAD').trim();
 const write=(name,body)=>fs.writeFileSync(path.join(out,name),body);
 fs.mkdirSync(out,{recursive:true});
 const matrix=mode==='matrix'||mode==='matrix-pair'?T.PROFILES.flatMap(p=>T.SEEDS.map(s=>[p,s])):[[profile,seed]];
 T.check(['matrix','matrix-pair','baseline','pair'].includes(mode),'Usage: baseline|matrix|pair|matrix-pair [profile seed horizon output-directory]');
 const isPair=mode==='pair'||mode==='matrix-pair';
 const local=isPair?loadRef(rev):null;
 const approved=process.env.M6_APPROVED_PATCHES?JSON.parse(fs.readFileSync(process.env.M6_APPROVED_PATCHES,'utf8')):[];
 const register=[];
 for(const [p,s] of matrix){
  const result=isPair?pair(base,local,p,s,horizon,{revision:rev,approvedPatches:approved}):run(base,p,s,horizon);
  const tag=p+'-'+s;
  write(tag+'.json',JSON.stringify(result));
  if(isPair){write(tag+'-before.md',fiche(result.before));write(tag+'-after.md',fiche(result.after));}
  else write(tag+'.md',fiche(result));
  const arm=isPair?result.after:result;
  register.push({profile:p,seed:s,horizon,questions:arm.sessions.reduce((n,x)=>n+x.rows.length,0),checkpoints:arm.checkpoints,comparison:isPair?result.comparison.checkpoints:undefined,trace:tag+'.json'});
  if(isPair&&result.comparison.checkpoints.some(x=>x.review.length))process.exitCode=2;
 }
 write('register.json',JSON.stringify({base:T.BASE,revision:rev,mode,matrix:register,environment:{node:process.version,memory:process.memoryUsage(),cpu:process.cpuUsage()},catalogueSha256:crypto.createHash('sha256').update(base['quizz.html']).digest('hex')},null,2));
 console.log(JSON.stringify({mode,matrix:register.map(x=>({profile:x.profile,seed:x.seed,horizon:x.horizon,questions:x.questions,alerts:x.comparison?.flatMap(y=>y.review)||[]}))},null,2));
}
