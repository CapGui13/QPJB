'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const api=require('../quizz-durable-m5-lecons.js');
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const meta=require('../quizz-prerequis.js').byId;
const {corpus}=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
console.log((function test(api,corpus,meta,all){
const by=Object.fromEntries(all.map(x=>[x.id,x])),groups={};for(const [id,m] of Object.entries(meta))(groups[m.concept]??=[]).push(id);let checks=0;function ok(x,msg){checks++;if(!x)throw Error(msg)}
function history(req,completed){const entries={};for(const p of req)for(const id of groups[p.concept].slice(0,p.minExposure))entries[id]={assessment:{result:'wrong',assisted:true,lastSession:0}};return {completed,active:null,journal:[],entries}}
const full=history(Object.keys(corpus).map(c=>({concept:c,minExposure:Math.min(5,groups[c].length)})),65);let extensions=0,examples=0,overlap=0;
for(const [c,l] of Object.entries(corpus)){
 const request={concept:c,mode:'study',history:full};const v=api.lesson(request);ok(v?.extensions.length===(l.extensions||[]).length,c+' all extensions');ok(api.lesson({...request,mode:'reminder'}).extensions.length===0,c+' short');const discovery={concept:c,mode:'discovery',history:history(l.prerequisites,Math.max(1,l.minSession))};ok(api.lesson(discovery)?.extensions.length===0,c+' no variants before exposure');ok(api.lesson({...request,questionActive:true})===null,c+' no leak');
 for(const e of l.extensions||[]){extensions++;ok(Object.isFrozen(v.extensions)&&Object.isFrozen(e)===false,c+' output frozen input separate');const actual=v.extensions.find(x=>x.id===e.id);ok(actual.assisted&&!actual.assessment&&actual.check.assisted,c+' assisted');ok(e.rule.length<400&&e.check.prompt.length>10&&e.check.answer.length>10,c+' concise');ok(!api.lesson({...request,history:{...full,completed:e.minSession-1}})?.extensions.some(x=>x.id===e.id),c+' gate calendar');
 for(const p of e.prerequisites){const entries={...full.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({...request,history:{...full,entries}})?.extensions.some(x=>x.id===e.id),c+' missing prerequisite '+p.concept)}
 for(const x of e.examples){examples++;const q=by[x.id],m=meta[x.id];ok(q&&m.concept===c&&q.answer===x.answer&&q.explain===x.comment,c+' canonical');ok(JSON.stringify(q.hand)===JSON.stringify(x.hand)&&JSON.stringify(q.auction)===JSON.stringify(x.auction)&&q.context===x.context,c+' unchanged');ok(q.hand.flat().length===13&&q.hand.flat().reduce((a,v)=>a+({A:4,R:3,D:2,V:1}[v]||0),0)===q.h,c+' H/cards');ok(q.hand.every((s,i)=>s.length===q.shape[i]&&new Set(s).size===s.length)&&q.choices.includes(q.answer),c+' shape choice');ok(e.minSession>=m.minSession&&m.requires.every(p=>e.prerequisites.some(z=>z.concept===p.concept&&z.minExposure>=p.minExposure)),c+' source gates');if(v.examples.some(y=>y.id===x.id)){overlap++;ok(x.id===l.examples[0].id,c+' no duplicate contrast display')}}
 }
}
ok(api.lesson({concept:['ouv.sa1'],mode:'study',history:full})===null,'non-string concept');
ok(api.lesson({concept:{toString(){return 'ouv.sa1'}},mode:'study',history:full})===null,'coerced concept');
return {assertions:checks,extensions,examples,duplicateCore:overlap};
})(api,corpus,meta,all));
