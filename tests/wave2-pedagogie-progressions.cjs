'use strict';
// Garde-fou documentaire M1. Commande: node tests/wave2-pedagogie-progressions.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const hashGit=(s)=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
const html=read('quizz.html');
assert.equal(hashGit(html),'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7','Blob catalogue différent de la base figée');
const m=html.match(/<script id="training-data" type="application\\/json">([\\s\\S]*?)<\\/script>/);
assert(m,'Catalogue embarqué absent');
const data=JSON.parse(m[1]);
assert.equal(data.exercises.length,1523);assert.equal(data.themes.length,22);
assert.equal(new Set(data.exercises.map(x=>x.id)).size,1523);
const p1=JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json')).proposals;
const p2=JSON.parse(read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json')).proposals;
const excluded=new Set([...p1,...p2].map(x=>x.id));
assert.equal(p1.length+p2.length,36);assert.equal(excluded.size,36);
const specs=[
{id:'decouverte',themes:['ouv','majeur','mineur','sa'],targets:[1,1,1,2,2],min:1,max:2},
{id:'consolidation',themes:['red','second','stayman','apres_fit','intervenir','contre','reponse_inter','apres_inter','barrage','reveil'],targets:[2,2,3,3],min:2,max:3},
{id:'approfondissement',themes:['roudi','drury','fortes','forcing','multilandy','rubensohl','michaels','chelem'],targets:[3,3,4,5],min:3,max:5}
];
function build(exercises,exclusions){
 const ids=new Set(),families=new Set(),profiles=[];
 const sig=x=>(x.auction||[]).join('>')+'|'+x.answer;
 for(const spec of specs){
 const tracking=Object.fromEntries(spec.themes.map(th=>[th,{sigs:new Set(),answers:new Set(),auctions:new Set()}]));
 const phases=[];
 for(let i=0;i<spec.targets.length;i++){
 const target=spec.targets[i],cases=[];
 for(const theme of spec.themes){
 const t=tracking[theme];
 const pool=exercises.filter(x=>x.theme===theme&&!exclusions.has(x.id)&&!ids.has(x.id)&&!families.has(x.caseFamily)&&!t.sigs.has(sig(x))&&x.difficulty>=spec.min&&x.difficulty<=spec.max);
 const rank=x=>x.difficulty===target?0:Math.abs(x.difficulty-target)+2;
 const diversity=x=>Number(t.answers.has(x.answer))+Number(t.auctions.has((x.auction||[]).join('>')));
 pool.sort((a,b)=>rank(a)-rank(b)||diversity(a)-diversity(b)||a.id.localeCompare(b.id));
 assert(pool.length,'Réservoir épuisé : '+spec.id+'/'+theme+'/'+(i+1));
 const x=pool[0]; ids.add(x.id); families.add(x.caseFamily);
 t.sigs.add(sig(x));t.answers.add(x.answer);t.auctions.add((x.auction||[]).join('>'));
 cases.push({theme,id:x.id,difficulty:x.difficulty});
 } phases.push({phase:i+1,targetLevel:target,cases});
 }profiles.push({id:spec.id,phaseCount:spec.targets.length,themeOrder:spec.themes,phases});
 }
 return {schema:'QPJB_WAVE2_M1_PROGRESSIONS_V1_HOLD',catalogueBlob:'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7',sourceCommit:'2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a',excludedProposalCount:36,status:'HOLD_DOCUMENTAIRE_NON_DEPLOYABLE',profiles};
}
const manifest=JSON.parse(read('audits/wave2/pedagogie/PROGRESSION_P7_HOLD.json'));
const computed=build(data.exercises,excluded);
assert.deepEqual(manifest,computed,'Manifeste différent de la sélection reproductible');
const picked=computed.profiles.flatMap(p=>p.phases.flatMap(phase=>phase.cases));
assert.equal(picked.length,92);assert.equal(new Set(picked.map(x=>x.id)).size,92);
assert(picked.every(x=>!excluded.has(x.id)));
const catalog=new Map(data.exercises.map(x=>[x.id,x]));
assert.equal(new Set(picked.map(x=>catalog.get(x.id).caseFamily)).size,92);
const counts=computed.profiles.map(p=>p.phases.flatMap(x=>x.cases).reduce((o,c)=>(o[c.difficulty]=(o[c.difficulty]||0)+1,o),{}));
assert.deepEqual(counts,[{'1':12,'2':8},{'2':20,'3':20},{'3':16,'4':9,'5':7}]);
const fallbacks=computed.profiles.flatMap(p=>p.phases.flatMap(ph=>ph.cases.filter(x=>x.difficulty!==ph.targetLevel).map(x=>({profile:p.id,phase:ph.phase,theme:x.theme,wanted:ph.targetLevel,actual:x.difficulty}))));
assert.deepEqual(fallbacks,[{profile:'approfondissement',phase:4,theme:'drury',wanted:5,actual:4}]);
assert.equal(data.exercises.filter(x=>x.theme==='drury'&&x.difficulty===5).length,0);
const broken=structuredClone(manifest);
broken.profiles[0].phases[0].cases[0].id='ID_INEXISTANT';
assert.notDeepEqual(broken,computed,'Une altération du manifeste doit être détectée');
console.log('PASS wave2-pedagogie-progressions : 1523 QCM, 22 thèmes, 36 exclusions, 92 IDs/familles, 3 paliers, 1 repli Drury documenté');
