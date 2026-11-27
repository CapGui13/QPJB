'use strict';
// Exact source instrumentation only; do not activate in production.
// #506: only the coordinator may apply this patch to quizz-parcours.js.
function instrument(source){
 function patch(a,b){if(source.split(a).length!==2)throw Error('reprise6-c exact anchor: '+a);source=source.replace(a,b)}
 patch('let m1Changed=false,m4Changed=false;','let m1Changed=false,m4Changed=false; const reprise6Slots=[];');
 patch('selected.push({exercise:q,kind,reason});return true;',
       'selected.push({exercise:q,kind,reason});reprise6Slots.push({category:cat,protected:!!priority||!!forcedReason});return true;');
 patch('return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));',`if(options.reprise6C&&s>=65&&limit===10&&selected.length===10){
      const flagsById=Object.fromEntries(pool.map(q=>[q.id,{due:!!due(q),bad:!!bad(q),weak:!!weak(q),novelFamily:novelFamily(q),stage:mOf(q).stage,category:classify(q),localTarget:clamp((e.localTargets.get(mOf(q).concept)||targetByTheme[q.theme]||1)+(state.difficultyAdjustment||0),1,5)}]));
      const ctx={session:s+1,history:state,exercises,metadataById:prerequis.byId,pool,flagsById,bid,context,openingPass,deck:selected.map((x,i)=>({...x,...reprise6Slots[i]}))};
      const result=options.reprise6C.exchange(ctx);
      if(result){
        const old=selected[result.index],q=pool.find(x=>x.id===result.id);
        if(!old||old.exercise.id!==result.oldId||!q||selected.some(v=>v.exercise.id===q.id||family(v.exercise)===family(q))||reprise6Slots[result.index].protected||reprise6Slots[result.index].category!==(result.mode==='recent'?'discovery':'maintenance'))throw Error('reprise6-c unsafe exchange');
        selected[result.index]={exercise:q,kind:'revision',reason:fresh(q)?'rappel_nouvelle_situation':'rappel_question'};
        reportDecision({session:s+1,reprise6C:result,actualId:q.id});
      }
    }
    return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));`);
 return source;
}
module.exports={instrument};
