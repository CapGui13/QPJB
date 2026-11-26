'use strict';
function verifyM4(transfer,auto){
 let assertions=0;const ok=(v,m)=>{assertions++;if(!v)throw Error(m)};
 const pair={a:'a',b:'b',concepts:['fit'],criterion:'Reconnaître le fit',contextDifference:'Intervention adverse',evidence:{automaticCredit:false,review:{classification:'intercontextual'},transferEvidenceEligible:true}};
 const coherent='coherent_in_catalogue_framework',reviews=[{byId:{a:{status:coherent},b:{status:coherent}}}],input={id:'a',contrasts:[pair],reviews,candidates:['b']},before=JSON.stringify(input);
 ok(transfer.links(null).length===0,'null transfer');ok(auto.filter(null).length===0,'null filter');ok(!auto.inspect(null).eligibleForIndependentProbe,'null inspect');
 ok(transfer.links({...input,purpose:'transfer'})[0]?.id==='b','eligible transfer');ok(auto.filter(input)[0]?.id==='b','eligible probe');ok(auto.filter({...input,candidates:[]}).length===0,'ineligible');ok(auto.filter({...input,contrasts:[pair,pair]}).length===1,'dedup');ok(auto.filter({...input,id:'b',candidates:['a']})[0]?.id==='a','symmetry');
 for(const field of ['a','b','concepts','criterion','contextDifference','evidence']){const broken={...pair};delete broken[field];ok(!auto.inspect({pair:broken,reviews}).eligibleForIndependentProbe,'malformed '+field);ok(auto.filter({...input,contrasts:[broken]}).length===0,'malformed filter '+field);}
 for(const status of ['hold_editorial','guided_not_independent','bounded_context','unreviewed']){const r=[{byId:{a:{status:coherent},b:{status}}}];ok(!auto.inspect({pair,reviews:r}).eligibleForIndependentProbe,'blocked '+status);}
 const reserved={pairReservations:[{a:'b',b:'a',reason:'same mechanism'}]};ok(auto.inspect({pair,reviews:[...reviews,reserved]}).reason==='pair_reservation','symmetric reservation');ok(auto.inspect({pair,reviews:[reserved,...reviews]}).reason==='pair_reservation','order invariant');
 ok(!auto.inspect({pair:{...pair,criterion:' '},reviews}).eligibleForIndependentProbe,'blank criterion');ok(!auto.inspect({pair:{...pair,concepts:['']},reviews}).eligibleForIndependentProbe,'blank concept');ok(!auto.inspect({pair:{...pair,evidence:{...pair.evidence,automaticCredit:true}},reviews}).eligibleForIndependentProbe,'automatic credit rejected');ok(auto.filter(input).every(x=>x.automaticCredit===false),'never automatic');ok(JSON.stringify(input)===before,'pure');ok(JSON.stringify(auto.filter(input))===JSON.stringify(auto.filter(input)),'deterministic');
 return {status:'PASS',assertions};
}
if(typeof module==='object'&&module.exports){module.exports=verifyM4;if(require.main===module)console.log(JSON.stringify(verifyM4(require('../quizz-durable-m4-transfert.js'),require('../quizz-durable-m4-autonomie.js'))));}else globalThis.verifyM4=verifyM4;
