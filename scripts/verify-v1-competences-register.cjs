'use strict';
// Registre de revue V1 strictement en lecture seule : ne modifie aucun fichier.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function embedded(file,id){
  const html=read(file),start='<script id="'+id+'" type="application/json">';
  const i=html.indexOf(start);
  assert.ok(i>=0,'Payload introuvable : '+file+'/'+id);
  const j=html.indexOf('</script>',i+start.length);
  assert.ok(j>i,'Fin de payload absente : '+file);
  return JSON.parse(html.slice(i+start.length,j));
}
function csvLine(line){
  const fields=[];let val='',quoted=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){if(quoted&&line[i+1]==='"'){val+='"';i++}else quoted=!quoted;}
    else if(c===','&&!quoted){fields.push(val);val='';}
    else val+=c;
  }
  fields.push(val);
  assert.ok(!quoted,'CSV mal échappé');
  return fields;
}
function parseCsv(content){
  const lines=content.trim().split(/\r?\n/),fields=csvLine(lines.shift());
  return lines.map(line=>{
    const vals=csvLine(line);
    assert.equal(vals.length,fields.length,'Colonnes CSV inattendues');
    return Object.fromEntries(fields.map((key,i)=>[key,vals[i]]));
  });
}
// Le registre du 20/11 compare des sources historiques et non les QCM récents.
// Revenir aux 13 champs de correctifs approuvés AVANT de tester ses snapshots.
// Toute valeur actuelle différente de la valeur approuvée provoque un échec.
const published=embedded('quizz.html','training-data').exercises;
const lotD=require('../audits/QPJB_V1_LOT_D_11_INTEGRATION_20261121.json');
const sef=require('../audits/QPJB_SEF_CLOTURE_2_QCM_20261121.json');
assert.equal(lotD.proposals.length,11,'11 corrections D approuvées');
assert.equal(sef.patches.length,2,'2 corrections SEF approuvées');
const patches=[...lotD.proposals,...sef.patches];
const approvedById=new Map(patches.map(p=>[p.id,p]));
assert.equal(approvedById.size,13,'13 IDs de correction distincts');
let normalized=0;
const q=published.map(item=>{
  const patch=approvedById.get(item.id);
  if(!patch)return item;
  for(const [key,value] of Object.entries(patch.after)){
    assert.deepEqual(item[key],value,'Correction publiée divergente '+item.id+'/'+key);
  }
  normalized++;
  return {...item,...patch.before};
});
assert.equal(normalized,13,'13 QCM corrigés retrouvés sur le site');
const v2=embedded('preview/v2-eleve/parcours-sef-65-r1.html','ay-payload');
const original=new Map(q.map(x=>[x.id,x]));
const revised=new Map(v2.catalog.map(x=>[x.id,x]));
assert.equal(q.length,1523);assert.equal(original.size,1523);
assert.equal(v2.catalog.length,1523);assert.equal(revised.size,1523);
const manifest79=JSON.parse(read('audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json'));
const manifest541=JSON.parse(read('audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json'));
assert.equal(manifest79.count,79);assert.equal(manifest541.count,541);
assert.equal(manifest79.rows.length,79);assert.equal(manifest541.rows.length,541);
assert.equal(manifest79.readOnly,true);assert.equal(manifest541.readOnly,true);
const sa=v2.docs['PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json'];
const st=v2.docs['PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json'];
assert.equal(sa.assignments.length,14);assert.equal(st.assignments.length,65);
const candidate=new Map([...sa.assignments,...st.assignments].map(a=>[a.id,a]));
assert.equal(candidate.size,79);
const reference= parseCsv(read('Docs/PARCOURS_V2_REVUE_620_20261118.csv'));
assert.equal(reference.length,620);assert.equal(new Set(reference.map(x=>x.id)).size,620);
const inReference=new Set(reference.map(x=>x.id));
const selected=new Set();
const sourceKeys=['id','theme','caseFamily','hand','h','shape','auction','context','choices','answer','explain','difficulty','difficultyReason'];
function checkSource(row,source){
  const sourceSnapshot={...source,caseFamily:source.caseFamily||source.id};
  for(const key of sourceKeys){
    const actual=row[key]===undefined?null:row[key];
    const expected=sourceSnapshot[key]===undefined?null:sourceSnapshot[key];
    assert.deepEqual(actual,expected,'Snapshot QCM V1 divergent '+source.id+'/'+key);
  }
}
for(const row of manifest79.rows){
  assert.ok(!selected.has(row.id),'Doublon registre '+row.id);
  selected.add(row.id);
  assert.ok(inReference.has(row.id),'Candidat absent de la file initiale '+row.id);
  assert.ok(candidate.has(row.id),'Attribution candidate non source '+row.id);
  const originalQuestion=original.get(row.id),v2Question=revised.get(row.id);
  assert.ok(originalQuestion&&v2Question,'ID absent du catalogue');
  assert.equal(row.classificationStatus,'A_VALIDER_SEF_NON_ACTIVE_V1');
  assert.equal(row.candidateSkill,candidate.get(row.id).candidateSkill);
  assert.equal(row.originalAnswerDeclared,candidate.get(row.id).originalAnswer);
  checkSource(row.originalV1,originalQuestion);
  assert.equal(row.v2Answer,v2Question.answer);
  const differences=['context','answer','choices','explain','theme'].filter(k=>
    JSON.stringify(originalQuestion[k])!==JSON.stringify(v2Question[k]));
  assert.deepEqual(row.v2ChangedFields,differences);
}
for(const row of manifest541.rows){
  assert.ok(!selected.has(row.id),'Doublon registre '+row.id);
  selected.add(row.id);
  assert.ok(inReference.has(row.id),'Cas non présent dans les 620 : '+row.id);
  assert.equal(row.mappingStatus,'A_CLASSER_MANUELLEMENT');
  const item=original.get(row.id);assert.ok(item,'ID original manquant');
  assert.equal(row.originalAnswer,item.answer);
  for(const key of ['theme','caseFamily','difficulty','context','auction','hand','h','shape','choices','explain','difficultyReason']){
    assert.deepEqual(row[key],key==='caseFamily'?(item.caseFamily||item.id):item[key],
      'File 541 divergente '+row.id+'/'+key);
  }
}
assert.equal(selected.size,620);
assert.deepEqual([...selected].sort(),[...inReference].sort());
const P=require('../quizz-parcours.js');
const covered=q.filter(x=>P.microKey(x));
assert.equal(covered.length,903,'Couverture V1 heuristique modifiée');
assert.equal([...selected].filter(id=>P.microKey(original.get(id))).length,0,
  'La file 620 devrait etre sans microKey V1');
