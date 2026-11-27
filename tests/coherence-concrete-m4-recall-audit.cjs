'use strict';
// Recompute concept debt from actual ordered rows; terminal absence is explicit.
// No credit for exposure; proof requires independent correct answers in
// distinct families and distinct sessions. No aggregate hides regressions.
const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const failure=m=>{throw Error(m)};
function analyze(trace){
 const sessions=trace?.sessions;
 if(!Array.isArray(sessions)||!sessions.length||sessions.length!==trace.horizon)failure('trace incomplète');
 const states=Object.fromEntries(CORE.map(c=>[c,{last:0,first:0,debt:0,exposures:0,after65:0,maxGap:0,miss18:0}]));
 const allProof=new Map(),seenFamilies=new Map(),seenIds=new Set(),checkpoints=[],reservations=trace.changes?.filter(x=>x.kind==='reservation')||[];
 const perSession=new Map(),duplicateConceptReservations=[];
 for(const r of reservations){
  if(!Number.isInteger(r.session)||r.session<66||r.session>trace.horizon||perSession.has(r.session))failure('réservation multiple ou hors horizon');
  perSession.set(r.session,r);
 }
 for(let i=0;i<sessions.length;i++){
  const session=i+1,s=sessions[i],rows=s.rows;
  if(s.session!==session||!Array.isArray(rows)||rows.length!==10||new Set(rows.map(x=>x.id)).size!==10||new Set(rows.map(x=>x.family)).size!==10||rows.some(x=>x.eligible!==true||!x.concept||!x.family))failure('structure S'+session);
  const reservation=perSession.get(session);
  if(reservation){
   const row=rows.find(x=>x.id===reservation.after),state=states[reservation.concept];
   if(!row||row.concept!==reservation.concept||!state?.last||row.level>3||row.stage>1||row.role!=='revision'||!['rappel_nouvelle_situation','rappel_question'].includes(row.reason))failure('réservation non attestée S'+session);
   const gap=session-state.last,lastFam=seenFamilies.get(row.family),famGap=lastFam?session-lastFam:Infinity;
   if(gap<18||gap!==reservation.conceptGap||famGap<8||Boolean(reservation.novelFamily)!==!lastFam||(lastFam&&famGap!==reservation.familyGap))failure('délai de rappel incohérent S'+session);
   if(rows.filter(x=>x.concept===row.concept).length!==1)duplicateConceptReservations.push({session,concept:row.concept,id:row.id});
   if(trace.policy==='I'){
    const windows=[sessions.slice(i-10,i-5),sessions.slice(i-5,i)];
    if(windows.some(w=>w.length!==5||w.flatMap(x=>x.rows).filter(x=>clean(x.response)).length<30||w.flatMap(x=>x.rows).filter(x=>x.response?.assisted===true||x.response?.hadFreeError===true).length>10))failure('garde autonomie I S'+session);
   }
  }
  for(const row of rows){
   const c=states[row.concept];
   if(c){if(!c.first)c.first=session;if(c.last!==session){if(c.last)c.maxGap=Math.max(c.maxGap,session-c.last);c.last=session;c.exposures++;if(session>65)c.after65++;}}
   if(clean(row.response)){
    const p=allProof.get(row.concept)||{families:new Set(),sessions:new Set()};
    p.families.add(row.family);p.sessions.add(session);allProof.set(row.concept,p);
   }
   seenFamilies.set(row.family,session);seenIds.add(row.id);
  }
  for(const c of Object.values(states))if(c.last){const gap=session-c.last;c.debt+=Math.max(0,gap-6);if(gap>=18)c.miss18++;}
  const expected=trace.checkpoints?.find(x=>x.session===session);
  if(expected){
   const debt=Object.values(states).reduce((n,c)=>n+c.debt,0);
   const proof=[...allProof.values()].filter(p=>p.families.size>=2&&p.sessions.size>=2).length;
   if(debt!==expected.coreDebt||proof!==expected.proof||seenFamilies.size!==expected.families||seenIds.size!==expected.ids)failure('checkpoint contredit par les lignes S'+session);
   checkpoints.push({session,debt,proof,families:seenFamilies.size,ids:seenIds.size,concepts:Object.fromEntries(CORE.map(k=>[k,{...states[k],terminalGap:states[k].last?session-states[k].last:null}]))});
  }
 }
 if(checkpoints.at(-1)?.session!==trace.horizon)failure('checkpoint final absent');
 return {profile:trace.profile,seed:trace.seed,policy:trace.policy,horizon:trace.horizon,reservations:reservations.length,duplicateConceptReservations,checkpoints};
}
function compare(pair){
 const a=analyze(pair.before),b=analyze(pair.after);
 if(a.profile!==b.profile||a.seed!==b.seed||a.horizon!==b.horizon||a.checkpoints.length!==b.checkpoints.length)failure('trajectoires non appariées');
 const regressions=[],metrics={nearPairs:1,decisionPairs:1,nearRecent:1,coreDebt:1,themeDebt:1,hard:1,proof:-1,concepts:-1,families:-1,independent:-1};
 for(let i=0;i<pair.before.checkpoints.length;i++){
  const x=pair.before.checkpoints[i],y=pair.after.checkpoints[i];if(x.session!==y.session)failure('horizon non apparié');
  for(const [k,sign] of Object.entries(metrics)){if(!Number.isFinite(x[k])||!Number.isFinite(y[k]))failure('métrique manquante '+k);if(sign*(y[k]-x[k])>0)regressions.push({session:x.session,key:k,before:x[k],after:y[k]});}
 }
 for(const r of b.duplicateConceptReservations)regressions.push({session:r.session,key:'duplicateConceptReservation',concept:r.concept,id:r.id,before:0,after:1});
 const debtBefore=a.checkpoints.at(-1).debt,debtAfter=b.checkpoints.at(-1).debt;
 return {profile:a.profile,seed:a.seed,policy:b.policy,horizon:a.horizon,changes:pair.after.changes?.length||0,reservations:b.reservations,debtBefore,debtAfter,regressions,perConceptBefore:a.checkpoints.at(-1).concepts,perConceptAfter:b.checkpoints.at(-1).concepts,verdict:debtAfter<debtBefore&&!regressions.length?'CANDIDAT_A_REVOIR':'HOLD'};
}
module.exports={CORE,analyze,compare};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),dir=process.argv[2];if(!dir)throw Error('dossier de traces');
 const rows=fs.readdirSync(dir).filter(x=>x.endsWith('.json')).map(x=>compare(JSON.parse(fs.readFileSync(path.join(dir,x),'utf8'))));
 if(rows.length!==18||new Set(rows.map(r=>r.profile+'/'+r.seed)).size!==18)throw Error('matrice incomplète');
 console.log(JSON.stringify({rows,totalDebt:[rows.reduce((n,x)=>n+x.debtBefore,0),rows.reduce((n,x)=>n+x.debtAfter,0)],reservations:rows.reduce((n,x)=>n+x.reservations,0),regressions:rows.flatMap(x=>x.regressions.map(r=>({profile:x.profile,seed:x.seed,...r})))},null,2));
}
