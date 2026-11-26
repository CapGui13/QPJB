"use strict";
function run({q,cart,review,data,patches,hold,base,extend,signature,key}){
 let checks=0;const ok=(v,s)=>{checks++;if(!v)throw Error(s)};
 const eq=(a,b,s)=>ok(JSON.stringify(a)===JSON.stringify(b),s);
 const scope=cart.filter(x=>/^(ouv|sa|sa1|sa2|barrage|fortes)(\.|$)/.test(x.concept));
 const by=new Map(q.map(e=>[e.id,e])), rm=new Map(review.rows.map(x=>[key(x.id,x.choice),x])), dm=new Map(data.records.map(x=>[key(x.id,x.choice),x]));
 const engine=extend(base,data), dispositions={}, concepts={}, categories={}, confidence={};
 eq([q.length,scope.length,review.rows.length,rm.size],[1879,442,548,548],"Couverture");
 eq(dm.size,data.records.length,"Diagnostics uniques");
 let oldHyp=0,newHyp=0,total=0;
 for(const x of cart){const e=by.get(x.id);ok(e,"ID absent "+x.id);const before=JSON.stringify(e);
 const inScope=scope.includes(x);let c=inScope?(concepts[x.concept]??={qcm:0,reviewed:0,hypothesis:0,unknown:0,"hold-existing":0,"hold-proposed":0}):null;if(c)c.qcm++;
 for(const [choice,status,category,conf,rule] of x.options){
  total++;const input={exercise:e,choice};const d=base.diagnose(input), n=engine.diagnose(input), k=key(x.id,choice), v=rm.get(k);
  eq([d.status,d.category,d.confidence,d.evidence.rule],[status,category,conf,rule],"Cartographie base "+k);
  if(inScope&&status==="unknown"){ok(v,"Option non revue "+k);c.reviewed++;c[v.disposition]++;dispositions[v.disposition]=(dispositions[v.disposition]||0)+1;eq(v.signature,signature(e),"Signature "+k);eq(v.previousRule,rule,"Règle précédente "+k);ok(v.reason.length>20,"Justification "+k);
  if(v.disposition==="hypothesis"){ok(dm.has(k),"Diagnostic absent "+k);eq([n.status,n.category,n.confidence,n.reason],["hypothesis",v.category,v.confidence,v.reason],"Intégration "+k);categories[n.category]=(categories[n.category]||0)+1;confidence[n.confidence]=(confidence[n.confidence]||0)+1;newHyp++;
  eq(engine.diagnose({...input,exercise:{...e,explain:e.explain+" modifié"}}),base.diagnose({...input,exercise:{...e,explain:e.explain+" modifié"}}),"Contenu modifié "+k);
  }else{ok(!dm.has(k),"Diagnostic interdit "+k);eq(n,d,"Unknown/HOLD conservé "+k)}
  }else{ok(!v&&!dm.has(k),"Hors périmètre "+k);eq(n,d,"Diagnostic antérieur "+k);if(inScope&&status==="hypothesis")oldHyp++}
 }
 eq(engine.diagnose({exercise:e,choice:e.answer,assisted:true}),base.diagnose({exercise:e,choice:e.answer,assisted:true}),"Réponse correcte "+x.id);eq(JSON.stringify(e),before,"Mutation "+x.id);
 }
 for(const p of patches){const e=by.get(p.id);eq(p.oldChoices,e.choices,"Anciennes options "+p.id);ok(p.newChoices.length===4&&new Set(p.newChoices).size===4&&p.newChoices.includes(e.answer),"Options nouvelles "+p.id);ok(p.oldChoices.filter(x=>!p.newChoices.includes(x)).length===1,"Un seul remplacement "+p.id);for(const d of p.diagnostics)ok(p.newChoices.includes(d.choice)&&d.choice!==e.answer&&d.reason,"Diagnostic patch "+p.id)}
 for(const h of hold.filter(x=>x.status!=="resolved-no-patch"))ok(!dm.has(key(h.id,h.choice)),"HOLD exclu "+h.id);
 eq([total,oldHyp,newHyp],[5637,778,data.records.length],"Totaux");
 return {checks,total,oldHyp,newHyp,dispositions,concepts,categories,confidence,patches:patches.length,hold:hold.length};
}
module.exports={run};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path"),root=path.resolve(__dirname,"../../../../.."),read=f=>JSON.parse(fs.readFileSync(f,"utf8"));
 const html=fs.readFileSync(path.join(root,"quizz.html"),"utf8"),q=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const p=path.resolve(__dirname,"../..");
 console.log(JSON.stringify(run({q,cart:read(path.join(p,"cartographie.json")),review:read(path.join(__dirname,"revue.json")),data:read(path.join(__dirname,"diagnostics.json")),patches:read(path.join(__dirname,"patches.json")),hold:read(path.join(__dirname,"hold.json")),base:require('../baseline-engine.cjs'),...require("./integrer.cjs")}),null,2));
}
