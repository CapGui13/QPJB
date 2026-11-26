"use strict";
function verify({engine,cart,ex,rows,diagnostics,holds,patches,weak,signature,overlay}){
 const eq=(a,b,msg)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(msg+" : "+JSON.stringify([a,b]).slice(0,400));};
 const ok=(v,msg)=>{if(!v)throw Error(msg);};
 const k=(id,c)=>JSON.stringify([id,c]), prefixes=new Set(["mineur","majeur","fit","apres_fit","drury","competitif"]);
 const by=new Map(ex.map(x=>[x.id,x])), own=cart.filter(x=>prefixes.has(x.concept.split(".")[0]));
 eq(ex.length,1879,"catalogue");eq(own.length,364,"périmètre");
 const target=new Set(own.flatMap(c=>c.options.filter(o=>o[1]==="unknown").map(o=>k(c.id,o[0]))));
 eq(target.size,457,"unknown cible");
 const all=new Map(rows.map(x=>[k(x.id,x.choice),x])), added=new Map(diagnostics.map(x=>[k(x.id,x.choice),x]));
 eq(rows.length,457,"revue");eq(all.size,457,"unicité");eq(added.size,diagnostics.length,"unicité hypothèses");
 const held=new Set(holds.map(x=>k(x.id,x.choice)));
 eq(held.size,holds.length,"unicité HOLD");
 const over=overlay(engine,diagnostics), stats={baseline:0,correct:0,preserved:0,added:0,unknown:0,held:0,guard:0,patches:0};
 for(const c of cart){
   const x=by.get(c.id);ok(x,"ID absent "+c.id);
   eq(over.diagnose({exercise:x,choice:x.answer}),engine.diagnose({exercise:x,choice:x.answer}),"bonne réponse");stats.correct++;
   for(const o of c.options){
     const key=k(c.id,o[0]), input={exercise:x,choice:o[0]}, base=engine.diagnose(input), next=over.diagnose(input);
     eq([base.status,base.category,base.confidence,base.evidence.rule],o.slice(1),"cartographie "+key);stats.baseline++;
     const row=all.get(key), d=added.get(key);
     if(target.has(key)){ok(row,"revue manquante "+key);eq(row.concept,c.concept,"concept");eq(row.signature,signature(x),"signature");eq(row.evidence.expected,x.answer,"corrigé");eq(row.evidence.canonicalExcerpt,x.explain,"explication");eq(row.evidence.auction,x.auction,"séquence");ok(row.reason.length>30,"justification");}
     else ok(!row&&!d&&!held.has(key),"hors périmètre "+key);
     if(d){ok(target.has(key)&&row.disposition==="hypothesis"&&!held.has(key),"attribution "+key);eq(next.status,"hypothesis","ajout");eq(next.category,d.category,"catégorie");eq(next.reason,d.reason,"raison");stats.added++;
       const assisted=over.diagnose({...input,assisted:true,hadFreeError:true});ok(assisted.evidence.assisted&&assisted.evidence.hadFreeError,"drapeaux");
       const changed={...x,context:x.context+" [modifié]"};eq(over.diagnose({exercise:changed,choice:o[0]}),engine.diagnose({exercise:changed,choice:o[0]}),"signature périmée");
       const unoffered={...x,choices:x.choices.filter(z=>z!==o[0])};eq(over.diagnose({exercise:unoffered,choice:o[0]}),engine.diagnose({exercise:unoffered,choice:o[0]}),"enchère libre");stats.guard+=3;
     }else{eq(next,base,"non-régression "+key);stats.preserved++;if(target.has(key)){eq(row.status,"unknown","unknown conservé");stats.unknown++;if(held.has(key)){ok(row.disposition.includes("hold"),"HOLD");stats.held++;}}}
   }
 }
 for(const p of patches){const x=by.get(p.id);ok(x&&all.has(k(p.id,p.removed)),"patch hors cible");eq(p.oldChoices,x.choices,"oldChoices");eq(p.signature,signature(x),"signature patch");eq(p.newChoices.length,4,"nombre choix");eq(new Set(p.newChoices).size,4,"choix uniques");ok(p.newChoices.includes(x.answer)&&!p.newChoices.includes(p.removed)&&p.newChoices.includes(p.added),"réponse préservée");eq(p.status,"proposal-only","proposition");eq(p.diagnostics.map(d=>d.choice).sort(),p.newChoices.filter(c=>c!==x.answer).sort(),"diagnostics patch");stats.patches++;}
 for(const w of weak)ok(all.has(k(w.id,w.choice)),"distracteur hors cible");
 eq(stats.baseline,5637,"options globales");eq(stats.added,diagnostics.length,"ajouts");eq(stats.held,holds.length,"HOLD");eq(stats.unknown+stats.added,457,"total");
 return stats;
}
module.exports={verify};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path"), root=path.resolve(__dirname,"../../../../..");
 const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,n),"utf8"));
 const html=fs.readFileSync(path.join(root,"quizz.html"),"utf8");
 const ex=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const cart=JSON.parse(fs.readFileSync(path.join(root,"audits/professeur-numerique-20261126/m3/cartographie.json"),"utf8"));
 const engine=require('../baseline-engine.cjs');
 const rows=["revue-mineur-majeur.json","revue-fit-apres-fit.json","revue-drury.json","revue-competitif.json"].flatMap(read);
 console.log(JSON.stringify(verify({engine,cart,ex,rows,diagnostics:read("diagnostics.json"),holds:read("hold.json"),patches:read("patches.json"),weak:read("weak-distractors.json"),...require("./overlay.cjs")}),null,2));
}
