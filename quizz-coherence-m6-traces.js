/* M6 #425: audit independent of selection. No production wiring. */
'use strict';
const BASE='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'];
const SEEDS=[11,47,103], HORIZONS=[5,20,65,153,180];
const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>String(q.caseFamily||q.id);
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const check=(v,m)=>{if(!v)throw Error(m)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function outcome(profile,seed,q,s){
 const u=hash(q.id+'|'+(s-1)+'|'+seed),v=hash('a|'+q.id+'|'+(s-1)+'|'+seed);
 const p=profile==='autonome'?0:profile==='intermediaire'?.33:profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):profile==='passe'?(openingPass(q)?.9:.1):.15;
 return {result:u<p?'wrong':'correct',assisted:profile==='aide'&&v<.6,hadFreeError:false};
}
function role(selection,first){
 if(selection.reason==='rappel_erreur_aide'||selection.reason==='renforcement_lacune')return 'consolidation_ciblee';
 if(selection.reason==='transfert_contexte')return 'transfert';
 if(selection.reason==='rappel_nouvelle_situation')return 'rappel_autre_main';
 if(selection.kind==='revision')return 'rappel';
 return first?'decouverte':'application';
}
function position(q,prev,old,first){
 const why=[];
 if(first)why.push('première exposition du concept dans la trajectoire');
 if(old!=null)why.push('réactivation après '+old+' séance(s)');
 if(!prev)why.push('entrée de séance');
 else {if(prev.concept===q.concept)why.push('continuité de concept');else if(prev.theme===q.theme)why.push('transition au sein de la rubrique');else why.push('changement de rubrique');
 if(q.difficulty-prev.difficulty>=2)why.push('hausse de difficulté de '+(q.difficulty-prev.difficulty));
 if(bid(prev)===bid(q))why.push('même décision consécutive');
 if(prev.pattern&&prev.pattern===q.pattern)why.push('miroir consécutif');}
 return why;
}
function traceSession({deck,selection,meta,rawMeta=meta,elig,pattern,s,history,profile,seed,latencyMs,objective=null}){
 check(deck.length===selection.length&&deck.length===elig.length,'Trace misalignment');
 const past=history.flatMap(x=>x.rows);
 const seenConcept=new Set(past.map(x=>x.concept)),last=new Map(),lastId=new Map(),lastFamily=new Map(),seenIds=new Map(),proof=new Map();
 for(const x of past){last.set(x.concept,x.session);lastId.set(x.id,x.session);lastFamily.set(x.family,x.session);
 if(!seenIds.has(x.concept))seenIds.set(x.concept,new Set());seenIds.get(x.concept).add(x.id);
 if(x.result==='correct'&&!x.assisted&&!x.hadFreeError){if(!proof.has(x.concept))proof.set(x.concept,[]);proof.get(x.concept).push(x);}}
 const rows=[];
 for(let i=0;i<deck.length;i++){
 const q=deck[i],m=meta.byId[q.id],sel=selection[i];check(m&&sel.id===q.id,'Missing metadata or wrong selection ID');
 const first=!seenConcept.has(m.concept),gap=last.has(m.concept)?s-last.get(m.concept):null;
 const r={session:s,position:i+1,id:q.id,theme:q.theme,context:q.context,hand:q.hand,h:q.h,shape:q.shape,auction:q.auction,answer:q.answer,difficulty:q.difficulty,concept:m.concept,stage:m.stage,minSession:m.minSession??null,metadataOverride:same(rawMeta.byId[q.id],m)?null:{catalogue:rawMeta.byId[q.id],effective:m},family:family(q),pattern:pattern(q),kind:sel.kind,selectionReason:sel.reason,role:role(sel,first),firstExposure:first,conceptGap:gap,idGap:lastId.has(q.id)?s-lastId.get(q.id):null,familyGap:lastFamily.has(family(q))?s-lastFamily.get(family(q)):null,requires:m.requires.map(req=>({concept:req.concept,minExposure:req.minExposure,exposureIds:seenIds.get(req.concept)?.size||0,autonomousFamilies:new Set((proof.get(req.concept)||[]).map(x=>x.family)).size,autonomousSessions:new Set((proof.get(req.concept)||[]).map(x=>x.session)).size})),eligibility:elig[i],...outcome(profile,seed,q,s)};
 r.positionObservations=position(r,rows.at(-1),gap,first);rows.push(r);seenConcept.add(m.concept);
 }
 const counts={};for(const r of rows)counts[r.concept]=(counts[r.concept]||0)+1;
 const dominant=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0]||null;
 // Native engine exposes selection reasons, not causal position rationale or an explicit lesson objective.
 const chosenObjective=objective||{source:'observed-dominant-concept-not-intent',principal:dominant};
 const declared=chosenObjective.source==='declared'&&typeof chosenObjective.principal==='string';
 const allowed=new Set([chosenObjective.principal,...(chosenObjective.secondary||[]),...(chosenObjective.allowedConcepts||[])]);
 const roleCounts={},themeCounts={};
 for(const r of rows){roleCounts[r.role]=(roleCounts[r.role]||0)+1;themeCounts[r.theme]=(themeCounts[r.theme]||0)+1;}
 const summary={conceptCounts:counts,themeCounts,roleCounts,firstExposures:rows.filter(r=>r.firstExposure).map(r=>r.concept),
 newFamilies:rows.filter(r=>r.familyGap===null).length,nearFamily:rows.filter(r=>r.familyGap!==null&&r.familyGap<=2).length,
 difficulty:rows.map(r=>r.difficulty),themeSwitches:rows.filter((r,i)=>i>0&&r.theme!==rows[i-1].theme).length,
 objectiveAlignment:declared?{onTarget:rows.filter(r=>allowed.has(r.concept)).length,
 justifiedOffTarget:rows.filter(r=>!allowed.has(r.concept)&&['consolidation_ciblee','rappel_autre_main','rappel','transfert'].includes(r.role)).map(r=>r.id),
 offTargetNew:rows.filter(r=>!allowed.has(r.concept)&&!['consolidation_ciblee','rappel_autre_main','rappel','transfert'].includes(r.role)).map(r=>r.id)}:null};
 return {session:s,objective:chosenObjective,latencyMs,summary,rows};
}
function metrics(sessions){
 const ids=new Set(),families=new Set(),concepts=new Set(),themes=new Set(),last=new Map(),proof=new Map(),first={},firstTheme={},pending=new Map(),delays=[],gaps=[],violations=[];
 let exact=0,triples=0,mirror1=0,mirror2=0,hard=0,coreDebt=0,conceptDebt=0,jumps=0,themeSwitches=0,nearFamily=0,nearId=0,objectiveMatches=0,total=0,autonomous=0,help=0,wrong=0,unmet=0;
 for(const [index,s] of sessions.entries()){
 const rows=s.rows; if(s.session!==index+1||rows.length!==10)violations.push([s.session,'shape']);
 if(new Set(rows.map(r=>r.id)).size!==rows.length||new Set(rows.map(r=>r.family)).size!==rows.length)violations.push([s.session,'duplicate']);
 for(const [k,at] of last){if(s.session-at>20)conceptDebt++;if(CORE.has(k)&&s.session-at>8)coreDebt++;}
 for(const [i,r] of rows.entries()){
 if(r.session!==s.session||r.position!==i+1||!r.eligibility?.eligible)violations.push([s.session,r.id,'eligibility-or-position']);
 if(r.requires.some(x=>x.exposureIds<x.minExposure)){unmet++;violations.push([s.session,r.id,'prerequisite-exposure']);}
 ids.add(r.id);families.add(r.family);concepts.add(r.concept);themes.add(r.theme);last.set(r.concept,s.session);
 if(!Object.hasOwn(first,r.concept))first[r.concept]=s.session;
 if(!Object.hasOwn(firstTheme,r.theme))firstTheme[r.theme]=s.session;
 if(i&&bid(r)===bid(rows[i-1]))exact++;
 if(s.session>1&&i>1&&r.theme===rows[i-1].theme&&r.theme===rows[i-2].theme)triples++;
 if(i&&r.pattern&&r.pattern===rows[i-1].pattern)mirror1++;
 if(i>1&&r.pattern&&r.pattern===rows[i-2].pattern)mirror2++;
 if(i&&r.difficulty-rows[i-1].difficulty>=2)jumps++;
 if(i&&r.theme!==rows[i-1].theme)themeSwitches++;
 if(r.familyGap!=null&&r.familyGap<=2)nearFamily++;
 if(r.idGap!=null&&r.idGap<=2)nearId++;
 if(r.conceptGap!=null)gaps.push(r.conceptGap);
 if(r.concept===s.objective.principal) objectiveMatches++;
 hard+=+(r.difficulty>=4);total++;help+=+r.assisted;wrong+=+(r.result==='wrong');
 if(pending.has(r.id)){delays.push(s.session-pending.get(r.id));pending.delete(r.id);}
 if(r.result!=='correct'||r.assisted||r.hadFreeError)pending.set(r.id,s.session);
 else{autonomous++;if(!proof.has(r.concept))proof.set(r.concept,{families:new Set(),sessions:new Set()});proof.get(r.concept).families.add(r.family);proof.get(r.concept).sessions.add(s.session);}
 }}
 const quantile=(a,p)=>a.length?a.slice().sort((x,y)=>x-y)[Math.ceil(p*a.length)-1]:null;
 // Score transparent: structural checks are a separate hard gate. Each term is an observed warning, not a causal teaching judgment.
 const orderWarnings=exact+triples+mirror1+mirror2+jumps;
 return {total,ids:ids.size,families:families.size,concepts:concepts.size,themes:themes.size,first,firstTheme,autonomous,help,wrong,proofConcepts:[...proof.values()].filter(x=>x.families.size>=2&&x.sessions.size>=2).length,hard,coreDebt,conceptDebt,exact,triples,mirror1,mirror2,jumps,themeSwitches,nearFamily,nearId,objectiveMatches,objectiveShare:total?objectiveMatches/total:0,orderWarnings,orderScore:total?Math.max(0,100-100*orderWarnings/total):null,medianConceptGap:quantile(gaps,.5),p95ConceptGap:quantile(gaps,.95),medianRecall:quantile(delays,.5),pending:pending.size,unmet,violations,p95Latency:quantile(sessions.map(s=>s.latencyMs),.95)};
}
function compare(before,after){
 check(before.profile===after.profile&&before.seed===after.seed&&before.catalogueKey===after.catalogueKey&&before.policy===after.policy&&before.sessions.length===after.sessions.length,'Unpaired runs');
 const checkpoints=HORIZONS.filter(n=>n<=before.sessions.length).map(n=>{
 const a=metrics(before.sessions.slice(0,n)),b=metrics(after.sessions.slice(0,n)),review=[];
 if(b.violations.length)review.push('structure');if(b.families<.95*a.families)review.push('families');if(b.themes<a.themes)review.push('themes');
 if(n>=20&&!(b.firstTheme.sa>=4&&b.firstTheme.sa<=8))review.push('early-sa');
 if(n>=65&&a.proofConcepts-b.proofConcepts>Math.max(3,.1*a.proofConcepts))review.push('proof');
 if(n>=65&&a.concepts-b.concepts>2)review.push('concepts');
 for(const k of ['coreDebt','conceptDebt'])if(b[k]-a[k]>Math.max(10,.15*a[k]))review.push(k);
 if(b.exact>a.exact+2||b.triples>a.triples+2||b.mirror1+b.mirror2>a.mirror1+a.mirror2+2)review.push('order');
 if(b.jumps>a.jumps+2)review.push('difficulty-jumps');
 if(b.nearFamily-a.nearFamily>Math.max(3,.15*a.nearFamily))review.push('near-family-review');
 if(n>=65&&b.p95Latency>a.p95Latency*1.5+10)review.push('latency-review');
 return {session:n,before:a,after:b,review};
 });
 const changes=before.sessions.map((a,i)=>{const b=after.sessions[i],x=a.rows.map(r=>r.id),y=b.rows.map(r=>r.id);return {session:a.session,sameOrder:same(x,y),sameSet:same(x.slice().sort(),y.slice().sort()),removed:x.filter(id=>!y.includes(id)),added:y.filter(id=>!x.includes(id))};});
 return {profile:before.profile,seed:before.seed,checkpoints,changes};
}
module.exports={BASE,PROFILES,SEEDS,HORIZONS,outcome,traceSession,metrics,compare,check,same};
