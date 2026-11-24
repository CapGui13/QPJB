'use strict';
// Explicit, opt-in routine commits. This is a scope check, not a claim that
// arbitrary UI code is semantically safe. Unknown/sensitive edits use FULL.
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const vm=require('node:vm');
const SHA=/^[0-9a-f]{40}$/;
const UI=new Set(['index.html','quizz.html','qpjb-bridge-ui.css','qpjb-design-tokens.css',
 'entrainement/index.html','entrainement/qp-training-corrige.html','entrainement/originaux.html',
 'entrainement/training-core.css','entrainement/training-integrated.css','entrainement/training-originals.css',
 'entrainement/training-app.js','entrainement/training-originals.js']);
const protectedCode=/\b(?:localStorage|sessionStorage|indexedDB|serviceWorker|caches|saveKey|storageKey|importProgress|exportProgress|selectionDiagnostics|trainingData|QPJB_PREREQUIS_V1|QPJBParcours|QPJB_PARCOURS|KEY)\b|\.record\s*\(|\.select\s*\(|\.finish\s*\(|\.start\s*\(|\b(?:saved|sessionIds)\s*(?:\[|=)|\b(?:fetch|postMessage)\s*\(/i;
function git(args,cwd){return execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});}
function blob(ref,p,cwd){return git(['show',ref+':'+p],cwd);}
function quizParts(s){
 const re=/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/g;
 const matches=[...s.matchAll(re)];assert.equal(matches.length,1,'Quiz data block');
 return {payload:matches[0][1],outside:s.replace(re,'<script id="training-data" type="application/json">DATA</script>')};
}
function changedQcm(before,after){
 const a=quizParts(before),b=quizParts(after);
 assert.equal(a.outside,b.outside,'QCM correction must not change UI or code');
 const x=JSON.parse(a.payload),y=JSON.parse(b.payload);
 assert(Array.isArray(x.exercises)&&Array.isArray(y.exercises));
 const {exercises:old,...other}=x,{exercises:next,...otherNext}=y;
 assert.deepEqual(otherNext,other,'catalogue metadata unchanged');
 assert.equal(next.length,old.length,'catalogue count unchanged');
 const ids=new Set();let count=0;
 for(let i=0;i<old.length;i++){
  const p=old[i],q=next[i];
  assert.equal(q.id,p.id,'stable IDs/order');assert(!ids.has(q.id),'duplicate ID');ids.add(q.id);
  if(JSON.stringify(p)===JSON.stringify(q))continue;
  count++;
  const allowed=new Set(['context','explain','answer','choices']);
  for(const key of new Set([...Object.keys(p),...Object.keys(q)])){
   if(!allowed.has(key))assert.deepEqual(q[key],p[key],'protected QCM field '+key);
  }
  for(const key of ['context','explain','answer'])assert(typeof q[key]==='string'&&q[key].trim(),'empty '+key);
  assert(Array.isArray(q.choices)&&q.choices.length===4&&q.choices.every(v=>typeof v==='string'&&v.trim()));
  assert.equal(new Set(q.choices).size,4,'distinct choices');assert(q.choices.includes(q.answer),'answer present');
 }
 assert(count>0&&count<=20,'routine correction: 1–20 existing QCM');
 return count;
}
function inspectCommit(parent,head,cwd){
 const subject=git(['show','-s','--format=%s',head],cwd).trim();
 const m=/^routine\((ui|qcm)\):\s+\S/.exec(subject);assert(m,'not explicitly routine');
 const raw=git(['diff','--raw','--no-abbrev','--no-renames','-z',parent,head],cwd).split('\0');
 assert.equal(raw.pop(),'');assert(raw.length>0&&raw.length%2===0);
 const files=[];
 for(let i=0;i<raw.length;i+=2){
  const p=raw[i+1];
  assert(/^:100644 100644 [a-f0-9]{40} [a-f0-9]{40} M$/.test(raw[i]),'routine modifies existing regular files only');
  assert(m[1]==='qcm'?p==='quizz.html':UI.has(p),'sensitive/unlisted path: '+p);
  const before=blob(parent,p,cwd),after=blob(head,p,cwd);
  if(m[1]==='qcm')changedQcm(before,after);
  else {
   if(p==='quizz.html')assert.equal(quizParts(before).payload,quizParts(after).payload,'UI must preserve every QCM');
   if(!p.endsWith('.css')){
    const diff=git(['diff','--unified=0','--no-ext-diff','--no-textconv',parent,head,'--',p],cwd);
    for(const l of diff.split('\n'))if(/^[+-](?![+-]{2})/.test(l))assert(!protectedCode.test(l),'sensitive code change in '+p);
   }
  }
  files.push(p);
 }
 return {scope:m[1],files};
}
function routineRange(base,head,cwd=process.cwd(),{allowQcm=false}={}){
 try{
  assert(SHA.test(base)&&SHA.test(head)&&base!==head);
  git(['merge-base','--is-ancestor',base,head],cwd);
  const rows=git(['rev-list','--reverse','--parents',base+'..'+head],cwd).trim().split('\n');
  assert(rows.length>0&&rows.length<=32);
  let prev=base;const results=[];
  for(const row of rows){
   const [commit,parent,...extra]=row.split(' ');
   assert(SHA.test(commit)&&parent===prev&&!extra.length,'routine range must be linear');
   const result=inspectCommit(parent,commit,cwd);
   assert(allowQcm||result.scope!=='qcm','catalogue legacy approval registry still locked');
   results.push(result);prev=commit;
  }
  assert.equal(prev,head);
  return results;
 }catch(e){return null;}
}
function syntax(p,s){
 assert(s.trim()&&!s.includes('\0'),'empty/invalid resource '+p);
 if(p.endsWith('.js'))new vm.Script(s,{filename:p});
 if(p.endsWith('.html')){
  for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
   if(/\bsrc\s*=/.test(m[1])||/\btype\s*=\s*["']application\/json["']/.test(m[1]))continue;
   new vm.Script(m[2],{filename:p});
  }
 }
}
function check(base,head,cwd=process.cwd()){
 const results=routineRange(base,head,cwd);assert(results,'routine scope not eligible');
 assert.equal(git(['rev-parse','HEAD'],cwd).trim(),head);
 for(const p of new Set(results.flatMap(x=>x.files)))syntax(p,blob(head,p,cwd));
 console.log('ROUTINE_PASS '+results.map(x=>x.scope+':'+x.files.join(',')).join('; '));
 return results;
}
if(require.main===module){
 const [mode,base,head]=process.argv.slice(2);
 if(mode==='--eligible')process.exitCode=routineRange(base,head)?0:1;
 else if(mode==='--check')check(base,head);
 else throw Error('Expected --eligible or --check BASE HEAD');
}
module.exports={routineRange,changedQcm,syntax,check};
