'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto');
const base='ccd8f20811b9531bbfccb8352ec60953dd7d07cb', dir='audits/audit3000-20261127/';
const read=p=>fs.readFileSync(p,'utf8'), old=p=>cp.execFileSync('git',['show',base+':'+p],{maxBuffer:20*1024*1024});
const extract=s=>JSON.parse(s.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const baseHtml=old('quizz.html'),sha=crypto.createHash('sha1').update('blob '+baseHtml.length+'\0').update(baseHtml).digest('hex');
assert.equal(sha,'59fb3ca4c826d4f08905b1c5b076b7f09a5304fb');
const b=extract(baseHtml.toString()),a=extract(read('quizz.html')),m=JSON.parse(read(dir+'INTEGRATION-CATALOGUE.json')).byId;
assert.equal(a.exercises.length,3000);assert.deepEqual(a.exercises.map(q=>q.id),b.exercises.map(q=>q.id));
const applied=new Set();for(let i=0;i<3000;i++){const o=b.exercises[i],q=a.exercises[i],x=m[o.id];if(x){assert.deepEqual(x.before,o);assert.deepEqual(x.after,q);assert.notDeepEqual(o,q);applied.add(o.id);}else assert.deepEqual(q,o);}
assert.equal(applied.size,Object.keys(m).length);assert.deepEqual({...a,exercises:b.exercises},b);
console.log('AUDIT3000 exact base/manifest and IDs: PASS',applied.size);

/* Actual browser migration, not a reconstruction of its logic. */
const vm=require('node:vm');
const html=read('quizz.html'), start=html.indexOf('const revisedSefNov2026='), end=html.indexOf('let deck=',start);
assert(start>=0&&end>start,'migration anchors');
const fragment=html.slice(start,end);
const report=JSON.parse(read(dir+'INTEGRATION-RECETTE.json'));
const revisions=vm.runInNewContext(fragment+'\nrevisedSefNov2026;', {saved:{},localStorage:{},saveKey:'test'});
const auditIds=Object.keys(revisions).filter(id=>revisions[id].startsWith('audit3000-')).sort();
assert.deepEqual(auditIds,[...report.materialChanges].sort());
assert(report.answerChanges.every(id=>auditIds.includes(id)));
assert(!auditIds.includes('SEF-V479-004')&&!auditIds.includes('SEF-V479-008'),'previous arbitration protected');
const untouched=a.exercises.find(q=>!Object.hasOwn(revisions,q.id)).id;
const entry={seen:true,ok:true,lastResult:'correct',assisted:false,attempts:3,correct:3,wrong:0,skipped:0,streak:3,independentCorrect:3,assistedCorrect:0,history:[{ok:true}],first:'2026-11-20',last:'2026-11-21'};
const clone=x=>JSON.parse(JSON.stringify(x));
const saved=Object.fromEntries([...auditIds,untouched].map(id=>[id,clone(entry)]));
let writes=0, persisted=null;
const ctx={saved,saveKey:'test',localStorage:{setItem:(k,v)=>{assert.equal(k,'test');writes++;persisted=JSON.parse(v);}}};
// A reload creates a fresh JS realm while retaining the same persisted progress.
const run=()=>vm.runInNewContext(fragment,{...ctx});
run();
assert.equal(writes,1);
for(const id of auditIds){
 const x=saved[id];assert.equal(x.pedagogicalRevision,revisions[id]);
 assert.deepEqual(clone(x.archivedPreRevision),entry);
 assert.equal(x.seen,false);assert.equal(x.attempts,0);assert.equal(x.correct,0);assert.equal(x.history.length,0);
}
assert.deepEqual(saved[untouched],entry);assert.deepEqual(persisted,clone(saved));
const snapshot=clone(saved);run();assert.equal(writes,1);assert.deepEqual(clone(saved),snapshot);
console.log('AUDIT3000 actual progress migration: PASS',auditIds.length,'archived; untouched preserved; idempotent');


/* Read-only characterization of historical guided evidence. This does not
   certify a migration, change the production engine, or regrade old answers.
   The audit contract #556 explicitly prohibits changing engine logic. */
const campaign=require('./durable-m6-campaign.cjs');
const sourceName=p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js';
const oldNames=cp.execFileSync('git',['ls-tree','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(sourceName);
const newNames=fs.readdirSync('.').filter(sourceName);
const oldSources=Object.fromEntries([...new Set([...campaign.paths,...oldNames])].map(p=>[p,old(p).toString()]));
const newSources=Object.fromEntries([...new Set([...campaign.paths,...newNames])].map(p=>[p,read(p)]));
const evidenceAnchor=',VERSION,ROADMAP,INTRO';
assert.equal(newSources['quizz-parcours.js'].split(evidenceAnchor).length,2,'Exact read-only evidence instrumentation anchor');
newSources['quizz-parcours.js']=newSources['quizz-parcours.js'].replace(evidenceAnchor,',auditEvidence:evidence'+evidenceAnchor);
const prior=campaign.engine(oldSources), current=campaign.engine(newSources);
const oldById=new Map(prior.exercises.map(q=>[q.id,q])),newById=new Map(current.exercises.map(q=>[q.id,q]));
const actualChangedAnswers=prior.exercises.filter(q=>q.answer!==newById.get(q.id).answer).map(q=>q.id).sort();
assert.deepEqual(actualChangedAnswers,[...report.answerChanges].sort());
const signature=(e,q)=>({
 concept:e.meta.byId[q.id].concept,theme:q.theme,family:q.caseFamily||q.id,
 difficulty:q.difficulty,micro:e.api.microKey(q)??null,axis:e.api.axisKey(q)??null
});
const reassigned=prior.exercises.flatMap(q=>{
 const before=signature(prior,q),after=signature(current,newById.get(q.id));
 const fields=Object.keys(before).filter(k=>before[k]!==after[k]);
 return fields.length?[{id:q.id,fields}]:[];
});
const material=new Set(report.materialChanges);
const riskIds=new Set([...material,...reassigned.map(x=>x.id)]);
const cases=[];
for(const id of actualChangedAnswers){
 const oq=oldById.get(id),nq=newById.get(id),s=prior.api.empty();
 // Deliberate one-question fixture: isolate answer recording and reload,
 // not the production selection policy or a real student's history.
 s.active={mode:'parcours',ids:[id],index:0,answers:{}};
 assert(prior.api.record(s,oq,'correct',0,oq.answer,false,false),'Historical record '+id);
 const mid=current.api.load(JSON.stringify(s));
 assert.equal(mid.active.answers[0].choice,oq.answer,'Active historical choice retained '+id);
 assert.equal(mid.active.answers[0].result,'correct','Active historical result retained '+id);
 assert(prior.api.finish(s,prior.exercises),'Historical finish '+id);
 const restored=current.api.load(JSON.stringify(s)),observed=restored.journal[0].answers[0];
 assert.equal(restored.completed,s.completed,'Completed sessions retained '+id);
 assert.equal(observed.choice,oq.answer,'Historical choice retained '+id);
 assert.equal(observed.result,'correct','Historical result retained '+id);
 assert.equal(restored.entries[id].result,'correct','Historical entry retained '+id);
 const raw=JSON.stringify(restored);
 const proof=current.api.auditEvidence(restored,current.exercises);
 const concept=current.meta.byId[id].concept;
 const usedAsCurrentProof=(proof.proofs.get(concept)||[]).some(x=>x.family===(nq.caseFamily||id));
 const dashboard=current.api.dashboard(restored,current.exercises);
 assert.equal(JSON.stringify(restored),raw,'Read-only characterization '+id);
 cases.push({id,oldAnswer:oq.answer,currentAnswer:nq.answer,concept,usedAsCurrentProof,
   countedIndependentInDashboard:dashboard.themes.find(t=>t.id===nq.theme)?.independent===1,
   oldActiveAnswerPreserved:true});
}
const guidedDiagnostic={
 schema:'QPJB_AUDIT3000_GUIDED_DIAGNOSTIC_V1',base,
 materialRevisions:material.size,answerChanges:actualChangedAnswers.length,
 reassignedCount:reassigned.length,potentialEvidenceImpactIds:[...riskIds].sort(),reassigned,
 oldAnswerCases:cases,unversionedProofCount:cases.filter(c=>c.usedAsCurrentProof).length,
 limitations:['Synthetic isolated recording fixtures, not a production lesson or real student data.',
 'Classification change is a review candidate, not an instruction to erase evidence.',
 'No retroactive grading, no mutation, no production migration; historical aggregates without journals cannot be reconstructed.']
};
console.log('AUDIT3000 guided history characterization (not migration certification):',JSON.stringify(guidedDiagnostic));
if(guidedDiagnostic.unversionedProofCount)
 console.log('::warning::AUDIT3000 guided history retains historical answers but uses '+guidedDiagnostic.unversionedProofCount+' obsolete answer keys as current proof; separate versioned migration required.');
