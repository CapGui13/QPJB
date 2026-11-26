'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const report=read('audits/apprentissage-durable-20261126/m5/archives-complementaires.json'),{corpus}=read('audits/apprentissage-durable-20261126/m5/corpus-verification.json');
const api=require('../quizz-durable-m5-lecons.js'),meta=require('../quizz-prerequis.js').byId;
const txt=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const all=(function(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error('catalogue')})(txt);
const by=Object.fromEntries(all.map(x=>[x.id,x])),groups={};for(const [id,m] of Object.entries(meta))(groups[m.concept]??=[]).push(id);
const history={active:null,completed:65,journal:[],entries:Object.fromEntries(Object.keys(meta).map(id=>[id,{assessment:{result:'wrong',assisted:true,lastSession:0}}]))};
let n=0;function ok(x,m){n++;if(!x)throw Error(m)}
ok(report.archives.length===4,'archives');
const seen=new Set(),ids=new Set(report.newExtensions.map(x=>x.id));
for(const r of report.newExtensions){const ext=corpus[r.concept].extensions.find(e=>e.id===r.id),ctx={concept:r.concept,history,mode:'study'};
 ok(ext&&ext.assisted&&!ext.assessment&&ext.check.assisted,r.id+' flags');ok(api.lesson(ctx).extensions.some(e=>e.id===r.id),r.id+' study');ok(api.lesson({...ctx,mode:'reminder'}).extensions.length===0,r.id+' recall');ok(api.lesson({...ctx,questionActive:true})===null,r.id+' active');ok(!api.lesson({...ctx,history:{...history,completed:ext.minSession-1}})?.extensions.some(e=>e.id===r.id),r.id+' calendar');
 ok(JSON.stringify(ext.prerequisites)===JSON.stringify(r.prerequisites)&&ext.minSession===r.minSession,r.id+' record gates');
 for(const p of ext.prerequisites){const entries={...history.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({...ctx,history:{...history,entries}})?.extensions.some(e=>e.id===r.id),r.id+' prerequisite '+p.concept)}
 for(const [i,e] of ext.examples.entries()){const a=by[e.id],m=meta[e.id];ok(!seen.has(e.id),e.id+' unique');seen.add(e.id);ok(e.id===r.ids[i]&&e.answer===r.answers[i]&&e.answer===a.answer&&e.comment===a.explain&&e.context===a.context&&JSON.stringify(e.hand)===JSON.stringify(a.hand)&&JSON.stringify(e.auction)===JSON.stringify(a.auction),e.id+' exact');ok(ext.minSession>=m.minSession&&m.requires.every(p=>ext.prerequisites.some(z=>z.concept===p.concept&&z.minExposure>=p.minExposure)),e.id+' gates');ok(m.concept===r.concept,e.id+' concept');}
}
const finalReview=read('audits/apprentissage-durable-20261126/m5/validation-historique-finale.json'), laterIds=new Set(finalReview.newExtensions.map(x=>x.id));
const oldExamples=Object.values(corpus).flatMap(l=>[...l.examples,...(l.extensions||[]).filter(e=>!ids.has(e.id)&&!laterIds.has(e.id)).flatMap(e=>e.examples)]);
ok(new Set(oldExamples.map(e=>e.id)).size===report.counts.previousExamples,'previous coverage');ok(seen.size===report.counts.newDistinctExamples,'new coverage');
ok(report.dispositions.filter(x=>x.disposition==='rejected-historical').length===2,'two rejected cases');
for(const row of report.dispositions.filter(x=>x.answer))ok(by[row.id]?.answer===row.answer,row.id+' frozen answer');
ok(by['SEF-V49-005'].answer==='1♥'&&by['SEF-V426-001'].answer==='1♠'&&corpus['mineur.base'].rule.includes('12 HL inclus'),'Walsh boundary');
console.log({assertions:n,extensions:ids.size,newExamples:seen.size,dispositions:report.dispositions.length});
