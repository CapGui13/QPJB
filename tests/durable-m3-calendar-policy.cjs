'use strict';
// M3: direct policy qualification on all frozen concepts, separate from the selector.
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
function run(api,qs,meta){
 const D=86400000,T=Date.UTC(2025,0,1),groups=new Map();
 for(const q of qs){const k=meta[q.id].concept;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(q);}
 let checks=0;const ok=(v,m)=>{checks++;if(!v)throw Error(m)};
 const eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
 const answer=(q,weak=false)=>({id:q.id,result:weak?'wrong':'correct',choice:weak?q.choices.find(x=>x!==q.answer):q.answer,assisted:false,hadFreeError:false,family:q.caseFamily});
 const event=(n,t,q,weak=false)=>({mode:'parcours',session:n,recordedAt:t===null?null:new Date(t).toISOString(),answers:[answer(q,weak)]});
 const state=(journal,completed)=>({version:1,completed,journal,entries:{},skills:{}});
 const coverage=[];
 for(const [concept,pool] of groups){
  const [a,b,c]=[...new Map(pool.map(q=>[q.caseFamily,q])).values()];
  const clean=[event(1,T,a),event(2,T+D,b),event(3,T+31*D,c)];
  const cases=[
   ['fresh',state(clean,3),T+32*D,false],
   ['calendar_due',state(clean,3),T+90*D,true],
   ['both_due',state(clean,30),T+90*D,false],
   ['session_only',state(clean,30),T+32*D,false],
   ['undated',state(clean.map(e=>({...e,recordedAt:null})),30),T+90*D,false],
   ['future',state(clean,3),T+2*D,false],
   ['fragile',state([...clean,event(4,T+32*D,a,true)],4),T+90*D,false]
  ];
  for(const [name,history,nowMs,want] of cases){
   const input={history,nowMs,exercises:[a,b,c],candidates:[a,b,c],category:'maintenance',policy:'calendar'};
   const before=JSON.stringify(input),s=api.assess(input).concepts[concept],rank=api.rankReview(input);
   eq(rank.length>0,want,concept+' '+name);
   eq(rank.length>0,s.reviewDue===true&&s.review.timeDue===true&&s.review.sessionDue!==true&&!s.fragile,concept+' '+name+' predicate');
   eq(rank,api.prepareReview(input).rank(input),concept+' '+name+' prepared parity');
   eq(JSON.stringify(input),before,concept+' '+name+' pure');
   ok(rank.every(x=>x.concept===concept&&x.delta>0&&x.delta<=12&&input.candidates.some(q=>q.id===x.id)),concept+' '+name+' cap and eligible IDs');
   if(want){
    eq(rank.length,3,concept+' candidates');
    eq(api.rankReview({...input,selected:[{exercise:a}]}),[],concept+' selected concept');
    eq(api.rankReview({...input,history:{...history,active:{ids:[a.id]}}}),[],concept+' active');
    eq(api.rankReview({...input,priority:true}),[],concept+' priority');
    eq(api.rankReview({...input,forcedReason:'rappel_erreur_aide'}),[],concept+' explicit recall');
    eq(api.rankReview({...input,category:'weakness'}),[],concept+' weakness');
    eq(api.rankReview({...input,policy:'unknown'}),[],concept+' unknown policy');
    eq(api.rankReview({...input,candidates:[{id:'unknown'}]}),[],concept+' unknown candidate');
   }
  }
  coverage.push({concept,scenarios:cases.length,result:'PASS'});
 }
 eq(groups.size,99,'99 concepts');eq(qs.length,1915,'1915 exercises');
 return {schema:'QPJB_M3_CALENDAR_POLICY_TEST_V1',checks,concepts:groups.size,scenarios:groups.size*7,coverage,execution:'direct CommonJS module, real frozen catalogue; synthetic histories'};
}
module.exports={run};
if(require.main===module){
 const {execFileSync}=require('node:child_process'),path=require('node:path');
 const read=p=>execFileSync('git',['show',BASE+':'+p],{cwd:path.join(__dirname,'..'),encoding:'utf8',maxBuffer:8*1024*1024});
 const m={exports:{}};new Function('module','exports','window',read('quizz-prerequis.js'))(m,m.exports,undefined);
 const qs=JSON.parse(read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(run(require('../quizz-durable-m3-maitrise.js'),qs,m.exports.byId),null,2));
}
