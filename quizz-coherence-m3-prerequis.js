/* M3 #422 — propositions isolées, aucune activation en production. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJB_COHERENCE_M3=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const TEXAS=['SEF-039-2','SEF-039-1','SEF-040-2','SEF-N084-1','SEF-N087-2','V2-M2-018'];
const RED=['SEF-042-2','SEF-043-1','SEF-043-3','SEF-047-1','SEF-N110-1','SEF-N111-1','SEF-N112-2','SEF-N113-1'];
const VISAS=['SEF-028-2','SEF-028-1','SEF-N048-3','SEF-N048-1','SEF-N053-2','SEF-N053-1','SEF-C-006'];
const clone=x=>JSON.parse(JSON.stringify(x));
const get=(m,id)=>m instanceof Map?m.get(id):m&&m[id];
const idOf=x=>typeof x==='string'?x:x&&x.id;
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
 return {id,old:clone(old),new:next,status:'PROPOSAL',proof:texas?'Texas majeur avec force de manche : introduire auparavant le transfert élémentaire sur main faible. Exposition seulement, jamais réussite obligatoire.':'Redemande de majeure quatrième avec main régulière, pas le bicolore 5-4 économique ou cher ; ne pas créditer cette notion par assimilation.',accord:'Aucun changement de réponse SEF ; validation du coordinateur requise.',question:{auction:q.auction,answer:q.answer,explain:q.explain}};
 });
}
function applyExperimental(metadataById,exercises,group='texas'){
 if(!['texas','red','both','none'].includes(group))throw Error('Unknown group');
 const out=clone(metadataById);
 for(const p of patches(metadataById,exercises))if(group==='both'||(group==='texas'&&TEXAS.includes(p.id))||(group==='red'&&RED.includes(p.id)))out[p.id]=p.new;
 return out;
}
function effective(q,m){
 if(!m)return m;
 if(VISAS.includes(q.id)&&m.concept==='majeur.soutien'&&m.minSession===1&&q.difficulty<=2)
 return {...m,stage:0,requires:m.requires.filter(r=>r.concept!=='majeur.soutien')};
 return m;
}
function evidence(ctx){
 const by=new Map((ctx.exercises||[]).map(q=>[q.id,q])), out=new Map();
 function add(id,session,proof){
 const q=by.get(id),m=q&&get(ctx.metadataById,id);if(!m)return;
 if(!out.has(m.concept))out.set(m.concept,{ids:new Set(),families:new Set(),sessions:new Set()});
 const a=out.get(m.concept);a.ids.add(id);
 if(proof){a.families.add(q.family||q.caseFamily||q.id);a.sessions.add(session);}
 }
 const history=ctx.history||{};
 const completed=Number.isInteger(history.completed)?history.completed:ctx.session-1;
 for(const j of (Array.isArray(history.journal)?history.journal:[])){
 if(j.mode!=='parcours'||!Number.isInteger(j.session)||j.session>completed||j.session>=ctx.session)continue;
 for(const a of j.answers||[]){if(a&&a.id)add(a.id,j.session,a.result==='correct'&&a.assisted===false&&a.hadFreeError===false);}
 }
 for(const [id,entry] of Object.entries(history.entries||{})){
 const s=entry&&entry.assessment&&entry.assessment.lastSession;if(Number.isInteger(s)&&s<completed)add(id,s,false);
 }
 return out;
}
function rules(ctx){
 const ev=evidence(ctx);
 return (ctx.candidates||[]).map(c=>{
 const id=idOf(c),q=(ctx.exercises||[]).find(x=>x.id===id)||c,m=effective(q,get(ctx.metadataById,id));
 if(!m)return {id,status:'unknown',requirements:[],advisory:true};
 const requirements=(m.requires||[]).map(r=>{
 const a=ev.get(r.concept),exposure=a?a.ids.size:0,proofFamilies=a?a.families.size:0,proofSessions=a?a.sessions.size:0;
 return {...r,exposure,proofFamilies,proofSessions,status:exposure<r.minExposure?'missing-exposure':proofFamilies===0?'exposed-without-autonomous-proof':'exposed-with-autonomous-proof'};
 });
 return {id,concept:m.concept,stage:m.stage,minSession:m.minSession,status:ctx.session-1<m.minSession?'calendar':requirements.some(r=>r.status==='missing-exposure')?'missing-exposure':'requirements-observed',requirements,advisory:true};
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
 return {concepts:Object.fromEntries(concepts),arcs:[...arcs.values()],rows};
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
return {rules,patches,applyExperimental,graph,reachability,TEXAS,RED,VISAS};
});
