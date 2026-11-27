'use strict';
const p=require('../quizz-coherence-m4p-b-policy.js'),assert=require('node:assert/strict');
function fixtures(){
 const exercises=[],metadataById={},make=(id,c)=>{const q={id,caseFamily:id,theme:'ouv',difficulty:2};exercises.push(q);metadataById[id]={concept:c,stage:1};return q;};
 const old=make('old','ouv.mineure'),keep=make('keep','ouv.mineure'),target=make('target','ouv.passe'),base=make('base','ouv.sa1');
 const other=Array.from({length:8},(_,i)=>make('x'+i,'other'+i)),journal=[];
 for(let s=1;s<70;s++){
  const qs=[old,keep,...other];if(s===15)qs[0]=target;if(s===55)qs[0]=base;
  journal.push({mode:'parcours',session:s,answers:qs.map(q=>({id:q.id,result:'correct',assisted:false,hadFreeError:false}))});
 }
 const ctx={session:70,history:{journal},exercises,metadataById,category:'maintenance',nativeCoreReservation:true,candidates:[target,base],selected:[],bad:()=>false,due:()=>false,novelFamily:()=>false,pool:[target],classify:()=> 'maintenance',bid:()=> '1♣',context:()=> 'ctx',openingPass:()=>false,fresh:()=>false};
 const deck=[old,keep,...other].map(exercise=>({exercise,kind:'revision',reason:'rappel_question'}));
 return {ctx,deck,old,keep,target,base};
}
function run(){
 let n=0;const check=(condition,msg)=>{assert.ok(condition,msg);n++};
 const {ctx,deck,old,target,base}=fixtures(),snapshot=JSON.stringify(ctx.history);
 check(p.evidence(ctx).stable,'stable');
 check(p.stats(p.evidence(ctx),'ouv.passe',70).gap===55,'gap');
 check(p.rank(ctx)[0].id===target.id,'EDF priority');
 check(p.rank({...ctx,session:20}).length===0,'no S1–20');
 check(p.rank({...ctx,history:{...ctx.history,active:{}}}).length===0,'resume');
 check(p.rank({...ctx,history:{journal:ctx.history.journal.slice(1)}}).length===0,'incomplete history');
 check(p.rank({...ctx,selected:[target]}).every(x=>x.id!==target.id),'selected excluded');
 check(p.rank({...ctx,forcedReason:'rappel_erreur_aide'}).length===0,'error priority');
 const rows=[{q:base,v:100},{q:target,v:95}];
 check(p.chooseRank(ctx,rows,base).q===target,'positive EDF substitution');
 check(p.chooseRank({...ctx,nativeCoreReservation:false,discretionary:true},rows,base).q===base,'do not displace sole concept');
 check(p.chooseRank({...ctx,bad:q=>q===target},rows,base).q===base,'weak protected');
 const m=p.replace(ctx,deck,[{index:0,baseline:old}]);
 check(m.q===target,'redundant slot replaced');
 check(m.deck.length===10&&m.deck.slice(1).every((x,i)=>x===deck[i+1]),'nine identical objects');
 check(m.repeatAfter===m.repeatBefore,'repeat budget unchanged');
 check(p.replace({...ctx,novelFamily:q=>q===old},deck,[{index:0,baseline:old}]).deck===deck,'no loss of new family');
 check(p.replace({...ctx,session:65},deck,[{index:0,baseline:old}]).deck===deck,'M after S65');
 check(p.replace({...ctx,openingPass:q=>q===target},deck,[{index:0,baseline:old}]).deck===deck,'no increased opening pass count');
 check(p.replace({...ctx,bad:q=>q===old},deck,[{index:0,baseline:old}]).deck===deck,'no weak displacement');
 check(p.replace({...ctx,history:{journal:ctx.history.journal.slice(1)}},deck,[{index:0,baseline:old}]).deck===deck,'no incomplete history');
 check(JSON.stringify(ctx.history)===snapshot,'pure history');
 check(p.replace(ctx,deck,[{index:0,baseline:old}]).q===target,'determinism');
 const fragile=JSON.parse(JSON.stringify(ctx.history));for(const e of fragile.journal.slice(-10))for(const a of e.answers)a.assisted=true;
 check(!p.evidence({...ctx,history:fragile}).stable,'assisted');
 check(p.replace({...ctx,history:fragile},deck,[{index:0,baseline:old}]).deck===deck,'assisted abstention');
 check(p.rank({...ctx,history:fragile}).length===0,'assisted rank');
 return n;
}
module.exports={run};
if(require.main===module)console.log(run()+' assertions PASS');
