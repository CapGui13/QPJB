'use strict';
// #419 coordinator: exact native-engine pairing, not an activation.
const assert=require('node:assert/strict'),cp=require('node:child_process'),fs=require('node:fs');
const replay=require('./coherence-concrete-m2-replay.cjs'),m2=require('../quizz-coherence-m2-ordre.js');
const [profile='autonome',rawSeed='11',rawHorizon='180',dest='coordination-m2.json']=process.argv.slice(2);
const seed=Number(rawSeed),horizon=Number(rawHorizon);
assert(replay.PROFILES.includes(profile)&&replay.SEEDS.includes(seed)&&Number.isInteger(horizon)&&horizon>=1&&horizon<=180);
const read=p=>cp.execFileSync('git',['show',replay.BASE+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024});
const sources={'quizz.html':read('quizz.html')};
function visit(p){if(Object.hasOwn(sources,p))return;sources[p]=read(p);for(const m of sources[p].matchAll(/require\(['"]\.\/([-\w]+\.js)['"]\)/g))visit(m[1]);}
visit('quizz-parcours.js');
const constrained={...m2,order:ctx=>m2.order({...ctx,preserveThemeOrder:true})};
const shadow=process.env.QPJB_M2_REFERENCE_JOURNAL==='1';
const referenceOrders=new Map();
function referenceJournal(journal){
 return journal.map(event=>{
  const order=referenceOrders.get(event.session);
  if(event.mode!=='parcours'||!order)return event;
  const byId=new Map(event.answers.map(a=>[a.id,a]));
  assert(order.length===byId.size&&order.every(id=>byId.has(id)),'invalid historical reference');
  return {...event,answers:order.map(id=>byId.get(id))};
 });
}
const a=replay.prepare(sources,m2,false),b=replay.prepare(sources,constrained,true,shadow?referenceJournal:null),sa=a.api.empty(),sb=b.api.empty();
const ids=d=>d.map(q=>q.id),sorted=d=>ids(d).sort(),byTheme=d=>Object.fromEntries([...new Set(d.map(q=>q.theme))].sort().map(t=>[t,ids(d.filter(q=>q.theme===t))]));
const normalize=x=>Array.isArray(x)?x.map(normalize):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,normalize(x[k])])):x;
const rows=[],sumBefore={},sumAfter={};let changed=0,assertions=0;
const eq=(x,y,label)=>{assertions++;assert.deepEqual(normalize(x),normalize(y),profile+'/'+seed+' '+label)};
const ok=(x,label)=>{assertions++;assert(x,profile+'/'+seed+' '+label)};
for(let s=1;s<=horizon;s++){
 a.clock(s);b.clock(s);
 const da=a.api.start(sa,a.qs),db=b.api.start(sb,b.qs),plan=b.calls.at(-1)?.plan;
 eq(sorted(da),sorted(db),'same composition S'+s);eq(byTheme(da),byTheme(db),'theme order S'+s);
 eq(ids(db),plan?.ids,'candidate effective order S'+s);
 if(shadow)eq(ids(da),b.calls.at(-1).historical,'historical salt parity S'+s);
 ok(da.length===10&&new Set(da.map(q=>q.caseFamily||q.id)).size===10,'ten families S'+s);
 ok(b.api.eligibilityBatch(db,sb,b.qs).every(v=>v.eligible),'eligibility S'+s);
 const setSelection=d=>Object.fromEntries(d.map(x=>[x.id,x]));
 eq(setSelection(sa.active.selection),setSelection(sb.active.selection),'selection reasons S'+s);
 const diff=ids(da).join()!==ids(db).join();changed+=+diff;
 if(plan?.before&&plan?.after)for(const k of [...m2.HARD,...m2.SOFT]){
  ok(plan.after[k]<=plan.before[k],'metric '+k+' S'+s);
  sumBefore[k]=(sumBefore[k]||0)+plan.before[k];sumAfter[k]=(sumAfter[k]||0)+plan.after[k];
 }
 for(const [e,state,deck] of [[a,sa,da],[b,sb,db]]){
  for(let i=0;i<deck.length;i++){
   const q=deck[i],o=replay.outcome(q,s-1,seed,profile);
   ok(e.api.record(state,q,o.result,i,null,o.help,false),'record S'+s);
   if(i===0&&[1,2,5,20,65,153,180].includes(s)){
    e.api.move(state,1);
    const saved=JSON.parse(JSON.stringify(state)),copy=e.api.load(saved);
    eq(ids(e.api.start(copy,e.qs)),ids(deck),'resume order S'+s);
    eq(copy.active,state.active,'resume exact S'+s);
   }
  }
  ok(e.api.finish(state,e.qs),'finish S'+s);
 }
 for(const k of ['skills','entries','micros','axes','completed'])eq(sa[k],sb[k],k+' S'+s);
 const canonicalEvent=state=>{const e=state.journal.at(-1);return {...e,answers:e.answers.slice().sort((x,y)=>x.id.localeCompare(y.id))}};
 eq(canonicalEvent(sa),canonicalEvent(sb),'same journal evidence S'+s);
 if(shadow)referenceOrders.set(s,b.calls.at(-1).historical.slice());
 rows.push({s,changed:diff,before:ids(da),after:ids(db),metricsBefore:plan?.before,metricsAfter:plan?.after,themeOrderPreserved:true,stateEqual:true});
}
const result={profile,seed,horizon,shadow,assertions,changed,changedEarly:rows.filter(r=>r.s<=20&&r.changed).length,sumBefore,sumAfter,rows};
fs.writeFileSync(dest,JSON.stringify(result));console.log(JSON.stringify({...result,rows:undefined}));
