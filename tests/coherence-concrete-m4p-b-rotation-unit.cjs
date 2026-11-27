'use strict';
const assert=require('node:assert/strict'),n=require('../quizz-coherence-m4p-b-rotation.js'),w=require('../quizz-coherence-m4p-b-window.js');
function run(){
 let count=0;const ck=(c,m)=>{assert.ok(c,m);count++;};
 const exercises=[],metadataById={},make=(id,c)=>{const q={id,caseFamily:id,theme:'ouv',difficulty:2};exercises.push(q);metadataById[id]={concept:c,stage:1};return q;};
 const old=make('old','ouv.mineure'),keep=make('keep','ouv.mineure'),third=make('third','ouv.mineure'),target=make('target','ouv.passe');
 const other=Array.from({length:8},(_,i)=>make('x'+i,'other'+i)),journal=[];
 for(let s=1;s<70;s++){const qs=[s===15?target:s%3===0?third:old,keep,...other];journal.push({mode:'parcours',session:s,answers:qs.map(q=>({id:q.id,result:'correct',assisted:false,hadFreeError:false}))});}
 const ctx={session:70,history:{journal},exercises,metadataById,pool:[target],classify:()=> 'maintenance',bad:()=>false,due:()=>false,weak:()=>false,novelFamily:()=>false,openingPass:()=>false,bid:()=> '1♣',context:()=> 'ctx',fresh:()=>false,oldTheme:()=>0,localTarget:()=>2,passCap:1,objective:{allowPositiveRepeatRotation:true}};
 const deck=[old,keep,...other].map(exercise=>({exercise,kind:'revision',reason:'rappel_question'})),slots=[{index:0,baseline:old,category:'maintenance'}],snap=JSON.stringify(ctx.history);
 const result=n.replace(ctx,deck,slots);
 ck(result.q===target,'positive M1 rotation');
 ck(result.noveltyCost===0&&result.repeatAfter===result.repeatBefore,'no novelty cost');
 ck(result.forecastGain>=70&&result.forecastCost===0,'forecast');
 ck(result.deck.slice(1).every((x,i)=>x===deck[i+1]),'nine unchanged');
 ck(result.deck.length===10&&result.displaced.retained,'retained proof');
 ck(n.replace({...ctx,objective:{}},deck,slots).deck===deck,'default off');
 ck(n.replace({...ctx,novelFamily:q=>q===old},deck,slots).deck===deck,'new family protected');
 ck(n.replace({...ctx,session:65},deck,slots).deck===deck,'no S1–65');
 ck(n.replace({...ctx,history:{...ctx.history,active:{}}},deck,slots).deck===deck,'no active session');
 ck(n.replace({...ctx,history:{journal:journal.slice(1)}},deck,slots).deck===deck,'incomplete history');
 ck(n.replace({...ctx,weak:q=>q===old},deck,slots).deck===deck,'weak donor protected');
 ck(n.replace({...ctx,due:q=>q===old},deck,slots).q===target,'positive due review can rotate under retained concept guard');
 ck(n.replace(ctx,deck,[{...slots[0],priority:true}]).q===target,'priority theme remains present');
 ck(n.replace(ctx,deck,[{...slots[0],priority:true,category:'discovery'}]).deck===deck,'priority discovery protected');
 ck(n.replace(ctx,deck.map((x,i)=>i===0?{...x,reason:'rappel_erreur_aide'}:x),slots).q===undefined,'explicit error protected');
 ck(n.replace({...ctx,bad:q=>q===target},deck,slots).deck===deck,'bad target protected');
 ck(n.replace({...ctx,localTarget:()=>1},deck,slots).deck===deck,'local difficulty');
 ck(n.replace(ctx,deck,[{...slots[0],category:'weakness'}]).deck===deck,'weakness slot protected');
 const recent=JSON.parse(JSON.stringify(journal));recent[67].answers[0].id=target.id;
 ck(w.recentLongRecall({...ctx,history:{journal:recent}}),'rolling cooldown');
 ck(n.replace({...ctx,history:{journal:recent}},deck,slots).deck===deck,'no repeat exceptional recall in next three sessions');
 ck(JSON.stringify(ctx.history)===snap,'pure history');
 ck(n.replace(ctx,deck,slots).q===target,'deterministic');
 return count;
}
module.exports={run};if(require.main===module)console.log(run()+' O assertions PASS');
