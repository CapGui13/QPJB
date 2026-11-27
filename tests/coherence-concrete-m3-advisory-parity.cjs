'use strict';
// Compare advisory evidence only, not the complete native eligibility gate.
function run({sources,exercises,metadata,moduleM3}){
 const profiles=['autonome','intermediaire','faible','cible','aide','passe'],results=[];
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
 for(const group of ['none','texas']){
 const byId=moduleM3.applyExperimental(metadata.byId,exercises,group),cache={};
 function requireLocal(path){
  const key=path.replace(/^\.\//,'');
  if(key==='quizz-prerequis.js')return {...metadata,byId};
  if(key==='quizz-durable-integration.js')return null;
  if(cache[key])return cache[key].exports;
  let s=sources[key];if(!s)throw Error('Missing '+key);
  if(key==='quizz-parcours.js'){
   const anchor='return {eligibility,adaptiveDiagnostics,createForTests:';
   if(!s.includes(anchor))throw Error('Engine drift');
   s=s.replace(anchor,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:');
  }
  const m=cache[key]={exports:{}};new Function('module','exports','require',s)(m,m.exports,requireLocal);return m.exports;
 }
 const api=requireLocal('quizz-parcours.js');
 for(const profile of profiles){
  const state=api.empty(),rows=[];
  for(let session=1;session<=20;session++){
   if([1,5,10,20].includes(session)){
    const native=api.eligibilityBatch(exercises,state,exercises),advice=moduleM3.rules({session,history:state,exercises,metadataById:byId,candidates:exercises});
    let compared=0,proofCompared=0;const differences=[];
    for(let i=0;i<exercises.length;i++){
     const a=advice[i],n=native[i].reasons;
     const missing=a.requirements.filter(x=>x.status==='missing-exposure').map(x=>'exposure:'+x.concept+':'+x.minExposure);
     const expected=n.filter(x=>x.startsWith('exposure:'));
     compared++;
     if(JSON.stringify(missing)!==JSON.stringify(expected))differences.push({id:a.id,field:'exposure',missing,expected});
     if(a.autonomy){proofCompared++;if(a.autonomy.foundation===n.includes('difficulty-foundation'))differences.push({id:a.id,field:'foundation',advice:a.autonomy,native:n});
      if(a.autonomy.independent!==null&&a.autonomy.independent===n.includes('difficulty-independent'))differences.push({id:a.id,field:'independent',advice:a.autonomy,native:n});}
     else if(n.includes('difficulty-foundation')||n.includes('difficulty-independent'))differences.push({id:a.id,field:'missing-autonomy',native:n});
    }
    rows.push({session,compared,proofCompared,differences});
   }
   const deck=api.start(state,exercises);if(deck.length!==10)throw Error('short deck');
   for(let i=0;i<deck.length;i++){
    const q=deck[i],u=hash(q.id+'|'+(session-1)+'|47'),v=hash('a|'+q.id+'|'+(session-1)+'|47');
    const p=profile==='autonome'?0:profile==='intermediaire'?.33:profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):profile==='passe'?(q.theme==='ouv'&&q.answer==='Passe'?.9:.1):.15;
    if(!api.record(state,q,u<p?'wrong':'correct',i,null,profile==='aide'&&v<.6,false))throw Error('record');
   }
   if(!api.finish(state,exercises))throw Error('finish');
  }
  results.push({group,profile,seed:47,rows});
 }
 }
 return {results,compared:results.flatMap(x=>x.rows).reduce((a,b)=>a+b.compared,0),proofCompared:results.flatMap(x=>x.rows).reduce((a,b)=>a+b.proofCompared,0),differences:results.flatMap(x=>x.rows).reduce((a,b)=>a+b.differences.length,0)};
}
module.exports={run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js'];
 const result=run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js')});
 console.log(JSON.stringify(result));if(result.differences)process.exitCode=1;
}
