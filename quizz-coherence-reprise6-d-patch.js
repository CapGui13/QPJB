'use strict';
// Reprise 6 D: exact engine hunks from #505. No production files are changed.
// Frozen base 13966e475cf986c6f76e7faf870377fdf4ef99aa; experimental engine a9050ddb04d2cd6fd08abc4e9c2934f0aa9612e2.
// Run only on a temporary test copy. Strict anchors refuse drift.
const engineHunks=[
  [
    "    const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};\n    const curriculum=options?.coherenceM1?.schema==='QPJB_COHERENCE_M1_V1'?options.coherenceM1:null;\n    const maintenancePolicy=options?.coherenceM4?.schema==='QPJB_COORDINATOR_M4_V1'?options.coherenceM4:null;\n    let m1Changed=false,m4Changed=false;\n    const reportDecision=typeof options?.observe==='function'?options.observe:()=>{};\n    const targetByTheme=Object.fromEntries(ROADMAP.map(([t])=>[t,levelFor(state,exercises,t)]));",
    "    const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};\n    const curriculum=options?.coherenceM1?.schema==='QPJB_COHERENCE_M1_V1'?options.coherenceM1:null;\n    const maintenancePolicy=options?.coherenceM4?.schema==='QPJB_COORDINATOR_M4_V1'?options.coherenceM4:null;\n    const atomic=options?.coherenceAtomic?.schema==='QPJB_COORDINATOR_ATOMIC_V1'?options.coherenceAtomic:null;\n    const atomicSlots=[];\n    let m1Changed=false,m4Changed=false;\n    const reportDecision=typeof options?.observe==='function'?options.observe:()=>{};\n    const targetByTheme=Object.fromEntries(ROADMAP.map(([t])=>[t,levelFor(state,exercises,t)]));"
  ],
  [
    "        ?durable.chooseWithinStratum(ranked,stratum,eligible=>durableSelection.rank({candidates:eligible,selected,category,priority,forcedReason}))\n        :ranked[0].q;\n      if(m1Choice||m4Choice)reportDecision({session:s+1,actualId:q.id,m1Choice,m4Choice});\n      const m=mOf(q),cat=category||classify(q);\n      ids.add(q.id);families.add(family(q));themes[q.theme]=(themes[q.theme]||0)+1;\n      if(!novelFamily(q))repeatedFamilies++;",
    "        ?durable.chooseWithinStratum(ranked,stratum,eligible=>durableSelection.rank({candidates:eligible,selected,category,priority,forcedReason}))\n        :ranked[0].q;\n      if(m1Choice||m4Choice)reportDecision({session:s+1,actualId:q.id,m1Choice,m4Choice});\n      if(atomic&&s>=2&&s<65&&!forcedReason&&['discovery','maintenance'].includes(category)&&\n         fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){\n        const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,\n         v.difficulty,context(v),bid(v),microKey(v),axisKey(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);\n        const rows=ranked.filter(r=>fresh(r.q)&&novelFamily(r.q)&&!due(r.q)&&!bad(r.q)&&\n          r.q.theme===q.theme&&r.q.difficulty===q.difficulty).map(r=>({...r,key:key(r.q)}));\n        if(rows.length>1&&rows.some(r=>r.q===q))atomicSlots.push({index:selected.length,baseline:q,rows,category,priority});\n      }\n      const m=mOf(q),cat=category||classify(q);\n      ids.add(q.id);families.add(family(q));themes[q.theme]=(themes[q.theme]||0)+1;\n      if(!novelFamily(q))repeatedFamilies++;"
  ],
  [
    "      if(!ok)ok=choose(pool,null,'complement_catalogue');\n      if(!ok)break;\n    }\n    return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));\n  }\n\n  // V1.7 : séance complémentaire de 4 à 10 cas distincts selon la couverture",
    "      if(!ok)ok=choose(pool,null,'complement_catalogue');\n      if(!ok)break;\n    }\n    let final=selected;\n    if(atomic&&selected.length===10&&limit===10){\n      const proposed=atomic.choose({session:s+1,history:state,exercises,metadataById:prerequis.byId,selected,slots:atomicSlots});\n      if(proposed){\n        const slot=atomicSlots.find(x=>x.index===proposed.index&&x.baseline.id===proposed.oldId);\n        const row=slot?.rows.find(x=>x.q.id===proposed.id),old=selected[proposed.index]?.exercise;\n        if(row&&old===slot.baseline&&row.q!==old&&row.q.theme===old.theme&&\n           row.q.difficulty===old.difficulty&&openingPass(row.q)===openingPass(old)){\n          const trial=selected.map((v,i)=>i===proposed.index?{...v,exercise:row.q}:v);\n          if(new Set(trial.map(v=>v.exercise.id)).size===10&&new Set(trial.map(v=>family(v.exercise))).size===10&&\n             passOrderOK(logicalOrder(trial,state).map(v=>v.exercise),s)){\n            final=trial;reportDecision({session:s+1,actualId:row.q.id,atomicChoice:proposed});\n          }\n        }\n      }\n    }\n    return logicalOrder(final,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));\n  }\n\n  // V1.7 : séance complémentaire de 4 à 10 cas distincts selon la couverture"
  ]
];
function replaceUnique(source,oldText,newText,label){
 if(source.split(oldText).length!==2)throw Error('Missing or ambiguous '+label);
 return source.replace(oldText,newText);
}
function patchEngine(source){
 for(const [a,b] of engineHunks)source=replaceUnique(source,a,b,'#505 engine hunk');
 return source;
}
function patchHtml(source){
 return replaceUnique(source,'return {coherenceM2:window.QPJBCoherenceM2,coherenceFullOrder:!!m3,',
 'return {coherenceAtomic:window.QPJBReprise6D,coherenceM2:window.QPJBCoherenceM2,coherenceFullOrder:!!m3,','UI coherenceOptions');
}
// Existing rank is CommonJS; wrap it using the original feature implementation.
// No new service-worker URL: prepend isolated browser bundle to the existing engine asset.
function browserBundle({features,rank,t}){
 return '(function(){\nconst baseModule={exports:{}};\n(function(module,exports,window){\n'+features+
 '\n})(baseModule,baseModule.exports,undefined);\nconst rankModule={exports:{}};\n(function(module,exports,require){\n'+rank+
 '\n})(rankModule,rankModule.exports,function(name){if(name!=="./quizz-coherence-m4-diversite.js")throw Error(name);return baseModule.exports;});\nwindow.QPJB_M4P_A=rankModule.exports;\n})();\n'+t+'\n';
}
module.exports={patchEngine,patchHtml,browserBundle};
