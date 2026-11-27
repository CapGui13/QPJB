'use strict';
// Verify native archived pairs without rerunning the selector. No production writes.
// node tests/coherence-concrete-m2-state-audit.cjs <extracted artifact directory> [summary.json]
const fs=require('node:fs'),path=require('node:path');
const BASE='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
const KEYS=['exact','triples','mirrors','nearMirrors','answerABAB','themeABAB','familyAdjacent','prereqOrderInversions','stageInversions','difficultyInversions','roleInversions','largeJumps','sameShape','sameForce','missedContrasts'];
const PROFILES=['autonome','modere','faible','cible','aide','passe'],SEEDS=[11,47,103],H=[5,20,65,153,180];
let assertions=0;const ck=(x,m)=>{assertions++;if(!x)throw Error(m)};
function canon(x){return Array.isArray(x)?x.map(canon):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canon(x[k])])):x}
const same=(a,b)=>JSON.stringify(canon(a))===JSON.stringify(canon(b));
const sorted=a=>a.slice().sort().join('|');
function* walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())yield*walk(p);else if(/-S180\.json$/.test(e.name))yield p;}}
function audit(dir){
 const files=[...walk(dir)],runs=[],seen=new Set(),aggregate=H.map(session=>({session,pairs:0,changedOrders:0,localGains:0,changedSets:0,before:{},after:{},localRegressions:{}}));
 const inc=(o,k,n=1)=>o[k]=(o[k]||0)+n;
 for(const file of files){
  const r=JSON.parse(fs.readFileSync(file,'utf8')),key=r.profile+'/'+r.seed;
  ck(r.base===BASE&&r.horizon===180,'base/horizon '+key);ck(PROFILES.includes(r.profile)&&SEEDS.includes(r.seed)&&!seen.has(key),'profile/seed '+key);seen.add(key);
  ck(r.before.rows.length===180&&r.after.rows.length===180&&r.comparison.length===180,'complete rows '+key);
  const row={profile:r.profile,seed:r.seed,changedOrders:0,changedSets:0,localGains:0,localRegressions:[],sessions:[],stateDifferences:{},levelDeltas:[],checkpoints:[]};
  for(let i=0;i<180;i++){
   const b=r.before.rows[i],a=r.after.rows[i],n=i+1,c=r.comparison[i],label=key+' S'+n;
   ck(b.session===n&&a.session===n&&c.session===n,'session '+label);
   for(const [arm,isCandidate] of [[b,false],[a,true]]){
    ck(arm.ids.length===10&&new Set(arm.ids).size===10,'ten unique IDs '+label);
    ck(arm.historical.length===10&&arm.proposed.length===10&&sorted(arm.historical)===sorted(arm.proposed)&&sorted(arm.ids)===sorted(arm.historical),'permutation '+label);
    ck(same(arm.ids,isCandidate?arm.proposed:arm.historical),'effective order '+label);
    ck(same(arm.selection.map(x=>x.id),arm.ids),'selection order '+label);
    for(const [detail,ids] of [[arm.before,arm.historical],[arm.after,arm.proposed]]){
     ck(same(detail.map(x=>x.id),ids),'detail order '+label);
     ck(new Set(detail.map(x=>x.family)).size===10,'family uniqueness '+label);
     ck(detail.every((x,j)=>x.position===j+1&&x.role&&x.reason&&x.concept&&x.hand&&x.answer),'detail reason '+label);
    }
    for(const k of KEYS)ck(Number.isInteger(arm.metricsBefore[k])&&Number.isInteger(arm.metricsAfter[k])&&arm.metricsAfter[k]<=arm.metricsBefore[k],'local guard '+label+' '+k);
   }
   const equalSet=sorted(b.ids)===sorted(a.ids),equalOrder=same(b.ids,a.ids),gain=!same(a.historical,a.proposed);
   ck(c.sameSet===equalSet&&c.sameOrder===equalOrder,'pair flag '+label);
   ck(same(c.historicalIds,b.ids)&&same(c.candidateIds,a.ids),'pair IDs '+label);
   if(equalSet)ck(same(b.selection.slice().sort((x,y)=>x.id.localeCompare(y.id)),a.selection.slice().sort((x,y)=>x.id.localeCompare(y.id))),'selection metadata same '+label);
   row.changedOrders+=+!equalOrder;row.changedSets+=+!equalSet;row.localGains+=+gain;
   const event=[];
   for(const k of KEYS)if(a.metricsAfter[k]>b.metricsBefore[k]){const e={session:n,key:k,before:b.metricsBefore[k],after:a.metricsAfter[k],historicalCandidate:a.metricsBefore[k]};row.localRegressions.push(e);event.push(k);}
   row.sessions.push({session:n,changedOrder:!equalOrder,changedSet:!equalSet,localGain:gain,regressionKeys:event});
   for(const t of aggregate)if(n<=t.session){t.pairs++;t.changedOrders+=+!equalOrder;t.changedSets+=+!equalSet;t.localGains+=+gain;for(const k of KEYS){inc(t.before,k,b.metricsBefore[k]);inc(t.after,k,a.metricsAfter[k]);if(event.includes(k))inc(t.localRegressions,k);}}
  }
  ck(row.changedOrders===r.changedOrders&&row.changedSets===r.changedSets.length,'paired counts '+key);
  if(Array.isArray(r.localRegressions))ck(same(r.localRegressions.map(({session,key,before,after,historicalCandidate})=>({session,key,before,after,historicalCandidate})),row.localRegressions),'per-session regressions reported '+key);
  for(const [i,n] of H.entries()){
   const b=r.before.checkpoints[i],a=r.after.checkpoints[i];ck(b.session===n&&a.session===n,'checkpoint '+key);
   const sameComposition={};for(const k of ['families','first','maxGaps','difficulty','firstTheme','themeGaps','fundamentalDebt'])sameComposition[k]=same(b[k],a[k]);
   const delta=Object.fromEntries(KEYS.map(k=>[k,a.after[k]-b.before[k]]));
   row.checkpoints.push({session:n,delta,sameComposition,selectionP95:[b.selectionP95,a.selectionP95]});
  }
  const b=r.before.finalState,a=r.after.finalState;
  for(const field of ['entries','micros','axes','skills']){
   const differences=[...new Set([...Object.keys(b[field]),...Object.keys(a[field])])].filter(k=>!same(b[field][k],a[field][k]));row.stateDifferences[field]=differences;
  }
  for(const k of row.stateDifferences.skills){const before=b.skills[k]?.level??null,after=a.skills[k]?.level??null;if(before!==after)row.levelDeltas.push({theme:k,before,after});}
  runs.push(row);
 }
 ck(seen.size===18,'18 pairs');
 return {base:BASE,assertions,trajectories:runs.length,aggregate,runs};
}
module.exports={audit};
if(require.main===module){const [dir,out]=process.argv.slice(2);if(!dir)throw Error('artifact directory required');const r=audit(dir);if(out)fs.writeFileSync(out,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({assertions:r.assertions,trajectories:r.trajectories,aggregate:r.aggregate,states:r.runs.map(x=>({profile:x.profile,seed:x.seed,counts:Object.fromEntries(Object.entries(x.stateDifferences).map(([k,v])=>[k,v.length])),levelDeltas:x.levelDeltas}))},null,2));}
