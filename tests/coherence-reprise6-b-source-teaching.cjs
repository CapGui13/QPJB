'use strict';
const assert=require('node:assert/strict');
const S=require('../quizz-coherence-reprise6-b-source-teaching.js');
const C=require('../quizz-coherence-reprise6-b-context.js');
const B=require('../quizz-coherence-reprise6-b-transitions.js');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa';
const extract=x=>x.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
function feedback(html){
 const escape=html.split('\n').find(x=>x.startsWith('const escapeHTML='));
 const line=html.split('\n').find(x=>x.includes('const feedback=answered?'));
 assert(escape&&line);
 const start=html.indexOf('function supplement(q,type,result)');
 const helper=start<0?'':html.slice(start,html.indexOf('function professeurFeedbackHTML',start));
 return new Function('x','sessionType','current','answered','verdict','personalised','reviewBadge',escape+'\n'+helper+'\n'+line+'\nreturn feedback;');
}
function run(html,meta){
 const changed=C.instrumentHTML(S.instrumentHTML(html));
 assert.equal(extract(html),extract(changed),'catalogue bytes');
 const ex=JSON.parse(extract(html)).exercises;
 const before=feedback(html),after=feedback(changed),ids=[];
 assert.equal(ex.length,1915);
 assert.deepEqual(ex.filter(q=>meta[q.id].concept==='sa1.texas').map(q=>q.id).sort(),[...S.FIRST].sort());
 for(const q of ex){
  const show=(f,mode,result,answered)=>f(q,mode,{result},answered,'','','');
  const a=show(before,'parcours','correct',true),b=show(after,'parcours','correct',true);
  if(a!==b){ids.push(q.id);assert(S.FIRST.includes(q.id));assert(b.includes(S.CONTRAST));}
  assert.equal(show(after,'parcours','wrong',true)!==show(before,'parcours','wrong',true),a!==b);
  assert.equal(show(after,'parcours','correct',false),'');
  assert.equal(show(after,'parcours','wrong',false),'');
  assert.equal(show(after,'parcours','skipped',true),show(before,'parcours','skipped',true));
  assert.equal(show(after,'libre','correct',true),show(before,'libre','correct',true));
  assert.equal(show(after,'consolidation','correct',true),show(before,'consolidation','correct',true));
 }
 assert.equal(ids.length,12);
 assert.deepEqual(S.FIRST.filter(id=>!ids.includes(id)).sort(),['SEF-037-1','SEF-V44-015','SEF-V49-017'].sort());
 return {catalogue:ex.length,feedbackChanged:ids,unchanged:ex.length-ids.length};
}
// Raw historical transition counts stay untouched. Separately model feedback
// that is actually made available by the native answered-render path.
// A skipped question is never an exposure through this feedback. No proof.
function taught(trace,candidate){
 const prior=new Set(),seenTargets=new Set(),missing=[],first=[];
 for(const s of trace.sessions){
  for(const row of s.rows){const spec=B.specs[row.id];if(!spec||seenTargets.has(row.id))continue;
   seenTargets.add(row.id);
   const ids=candidate&&spec.need.startsWith('texas-')?S.FIRST:B.sourceIds(spec.need,'E');
   const sources=ids.filter(id=>prior.has(id));
   const observation={session:s.session,id:row.id,need:spec.need,priorFeedback:sources};
   first.push(observation);if(!sources.length)missing.push(observation);
  }
  for(const row of s.rows){const result=row.result??row.response?.result;if(['correct','wrong'].includes(result))prior.add(row.id)}
 }
 return {first,missing};
}
module.exports={BASE,run,taught};
if(require.main===module){
 const cp=require('node:child_process'),fs=require('node:fs');
 const html=cp.execFileSync('git',['show',BASE+':quizz.html'],{encoding:'utf8',maxBuffer:32*1024*1024});
 console.log(JSON.stringify(run(html,require('../quizz-prerequis.js').byId)));
 if(process.env.TRACES){
  const t=JSON.parse(fs.readFileSync(process.env.TRACES,'utf8')).traces;
  const out={};
  for(const key of ['m','d'])out[key]={raw:B.specs&&require('./coherence-reprise6-b-campaign.cjs').transition(t[key],'E'),before:taught(t[key],false),after:taught(t[key],true)};
  console.log('B_TEACHING '+JSON.stringify(out));
 }
}
