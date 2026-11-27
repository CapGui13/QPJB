'use strict';
// A single exhaustive index of decisions, not a claim of individual SEF visa.
function build({registry,arcReports,redContext,stayman}){
 const graph=registry.graph,review=arcReports.flatMap(x=>x.review),key=a=>JSON.stringify([a.from,a.to,a.minExposure]),index=new Map(review.map(x=>[key(x),x]));
 const ok=(v,m)=>{if(!v)throw Error(m)};
 ok(graph.rows.length===1915,'1915 IDs');ok(Object.keys(graph.concepts).length===99,'99 concepts');
 ok(review.length===317&&index.size===317&&graph.arcs.length===317,'317 unique arcs');
 const byId=new Map(graph.rows.map(q=>[q.id,q]));ok(byId.size===1915,'unique IDs');
 const arcLinks=new Map(),examples=new Set(),arcs=[];
 for(const a of graph.arcs){
  const k=key(a),v=index.get(k);ok(v&&v.reason&&v.reason.length>20,'Missing reason '+k);
  ok(JSON.stringify(a.ids)===JSON.stringify(v.ids),'Membership drift '+k);
  const exampleIds=v.exampleIds||[v.exampleId];ok(exampleIds.length&&exampleIds.every(id=>a.ids.includes(id)),'Example missing '+k);
  for(const id of exampleIds)examples.add(id);
  for(const id of a.ids){const q=byId.get(id);ok(q&&q.concept===a.to&&q.requires.some(x=>x.concept===a.from&&x.minExposure===a.minExposure),'Invalid arc reference '+id);if(!arcLinks.has(id))arcLinks.set(id,[]);arcLinks.get(id).push(k);}
  arcs.push({...v,exampleIds,key:k,decision:'KEEP_HISTORICAL_NO_NEW_GATE'});
 }
 const targeted=new Map();
 function add(id,decision,source){ok(byId.has(id),'Unknown decision ID '+id);if(!targeted.has(id))targeted.set(id,[]);targeted.get(id).push({decision,source});}
 for(const p of registry.patches)add(p.id,'HOLD', 'registry.json / original metadata candidate');
 for(const p of redContext.registry)add(p.id,p.remove?'HOLD':'KEEP_ADVANCED','red-context-s10.json');
 for(const p of stayman.patches)add(p.id,'HOLD','stayman-fourth-s20.json / prefer ordering review');
 for(const id of ['SEF-037-1','SEF-038-1','SEF-N082-2','SEF-N085-1','SEF-V44-015','SEF-V44-016','SEF-V49-017','SEF-C-003','V2-M2-030'])add(id,'KEEP_ELEMENTARY','transition advice / frozen catalogue');
 for(const id of ['SEF-V3-011-1','SEF-V3-011-3','SEF-V3-012-1','SEF-V3-013-4','SEF-V3-014-2','SEF-V3-014-1','SEF-V3-015-1','SEF-V3-016-1','SEF-V3-016-2'])add(id,'KEEP_SIMPLE_RESPONSE','transition advice / frozen catalogue');
 for(const id of ['SEF-C-005','V2-M2-003'])add(id,'KEEP_TEXAS_CONTRAST','README / 2SA weak hand');
 for(const id of ['SEF-L41-004','SEF-Q26-M2-012','SEF-Q26-M2-013','V2-M2-015','V2-M2-016','SEF-PN26-M1-029'])add(id,'KEEP_ADVANCED_PROOF','README / 2SA minor Texas');
 const counts={},rows=graph.rows.map(q=>{
  const links=arcLinks.get(q.id)||[];
  ok(links.length===q.requires.length,'Missing arc for '+q.id);
  const decisions=targeted.get(q.id)||[];
  const reviewLevel=decisions.length?'targeted-id':q.disposition==='visa-historique-preserve'?'historical-visa-preserved':examples.has(q.id)?'arc-example':'structural-only';
  counts[reviewLevel]=(counts[reviewLevel]||0)+1;
  return {id:q.id,concept:q.concept,stage:q.stage,minSession:q.minSession,arcs:links,reviewLevel,decisions,activation:'UNCHANGED'};
 });
 ok(Object.values(counts).reduce((a,b)=>a+b,0)===1915,'coverage totals');
 return {base:registry.base,counts,arcCount:arcs.length,conceptCount:Object.keys(graph.concepts).length,arcs,rows,decision:'No experimental metadata activated; transition advice only. Historical visas preserved. Structural-only IDs explicitly not individually reviewed.',limitations:'An arc reason is not a full semantic review of every linked question. Tests and synthetic trajectories are not evidence of human learning.'};
}
module.exports={build};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),dir=path.join(__dirname,'..','audits/coherence-concrete-20261126/m3'),read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
 const actual=build({registry:read('registry.json'),arcReports:['early-arc-review.json','mid-arc-review.json','late-arc-review.json'].map(read),redContext:read('red-context-s10.json'),stayman:read('stayman-fourth-s20.json')});
 const saved=read('decision-register.json');if(JSON.stringify(actual)!==JSON.stringify(saved))throw Error('Decision register drift');
 console.log(JSON.stringify({arcs:actual.arcCount,concepts:actual.conceptCount,counts:actual.counts}));
}
