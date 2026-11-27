'use strict';
// Capture uniquement des alternatives natives de même strate, puis remplacement
// atomique d'un seul slot avant logicalOrder. Aucun recalcul de quotas ni de tri.
function finishAtomic(selected,slots,common,pick){
 if(!Array.isArray(selected)||selected.length!==10||new Set(selected.map(v=>v.exercise.id)).size!==10)return selected;
 const family=q=>String(q.caseFamily||q.id);
 if(new Set(selected.map(v=>family(v.exercise))).size!==10)return selected;
 for(const slot of slots){
  const i=slot.index,old=selected[i]?.exercise;
  if(old!==slot.baseline||selected[i].kind!=='nouveau'||selected[i].reason!=='nouveau_qcm')continue;
  const rest=selected.filter((_,j)=>i!==j),ids=new Set(rest.map(v=>v.exercise.id)),families=new Set(rest.map(v=>family(v.exercise)));
  const rows=slot.rows.filter(r=>r.q===old||(!ids.has(r.q.id)&&!families.has(family(r.q))));
  const base=rows.find(r=>r.q===old);
  if(!base||rows.length<2)continue;
  const q=pick({...common,selected:rest,category:'discovery',priority:false,forcedReason:null},rows,old);
  if(q===old||!rows.some(r=>r.q===q&&r.v===base.v))continue;
  // Conserver les motifs et le reste du deck. Aucun nouvel appel à choose().
  return selected.map((v,j)=>j===i?{...v,exercise:q}:v);
 }
 return selected;
}
function instrument(source){
 const selectStart='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [selectStart,anchor,end])if(source.split(a).length!==2)throw Error('Ancre E modifiée : revue obligatoire');
 return source.replace(selectStart,selectStart+'\n    const __m4Slots=[];').replace(anchor,`
      if(s>=2&&s<5&&!explicitRecall&&!priority&&!forcedReason&&category==='discovery'&&fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){
        const winning=ranked.find(r=>r.q===q);
        const tieType=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,v.difficulty,context(v),bid(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);
        const rows=ranked.filter(r=>fresh(r.q)&&novelFamily(r.q)&&!due(r.q)&&!bad(r.q)&&tieType(r.q)===tieType(q)&&r.v===winning.v);
        if(rows.length>1)__m4Slots.push({index:selected.length,baseline:q,rows});
      }
      ${anchor}`).replace(end,`
      const __m4Final=(${finishAtomic.toString()})(selected,__m4Slots,{session:s+1,history:state,exercises,metadataById:prerequis.byId},__m4Pick);
      return logicalOrder(__m4Final,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
module.exports={finishAtomic,instrument};
