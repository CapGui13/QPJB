/* Synthetic lab, never loaded in production. No student data. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBDurableLab=factory();})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const DAY=86400000, HORIZONS=[20,65,153,180], SEEDS=[11,47,103];
const PROFILES=Object.freeze({
 autonome:{initial:.62,learn:.26,half:75,help:.04,skip:.015,free:.05,pace:1,breakEvery:30,breakDays:9,weak:[],confusion:.08},
 intermediaire:{initial:.31,learn:.20,half:40,help:.15,skip:.04,free:.12,pace:2,breakEvery:24,breakDays:12,weak:[],confusion:.18},
 faible:{initial:.12,learn:.13,half:22,help:.27,skip:.09,free:.16,pace:3,breakEvery:18,breakDays:15,weak:['red','second','forcing'],confusion:.24},
 cible:{initial:.36,learn:.20,half:42,help:.15,skip:.04,free:.12,pace:2,breakEvery:24,breakDays:10,weak:['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','michaels','multilandy','rubensohl'],confusion:.25},
 aide:{initial:.29,learn:.18,half:34,help:.65,skip:.04,free:.17,pace:1,breakEvery:25,breakDays:14,weak:[],confusion:.20},
 passe:{initial:.43,learn:.19,half:43,help:.12,skip:.03,free:.13,pace:2,breakEvery:20,breakDays:11,weak:['ouv.passe'],confusion:.20}
});
for(const p of Object.values(PROFILES)){Object.freeze(p.weak);Object.freeze(p)}
Object.freeze(HORIZONS);Object.freeze(SEEDS);
const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function random(...keys){let h=2166136261;for(const c of JSON.stringify(keys))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;return (h>>>0)/4294967296}
const family=q=>String(q.caseFamily||q.id), round=x=>Math.round(x*10000)/10000;
function profile(name,overrides={}){
 if(!Object.hasOwn(PROFILES,name))throw Error('Unknown profile '+name);
 const p={...PROFILES[name],...overrides};
 for(const k of ['initial','learn','help','skip','free','confusion'])if(!Number.isFinite(p[k])||p[k]<0||p[k]>1)throw Error('Invalid '+k);
 for(const k of ['half','pace','breakEvery','breakDays'])if(!Number.isFinite(p[k])||p[k]<0||(['half','breakEvery'].includes(k)&&p[k]===0))throw Error('Invalid '+k);
 if(!Array.isArray(p.weak))throw Error('Invalid weakness');return p;
}
function weak(p,k){return p.weak.some(w=>k===w||k.startsWith(w+'.'))}
function sessionDay(p,s){return (s-1)*p.pace+Math.floor((s-1)/p.breakEvery)*p.breakDays}
function baseSkill(p,k,seed){return clamp(p.initial+(random(seed,k,'initial')-.5)*.16-(weak(p,k)?.22:0),.02,.92)}
function effective(p,k,seed,entry,day){
 const floor=baseSkill(p,k,seed)*.50;
 if(!entry)return baseSkill(p,k,seed);
 return floor+(entry.strength-floor)*Math.pow(2,-Math.max(0,day-entry.day)/(p.half*entry.stability));
}
function probability(p,k,seed,entry,q,day,probe=false){
 const v=effective(p,k,seed,entry,day);
 const familiarity=probe?0:Math.min(.18,(entry?.families?.[family(q)]||0)*.055);
 const confusion=weak(p,k)?p.confusion:p.confusion*.35;
 // Four alternatives: guessed success not equivalent to a known rule.
 return clamp(.12+.80*v+familiarity-(Number(q.difficulty||1)-1)*.067-confusion,.04,.96);
}
function answer(p,k,seed,entry,q,s,day,mode='learning'){
 const u=(label)=>random(seed,k,q.id,s,label);
 if(u('skip')<p.skip)return {id:q.id,result:'skipped',choice:null,assisted:false,hadFreeError:false,firstGuess:null};
 const prob=mode==='fixed'?clamp(p.initial+(weak(p,k)?-.18:0),.05,.95):probability(p,k,seed,entry,q,day);
 const success=u('success')<prob;
 const wrong=q.choices.filter(c=>c!==q.answer);
 const distractor=wrong[Math.floor(u('distractor')*wrong.length)]||null;
 // Persistent confusion biases a wrong option, not a diagnosis of a real student.
 const initial=success?q.answer:(weak(p,k)&&u('confuse')<p.confusion?wrong[Math.floor(random(seed,k,'confusion')*wrong.length)]||distractor:distractor);
 const assisted=u('help')<p.help*(success?.55:1);
 const corrected=!success&&!assisted&&u('free')<p.free;
 const choice=assisted||corrected?q.answer:initial;
 return {id:q.id,result:choice===q.answer?'correct':'wrong',choice,assisted,hadFreeError:corrected,firstGuess:initial};
}
const independent=a=>a.result==='correct'&&!a.assisted&&!a.hadFreeError;
function update(p,k,seed,entry,q,a,day){
 if(a.result==='skipped')return entry;
 const current=effective(p,k,seed,entry,day),f=family(q),previous=entry?.families?.[f]||0;
 const newFamily=!previous,spaced=!!entry&&day-entry.day>=p.pace*2;
 const weight=independent(a)?1:a.assisted?.52:a.hadFreeError?.66:.32;
 const gain=p.learn*weight*(newFamily?1:.50)*(weak(p,k)?.65:1);
 return {strength:clamp(current+(1-current)*gain),day,
  stability:clamp((entry?.stability||1)+(independent(a)&&spaced?(newFamily?.22:.10):0),1,4),
  families:{...(entry?.families||{}),[f]:previous+1}};
}
function catalog(exercises,meta){
 const ids=new Set(),byConcept={},families=new Set();
 for(const q of exercises){const k=meta.byId[q.id]?.concept;if(!k||ids.has(q.id)||!q.choices.includes(q.answer))throw Error('Invalid catalogue '+q.id);
 ids.add(q.id);families.add(family(q));(byConcept[k]??=[]).push(q);}
 for(const rows of Object.values(byConcept))rows.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 return {ids,byConcept,families};
}
function probes(p,seed,learned,universe,day){
 let strength=0,retention7=0,retention30=0,transfer=0,n=0,transferN=0,observed=0;
 for(const [k,rows] of Object.entries(universe.byConcept)){
  const e=learned[k], q=rows[Math.floor(random(seed,k,'probe')*rows.length)];
  n++;if(e)observed++;
  strength+=effective(p,k,seed,e,day);
  retention7+=probability(p,k,seed,e,q,day+7,true);
  retention30+=probability(p,k,seed,e,q,day+30,true);
  // Never label a same-family item transfer; no opportunity = missing, not zero.
  const novel=rows.filter(v=>!e?.families?.[family(v)]);
  if(e&&novel.length){const target=novel[Math.floor(random(seed,k,'novel')*novel.length)];transfer+=probability(p,k,seed,e,target,day,true);transferN++}
 }
 return {latent:round(strength/n),retention7:round(retention7/n),retention30:round(retention30/n),unseenFamilyProbe:transferN?round(transfer/transferN):null,transferN,probeN:n,learnedConcepts:observed};
}
function compare(before,after){
 if(before.profile!==after.profile||before.seed!==after.seed||before.model!==after.model||JSON.stringify(before.parameters)!==JSON.stringify(after.parameters))throw Error('Unpaired trajectories');
 return before.checkpoints.map((a,i)=>{const b=after.checkpoints[i];if(!b||a.session!==b.session)throw Error('Unpaired horizon');
 const deltas={};for(const k of ['families','concepts','proof','independent','retention30','retention7','debt','coreDebt','help','wrong','skipped','transferProof','duplicates','ineligible','short','variety'])deltas[k]=round(b[k]-a[k]);
 const review=[];if(b.ineligible||b.duplicates||b.short)review.push('invariants');
 if(b.families<.95*a.families)review.push('families');if(a.proof-b.proof>Math.max(3,.1*a.proof))review.push('proof');
 if(a.concepts-b.concepts>2)review.push('concepts');if(b.debt-a.debt>Math.max(10,.15*a.debt))review.push('debt');
 if(a.retention30-b.retention30>.03)review.push('synthetic-retention');
 return {session:a.session,deltas,review};});
}
function run({api,exercises,meta,probeExercises=exercises,probeMeta=meta,name,seed,horizon=180,overrides={},model='learning',clock,verifyEarly,measure=()=>0}){
 if(!Number.isInteger(horizon)||horizon<1||!Number.isInteger(seed)||!['learning','fixed'].includes(model)||typeof clock!=='function')throw Error('Invalid run');
 const p=profile(name,overrides),universe=catalog(probeExercises,probeMeta),pool=catalog(exercises,meta);
 let state=api.empty(),learned={},independentCount=0,help=0,wrong=0,skipped=0,corrected=0,ineligible=0,duplicates=0,short=0,variety=0,debt=0,coreDebt=0,transferProof=0,resumes=0,exports=0;
 const allIds=new Set(),allFamilies=new Set(),concepts=new Set(),themes=new Set(),proof={},last={},pending={},delays=[],checkpoints=[],latencies=[],violations=[],events=[];
 for(let s=1;s<=horizon;s++){
  const day=sessionDay(p,s);clock(day*DAY);
  const begin=measure(),deck=api.start(state,exercises);latencies.push(Math.max(0,measure()-begin));
  if(!deck.length)throw Error('Empty real session '+s);
  if(deck.length!==10){short++;violations.push({s,kind:'short',length:deck.length})}
  if(new Set(deck.map(q=>q.id)).size!==deck.length||new Set(deck.map(family)).size!==deck.length){duplicates++;violations.push({s,kind:'duplicate'})}
  if(JSON.stringify(state.active.selection.map(x=>x.id))!==JSON.stringify(deck.map(q=>q.id)))throw Error('Selection IDs '+s);
  const elig=api.eligibilityBatch(deck,state,exercises);
  elig.forEach((v,i)=>{if(!v.eligible){ineligible++;violations.push({s,kind:'eligibility',id:deck[i].id,reasons:v.reasons})}});
  if(verifyEarly)verifyEarly(deck,s);
  for(const [k,t] of Object.entries(last)){if(s-t>20)debt++;if(CORE.has(k)&&s-t>8)coreDebt++}
  for(let i=0;i<deck.length;i++){
   const q=deck[i],k=meta.byId[q.id].concept,f=family(q),entry=learned[k];
   allIds.add(q.id);allFamilies.add(f);concepts.add(k);themes.add(q.theme);last[k]=s;
   if(i&&deck[i-1].answer===q.answer)variety++;
   if(Object.hasOwn(pending,q.id)){delays.push(s-pending[q.id]);delete pending[q.id]}
   const a=answer(p,k,seed,entry,q,s,day,model);
   help+=+a.assisted;wrong+=+(a.result==='wrong');skipped+=+(a.result==='skipped');corrected+=+a.hadFreeError;
   if(independent(a)){independentCount++;const ev=proof[k]??={families:new Set(),sessions:new Set()};
    if(ev.families.size&&!ev.families.has(f)&&!ev.sessions.has(s))transferProof++;
    ev.families.add(f);ev.sessions.add(s);
   }else pending[q.id]=s;
   const next=update(p,k,seed,entry,q,a,day);if(next&&model==='learning')learned[k]=next;
   if(!api.record(state,q,a.result,i,a.choice,a.assisted,a.hadFreeError))throw Error('Record '+s+'/'+i);
   // Pause after a recorded answer; resume exact IDs and response evidence.
   if(i===2&&(s===1||s===20||s===65||s===153||random(seed,s,'abandon')<.07)){
    const saved=JSON.stringify(state.active),restored=api.load(JSON.stringify(state));
    if(JSON.stringify(restored.active)!==saved||JSON.stringify(api.start(restored,exercises).map(x=>x.id))!==JSON.stringify(deck.map(x=>x.id)))throw Error('Resume '+s);
    state=restored;resumes++;
   }
  }
  if(!api.finish(state,exercises))throw Error('Finish '+s);
  if(state.completed!==s)throw Error('Completed counter');
  events.push({s,day,ids:deck.map(q=>q.id),answers:state.journal.at(-1).answers.map(a=>[a.id,a.result,a.assisted,a.hadFreeError])});
  if(HORIZONS.includes(s)||s===horizon){
   const exported=api.exportProgress(state,exercises,{}),restored=api.importProgress(JSON.stringify(exported));
   if(restored.completed!==s||JSON.stringify(restored.journal)!==JSON.stringify(state.journal)||JSON.stringify(restored.entries)!==JSON.stringify(state.entries))throw Error('Export roundtrip '+s);
   exports++;
   const ls=latencies.slice().sort((a,b)=>a-b),ds=delays.slice().sort((a,b)=>a-b);
   checkpoints.push({session:s,day,ids:allIds.size,families:allFamilies.size,concepts:concepts.size,themes:themes.size,proof:Object.values(proof).filter(e=>e.families.size>=2&&e.sessions.size>=2).length,
    independent:independentCount,help,wrong,skipped,corrected,transferProof,ineligible,duplicates,short,variety,debt,coreDebt,pending:Object.keys(pending).length,medianRecall:ds.length?ds[Math.floor(ds.length/2)]:null,
    resumes,exports,stateChars:JSON.stringify(state).length,exportChars:JSON.stringify(exported).length,selectionP50:ls[Math.floor(ls.length*.5)],selectionP95:ls[Math.floor(ls.length*.95)],...probes(p,seed,learned,universe,day)});
  }
 }
 return {schema:'QPJB_DURABLE_LAB_V1',profile:name,seed,model,parameters:p,horizon,availableIds:pool.ids.size,availableFamilies:pool.families.size,checkpoints,violations,events};
}
return Object.freeze({schema:'QPJB_DURABLE_LAB_V1',DAY,HORIZONS,SEEDS,PROFILES,random,profile,sessionDay,baseSkill,effective,probability,answer,update,independent,catalog,probes,compare,run});
});