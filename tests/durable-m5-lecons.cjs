'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'quizz-durable-m5-lecons.js'),'utf8');
const api=require('../quizz-durable-m5-lecons.js');
const window={};vm.runInNewContext(source,{window});if(window.QPJBDurableLessons.schema!==api.schema)throw Error('browser UMD');
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const meta=require('../quizz-prerequis.js').byId;
const payload=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
console.log((function test(api, corpus, idConcept, all, meta){
 let n=0;function ok(x,msg){n++;if(!x)throw Error(msg)}
 const blank={completed:0,active:null,journal:[],entries:{}},ctx={mode:'discovery',history:blank};
 const ids=Object.keys(idConcept),groups={};for(const id of ids)(groups[idConcept[id]]??=[]).push(id);
 ok(all.length===1915,'1915');ok(Object.keys(corpus).length===99,'99');ok(api.schema==='QPJB_DURABLE_LESSONS_V1','schema');
 ok(api.available(ctx).length===4,'S1 foundations only');
 const by=Object.fromEntries(all.map(q=>[q.id,q]));
 let ready=0,hold=0, maxRule=0,maxCanonical=0, totalRule=0;
 for(const [c,l] of Object.entries(corpus)){
 const q=by[l.examples[0].id], m=meta[q.id];ok(m.concept===c,c+' mapping');ok(l.rule.length<=400,c+' rule length');ok(l.reminder.length<=190,c+' recall length');ok(l.checks[0].prompt!==q.context,c+' different check');
 ok(JSON.stringify(l.examples[0].hand)===JSON.stringify(q.hand),c+' hand');ok(l.examples[0].answer===q.answer&&l.examples[0].comment===q.explain,c+' canonical');ok(l.minSession>=m.minSession,c+' calendar');
 if(l.disposition==='HOLD'){hold++;continue}ready++;
 ok(q.hand.flat().length===13,c+' 13');ok(q.hand.flat().reduce((s,v)=>s+({A:4,R:3,D:2,V:1}[v]||0),0)===q.h,c+' H');
 for(let i=0;i<4;i++){ok(q.hand[i].length===q.shape[i],c+' shape');ok(new Set(q.hand[i]).size===q.hand[i].length,c+' duplicate')}
 ok(q.choices.includes(q.answer),c+' answer choice');
 const entries={};for(const p of l.prerequisites){if(p.concept===c)continue;for(const id of groups[p.concept].slice(0,p.minExposure))entries[id]={assessment:{result:'wrong',assisted:true,lastSession:0}}}
 const history={completed:Math.max(1,l.minSession),active:null,journal:[],entries};const request={concept:c,mode:'discovery',history,nowMs:10};
 const before=JSON.stringify(history),result=api.lesson(request);
 if(l.prerequisites.some(p=>p.concept===c)){ok(result===null,c+' self prerequisite conservative')}else{
 ok(result?.assessment===false&&result.assisted===true,c+' lesson');ok(result.examples.length===1&&result.checks.length===1,c+' size');ok(JSON.stringify(result)===JSON.stringify(api.lesson(request)),c+' determinism');
 }
 ok(JSON.stringify(history)===before,c+' pure');ok(api.lesson({...request,exercise:q})===null,c+' no active exercise');
 ok(api.lesson({...request,history:{...history,active:{ids:[q.id],answers:{}}}})===null,c+' active');
 ok(api.lesson({...request,questionActive:true})===null,c+' question active');
 ok(api.lesson({...request,mode:'assessment'})===null,c+' mode');
 if(l.minSession>0)ok(api.lesson({...request,history:{...history,completed:l.minSession-1}})===null,c+' calendar blocked');
 for(const p of l.prerequisites){if(p.concept===c)continue;const fewer={...entries};delete fewer[groups[p.concept][0]];ok(api.lesson({...request,history:{...history,entries:fewer}})===null,c+' prereq missing '+p.concept)}
 const reminderHistory={...history,entries:{...entries,[q.id]:{assessment:{result:'wrong',assisted:true,lastSession:0}}}};
 for(const p of l.prerequisites.filter(p=>p.concept===c)){for(const id of groups[c].slice(0,p.minExposure))reminderHistory.entries[id]={assessment:{result:'wrong',assisted:true,lastSession:0}}}
 const reminder=api.lesson({...request,mode:'reminder',history:reminderHistory});
 ok(reminder?.kind==='reminder'&&reminder.examples.length===0&&reminder.checks.length===0&&reminder.assessment===false,c+' reminder');
 ok(api.lesson({...request,history:reminderHistory})===null,c+' no repeat discovery');
 maxRule=Math.max(maxRule,l.rule.length);maxCanonical=Math.max(maxCanonical,q.explain.length);totalRule+=l.rule.length;
 }
 ok(api.lesson({concept:'__proto__',...ctx})===null,'prototype');
 ok(api.lesson({concept:'ouv.sa1',mode:'discovery'})===null,'no history');
 ok(api.lesson({concept:'ouv.sa1',...ctx,history:{completed:0,journal:[],entries:{}}})===null,'unknown active');
 ok(api.lesson({concept:'ouv.sa1',...ctx,mode:'reminder'})===null,'no exposure');
 const a={id:'SEF-001-1',result:'correct',assisted:true,hadFreeError:true},hist={completed:1,active:null,entries:{},journal:[{mode:'consolidation',session:1,answers:[a]}]};
 ok(api.lesson({concept:'ouv.sa1',mode:'reminder',history:hist})===null,'consolidation not evidence');
 hist.journal=[{mode:'parcours',session:1,answers:[{...a,result:'skipped'}]}];ok(api.lesson({concept:'ouv.sa1',mode:'reminder',history:hist})===null,'skipped');
 hist.journal=[{mode:'parcours',session:1,answers:[a]}];ok(api.lesson({concept:'ouv.sa1',mode:'reminder',history:hist})?.assessment===false,'assisted exposure only');
 const start=Date.now();for(let i=0;i<20000;i++)api.lesson({concept:'ouv.sa1',...ctx});const ms=Date.now()-start;
 return {assertions:n,ready,hold,maxRule,maxCanonical,meanRule:Math.round(totalRule/ready),calls:20000,ms};
})(api,payload.corpus,payload.idConcept,all,meta));
