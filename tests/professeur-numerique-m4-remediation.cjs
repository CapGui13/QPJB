'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const meta=require('../quizz-prerequis.js'),api=require('../quizz-remediation.js');
const fixtures=require('../audits/professeur-numerique-20261126/m4/fixtures.json');
const cases=fixtures.map(({id,choice,diagnostic})=>({exercise:data.exercises.find(q=>q.id===id),choice,diagnostic}));
function verify(api,data,meta,cases){
  const assert=(cond,msg)=>{if(!cond)throw Error(msg);};
  const eq=(x,y,msg)=>assert(JSON.stringify(x)===JSON.stringify(y),msg);
  const deepFreeze=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.freeze(x);for(const v of Object.values(x))deepFreeze(v);}return x;};
  const cat=['force','distribution','fit','priorite','niveau','forcing','convention','competition','contexte','autre','inconnu'];
  const input=(exercise,choice,diagnostic=null,extra={})=>({exercise,choice,diagnostic,assisted:false,hadFreeError:false,...extra});
  const diag=category=>({status:'hypothesis',category,confidence:'high',reason:'fixture',evidence:[]});
  const result={total:data.exercises.length,themes:new Set(data.exercises.map(q=>q.theme)).size,concepts:new Set(Object.values(meta.byId).map(m=>m.concept)).size,wrongOptions:0,correctUnchanged:0,unknownFallback:0,targeted:0,feedback:0,checkNext:0,byTheme:{},byConcept:{},categories:{},maxExtraWords:0,fixtures:cases.length,fixtureThemes:new Set(cases.map(c=>c.exercise.theme)).size,corrected:0,assisted:0};
  assert(api.schema==='QPJB_REMEDIATION_V1','schema');
  const start=Date.now();
  for(const q of data.exercises){
    deepFreeze(q);
    const c=api.explain(input(q,q.answer));
    eq(c,{canonical:q.explain,feedback:null,reminder:null,checkNext:null,kind:'correct'},q.id+' autonomous');
    result.correctUnchanged++;
    const help=api.explain(input(q,q.answer,null,{assisted:true})),corrected=api.explain(input(q,q.answer,null,{assisted:true,hadFreeError:true}));
    assert(help.kind==='assisted'&&help.checkNext&&!help.feedback&&help.canonical===q.explain,'help');
    assert(corrected.kind==='corrected'&&corrected.checkNext&&!corrected.feedback&&corrected.canonical===q.explain,'corrected');
    result.assisted++;result.corrected++;
    for(const choice of q.choices.filter(x=>x!==q.answer)){
      result.wrongOptions++;
      const unknown=api.explain(input(q,choice,{status:'unknown',category:'inconnu',confidence:'low'}));
      eq(unknown,{canonical:q.explain,feedback:null,reminder:null,checkNext:null,kind:'wrong-unknown'},q.id+' fallback');
      result.unknownFallback++;
      let matches=0;
      for(const category of cat){
        const d=deepFreeze(diag(category)),a=deepFreeze(input(q,choice,d)),before=JSON.stringify(a),r=api.explain(a);
        assert(r.canonical===q.explain&&JSON.stringify(a)===before,'canonical/purity');
        if(r.kind==='targeted'){
          matches++;result.targeted++;result.feedback+=Number(!!r.feedback);result.checkNext+=Number(!!r.checkNext);
          result.byTheme[q.theme]=(result.byTheme[q.theme]||0)+1;
          const concept=meta.byId[q.id].concept;
          result.byConcept[concept]=(result.byConcept[concept]||0)+1;
          result.categories[category]=(result.categories[category]||0)+1;
          assert(r.checkNext&&!r.reminder,'targeted');
          const extra=[r.feedback,r.checkNext].filter(Boolean).join(' ').split(/\s+/).length;
          result.maxExtraWords=Math.max(result.maxExtraWords,extra);
          assert(extra<=45,'concise '+q.id+' '+choice+' '+extra);
          if(q.explain.includes(choice))assert(!r.feedback,'avoid duplicate option');
        }else assert(!r.feedback&&!r.reminder&&!r.checkNext,'no speculative addition');
      }
      assert(matches<=1,'one approved category per option');
    }
  }
  for(const f of cases){const q=f.exercise, a=input(q,f.choice,f.diagnostic);
    const r=api.explain(deepFreeze(a));assert(r.kind==='targeted',q.id+' fixture');
    const old={completed:9,entries:{[q.id]:{result:'wrong',seen:5}}};
    eq(api.explain({...a,history:old}),r,'old export');
    const missing=api.explain({...a,diagnostic:null});assert(missing.kind==='wrong-unknown'&&!missing.feedback&&!missing.checkNext,'missing');
    eq(api.explain({...a,diagnostic:{...f.diagnostic,confidence:'low'}}),missing,'low');
    const e={mode:'parcours',session:4,answers:[{id:q.id,result:'wrong',choice:f.choice,assisted:false,hadFreeError:false}]};
    const state=deepFreeze({completed:5,active:{ids:[q.id]},journal:[e]});
    const repeated=api.explain({...a,history:state});assert(repeated.reminder&&repeated.checkNext===r.checkNext,'observed repetition');
    const exported={format:'QPJB_PROGRESS_EXPORT_1',summary:{completedSessions:5},currentSession:{ids:[q.id]},sessions:[e]};
    eq(api.explain({...a,history:exported}),repeated,'export');
    for(const h of [{...state,completed:20},{...state,active:null},{...state,journal:[{...e,session:6}]},{...state,journal:[{...e,answers:[{...e.answers[0],result:'correct'}]}]},{...state,journal:[{...e,mode:'consolidation'}]}])eq(api.explain({...a,history:h}),r,'ignore unsupported history');
    for(const choice of ['xyz','1P',null,'7SA']){const z=api.explain({...a,choice});assert(z.canonical===q.explain&&!z.feedback&&!z.checkNext,'invalid/unknown free');}
    const unverified=api.explain({exercise:q,choice:q.answer});assert(unverified.kind==='correct-unverified'&&!unverified.checkNext,'old flags');
    const altered={...q,explain:q.explain+' [changed]'};
    assert(api.explain({...a,exercise:altered}).canonical===altered.explain,'exact canonical even after editorial changes');
  }
  result.elapsedMs=Date.now()-start;
  assert(result.total===1879&&result.themes===22&&result.concepts===99,'frozen catalogue');
  assert(result.fixtureThemes===22,'all themes');
  assert(result.targeted>=cases.length&&result.unknownFallback===result.wrongOptions,'coverage');
  const q=cases[0].exercise,a=input(q,cases[0].choice,cases[0].diagnostic);
  const t=Date.now();for(let i=0;i<20000;i++)api.explain(a);
  result.fastPath20000Ms=Date.now()-t;assert(result.fastPath20000Ms<5000,'latency budget');
  return result;
}
const result=verify(api,data,meta,cases);
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(root,'quizz-remediation.js'),'utf8'),sandbox);
if(sandbox.QPJBRemediation.schema!==api.schema)throw Error('browser UMD');
for(const c of cases){if(JSON.stringify(sandbox.QPJBRemediation.explain(c))!==JSON.stringify(api.explain(c)))throw Error('browser/Node mismatch');}
console.log(JSON.stringify(result,null,2));
