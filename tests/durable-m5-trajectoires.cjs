'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const engine=require('../quizz-parcours.js'),api=require('../quizz-durable-m5-lecons.js'),meta=require('../quizz-prerequis.js').byId;
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const {corpus}=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
const run=function run(engine,api,all,meta,corpus,profile,horizon,seed,previous){
 let n=0;function ok(x,msg){n++;if(!x)throw Error(profile+" "+msg)}
 let state=engine.empty(),random=seed>>>0;
 const rand=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random/4294967296};
 const seen=new Set(),availableEver=new Set(),extensionsEver=new Set(),logs=[],discoverySeen=new Set();let questions=0,consultations=0,skips=0,assisted=0,wrong=0;
 function observe(s){const before=JSON.stringify(s),disc=api.available({mode:'discovery',history:s}),rec=api.available({mode:'reminder',history:s}),study=api.available({mode:'study',history:s});ok(rec.length===study.length,'recall/study same eligibility');
 if(previous)for(const mode of ['discovery','reminder','study'])ok(JSON.stringify(api.available({mode,history:s}))===JSON.stringify(previous.available({mode,history:s})),'no change availability '+mode);
 for(const item of disc){ok(!seen.has(item.concept),'already exposed in discovery');availableEver.add(item.concept);discoverySeen.add(item.concept);const l=api.lesson({concept:item.concept,mode:'discovery',history:s});ok(l&&l.assisted&&!l.assessment&&l.extensions.length===0,'discovery semantics')}
 for(const item of rec){ok(seen.has(item.concept),'recall without exposure');const l=api.lesson({concept:item.concept,mode:'reminder',history:s});ok(l&&l.examples.length===0&&l.extensions.length===0&&l.checks.length===0&&!l.assessment,'recall short')}
 for(const item of study){const l=api.lesson({concept:item.concept,mode:'study',history:s});ok(l&&l.assisted&&!l.assessment,'study');for(const e of l.extensions){ok(s.completed>=e.minSession,'extension calendar');extensionsEver.add(e.id)}}
 if(disc.length) {api.lesson({concept:disc[0].concept,mode:'discovery',history:s});consultations++} if(rec.length){api.lesson({concept:rec[0].concept,mode:'reminder',history:s});consultations++}
 ok(JSON.stringify(s)===before,'consultation mutation');return {discovery:disc.length,recall:rec.length,study:study.length,extensionsEver:extensionsEver.size,conceptsSeen:seen.size}}
 logs.push({session:0,...observe(state)});
 const start=Date.now();
 for(let session=1;session<=horizon;session++){
 const deck=engine.start(state,all);ok(deck.length===10,'session length');ok(api.available({mode:'discovery',history:state}).length===0,'active list');ok(api.lesson({concept:meta[deck[0].id].concept,mode:'study',history:state})===null,'active lesson');
 for(let i=0;i<deck.length;i++){const q=deck[i],v=rand();let result=profile==='autonome'?'correct':v<.05?'skipped':v<.45?'wrong':'correct';let help=profile==='aide'&&v>=.45&&v<.85;const freeError=profile==='aide'&&v>=.85&&v<.95;const choice=result==='correct'?q.answer:result==='wrong'?q.choices.find(x=>x!==q.answer):null;
 ok(engine.record(state,q,result,i,choice,help,freeError),'record');questions++;if(result==='skipped')skips++;else{seen.add(meta[q.id].concept);if(result==='wrong')wrong++;if(help||freeError)assisted++}}
 ok(engine.finish(state,all),'finish');ok(state.completed===session,'completed');const metrics=observe(state);
 if([1,2,3,10,20,21,40,65].includes(session)||session===horizon)logs.push({session,...metrics});
 if(session===Math.min(horizon,20)){const backup=engine.exportProgress(state,all,{});const imported=engine.importProgress(JSON.stringify(backup));for(const mode of ['discovery','reminder','study'])ok(JSON.stringify(api.available({mode,history:state}))===JSON.stringify(api.available({mode,history:imported})),'import roundtrip '+mode);state=imported;}
 }
 return {profile,seed,horizon,questions,skips,assisted,wrong,consultations,assertions:n,conceptsSeen:seen.size,discoveryEver:discoverySeen.size,extensionsEver:extensionsEver.size,elapsedMs:Date.now()-start,checkpoints:logs};
};
const horizon=Number(process.env.M5_HORIZON||65);for(const [profile,seed] of [['autonome',47],['faible',47],['aide',73]])console.log(JSON.stringify(run(engine,api,all,meta,corpus,profile,horizon,seed)));
