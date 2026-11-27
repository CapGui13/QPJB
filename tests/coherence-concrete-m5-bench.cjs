'use strict';
const assert=(v,m)=>{if(!v)throw Error(m)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function run({api,exercises,meta,lessons,planner,lab,clock,verifyEarly,name,seed,horizon=65,paired=true}){
 const md=meta.byId,rows=[],counts={assertions:0,active:0,resume:0,legacy:0};
 const ok=(v,m)=>{counts.assertions++;assert(v,name+'/'+seed+': '+m)};
 const wrap={...api};
 const plan=(ctx)=>{const before=JSON.stringify(ctx),p=planner.studyPlan(ctx);
  ok(JSON.stringify(ctx)===before,'pure context');ok(same(p,planner.studyPlan(ctx)),'deterministic');
  ok(Object.isFrozen(p)&&Object.isFrozen(p.before)&&Object.isFrozen(p.after),'immutable');
  for(const item of [...p.before,...p.after]){
   ok(item.optional&&item.assisted&&!item.assessment,'non assessment');
   ok(Object.keys(item).sort().join(',')==='assessment,assisted,concept,mode,optional,presentation,reason,title','no answer / ID fields');
   ok(lessons.available({mode:item.mode,history:ctx.history}).some(x=>x.concept===item.concept),'historical availability');
  }return p;
 };
 const emptyPlan=(p)=>!p.before.length&&!p.after.length&&!p.holds.length;
 function checkActive(state,s,deck){
  for(const extra of [{},{questionActive:true},{quizActive:true}]){
   ok(emptyPlan(plan({session:s,history:state,metadataById:md,selected:deck,...extra})),'active closed');
   counts.active++;
  }
 }
 const baseline=(history,modes)=>modes.flatMap(mode=>lessons.available({history,mode}).map(x=>({...x,mode})));
 wrap.start=(state,all)=>{
  const wasActive=!!state.active,prior=wasActive?null:JSON.parse(JSON.stringify(state)),s=state.completed+1;
  const deck=api.start(state,all);
  checkActive(state,s,deck);
  if(wasActive){counts.resume++;return deck}
  const before=baseline(prior,['discovery','reminder']);
  const ctx={session:s,history:prior,metadataById:md,selected:deck,phase:'before'};
  const p=plan(ctx),targets=new Set(deck.map(q=>md[q.id].concept));
  const availableTargets=before.filter(x=>targets.has(x.concept));
  ok(p.before.length===Math.min(s===1?4:3,availableTargets.length),'before capacity');
  ok(p.before.every(x=>targets.has(x.concept)&&x.presentation==='rule-only'),'before target');
  ok(emptyPlan(plan({...ctx,quizActive:true})),'free quiz closed');
  ok(emptyPlan(plan({...ctx,questionActive:true})),'question closed');
  ok(emptyPlan(plan({...ctx,exercise:deck[0]})),'exercise closed');
  ok(emptyPlan(plan({...ctx,session:s+1})),'wrong session closed');
  if(s===1){
   const objective={primary:md[deck[0].id].concept};
   const byObjective=plan({...ctx,selected:undefined,objective});
   ok(byObjective.before.every(x=>x.concept===objective.primary),'objective-only');
   ok(emptyPlan(plan({...ctx,selected:undefined})),'no indiscriminate listing');
  }
  rows.push({session:s,questions:deck.map((q,i)=>({id:q.id,context:q.context,hand:q.hand,auction:q.auction,answer:q.answer,concept:md[q.id].concept,difficulty:q.difficulty,stage:md[q.id].stage,position:i+1,role:state.active.selection[i].kind,positionReason:state.active.selection[i].reason,requires:md[q.id].requires})),
   before:{baseline:before,aligned:availableTargets,proposed:p.before,holds:p.holds}});
  return deck;
 };
 wrap.finish=(state,all)=>{
  const done=api.finish(state,all);if(!done)return done;
  const s=state.completed,row=rows.at(-1),event=state.journal.at(-1);
  const target=new Set(event.answers.filter(a=>a.result==='wrong'||a.result==='correct'&&(a.assisted||a.hadFreeError)).map(a=>md[a.id].concept));
  const before=baseline(state,['reminder']),aligned=before.filter(x=>target.has(x.concept));
  const ctx={session:s,history:state,metadataById:md,phase:'after'};
  const p=plan(ctx);
  ok(p.after.length===Math.min(2,aligned.length),'after capacity');
  ok(p.after.every(x=>target.has(x.concept)&&x.mode==='reminder'&&x.presentation==='reminder-only'),'after real evidence');
  row.after={baseline:before,aligned,proposed:p.after,holds:p.holds};
  row.answers=event.answers.map(a=>({id:a.id,result:a.result,assisted:a.assisted,hadFreeError:a.hadFreeError}));
  if([1,5,20,65,153,180].includes(s)){
   const backup=api.exportProgress(state,all,{}),restored=api.importProgress(JSON.stringify(backup));
   ok(same(plan({...ctx,history:restored}),p),'restored suggestion');
   const old=JSON.parse(JSON.stringify(backup));delete old.algorithmState.journal;
   const legacy=api.importProgress(old);
   ok(emptyPlan(plan({...ctx,history:legacy})),'no invented past session');
   counts.legacy++;
  }
  return done;
 };
 const args={exercises,meta,name,seed,horizon,clock,verifyEarly};
 const baselineRun=paired?lab.run({...args,api}):null;
 const candidate=lab.run({...args,api:wrap});
 ok(candidate.violations.length===0,'native structural guards');
 if(baselineRun){ok(same(baselineRun.events,candidate.events),'identical full ID order and responses');
  ok(same(baselineRun.checkpoints,candidate.checkpoints),'identical historical metrics and evidence')}
 ok(rows.length===horizon&&rows.every(r=>r.questions.length===10&&r.after),'all sessions recorded');
 const summary=(limit)=>{
  const subset=rows.filter(x=>x.session<=limit);
  const tally=phase=>subset.reduce((a,x)=>{const r=x[phase];a.baseline+=r.baseline.length;a.aligned+=r.aligned.length;a.proposed+=r.proposed.length;a.withTarget+=+(r.aligned.length>0);a.withSuggestion+=+(r.proposed.length>0);a.hold+=r.holds.length;return a},{baseline:0,aligned:0,proposed:0,withTarget:0,withSuggestion:0,hold:0});
  return {horizon:limit,before:tally('before'),after:tally('after')};
 };
 return {name,seed,horizon,paired,counts,summary:[5,20,65,153,180].filter(x=>x<=horizon).map(summary),rows};
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.join(__dirname,'..');
 const campaign=require('./durable-m6-campaign.cjs'),lab=require('../quizz-durable-m6-lab.js');
 const planner=require('../quizz-coherence-m5-study.js'),lessons=require('../quizz-durable-m5-lecons.js');
 const sources=Object.fromEntries([...new Set([...campaign.paths,...fs.readdirSync(root).filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js')])].map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
 const e=campaign.engine(sources);
 const name=process.argv[2]||'autonome',seed=Number(process.argv[3]||11),horizon=Number(process.argv[4]||65);
 const result=run({...e,lessons,planner,lab,verifyEarly:campaign.verifyEarly,name,seed,horizon});
 console.log(JSON.stringify(result));
}
