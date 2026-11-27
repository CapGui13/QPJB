'use strict';
// A / pass 2. Explore one substitution on the native selector; accept only
// after replay of the complete deck confirms the pedagogical improvement.
// No mutation of catalogue, state, order, eligibility or response evidence.
const A=require('./quizz-coherence-reprise6-a-composition.js');
const schema='QPJB_COHERENCE_M1_V1';
const qOf=x=>x?.exercise||x;
const c=(ctx,q)=>ctx.metadataById?.[q?.id]?.concept;
const m=(ctx,q)=>ctx.metadataById?.[q?.id];
const bid=x=>String(x||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const suit='♠♥♦♣';
function redRole(q){
 if(!q||!Array.isArray(q.auction)||q.auction.length!==2)return null;
 const first=String(q.auction[0]).match(/^Vous\s*:\s*1([♠♥♦♣])$/)?.[1];
 const second=String(q.auction[1]).match(/^Partenaire\s*:\s*1([♠♥♦♣]|SA)$/)?.[1];
 if(!first||!second)return null;
 const ans=bid(q.answer);
 if(ans==='1SA'&&second!=='SA'&&q.h>=12&&q.h<=14)return 'regular';
 if(ans==='2'+first&&q.shape?.[suit.indexOf(first)]>=6)return 'repeat';
 if(second!=='SA'&&second!==first&&ans==='2'+second&&q.shape?.[suit.indexOf(second)]>=4)return 'support';
 return null;
}
function role(ctx,q){return ctx.session===5&&c(ctx,q)==='red.base'?redRole(q):A.role(ctx,q)}
const count=(rows,key)=>{const a={};for(const q of rows){const k=key(q);if(k)a[k]=(a[k]||0)+1}return a};
function profile(ctx,deck){
 const concepts=count(deck,q=>c(ctx,q)),roles=count(deck,q=>role(ctx,q)),themes=count(deck,q=>q.theme);
 return {concepts,roles,themes};
}
const sameCounts=(a,b)=>Object.keys({...a,...b}).every(k=>(a[k]||0)===(b[k]||0));
function gain(ctx,before,after,byId){
 const b=before.map(x=>byId.get(x.id)),a=after.map(x=>byId.get(x.id));
 if(b.length!==10||a.length!==10||a.some(q=>!q)||b.some(q=>!q))return null;
 const old=b.filter(q=>!a.includes(q)),added=a.filter(q=>!b.includes(q));
 if(old.length!==1||added.length!==1)return null;
 const o=old[0],n=added[0],p=profile(ctx,b),r=profile(ctx,a);
 if(o.difficulty!==n.difficulty||m(ctx,o)?.stage!==m(ctx,n)?.stage)return null;
 if(Object.keys(p.concepts).some(k=>!r.concepts[k])||Object.keys(p.roles).some(k=>!r.roles[k]))return null;
 // Only one newly covered instructional role; avoid sacrificing existing
 // decision roles or the last representative of any concept.
 const missing=Object.keys(r.roles).filter(k=>!p.roles[k]);
 if(missing.length!==1)return null;
 if(ctx.session===3){
  if(c(ctx,o)!=='ouv.sa2'||p.concepts['ouv.sa2']<2||c(ctx,n)!=='majeur.soutien'||!p.roles['support-5-3']||missing[0]!=='passe-avec-fit')return null;
  if(r.concepts['ouv.sa2']!==p.concepts['ouv.sa2']-1)return null;
 }else if(ctx.session===5){
  if(c(ctx,o)!=='red.base'||c(ctx,n)!=='red.base'||!sameCounts(p.concepts,r.concepts)||!sameCounts(p.themes,r.themes)||!role(ctx,o)||p.roles[role(ctx,o)]<2)return null;
 }else return null;
 // Preserve reasons for every unchanged question: no hidden loss of recall.
 const prior=new Map(before.map(x=>[x.id,x]));
 if(after.some(x=>prior.has(x.id)&&(x.kind!==prior.get(x.id).kind||x.reason!==prior.get(x.id).reason)))return null;
 const source=prior.get(o.id),dest=after.find(x=>x.id===n.id);
 if(source.kind!=='nouveau'||source.reason!=='nouveau_qcm'||dest.kind!=='nouveau'||dest.reason!=='nouveau_qcm')return null;
 return {oldId:o.id,id:n.id,missing:missing[0],before:p,after:r};
}
function signature(ctx){return JSON.stringify((ctx.selected||[]).map(qOf).map(q=>q.id))}
function policy(compose){return Object.freeze({schema,plan:A.plan,prefer:ctx=>ctx.candidates,rank:()=>[],compose})}
function prepare({api,state,exercises,metadataById,options={},variant='lookahead',budget=24}){
 const session=state.completed+1,neutral=policy(()=>null);
 if(state.active||![3,5].includes(session)||(variant==='lookahead3'&&session!==3)||(variant==='lookahead5'&&session!==5))return {policy:neutral,decision:null,trials:0};
 const ctx={session,metadataById},byId=new Map(exercises.map(q=>[q.id,q])),choices=[];
 const frozen=JSON.stringify(state);
 const run=p=>api.select(exercises,state,10,{...options,observe:undefined,coherenceM1:p});
 const baseline=run(policy((slot,ranked)=>{
  if(slot.category!=='discovery'||slot.priority||slot.forcedReason||slot.changed||slot.history.active||!ranked[0]?.q)return null;
  const old=ranked[0].q,f=slot.flagsById?.[old.id],co=c(ctx,old);
  if(!f||f.bad||f.due||!f.novelFamily||!['ouv.sa2','red.base'].includes(co))return null;
  if(session===3&&co!=='ouv.sa2'||session===5&&co!=='red.base')return null;
  const sig=signature(slot);
  for(const x of ranked.slice(1)){
   const q=x.q,g=slot.flagsById?.[q.id],cost=ranked[0].v-x.v;
   if(!g||g.bad||g.due||!g.novelFamily||q.difficulty!==old.difficulty||m(ctx,q)?.stage!==m(ctx,old)?.stage||cost<0||cost>100)continue;
   if(session===3&&role(ctx,q)!=='passe-avec-fit')continue;
   if(session===5&&(c(ctx,q)!=='red.base'||!role(ctx,q)||role(ctx,q)===role(ctx,old)))continue;
   const sameAuction=JSON.stringify(q.auction)===JSON.stringify(old.auction),sameContext=q.context===old.context,pointGap=Math.abs(q.h-old.h);
   if(variant==='lookahead-context'&&(!sameAuction||pointGap>2))continue;
   choices.push({sig,oldId:old.id,id:q.id,cost,slot:slot.selected.length+1,role:role(ctx,q),sameAuction,sameContext,pointGap});
  }
  return null;
 }));
 const p=profile(ctx,baseline.map(x=>byId.get(x.id)));
 if(JSON.stringify(state)!==frozen)throw Error('lookahead mutated history');
 if(session===3&&(p.roles['passe-avec-fit']||!p.roles['support-5-3']||(p.concepts['ouv.sa2']||0)<2)||session===5&&['regular','repeat','support'].every(k=>p.roles[k]))return {policy:neutral,decision:null,trials:0};
 // Stable ranking by pedagogical opportunity and native score; no seed,
 // profile label, future responses or knowledge of the simulation outcome.
 const eligible=choices.filter(x=>!p.roles[x.role]&&(session!==5||(p.roles[role(ctx,byId.get(x.oldId))]||0)>=2)).sort((a,b)=>variant==='lookahead-context'?Number(b.sameContext)-Number(a.sameContext)||a.pointGap-b.pointGap||a.cost-b.cost||b.slot-a.slot||a.id.localeCompare(b.id):a.cost-b.cost||b.slot-a.slot||a.id.localeCompare(b.id));
 let trials=0;
 function forChoice(x){return policy((slot,ranked)=>signature(slot)===x.sig&&ranked[0]?.q.id===x.oldId&&ranked.some(z=>z.q.id===x.id)?{id:x.id,oldId:x.oldId,reason:'reprise6-a-lookahead-'+x.role,cost:x.cost}:null)}
 for(const x of eligible.slice(0,budget)){
  trials++;
  const candidate=run(forChoice(x)),g=gain(ctx,baseline,candidate,byId);
  if(JSON.stringify(state)!==frozen)throw Error('lookahead mutated history');
  if(g&&g.id===x.id&&g.oldId===x.oldId)return {policy:forChoice(x),decision:{...x,...g,session},trials};
 }
 if(JSON.stringify(state)!==frozen)throw Error('lookahead mutated history');
 return {policy:neutral,decision:null,trials};
}
module.exports={prepare,role,redRole,gain,profile};
