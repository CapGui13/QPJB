/* M3 #422 — propositions isolées, aucune activation en production. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJB_COHERENCE_M3=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const TEXAS=['SEF-039-2','SEF-039-1','SEF-040-2','SEF-N084-1','SEF-N087-2','V2-M2-018'];
const TEXAS_ELEMENTARY=['SEF-037-1','SEF-038-1','SEF-N082-2','SEF-N085-1','SEF-V44-015','SEF-V44-016','SEF-V49-017','SEF-C-003','V2-M2-030'];
const STAYMAN_FOURTH=['SEF-V416-007','SEF-PN26-M1-033'];
const STAYMAN_SIMPLE=['SEF-V3-011-1','SEF-V3-011-3','SEF-V3-012-1','SEF-V3-013-4','SEF-V3-014-2','SEF-V3-014-1','SEF-V3-015-1','SEF-V3-016-1','SEF-V3-016-2'];
const RED=['SEF-042-2','SEF-043-1','SEF-043-3','SEF-047-1','SEF-N110-1','SEF-N111-1','SEF-N112-2','SEF-N113-1'];
const VISAS=['SEF-028-2','SEF-028-1','SEF-N048-3','SEF-N048-1','SEF-N053-2','SEF-N053-1','SEF-C-006'];
const clone=x=>JSON.parse(JSON.stringify(x));
const get=(m,id)=>m instanceof Map?m.get(id):m&&m[id];
const idOf=x=>typeof x==='string'?x:x&&(x.id||x.exercise?.id||x.q?.id);
function patches(metadataById,exercises){
 const by=new Map(exercises.map(q=>[q.id,q]));
 return [...TEXAS,...RED].map(id=>{
 const q=by.get(id),old=get(metadataById,id);
 if(!q||!old)throw Error('Missing frozen ID '+id);
 const texas=TEXAS.includes(id);
 const expected=texas?{concept:'sa1.texas',stage:0,minSession:4,requires:[{concept:'sa1.seuil',minExposure:1}]}:null;
 if(texas?JSON.stringify(old)!==JSON.stringify(expected):old.concept!=='red.bicolore'||old.stage!==0||old.minSession!==5)throw Error('Metadata drift '+id);
 const next=clone(old);
 if(texas){next.stage=1;next.requires.push({concept:'sa1.texas',minExposure:1});}
 else next.concept='red.base';
 return {id,old:clone(old),new:next,status:'HOLD',decision:texas?'Régression de couverture de preuve faible/103 à S65 ; ne pas activer sans recette intégrée.':'Pas de gain de sélection démontré ; ne pas activer.',preuve:texas?'Texas majeur avec force de manche : introduire auparavant le transfert élémentaire sur main faible. Exposition seulement, jamais réussite obligatoire.':'Redemande de majeure quatrième avec main régulière, pas le bicolore 5-4 économique ou cher ; ne pas créditer cette notion par assimilation.',accord:'Aucun changement de réponse SEF ; validation du coordinateur requise.',question:{auction:q.auction,answer:q.answer,explain:q.explain}};
 });
}
function applyExperimental(metadataById,exercises,group='none'){
 if(!['texas','red','both','none'].includes(group))throw Error('Unknown group');
 const out=clone(metadataById);
 if(group==='none')return out;
 for(const p of patches(metadataById,exercises))if(group==='both'||(group==='texas'&&TEXAS.includes(p.id))||(group==='red'&&RED.includes(p.id)))out[p.id]=p.new;
 return out;
}
function effective(q,m){
 if(!m)return m;
 if(VISAS.includes(q.id)&&m.concept==='majeur.soutien'&&m.minSession===1&&q.difficulty<=2&&q.theme==='majeur'&&q.auction?.length===1&&(/^2[♥♠]$/.test(q.answer))&&q.shape?.[q.answer==='2♠'?0:1]===3&&q.auction[0].includes('1'+q.answer[1]))
 return {...m,stage:0,requires:m.requires.filter(r=>r.concept!=='majeur.soutien')};
 return m;
}
function evidence(ctx){
 const by=new Map((ctx.exercises||[]).map(q=>[q.id,q])), out=new Map();
 function add(id,session,proof){
 const q=by.get(id),m=q&&get(ctx.metadataById,id);if(!m)return;
 if(!out.has(m.concept))out.set(m.concept,{ids:new Set(),families:new Set(),sessions:new Set(),proofs:[]});
 const a=out.get(m.concept);a.ids.add(id);
 if(proof){const family=String(q.caseFamily||q.id);a.families.add(family);a.sessions.add(session);a.proofs.push({family,session,difficulty:q.difficulty});}
 }
 const history=ctx.history||{};
 const completed=Number.isInteger(history.completed)?history.completed:ctx.session-1;
 for(const j of (Array.isArray(history.journal)?history.journal:[])){
 if(j.mode!=='parcours'||!Number.isInteger(j.session)||j.session<1||j.session>completed||j.session>=ctx.session)continue;
 for(const a of j.answers||[]){if(a&&a.id&&['correct','wrong','skipped'].includes(a.result))add(a.id,j.session,a.result==='correct'&&a.assisted===false&&a.hadFreeError===false);}
 }
 for(const [id,entry] of Object.entries(history.entries||{})){
 const s=entry&&entry.assessment&&entry.assessment.lastSession;if(Number.isInteger(s)&&s>=0&&s<completed)add(id,s,false);
 }
 return out;
}
// Advisory transition constraints, not eligibility. Same-session candidates
// and previously completed exposures are deliberately separate.
function transitionFor(id,m,ev,candidateIds,selectedIds,ctx){
 const spec=m.concept==='sa1.texas'?{simple:TEXAS_ELEMENTARY,complex:TEXAS,kind:'texas-partielle-avant-manche'}:m.concept==='sa1.stayman.reponse'?{simple:STAYMAN_SIMPLE,complex:STAYMAN_FOURTH,kind:'stayman-reponses-simples-avant-2SA'}:null;
 if(!spec||!spec.simple.includes(id)&&!spec.complex.includes(id))return null;
 const history=ev.get(m.concept)?.ids||new Set();
 const observedElementaryIds=spec.simple.filter(x=>history.has(x));
 const priorComplexIds=spec.complex.filter(x=>history.has(x));
 const alternatives=spec.simple.filter(x=>candidateIds.has(x)&&!selectedIds.has(x));
 const sameSessionElementaryIds=spec.simple.filter(x=>selectedIds.has(x));
 const preserveRecall=ctx.forcedReason==='rappel_erreur_aide'||ctx.category==='weakness';
 const isSimple=spec.simple.includes(id);
 const status=preserveRecall?'preserve-recall':observedElementaryIds.length?'elementary-previously-exposed':isSimple?'elementary-introduction':sameSessionElementaryIds.length?'order-after-elementary-in-same-session':alternatives.length?'prefer-elementary-alternative':'no-alternative-preserve-native';
 return {kind:spec.kind,status,observedElementaryIds,priorComplexIds,presentElementaryCandidateIds:alternatives,sameSessionElementaryIds,neverBlocks:true,grantsProof:false};
}
function rules(ctx={}){
 const ev=evidence(ctx),byId=new Map((ctx.exercises||[]).map(q=>[q.id,q])),byConcept=new Map();
 const candidateIds=new Set((ctx.candidates||[]).map(idOf)),selectedIds=new Set((ctx.selected||[]).map(idOf));
 for(const q of byId.values()){const m=effective(q,get(ctx.metadataById,q.id));if(!m)continue;if(!byConcept.has(m.concept))byConcept.set(m.concept,[]);byConcept.get(m.concept).push(q);}
 return (ctx.candidates||[]).map(c=>{
 const id=idOf(c),q=byId.get(id)||c,m=effective(q,get(ctx.metadataById,id));
 if(!m)return {id,status:'unknown',requirements:[],advisory:true};
 const requirements=(m.requires||[]).map(r=>{
 const a=ev.get(r.concept),exposure=a?a.ids.size:0,proofFamilies=a?a.families.size:0,proofSessions=a?a.sessions.size:0;
 return {...r,exposure,proofFamilies,proofSessions,status:exposure<r.minExposure?'missing-exposure':proofFamilies===0?'exposed-without-autonomous-proof':'exposed-with-autonomous-proof'};
 });
 // Reflect the independent lower-difficulty proof constraint of the frozen
 // engine, not its complete eligibility predicate. Never promote on exposure.
 const difficulty=q.difficulty,lower=key=>(byConcept.get(key)||[]).filter(v=>v.difficulty<difficulty);
 let autonomy=null;
 if(difficulty>=4&&difficulty<=5){
  const threshold=difficulty===5?3:2;
  const keys=lower(m.concept).length?[m.concept]:[...new Set(m.requires.map(r=>r.concept))];
  const available=new Set(keys.flatMap(k=>lower(k).map(v=>String(v.caseFamily||v.id))));
  const proofs=keys.flatMap(k=>(ev.get(k)?.proofs||[]).filter(p=>p.difficulty<difficulty));
  const families=new Set(proofs.map(p=>p.family)),sessions=new Set(proofs.map(p=>p.session));
  const exposed=keys.some(k=>lower(k).some(v=>ev.get(k)?.ids.has(v.id)));
  const ownBasics=(byConcept.get(m.concept)||[]).filter(v=>v.difficulty<=3&&effective(v,get(ctx.metadataById,v.id)).stage<=1);
  const ownBasicExposed=!ownBasics.length||ownBasics.some(v=>ev.get(m.concept)?.ids.has(v.id));
  const foundation=available.size>0&&exposed&&ownBasicExposed;
  const independent=available.size>0&&families.size>=Math.min(threshold,available.size)&&sessions.size>=threshold;
  autonomy={keys,availableFamilies:available.size,requiredFamilies:Math.min(threshold,available.size),requiredSessions:threshold,proofFamilies:families.size,proofSessions:sessions.size,foundation,independent,status:!foundation?'missing-foundation':!independent?'missing-independent-proof':'independent-proof-observed'};
 }else if(difficulty===3&&m.stage>=1&&lower(m.concept).length){
  const foundation=lower(m.concept).some(v=>ev.get(m.concept)?.ids.has(v.id));
  autonomy={keys:[m.concept],foundation,status:foundation?'lower-exposure-observed':'missing-foundation',independent:null};
 }
 return {id,concept:m.concept,stage:m.stage,minSession:m.minSession,status:ctx.session-1<m.minSession?'calendar':requirements.some(r=>r.status==='missing-exposure')?'missing-exposure':'requirements-observed',requirements,autonomy,transition:transitionFor(id,m,ev,candidateIds,selectedIds,ctx),advisory:true};
 });
}
function graph(metadataById,exercises){
 const concepts=new Map(),arcs=new Map(),rows=[];
 for(const q of exercises){
 const raw=get(metadataById,q.id);if(!raw)throw Error('Missing '+q.id);
 const m=effective(q,raw);if(!concepts.has(m.concept))concepts.set(m.concept,[]);concepts.get(m.concept).push(q.id);
 const disposition=TEXAS.includes(q.id)||RED.includes(q.id)?'proposition-individuelle':VISAS.includes(q.id)?'visa-historique-preserve':'inventaire-structurel-non-revise-individuellement';
 rows.push({id:q.id,concept:m.concept,stage:m.stage,minSession:m.minSession,requires:m.requires,disposition});
 for(const r of m.requires){const key=JSON.stringify([r.concept,m.concept,r.minExposure]);if(!arcs.has(key))arcs.set(key,{from:r.concept,to:m.concept,minExposure:r.minExposure,ids:[]});arcs.get(key).ids.push(q.id);}
 }
 const edges=[...arcs.values()].map(a=>({...a,disposition:a.from===a.to?'self-progression':'historical-dependency-not-individually-certified',justification:a.from===a.to?'Le moteur exige des IDs déjà exposés dans ce concept avant cette variante. L’existence d’une entrée sans auto-prérequis doit être vérifiée par accessibilité.':'Dépendance historique explicite dans les métadonnées effectives. Nécessité pédagogique à vérifier par ID ; aucun changement automatique.'}));
 const adjacency=new Map([...concepts.keys()].map(c=>[c,new Set()]));
 for(const a of edges)if(adjacency.has(a.from))adjacency.get(a.from).add(a.to);
 function reachable(c){const visited=new Set(),pending=[c];while(pending.length){const v=pending.pop();if(visited.has(v))continue;visited.add(v);for(const w of adjacency.get(v)||[])pending.push(w);}return visited;}
 const reach=new Map([...adjacency.keys()].map(c=>[c,reachable(c)])),assigned=new Set(),components=[];
 for(const c of adjacency.keys()){if(assigned.has(c))continue;const component=[...reach.get(c)].filter(v=>reach.get(v)?.has(c));for(const v of component)assigned.add(v);if(component.length>1)components.push(component.sort());}
 return {concepts:Object.fromEntries(concepts),arcs:edges,rows,crossConceptCycles:components,selfConcepts:[...new Set(edges.filter(a=>a.from===a.to).map(a=>a.from))],unknownPrerequisites:[...new Set(edges.filter(a=>!concepts.has(a.from)).map(a=>a.from))]};
}
function reachability(metadataById,exercises,horizon=180){
 const seen=new Map(),first={},available=new Set();
 for(let session=1;session<=horizon;session++){
 const next=[];
 for(const q of exercises){
 if(available.has(q.id))continue;
 const m=effective(q,get(metadataById,q.id));
 if(session-1>=m.minSession&&m.requires.every(r=>(seen.get(r.concept)||new Set()).size>=r.minExposure))next.push([q,m]);
 }
 for(const [q,m] of next){available.add(q.id);first[q.id]=session;if(!seen.has(m.concept))seen.set(m.concept,new Set());seen.get(m.concept).add(q.id);}
 }
 return {reachable:available.size,blocked:exercises.filter(q=>!available.has(q.id)).map(q=>q.id),first,limitation:'Exposition théorique illimitée par séance, sans quotas ni preuves de difficulté ; pas une simulation élève.'};
}
return {rules,patches,applyExperimental,graph,reachability,TEXAS,RED,VISAS,TEXAS_ELEMENTARY,STAYMAN_SIMPLE,STAYMAN_FOURTH};
});
