'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'), read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const report=read('audits/apprentissage-durable-20261126/m5/validation-historique-finale.json'),{corpus,idConcept}=read('audits/apprentissage-durable-20261126/m5/corpus-verification.json'),registry=read('audits/apprentissage-durable-20261126/m5/registre.json');
const api=require('../quizz-durable-m5-lecons.js'),meta=require('../quizz-prerequis.js').byId;
const txt=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const all=(function(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error('catalogue')})(txt);
const by=Object.fromEntries(all.map(x=>[x.id,x])),groups={};for(const [id,m] of Object.entries(meta))(groups[m.concept]??=[]).push(id);
const history={active:null,completed:65,journal:[],entries:Object.fromEntries(Object.keys(meta).map(id=>[id,{assessment:{result:'wrong',assisted:true,lastSession:0}}]))};
let n=0;function ok(x,m){n++;if(!x)throw Error(m)}
const seen=new Set(),ids=new Set(report.newExtensions.map(x=>x.id)),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const getExamples=l=>[...l.examples,...(l.extensions||[]).flatMap(e=>e.examples)];
const allExamples=Object.values(corpus).flatMap(getExamples),allIds=new Set(allExamples.map(x=>x.id));
for(const r of report.newExtensions){const ext=corpus[r.concept].extensions.find(e=>e.id===r.id),ctx={concept:r.concept,history,mode:'study'};
 ok(ext&&ext.assisted&&!ext.assessment&&ext.check.assisted,r.id+' flags');
 ok(api.lesson(ctx).extensions.some(e=>e.id===r.id),r.id+' study');
 ok(api.lesson({...ctx,mode:'reminder'}).extensions.length===0,r.id+' recall');
 ok(api.lesson({...ctx,questionActive:true})===null,r.id+' active');
 ok(!api.lesson({...ctx,history:{...history,completed:ext.minSession-1}})?.extensions.some(e=>e.id===r.id),r.id+' calendar');
 ok(same(ext.prerequisites,r.prerequisites)&&ext.minSession===r.minSession,r.id+' gates');
 const reg=registry.find(x=>x.concept===r.concept).extensions.find(x=>x.id===r.id);
 ok(reg&&same(reg.sources,r.ids)&&same(reg.requires,r.prerequisites),r.id+' registry');
 for(const p of ext.prerequisites){const entries={...history.entries};for(const id of groups[p.concept])delete entries[id];ok(!api.lesson({...ctx,history:{...history,entries}})?.extensions.some(e=>e.id===r.id),r.id+' prerequisite '+p.concept)}
 for(const [i,e] of ext.examples.entries()){const a=by[e.id],m=meta[e.id];ok(!seen.has(e.id),e.id+' unique');seen.add(e.id);
 ok(e.id===r.ids[i]&&e.answer===r.answers[i]&&e.answer===a.answer&&e.comment===a.explain&&e.context===a.context&&same(e.hand,a.hand)&&same(e.auction,a.auction),e.id+' exact');
 ok(ext.minSession>=m.minSession&&m.requires.every(p=>ext.prerequisites.some(z=>z.concept===p.concept&&z.minExposure>=p.minExposure)),e.id+' source gates');ok(idConcept[e.id]===r.concept,e.id+' concept');}
}
for(const x of report.edits){const l=corpus[x.concept],ctx={concept:x.concept,history,mode:'study'};for(const [k,v] of Object.entries(x.after))ok(l[k]===v,x.concept+' rule edit '+k);ok(api.lesson(ctx).rule===l.rule,x.concept+' rendered');ok(api.lesson({...ctx,mode:'reminder'}).rule===l.reminder,x.concept+' reminder')}
for(const x of report.glossary){const l=corpus[x.concept],ctx={concept:x.concept,history,mode:'study'};ok(x.added.length<=2&&x.added.every(d=>l.definitions.includes(d)),x.concept+' glossary bound');ok(x.added.every(d=>api.lesson(ctx).definitions.includes(d)),x.concept+' glossary visible');ok(api.lesson({...ctx,mode:'reminder'}).definitions.length===0,x.concept+' short reminder');}
function parseCsv(s){let rows=[],row=[],field="",quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){field+='"';i++}else quoted=!quoted}else if(!quoted&&c===";"){row.push(field);field=""}else if(!quoted&&c==="\n"){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field=""}else field+=c}if(row.length||field){row.push(field);rows.push(row)}const keys=rows.shift();return rows.map(row=>Object.fromEntries(keys.map((k,i)=>[k,row[i]])))}
const sourceClosures=parseCsv(fs.readFileSync(path.join(root,'audits/REGISTRE_QUIZ_SEF_V4110_118_CLOTURES.csv'),'utf8'));
ok(sourceClosures.length===118&&report.closureRows.length===118,'all historical closures');
for(const [i,x] of report.closureRows.entries()){const old=sourceClosures[i],q=by[x.id];ok(x.id===old.id&&x.oldAnswer===old.reponse_actuelle_v4110&&x.historicalStatus===old.revue_finale_statut&&x.historicalDecision===old.arbitrage_ou_accord_important,x.id+' archival identity');ok(x.currentAnswer===q.answer&&x.concept===meta[x.id].concept,x.id+' frozen identity');ok(x.answerStatus===(x.oldAnswer===q.answer?'same':'later-catalogue-differs'),x.id+' reconciliation');ok(x.usage===(allIds.has(x.id)?'canonical-example':'not-selected-as-example'),x.id+' usage')}
const g=read('audits/pedagogie/validation-globale-29-20261124.json'),t=read('audits/pedagogie/proposition-26-textes-revue-20261123.json');
const expected=[...g.items.map(x=>[x.id,'global29',x.fields,x.after]),...g.retained.map(x=>[x.id,'global29',['context','explain','answer'],x.current]),...t.items.map(x=>[x.id,'text26',x.fields,x.after])];
for(const [p,source] of [['audits/pedagogie/validations-2sa-fitte-20261123.json','2sa-fitte'],['audits/pedagogie/validations-lot-a-complement-20261123.json','lot-a']])for(const x of read(p).approved)expected.push([x.id,source,[x.field],{[x.field]:x.after}]);
ok(expected.length===60&&report.approved.length===60,'all approved decisions');
for(const [i,x] of report.approved.entries()){const [id,source,fields,after]=expected[i],q=by[id];ok(x.id===id&&x.source===source&&same(x.fields.map(f=>f.field),fields),id+' approved identity');ok(x.currentAnswer===q.answer&&x.concept===meta[id].concept,id+' current answer');for(const f of x.fields){ok(same(f.approved,after[f.field])&&same(f.current,q[f.field]),id+' exact approved/current field');ok(f.status===(same(after[f.field],q[f.field])?'exact':'later-catalogue-differs'),id+' field comparison')}ok(x.usage===(allIds.has(id)?'canonical-example':'not-selected-as-example'),id+' usage')}
const oldExamples=Object.values(corpus).flatMap(l=>[...l.examples,...(l.extensions||[]).filter(e=>!ids.has(e.id)).flatMap(e=>e.examples)]);
ok(new Set(oldExamples.map(e=>e.id)).size===report.counts.previousExamples,'previous coverage');ok(allIds.size===report.counts.distinctExamples&&seen.size===report.counts.newDistinctExamples,'current coverage');
ok(Object.values(corpus).reduce((s,l)=>s+(l.extensions||[]).length,0)===report.counts.extensions,'all extensions');
console.log({assertions:n,extensions:ids.size,newExamples:seen.size,closureRows:report.closureRows.length,approvedRows:report.approved.length,glossaryConcepts:report.glossary.length});
