'use strict';
// M1 P21 : confronter les 17 QCM au catalogue reel, sans le modifier.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),base='audits/wave2/pedagogie/';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const html=read('quizz.html');
const digest=crypto.createHash('sha1').update('blob '+Buffer.byteLength(html)+'\0'+html).digest('hex');
assert.equal(digest,'9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7','Blob QCM change');
const startTag='<script id="training-data" type="application/json">';
const start=html.indexOf(startTag),end=html.indexOf('</script>',start+startTag.length);
assert(start>=0&&end>start,'JSON QCM absent');
const data=JSON.parse(html.slice(start+startTag.length,end));
const d=json(base+'DECISIONS_P20_HOLD.json'),p8=json(base+'PROPOSITIONS_P8_HOLD.json');
const p10=json(base+'CONTRE_RELECTURE_P10_15_HOLD.json'),p13=json(base+'REVUE_P13_32_HOLD.json');
const reg=json(base+'ARBITRAGES_P14_HOLD.json');
const old1=json('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json');
const old2=json('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json');
assert.equal(data.exercises.length,1523);assert.equal(data.themes.length,22);
const wanted=[...d.editorial,...d.agreements].map(x=>x.id);
assert.equal(wanted.length,17);assert.equal(new Set(wanted).size,17);
assert.equal(d.status,'HOLD_NO_HUMAN_APPROVAL');
const excluded=new Set([...old1.proposals,...old2.proposals].map(x=>x.id));
assert.equal(excluded.size,36);assert(wanted.every(id=>!excluded.has(id)));
const sources=[
 ...p8.proposals.map(x=>({id:x.id,origin:'P8',snapshot:x.before})),
 ...p10.caseAudits.map(x=>({id:x.id,origin:'P10',snapshot:{...x.baseline,theme:x.theme,difficulty:x.difficulty}})),
 ...p13.individualRecords.map(x=>({id:x.id,origin:'P13',snapshot:{...x.before,theme:x.theme,difficulty:x.difficulty}}))
];
const lookup=new Map(sources.filter(x=>wanted.includes(x.id)).map(x=>[x.id,x]));
assert.equal(lookup.size,17);
function verify(exercises){
 const found=new Map();for(const x of exercises)if(wanted.includes(x.id)){assert(!found.has(x.id),'ID doublon '+x.id);found.set(x.id,x);}
 assert.equal(found.size,17);
 let count=0;const counts={P8:0,P10:0,P13:0};
 for(const id of wanted){
  const row=found.get(id),s=lookup.get(id);assert(s,'Audit absent : '+id);
  for(const [field,expected] of Object.entries(s.snapshot)){
   assert.deepEqual(row[field],expected,'QCM '+id+' champ '+field);count++;
  }
  counts[s.origin]++;
 }
 for(let i=0;i<d.editorial.length;i++){
  const item=d.editorial[i],row=found.get(item.id),reference=reg.editorial[i];
  assert.equal(item.decision,'PENDING');assert.equal(item.approvedByHuman,false);
  assert.equal(row.answer,reference.oldAnswer);assert.deepEqual(row.choices,reference.oldChoices);
  for(const key of item.changedFields){assert.equal(row[key],item.before[key]);assert.notEqual(item.after[key],item.before[key]);}
 }
 for(const x of d.agreements){assert.equal(x.decision,'PENDING');assert.equal(x.confirmedByHuman,false);assert.equal(x.answerUnchanged,true);}
 const texas=found.get('SEF-L25-004');
 assert.equal(texas.answer,'Passe');
 assert.deepEqual(texas.hand[1],['R','8']);assert.deepEqual(texas.hand[2],['A','D','8','4']);
 return {count,counts};
}
const measured=verify(data.exercises);
const duplicate=()=>JSON.parse(JSON.stringify(data.exercises));
let changed=duplicate();changed.find(x=>x.id==='SEF-L25-004').answer='Surcontre';
assert.throws(()=>verify(changed),'Réponse Texas corrompue non détectée');
changed=duplicate();changed.find(x=>x.id==='SEF-L02-E-17').hand[0][0]='R';
assert.throws(()=>verify(changed),'Main Blackwood corrompue non détectée');
changed=duplicate();changed.find(x=>x.id==='SEF-V44-005').explain='Corrigé artificiel';
assert.throws(()=>verify(changed),'Explication corrompue non détectée');
console.log('PASS wave2-pedagogie-catalogue-p21 : 17 QCM, '+measured.count+' champs, P8/P10/P13 '+Object.values(measured.counts).join('/')+', 3 mutations detectees');
