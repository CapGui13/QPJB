'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const api=require('../quizz-diagnostic-erreurs.js');
const q=JSON.parse(fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const data=require('../audits/professeur-numerique-20261126/m3/revue-cycle3.json'),plaus=require('../audits/professeur-numerique-20261126/m3/plausibilite.json');
const buildReview=function buildReview(q,api,plaus,baseline,judgement){
 const by=new Map(q.map(x=>[x.id,x])),pc=new Map(plaus.rows.map(r=>[r.id,r.before])),jud=new Map(judgement.map(([id,c,n])=>[id+':'+c,n]));
 const metrics={},concepts={},seen=new Set();
 const rows=baseline.map(([id,choice,previousRule])=>{
  const x=by.get(id);if(!x||!x.choices.includes(choice)||choice===x.answer||seen.has(id+':'+choice))throw Error('baseline option '+id+' '+choice);
  seen.add(id+':'+choice);
  const d=api.diagnose({exercise:x,choice}),ev=d.evidence,contrast=pc.get(id).find(o=>o.choice===choice).contrast;
  let disposition;
  if(d.status==='hypothesis')disposition=ev.rule.startsWith('pn3-reviewed-pair-')?'hypothesis-paired':ev.rule.startsWith('pn3-reviewed-explicit-')?'hypothesis-explicit':'hypothesis-contextual';
  else if(ev.rule==='editorial-hold')disposition='editorial-hold';
  else if(jud.has(id+':'+choice))disposition='judgement-unknown';
  else if(ev.canonicalExcerpt)disposition='unknown-multiple-axes';
  else if(contrast.id)disposition='unknown-contrast-available';
  else disposition='unknown-no-catalogue-contrast';
  metrics[disposition]=(metrics[disposition]||0)+1;
  const group=concepts[ev.concept]??={total:0,dispositions:{}};group.total++;group.dispositions[disposition]=(group.dispositions[disposition]||0)+1;
  return {id,choice,previousRule,concept:ev.concept,status:d.status,category:d.category,rule:ev.rule,disposition,contrast:{id:ev.contrastId||contrast.id,level:ev.contrastId?'reviewed-same-family-context':contrast.level},...(ev.canonicalExcerpt?{excerpt:ev.canonicalExcerpt}:{}),...(d.status==='hypothesis'?{reason:d.reason}:{}),...(jud.has(id+':'+choice)?{judgement:jud.get(id+':'+choice)}:{})};
 });
 return {metrics,concepts,rows};
};
const result=buildReview(q,api,plaus,data.baseline,data.judgement);
assert.deepEqual(result,data.review);
assert.equal(result.rows.length,3071);
const by=new Map(q.map(x=>[x.id,x]));
for(const [id,choice,category,rule,contrastId] of data.changes){const x=by.get(id),d=api.diagnose({exercise:x,choice});assert.equal(d.status,'hypothesis');assert.equal(d.category,category);assert.equal(d.evidence.rule,rule);if(contrastId){const y=by.get(contrastId);assert.equal(y.answer,choice);assert.deepEqual(y.auction,x.auction);assert.equal(y.context,x.context);assert.equal(y.caseFamily,x.caseFamily);assert.equal(d.evidence.contrastId,contrastId);}if(rule.startsWith('pn3-reviewed-explicit-'))assert.ok(x.explain.includes(d.evidence.canonicalExcerpt));assert.equal(api.diagnose({exercise:{...x,h:x.h+1},choice}).status,'unknown');}
for(const [id,choice,oldCategory,category,rule] of data.refinements){const d=api.diagnose({exercise:by.get(id),choice});assert.equal(d.status,'hypothesis');assert.equal(d.category,category);assert.equal(d.evidence.rule,rule);assert.equal(d.evidence.refinedFrom,'same-denomination-natural-level');}
assert.equal(result.metrics['editorial-hold'],3);console.log(JSON.stringify(result.metrics));
