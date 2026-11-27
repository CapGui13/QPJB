/* #424 — suggestions facultatives, sans sélection, notation ni stockage. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-durable-m5-lecons.js'));
 else root.QPJBCoherenceM5=factory(root.QPJBDurableLessons);
})(typeof window==='undefined'?globalThis:window,function(lessons){
 'use strict';
 const schema='QPJB_COHERENCE_M5_V1';
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const own=(o,k)=>obj(o)&&Object.hasOwn(o,k);
 const cmp=(a,b)=>a<b?-1:a>b?1:0;
 const freeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(freeze);Object.freeze(x)}return x};
 const blank=(status,phase=null)=>freeze({schema,status,phase,before:[],after:[],holds:[]});
 function objectiveConcepts(o){
  const found=new Set();
  function add(v){if(typeof v==='string'&&v.length&&v.length<100)found.add(v);else if(Array.isArray(v))v.forEach(add);else if(obj(v)){if(typeof v.concept==='string')add(v.concept);if(Array.isArray(v.concepts))add(v.concepts)}}
  if(typeof o==='string')add(o);
  else if(obj(o))for(const k of ['primary','principal','primaryConcept','concept','concepts','targetConcepts','conceptsCibles','secondary','secondaires'])if(own(o,k))add(o[k]);
  return found;
 }
 function studyPlan(ctx){
  if(!obj(ctx)||!obj(ctx.history)||ctx.history.active!==null||
    (ctx.questionActive!==undefined&&ctx.questionActive!==false)||
    (ctx.quizActive!==undefined&&ctx.quizActive!==false)||
    ctx.exercise!=null||ctx.answer!=null||ctx.mode==='assessment'||ctx.mode==='consolidation')return blank('unsafe');
  const h=ctx.history,s=ctx.session,meta=ctx.metadataById;
  if(!Number.isInteger(s)||s<1||!Number.isInteger(h.completed)||h.completed<0||
    !Array.isArray(h.journal)||!obj(h.entries)||!obj(meta))return blank('invalid');
  const phase=s===h.completed+1?'before':s===h.completed?'after':null;
  if(!phase||(ctx.phase!==undefined&&ctx.phase!==phase))return blank('invalid');
  if(lessons?.schema!=='QPJB_DURABLE_LESSONS_V1')return blank('unavailable',phase);
  const target=objectiveConcepts(ctx.objective),stats=new Map(),holds=[];
  const concept=id=>typeof id==='string'&&own(meta,id)&&typeof meta[id]?.concept==='string'?meta[id].concept:null;
  function stat(c){if(!stats.has(c))stats.set(c,{concept:c,n:0,wrong:0,help:0,skip:0,objective:target.has(c)});return stats.get(c)}
  if(phase==='before'){
   // Selected = preview of actual engine deck from an isolated copy, never active state.
   if(ctx.selected!=null&&!Array.isArray(ctx.selected))return blank('invalid',phase);
   const preview=Array.isArray(ctx.selected)&&ctx.selected.length>0;
   if(preview){
    const unique=new Set();
    for(const q of ctx.selected){const id=typeof q==='string'?q:q?.id,c=concept(id);
     if(!c||unique.has(id))return blank('invalid-preview',phase);
     unique.add(id);stat(c).n++;
    }
   }else{
    // An explicit objective may be used without a preview; never infer it from all candidates.
    for(const c of target)if(Object.values(meta).some(m=>m?.concept===c))stat(c);
    if(!stats.size)return blank('no-objective',phase);
   }
  }else{
   const events=h.journal.filter(e=>e?.mode==='parcours'&&e.session===s);
   if(events.length!==1||!Array.isArray(events[0].answers)||!events[0].answers.length)return blank('no-completed-evidence',phase);
   const unique=new Set();
   for(const a of events[0].answers){
    const c=concept(a?.id);
    if(!c||unique.has(a.id)||!['correct','wrong','skipped'].includes(a.result))return blank('invalid-evidence',phase);
    unique.add(a.id);const v=stat(c);v.n++;
    if(a.result==='wrong')v.wrong++;
    else if(a.result==='skipped')v.skip++;
    else if(a.assisted===true||a.hadFreeError===true)v.help++;
   }
  }
  // Existing lesson API is the single source of availability. Do not send preview IDs
  // or answer data into it; it intentionally rejects an assessment context.
  const safe={history:h,questionActive:false};
  const discover=new Map(phase==='before'?lessons.available({...safe,mode:'discovery'}).map(x=>[x.concept,x]):[]);
  const recall=new Map(lessons.available({...safe,mode:'reminder'}).map(x=>[x.concept,x]));
  const pool=[];
  for(const v of stats.values()){
   const c=v.concept;
   if(phase==='after'&&!v.wrong&&!v.help)continue; // Skip alone is not evidence of weakness.
   const mode=discover.has(c)?'discovery':recall.has(c)?'reminder':null;
   if(!mode){holds.push({concept:c,reason:'historical-lesson-unavailable'});continue}
   const l=lessons.lesson({...safe,concept:c,mode});
   if(!l||l.assessment!==false||l.assisted!==true){holds.push({concept:c,reason:'historical-lesson-unavailable'});continue}
   const priority=phase==='before'?(v.objective?100:0)+v.n*4+(mode==='discovery'?2:0):v.wrong*5+v.help*3+(v.objective?1:0);
   // No IDs, context, example, answer, rule or check in suggestions. UI may resolve
   // the existing lesson before start, showing only its rule (no worked QCM).
   const reason=phase==='before'?(v.objective?'objectif déclaré et compatible avec la séance':'notion prévue dans la séance')+(mode==='discovery'?' ; découverte facultative':' ; rappel facultatif'):
      v.wrong&&v.help?'erreur et recours à une aide observés':v.wrong?'erreur observée':'aide ou première enchère erronée observée';
   pool.push({priority,item:{concept:c,title:l.title,mode,reason,presentation:phase==='before'?'rule-only':'reminder-only',optional:true,assessment:false,assisted:true}});
  }
  pool.sort((a,b)=>b.priority-a.priority||cmp(a.item.concept,b.item.concept));
  holds.sort((a,b)=>cmp(a.concept,b.concept));
  const cap=phase==='before'?(s===1?4:3):2;
  for(const p of pool.slice(cap))holds.push({concept:p.item.concept,reason:'optional-load-limit'});
  const selected=pool.slice(0,cap).map(x=>x.item);
  return freeze({schema,status:'ok',phase,before:phase==='before'?selected:[],after:phase==='after'?selected:[],holds});
 }
 return Object.freeze({schema,studyPlan});
});
