'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const api=require('../quizz-durable-m5-lecons.js');
const code=fs.readFileSync(path.join(root,'quizz-durable-m5-lecons.js'),'utf8');
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const meta=require('../quizz-prerequis.js').byId;
const {corpus,idConcept}=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
const by=Object.fromEntries(all.map(x=>[x.id,x]));
const groups={};for(const [id,c] of Object.entries(idConcept))(groups[c]??=[]).push(id);
let n=0;function ok(x,m){n++;if(!x)throw Error(m)}
function hist(req,completed){const entries={};for(const v of req)for(const id of groups[v.concept].slice(0,v.minExposure))entries[id]={assessment:{result:'wrong',assisted:true,lastSession:0}};return {completed,active:null,journal:[],entries}}
const full=hist(Object.keys(corpus).map(c=>({concept:c,minExposure:Math.min(5,groups[c].length)})),100);
for(const [c,l] of Object.entries(corpus)){
 const req={concept:c,mode:'discovery',history:hist(l.prerequisites,Math.max(1,l.minSession))};const v=api.lesson(req);ok(v&&v.assisted&&!v.assessment,c+' discovery');ok(v.reminder===l.reminder&&l.reminder.length>=30,c+' reminder');ok(Object.isFrozen(v)&&Object.isFrozen(v.examples),c+' freeze');ok(api.lesson({...req,questionActive:true})===null,c+' active');ok(api.lesson({...req,questionActive:'false'})===null,c+' malformed active');const study=api.lesson({concept:c,mode:'study',history:full});ok(study?.examples.length===l.examples.length,c+' study');for(const [i,e] of l.examples.entries()){const q=by[e.id];ok(q.answer===e.answer&&q.explain===e.comment,c+' canonical');ok(JSON.stringify(q.hand)===JSON.stringify(e.hand)&&JSON.stringify(q.auction)===JSON.stringify(e.auction)&&q.context===e.context,c+' content');ok(q.hand.flat().length===13,c+' 13');ok(q.hand.flat().reduce((s,v)=>s+({A:4,R:3,D:2,V:1}[v]||0),0)===q.h,c+' H');for(let z=0;z<4;z++){ok(q.hand[z].length===q.shape[z],c+' shape');ok(new Set(q.hand[z]).size===q.hand[z].length,c+' duplicate')}ok(q.choices.includes(q.answer),c+' choice');if(i){ok(e.minSession>=meta[e.id].minSession&&JSON.stringify(e.prerequisites)===JSON.stringify(meta[e.id].requires),c+' contrast prereq')}}}
const win={};vm.runInNewContext(code,{window:win});ok(win.QPJBDurableLessons.schema===api.schema,'UMD');console.log({assertions:n});
