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
const run=()=>vm.runInNewContext(fragment,ctx);
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