const edited=[];
for(const item of v2.catalog){
  const prior=original.get(item.id);
  const fields=[...new Set([...Object.keys(item),...Object.keys(prior)])]
    .filter(k=>JSON.stringify(item[k])!==JSON.stringify(prior[k]));
  if(fields.length)edited.push({id:item.id,fields});
}
assert.deepEqual(edited.map(x=>x.id).sort(),
  ['SEF-L25-007','SEF-V416-008','SEF-V416-009'].sort());
assert.deepEqual(edited.find(x=>x.id==='SEF-L25-007').fields,['explain']);
for(const id of ['SEF-V416-008','SEF-V416-009']){
  assert.deepEqual(edited.find(x=>x.id===id).fields.sort(),
    ['context','answer','choices','explain'].sort());
}
const singleton=new Set([...sa.skills,...st.skills].filter(x=>x.ids.length===1).map(x=>x.id));
assert.equal(singleton.size,10);
const total={heuristiques:covered.length,candidates:manifest79.count,manquants:manifest541.count};
assert.equal(Object.values(total).reduce((a,b)=>a+b,0),1523);
console.log('QPJB V1 CARTOGRAPHIE PASS : 903 heuristiques + 79 candidats + 541 a classer = 1523');
console.log('Sources V1 verifiees ; 79/79 attributions tracees, 541/541 cas conserves ; 10 groupes a cas unique');
console.log('3 differences edito V1/V2 repertoriees ; aucune reponse ni sauvegarde modifiee');
