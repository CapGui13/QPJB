'use strict';
// QPJB AY — simulateur de l'extension facultative des ouvertures authentiques.
// Catalogue Quiz SEF 1523 et sauvegardes V1/V2 INCHANGÉS ; décisions pédagogiques PENDING.
// Pendant les 8 séances ciblées : 9 QCM du moteur V2-F + 1 situation authentique.
// Les problèmes BH-035 restent à réponse libre ; aucune option fabriquée.
// Le résultat fictif de l'exercice complémentaire est conservé dans un journal
// séparé : il n'est JAMAIS attribué au moteur V2-F ni à une preuve de maîtrise.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const F=require('./parcours-v2-pilot.cjs');
const ROOT=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(ROOT,name),'utf8');
const AX=JSON.parse(read('Docs/PARCOURS_V2_PHASE_AX_CANDIDATS_OUVERTURES_20261119.json'));
const AV=JSON.parse(read('Docs/PARCOURS_V2_PHASE_AV_ORIGINAUX_OUVERTURES_20261119.json'));
const SCHEDULE=new Map([
  [18,'EN-BH-067-06'],[21,'EN-BH-114-04'],
  [29,'EN-BH-114-05'],[32,'EN-BH-096-06'],
  [36,'BH-035-S02-01'],[39,'BH-035-S02-02'],
  [43,'BH-035-S02-03'],[46,'EN-BH-114-06']
]);
const CONDITIONAL='EN-BH-114-06';
const PROFILES=[
  {profile:'balanced',seed:13,title:'Équilibré'},
  {profile:'fragile-mineures',seed:29,title:'Fragile sur les mineures'},
  {profile:'facile',seed:47,title:'Très à l’aise'}
];
const FACES=['A','R','D','V','10','9','8','7','6','5','4','3','2'];
const H={A:4,R:3,D:2,V:1};
const sum=x=>x.reduce((a,b)=>a+b,0);
function parseHand(src){
  assert.ok(Array.isArray(src)&&src.length===4,'Main source invalide');
  const rows=src.map(row=>(Array.isArray(row)?row:String(row).trim().split(/\s+/))
    .map(String).filter(Boolean));
  for(const row of rows){
    assert.ok(row.every(x=>FACES.includes(x)),'Rang de carte inconnu');
    assert.equal(new Set(row).size,row.length,'Doublon de carte dans une couleur');
  }
  assert.equal(sum(rows.map(r=>r.length)),13,'13 cartes attendues');
  return rows;
}
function buildSupplement(){
  assert.equal(AX.cases.length,8);
  assert.equal(AV.cases.length,5);
  assert.equal(AX.releaseDecision,'HOLD');
  const training=vm.runInNewContext(read('entrainement/training-data-bootstrap.js')+'\n;\n'+
    read('entrainement/training-data-bidding.js')+'\n;D.bidding',
    {console:{log(){}}},{timeout:30000});
  const byId=new Map(training.map(x=>[x.id,x]));
  const avById=new Map(AV.cases.map(x=>[x.id,x]));
  const supplements=[];
  const seen=new Set();
  for(const [session,id] of SCHEDULE){
    const desc=AX.cases.find(q=>q.id===id);
    assert.ok(desc&&!seen.has(id),'ID manquant ou dupliqué : '+id);
    seen.add(id);
    let question;
    if(id.startsWith('EN-')){
      const original=byId.get(id);
      assert.ok(original,'QCM Entraînement absent '+id);
      assert.ok(original.choices.includes(original.correct),'Réponse hors choix '+id);
      assert.equal(desc.answer,original.correct,'Corrigé QCM divergent '+id);
      question={id,origin:'ENTRAINEMENT',kind:'qcm',sourceRef:original.sourceRef,
        hand:parseHand(original.hand),auction:original.auction,
        context:original.topic,choices:[...original.choices],
        answer:original.correct,explain:original.explanation,
        sourceEditorialStatus:original.reviewStatus||null};
    }else{
      const original=avById.get(id);
      assert.ok(original&&original.status==='CANDIDAT_FORT_A_VALIDER',
        'Source BH-035 introuvable ou en quarantaine : '+id);
      assert.equal(desc.answer,original.printedAnswer,'Corrigé BH différent '+id);
      question={id,origin:'ORIGINAL_PDF',kind:'free',
        sourceRef:'BH-035 p.2 · sujet et corrigé',
        hand:parseHand(original.subjectHand),
        auction:[],context:'Choisir une ouverture avec cette main (consigne de prévisualisation)',
        choices:[],answer:original.printedAnswer,
        explain:original.focus,
        sourceEditorialStatus:'PROVENANCE_CONTROLEE_VALIDATION_SEF_EN_ATTENTE'};
    }
    const points=question.hand.flat().reduce((n,c)=>n+(H[c]||0),0);
    if(id.startsWith('BH-035'))assert.equal(points,avById.get(id).sourceH);
    supplements.push({...question,teacherApproval:'PENDING',introSession:session,
      family:'AX:'+desc.family,proposedStage:desc.stage,priority:desc.priority,
      conditional:id===CONDITIONAL,sourceH:points,
      note:desc.note,editorialVerdict:desc.verdict});
  }
  assert.equal(supplements.length,8);
  assert.equal(new Set(supplements.map(x=>x.family)).size,7,
    'Sept objectifs candidats, dont deux variantes du même');
  return supplements;
}
const addons=buildSupplement();
const bySession=new Map(addons.map(x=>[x.introSession,x]));
function compactCore(q){
  return {id:q.id,origin:'SEF',kind:'qcm',
    family:F.family(q),theme:q.theme,difficulty:q.difficulty,
    sourceRef:'Quiz SEF · corpus 1 523',
    hand:q.hand,auction:q.auction||[],context:q.context||'',
    choices:q.choices,answer:q.answer,explain:q.explain};
}
function compactAddon(q){
  return {id:q.id,origin:q.origin,kind:q.kind,
    family:q.family,theme:'ouv',difficulty:null,
    sourceRef:q.sourceRef,hand:q.hand,
    auction:q.auction,context:q.context,choices:q.choices,
    answer:q.answer,explain:q.explain,conditional:q.conditional,
    proposedStage:q.proposedStage,teacherApproval:q.teacherApproval,
    note:q.note};
}
function reviewCount(state){
  return state.reviewEvents.filter(e=>e.source==='scheduled').length;
}
function simulateOne(profile,options={}){
  const count=options.sessions||65;
  const includeConditional=options.includeConditional===true;
  const catalog=F.loadCatalog(),ann=F.loadAnnotations();
  assert.equal(catalog.length,1523,'Ne pas altérer la base SEF');
  const catalogById=new Map(catalog.map(q=>[q.id,q]));
  assert.equal(catalogById.size,catalog.length);
  assert.ok(addons.every(q=>!catalogById.has(q.id)),'Collision source/extension');
  const state=F.newState(profile.seed);
  const sessions=[];
  const supplementalJournal=[];
  let selectedScheduled=0;
  for(let i=0;i<count;i++){
    const session=i+1;
    const extra=bySession.get(session);
    const active=extra&&(includeConditional||!extra.conditional)?extra:null;
    const base=F.select(catalog,state,ann,active?9:10);
    assert.equal(base.length,active?9:10,'La séance du pilote doit rester complète');
    const choices=base.map(compactCore);
    if(active)choices.splice(4,0,compactAddon(active));
    assert.equal(choices.length,10,'10 questions présentées à chaque séance');
    assert.equal(new Set(choices.map(q=>q.family)).size,10,
      'Une famille ne doit pas apparaître deux fois dans une séance');
    const answers=F.simulatedAnswers(base,i,profile.seed,profile.profile);
    selectedScheduled+=state.lastSelection.filter(x=>x.source==='scheduled-recall').length;
    // On n'enregistre dans V2-F QUE les réponses fictives aux QCM SEF effectivement présentés.
    F.recordSession(state,base,answers,ann);
    if(active)supplementalJournal.push({session,id:active.id,kind:active.kind,
      storedInSEF:false,sidecarOnly:true,simulatedOutcome:'NOT_ASSESSED'});
    sessions.push({number:session,questions:choices,extensionId:active?.id||null,
      editorialNote:active?'Enrichissement expérimental ; validation éditoriale en attente':null});
  }
  assert.equal(sessions.length,count);
  return {profile,includeConditional,sessionCount:count,sessions,supplementalJournal,
    metrics:{
      totalShown:count*10,coreSEFShown:count*10-supplementalJournal.length,
      extraShown:supplementalJournal.length,
      lateOpening21to30:sessions.slice(20,30).flatMap(x=>x.questions)
        .filter(q=>q.theme==='ouv').length,
      lateOpening31to50:sessions.slice(30,50).flatMap(x=>x.questions)
        .filter(q=>q.theme==='ouv').length,
      uniqueFamilies:new Set(sessions.flatMap(x=>x.questions.map(q=>q.family))).size,
      uniqueIds:new Set(sessions.flatMap(x=>x.questions.map(q=>q.id))).size,
      sourceQcmCount:catalog.length,
      duplicateFamilySessions:sessions.filter(s=>new Set(s.questions.map(q=>q.family)).size!==10).length,
      scheduledSlotsUsed:selectedScheduled,scheduledRecallEvents:reviewCount(state),
      recalledConcepts:new Set(state.reviewEvents.map(x=>x.concept)).size,
      extensionSessions:supplementalJournal.map(x=>x.session)
    }};
}
function evaluate(){
  const catalog=F.loadCatalog(),ann=F.loadAnnotations();
  const output=[];
  for(const profile of PROFILES){
    const baseline=F.simulateV2(catalog,ann,{sessions:65,seed:profile.seed,profile:profile.profile});
    const mode7=simulateOne(profile);
    const mode8=simulateOne(profile,{includeConditional:true});
    const originalFirst17=baseline.sessions.slice(0,17).map(d=>d.map(x=>x.id));
    for(const run of [mode7,mode8]){
      assert.deepEqual(run.sessions.slice(0,17).map(s=>s.questions.map(q=>q.id)),
        originalFirst17,'Les 17 premières séances doivent être identiques à V2-F');
      assert.equal(run.metrics.totalShown,650);
      assert.equal(run.metrics.duplicateFamilySessions,0);
      assert.equal(run.supplementalJournal.length,run.includeConditional?8:7);
      assert.ok(run.supplementalJournal.every(x=>x.sidecarOnly&&!x.storedInSEF));
    }
    output.push({profile,baseline:{
      totalShown:650,
      lateOpening21to30:baseline.sessions.slice(20,30).flat().filter(q=>q.theme==='ouv').length,
      lateOpening31to50:baseline.sessions.slice(30,50).flat().filter(q=>q.theme==='ouv').length,
      uniqueFamilies:baseline.metrics.uniqueFamilies,
      scheduledSlotsUsed:baseline.metrics.revision.scheduledSlotsUsed,
      scheduledRecallEvents:baseline.metrics.revision.scheduledDueRecalls
    },mode7,mode8});
  }
  return {schema:'QPJB_V2_AY_INTERLEAVED_PREVIEW_1',
    generated:'2026-11-19',simulation:true,realLearners:false,
    quizSEFCatalogCount:1523,changeToSEF:0,
    editorialStatus:'PENDING',releaseDecision:'HOLD',
    conditionalCase:'EN-BH-114-06',
    defaultExtraCount:7,maxExtraCount:8,
    expectedLearningNotProven:true,supplement: addons,output};
}
if(require.main===module){
  const report=evaluate();
  const dir=path.join(ROOT,'artifacts/v2-ay');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'parcours-intercale-ay.json'),
    JSON.stringify(report,null,2),'utf8');
  const brief={
    schema:report.schema,model:'8 insertions à séances fixes ; 7 par défaut, 8 sur option',
    results:report.output.map(x=>{
      const base=x.baseline,seven=x.mode7.metrics,eight=x.mode8.metrics;
      return {profile:x.profile.profile,seed:x.profile.seed,
        baseline:{opening21to30:base.lateOpening21to30,
          opening31to50:base.lateOpening31to50,
          families:base.uniqueFamilies,recalls:base.scheduledRecallEvents},
        seven:{opening21to30:seven.lateOpening21to30,
          opening31to50:seven.lateOpening31to50,
          families:seven.uniqueFamilies,recalls:seven.scheduledRecallEvents,
          inserted:seven.extraShown},
        eight:{opening21to30:eight.lateOpening21to30,
          opening31to50:eight.lateOpening31to50,
          families:eight.uniqueFamilies,recalls:eight.scheduledRecallEvents,
          inserted:eight.extraShown}};
    })
  };
  fs.writeFileSync(path.join(dir,'synthese-ay.json'),JSON.stringify(brief,null,2));
  console.log('QPJB-AY-DIGEST '+JSON.stringify(brief));
  console.log('QPJB-AY-PASS 3 profiles x 65 sessions, 10 questions, source unchanged');
}
module.exports={buildSupplement,simulateOne,evaluate};
