'use strict';
function instrument(source,policy){
 if(!['L','M','N','O','P'].includes(policy))throw Error('policy');
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const q='const q=durableSelection&&!explicitRecall&&!priority&&!forcedReason';
 const end='const m=mOf(q),cat=category||classify(q);';
 const last='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 const reserve="if(selected.length<limit)choose(pool.filter(q=>core.has(mOf(q).concept)&&e.seen.has(mOf(q).concept)&&oldConcept(q)>=8&&!concepts[mOf(q).concept]),'maintenance',null,true);";
 for(const a of [start,q,end,last,reserve])if(source.split(a).length!==2)throw Error('M4-B anchor '+a);
 const shared='session:s+1,history:state,exercises,metadataById:prerequis.byId,bad,due,novelFamily,selected';
 let out=source.replace(start,start+'\n    const __b=require("./quizz-coherence-m4p-b-policy.js"),__bSlots=[];let __bCore=false;')
 .replace(q,q.replace('const q','let q')).replace(reserve,'__bCore=true;'+reserve+'__bCore=false;');
 if(policy==='L')out=out.replace(end,
 "if(s>=20&&!explicitRecall&&!forcedReason&&category==='maintenance'&&(__bCore||!priority)){"+
 "const p=__b.chooseRank({"+shared+",category,candidates:ranked.map(r=>r.q),nativeCoreReservation:__bCore,discretionary:!priority},ranked,q);"+
 "if(p.q!==q){__b.record({session:s+1,policy:'L',kind:'rank',before:q.id,after:p.q.id,category,priority,reason:p.signal.reason,target:p.signal.proof,displaced:p.displaced,budget:repeatBudget,repeatedFamilies,scoreBefore:p.scoreBefore,scoreAfter:p.scoreAfter});q=p.q;}}"+end);
 if(policy==='M')out=out.replace(end,
 "if(s>=65&&!explicitRecall&&!priority&&!forcedReason&&category==='maintenance'&&classify(q)==='maintenance'&&!e.weakConcept[mOf(q).concept])__bSlots.push({index:selected.length,baseline:q});"+end).replace(last,
 "const p=__b.replace({"+shared+",pool,classify,bid,context,openingPass,fresh},selected,__bSlots);"+
 "if(p.q)__b.record({session:s+1,policy:'M',kind:'reservation',before:p.old.id,after:p.q.id,category:'maintenance',priority:false,reason:'compression rappel redondant de famille répétée',target:p.target,displaced:p.displaced,budget:repeatBudget,repeatBefore:p.repeatBefore,repeatAfter:p.repeatAfter});"+
 "return logicalOrder(p.deck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));");
 if(policy==='N')out=out.replace(end,
 "if(s>=65&&!explicitRecall&&!priority&&!forcedReason&&['maintenance','discovery'].includes(category)&&!e.weakConcept[mOf(q).concept])__bSlots.push({index:selected.length,baseline:q,category});"+end).replace(last,
 "const __n=require('./quizz-coherence-m4p-b-window.js');const p=__n.replace({"+shared+",pool,classify,bid,context,openingPass,fresh,weak,oldTheme,passCap,localTarget:q=>clamp((e.localTargets.get(mOf(q).concept)||targetByTheme[q.theme]||1)+(state.difficultyAdjustment||0),1,5),objective:{allowRepeatBeyondBudget:true,allowNoveltyDisplacement:true,fixture:'M1-only'}},selected,__bSlots);"+
 "if(p.q)__n.record({session:s+1,policy:'N',kind:'window-exception',before:p.old.id,after:p.q.id,category:p.category,priority:false,reason:'arbitrage composition M1: prévision dette 7 séances, plafond glissant 4 séances',target:p.target,displaced:p.displaced,budget:repeatBudget,repeatBefore:p.repeatBefore,repeatAfter:p.repeatAfter,noveltyCost:p.noveltyCost,forecastGain:p.forecastGain,forecastCost:p.forecastCost});"+
 "return logicalOrder(p.deck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));");
 if(policy==='O')out=out.replace(end,
 "if(s>=65&&!explicitRecall&&!forcedReason&&['maintenance','discovery'].includes(category)&&(!priority||category==='maintenance')&&!e.weakConcept[mOf(q).concept])__bSlots.push({index:selected.length,baseline:q,category,priority});"+end).replace(last,
 "const __o=require('./quizz-coherence-m4p-b-rotation.js');const p=__o.replace({"+shared+",pool,classify,bid,context,openingPass,fresh,weak,passCap,localTarget:q=>clamp((e.localTargets.get(mOf(q).concept)||targetByTheme[q.theme]||1)+(state.difficultyAdjustment||0),1,5),objective:{allowPositiveRepeatRotation:true,fixture:'M1-only'}},selected,__bSlots);"+
 "if(p.q)__o.record({session:s+1,policy:'O',kind:'positive-repeat-rotation',before:p.old.id,after:p.q.id,category:p.category,priority:p.priority,reason:'arbitrage composition M1: rotation répétée, thème prioritaire conservé',target:p.target,displaced:p.displaced,budget:repeatBudget,repeatBefore:p.repeatBefore,repeatAfter:p.repeatAfter,noveltyCost:p.noveltyCost,forecastGain:p.forecastGain,forecastCost:p.forecastCost});"+
 "return logicalOrder(p.deck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));");
 if(policy==='P')out=out.replace(end,
 "if(s>=65&&!explicitRecall&&(!forcedReason||forcedReason==='complement_catalogue')&&['maintenance','discovery'].includes(category||classify(q))&&(!priority||category==='maintenance')&&!e.weakConcept[mOf(q).concept])__bSlots.push({index:selected.length,baseline:q,category:category||classify(q),priority});"+end).replace(last,
 "const __p=require('./quizz-coherence-m4p-b-saturated.js');const p=__p.replace({"+shared+",pool,classify,bid,context,openingPass,fresh,weak,passCap,localTarget:q=>clamp((e.localTargets.get(mOf(q).concept)||targetByTheme[q.theme]||1)+(state.difficultyAdjustment||0),1,5),objective:{allowExhaustedCatalogueRecall:true,fixture:'M1-only'}},selected,__bSlots);"+
 "if(p.q)__p.record({session:s+1,policy:'P',kind:'saturated-catalogue-rotation',before:p.old.id,after:p.q.id,category:p.category,priority:p.priority,reason:p.saturationGuard,saturatedFamilies:p.saturatedFamilies,target:p.target,displaced:p.displaced,budget:repeatBudget,repeatBefore:p.repeatBefore,repeatAfter:p.repeatAfter,noveltyCost:p.noveltyCost,forecastGain:p.forecastGain,forecastCost:p.forecastCost});"+
 "return logicalOrder(p.deck,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));");
 return out;
}
module.exports={instrument};
