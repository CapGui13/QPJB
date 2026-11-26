'use strict';
// Catalogue-based unit checks, also runnable in a real browser offline.
(function(root,factory){
 const verify=factory();
 if(typeof module==='object'&&module.exports)module.exports=verify;
 else root.verifyM2Order=verify;
})(typeof window==='undefined'?globalThis:window,function(){
 return function verify(mod,qs,meta,nativePattern){
  let assertions=0;const ck=(x,m)=>{assertions++;if(!x)throw Error(m)};
  const map=new Map(qs.map(q=>[q.id,q])),byId=meta.byId||meta;
  ck(qs.length===1915,'catalogue size');
  ck(Object.keys(byId).length===1915,'metadata size');
  const frozen=JSON.stringify(qs),metaFrozen=JSON.stringify(byId);
  for(const q of qs){
   ck(typeof mod.decisionPattern(q,byId[q.id])==='string','pattern '+q.id);
   if(nativePattern)ck(mod.decisionPattern(q,byId[q.id])===nativePattern(q),'historical pattern parity '+q.id);
  }
  const main=qs.filter(q=>q.theme==='ouv'&&!q.auction?.length);
  const tie=(n,a)=>main.find(q=>q.shape[2]===n&&q.shape[3]===n&&q.shape[0]<5&&q.shape[1]<5&&q.answer===a&&byId[q.id].concept==='ouv.mineure');
  const a=tie(3,'1♣'),b=tie(4,'1♦');ck(a&&b&&a.caseFamily!==b.caseFamily,'real meilleure mineure pair');
  const other=qs.filter(q=>q.theme!=='ouv'&&q.difficulty===1).slice(0,5);
  const items=[a,...other,b],ids=items.map(q=>q.id),selected=ids.map((id,i)=>({id,kind:i%2?'maintenance':'discovery',reason:'fixture-'+i}));
  const ctx={session:8,deck:ids,exercises:items,metadataById:byId,selected,history:{completed:7}};
  const snapshot=JSON.stringify(ctx),r=mod.order(ctx);
  ck(r.ids.length===ids.length&&r.ids.slice().sort().join()===ids.slice().sort().join(),'permutation');
  ck(r.reasons.every((x,i)=>x.id===r.ids[i]&&x.position===i+1),'position reasons');
  ck(r.contrastPairs.some(x=>x.criterion==='meilleure_mineure_egalite_3_3_4_4'),'real contrast');
  ck(JSON.stringify(r)===JSON.stringify(mod.order(ctx)),'determinism');
  ck(JSON.stringify(ctx)===snapshot,'purity');
  ck(!r.changed||r.scoreAfter<r.scoreBefore,'strict gain');
  for(const k of [...mod.HARD,...mod.SOFT])ck(r.after[k]<=r.before[k],'metric '+k);
  ck(mod.order({...ctx,history:{active:{ids}}}).ids.join()===ids.join(),'active session unchanged');
  ck(mod.order({...ctx,metadataById:{}}).ids.join()===ids.join(),'missing metadata fallback');
  ck(mod.order({...ctx,deck:[ids[0],ids[0]]}).status==='invalid-context','duplicate rejected');
  for(let n=0;n<4;n++){
   const d=ids.slice(0,n),v=mod.order({...ctx,deck:d});
   ck(v.ids.slice().sort().join()===d.slice().sort().join(),'small pool '+n);
  }
  const twenty=qs.slice(0,20).map(q=>q.id);
  const twentyResult=mod.order({...ctx,session:66,deck:twenty,exercises:qs});
  ck(twentyResult.ids.slice().sort().join()===twenty.slice().sort().join(),'20 IDs');
  const black=qs.filter(q=>byId[q.id].concept==='chelem.cles');
  const x=black[0],y=black.find(q=>q.answer!==x.answer);
  ck(x&&y&&mod.decisionPattern(x,byId[x.id])!==mod.decisionPattern(y,byId[y.id]),'Blackwood not falsely mirrored');
  ck(JSON.stringify(qs)===frozen&&JSON.stringify(byId)===metaFrozen,'catalogue and metadata immutable');
  return {status:'PASS',assertions,changed:r.changed,example:{before:ids,after:r.ids,metricsBefore:r.before,metricsAfter:r.after,contrastPairs:r.contrastPairs}};
 };
});
if(typeof require==='function'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.join(__dirname,'..'),bench=require('./coherence-concrete-m2-replay.cjs'),mod=require('../quizz-coherence-m2-ordre.js');
 const read=p=>cp.execFileSync('git',['show',bench.BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const sources={'quizz.html':read('quizz.html')};
 const visit=p=>{if(Object.hasOwn(sources,p))return;sources[p]=read(p);for(const m of sources[p].matchAll(/require\(['"]\.\/([-\w]+\.js)['"]\)/g))visit(m[1]);};
 visit('quizz-parcours.js');
 const e=bench.prepare(sources,mod,false);
 console.log(JSON.stringify(module.exports(mod,e.qs,e.metadata,e.api.decisionPattern)));
}