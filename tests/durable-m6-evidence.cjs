'use strict';
const G=require('../quizz-durable-m6-guards.js');
function suite(){
 let assertions=0;
 const ok=(v,m)=>{assertions++;if(!v)throw Error(m)};
 const reject=(f,m)=>{let caught=false;try{f()}catch(e){caught=true}ok(caught,m)};
 const copy=x=>JSON.parse(JSON.stringify(x));
 const base={profile:'fixture',seed:47,model:'learning',horizon:2,universeKey:'reference',parameters:{pace:2},violations:[],
 events:[{s:1,day:0,ids:['a','b','c'],answers:[['a','correct',false,false],['b','correct',true,false],['c','wrong',false,false]]},{s:2,day:2,ids:['a','d','e'],answers:[['a','correct',false,true],['d','skipped',false,false],['e','correct',false,false]]}],
 checkpoints:[{session:2,day:2,ids:5,families:5,concepts:3,proof:1,independent:2,help:1,corrected:1,wrong:1,skipped:1,debt:0,coreDebt:0,transferProof:1,duplicates:0,ineligible:0,short:0,variety:0,retention7:.6,retention30:.5,probeN:1,transferN:0,unseenFamilyProbe:null,probeRows:[{concept:'a',anchorId:'a',seen:true,retention7:.6,retention30:.5,novel:[]}]}]};
 const pair=(a,b)=>G.validatePair(a,b,{requireEvents:true});
 ok(pair(base,copy(base)),'Valid event evidence');
 const mutate=(fn,m,both=false)=>{const a=copy(base),b=copy(base);fn(b);if(both)fn(a);reject(()=>pair(a,b),m)};
 for(const k of ['horizon','universeKey','events','violations'])mutate(r=>delete r[k],'Missing '+k,true);
 mutate(r=>r.universeKey='  ','Blank reference',true);
 mutate(r=>r.profile='','Blank profile',true);
 mutate(r=>delete r.checkpoints[0].day,'Missing checkpoint day',true);
 mutate(r=>r.checkpoints[0].day=3,'False checkpoint date',true);
 mutate(r=>r.events[0].day=1,'Intermediate date different');
 mutate(r=>r.events[0].startDay=1,'Impossible start date',true);
 mutate(r=>r.events[0].startDay=0,'Different start date');
 mutate(r=>{r.events[0].answers=[];r.events[0].ids=[]},'Empty session',true);
 mutate(r=>{r.events[0].answers[2][2]=true},'Wrong answer claimed assisted success',true);
 mutate(r=>{r.events[1].answers[1][3]=true},'Skipped answer claimed corrected',true);
 mutate(r=>{r.events[0].ids[0]='';r.events[0].answers[0][0]=''},'Empty exercise ID',true);
 for(const k of ['ids','independent','help','corrected','wrong','skipped']){
  mutate(r=>r.checkpoints[0][k]++,'Inflated '+k,true);
  mutate(r=>delete r.checkpoints[0][k],'Missing '+k,true);
 }
 mutate(r=>delete r.checkpoints[0].probeRows,'Missing probe evidence',true);
 mutate(r=>r.checkpoints.unshift({...r.checkpoints[0],session:1,day:0}),'Unscheduled checkpoint',true);
 const a=copy(base),b=copy(base);delete a.events;delete b.events;
 ok(G.validatePair(a,b),'Summary-only fixture still supported');
 reject(()=>G.validatePair(a,base),'Asymmetric log rejected even in summary mode');
 const alternative=copy(base);alternative.events[0].ids[0]='z';alternative.events[0].answers[0][0]='z';alternative.checkpoints[0].ids=6;
 ok(pair(base,alternative),'Different exercises valid in paired arms');
 return {status:'PASS',assertions};
}
module.exports={suite};if(require.main===module)console.log(JSON.stringify(suite()));