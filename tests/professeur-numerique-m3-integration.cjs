'use strict';
// Integrated M3 guard and non-regression test. Historical files remain immutable.
function validate({baseline,api,browser,q,map,records}){
 let checks=0;const assert=(v,m)=>{checks++;if(!v)throw Error(m)};
 const eq=(a,b,m)=>assert(JSON.stringify(a)===JSON.stringify(b),m);
 const key=(id,c)=>JSON.stringify([id,c]),sig=x=>{let h=2166136261;const s=JSON.stringify([x.hand,x.h,x.shape,x.auction,x.context,x.answer,x.explain]);for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(36)};
 const scope={a:['ouv','sa','sa1','sa2','barrage','fortes'],b:['mineur','majeur','fit','apres_fit','drury','competitif'],c:['red','second','forcing','roudi'],d:['chelem','michaels','multilandy','rubensohl'],e:['intervenir','contre','apres_inter','reponse_inter','reveil']};
 const index=new Map(),by=new Map(q.map(x=>[x.id,x])),seen=new Set(),rows=[],categories={},concepts={},per={},before={hypothesis:0,unknown:0},after={hypothesis:0,unknown:0},confidence={};
 for(const r of records){const k=key(r.id,r.choice);assert(!index.has(k),'duplicate '+k);index.set(k,r);}
 assert(q.length===1879&&by.size===1879&&map.length===1879&&index.size===2323,'catalogue and index');
 eq(api.schema,'QPJB_DIAGNOSTIC_V1','schema');eq(browser.schema,api.schema,'browser schema');
 const snapshot=JSON.stringify(q);
 for(const row of map){const x=by.get(row.id);assert(x&&x.choices.length===4&&new Set(x.choices).size===4&&row.options.length===3,'catalogue row '+row.id);
 const group=concepts[row.concept]??={qcm:0,options:0,hypothesis:0,unknown:0};group.qcm++;
 const out=[];for(const opt of row.options){const choice=opt[0],k=key(x.id,choice),input={exercise:x,choice},old=baseline.diagnose(input),d=api.diagnose(input),r=index.get(k);assert(!seen.has(k)&&x.choices.includes(choice)&&choice!==x.answer,'offered unique '+k);seen.add(k);
 eq([choice,old.status,old.category,old.confidence,old.evidence.rule],opt,'baseline snapshot '+k);
 before[old.status]++;after[d.status]++;group.options++;group[d.status]++;categories[d.category]=(categories[d.category]||0)+1;confidence[d.confidence]=(confidence[d.confidence]||0)+1;
 if(r){assert(old.status==='unknown'&&['ambiguous','canonical-ambiguous-contrast'].includes(old.evidence.rule),'eligible '+k);assert(scope[r.g].includes(row.concept.split('.')[0])&&r.concept===row.concept&&r.signature===sig(x)&&r.previousRule===old.evidence.rule,'signed scope '+k);
 eq([d.status,d.category,d.reason,d.confidence,d.evidence.rule],['hypothesis',r.category,r.reason,r.confidence,r.rule],'new hypothesis '+k);
 eq(d.evidence.review,'M3-'+r.g.toUpperCase(),'review provenance '+k);eq(d.evidence.choice,choice,'actual choice '+k);eq(d.evidence.expected,x.answer,'expected '+k);
 const aided={...input,assisted:true,hadFreeError:true},da=api.diagnose(aided);
 if(r.g==='e')eq(da,baseline.diagnose(aided),'E assisted abstention '+k);else {eq(da.status,'hypothesis','actual wrong choice '+k);assert(da.evidence.assisted===true&&da.evidence.hadFreeError===true,'live flags '+k);}
 const altered={...input,exercise:{...x,context:x.context+' (modified)'}};eq(api.diagnose(altered),baseline.diagnose(altered),'stale signature '+k);
 const notOffered={...input,exercise:{...x,choices:x.choices.filter(z=>z!==choice)}};eq(api.diagnose(notOffered),baseline.diagnose(notOffered),'not offered '+k);
 per[r.g]=(per[r.g]||0)+1;
 }else eq(d,old,'historical preserved '+k);
 eq(api.diagnose(input),browser.diagnose(input),'UMD parity '+k);
 out.push([choice,d.status,d.category,d.confidence,d.evidence.rule]);}
 rows.push({id:x.id,concept:row.concept,options:out});
 for(const assisted of [false,true]){const input={exercise:x,choice:x.answer,assisted,hadFreeError:assisted};eq(api.diagnose(input),baseline.diagnose(input),'correct preserved '+x.id);eq(api.diagnose(input),browser.diagnose(input),'correct parity '+x.id);}
 const missing={exercise:x,assisted:true,hadFreeError:true};eq(api.diagnose(missing),baseline.diagnose(missing),'no guessed choice '+x.id);
 }
 eq(seen.size,5637,'wrong total');eq(before,{hypothesis:2985,unknown:2652},'historical counts');eq(after,{hypothesis:5308,unknown:329},'integrated counts');for(const [g,n] of Object.entries({a:403,b:397,c:502,d:509,e:512}))eq(per[g],n,'lot '+g);
 eq(Object.keys(concepts).length,99,'concepts');eq(JSON.stringify(q),snapshot,'no mutation');
 const start=Date.now();for(let i=0;i<5;i++)for(const x of q)for(const choice of x.choices)api.diagnose({exercise:x,choice});
 return {checks,before,after,per,categories,confidence,concepts,rows,performance:{calls:37580,elapsedMs:Date.now()-start}};
}
module.exports={validate};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),root=path.join(__dirname,'..'),p=path.join(root,'audits/professeur-numerique-20261126/m3'),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
 const q=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const baseline=require(path.join(p,'parallel/baseline-engine.cjs')),api=require(path.join(root,'quizz-diagnostic-erreurs.js')),sandbox={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'quizz-diagnostic-erreurs.js'),'utf8'),sandbox);
 const result=validate({baseline,api,browser:sandbox.window.QPJBDiagnosticErreurs,q,map:read(path.join(p,'cartographie.json')),records:read(path.join(p,'parallel/diagnostics-integres.json')).records});
 const expected=read(path.join(p,'parallel/cartographie-integree.json'));
 if(JSON.stringify(result.rows)!==JSON.stringify(expected))throw Error('integrated snapshot mismatch');
 const {rows,concepts,...summary}=result;console.log(JSON.stringify(summary,null,2));
}
