'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),p=path.join(root,'audits/professeur-numerique-20261126/m3/parallel/');
const read=f=>JSON.parse(fs.readFileSync(path.join(p,f),'utf8'));
const q=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const engine=require('../quizz-diagnostic-erreurs.js');
const d=read('cloture-editoriale.json'),h=read('hold-integres.json'),ps=read('patches-integres.json'),by=new Map(q.map(x=>[x.id,x]));
let n=0;const ok=(v,s)=>{n++;if(!v)throw Error(s)};
const key=x=>JSON.stringify([x.id,x.choice]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
ok(d.holds.decisions.length===39&&new Set(d.holds.decisions.map(key)).size===39,'39 holds');
ok(h.active.every(x=>d.holds.decisions.some(r=>key(r)===key(x))),'hold coverage');
for(const r of d.holds.decisions){const x=by.get(r.id);ok(x&&x.answer===r.answer&&x.choices.includes(r.choice)&&r.reason.length>20&&!r.catalogueChange,'hold '+r.id);ok(engine.diagnose({exercise:x,choice:r.choice}).status==='unknown','unknown '+r.id)}
ok(d.patches.decisions.length===16&&new Set(d.patches.decisions.map(x=>x.id)).size===16,'16 patches');
ok(d.patches.decisions.filter(x=>x.decision==='recommend').length===14&&d.patches.decisions.filter(x=>x.decision==='defer').length===2,'decisions');
for(const r of d.patches.decisions){const x=by.get(r.id),old=ps.proposals.find(z=>z.id===r.id);ok(x&&old&&same(x.choices,r.oldChoices)&&same(old.newChoices,r.newChoices)&&!r.applied&&r.requiresGlobalIntegration,'patch '+r.id);ok(x.answer===r.answer&&r.newChoices.length===4&&new Set(r.newChoices).size===4&&r.newChoices.includes(x.answer),'answer '+r.id);ok(x.choices.includes(r.removed)&&!r.newChoices.includes(r.removed)&&!x.choices.includes(r.added)&&r.newChoices.includes(r.added),'one replacement '+r.id);const o=engine.diagnose({exercise:{...x,choices:r.newChoices},choice:r.added});ok(!['illegal-call','invalid-call','unparsed-auction','unverified-case'].includes(o.evidence.rule),'legal '+r.id);ok(r.diagnostics.length===3&&r.newChoices.filter(c=>c!==x.answer).every(c=>r.diagnostics.some(d=>d.choice===c&&d.status==='hypothesis'&&d.reason)),'diagnostics '+r.id)}
console.log(JSON.stringify({assertions:n,holds:39,recommended:14,deferred:2,applied:0}));
