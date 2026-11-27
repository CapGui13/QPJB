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
  // Exact IDs seen on real S1–5 autonomous/11 pilot. Their contrast is
  // pedagogical, not a transfer credit or an arbitrary transposition.
  const realPairs=[
   ['SEF-002-3','SEF-PN26-M1-001','ouverture_mineure_ou_1SA_meme_distribution_zones_force_distinctes'],
   ['SEF-002-3','SEF-004-1','ouverture_1SA_ou_2SA_meme_distribution_zones_force_distinctes'],
   ['SEF-N023-1','SEF-007-2','passe_ou_ouverture_force_distribution_constante'],
   ['SEF-N088-1','SEF-033-1','reponse_sur_1SA_seuil_passe_invitation_manche'],
   ['SEF-N095-1','SEF-N084-1','stayman_quatre_ou_texas_cinq_cartes_force_comparable']
  ];
  for(const [a,b,criterion] of realPairs){
   const result=mod.order({session:8,deck:[a,b],exercises:[map.get(a),map.get(b)],metadataById:byId});
   ck(result.contrastPairs.some(x=>x.criterion===criterion),'catalogue contrast '+criterion);
  }
  const dependent=mod.order({session:8,deck:['SEF-004-1','SEF-002-3'],exercises:[map.get('SEF-004-1'),map.get('SEF-002-3')],metadataById:byId});
  ck(dependent.before.prereqOrderInversions===1&&dependent.after.prereqOrderInversions===0,'real prerequisite order');
  ck(dependent.ids[0]==='SEF-002-3','recall 1SA before 2SA');
  ck(mod.order(null).ids.length===0,'null context');
  // Six longitudinal counterexamples archived by the previous native run.
  const regressions=[
  [
    4,
    "themeABAB",
    "SEF-001-2 SEF-Q26-M1-010 SEF-N088-1 SEF-N017-2 SEF-N091-3 SEF-V49-004 SEF-N018-3 SEF-033-1 SEF-006-1 SEF-031-2"
  ],
  [
    2,
    "stageInversions",
    "SEF-PN26-M1-004 SEF-012-1 SEF-V410-022 SEF-N023-1 SEF-018-2 SEF-022-1 SEF-028-1 SEF-N025-2 SEF-N042-1 SEF-PN26-M1-005"
  ],
  [
    136,
    "stageInversions",
    "SEF-V49-006 SEF-L06-018 V2-M3-029 SEF-V425-004 SEF-V410-028 SEF-N037-1 SEF-V45-027 SEF-V410-009 SEF-V410-021 SEF-L34-005"
  ],
  [
    2,
    "stageInversions",
    "SEF-012-1 SEF-PN26-M1-004 SEF-V410-022 SEF-N023-1 SEF-018-2 SEF-022-1 SEF-028-1 SEF-N025-2 SEF-N042-1 SEF-PN26-M1-005"
  ],
  [
    12,
    "answerABAB",
    "SEF-V3-002-1 SEF-N018-3 SEF-N104-1 V2-M1-040 SEF-N105-2 SEF-N026-1 SEF-V421-012 SEF-Q26-M1-001 SEF-V486-007 SEF-V411-019"
  ],
  [
    172,
    "answerABAB",
    "SEF-025-1 SEF-N082-2 V2-M6-003 V2-M4-037 SEF-N049-1 SEF-V45-034 V2-M2-006 V1-M5-005 SEF-039-1 SEF-027-1"
  ]
];
  const regressionResults=[];
  for(const [session,metric,raw] of regressions){
   const deck=raw.split(' '),exercises=deck.map(id=>map.get(id));
   const ctx={session,deck,exercises,metadataById:byId};
   const v=mod.order(ctx);
   ck(v.before[metric]===1&&v.after[metric]===0,'historic regression '+session+' '+metric);
   ck(v.ids.slice().sort().join()===deck.slice().sort().join(),'regression permutation');
   ck(v.scoreAfter<v.scoreBefore,'regression strict gain');
   for(const k of [...mod.HARD,...mod.SOFT])ck(v.after[k]<=v.before[k],'regression guard '+k);
   ck(JSON.stringify(v)===JSON.stringify(mod.order(ctx)),'regression determinism');
   regressionResults.push({session,metric,ids:v.ids,rescueNodes:v.rescueNodes});
  }
  // Native French selection reasons must drive the explanatory role.
  const roleCases=[
   ['nouveau','nouveau_qcm',false,'acquisition'],
   ['nouveau','nouveau_qcm',true,'application'],
   ['nouveau','equilibre_ouvertures',false,'acquisition'],
   ['revision','rappel_question',true,'rappel'],
   ['revision','rappel_nouvelle_situation',true,'rappel'],
   ['revision','rappel_erreur_aide',true,'consolidation_ciblee'],
   ['nouveau','renforcement_lacune',true,'consolidation_ciblee'],
   ['nouveau','transfert_contexte',true,'reinvestissement_conditionnel']
  ];
  for(const [kind,reason,prior,role] of roleCases)
   ck(mod.annotateSelectionRole(kind,reason,prior)===role,'real selection role '+reason+' '+prior);
  const frenchSelected=ids.map((id,i)=>({id,kind:i%2?'revision':'nouveau',reason:i%2?'rappel_erreur_aide':'nouveau_qcm'}));
  const fr=mod.order({...ctx,selected:frenchSelected});
  ck(fr.reasons.every(x=>x.selectionReason===frenchSelected.find(y=>y.id===x.id).reason),'selection reason preserved');
  ck(fr.reasons.filter(x=>x.selectionReason==='rappel_erreur_aide').every(x=>x.baseRole==='consolidation_ciblee'),'targeted recall labels');
  const black=qs.filter(q=>byId[q.id].concept==='chelem.cles');
  const x=black[0],y=black.find(q=>q.answer!==x.answer);
  ck(x&&y&&mod.decisionPattern(x,byId[x.id])!==mod.decisionPattern(y,byId[y.id]),'Blackwood not falsely mirrored');
  ck(JSON.stringify(qs)===frozen&&JSON.stringify(byId)===metaFrozen,'catalogue and metadata immutable');
  return {status:'PASS',assertions,regressionResults,changed:r.changed,example:{before:ids,after:r.ids,metricsBefore:r.before,metricsAfter:r.after,contrastPairs:r.contrastPairs}};
 };
});
if(typeof require==='function'&&require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.join(__dirname,'..'),bench=require('./coherence-concrete-m2-replay.cjs'),mod=require('../quizz-coherence-m2-ordre.js');
 const read=p=>cp.execFileSync('git',['show',bench.BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const sources={'quizz.html':read('quizz.html')};
 const visit=p=>{if(Object.hasOwn(sources,p))return;sources[p]=read(p);for(const m of sources[p].matchAll(/require\(['"]\.\/([-\w]+\.js)['"]\)/g))visit(m[1]);};
 visit('quizz-parcours.js');
 const e=bench.prepare(sources,mod,false);
 const result=module.exports(mod,e.qs,e.metadata,e.api.decisionPattern);
 const c=bench.prepare(sources,mod,true),state=e.api.empty();
 for(let s=1;s<=3;s++){
  const deck=e.api.start(state,e.qs);
  for(let i=0;i<deck.length;i++)if(!e.api.record(state,deck[i],'wrong',i,null,false,false))throw Error('weak record');
  if(!e.api.finish(state,e.qs))throw Error('weak finish');
 }
 const clone=c.api.load(JSON.parse(JSON.stringify(state))),basePlan=e.api.consolidationPlan(state,e.qs),newPlan=c.api.consolidationPlan(clone,c.qs);
 const sort=a=>a.map(x=>x.id+'|'+x.target).sort().join();
 if(!basePlan.available||!newPlan.available||sort(basePlan.items)!==sort(newPlan.items))throw Error('consolidation ID/target permutation');
 const deck=c.api.startConsolidation(clone,c.qs);
 if(deck.map(x=>x.id).join()!==newPlan.items.map(x=>x.id).join())throw Error('consolidation order');
 if(!c.api.record(clone,deck[0],'correct',0,null,false,false))throw Error('consolidation record');
 c.api.move(clone,1);
 const snap=JSON.stringify(clone.active),resume=c.api.load(JSON.parse(JSON.stringify(clone)));
 if(c.api.start(resume,c.qs).map(x=>x.id).join()!==deck.map(x=>x.id).join()||JSON.stringify(resume.active)!==snap)throw Error('consolidation resume');
 console.log(JSON.stringify({...result,nativeConsolidation:{status:'PASS',length:deck.length,ids:deck.map(x=>x.id)}}));
}