/* #423 — H: proposal for one explicitly authorised overdue maintenance slot.
 * Not a production quota or a prerequisite override. Coordinator must wire it.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4Reserve=api;
})(typeof window==='undefined'?null:window,function(){
 'use strict';
 const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const core=new Set(CORE),family=q=>String(q?.caseFamily||q?.id||'');
 // I: abstention when recent evidence is missing, helped or unstable.
 // This guard is fixed before the I campaign, not a simulator profile test.
 function autonomyGate(ctx){
  const events=(ctx.history?.journal||[]).filter(e=>e.mode==='parcours'&&Number.isInteger(e.session)&&e.session>=ctx.session-10&&e.session<ctx.session);
  const bySession=new Map();
  for(const e of events){
   if(bySession.has(e.session)||!Array.isArray(e.answers)||e.answers.length!==10||new Set(e.answers.map(a=>a.id)).size!==10)return {allow:false,reason:'historique non complet ou ambigu'};
   if(e.answers.some(a=>!['correct','wrong','skipped'].includes(a.result)))return {allow:false,reason:'réponse non attestée'};
   bySession.set(e.session,e.answers);
  }
  if(bySession.size!==10)return {allow:false,reason:'dix séances complètes nécessaires'};
  const halves=[0,0],help=[0,0];
  for(let s=ctx.session-10;s<ctx.session;s++){
   const h=s<ctx.session-5?0:1,answers=bySession.get(s);
   if(!answers)return {allow:false,reason:'session manquante'};
   halves[h]+=answers.filter(a=>a.result==='correct'&&a.assisted===false&&a.hadFreeError===false).length;
   help[h]+=answers.filter(a=>a.assisted===true||a.hadFreeError===true).length;
  }
  const allow=halves.every(n=>n>=30)&&help.every(n=>n<=10);
  return {allow,reason:allow?'autonomie stable sur deux fenêtres de cinq séances':'protection de la consolidation fragile',independent:halves,help};
 }
 function rank(ctx={}){
  if(!Number.isInteger(ctx.session)||ctx.session<66||ctx.history?.active||ctx.category!=='maintenance'||ctx.forcedReason||
    ctx.objective?.allowReservedMaintenance!==true||ctx.objective?.allowRepeatBeyondBudget!==true||
    !Array.isArray(ctx.objective?.concepts)||!Array.isArray(ctx.candidates)||!Array.isArray(ctx.exercises))return [];
  if(ctx.objective.guardStableAutonomy===true&&!autonomyGate(ctx).allow)return [];
  const allowed=new Set(ctx.objective.concepts),meta=ctx.metadataById||{},byId=new Map(ctx.exercises.map(q=>[q.id,q]));
  const last=new Map(),lastFamily=new Map(),lastId=new Map();
  const mark=(map,key,s)=>map.set(key,Math.max(map.get(key)||0,s));
  for(const ev of ctx.history?.journal||[]){
   if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session<1||ev.session>=ctx.session)continue;
   for(const a of ev.answers||[]){
    const q=byId.get(a.id),c=meta[a.id]?.concept;if(!q||!c)continue;
    mark(last,c,ev.session);mark(lastFamily,family(q),ev.session);mark(lastId,q.id,ev.session);
   }
  }
  for(const [id,r] of Object.entries(ctx.history?.entries||{})){
   const q=byId.get(id),c=meta[id]?.concept,s=r?.assessment?.lastSession,actual=r?.lastSession;
   if(q&&c&&Number.isInteger(s)&&s>=0&&s+1<ctx.session)mark(last,c,s+1);
   if(q&&Number.isInteger(actual)&&actual>=0&&actual+1<ctx.session){mark(lastFamily,family(q),actual+1);mark(lastId,id,actual+1);}
  }
  const selected=(ctx.selected||[]).map(v=>v?.exercise||v).filter(Boolean);
  const selectedConcepts=new Set(selected.map(q=>meta[q.id]?.concept)),selectedFamilies=new Set(selected.map(family)),selectedIds=new Set(selected.map(q=>q.id));
  const rows=[],ids=new Set();
  for(const q of ctx.candidates){
   const m=meta[q?.id],c=m?.concept;if(!q?.id||ids.has(q.id)||!byId.has(q.id))continue;ids.add(q.id);
   if(!core.has(c)||!allowed.has(c)||!last.has(c)||selectedConcepts.has(c)||selectedFamilies.has(family(q))||selectedIds.has(q.id)||
     !Number.isInteger(q.difficulty)||q.difficulty>3||m.stage>1)continue;
   const gap=ctx.session-last.get(c),fGap=lastFamily.has(family(q))?ctx.session-lastFamily.get(family(q)):Infinity;
   if(gap<18||fGap<8)continue;
   rows.push({id:q.id,delta:Math.min(32,12+Math.floor((gap-18)/2)),reason:'rappel autorisé '+c+' après '+gap+' séances ; famille '+(fGap===Infinity?'inédite':'vue il y a '+fGap+' séances'),gap,novel:fGap===Infinity,idGap:lastId.has(q.id)?ctx.session-lastId.get(q.id):Infinity});
  }
  return rows.sort((a,b)=>b.gap-a.gap||Number(b.novel)-Number(a.novel)||b.idGap-a.idGap||a.id.localeCompare(b.id)).map(({gap,novel,idGap,...r})=>r);
 }
 function plan(ctx){
  const ranked=rank(ctx),byId=new Map((ctx.candidates||[]).map(q=>[q.id,q])),groups=new Map();
  for(const r of ranked){const c=ctx.metadataById[byId.get(r.id).id].concept;if(!groups.has(c))groups.set(c,[]);groups.get(c).push(r);}
  return [...groups].map(([concept,rows])=>({concept,ids:rows.map(r=>r.id),reasons:Object.fromEntries(rows.map(r=>[r.id,r.reason]))}));
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_RESERVE_H_V1',CORE,rank,plan,autonomyGate});
});
