/* Reproductible on Git checkout: node tests/durable-m2-remediation.cjs */
'use strict';
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
function load(s,req=()=>{throw Error('unexpected dependency')}){const m={exports:{}};new Function('module','exports','require',s)(m,m.exports,req);return m.exports;}
function run(sources){
 const start=Date.now();let assertions=0;
 const ok=(v,msg)=>{assertions++;if(!v)throw Error(msg);};
 const eq=(a,b,msg)=>ok(JSON.stringify(a)===JSON.stringify(b),msg);
 const qs=JSON.parse(sources.html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const meta=load(sources.meta),concepts=load(sources.concepts),diag=load(sources.diag),legacy=load(sources.legacy);
 const prof=load(sources.prof,p=>({'./quizz-apprentissage-concepts.js':concepts,'./quizz-diagnostic-erreurs.js':diag,'./quizz-remediation.js':legacy})[p]);
 const data={base:BASE,rows:{}},mod=load(sources.mod,()=>data);
 const registry={base:BASE,format:'rows[id]=[concept,family,fingerprint,options]; option=[bid,disposition,reason,category,confidence,diagnosticRule,feedback,transfer,targetCriteria,assistedCompatible]',review:'structural and rule-condition verification; canonical-contrast heuristic; HOLD not individually reviewed',rows:{}};
 const m={questions:qs.length,options:0,baselineTargeted:0,baselineFeedback:0,baselineTransfer:0,afterTargeted:0,afterFeedback:0,afterTransfer:0,assistedTargeted:0,diagnosticUnknown:0,diagnosticLow:0,dispositions:{},rules:{},themes:{},invalidHands:0};
 const inc=(o,k)=>o[k]=(o[k]||0)+1;
 const examples={},targets=[];
 const diagnose=(q,c,assisted=false,hadFreeError=false)=>prof.diagnose({exercise:q,choice:c,assisted,hadFreeError});
 const compatible=(d,e)=>d.status==='hypothesis'&&e.status===d.status&&d.category===e.category&&d.confidence===e.confidence&&d.reason===e.reason&&d.evidence?.rule===e.evidence?.rule&&e.evidence?.offered===true;
 for(const q of qs){
  ok(mod.valid(q),q.id+' hand');const concept=meta.byId[q.id]?.concept;
  eq(concepts.classify(q.id)?.concept,concept,q.id+' concept');ok(!data.rows[q.id],q.id+' unique');
  const row=[mod.fingerprint(q),concept,q.caseFamily||null,[]];data.rows[q.id]=row;
  const rr=[concept,row[2],row[0],[]];registry.rows[q.id]=rr;
  for(const c of q.choices.filter(c=>c!==q.answer)){
   m.options++;const d=diagnose(q,c),a={id:q.id,result:'wrong',choice:c,assisted:false,hadFreeError:false};
   const old=prof.feedback({exercise:q,answer:a});const hist=old.kind==='targeted'?[old.feedback,old.checkNext]:null;
   if(hist){m.baselineTargeted++;if(old.feedback)m.baselineFeedback++;if(old.checkNext)m.baselineTransfer++;}
   if(d.status==='unknown')m.diagnosticUnknown++;if(d.confidence==='low'&&d.status==='hypothesis')m.diagnosticLow++;
   const assisted=compatible(d,diagnose(q,c,true,false));
   row[3].push([c,d.category,d.confidence,d.evidence?.rule||null,hist,mod.digest(d.reason||''),assisted]);
   const x=mod.explain({exercise:q,answer:a,diagnostic:d}),rule=mod.contextual(q,c,d.category)||mod.transfer(q,c,d,concept);
   eq(x.canonical,q.explain,q.id+' canonical');
   const target=x.kind==='targeted';let disposition,reason;
   if(target){disposition=hist?'legacy':rule.id.startsWith('transfer-')?'transfer-rule':'rule';reason=hist?'historical-targeted':rule.id;
    m.afterTargeted++;if(x.feedback)m.afterFeedback++;if(x.checkNext)m.afterTransfer++;inc(m.rules,reason);
    ok(x.targetConcept===concept&&x.targetCriteria.length>0&&x.checkNext,q.id+' target');
    if(hist)eq([x.feedback,x.checkNext],hist,q.id+' legacy');
    if(!hist&&x.feedback)ok(!q.explain.includes(c),q.id+' redundant');
    targets.push({q,c,d,a,reason,assisted,criteria:x.targetCriteria});
    if(!examples[reason])examples[reason]={id:q.id,choice:c,concept,family:q.caseFamily,feedback:x.feedback,checkNext:x.checkNext,criteria:x.targetCriteria};
   }else if(d.status!=='hypothesis'||!['high','medium'].includes(d.confidence)){disposition='abstain';reason=d.status!=='hypothesis'?'diagnostic-unknown':'diagnostic-low';}
   else if(mod.explicit(q,c)){disposition='canonical-contrast';reason='local contrast marker; editorial review pending';}
   else{disposition='HOLD';reason='no validated contextual rule; editorial review pending';}
   if(!target)ok(!x.feedback&&!x.checkNext&&!x.targetConcept,q.id+' abstention');
   inc(m.dispositions,disposition);inc(m.themes,q.theme+':'+disposition);
   rr[3].push([c,disposition,reason,d.category,d.confidence,d.evidence?.rule||null,!!x.feedback,!!x.checkNext,x.targetCriteria,assisted]);
   const aided=mod.explain({exercise:q,answer:{...a,assisted:true},diagnostic:diagnose(q,c,true,false)});
   if(aided.kind==='targeted')m.assistedTargeted++;
   eq(aided.kind==='targeted',target&&assisted,q.id+' aided');
   const corrected=mod.explain({exercise:q,answer:{...a,result:'correct',choice:q.answer,assisted:true,hadFreeError:true,firstGuess:c},diagnostic:diagnose(q,c,false,true)});
   if(target&&compatible(d,diagnose(q,c,false,true)))eq(corrected.kind,'corrected-targeted',q.id+' corrected');
   eq(corrected.canonical,q.explain,q.id+' corrected canonical');
   for(const bad of [null,{...d,reason:'other'},{...d,evidence:{...d.evidence,choice:q.answer}}]){
    const y=mod.explain({exercise:q,answer:a,diagnostic:bad});ok(!y.feedback&&!y.targetConcept,q.id+' invalid diagnostic');
   }
   const altered={...q,explain:q.explain+' '};ok(!mod.explain({exercise:altered,answer:a,diagnostic:d}).targetConcept,q.id+' version');
   eq(mod.explain({exercise:q,answer:a,diagnostic:d}),x,q.id+' deterministic');
  }
  const a={id:q.id,result:'correct',choice:q.answer,assisted:false,hadFreeError:false};
  for(const [input,kind] of [[{},'unanswered'],[{answer:a},'correct'],[{answer:{...a,assisted:true}},'assisted'],[{answer:{...a,hadFreeError:true}},'corrected'],[{answer:{id:q.id,result:'skipped'}},'skipped'],[{answer:{...a,id:'wrong-id'}},'unanswered'],[{answer:{...a,result:'wrong'}},'unknown']]){
   const x=mod.explain({exercise:q,...input});eq(x.kind,kind,q.id+' '+kind);eq(x.canonical,kind==='unanswered'?'':q.explain,q.id+' canonical '+kind);ok(!x.feedback&&!x.targetConcept,q.id+' no inference');
  }
 }
 eq(m.options,5745,'options');eq(m.questions,1915,'questions');eq(m.baselineTargeted,140,'baseline');
 const pairs={};
 for(const t of targets){
  const u=targets.find(u=>u.q.id!==t.q.id&&u.q.caseFamily!==t.q.caseFamily&&JSON.stringify(u.q.hand)!==JSON.stringify(t.q.hand)&&u.q.answer!==t.q.answer&&u.reason===t.reason&&meta.byId[u.q.id].concept===meta.byId[t.q.id].concept&&meta.byId[u.q.id].stage<=meta.byId[t.q.id].stage+1);
  if(u){pairs[t.q.id+'|'+t.c]={id:u.q.id,choice:u.c,criterion:t.reason,concept:meta.byId[t.q.id].concept};}
 }
 m.distinctHandPairs=Object.keys(pairs).length;
 const t=targets.find(t=>t.assisted&&targets.filter(u=>u.assisted&&u.d.category===t.d.category&&u.q.caseFamily!==t.q.caseFamily).length>3);
 ok(!!t,'history anchor');
 const u=targets.find(u=>u.assisted&&u.d.category===t.d.category&&u.q.caseFamily!==t.q.caseFamily);
 const v=targets.find(v=>v.assisted&&v.d.category===t.d.category&&v.q.caseFamily!==t.q.caseFamily&&v.q.caseFamily!==u.q.caseFamily);
 ok(!!v,'history distinct families');
 const event=(z,session,extra={})=>({mode:'parcours',session,answers:[{...z.a,assisted:true,family:z.q.caseFamily,...extra}]});
 const h={completed:7,journal:[event(u,6),event(v,7)]};
 const call=history=>mod.explain({exercise:t.q,answer:t.a,diagnostic:t.d,history});
 const before=JSON.stringify(h);ok(call(h).reminder?.includes('familles distinctes'),'real aided wrong across families');
 eq(call({format:'QPJB_PROGRESS_EXPORT_1',summary:{completedSessions:7},sessions:h.journal}),call(h),'export');
 for(const journal of [[event(u,6),event(v,6)],[event(u,6),event(u,7)],[event(u,1),event(v,7)],[event(u,6,{result:'correct'}),event(v,7)],[event(u,6,{hadFreeError:true}),event(v,7)],[event(u,6,{choice:null}),event(v,7)],[event(u,6,{family:'unknown'}),event(v,7)]]){
  eq(call({completed:7,journal}).reminder,null,'history negative');
 }
 ok(call({completed:7,journal:[event(t,7)]}).reminder?.includes('même enchère'),'same question reminder');
 eq(JSON.stringify(h),before,'history not mutated');
 const frozen=JSON.stringify(t.q);Object.freeze(t.q);Object.freeze(t.a);Object.freeze(t.d);call(h);eq(JSON.stringify(t.q),frozen,'input not mutated');
 const js='/* Frozen catalogue #396/#398; generated by tests/durable-m2-remediation.cjs. */\n(function(root,factory){if(typeof module===\'object\'&&module.exports)module.exports=factory();else root.QPJBDurableM2Data=factory();})(typeof globalThis!==\'undefined\'?globalThis:this,function(){return '+JSON.stringify(data)+';});\n';
 if(sources.data)eq(load(sources.data),data,'committed data matches generation');
 if(sources.registry)eq(JSON.parse(sources.registry),registry,'committed registry matches generation');
 if(sources.pairs)eq(JSON.parse(sources.pairs),pairs,'committed pairs match generation');
 const browser={};new Function('module','globalThis',js)(undefined,browser);new Function('module','globalThis',sources.mod)(undefined,browser);
 eq(browser.QPJBDurableRemediation.explain({exercise:t.q,answer:t.a,diagnostic:t.d}),call(null),'browser UMD');
 m.assertions=assertions;m.ms=Date.now()-start;
 return {data:js,registry,pairs,examples,metrics:m,historyExample:{id:t.q.id,choice:t.c,otherIds:[u.q.id,v.q.id]}};
}
module.exports={BASE,run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
 const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m2/';
 const git=p=>cp.execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
 const local=p=>fs.readFileSync(path.join(root,p),'utf8');
 const sources={html:git('quizz.html'),meta:git('quizz-prerequis.js'),concepts:git('quizz-apprentissage-concepts.js'),diag:git('quizz-diagnostic-erreurs.js'),legacy:git('quizz-remediation.js'),prof:git('quizz-professeur.js'),mod:local('quizz-durable-m2-remediation.js')};
 const write=process.argv.includes('--write');
 if(!write)Object.assign(sources,{data:local('quizz-durable-m2-data.js'),registry:local(dir+'registre.json'),pairs:local(dir+'transferts.json')});
 const out=run(sources);
 if(write){for(const [p,v] of [['quizz-durable-m2-data.js',out.data],[dir+'registre.json',JSON.stringify(out.registry)],[dir+'transferts.json',JSON.stringify(out.pairs)],[dir+'exemples.json',JSON.stringify(out.examples,null,2)],[dir+'mesures.json',JSON.stringify(out.metrics,null,2)]])fs.writeFileSync(path.join(root,p),v+'\n');}
 console.log(JSON.stringify(out.metrics,null,2));
}
