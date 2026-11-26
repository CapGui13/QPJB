'use strict';
const G=require('../quizz-durable-m6-guards.js');
const L=require('../quizz-durable-m6-lab.js');
function suite(){
 let count=0;const ok=(v,m)=>{count++;if(!v)throw Error(m)},same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m),reject=(f,m)=>{let caught=false;try{f()}catch(e){caught=true}ok(caught,m)};
 const copy=x=>JSON.parse(JSON.stringify(x));
 const base={profile:'fixture',seed:47,model:'learning',horizon:20,universeKey:'reference',parameters:{x:1,y:2},checkpoints:[{session:20,day:19,families:100,concepts:50,proof:40,independent:60,debt:20,coreDebt:10,help:30,wrong:80,skipped:10,transferProof:25,duplicates:0,ineligible:0,short:0,variety:0,retention7:.6,retention30:.5,probeN:2,transferN:2,unseenFamilyProbe:.5,crossSessionNewFamily:27,
 probeRows:[{concept:'a',anchorId:'a0',seen:true,retention7:.6,retention30:.5,novel:[{id:'a1',family:'f1',p:.5},{id:'a2',family:'f2',p:.6}]},{concept:'b',anchorId:'b0',seen:true,retention7:.6,retention30:.5,novel:[{id:'b1',family:'f3',p:.5}]}]}]};
 ok(G.validatePair(base,copy(base)),'Identity pair');
 ok(G.validatePair(base,{...copy(base),parameters:{y:2,x:1}}),'Object key order not a change');
 for(const [field,value] of [['seed',11],['horizon',65],['universeKey','other'],['model','fixed'],['profile','other'],['ruleSource','other']])reject(()=>G.validatePair(base,{...copy(base),[field]:value}),'Unpaired '+field);
 reject(()=>G.validatePair(base,{...copy(base),checkpoints:[]}),'Empty trajectory');
 for(const field of ['families','concepts','proof','independent','debt','coreDebt','help','wrong','skipped','transferProof','duplicates','ineligible','short','variety','retention7','retention30']){
  for(const value of [undefined,null,NaN,Infinity,-1,'1']){const c=copy(base);c.checkpoints[0][field]=value;reject(()=>G.validatePair(base,c),'Invalid metric '+field);}
 }
 const alter=(fn,msg)=>{const c=copy(base);fn(c);reject(()=>G.validatePair(base,c),msg)};
 alter(c=>c.checkpoints[0].day=20,'Unpaired simulated day');
 alter(c=>c.checkpoints[0].probeN=3,'Unpaired probe count');
 alter(c=>c.checkpoints[0].probeRows[0].anchorId='different','Unpaired anchor');
 alter(c=>c.checkpoints[0].probeRows[1].concept='a','Duplicate concept');
 alter(c=>c.checkpoints[0].probeRows[0].novel.push(c.checkpoints[0].probeRows[0].novel[0]),'Duplicate novel probe');
 alter(c=>c.checkpoints[0].proof=100,'Impossible proof');
 alter(c=>c.checkpoints[0].retention30=1.1,'Impossible probability');
 alter(c=>c.checkpoints.push(copy(c.checkpoints[0])),'Extra checkpoint');
 alter(c=>c.events=[],'Incomplete event log');
 const after=copy(base);after.checkpoints[0].probeRows[0].novel=[{id:'a2',family:'f2',p:.4},{id:'a3',family:'f3',p:.9}];after.checkpoints[0].probeRows[1].seen=false;after.checkpoints[0].probeRows[1].novel=[];after.checkpoints[0].transferN=1;
 ok(G.validatePair(base,after),'Different opportunity cohorts allowed');
 const common=G.commonTransfer(base.checkpoints[0],after.checkpoints[0],47,L.random);
 same(common,{n:1,beforeN:2,afterN:1,before:.6,after:.4,delta:-.2,rows:[{concept:'a',id:'a2',family:'f2',before:.6,after:.4}]},'Same unseen exercise on both sides');
 const none=copy(after);none.checkpoints[0].probeRows[0].novel=[{id:'a3',family:'f3',p:.9}];
 const no=G.commonTransfer(base.checkpoints[0],none.checkpoints[0],47,L.random);ok(no.n===0&&no.delta===null&&no.before===null&&no.after===null,'No opportunity is not zero');
 ok(G.crossSessionNewFamily({families:new Set(['A']),sessions:new Set([1,2])},'B',2),'Prior different session despite same-session success');
 ok(!G.crossSessionNewFamily({families:new Set(['A']),sessions:new Set([2])},'B',2),'Same session does not prove transfer');
 ok(!G.crossSessionNewFamily({families:new Set(['A']),sessions:new Set([1])},'A',2),'Same family does not prove transfer');
 ok(!L.independent({result:'correct'}),'Missing flags do not prove autonomy');
 const ex={id:'a',caseFamily:'f',difficulty:1,answer:'1SA',choices:['1SA','Passe'],hand:'fixture',auction:[],context:'x'},m={byId:{a:{concept:'a'}}};
 ok(G.universeKey([ex],m)===G.universeKey([{...ex}],m),'Stable reference population');
 for(const [key,value] of [['difficulty',2],['caseFamily','g'],['answer','Passe'],['context','y']])ok(G.universeKey([ex],m)!==G.universeKey([{...ex,[key]:value}],m),'Changed reference '+key);
 ok(G.sameHistorical({a:1,b:[2,3]},{b:[2,3],a:1}),'Unordered object keys');
 ok(!G.sameHistorical({a:[2,3]},{a:[3,2]}),'Ordered arrays remain protected');
 reject(()=>G.stable({x:NaN}),'Nonfinite canonicalization');
 const p=L.profile('intermediaire'),universe=L.catalog([ex],m);
 const noRows=L.probes(p,47,{},universe,0),rows=L.probes(p,47,{},universe,0,true);
 const {probeRows,...other}=rows;same(noRows,other,'Optional rows preserve historical aggregates');ok(probeRows.length===1&&probeRows[0].seen===false&&probeRows[0].novel.length===0,'No invented history');
 return {status:'PASS',assertions:count};
}
module.exports={suite};if(require.main===module)console.log(JSON.stringify(suite()));
