'use strict';
// Reprise 6 A, experimental only. Native candidates, same selection category.
// Two variants: contrast (missing decision) and composition (missing concept).
const schema='QPJB_COHERENCE_M1_V1';
const targets={3:{title:'Fit majeur : reconnaître et décider',primary:['majeur.soutien','majeur.base'],secondary:['mineur.base','ouv.sa2','ouv.mineure','ouv.passe','ouv.sa1']},4:{title:'Sur 1SA : partielle, invitation, manche',primary:['sa1.seuil'],secondary:['majeur.soutien','mineur.base','ouv.sa1','ouv.majeure','mineur.soutien']},5:{title:'Redemande naturelle de l’ouvreur',primary:['red.base'],secondary:['sa1.seuil','majeur.base','mineur.base','sa1.stayman','sa1.texas']}};
const qOf=x=>x?.exercise||x;
const meta=(ctx,q)=>ctx.metadataById?.[q?.id];
const c=(ctx,q)=>meta(ctx,q)?.concept;
const bid=q=>String(q?.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
function role(ctx,q){
 const concept=c(ctx,q);
 if(ctx.session===3){const lead=String(q?.auction?.[0]||'').match(/:\s*(1[♥♠])(?:\s|$)/)?.[1];if(concept==='majeur.soutien'&&lead&&q.auction.length===1&&q.shape?.[lead[1]==='♠'?0:1]===3&&bid(q)==='2'+lead[1])return 'support-5-3';if(concept==='majeur.soutien'&&lead&&q.auction.length===1&&q.shape?.[lead[1]==='♠'?0:1]===3&&bid(q)==='Passe')return 'passe-avec-fit';return null}
 if(ctx.session===4&&concept==='sa1.seuil'&&['Passe','2SA','3SA'].includes(bid(q)))return bid(q);
 if(ctx.session===5&&concept==='red.base')return bid(q);
 return null;
}
function plan(ctx){const p=targets[ctx.session];return p?{...p,objective:p.title,window:[ctx.session,ctx.session+2],fallback:'Consolidation et créneaux prioritaires natifs inchangés'}:null}
function make(variant='contrast'){
 function compose(ctx,ranked){
  if(['balance','contrast-balance','saturation'].includes(variant))return null;
  const p=targets[ctx.session],best=ranked[0],selected=(ctx.selected||[]).map(qOf);
  if(variant==='early'&&(ctx.session!==3||selected.length!==1||c(ctx,selected[0])!=='ouv.sa2'))return null;
  if(!p||ctx.changed||ctx.priority||ctx.forcedReason||ctx.history?.active||ctx.category!=='discovery'||(variant!=='early'&&selected.length<4)||!best?.q)return null;
  const old=best.q,co=c(ctx,old),f=ctx.flagsById?.[old.id],m=meta(ctx,old);
  if(!m||!f||f.due||f.bad||(variant==='contrast'&&f.firstConcept)||(f.overdueCore&&!f.firstConcept)||!f.novelFamily||core.has(co)||p.primary.includes(co))return null;
  // Do not remove the only representative of the outgoing concept.
  if(!selected.some(q=>c(ctx,q)===co))return null;
  const already=selected.filter(q=>p.primary.includes(c(ctx,q))),roles=new Set(selected.map(q=>role(ctx,q)).filter(Boolean));
  if(already.length>=4)return null;
  const ids=new Set(ctx.candidates.map(q=>q.id));
  const alternative=ranked.slice(1).find(x=>{
   const q=x.q,n=meta(ctx,q),g=ctx.flagsById?.[q.id],r=role(ctx,q);
   if(!ids.has(q.id)||!n||!g||g.due||g.bad||!g.novelFamily||!p.primary.includes(c(ctx,q))||q.difficulty!==old.difficulty||n.stage>m.stage||best.v-x.v>100)return false;
   if(ctx.session===3)return r==='support-5-3'&&!roles.has(r);
   if(variant==='contrast')return !!r&&!roles.has(r);
   return already.length<3&&!selected.some(v=>c(ctx,v)===c(ctx,q)&&bid(v)===bid(q));
  });
  return alternative?{id:alternative.q.id,oldId:old.id,concept:c(ctx,alternative.q),role:role(ctx,alternative.q),reason:'redundant-concept-to-missing-'+variant,cost:best.v-alternative.v}:null;
 }
 function rank(ctx){
  if(!['balance','contrast-balance','saturation'].includes(variant)||ctx.session!==3||ctx.category!=='discovery'||ctx.priority||ctx.forcedReason||ctx.history?.active)return [];
  const selected=(ctx.selected||[]).map(qOf),roles=new Set(selected.map(q=>role(ctx,q)).filter(Boolean));
  const n2=selected.filter(q=>c(ctx,q)==='ouv.sa2').length;
  if(!n2)return [];
  const wanted=!roles.has('support-5-3')?'support-5-3':!roles.has('passe-avec-fit')?'passe-avec-fit':null;
  if(variant!=='saturation'&&(!wanted||!ctx.candidates.some(q=>role(ctx,q)===wanted&&q.difficulty===1)))return [];
  if(variant==='saturation'&&!ctx.candidates.some(q=>c(ctx,q)!=='ouv.sa2'&&q.difficulty===1&&meta(ctx,q)?.stage===0))return [];
  return ctx.candidates.flatMap(q=>{
   if(q.difficulty!==1||meta(ctx,q)?.stage!==0||ctx.history?.entries?.[q.id])return [];
   if(c(ctx,q)==='ouv.sa2')return [{id:q.id,delta:variant==='saturation'?Math.max(-100,-45*n2):-60,reason:'coût marginal d’une nouvelle ouverture 2SA en présence d’une alternative élémentaire'}];
   if(['contrast-balance','saturation'].includes(variant)&&wanted&&role(ctx,q)===wanted)return [{id:q.id,delta:35,reason:'contraste de décision de fit manquant'}];
   return [];
  });
 }
 return Object.freeze({schema,plan,prefer:ctx=>ctx.candidates,rank,compose,variant});
}
module.exports={make,plan,role,targets};
