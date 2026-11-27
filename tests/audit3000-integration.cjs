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
assert.deepEqual(current.api.audit3000Risk().sort(),[...riskIds].sort(),'Exact revision impact coverage');
const cases=[];
for(const id of [...riskIds].sort()){
 const oq=oldById.get(id),nq=newById.get(id),s=prior.api.empty();
 // Deliberate one-question fixture: isolate recording and reload, not selection.
 s.active={mode:'parcours',ids:[id],index:0,answers:{}};
 assert(prior.api.record(s,oq,'correct',0,oq.answer,false,false),'Historical record '+id);
 const midRaw=JSON.stringify(s),mid=current.api.load(midRaw);
 assert.equal(JSON.stringify(s),midRaw,'No mutation of input');
 assert.deepEqual(mid.active.ids,[id]);
 assert.equal(mid.active.index,0);
 assert.equal(Object.keys(mid.active.answers).length,0,'Revised answer must be attempted again '+id);
 assert.deepEqual(mid.audit3000Archive.active,prior.api.load(midRaw).active,'Active observation archived '+id);
 assert(!mid.entries[id]);
 assert(prior.api.finish(s,prior.exercises),'Historical finish '+id);
 const raw=JSON.stringify(s),oldObserved=prior.api.load(raw),restored=current.api.load(raw);
 assert.equal(restored.completed,s.completed,'Completed sessions retained '+id);
 assert.deepEqual(restored.audit3000Archive.journal,[{index:0,event:oldObserved.journal[0]}],'Exact old event '+id);
 assert.deepEqual(restored.audit3000Archive.entries[id],oldObserved.entries[id],'Exact old entry '+id);
 assert.equal(restored.journal.length,0);
 assert(!restored.entries[id]);
 const buckets=new Set([oq.theme,nq.theme,prior.api.microKey(oq),current.api.microKey(nq),prior.api.axisKey(oq),current.api.axisKey(nq)].filter(Boolean));
 for(const field of ['skills','micros','axes'])for(const bucket of buckets)if(Object.hasOwn(oldObserved[field],bucket)){
   assert.deepEqual(restored.audit3000Archive.aggregates[field][bucket],oldObserved[field][bucket]);
   assert(!Object.hasOwn(restored[field],bucket),'Stale aggregate '+field+'/'+bucket);
 }
 const concept=current.meta.byId[id].concept;
 const proof=current.api.auditEvidence(restored,current.exercises);
 assert.equal((proof.proofs.get(concept)||[]).length,0,'No current proof from old question '+id);
 assert.equal(current.api.dashboard(restored,current.exercises).themes.find(t=>t.id===nq.theme)?.independent,0);
 assert.deepEqual(current.api.load(JSON.stringify(restored)),restored,'Idempotent migrated reload '+id);
 const exported=current.api.exportProgress(restored,current.exercises,{});
 assert.deepEqual(exported.historicalAuditArchive,restored.audit3000Archive);
 assert.equal(exported.summary.recordedDetailedSessions,1,'Archived session is not missing');
 assert.equal(exported.limitations.historicalSessionsWithoutDetailedAnswers,0);
 assert.deepEqual(current.api.importProgress(JSON.stringify(prior.api.exportProgress(s,prior.exercises,{}))),restored,'Import old export '+id);
 // A fresh autonomous result on the new catalogue is legitimate evidence.
 restored.active={mode:'parcours',ids:[id],index:0,answers:{}};
 assert(current.api.record(restored,nq,'correct',0,nq.answer,false,false));
 assert(current.api.finish(restored,current.exercises));
 const fresh=current.api.load(JSON.stringify(restored));
 assert.equal(fresh.completed,2);
 assert.equal(fresh.journal[0].answers[0].choice,nq.answer);
 assert.equal(fresh.entries[id].result,'correct');
 assert.equal((current.api.auditEvidence(fresh,current.exercises).proofs.get(concept)||[]).length,1);
 assert.deepEqual(fresh.audit3000Archive,exported.historicalAuditArchive);
 assert.deepEqual(current.api.importProgress(JSON.stringify(current.api.exportProgress(fresh,current.exercises,{}))),fresh);
 cases.push(id);
}
// Mixed journal/active deck: unaffected observations remain usable; archive
// retains original order and all old answer choices. Legacy aggregate-only
// history is conservative and never turns into invented journal events.
const revised=actualChangedAnswers[0],stable=prior.exercises.find(q=>!riskIds.has(q.id)&&q.theme!==oldById.get(revised).theme),mixed=prior.api.empty();
const ids=[stable.id,revised], oq=oldById.get(revised);
mixed.active={mode:'parcours',ids,index:0,answers:{}};
assert(prior.api.record(mixed,stable,'correct',0,stable.answer,false,false));
assert(prior.api.record(mixed,oq,'correct',1,oq.answer,false,false));
const mixedActive=current.api.load(JSON.stringify(mixed));
assert.deepEqual(mixedActive.active.ids,ids);
assert.equal(mixedActive.active.answers[0].choice,stable.answer);
assert(!Object.hasOwn(mixedActive.active.answers,1));
assert.equal(mixedActive.active.index,1);
assert.deepEqual(mixedActive.entries[stable.id],prior.api.load(JSON.stringify(mixed)).entries[stable.id]);
assert(prior.api.finish(mixed,prior.exercises));
const mixedObserved=prior.api.load(JSON.stringify(mixed)),mixedRestored=current.api.load(JSON.stringify(mixed));
assert.deepEqual(mixedRestored.journal[0].answers,[mixedObserved.journal[0].answers[0]]);
assert.deepEqual(mixedRestored.audit3000Archive.journal[0].event,mixedObserved.journal[0]);
assert.deepEqual(mixedRestored.entries[stable.id],mixedObserved.entries[stable.id]);
assert.deepEqual(mixedRestored.skills[stable.theme],mixedObserved.skills[stable.theme]);
const legacy=JSON.parse(JSON.stringify(mixed));delete legacy.journal;
const legacyRestored=current.api.load(legacy);
assert.equal(legacyRestored.journal.length,0);
assert.deepEqual(legacyRestored.audit3000Archive.entries[revised],mixedObserved.entries[revised]);
assert.equal(legacyRestored.completed,1);
assert.deepEqual(current.api.load(JSON.stringify(legacyRestored)),legacyRestored);
console.log('AUDIT3000 guided history migration: PASS',JSON.stringify({riskIds:cases.length,materialRevisions:material.size,answerChanges:actualChangedAnswers.length,classificationChanges:reassigned.length,active:true,import:true,legacy:true,mixed:true,idempotent:true,originalJournalPreserved:true,staleCurrentProofs:0}));
