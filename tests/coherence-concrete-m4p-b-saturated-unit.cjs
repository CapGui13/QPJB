'use strict';
const assert=require('node:assert/strict'),p=require('../quizz-coherence-m4p-b-saturated.js');
function run(){
 let count=0;const ck=(c,m)=>{assert.ok(c,m);count++;};
 const exercises=[],metadataById={},make=(id,c)=>{const q={id,caseFamily:id,theme:'ouv',difficulty:2};exercises.push(q);metadataById[id]={concept:c,stage:1};return q;};
 const old=make('old','ouv.mineure'),keep=make('keep','ouv.mineure'),third=make('third','ouv.mineure'),target=make('target','ouv.passe'),target2=make('target2','ouv.passe');
 const other=Array.from({length:8},(_,i)=>[make('x'+i+'a','other'+i),make('x'+i+'b','other'+i)]),journal=[];
 for(let s=1;s<70;s++){
  const qs=[s===12?target2:s===15?target:s%3===0?third:old,keep,...other.map(q=>q[s%2])];
  journal.push({mode:'parcours',session:s,answers:qs.map(q=>({id:q.id,result:'correct',assisted:false,hadFreeError:false}))});
 }
 const ctx={session:70,history:{journal},exercises,metadataById,pool:[target],classify:()=> 'maintenance',bad:()=>false,due:()=>false,weak:()=>false,novelFamily:()=>false,openingPass:()=>false,bid:()=> '1♣',context:()=> 'ctx',fresh:()=>false,localTarget:()=>2,passCap:1,objective:{allowExhaustedCatalogueRecall:true}};
 const deck=[old,keep,...other.map(q=>q[0])].map(exercise=>({exercise,kind:'revision',reason:'rappel_question'})),slots=[{index:0,baseline:old,category:'maintenance',priority:false}],snap=JSON.stringify(ctx.history);
 ck(p.saturated(ctx),'saturation plus lifetime evidence');
 const result=p.replace(ctx,deck,slots);
 ck(result.q===target,'positive P');
 ck(result.saturatedFamilies===exercises.length&&result.noveltyCost===0,'saturated, no novelty loss');
 ck(result.deck.slice(1).every((x,i)=>x===deck[i+1]),'nine unchanged');
 ck(p.replace({...ctx,objective:{}},deck,slots).deck===deck,'default off');
 ck(!p.saturated({...ctx,session:65}),'no early change');
 ck(!p.saturated({...ctx,history:{...ctx.history,active:{}}}),'active resume');
 ck(!p.saturated({...ctx,history:{journal:journal.slice(1)}}),'incomplete history');
 const extra={id:'extra',caseFamily:'extra',theme:'ouv',difficulty:2};
 ck(!p.saturated({...ctx,exercises:[...exercises,extra],metadataById:{...metadataById,extra:{concept:'ouv.mineure',stage:1}}}),'unseen catalogue family');
 ck(!p.saturated({...ctx,metadataById:{...metadataById,target2:{concept:'other-new',stage:1}}}),'concept without multiple proofs');
 const assisted=JSON.parse(JSON.stringify(journal));assisted.at(-1).answers[0].assisted=true;
 ck(!p.saturated({...ctx,history:{journal:assisted}}),'recent independent window');
 ck(JSON.stringify(ctx.history)===snap,'pure history');
 ck(p.replace(ctx,deck,slots).q===target,'deterministic');
 return count;
}
module.exports={run};if(require.main===module)console.log(run()+' P assertions PASS');
