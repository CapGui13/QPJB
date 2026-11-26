'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const report=read('audits/apprentissage-durable-20261126/m5/seuils-historiques.json'),{corpus}=read('audits/apprentissage-durable-20261126/m5/corpus-verification.json');
const api=require('../quizz-durable-m5-lecons.js'),meta=require('../quizz-prerequis.js').byId;
const txt=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const all=(function(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error('catalogue')})(txt);
const by=Object.fromEntries(all.map(x=>[x.id,x])),groups={};for(const [id,m] of Object.entries(meta))(groups[m.concept]??=[]).push(id);
const history={active:null,completed:65,journal:[],entries:Object.fromEntries(Object.keys(meta).map(id=>[id,{assessment:{result:'wrong',assisted:true,lastSession:0}}]))};
let n=0;function ok(x,m){n++;if(!x)throw Error(m)}
ok(report.archives.length===9,'archives');
for(const change of report.edits){const l=corpus[change.concept],ctx={concept:change.concept,history,mode:'study'};for(const [k,v] of Object.entries(change.after))ok(l[k]===v,change.concept+' '+k);ok(api.lesson(ctx).rule===l.rule,change.concept+' rendered');ok(api.lesson({...ctx,mode:'reminder'}).rule===l.reminder,change.concept+' recall')}
ok(corpus['fortes.relais'].reminder.includes('deux Rois'),'exception in short recall');
ok(corpus['drury.choix'].rule.includes('6 à 10 HLD')&&corpus['drury.choix'].rule.includes('11 HLD'),'thresholds');
ok(corpus['multilandy.choix'].rule.includes('au moins 5–4'),'5–4');
ok(by['SEF-L24-002'].answer==='3SA'&&by['SEF-V470-005'].explain.includes('11–12 HLD'),'current Truscott');
const seen=new Set();
for(const r of report.newExtensions){const ext=corpus[r.concept].extensions.find(e=>e.id===r.id),ctx={concept:r.concept,history,mode:'study'};ok(ext&&ext.assisted&&!ext.assessment&&ext.check.assisted,r.id+' flags');ok(api.lesson(ctx).extensions.some(e=>e.id===r.id),r.id+' study');ok(api.lesson({...ctx,mode:'reminder'}).extensions.length===0,r.id+' short');ok(api.lesson({...ctx,questionActive:true})===null,r.id+' active');ok(!api.lesson({...ctx,history:{...history,completed:ext.minSession-1}})?.extensions.some(e=>e.id===r.id),r.id+' early');for(const p of ext.prerequisites){const entries={...history.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({...ctx,history:{...history,entries}})?.extensions.some(e=>e.id===r.id),r.id+' exposure '+p.concept)}for(const [i,e] of ext.examples.entries()){const a=by[e.id],m=meta[e.id];ok(!seen.has(e.id),e.id+' unique');seen.add(e.id);ok(e.id===r.ids[i]&&e.answer===r.answers[i]&&e.answer===a.answer&&e.comment===a.explain&&e.context===a.context&&JSON.stringify(e.hand)===JSON.stringify(a.hand)&&JSON.stringify(e.auction)===JSON.stringify(a.auction),e.id+' exact');ok(ext.minSession>=m.minSession&&m.requires.every(p=>ext.prerequisites.some(z=>z.concept===p.concept&&z.minExposure>=p.minExposure)),e.id+' gates')}}
ok(seen.size===report.counts.newDistinctExamples,'new coverage');
console.log({assertions:n,concepts:report.counts.editedConcepts,extensions:report.newExtensions.length,examples:seen.size});
