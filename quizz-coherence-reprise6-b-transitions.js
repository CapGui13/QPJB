/* #508 — experimental, NOT wired into production. */
'use strict';
const schema='QPJB_REPRISE6_B_V1';
const specs=Object.freeze({
  'SEF-V416-008':{group:'S',concept:'sa1.stayman.suite',need:'stayman-2SA'},
  'SEF-V416-009':{group:'S',concept:'sa1.stayman.suite',need:'stayman-2SA'},
  'SEF-V3-017-2':{group:'X',concept:'sa1.texas.suite',need:'texas-coeur'},
  'SEF-V3-017-1':{group:'X',concept:'sa1.texas.suite',need:'texas-coeur'},
  'SEF-V3-018-1':{group:'X',concept:'sa1.texas.suite',need:'texas-coeur'},
  'SEF-V3-019-3':{group:'X',concept:'sa1.texas.suite',need:'texas-pique'},
  'SEF-V3-019-1':{group:'X',concept:'sa1.texas.suite',need:'texas-pique'},
  'SEF-V3-020-1':{group:'X',concept:'sa1.texas.suite',need:'texas-pique'}
});
const sources=Object.freeze({
 'stayman-2SA':Object.freeze(['SEF-V416-007','SEF-PN26-M1-033']),
 'texas-coeur':Object.freeze(['SEF-037-1','SEF-039-2','SEF-039-1','SEF-N082-2','SEF-N084-1','SEF-V44-015','SEF-C-003','V2-M2-030']),
 'texas-pique':Object.freeze(['SEF-038-1','SEF-040-2','SEF-N085-1','SEF-N087-2','SEF-V44-016','SEF-V49-017','V2-M2-018'])
});
const sourceConcept={'stayman-2SA':'sa1.stayman.reponse','texas-coeur':'sa1.texas','texas-pique':'sa1.texas'};
function assess(q,{state,e,metadataById,mode}){
 const spec=specs[q.id];
 if(!spec||!['S','X','SX'].includes(mode)||!mode.includes(spec.group)||state.completed<3)return {allow:true,reason:'outside'};
 if(metadataById[q.id]?.concept!==spec.concept)return {allow:true,reason:'metadata-drift'};
 const observed=e.seen.get(spec.concept)||new Set();
 // Do not suppress assessment/review of an already met question, weak
 // concept, old save, or any ongoing session. No credit for the new gate.
 if(state.active||observed.has(q.id)||state.entries?.[q.id]||e.weakConcept[spec.concept])return {allow:true,reason:'preserve-recall'};
 const ids=sources[spec.need].filter(id=>e.seen.get(sourceConcept[spec.need])?.has(id));
 return {allow:ids.length>0,reason:ids.length?'specific-exposure':'missing-specific-exposure',need:spec.need,ids,grantsProof:false};
}
function filter(pool,ctx){
 if(!['S','X','SX'].includes(ctx.mode))return pool;
 const decisions=pool.map(q=>({q,...assess(q,ctx)})),kept=decisions.filter(x=>x.allow).map(x=>x.q);
 if(new Set(kept.map(q=>String(q.caseFamily||q.id))).size<ctx.limit)return pool;
 if(typeof ctx.observe==='function'){
  const blocked=decisions.filter(x=>!x.allow).map(x=>({id:x.q.id,need:x.need}));
  if(blocked.length)ctx.observe({session:ctx.state.completed+1,kind:'specific-exposure-pool',blocked});
 }
 return kept;
}
// Test-only source adapter: exactly one post-native-eligibility insertion;
// no mutation of metadata, quotas, native ranking, final order or state.
function instrument(source){
 const marker='    let pool=eligiblePool(exercises,state,e);';
 if(source.split(marker).length!==2)throw Error('M3B integration anchor drift');
 return source.replace(marker,marker+'\n    if(options.coherenceReprise6B?.schema==="QPJB_REPRISE6_B_V1")pool=options.coherenceReprise6B.filter(pool,{state,e,metadataById:prerequis.byId,mode:options.coherenceReprise6B.mode,limit,observe:options.observe});');
}
const policy=mode=>Object.freeze({schema,mode,filter});
module.exports={schema,specs,sources,assess,filter,instrument,policy};
