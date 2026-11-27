'use strict';
// H is a proposal for the coordinator: the fixture explicitly authorizes one
// existing maintenance slot after all native explicit/theme priorities.
function instrument(source,policy='H'){
 const anchor="const order=['discovery','maintenance','weakness','transfer'];";
 if(source.split(anchor).length!==2)throw Error('Ancre H modifiée');
 return source.replace(anchor,`
    if(s>=65&&selected.length<limit&&buckets.maintenance<quotas[1]){
      const reservePool=pool.filter(q=>!ids.has(q.id)&&!families.has(family(q))&&(!openingPass(q)||passCount()<passCap)&&
        q.difficulty<=3&&mOf(q).stage<=1&&e.seen.has(mOf(q).concept)&&!concepts[mOf(q).concept]);
      const allowed=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
      const plans=__m4Reserve.plan({session:s+1,history:state,exercises,metadataById:prerequis.byId,candidates:reservePool,selected,
        category:'maintenance',objective:{allowReservedMaintenance:true,allowRepeatBeyondBudget:true,guardStableAutonomy:${policy==='I'},concepts:[...allowed],fixture:'one unused native maintenance slot after all priorities'}});
      for(const proposal of plans){
        const requested=new Set(proposal.ids),before=selected.length;
        // Exact same native choose() and priority path as S21–65: no
        // new eligibility or override of explicit error recall.
        if(choose(reservePool.filter(q=>requested.has(q.id)),'maintenance',null,true)){
          if(selected.length!==before+1)throw Error('H reservation size');
          const q=selected.at(-1).exercise;
          __m4Reserve.record({session:s+1,kind:'reservation',after:q.id,concept:mOf(q).concept,reason:proposal.reasons[q.id],category:'maintenance',priority:true,novelFamily:novelFamily(q),familyGap:oldFamily(q),conceptGap:oldConcept(q),repeatBudget,repeatedFamilies});
          break;
        }
      }
    }
    ${anchor}`);
}
module.exports={instrument};
