'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const api=require('../quizz-durable-m5-lecons.js');
const code=fs.readFileSync(path.join(root,'quizz-durable-m5-lecons.js'),'utf8');
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const meta=require('../quizz-prerequis.js').byId;
const {corpus,idConcept}=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
console.log((function verify(api,code,corpus,idConcept,all,meta){
 const by=Object.fromEntries(all.map(x=>[x.id,x])),groups={};let n=0;
 function ok(x,m){n++;if(!x)throw Error(m)}
 for(const [id,c] of Object.entries(idConcept))(groups[c]??=[]).push(id);
 function hist(req,completed){const entries={};for(const v of req)for(const id of groups[v.concept].slice(0,v.minExposure))entries[id]={assessment:{result:'wrong',assisted:true,lastSession:0}};return {completed,active:null,journal:[],entries}}
 const full=hist(Object.keys(corpus).map(c=>({concept:c,minExposure:Math.min(5,groups[c].length)})),100),blank=hist([],0);
 ok(api.available({mode:'discovery',history:blank}).length===4,"initial");
 let numExamples=0,gated=0,discovered=0;
 for(const [c,l] of Object.entries(corpus)){
 const request={concept:c,mode:'discovery',history:hist(l.prerequisites,Math.max(1,l.minSession))},v=api.lesson(request);
 ok(v&&v.examples.length>=1&&v.assisted&&!v.assessment,c+' discovery');discovered++;
 ok(v.rule===l.rule&&v.reminder===l.reminder,c+' rules');ok(l.reminder.length>=30,c+' standalone');ok(Object.isFrozen(v)&&Object.isFrozen(v.examples),c+' freeze');
 ok(api.lesson({...request,questionActive:'false'})===null,c+' invalid flag');ok(api.lesson({...request,questionActive:true})===null,c+' question active');ok(api.lesson({...request,exercise:{id:l.examples[0].id}})===null,c+' exercise');ok(api.lesson({...request,history:{...request.history,active:{ids:[l.examples[0].id]}}})===null,c+' active');
 ok(api.lesson({...request,mode:'assessment'})===null,c+' assessment');ok(api.lesson({...request,mode:'reminder'})===null,c+' unseen');
 if(l.minSession>0)ok(api.lesson({...request,history:{...request.history,completed:l.minSession-1}})===null,c+' calendar');
 for(const p of l.prerequisites){const a=hist(l.prerequisites.filter(x=>x.concept!==p.concept),Math.max(1,l.minSession));ok(api.lesson({...request,history:a})===null,c+' missing prereq '+p.concept)}
 const recall=api.lesson({concept:c,mode:'reminder',history:full});ok(recall?.rule===l.reminder&&recall.examples.length===0&&recall.checks.length===0,c+' recall');
 const study=api.lesson({concept:c,mode:'study',history:full});ok(study?.examples.length+(l.examples.slice(1).filter(e=>study?.extensions.some(x=>x.examples.some(q=>q.id===e.id))).length)===l.examples.length,c+' full study');
 ok(api.lesson({concept:c,mode:'discovery',history:full})===null,c+' no automatic reteach');
 ok(l.checks[0].prompt!==l.examples[0].context,c+' distinct');
 for(const [i,e] of l.examples.entries()){
 numExamples++;const q=by[e.id];ok(q&&q.answer===e.answer&&q.explain===e.comment,c+' canonical');ok(JSON.stringify(q.hand)===JSON.stringify(e.hand)&&JSON.stringify(q.auction)===JSON.stringify(e.auction)&&q.context===e.context,c+' immutable example');ok(q.hand.flat().length===13,c+' cards');ok(q.hand.flat().reduce((s,v)=>s+({A:4,R:3,D:2,V:1}[v]||0),0)===q.h,c+' H');for(let z=0;z<4;z++){ok(q.hand[z].length===q.shape[z],c+' shape');ok(new Set(q.hand[z]).size===q.hand[z].length,c+' no duplicate')}ok(q.choices.includes(q.answer),c+' choice');
 if(i){const m=meta[e.id];ok(e.minSession>=m.minSession&&JSON.stringify(e.prerequisites)===JSON.stringify(m.requires),c+' contrast gate');if(!v.examples.some(x=>x.id===e.id))gated++}
 }
 }
 ok(Object.keys(corpus).length===99&&all.length===1915,"counts");
 ok(api.lesson({concept:"__proto__",mode:"discovery",history:blank})===null,"prototype");
 ok(api.available({mode:"study",history:{...full,active:{}}}).length===0,"list active");
 // Exercise every contrast boundary independently with complete prerequisites and sufficient prior concept history.
 for(const [c,l] of Object.entries(corpus)){for(const e of l.examples.slice(1)){
 const early={...full,completed:e.minSession-1};ok(!api.lesson({concept:c,mode:'study',history:early})?.examples.some(x=>x.id===e.id),c+' contrast calendar');
 for(const p of e.prerequisites){const entries={...full.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({concept:c,mode:'study',history:{...full,entries}})?.examples.some(x=>x.id===e.id),c+' contrast prerequisite');
 }
 }}
 const demo={...full,completed:65};ok(api.available({mode:'study',history:demo}).length===99,"demo advanced profile");
 const before=JSON.stringify(full);const start=Date.now();for(let i=0;i<1000;i++)api.available({mode:'study',history:full});const ms=Date.now()-start;ok(JSON.stringify(full)===before,"history unchanged");
 const win={};new Function('window',code)(win);ok(win.QPJBDurableLessons.schema===api.schema,"UMD");
 return {assertions:n,concepts:discovered,catalogue:all.length,examples:numExamples,contrasts:numExamples-99,contrastsDeferredAtDiscovery:gated,standaloneReminders:99,fullHistoryAvailableCalls:1000,elapsedMs:ms,engine:"V8"};
})(api,code,corpus,idConcept,all,meta));
