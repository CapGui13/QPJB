'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {build,step}=require('./coherence-progression-m3-bench.cjs');
function verify(b){
  const a=b.base.empty(),checkpoints=[1,20,21,65];
  const result={boundaries:[],timings:[],activeResume:false};
  for(let s=1;s<=153;s++){
    if(checkpoints.includes(s)){
      const before=JSON.stringify(a);
      assert.deepEqual(b.base.select(b.exercises,a),b.candidate.select(b.exercises,a),'M3 inactive S'+s);
      assert.equal(JSON.stringify(a),before,'selection pure');
      result.boundaries.push(s);
    }
    if(s===66||s===153){
      // Same saved state and same pool for the timing comparison.
      const timings={session:s,base:[],candidate:[]};
      for(let j=0;j<5;j++)for(const [k,engine] of j%2?[['candidate',b.candidate],['base',b.base]]:[['base',b.base],['candidate',b.candidate]]){
        const t=Date.now();engine.select(b.exercises,a);timings[k].push(Date.now()-t);
      }
      result.timings.push(timings);
      if(s===66){
        const restored=JSON.parse(JSON.stringify(a));
        const deck=b.candidate.start(restored,b.exercises);
        assert.equal(deck.length,10);
        assert(b.candidate.record(restored,deck[0],'correct',0,deck[0].answer,false,false));
        const oldIds=restored.active.ids.slice(),oldAnswers=JSON.stringify(restored.active.answers),oldSelection=JSON.stringify(restored.active.selection);
        const reloaded=b.candidate.load(JSON.parse(JSON.stringify(restored)));
        const resumed=b.candidate.start(reloaded,b.exercises);
        assert.deepEqual(resumed.map(x=>x.id),oldIds);
        assert.equal(JSON.stringify(reloaded.active.answers),oldAnswers);
        assert.equal(JSON.stringify(reloaded.active.selection),oldSelection);
        result.activeResume=true;
      }
    }
    step(b.base,a,b.exercises,b.meta,'intermediaire',47);
  }
  assert.deepEqual(result.boundaries,checkpoints);assert(result.activeResume);
  return result;
}
module.exports={verify};
if(require.main===module){
  const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
  const b=build({engine:read('quizz-parcours.js'),metadata:read('quizz-prerequis.js'),
    plan:read('quizz-session-plan.js'),html:read('quizz.html'),policy:read('quizz-pedagogie-avancee.js')});
  console.log(JSON.stringify(verify(b),null,2));
}
