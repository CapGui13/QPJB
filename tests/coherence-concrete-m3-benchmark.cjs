'use strict';
// Reproductible on the frozen base with the M3 module added.
// The injected method only observes the existing eligibility predicate.
function run({sources,exercises,metadata,moduleM3,horizon=20,groups=['none','texas'],profiles=['autonome','intermediaire','faible','cible','aide','passe'],seeds=[11,47,103]}){
 const assert=(b,m)=>{if(!b)throw Error(m)};
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
 const clock=class extends Date{constructor(...a){super(...(a.length?a:[1795726800000]));}static now(){return 1795726800000;}};
 const anchor='return {eligibility,adaptiveDiagnostics,createForTests:';
 function engine(group){
  const modified={...metadata,byId:moduleM3.applyExperimental(metadata.byId,exercises,group)};
  const cache={};
  function load(path){
   const key=path.replace(/^\.\//,'');
   if(key==='quizz-prerequis.js')return modified;
   if(key==='quizz-durable-integration.js'&&horizon<=20&&!sources[key])return null;
   if(cache[key])return cache[key].exports;
   let src=sources[key];assert(typeof src==='string'&&src.length,'Missing '+key);
   if(key==='quizz-parcours.js'){assert(src.includes(anchor),'Engine drift');src=src.replace(anchor,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:');}
   const m=cache[key]={exports:{}};new Function('module','exports','require','Date',src)(m,m.exports,load,clock);return m.exports;
  }
  return load('quizz-parcours.js');
 }
 const output={horizon,groups,profiles,seeds,trajectories:[]};
 for(const group of groups){
 const api=engine(group);
 for(const profile of profiles)for(const seed of seeds){
  const st=api.empty(),trace=[],concepts=new Set(),families=new Set();let firstTexas=null,firstTexasStrong=false,firstTrueBicolor=null,firstStrong=null,errors=0;const checkpoints=[];
  for(let s=0;s<horizon;s++){
   const deck=api.start(st,exercises);assert(deck.length===10,'Incomplete '+group+' '+profile+' S'+(s+1));
   assert(new Set(deck.map(q=>q.id)).size===10,'Duplicate ID');assert(new Set(deck.map(q=>q.caseFamily||q.id)).size===10,'Duplicate family');
   const e=api.eligibilityBatch(deck,st,exercises);assert(e.every(x=>typeof x==='boolean'?x:x.eligible),'Ineligible selection '+group+' '+profile+' S'+(s+1)+' '+JSON.stringify(e));
   const selection=st.active.selection.map(x=>({...x}));let openingPass=0;
   for(let i=0;i<deck.length;i++){
    const q=deck[i],m=metadata.byId[q.id];concepts.add(m.concept);families.add(q.caseFamily||q.id);
    if(q.theme==='ouv'&&q.answer==='Passe')openingPass++;
    if(m.concept==='sa1.texas'&&firstTexas===null){firstTexas=s+1;firstTexasStrong=moduleM3.TEXAS.includes(q.id);}
    if(moduleM3.TEXAS.includes(q.id)&&firstStrong===null)firstStrong=s+1;
    if(m.concept==='red.bicolore'&&!moduleM3.RED.includes(q.id)&&firstTrueBicolor===null)firstTrueBicolor=s+1;
    const u=hash(q.id+'|'+s+'|'+seed),v=hash('a|'+q.id+'|'+s+'|'+seed);
    const p=profile==='autonome'?0:profile==='intermediaire'?.33:profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):profile==='passe'?(q.theme==='ouv'&&q.answer==='Passe'?.9:.1):.15;
    const wrong=u<p,help=profile==='aide'&&v<.6;
    if(wrong)errors++;
    assert(api.record(st,q,wrong?'wrong':'correct',i,null,help,false),'Record failed');
   }
   if(s===0)assert(openingPass===3,'S1 Passe');if(s===2)assert(openingPass<=1,'S3 Passe cap');
   trace.push({session:s+1,selection,openingPass});
   assert(api.finish(st,exercises),'Finish failed');if([5,20,65,153,180].includes(s+1))checkpoints.push({session:s+1,concepts:concepts.size,families:families.size,errors,firstTexas,firstTexasStrong,firstStrong});
  }
  output.trajectories.push({group,profile,seed,firstTexas,firstTexasStrong,firstTrueBicolor,firstStrong,checkpoints,concepts:concepts.size,families:families.size,errors,trace});
 }
 }
 return output;
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.resolve(__dirname,'..');
 const base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js','quizz-durable-integration.js','quizz-durable-m1-adaptation.js','quizz-durable-m2-remediation.js','quizz-durable-m2-data.js','quizz-durable-m3-maitrise.js','quizz-durable-m4-transfert.js','quizz-durable-m5-lecons.js','quizz-durable-m1-guard.js','quizz-professeur.js','quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js'];
 const sources=Object.fromEntries(names.map(p=>[p,get(p)]));
 const ms=get('quizz-prerequis.js'),m={exports:{}};new Function('module',ms)(m);
 const exercises=JSON.parse(get('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const result=run({sources,exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),horizon:Number(process.argv[2]||180),groups:(process.argv[3]||'none,texas').split(','),seeds:(process.argv[4]||'11,47,103').split(',').map(Number)});
 process.stdout.write(JSON.stringify(result));
}
