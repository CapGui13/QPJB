'use strict';
// Optimistic fixed-native-deck oracle: adds abstract exposures, never actual QCM.
// This quantifies scheduling capacity; it cannot establish feasible donor slots,
// learning, or a candidate pass. No changes to native quotas are made here.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const CORE=['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base'];
const scenarios=[{id:'reference',gap:7,spacing:1,cap:0},...[7,10,14,21].map(gap=>({id:'ceiling-'+gap,gap,spacing:1,cap:9})),...[[4,1],[2,1],[1,1],[1,2],[1,3]].map(([spacing,cap])=>({id:'budget-'+spacing+'-'+cap,gap:7,spacing,cap}))];
function simulate(run,{gap,spacing,cap}){
 const last=new Map(),counts=Object.fromEntries(CORE.map(c=>[c,0]));let debt=0,used=0,previous=-100,peak=0,daysMulti=0;const recalls=[];
 for(const ss of run.sessions){
  const s=ss.session;for(const q of ss.rows)last.set(q.concept,s);
  if(s>=66&&s-previous>=spacing&&cap){
   const due=CORE.filter(c=>last.has(c)&&s-last.get(c)>=gap).sort((a,b)=>last.get(a)-last.get(b)||a.localeCompare(b)).slice(0,cap);
   for(const c of due){recalls.push({session:s,concept:c,gap:s-last.get(c)});last.set(c,s);counts[c]++;}
   if(due.length)previous=s;used+=due.length;peak=Math.max(peak,due.length);daysMulti+=Number(due.length>1);
  }
  for(const c of CORE)if(last.has(c))debt+=Math.max(0,s-last.get(c)-6);
 }
 return {debt,used,peak,daysMulti,counts,recalls};
}
function report(dir){
 const files=fs.readdirSync(dir).filter(x=>x.endsWith('-native.json.gz')).sort();assert.equal(files.length,18);
 const trajectories=[],totals=Object.fromEntries(scenarios.map(s=>[s.id,{debt:0,used:0,min:Infinity,max:0,peak:0,counts:Object.fromEntries(CORE.map(c=>[c,0]))}]));
 for(const f of files){
  const x=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir,f))));const r=x.run;assert.equal(r.sessions.length,180);
  const results={};for(const s of scenarios){const v=simulate(r,s),a=totals[s.id];results[s.id]=v;
   a.debt+=v.debt;a.used+=v.used;a.min=Math.min(a.min,v.used);a.max=Math.max(a.max,v.used);a.peak=Math.max(a.peak,v.peak);for(const c of CORE)a.counts[c]+=v.counts[c];}
  assert.equal(results.reference.debt,r.checkpoints.at(-1).coreDebt);trajectories.push({profile:r.profile,seed:r.seed,results});
 }
 assert.equal(totals.reference.debt,228622);
 return {schema:'M4P-B-CAPACITY-1',scope:'fixed native decks with virtual additional concept exposures; no donor, no answer, no actual replacement; optimistic capacity only',start:66,end:180,scenarios,totals,trajectories};
}
module.exports={simulate,report};
if(require.main===module){const dir=process.argv[2]||path.join(__dirname,'../audits/coherence-concrete-20261126/m4/parallel/b/native');const out=process.argv[3]||path.join(dir,'../arbitrage-capacite.json');const x=report(dir);fs.writeFileSync(out,JSON.stringify(x,null,2)+'\n');console.log(JSON.stringify(x.totals));}
