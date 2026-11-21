'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const observed=JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','audits/wave2/ci/observed-performance.json'),'utf8'));
const keys={before:['integrity','chromium','webkit'],after:['integrity','parcours-long','chromium','webkit']};
const median=a=>{const s=a.slice().sort((a,b)=>a-b);return (s[Math.floor((s.length-1)/2)]+s[Math.floor(s.length/2)])/2};
function analyse(data){
 const ids=new Set(),metrics={};
 for(const cohort of ['before','after']){
  assert(Array.isArray(data[cohort])&&data[cohort].length>=2,'Insufficient '+cohort+' observations');
  for(const sample of data[cohort]){
   assert(Number.isSafeInteger(sample.id)&&!ids.has(sample.id),'Run id duplicated or invalid');ids.add(sample.id);
   assert(Number.isInteger(sample.seconds)&&sample.seconds>0,'Run wall time invalid');
   assert.deepEqual(Object.keys(sample.jobs).sort(),keys[cohort].slice().sort(),'Unexpected required job set');
   const js=Object.values(sample.jobs);
   assert(js.every(v=>Number.isInteger(v)&&v>0),'Job time invalid');
   assert(sample.seconds>=Math.max(...js),'Wall time shorter than the longest job');
   assert(sample.seconds<=js.reduce((a,b)=>a+b,0)+120,'Wall time wildly exceeds available job time');
  }
  metrics[cohort]={count:data[cohort].length,wallMedian:median(data[cohort].map(x=>x.seconds)),
   jobSecondsMedian:median(data[cohort].map(x=>Object.values(x.jobs).reduce((a,b)=>a+b,0)))};
 }
 metrics.wallGainPercent=+(100*(1-metrics.after.wallMedian/metrics.before.wallMedian)).toFixed(1);
 metrics.jobSecondsGainPercent=+(100*(1-metrics.after.jobSecondsMedian/metrics.before.jobSecondsMedian)).toFixed(1);
 return metrics;
}
const report=analyse(observed);
assert.equal(report.before.count,6);
// Negative controls: missing WebKit job, duplicated run and impossible time must fail.
for(const mutate of [
 data=>{delete data.after[0].jobs.webkit},
 data=>{data.after[0].id=data.before[0].id},
 data=>{data.after[0].seconds=1}
]){
 const copy=structuredClone(observed);mutate(copy);assert.throws(()=>analyse(copy));
}
if(report.wallGainPercent<25)console.warn('::warning::Median CI elapsed-time gain below 25% target');
if(report.jobSecondsGainPercent<0)console.warn('::warning::Increased summed runner time; investigate billing and parallelism');
const afterLong=observed.after.map(x=>x.jobs['parcours-long']);
const typicalLong=median(afterLong);
for(const x of observed.after)if(x.jobs['parcours-long']>1.5*typicalLong)
 console.warn('::warning::Long-run outlier '+x.id+': '+x.jobs['parcours-long']+' s (median '+typicalLong+' s)');
console.log('WAVE2 CI PERFORMANCE PASS '+JSON.stringify(report));
