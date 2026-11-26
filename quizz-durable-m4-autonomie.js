/* QPJB M4 #400 — filtre éditorial de candidats de transfert, pas une mesure de maîtrise. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBDurableTransferAutonomy=factory();})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const known=new Set(['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial']);
function status(id,reviews){
 if(typeof id!=='string'||!Array.isArray(reviews))return 'unreviewed';
 let result='unreviewed';const priority={unreviewed:0,coherent_in_catalogue_framework:1,bounded_context:2,guided_not_independent:3,hold_editorial:4};
 for(const r of reviews){const d=r&&r.byId;if(!d||!Object.prototype.hasOwnProperty.call(d,id))continue;const s=d[id]?.status;if(!known.has(s))continue;if(priority[s]>priority[result])result=s}
 return result;
}
function inspect({pair,reviews}={}){
 const a=pair?.a,b=pair?.b;
 const statuses=[status(a,reviews),status(b,reviews)];
 let reason='candidate_only';
 if(typeof a!=='string'||typeof b!=='string'||a===b||pair?.evidence?.automaticCredit!==false||pair?.evidence?.review?.classification!=='intercontextual'||pair?.evidence?.transferEvidenceEligible!==true)reason='not_intercontextual_candidate';
 else if(statuses.includes('hold_editorial'))reason='editorial_hold';
 else if(statuses.includes('guided_not_independent'))reason='guided_prompt';
 else if(statuses.includes('bounded_context'))reason='bounded_context';
 else if(statuses.includes('unreviewed'))reason='editorial_review_missing';
 return {a:a??null,b:b??null,statuses,reason,eligibleForIndependentProbe:reason==='candidate_only',automaticCredit:false};
}
function filter({id,contrasts,reviews,candidates}={}){
 if(typeof id!=='string'||!Array.isArray(contrasts)||!Array.isArray(reviews)||!Array.isArray(candidates))return [];
 const eligible=new Set(candidates.map(x=>typeof x==='string'?x:x?.id).filter(x=>typeof x==='string')),seen=new Set(),out=[];
 for(const pair of contrasts){const p=inspect({pair,reviews});const other=p.a===id?p.b:p.b===id?p.a:null;if(!p.eligibleForIndependentProbe||!other||!eligible.has(other)||seen.has(other))continue;seen.add(other);out.push({id:other,criterion:pair.criterion,automaticCredit:false,reason:p.reason})}
 return out;
}
return Object.freeze({schema:'QPJB_DURABLE_TRANSFER_AUTONOMY_V1',inspect,filter});
});
