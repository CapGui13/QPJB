'use strict';
// A separate native-slot fixture. F: ranked only. G: old families allowed
// exclusively within the existing non-priority repeat budget. Never production.
function finishRecall(selected,slots,common,pick){
 if(!Array.isArray(selected)||selected.length!==10)return selected;
 const family=q=>String(q.caseFamily||q.id), meta=common.metadataById;
 const ids=new Set(selected.map(v=>v.exercise.id)),fam=new Set(selected.map(v=>family(v.exercise)));
 if(ids.size!==10||fam.size!==10)return selected;
 let best=null;
 for(const slot of slots){
  const i=slot.index,old=selected[i]?.exercise;
  if(old!==slot.baseline||selected[i].reason!=='rappel_nouvelle_situation'&&selected[i].reason!=='rappel_question')continue;
  const rest=selected.filter((_,j)=>i!==j),usedIds=new Set(rest.map(v=>v.exercise.id)),usedFam=new Set(rest.map(v=>family(v.exercise)));
  const base=slot.rows.find(r=>r.q===old);if(!base)continue;
  const restRepeats=rest.filter(v=>!common.novelFamily(v.exercise)).length;
  const restPass=rest.filter(v=>common.openingPass(v.exercise)).length;
  const rows=slot.rows.filter(r=>r.q===old||(!usedIds.has(r.q.id)&&!usedFam.has(family(r.q))&&
   restPass+(common.openingPass(r.q)?1:0)<=common.passCap&&
   (common.novelFamily(r.q)===common.novelFamily(old)||common.allowRepeat&&restRepeats+(common.novelFamily(r.q)?0:1)<=common.repeatBudget)));
  if(rows.length<2)continue;
  const objective={allowRecall:true,allowRepeat:common.allowRepeat||!common.novelFamily(old),concepts:rows.filter(r=>r.q!==old).map(r=>meta[r.q.id]?.concept),fixture:'native maintenance slot only'};
  // Pick uses bounded delta. In G only a newly authorized old-family candidate
  // competes after explicitly removing the native novelty bonus from the novel
  // winner; record the raw historical score separately.
  const candidate=pick({...common,selected:rest,category:'maintenance',objective,priority:false,forcedReason:null,preview:true},rows,old);
  if(candidate===old)continue;
  const row=rows.find(r=>r.q===candidate);
  if(!row||!Number.isFinite(row.v)||!Number.isFinite(base.v)||row.v<base.v-31)continue;
  const gain=(row.v-base.v)+(row.signal||0);
  if(!best||gain>best.gain)best={i,old,row,base,rest,rows,objective,gain};
 }
 if(!best)return selected;
 const {i,old,row,rest,rows,objective}=best;
 const q=pick({...common,selected:rest,category:'maintenance',objective,priority:false,forcedReason:null},rows,old);
 if(q!==row.q)return selected;
 return selected.map((v,j)=>j===i?{...v,exercise:q,kind:'revision',reason:common.isFresh(q)?'rappel_nouvelle_situation':'rappel_question'}:v);
}
function instrument(source,policy){
 const selectStart='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const beforeNovel='const unseen=candidates.filter(novelFamily);';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [selectStart,beforeNovel,anchor,end])if(source.split(a).length!==2)throw Error('Ancre F/G modifiée : revue obligatoire');
 return source.replace(selectStart,selectStart+'\n    const __m4RecallSlots=[];').replace(beforeNovel,`
      const __m4PreNovel=candidates.slice();
      ${beforeNovel}`).replace(anchor,`
      if(s>=5&&!explicitRecall&&!priority&&!forcedReason&&category==='maintenance'&&classify(q)==='maintenance'&&!bad(q)){
       const winning=ranked.find(r=>r.q===q),core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
       const normal=ranked.filter(({q:v,v:score})=>v===q||(v.theme===q.theme&&v.difficulty===q.difficulty&&classify(v)==='maintenance'&&core.has(mOf(v).concept)&&e.seen.has(mOf(v).concept)&&!bad(v)&&oldConcept(v)>=12&&novelFamily(v)===novelFamily(q)&&score>=winning.v-31));
       const rows=normal.map(r=>({...r,rawScore:r.v}));
       ${policy==='G'?`if(novelFamily(q)&&repeatedFamilies<repeatBudget){
         for(const v of __m4PreNovel){
          if(rows.some(r=>r.q===v)||novelFamily(v)||v.theme!==q.theme||v.difficulty!==q.difficulty||
             !distinct(v)||classify(v)!=='maintenance'||!core.has(mOf(v).concept)||!e.seen.has(mOf(v).concept)||bad(v)||oldConcept(v)<12||oldFamily(v)<8)continue;
          if((themes[v.theme]||0)>=4&&balanced.length)continue;
          const raw=score(v,category)+(deltas.get(v.id)||0);
          // The sole relaxation is the native +250 novelty term, not level,
          // prerequisites, pass cap or repeat budget. Fixture, not integration.
          const adjusted=raw+250;
          if(adjusted>=winning.v-31&&adjusted<=winning.v)rows.push({q:v,v:adjusted,rawScore:raw,noveltyAdjustment:250});
         }
       }`:''}
       if(rows.length>1)__m4RecallSlots.push({index:selected.length,baseline:q,rows});
      }
      ${anchor}`).replace(end,`
      const __m4Final=(${finishRecall.toString()})(selected,__m4RecallSlots,{session:s+1,history:state,exercises,metadataById:prerequis.byId,
        novelFamily,openingPass,passCap,repeatBudget,isFresh:fresh,allowRepeat:${policy==='G'}},__m4Pick);
      return logicalOrder(__m4Final,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
}
module.exports={finishRecall,instrument};
