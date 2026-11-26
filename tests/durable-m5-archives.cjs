'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const report=read('audits/apprentissage-durable-20261126/m5/archives-v473-v485.json'), {corpus,idConcept}=read('audits/apprentissage-durable-20261126/m5/corpus-verification.json');
const api=require('../quizz-durable-m5-lecons.js'),meta=require('../quizz-prerequis.js').byId;
const text=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const all=(function(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error('catalogue')})(text);
const by=Object.fromEntries(all.map(x=>[x.id,x]));
const groups={};for(const [id,m] of Object.entries(meta))(groups[m.concept]??=[]).push(id);
const full={completed:65,active:null,journal:[],entries:Object.fromEntries(Object.keys(meta).map(id=>[id,{assessment:{result:'wrong',assisted:true,lastSession:0}}]))};
let n=0;function ok(x,m){n++;if(!x)throw Error(m)}
const allExamples=Object.values(corpus).flatMap(l=>[...l.examples,...(l.extensions||[]).flatMap(e=>e.examples)]);
// This historical pass freezes its own 73 extensions, not the size of later passes.
const later=read('audits/apprentissage-durable-20261126/m5/seuils-historiques.json');
const latest=read('audits/apprentissage-durable-20261126/m5/archives-complementaires.json');
const finalReview=read('audits/apprentissage-durable-20261126/m5/validation-historique-finale.json');
const laterIds=new Set([...later.newExtensions,...latest.newExtensions,...finalReview.newExtensions].map(e=>e.id));
const priorExamples=Object.values(corpus).flatMap(l=>[...l.examples,...(l.extensions||[]).filter(e=>!laterIds.has(e.id)).flatMap(e=>e.examples)]);
ok(new Set(priorExamples.map(x=>x.id)).size===report.counts.distinctExamples,'historical 289 distinct examples');
ok(new Set(allExamples.map(x=>x.id)).size===finalReview.counts.distinctExamples,'current corpus distinct examples');
ok(report.archives.length===13&&report.dispositions.length===report.counts.newExtensions,'archive coverage');
const seen=new Set();
for(const r of report.dispositions){
 const l=corpus[r.concept],ext=l.extensions.find(x=>x.id===r.id);
 ok(ext&&ext.assisted&&!ext.assessment&&ext.check.assisted,r.id+' flags');
 ok(JSON.stringify(ext.examples.map(x=>x.id))===JSON.stringify(r.sourceIds),r.id+' sources');
 ok(JSON.stringify(ext.prerequisites)===JSON.stringify(r.prerequisites)&&ext.minSession===r.minSession,r.id+' gates');
 ok(ext.prerequisites.some(x=>x.concept===r.concept&&x.minExposure>=1),r.id+' study only');
 const request={concept:r.concept,history:full,mode:'study'};
 ok(api.lesson(request).extensions.some(x=>x.id===r.id),r.id+' available');
 ok(api.lesson({...request,mode:'reminder'}).extensions.length===0,r.id+' recall');
 ok(api.lesson({...request,questionActive:true})===null,r.id+' question');
 ok(!api.lesson({...request,history:{...full,completed:ext.minSession-1}})?.extensions.some(x=>x.id===r.id),r.id+' time');
 for(const p of ext.prerequisites){const entries={...full.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({...request,history:{...full,entries}})?.extensions.some(x=>x.id===r.id),r.id+' exposure '+p.concept)}
 for(const [i,e] of ext.examples.entries()){
  ok(!seen.has(e.id),e.id+' unique additions');seen.add(e.id);
  const a=by[e.id],m=meta[e.id];ok(a&&idConcept[e.id]===r.concept&&m.concept===r.concept,e.id+' concept');ok(a.answer===r.answers[i]&&e.answer===a.answer&&e.comment===a.explain&&e.context===a.context&&JSON.stringify(e.auction)===JSON.stringify(a.auction)&&JSON.stringify(e.hand)===JSON.stringify(a.hand),e.id+' unchanged');
  ok(ext.minSession>=m.minSession&&m.requires.every(p=>ext.prerequisites.some(z=>z.concept===p.concept&&z.minExposure>=p.minExposure)),e.id+' source gates');
 }
}
ok(seen.size===report.counts.newDistinctExamples,'new examples');
ok(corpus['fortes.relais'].rule.includes('exception des deux Rois'),'ordinary vs exception');
ok(by['SEF-V49-005'].answer==='1♥'&&by['SEF-V476-005'].answer==='4♠','latest catalog prevails over historical');
console.log({assertions:n,newExtensions:report.counts.newExtensions,newDistinctExamples:seen.size,concepts:report.counts.conceptsExpanded,totalDistinctExamples:report.counts.distinctExamples});
