'use strict';
function run({sources,exercises,metadata,M}){
 const check=(b,m)=>{assertions++;if(!b)throw Error(m)};let assertions=0;
 function loadEngine(group){
 const modified={...metadata,byId:M.applyExperimental(metadata.byId,exercises,group)},cache={};
 function load(p){const k=p.replace(/^\.\//,'');if(k==='quizz-prerequis.js')return modified;if(k==='quizz-durable-integration.js')return null;if(cache[k])return cache[k].exports;const m=cache[k]={exports:{}};new Function('module','exports','require',sources[k])(m,m.exports,load);return m.exports;}
 return load('quizz-parcours.js');
 }
 const before=loadEngine('none'),after=loadEngine('texas'),by=new Map(exercises.map(q=>[q.id,q])),strong=M.TEXAS.map(id=>by.get(id)),weak=by.get('SEF-037-1');
 const clone=x=>JSON.parse(JSON.stringify(x));
 const state=before.empty();
 for(let s=0;s<4;s++){const deck=before.start(state,exercises);check(deck.length===10,'baseline deck');for(let i=0;i<deck.length;i++)check(before.record(state,deck[i],'correct',i,null,false,false),'record');check(before.finish(state,exercises),'finish');}
 const results={before:[],after:[],recoveries:[]};
 for(const q of strong){
 const a=before.eligibility(q,state,exercises),b=after.eligibility(q,state,exercises);
 check(a.eligible,'historical eligible '+q.id);check(!b.eligible&&b.reasons.includes('exposure:sa1.texas:1'),'new gate '+q.id);
 results.before.push({id:q.id,...a});results.after.push({id:q.id,...b});
 }
 check(after.eligibility(weak,state,exercises).eligible,'weak discovery eligible');
 for(const [result,assisted,hadFreeError] of [['wrong',false,false],['correct',true,false],['correct',false,true],['correct',false,false],['skipped',false,false]]){
 const st=clone(state),deck=after.start(st,exercises);
 check(deck.some(q=>metadata.byId[q.id].concept==='sa1.texas'),'Texas discovery present');
 check(deck.every(q=>!M.TEXAS.includes(q.id)),'no strong variant in first session');
 for(let i=0;i<deck.length;i++)check(after.record(st,deck[i],result,i,null,assisted,hadFreeError),'record discovery');
 check(after.finish(st,exercises),'finish discovery');
 for(const q of strong){const a=before.eligibility(q,st,exercises),b=after.eligibility(q,st,exercises);check(a.eligible===b.eligible&&b.eligible,'no perpetual lock '+q.id);}
 const advisory=M.rules({session:6,history:st,exercises,metadataById:M.applyExperimental(metadata.byId,exercises,'texas'),candidates:strong});
 check(advisory.every(a=>a.requirements.find(r=>r.concept==='sa1.texas').proofFamilies===((result==='correct'&&!assisted&&!hadFreeError)?1:0)),'autonomy distinguished from eligibility');
 results.recoveries.push({result,assisted,hadFreeError,advisory});
 }
 const active=clone(state),oldDeck=before.start(active,exercises);check(before.record(active,oldDeck[0],'wrong',0,null,false,false),'active response');
 const frozen=JSON.stringify(active),resumed=after.start(active,exercises);check(JSON.stringify(oldDeck.map(q=>q.id))===JSON.stringify(resumed.map(q=>q.id)),'active deck preserved');check(JSON.stringify(active)===frozen,'active state unchanged');
 return {assertions,...results};
}
module.exports={run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js'];
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(p=>[p,get(p)])),exercises,metadata:m.exports,M:require('../quizz-coherence-m3-prerequis.js')})));
}
