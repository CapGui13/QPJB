'use strict';
// Extra diagnostics for actual eligible due targets and save compatibility.
// Uses the same compiled engine and simulated answers as the main matrix.
const horizons=[20,65,153],weak=a=>a.result!=='correct'||a.assisted||a.hadFreeError;
function assert(ok,msg){if(!ok)throw Error(msg)}
function diagnose(source,meta,policy,bench,qs,mode,profile,seed,max=153){
  const stats={ids:{eligibleDue:0,served:0,onTime:0,late:0,lateSum:0,maxLate:0,weakDue:0,weakServed:0},concepts:{eligibleDue:0,served:0,onTime:0,late:0,lateSum:0,maxLate:0,weakDue:0,weakServed:0}};
  const snapshots=[],checks={eligibleDecks:0,activeRoundTrips:0,completedRoundTrips:0,legacyRoundTrips:0};
  let current=null;
  function observePool(state,pool){
    const s=state.completed,eligible=new Set(pool.map(q=>q.id)),ids=new Map(),concepts=new Map();
    for(const [id,r] of Object.entries(state.entries||{})){
      if(eligible.has(id)&&r.lastSession<s&&r.due<=s)ids.set(id,{due:r.due,weak:weak(r)});
    }
    const p=policy.prepare({state,metadata:meta.byId,exercises:qs,candidates:pool,mode:mode==='base'?'A':mode});
    const plans=new Map(p.schedule.map(r=>[r.concept,r]));
    for(const q of pool){
      const r=p.rank(q,{});if(r)concepts.set(r.concept,plans.get(r.concept));
    }
    current={s,eligible,ids,concepts};
  }
  const anchor="const quotas=profile==='weak'?";
  assert(source.split(anchor).length===2,'telemetry anchor');
  const instrumented=source.replace(anchor,"__policy.observePool(state,pool);\n    "+anchor);
  const api=bench.compile(instrumented,meta,{...policy,observePool},mode);
  const clone=v=>JSON.parse(JSON.stringify(v));
  function tally(name,due,served,s){
    const t=stats[name];
    for(const [key,p] of due){
      t.eligibleDue++;if(p.weak)t.weakDue++;
      if(!served.has(key))continue;
      t.served++;if(p.weak)t.weakServed++;
      const delay=s-p.due;
      if(delay===0)t.onTime++;else{t.late++;t.lateSum+=delay;t.maxLate=Math.max(t.maxLate,delay)}
    }
  }
  function roundTrip(state,active){
    const exportData=api.exportProgress(state,qs,{});
    const restored=api.importProgress(JSON.stringify(exportData));
    const direct=api.load(JSON.stringify(state));
    for(const key of ['completed','entries','skills','micros','axes','journal','active']){
      assert(JSON.stringify(restored[key])===JSON.stringify(direct[key]),'import/load '+key);
      if(key!=='active')assert(JSON.stringify(restored[key])===JSON.stringify(state[key]),'roundtrip '+key);
    }
    if(active){
      assert(JSON.stringify(restored.active)===JSON.stringify(state.active),'active state changed');
      assert(JSON.stringify(api.start(restored,qs).map(q=>q.id))===JSON.stringify(state.active.ids),'active deck reordered');
      checks.activeRoundTrips++;
    }else checks.completedRoundTrips++;
  }
  const wrapped={...api,
    start(state,exercises){
      current=null;const deck=api.start(state,exercises);
      assert(current&&current.s===state.completed,'pool observation');
      assert(deck.every(q=>current.eligible.has(q.id)),'ineligible selection');
      checks.eligibleDecks++;
      tally('ids',current.ids,new Set(deck.map(q=>q.id)),current.s);
      tally('concepts',current.concepts,new Set(deck.map(q=>meta.byId[q.id].concept)),current.s);
      return deck;
    },
    record(state,q,result,i,...rest){
      const ok=api.record(state,q,result,i,...rest);
      if(i===3&&[0,19,64,152].includes(state.completed))roundTrip(state,true);
      return ok;
    },
    finish(state,exercises){
      const ok=api.finish(state,exercises);
      if(state.completed===1){
        const legacy=clone(state);delete legacy.journal;
        const restored=api.load(legacy);
        assert(restored.journal.length===0&&JSON.stringify(restored.entries)===JSON.stringify(state.entries),'legacy save');
        checks.legacyRoundTrips++;
      }
      if(horizons.includes(state.completed)){
        roundTrip(state,false);
        snapshots.push({horizon:state.completed,stats:clone(stats),checks:clone(checks)});
      }
      return ok;
    }};
  const results=bench.simulate(wrapped,policy,meta,qs,profile,seed,max);
  return {mode,profile,seed,results,snapshots};
}
if(typeof require==='function'&&require.main===module){
  const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
  const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),meta=require('../quizz-prerequis.js'),policy=require('../quizz-revision-policy.js'),bench=require('./optimisation-revisions-bench.cjs');
  const data=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  const [profile='modere',seed='11',mode='base',max='153']=process.argv.slice(2);
  console.log(JSON.stringify(diagnose(source,meta,policy,bench,data.exercises,mode,profile,Number(seed),Number(max)),null,2));
}
module.exports={diagnose};
