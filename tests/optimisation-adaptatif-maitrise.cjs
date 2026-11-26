#!/usr/bin/env node

'use strict';
const check=(x,msg)=>{if(!x)throw Error(msg)};
function run(engine){
 let assertions=0;
 const ok=(x,m)=>{check(x,m);assertions++};
 const q=(id,caseFamily,difficulty=1,theme='ouv',answer='1♣')=>({id,caseFamily,difficulty,theme,answer,auction:[],h:13});
 const a=q('a','fa'),b=q('b','fb'),a2=q('a2','fa'),higher=q('higher','fc',2),hard=q('hard','fd',4),other=q('other','fo'),other2=q('other2','fp',2);
 const exercises=[a,b,a2,higher,hard,other,other2];
 const fixture={schema:'QPJB_PREREQUIS_V1',byId:Object.fromEntries(exercises.map(x=>[x.id,{concept:x.id.startsWith('other')?'other':'target',stage:x.difficulty>=4?2:0,minSession:0,requires:[]}]))};
 const api=engine.createForTests(fixture);
 const diag=(s,k='target')=>api.adaptiveDiagnostics(s,exercises).find(x=>x.concept===k);
 function session(s,items,answers,mode='parcours'){
   s.active={ids:items.map(x=>x.id),index:0,answers:{},createdAt:s.completed,...(mode==='consolidation'?{mode,targets:items.map(()=> 'micro:ouv:mineure')}:{})};
   items.forEach((x,i)=>{const a=answers[i]||{};ok(api.record(s,x,a.result||'correct',i,null,!!a.assisted,!!a.free),'record');});
   ok(api.finish(s,exercises),'finish');
 }
 let s=api.empty();ok(diag(s).target===1,'cold floor');
 session(s,[a,b],[{},{}]);ok(diag(s).target===1,'two families in one session not mastery');
 session(s,[a],[{}]);ok(diag(s).target===1,'two sessions not promotion');
 session(s,[b],[{}]);ok(diag(s).target===2,'three sessions two families promotion');
 ok(diag(s,'other').target===1,'other concept in same theme remains at floor');
 const before=JSON.stringify(api.adaptiveDiagnostics(s,exercises));
 session(s,[higher],[{}],'consolidation');
 ok(JSON.stringify(api.adaptiveDiagnostics(s,exercises))===before,'consolidation cannot produce mastery');
 session(s,[higher],[{assisted:true}]);ok(diag(s).target===1,'help does not promote and resets target');
 session(s,[a],[{free:true}]);ok(diag(s).fragile&&diag(s).weakSessions===2,'free error and help in different sessions establish fragility');
 ok(diag(s).proofFamilies===2&&diag(s).proofSessions===3,'historical proof count is not manufactured by assisted work');
 session(s,[a],[{}]);ok(diag(s).fragile,'one recovery insufficient');
 session(s,[b],[{}]);ok(!diag(s).fragile&&diag(s).target===1,'two recovery sessions clear fragility without promotion');
 session(s,[a],[{}]);ok(diag(s).target===2,'three recovery sessions restore target');
 ok(api.adjustDifficulty(s,'decrease')&&diag(s).adjustedTarget===1,'difficulty feedback respected');
 const saved=api.load(JSON.stringify(s)),imported=api.importProgress(JSON.stringify(api.exportProgress(s,exercises,{})));
 ok(JSON.stringify(api.adaptiveDiagnostics(saved,exercises))===JSON.stringify(api.adaptiveDiagnostics(imported,exercises)),'save import diagnostics');
 s=api.empty();session(s,[a],[{}]);session(s,[a2],[{}]);session(s,[a],[{}]);ok(diag(s).target===1,'same family repeated across sessions not transfer');
 s=api.empty();session(s,[a,b],[{}, {result:'wrong'}]);session(s,[a],[{}]);session(s,[b],[{}]);ok(diag(s).target===1,'same-session error dominates promotion evidence');
 const old=api.empty();old.completed=12;old.skills.ouv={level:4,clean:2,errors:0,lastCleanSession:9,lastLevelChangeSession:8};
 old.entries.a={result:'correct',assisted:false,lastSession:8,due:11,seen:4,streak:3,family:'fa'};
 const legacy=api.load(JSON.stringify(old));
 ok(legacy.skills.ouv.level===4&&legacy.entries.a.seen===4&&legacy.completed===12,'legacy data retained');
 ok(diag(legacy).proofSessions===0&&diag(legacy).target===1,'legacy history not invented');
 ok(!api.eligibility(hard,legacy,exercises).eligible,'legacy level cannot bypass prerequisites');
 legacy.active={ids:[a.id,b.id],index:1,answers:{0:{result:'correct',choice:null,assisted:false,hadFreeError:false}},createdAt:12};
 const restored=api.load(JSON.stringify(legacy));ok(JSON.stringify(api.start(restored,exercises).map(q=>q.id))===JSON.stringify([a.id,b.id]),'started legacy deck preserved');
 ok(restored.active.answers[0].result==='correct','started legacy response preserved');
 return assertions;
}
module.exports={run};
if(require.main===module)console.log('PASS '+run(require('../quizz-parcours.js'))+' assertions');
