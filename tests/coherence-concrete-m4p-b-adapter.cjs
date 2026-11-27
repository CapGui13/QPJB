'use strict';
function instrument(source,policy){
 if(!['L','M'].includes(policy))throw Error('policy');
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
 return out;
}
module.exports={instrument};
