'use strict';
function check(ok,msg){if(!ok)throw Error(msg)}
function equal(a,b,msg){check(JSON.stringify(a)===JSON.stringify(b),msg)}
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x)}return x}
function unit(policy){
  check(policy.schema==='QPJB_PEDAGOGIE_V1'&&policy.phase==='intermediaire','schema/phase');
  const q={id:'a',difficulty:1},b={id:'b',difficulty:2},c={id:'c',difficulty:2};
  const metadataById={a:{concept:'red.base',stage:0,requires:[]},b:{concept:'roudi.suite',stage:3,requires:[{concept:'red.base',minExposure:1}]},c:{concept:'roudi.init',stage:0,requires:[]}};
  const history={journal:[{mode:'parcours',session:12,answers:[{id:'a',result:'correct',assisted:true,difficulty:1,family:'A'}]}],entries:{}};
  const ctx=freeze({session:21,candidates:[q,b,c],metadataById,history,selected:[],category:'discovery'});
  const rank=policy.rank(ctx),map=new Map(rank.map(x=>[x.id,x]));
  check(map.get('a').delta>0,'old natural concept gets reminder bonus');
  check(map.get('b').delta<0,'assisted is not independent proof');
  check(rank.every(x=>ctx.candidates.some(q=>q.id===x.id)&&Number.isFinite(x.delta)&&Math.abs(x.delta)<=100&&x.reason),'bounded eligible ranks');
  equal(policy.rank({...ctx,session:20}),[],'S20 neutral');
  equal(policy.rank({...ctx,session:66}),[],'S66 neutral');
  check(policy.rank({...ctx,session:65}).length>0,'S65 active');
  equal(policy.rank({...ctx,candidates:[]}),[],'empty pool');
  check(policy.rank({...ctx,candidates:[q]}).length===1,'small pool');
  const consolidation={...history,journal:[...history.journal,{mode:'consolidation',session:20,answers:[{id:'a',result:'correct',difficulty:1,family:'B'}]}]};
  equal(policy.rank({...ctx,history:consolidation}),rank,'consolidation is not assessment');
  const clean={...history,journal:[...history.journal,{mode:'parcours',session:19,answers:[{id:'a',result:'correct',difficulty:1,family:'B'}]}]};
  check(!policy.rank({...ctx,history:clean}).some(x=>x.id==='b'&&x.delta<0),'clean independent proof relieves penalty');
  const error={...history,entries:{a:{due:20,result:'wrong',assessment:{lastSession:11}}}};
  check(!policy.rank({...ctx,history:error,category:'weakness'}).some(x=>x.id==='a'),'due error untouched');
  const old={journal:[],entries:{a:{assessment:{lastSession:11}}}};
  check(policy.rank({...ctx,history:old}).some(x=>x.id==='b'&&x.delta<0),'legacy exposure not proof');
  return 12;
}
function acceptance(rows){
  check(rows.length===15,'15 paired trajectories');
  let gapBefore=0,gapAfter=0;
  for(const {before,after} of rows){
    equal(before.snapshots[20],after.snapshots[20],'S20 unchanged');
    equal(before.boundary[20],after.boundary[20],'S20 deck unchanged');
    for(const h of [20,65,153]){
      const a=before.snapshots[h],b=after.snapshots[h];
      check(b.families>=.95*a.families,'family retention '+h);
      check(!a.violations&&!b.violations&&!a.short&&!b.short&&!a.duplicate&&!b.duplicate,'engine invariants '+h);
      check(b.concepts>=a.concepts-1,'concept coverage '+h);
    }
    check(after.snapshots[65].themes===22,'22 themes at S65');
    check(before.phase.gapDays>=after.phase.gapDays,'no reminder gap regression');
    check(after.boundary[21].length===10&&after.boundary[65].length===10&&after.boundary[66].length===10,'boundaries');
    gapBefore+=before.phase.gapDays;gapAfter+=after.phase.gapDays;
  }
  check(gapAfter<=.75*gapBefore,'25% aggregate reduction in eligible reminder gaps');
  return {pairs:rows.length,gapBefore,gapAfter};
}
function active(bench,blobs,cat,policy){
  const {api}=bench.engineFrom(blobs,policy,()=>{});
  const state=api.empty();
  for(let s=1;s<=20;s++){const deck=api.start(state,cat);deck.forEach((q,i)=>api.record(state,q,'correct',i,q.answer,false,false));check(api.finish(state,cat),'finish');}
  const deck=api.start(state,cat);
  check(api.record(state,deck[0],'correct',0,deck[0].answer,false,false),'record');
  api.move(state,1);
  const saved=JSON.parse(JSON.stringify(state)),restored=api.load(JSON.stringify(saved));
  equal(api.start(restored,cat).map(q=>q.id),deck.map(q=>q.id),'active S21 exact IDs');
  equal(restored.active.answers,saved.active.answers,'active answers unchanged');
  equal(restored.active.index,saved.active.index,'active position unchanged');
  const {api:base}=bench.engineFrom(blobs,null,()=>{});
  equal(base.start(base.load(JSON.stringify(saved)),cat).map(q=>q.id),deck.map(q=>q.id),'old engine resumes active candidate session');
  return 4;
}
module.exports={unit,acceptance,active};
if(require.main===module){
  const path=require('node:path'),fs=require('node:fs');
  const audit=path.resolve(__dirname,'../audits/coherence-progression-20261126/m2');
  const bench=require(path.join(audit,'bench.cjs'));
  const {blobs,cat,policy}=bench.checkout();
  const rows=bench.profiles.flatMap(p=>JSON.parse(fs.readFileSync(path.join(audit,p+'.json'),'utf8')));
  console.log({unit:unit(policy),acceptance:acceptance(rows),active:active(bench,blobs,cat,policy)});
}
