'use strict';
/* Phase K — vérifie les associations de la cartographie sur le catalogue ORIGINAL.
 * Aucun calcul de note ou déblocage par prérequis n'est permis ici.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {load,proposeFoundations}=require('../scripts/parcours-v2-fondations.cjs');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const startTag='<script id="training-data" type="application/json">';
const start=html.indexOf(startTag),end=html.indexOf('</script>',start+startTag.length);
assert.ok(start>=0&&end>start,'Catalogue original manquant');
const catalogue=JSON.parse(html.slice(start+startTag.length,end));
assert.equal(catalogue.exercises.length,1523);
const byId=new Map(catalogue.exercises.map(x=>[x.id,x]));
assert.equal(byId.size,1523);
const prior=JSON.parse(fs.readFileSync(path.join(root,'Docs/PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json'),'utf8'));
const data=load();
assert.equal(data.schema,'QPJB_V2_PHASE_K_CARTOGRAPHIE_FONDATIONS_20261118_1');
assert.equal(data.foundationCount,15);
assert.equal(data.foundations.length,15);
assert.equal(data.unlockEngineEnabled,false);
assert.equal(data.gradingEnabled,false);
assert.equal(data.masteryInferenceEnabled,false);
assert.equal(data.status,'CANDIDATURE_DOCUMENTAIRE_NON_ACTIVE');
assert.deepEqual(
  new Set(data.foundations.map(x=>x.id)),
  new Set(prior.foundations.map(x=>x.id))
);
const sources=new Set();
let crosslinks=0,insufficient=0,indirect=0,editorial=0;
for(const f of data.foundations){
  assert.equal(f.requiresTeacherReview,true);
  assert.equal(f.enforceUnlock,false);
  assert.equal(f.masteryThreshold,null);
  assert.ok(Number.isInteger(f.suggestedEarliestCompletedSessions)&&f.suggestedEarliestCompletedSessions>=0);
  assert.ok(f.evidence.length>0);
  const local=new Set();
  for(const e of f.evidence){
    const original=byId.get(e.id);
    assert.ok(original,'ID QCM introuvable '+e.id);
    assert.equal(e.theme,original.theme,'Rubrique dérivée '+e.id);
    assert.equal(e.caseFamily,String(original.caseFamily||original.id),'Famille dérivée '+e.id);
    assert.equal(e.originalAnswer,original.answer,'Réponse dérivée '+e.id);
    assert.equal(e.editorialReason,original.difficultyReason,'Justification dérivée '+e.id);
    assert.ok(!local.has(e.id),'Double ID dans fondation '+f.id);
    local.add(e.id);sources.add(e.id);crosslinks++;
  }
  assert.equal(new Set(f.evidence.map(x=>x.caseFamily)).size,f.distinctFamilies);
  if(f.coverageStatus==='INSUFFISANTE'){
    insufficient++;
    assert.equal(f.distinctFamilies,1,'Statut couverture insuffisante ne correspond plus aux sources');
  }else if(f.coverageStatus==='INDIRECTE')indirect++;
  else if(f.coverageStatus==='CONVENTION_A_ARBITRER')editorial++;
  else assert.equal(f.coverageStatus,'CANDIDATE');
}
assert.equal(data.sourceQcmCount,47);
assert.equal(sources.size,47);
assert.equal(crosslinks,50);
assert.equal(insufficient,2);
assert.equal(indirect,1);
assert.equal(editorial,1);
const suggested=new Set();
for(let s=0;s<=65;s++){
  const list=proposeFoundations(data,s,4);
  assert.ok(list.length<=4);
  assert.equal(new Set(list.map(x=>x.id)).size,list.length);
  for(const x of list){
    const f=data.foundations.find(y=>y.id===x.id);
    assert.ok(f);
    assert.ok(f.suggestedEarliestCompletedSessions<=s,'Introduction prématurée '+f.id);
    assert.ok(['CANDIDATE','INDIRECTE'].includes(f.coverageStatus),'Notion non arbitrée proposée '+f.id);
    assert.equal(x.masteryThreshold,null);
    assert.equal(x.enforceUnlock,false);
    suggested.add(x.id);
  }
}
for(const f of data.foundations.filter(x=>['CANDIDATE','INDIRECTE'].includes(x.coverageStatus)))
  assert.ok(suggested.has(f.id),'Fondation jamais proposée '+f.id);
assert.throws(()=>proposeFoundations(data,-1),RangeError);
assert.throws(()=>proposeFoundations(data,2,0),RangeError);
assert.throws(()=>proposeFoundations({...data,unlockEngineEnabled:true},3));
console.log('QPJB V2 K PASS : 15 fondations, 47 QCM uniques, 50 liens, 2 insuffisantes, 1 indirecte, aucune maîtrise ni blocage');
