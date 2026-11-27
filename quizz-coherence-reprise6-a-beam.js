'use strict';
// A / pass 2. Bounded two-step search for a *single* net S3 role exchange.
// First choose the missing fit contrast, then restore a displaced baseline
// representative through a native free slot. No hard filter, no forced quota.
const L=require('./quizz-coherence-reprise6-a-lookahead.js'),A=require('./quizz-coherence-reprise6-a-composition.js');
const schema='QPJB_COHERENCE_M1_V1',qOf=x=>x?.exercise||x;
const c=(ctx,q)=>ctx.metadataById?.[q?.id]?.concept;
const m=(ctx,q)=>ctx.metadataById?.[q?.id];
const sig=ctx=>JSON.stringify((ctx.selected||[]).map(qOf).map(q=>q.id));
const policy=(rank=()=>[],compose=()=>null)=>Object.freeze({schema,plan:A.plan,prefer:ctx=>ctx.candidates,rank,compose});
const free=ctx=>ctx.session===3&&ctx.category==='discovery'&&!ctx.priority&&!ctx.forcedReason&&!ctx.history?.active&&!ctx.changed;
const flag=(ctx,q)=>{const f=ctx.flagsById?.[q.id];return !!f&&!f.due&&!f.bad&&f.novelFamily};
const matched=(ctx,o,n)=>o.difficulty===n.difficulty&&m(ctx,o)?.stage===m(ctx,n)?.stage;
function prepare({api,state,exercises,metadataById,options={}}){
 const neutral=policy();
 if(state.active||state.completed!==2)return {policy:neutral,decision:null,trials:0};
 const ctx={session:3,metadataById},byId=new Map(exercises.map(q=>[q.id,q])),choices=[],snapshot=JSON.stringify(state);
 const run=p=>api.select(exercises,state,10,{...options,observe:undefined,coherenceM1:p});
 const baseline=run(policy(undefined,(slot,ranked)=>{
  const old=ranked[0]?.q;
  if(!free(slot)||!old||c(ctx,old)!=='ouv.sa2'||!flag(slot,old))return null;
  if(!(slot.selected||[]).map(qOf).some(q=>c(ctx,q)==='ouv.sa2'))return null;
  for(const x of ranked.slice(1)){
   const q=x.q,cost=ranked[0].v-x.v;
   if(L.role(ctx,q)!=='passe-avec-fit'||!flag(slot,q)||!matched(ctx,old,q)||cost<0||cost>=100)continue;
   choices.push({key:sig(slot),id:q.id,oldId:old.id,delta:cost+1,cost});
  }
  return null;
 }));
 const p=L.profile(ctx,baseline.map(x=>byId.get(x.id)));
 if(JSON.stringify(state)!==snapshot)throw Error('beam mutated history');
 if(p.roles['passe-avec-fit']||!p.roles['support-5-3']||(p.concepts['ouv.sa2']||0)<2)return {policy:neutral,decision:null,trials:0};
 const baseIds=new Set(baseline.map(x=>x.id));let trials=0;
 const firstRank=x=>slot=>free(slot)&&sig(slot)===x.key&&(slot.candidates||[]).some(q=>q.id===x.id)?[{id:x.id,delta:x.delta,reason:'contraste de fit manquant, alternative native'}]:[];
 const firsts=choices.filter(x=>!baseIds.has(x.id)).sort((a,b)=>a.cost-b.cost||a.id.localeCompare(b.id)).slice(0,8);
 for(const x of firsts){
  const repairs=[];
  const first=run(policy(firstRank(x),(slot,ranked)=>{
   if(!free(slot)||!(slot.selected||[]).map(qOf).some(q=>q.id===x.id))return null;
   const o=ranked[0]?.q;if(!o||c(ctx,o)!=='ouv.sa2'||!flag(slot,o))return null;
   if(!(slot.selected||[]).map(qOf).some(q=>c(ctx,q)==='ouv.sa2'))return null;
   for(const z of ranked.slice(1)){
    const q=z.q,cost=ranked[0].v-z.v;
    if(!baseIds.has(q.id)||c(ctx,q)==='ouv.sa2'||!flag(slot,q)||!matched(ctx,o,q)||cost<0||cost>100)continue;
    repairs.push({key:sig(slot),id:q.id,oldId:o.id,cost});
   }
   return null;
  }));trials++;
  const simple=L.gain(ctx,baseline,first,byId);
  if(simple&&simple.id===x.id)return {policy:policy(firstRank(x)),decision:{...simple,first:x,repair:null},trials};
  for(const r of repairs.sort((a,b)=>a.cost-b.cost||a.id.localeCompare(b.id)).slice(0,3)){
   const repair=(slot,ranked)=>free(slot)&&sig(slot)===r.key&&ranked[0]?.q.id===r.oldId&&ranked.some(z=>z.q.id===r.id)?{id:r.id,oldId:r.oldId,reason:'conserver un rôle natif déplacé par le contraste',cost:r.cost}:null;
   const p=policy(firstRank(x),repair),candidate=run(p);trials++;
   const g=L.gain(ctx,baseline,candidate,byId);
   if(JSON.stringify(state)!==snapshot)throw Error('beam mutated history');
   if(g&&g.id===x.id)return {policy:p,decision:{...g,first:x,repair:r},trials};
  }
 }
 if(JSON.stringify(state)!==snapshot)throw Error('beam mutated history');
 return {policy:neutral,decision:null,trials};
}
module.exports={prepare};
