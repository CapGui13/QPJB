'use strict';
// Reproduce the 98/99 concept coverage alert without altering production.
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7',TARGET='sa2.texas_mineur.reponse';
function run(read,api,qs,meta,selectorSource){
 function patch(s,from,to){if(s.split(from).length!==2)throw Error('coverage anchor changed: '+from);return s.replace(from,to);}
 const targets=qs.filter(q=>meta[q.id].concept===TARGET);
 if(targets.length!==6)throw Error('coverage target changed');
 let s=patch(selectorSource,'let dueServed=0,weakDueServed=0,','let targetVisits=[],targetCheckpoints=[];let dueServed=0,weakDueServed=0,');
 s=patch(s,'const dk=new Set(deck.map(key));','const dk=new Set(deck.map(key));if(dk.has(TARGET))targetVisits.push(n);');
 s=patch(s,'const now=api.assess({history:state,exercises:qs,nowMs:clock.now}).concepts,ss=Object.values(now);','const now=api.assess({history:state,exercises:qs,nowMs:clock.now}).concepts,ss=Object.values(now);targetCheckpoints.push({session:n,eligible:targets.map(q=>({id:q.id,...engine.eligibility(q,state,qs)}))});');
 s=patch(s,"pair.push({variant:candidate?'m3':'base',firstThree,snapshots});","pair.push({variant:candidate?'m3':'base',firstThree,snapshots,targetVisits,targetCheckpoints,missing:[...new Set(qs.map(key))].filter(k=>!allConcepts.has(k))});");
 const m={exports:{}};new Function('module','exports','require','TARGET','targets',s)(m,m.exports,()=>{throw Error('unexpected require');},TARGET,targets);
 const reports=[];
 for(const strategy of ['broad','calendar']){
  const x=m.exports.run(read,api,qs,meta,[{profile:'assisted',seed:103,horizon:180,strategy}]);
  reports.push({strategy,checks:x.checks,pair:x.results[0].pair.map(v=>({variant:v.variant,coverage:v.snapshots.at(-1).concepts,missing:v.missing,targetVisits:v.targetVisits,targetCheckpoints:v.targetCheckpoints}))});
 }
 const [b,c]=reports;
 if(b.pair[0].coverage!==98||b.pair[1].coverage!==99||c.pair[0].coverage!==98||c.pair[1].coverage!==98)throw Error('coverage changed');
 if([b.pair[0],...c.pair].some(v=>v.missing.length!==1||v.missing[0]!==TARGET||v.targetVisits.length||!v.targetCheckpoints.at(-1).eligible.every(q=>q.eligible)))throw Error('missing target alert changed');
 if(!b.pair[1].targetVisits.length)throw Error('broad target not visited');
 return {schema:'QPJB_M3_COVERAGE_ALERT_V1',target:TARGET,profile:'assisted',seed:103,horizon:180,targetIds:targets.map(q=>q.id),reports,decision:'COORDINATOR_REVIEW',limits:'Eligibility observed after checkpoint completion, not a reconstruction of every selection; no claim about human learning or cause of ranking.'};
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),root=path.join(__dirname,'..');
 const read=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
 const m={exports:{}};new Function('module','exports','window',read('quizz-prerequis.js'))(m,m.exports,undefined);
 const qs=JSON.parse(read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(run(read,require('../quizz-durable-m3-maitrise.js'),qs,m.exports.byId,fs.readFileSync(path.join(__dirname,'durable-m3-selector.cjs'),'utf8')),null,2));
}
