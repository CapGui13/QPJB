/* QPJB #400 — lecture de paires, aucune sélection, mutation ni crédit automatique. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBDurableTransfer=factory();})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const valid=p=>p&&typeof p.a==='string'&&typeof p.b==='string'&&p.a!==p.b&&Array.isArray(p.concepts)&&p.concepts.length>0&&typeof p.criterion==='string'&&p.criterion.length>0&&typeof p.contextDifference==='string'&&p.contextDifference.length>0&&p.evidence&&p.evidence.automaticCredit===false;
function links({id,concept,contrasts,candidates}={}){
 if(typeof id!=='string'||!Array.isArray(contrasts)||!Array.isArray(candidates))return [];
 const eligible=new Set(candidates.map(x=>typeof x==='string'?x:x&&x.id).filter(Boolean));const seen=new Set(),out=[];
 for(const p of contrasts){if(!valid(p)||concept&&!p.concepts.includes(concept))continue;const other=p.a===id?p.b:p.b===id?p.a:null;if(!other||!eligible.has(other)||seen.has(other))continue;seen.add(other);out.push({id:other,criterion:p.criterion,contextDifference:p.contextDifference,kind:p.evidence.kind,automaticCredit:false});}
 return out;
}
return Object.freeze({schema:'QPJB_DURABLE_TRANSFER_V1',links});
});
