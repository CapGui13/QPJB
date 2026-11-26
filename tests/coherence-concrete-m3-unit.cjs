'use strict';
function run(M,meta,ex){
 const ok=(x,m)=>{if(!x)throw Error(m)};
 let n=0;const check=(x,m)=>{n++;ok(x,m)};
 const old=JSON.stringify(meta),data=JSON.stringify(ex),patches=M.patches(meta,ex);
 check(patches.length===14,'14 individual proposals');
 const by=new Map(ex.map(q=>[q.id,q]));
 for(const p of patches){check(!!by.get(p.id),'ID exists');check(JSON.stringify(meta[p.id])===JSON.stringify(p.old),'old metadata exact');check(p.new.minSession===p.old.minSession,'calendar unchanged');check(!!p.proof&&!!p.accord,'justification');}
 for(const group of ['texas','red','both','none']){
  const candidate=M.applyExperimental(meta,ex,group),expected=group==='both'?14:group==='texas'?6:group==='red'?8:0;
  check(Object.keys(meta).filter(id=>JSON.stringify(meta[id])!==JSON.stringify(candidate[id])).length===expected,'patch scope');
  check(M.reachability(candidate,ex).reachable===1915,'structural reachability');
 }
 const graph=M.graph(meta,ex);check(graph.rows.length===1915,'full ID registry');check(Object.keys(graph.concepts).length===99,'concept registry');
 for(const a of graph.arcs)for(const id of a.ids){check(graph.rows.some(r=>r.id===id&&r.concept===a.to&&r.requires.some(x=>x.concept===a.from&&x.minExposure===a.minExposure)),'arc evidence');}
 const q={id:'Q',caseFamily:'F',difficulty:2},t={id:'T',caseFamily:'G',difficulty:2},m={Q:{concept:'base',stage:0,minSession:0,requires:[]},T:{concept:'next',stage:1,minSession:0,requires:[{concept:'base',minExposure:1}]}};
 const ctx={session:2,history:{completed:1,journal:[],entries:{}},exercises:[q,t],metadataById:m,candidates:[t],selected:[]};
 function advisory(history){return M.rules({...ctx,history})[0];}
 check(advisory(ctx.history).status==='missing-exposure','no history');
 const event=(result,assisted=false,hadFreeError=false,mode='parcours',session=1)=>({mode,session,answers:[{id:'Q',result,assisted,hadFreeError}]});
 for(const ev of [event('wrong'),event('skipped'),event('correct',true),event('correct',false,true)]){
 const h={completed:1,journal:[ev],entries:{}},a=advisory(h);check(a.requirements[0].exposure===1,'exposure recorded');check(a.requirements[0].proofFamilies===0,'not autonomous');
 }
 let a=advisory({completed:1,journal:[event('correct'),event('correct')],entries:{}});check(a.requirements[0].proofFamilies===1&&a.requirements[0].proofSessions===1,'distinct proof');
 a=advisory({completed:1,journal:[event('correct',false,false,'consolidation'),event('correct',false,false,'parcours',2)],entries:{}});check(a.status==='missing-exposure','not future/consolidation');
 a=advisory({completed:1,journal:[],entries:{Q:{assessment:{lastSession:0,result:'correct'}}}});check(a.requirements[0].exposure===1&&a.requirements[0].proofFamilies===0,'legacy exposure not proof');
 check(JSON.stringify(meta)===old&&JSON.stringify(ex)===data,'pure');
 check(JSON.stringify(M.rules(ctx))===JSON.stringify(M.rules(ctx)),'deterministic');
 return {assertions:n};
}
module.exports={run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const ex=JSON.parse(get('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(run(require('../quizz-coherence-m3-prerequis.js'),m.exports.byId,ex));
}
