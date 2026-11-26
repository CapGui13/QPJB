'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const base='f8ae2120eb893c68b4cac315b7901ece69806b87',old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const parse=h=>JSON.parse(h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const oldQs=parse(old('quizz.html')),qs=parse(read('quizz.html')),oldMeta=JSON.parse(old('quizz-prerequis.js').match(/return (\{"schema":[\s\S]*\});\}\);/)[1]);
const M=require('../quizz-prerequis.js'),C=require('../quizz-apprentissage-concepts.js'),P=require('../quizz-professeur.js'),D=require('../quizz-diagnostic-erreurs.js');
const manifest=require('../audits/professeur-numerique-20261126/integration/publication.json'),adds=require('../audits/professeur-numerique-20261126/m1/additions.json');
const by=new Map(qs.map(q=>[q.id,q])),patch=new Map(manifest.patches.map(p=>[p.id,p]));
assert.equal(qs.length,1915);assert.equal(by.size,1915);assert.equal(Object.keys(M.byId).length,1915);assert.equal(Object.keys(C.byId).length,1915);assert.equal(Object.keys(C.concepts).length,99);
const selectionAnchor="      const priorities=sessionPlan.priorityThemes",selectionPatch="      // Réserver au plus une découverte éligible et un rappel fondamental\n      // ancien, après le rappel explicite des erreurs.\n      if(s>=20&&s<65){\n        const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);\n        if(selected.length<limit)choose(pool.filter(q=>core.has(mOf(q).concept)&&e.seen.has(mOf(q).concept)&&oldConcept(q)>=8&&!concepts[mOf(q).concept]),'maintenance',null,true);\n        if(selected.length<limit)choose(pool.filter(q=>!e.seen.has(mOf(q).concept)&&!concepts[mOf(q).concept]),'discovery',null,true);\n      }\n      const priorities=sessionPlan.priorityThemes";
assert.equal(old('quizz-parcours.js').split(selectionAnchor).length,2,'Point de raccord unique');
assert.equal(read('quizz-parcours.js'),old('quizz-parcours.js').replace(selectionAnchor,selectionPatch),'Seuls les deux créneaux pédagogiques changent ; notation, prérequis, reprise et reste du moteur inchangés');
for(const q of oldQs){const p=patch.get(q.id);assert.deepEqual(by.get(q.id),p?{...q,choices:p.newChoices}:q,q.id);assert.deepEqual(M.byId[q.id],oldMeta.byId[q.id],q.id+' prerequis')}
for(const a of adds)assert.deepEqual(by.get(a.exercise.id),a.exercise);
const tally={hypothesis:0,unknown:0,correct:0},target={total:0,feedback:0};
for(const q of qs){assert.equal(C.classify(q.id).concept,M.byId[q.id].concept);for(const choice of q.choices){
 const d=P.diagnose({exercise:q,choice,assisted:false,hadFreeError:false});tally[d.status]++;
 assert.equal(d.status==='correct',choice===q.answer,q.id+' '+choice);
 const r=P.feedback({exercise:q,answer:{result:choice===q.answer?'correct':'wrong',choice,assisted:false,hadFreeError:false}});
 assert.equal(r.canonical,q.explain);if(r.kind==='targeted')target.total++;if(r.feedback)target.feedback++;
 if(choice===q.answer){assert.equal(r.feedback,null);assert.equal(r.checkNext,null)}
}}
assert.deepEqual(tally,{hypothesis:5416,unknown:329,correct:1915});assert.deepEqual(target,{total:140,feedback:119});
for(const p of manifest.holds){const q=by.get(p.id);assert.equal(P.diagnose({exercise:q,choice:p.choice,assisted:false,hadFreeError:false}).status,'unknown',p.id+' '+p.choice)}
for(const p of manifest.patches){const q=by.get(p.id),removed=p.oldChoices.find(c=>!p.newChoices.includes(c));assert.deepEqual(P.displayChoices(q,{choice:removed,assisted:true}),p.oldChoices);assert.deepEqual(P.displayChoices(q,null),q.choices);assert.equal(P.diagnose({exercise:{...q,choices:[...q.choices].reverse()},choice:q.answer}).status,'unknown');}
const q=by.get('SEF-001-1'),answer={result:'correct',choice:q.answer,assisted:true,hadFreeError:true,firstGuess:'2SA'};
const targeted=P.feedback({exercise:q,answer});assert.equal(targeted.kind,'targeted');assert.equal(targeted.canonical,q.explain);assert.match(targeted.feedback,/première enchère/);
assert.equal(P.feedback({exercise:q,answer:{result:'skipped'}}).checkNext,null);
assert.deepEqual(P.learningReport({completed:0,journal:[]},qs),{objectives:[],axes:[]});
const q2=by.get('SEF-005-1'),wrong=(q,choice)=>({id:q.id,result:'wrong',choice,assisted:false,hadFreeError:false});
const history={completed:2,entries:{},journal:[{mode:'parcours',session:1,answers:[wrong(q,'2SA')]},{mode:'parcours',session:2,answers:[wrong(q2,'1SA')]}]};
const before=JSON.stringify(history),report=P.learningReport(history,qs);assert.equal(JSON.stringify(history),before);assert.ok(report.objectives.length);assert.equal(report.axes[0].category,'force');assert.equal(report.axes[0].families,2);
for(const p of manifest.contextContrasts){const a=by.get(p.a),b=by.get(p.b);const proof=(q,session)=>({mode:'parcours',session,answers:[{id:q.id,result:'correct',choice:q.answer,assisted:false,hadFreeError:false}]});const state={completed:2,journal:[proof(a,1),proof(b,2)]};
 for(const k of p.concepts)assert.equal(C.recommend({history:state,concept:k}).concepts[k].contrasted,true,p.a+' '+k);
 const same={completed:1,journal:[proof(a,1),proof(b,1)]};for(const k of p.concepts)assert.equal(C.recommend({history:same,concept:k}).concepts[k].contrasted,false);
}
for(const name of ['quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js','quizz-professeur.js']){assert.ok(read('quizz.html').includes(name+'?v=1'));assert.ok(read('service-worker.js').includes(name+'?v=1'));assert.ok(read('scripts/build_public_site.py').includes('"'+name+'"'))}
console.log(JSON.stringify({catalogue:qs.length,concepts:99,tally,target,patches:patch.size,holds:manifest.holds.length,report}));
