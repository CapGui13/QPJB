'use strict';
function run({A,P,meta,exercises,engine}){
 let assertions=0,targeted=0,newTargeted=0;
 const ok=(v,m)=>{assertions++;if(!v)throw Error(m)};
 const same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
 const history=engine.empty(),raw=JSON.stringify(history),before=JSON.stringify(exercises);
 ok(A.schema==='QPJB_DURABLE_INTEGRATION_V1','Integration contract');
 const ranked=[{q:{id:'historical',stratum:'core'},v:42},{q:{id:'other-concept',stratum:'other'},v:42},{q:{id:'equivalent',stratum:'core'},v:42},{q:{id:'inferior',stratum:'core'},v:41}];
 const key=q=>q.stratum;
 let passed=[];
 same(A.chooseWithinStratum(ranked,key,qs=>{passed=qs.map(q=>q.id);return [{id:'other-concept',delta:999},{id:'inferior',delta:999}];}).id,'historical','No cross-stratum or lower-score promotion');
 same(passed,['historical','equivalent'],'Only exact historical stratum is ranked');
 same(A.chooseWithinStratum(ranked,key,()=>[{id:'equivalent',delta:4}]).id,'equivalent','Meaningful tie-break within stratum');
 same(A.chooseWithinStratum(ranked,key,()=>[{id:'equivalent',delta:NaN}]).id,'historical','Reject invalid delta');
 same(A.chooseWithinStratum(ranked,key,()=>{throw Error('diagnostic failure')}).id,'historical','Fail closed');
 ok(exercises.length>=1915,'Historical catalogue floor');
 const ids=new Set(exercises.map(q=>q.id));
 ok(ids.size===exercises.length,'Unique live catalogue IDs');
 ok(Object.keys(meta.byId).length===ids.size&&exercises.every(q=>meta.byId[q.id]),'Exact live metadata coverage');
 const pairs=A.reviewedPairs(exercises,meta.byId);
 ok(pairs.length===22&&pairs.every(p=>p.kind==='transfer'&&!p.a.startsWith('SEF-AD26-M4-')&&!p.b.startsWith('SEF-AD26-M4-')&&p.evidence.automaticCredit===false),'Reviewed historical pairs only');
 ok(A.feedback({exercise:exercises[0]})===null,'No feedback before response');
 for(const q of exercises){
  for(const choice of q.choices.filter(c=>c!==q.answer)){
   const answer={id:q.id,result:'wrong',choice,assisted:false,hadFreeError:false};
   const f=A.feedback({exercise:q,answer,history}),old=P.feedback({exercise:q,answer,history});
   ok(f.canonical===q.explain,'Canonical '+q.id);
   if(old.kind==='targeted')same(f,old,'Preserve historical targeted '+q.id);
   if(f.kind==='targeted'||f.kind==='corrected-targeted')targeted++;
   if(f.kind==='targeted'&&old.kind!=='targeted')newTargeted++;
  }
 }
 ok(newTargeted>0,'Durable feedback adds coverage');
 const options=A.available({history,mode:'discovery'});
 ok(options.length>0,'Initial lessons available');
 for(const o of options){
  const lesson=A.lesson({history,concept:o.concept,mode:'discovery'});
  ok(lesson?.assessment===false&&lesson.assisted===true,'Unscored lesson');
  ok(A.lesson({history,concept:o.concept,mode:'discovery',questionActive:true})===null,'Question blocks lesson');
 }
 const active={...history,active:{ids:[exercises[0].id]}};
 ok(A.available({history:active,mode:'discovery'}).length===0,'Resumable session blocks all lessons');
 ok(A.mastery({history:active,exercises,metadataById:meta.byId,nowMs:Date.UTC(2026,0,1)})===null,'No active mastery screen');
 const report=A.mastery({history,exercises,metadataById:meta.byId,nowMs:Date.UTC(2026,0,1)});
 ok(report&&Object.keys(report.concepts).length===99&&Object.values(report.concepts).every(x=>x.mastery==='not_established'),'No categorical mastery');
 for(const completed of [0,2,19,20,65]){
  const h={...history,completed};
  const prepared=A.prepareSelection({history:h,exercises,metadataById:meta.byId,nowMs:Date.UTC(2026,0,1)});
  const candidates=exercises.slice(0,20);
  for(const category of ['discovery','maintenance','weakness','transfer']){
   same(prepared.rank({candidates,selected:[],category}),[],'No evidence neutral '+completed+' '+category);
   same(prepared.rank({candidates,selected:[],category,priority:true}),[],'Priority neutral');
   same(prepared.rank({candidates,selected:[],category,forcedReason:'rappel_erreur_aide'}),[],'Recall neutral');
  }
 }
 same(history,JSON.parse(raw),'History not mutated');same(exercises,JSON.parse(before),'Catalogue not mutated');
 return {status:'PASS',assertions,targeted,newTargeted,reviewedHistoricalPairs:pairs.length,initialLessons:options.length};
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const h=fs.readFileSync(path.join(__dirname,'../quizz.html'),'utf8'),exercises=JSON.parse(h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(run({A:require('../quizz-durable-integration.js'),P:require('../quizz-professeur.js'),meta:require('../quizz-prerequis.js'),engine:require('../quizz-parcours.js'),exercises})));
}
