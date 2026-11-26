'use strict';
function run(advice,shape,exercises){
 const q=id=>exercises.find(q=>q.id===id),strong=q('SEF-N084-1'),weak=q('SEF-037-1'),same=q('SEF-C-003'),zero=q('SEF-N082-2'),other=q('SEF-038-1');
 const row=(q,v=100)=>({q,v}),ctx={ranked:[row(strong),row(weak),row(same),row(zero),row(other)],selected:[],hasPriorExposure:false,category:'discovery',forcedReason:null,maxGap:0,ELEMENTARY:advice.ELEMENTARY,STRONG:advice.STRONG};
 let assertions=0;const check=(v,m)=>{assertions++;if(!v)throw Error(m)};
 const before=JSON.stringify(ctx);
 check(advice.advise(ctx).id===weak.id,'same bid and score');
 check(shape.advise(ctx).id===same.id,'matched shape and positive strength');
 for(const fn of [advice.advise,shape.advise]){
  check(!fn({...ctx,hasPriorExposure:true}),'prior exposure');
  check(!fn({...ctx,forcedReason:'rappel_erreur_aide'}),'explicit recall');
  check(!fn({...ctx,category:'weakness'}),'weakness');
  check(!fn({...ctx,selected:[{exercise:weak}]}),'already selected elementary');
  check(!fn({...ctx,ranked:[row(strong),row(other)]}),'different answer');
  check(!fn({...ctx,ranked:[row(strong)]}),'no alternative');
  check(!fn({...ctx,ranked:[row(weak),row(strong)]}),'simple already wins');
 }
 check(!shape.advise({...ctx,ranked:[row(strong),row(zero)]}),'no zero-point edge in matched-shape trial');
 check(!shape.advise({...ctx,ranked:[row(strong),row(weak)]}),'different shape');
 check(!shape.advise({...ctx,ranked:[row(strong),row(same,99)]}),'matched-shape exact score only');
 check(!advice.advise({...ctx,ranked:[row(strong),row(weak,99)]}),'equal score version');
 check(advice.advise({...ctx,maxGap:48,ranked:[row(strong),row(weak,52)]}).gap===48,'bounded gap');
 check(!advice.advise({...ctx,maxGap:48,ranked:[row(strong),row(weak,51)]}),'outside bound');
 check(JSON.stringify(ctx)===before,'pure');
 return {assertions};
}
module.exports={run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const html=cp.execFileSync('git',['show',base+':quizz.html'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const ex=JSON.parse(html.split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 console.log(JSON.stringify(run(require('../quizz-coherence-m3-transition-advice.js'),require('./coherence-concrete-m3-texas-matched-shape.cjs'),ex)));
}
