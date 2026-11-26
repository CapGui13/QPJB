'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const api=require('../quizz-diagnostic-erreurs.js'),meta=require('../quizz-prerequis.js').byId;
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const q=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const patches=require('../audits/professeur-numerique-20261126/m3/patches.json');
const runChecks=function runChecks(api,q,patches,meta){
 const assert=(condition,msg)=>{if(!condition)throw Error(msg)};
 const by=new Map(q.map(x=>[x.id,x]));let counts={hypothesis:0,unknown:0,correct:0},categories={},concepts={},rows=[],offered=0,afterHyp=0,beforeDistinct=0,afterDistinct=0, maxMs=0;
 const patchMap=new Map(patches.map(p=>[p.id,p]));
 assert(q.length===1879&&by.size===1879,'catalogue');
 assert(new Set(Object.values(meta).map(x=>x.concept)).size===99,'concepts');
 for(const x of q){
   const before=JSON.stringify(x),c=meta[x.id].concept;const group=concepts[c]??={qcm:0,options:0,hypothesis:0,unknown:0};group.qcm++;
   assert(x.choices.length===4&&new Set(x.choices).size===4&&x.choices.includes(x.answer),'choices '+x.id);
   for(const assisted of [false,true]){const d=api.diagnose({exercise:x,choice:x.answer,assisted,hadFreeError:assisted});assert(d.status==='correct'&&d.category==='inconnu','correct '+x.id);}
   const ds=x.choices.filter(z=>z!==x.answer).map(choice=>{const d=api.diagnose({exercise:x,choice});assert(['hypothesis','unknown'].includes(d.status),'wrong '+x.id);assert(d.evidence.choice===choice,'choice '+x.id);assert(d.evidence.rule!=='illegal-call'&&d.evidence.rule!=='unparsed-auction','legal '+x.id);assert(d.status!=='hypothesis'||d.category!=='inconnu','category');counts[d.status]++;group[d.status]++;group.options++;categories[d.category]=(categories[d.category]||0)+1;offered++;return [choice,d.status,d.category,d.confidence,d.evidence.rule];});
   rows.push({id:x.id,concept:c,options:ds});
   const patch=patchMap.get(x.id),after=patch?{...x,choices:patch.newChoices}:x;
   const ad=after.choices.filter(z=>z!==x.answer).map(choice=>api.diagnose({exercise:after,choice}));
   beforeDistinct+=new Set(ds.filter(d=>d[1]==='hypothesis').map(d=>d[2])).size;afterDistinct+=new Set(ad.filter(d=>d.status==='hypothesis').map(d=>d.category)).size;
   afterHyp+=ad.filter(d=>d.status==='hypothesis').length;
   if(patch){assert(JSON.stringify(patch.oldChoices)===JSON.stringify(x.choices),'old exact');assert(new Set(after.choices).size===4&&after.choices.includes(x.answer),'patch choices');assert(after.choices.filter(z=>!x.choices.includes(z)).length===1,'patch scope');assert(ad.every(d=>d.evidence.rule!=='illegal-call'),'patch legal');}
   assert(JSON.stringify(x)===before,'mutation');
 }
 const sample=by.get('SEF-001-1');
 assert(api.diagnose({exercise:sample,choice:'2SA'}).category==='force','opening strength');
 assert(api.diagnose({exercise:sample,choice:'1♦'}).category==='priorite','opening priority');
 assert(api.diagnose({exercise:by.get('SEF-012-1'),choice:'1♠'}).category==='distribution','major length');
 assert(api.diagnose({exercise:by.get('SEF-V45-005'),choice:'Passe'}).category==='forcing','relay');
 assert(api.diagnose({exercise:by.get('SEF-037-1'),choice:'2♥'}).category==='convention','transfer');
 assert(api.diagnose({exercise:by.get('SEF-026-3'),choice:'1SA'}).category==='fit','fit');
 assert(api.diagnose({exercise:sample,choice:'4SA'}).status==='unknown','unmapped free');
 assert(api.diagnose({exercise:sample,choice:'1♥'}).category==='distribution','free valid');
 assert(api.diagnose({exercise:sample,choice:'foo'}).status==='unknown','invalid');
 assert(api.diagnose({exercise:by.get('SEF-V45-005'),choice:'1SA'}).evidence.rule==='illegal-call','illegal free');
 assert(api.diagnose({exercise:{...sample,h:16},choice:'2SA'}).status==='unknown','stale');
 assert(api.diagnose({exercise:sample,choice:'2SA',assisted:true,hadFreeError:true}).category==='force','actual selected wrong');
 assert(api.diagnose({exercise:sample,choice:null,assisted:true,hadFreeError:true}).status==='unknown','no invented choice');
 assert(api.diagnose(null).status==='unknown','absent input');
 for(const [id,choice,category] of [["SEF-V3-011-1","2SA","convention"],["SEF-L38-001","3♥","convention"],["SEF-V3-001-1","3SA","fit"],["SEF-V44-026","4♥","fit"],["SEF-V45-009","2SA","convention"],["SEF-V3-057-1","Passe","forcing"],["SEF-V3-027-2","Contre","competition"],["SEF-V470-005","2♥","convention"]])assert(api.diagnose({exercise:by.get(id),choice}).category===category,'contextual fixture '+id);
 const explicit=api.diagnose({exercise:by.get("SEF-045-1"),choice:"1SA"});assert(explicit.status==='hypothesis'&&explicit.category==='force','textual or structured contrast');
 for(const [id,choice,category] of [["SEF-016-3","Passe","force"],["SEF-024-2","1SA","force"],["SEF-042-2","1SA","priorite"],["SEF-044-1","2SA","force"],["SEF-044-1","2♠","fit"],["SEF-049-1","2♠","priorite"],["SEF-049-1","3♥","niveau"],["SEF-050-2","3♠","niveau"],["SEF-052-3","2♣","convention"],["SEF-054-1","2♥","distribution"],["SEF-054-2","2SA","force"],["SEF-N106-1","1SA","fit"],["SEF-N137-1","2♥","forcing"],["SEF-V3-074-3","Passe","fit"],["SEF-V3-074-3","2SA","convention"],["SEF-V3-085-3","2♥","fit"],["SEF-V4-074-3","3♥","niveau"],["SEF-V4-075-2","2♣","convention"],["SEF-V4-097-1","2♣","convention"],["SEF-V4-098-1","3♥","convention"],["SEF-V4-100-2","2♣","fit"],["SEF-V4-101-2","4♥","niveau"],["SEF-V4-101-2","2♦","convention"],["SEF-V44-005","1SA","force"],["SEF-V44-017","2♥","niveau"],["SEF-V44-022","3♥","niveau"],["SEF-V44-022","2SA","fit"],["SEF-V44-043","2♥","niveau"],["SEF-V45-013","2♥","forcing"],["SEF-V45-022","2♣","forcing"],["SEF-V45-022","2SA","force"],["SEF-V45-032","3♣","convention"],["SEF-V474-004","5SA","convention"],["SEF-V482-001","2♣","convention"],["SEF-V482-003","3♦","force"],["SEF-V482-005","3♠","convention"],["SEF-L01-A-01","4♥","convention"],["SEF-L06-029","Passe","convention"],["SEF-L23-006","3♥","fit"],["SEF-L25-001","Surcontre","convention"],["SEF-L25-001","2♠","contexte"],["SEF-L25-003","Passe","contexte"],["SEF-L38-002","3♣","convention"],["SEF-Q26-M2-015","Passe","contexte"],["V1-M2-002","4♠","fit"]])assert(api.diagnose({exercise:by.get(id),choice}).category===category,'new contextual fixture '+id+' '+choice);
 for(const [id,choice,category] of [["SEF-015-1","2♣","priorite"],["SEF-024-2","2♦","force"],["SEF-044-1","2♣","distribution"],["SEF-048-1","1SA","distribution"],["SEF-049-1","2SA","distribution"],["SEF-052-3","2SA","force"],["SEF-054-1","2♣","convention"],["SEF-N030-1","1SA","priorite"],["SEF-N041-1","2♣","force"],["SEF-N045-1","1SA","force"],["SEF-N058-2","1SA","priorite"],["SEF-N143-2","3SA","force"],["SEF-V3-027-2","1SA","force"],["SEF-V3-057-1","1SA","force"],["SEF-V3-085-3","2♣","force"],["SEF-V4-025-2","Passe","fit"],["SEF-V4-025-2","1SA","fit"],["SEF-V4-027-1","2♥","fit"],["SEF-V4-053-4","Contre","competition"],["SEF-V4-053-3","2♥","force"],["SEF-V44-041","1SA","priorite"],["SEF-V44-041","2♠","niveau"],["SEF-V480-001","2SA","fit"],["SEF-V480-001","3♠","niveau"],["SEF-V483-001","4SA","contexte"]])assert(api.diagnose({exercise:by.get(id),choice}).category===category,'additional contextual fixture '+id+' '+choice);
 assert(offered===5637,'wrong total');
 return {counts,categories,concepts,rows,offered,afterHyp,beforeDistinct,afterDistinct};
};
const out=runChecks(api,q,patches,meta);
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'quizz-diagnostic-erreurs.js'),'utf8'),sandbox);
const browser=sandbox.window.QPJBDiagnosticErreurs;if(browser.schema!==api.schema)throw Error('UMD');
for(const x of q)for(const choice of x.choices)if(JSON.stringify(api.diagnose({exercise:x,choice}))!==JSON.stringify(browser.diagnose({exercise:x,choice})))throw Error('UMD parity '+x.id);
const start=Date.now();for(let i=0;i<5;i++)for(const x of q)for(const choice of x.choices)api.diagnose({exercise:x,choice});console.log(JSON.stringify({counts:out.counts,categories:out.categories,afterHyp:out.afterHyp,beforeDistinct:out.beforeDistinct,afterDistinct:out.afterDistinct,elapsedMs:Date.now()-start}));
