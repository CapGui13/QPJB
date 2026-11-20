'use strict';
// LOT C : audit indépendant et simulation HORS production. Ne modifie aucune donnée.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const SCHEMA = 'audits/QPJB_V1_FIT14_LOT_C_PILOTE_NON_ACTIF_20261120.json';
const RANK = {A:4, R:3, D:2, V:1};
const SUITS = ['♠', '♥', '♦', '♣'];
const SOURCE_FIELDS = {
  sourceTheme: 'theme', sourceFamily: 'caseFamily', sourceAnswer: 'answer',
  sourceHand: 'hand', sourceH: 'h', sourceShape: 'shape',
  sourceAuction: 'auction', sourceContext: 'context',
  sourceChoices: 'choices', sourceExplanation: 'explain'
};
const BACKLOG_FIELDS = {
  sourceTheme: 'theme', sourceFamily: 'caseFamily', sourceAnswer: 'originalAnswer',
  sourceHand: 'hand', sourceH: 'h', sourceShape: 'shape',
  sourceAuction: 'auction', sourceContext: 'context',
  sourceChoices: 'choices', sourceExplanation: 'explain'
};
function actualQcm() {
  const html = fs.readFileSync(path.join(root, 'quizz.html'), 'utf8');
  const marker = '<script id="training-data" type="application/json">';
  const start = html.indexOf(marker);
  assert.ok(start >= 0, 'QCM reels : payload absent');
  const end = html.indexOf('</script>', start + marker.length);
  assert.ok(end > start, 'QCM reels : fin du payload absente');
  const data = JSON.parse(html.slice(start + marker.length, end));
  assert.equal(data.exercises.length, 1523, 'Catalogue SEF inchange');
  return new Map(data.exercises.map(x => [x.id, x]));
}
function audit() {
  const proposal = read(SCHEMA);
  const reg = read(proposal.sources.original48);
  const backlog = read(proposal.sources.original541);
  const real = actualQcm();
  const hash = cp.execFileSync('git', ['hash-object', 'quizz.html'], {cwd:root,encoding:'utf8'}).trim();
  assert.equal(hash, proposal.sourceV1Blob, 'Version source quizz.html modifiee');
  assert.equal(backlog.sourceV1Blob, hash, 'Backlog ne correspond pas a la source QCM');
  assert.equal(proposal.activationAllowed, false);
  assert.equal(proposal.validatedSkills, 0);
  assert.equal(proposal.masteryEvidence, null);
  assert.equal(proposal.reviewStatus, 'A_VALIDER_EDITORIALEMENT');
  assert.equal(proposal.selectionPolicy, 'SIMULATION_HORS_PRODUCTION');
  assert.equal(reg.readOnly, true);
  assert.equal(reg.publicationAllowed, false);
  assert.equal(reg.certifiedCount, 0);
  assert.equal(reg.rows.length, 48);
  assert.equal(backlog.rows.length, 541);
  assert.equal(proposal.groups.length, 3);
  const byReg = new Map(reg.rows.map(r => [r.id, r]));
  const byBack = new Map(backlog.rows.map(r => [r.id, r]));
  const groups = new Map(proposal.groups.map(g => [g.key,g]));
  const sourceGroups = new Map(reg.proposedGroups.map(g => [g.key,g]));
  const expectedKeys = ['fit:ouvreur_minimum_passe','fit:ouvreur_essai_generalise_2sa','fit:ouvreur_essai_couleur'];
  assert.deepEqual([...groups.keys()],expectedKeys);
  assert.deepEqual(proposal.groups.map(g=>g.ids.length),[4,4,6]);
  const selected = [], idSet = new Set(), details = [];
  for (const group of proposal.groups) {
    assert.equal(group.candidateOnly, true);
    assert.deepEqual(group.ids, sourceGroups.get(group.key).ids, 'IDs differents du registre original');
    for (const id of group.ids) {
      assert.ok(!idSet.has(id), 'ID duplique : '+id);
      idSet.add(id);
      const r = byReg.get(id), b = byBack.get(id), q = real.get(id);
      assert.ok(r && b && q, 'QCM original absent : '+id);
      assert.equal(r.candidateKey,group.key);
      assert.equal(r.review,'PROPOSITION_A_VALIDER_PEDAGOGIQUEMENT');
      assert.equal(r.structural,'VERIFIE');
      assert.equal(r.flags.length,0,'Nouvelle alerte a examiner : '+id);
      for (const [rkey,qkey] of Object.entries(SOURCE_FIELDS))
        assert.deepEqual(r[rkey],q[qkey]==null && qkey==='caseFamily' ? q.id : q[qkey],id+'/quizz/'+rkey);
      for (const [rkey,bkey] of Object.entries(BACKLOG_FIELDS))
        assert.deepEqual(r[rkey],b[bkey],id+'/backlog/'+rkey);
      assert.equal(r.sourceHand.length,4,id);
      assert.equal(r.sourceHand.flat().length,13,id);
      assert.deepEqual(r.sourceHand.map(x=>x.length),r.sourceShape,id);
      assert.equal(r.sourceH,r.sourceHand.flat().reduce((s,x)=>s+(RANK[x]||0),0),id+'/points H');
      r.sourceHand.forEach(cards=>assert.equal(cards.length,new Set(cards).size,id+'/cartes dupliquees'));
      assert.equal(r.sourceChoices.filter(x=>x===r.sourceAnswer).length,1,id+'/solution');
      assert.equal(r.sourceAuction.length,2,id+'/sequence');
      const major = r.sourceAuction[0].slice(-1);
      assert.ok(major==='♥'||major==='♠',id+'/ouverture majeure');
      assert.equal(r.sourceAuction[0],'Vous : 1'+major,id);
      assert.equal(r.sourceAuction[1],'Partenaire : 2'+major,id);
      assert.ok(r.sourceHand[SUITS.indexOf(major)].length>=5,id+'/majeure cinquieme');
      // Le fit est annonce par l'enchere partenaire, pas prouve par une main partenaire absente.
      const min = group.key==='fit:ouvreur_minimum_passe';
      const nts = group.key==='fit:ouvreur_essai_generalise_2sa';
      if (min || nts) {
        assert.equal(r.sourceH,min?12:15,id+'/zone');
        assert.equal(r.sourceAnswer,min?'Passe':'2SA',id+'/decision');
      } else {
        assert.ok(r.sourceH===15 || r.sourceH===16,id+'/zone couleur');
        assert.match(r.sourceAnswer,/^3[♣♦♥♠]$/,id+'/essai');
        const trialSuit=r.sourceAnswer.slice(-1);
        assert.notEqual(trialSuit,major,id+'/couleur distincte de atout');
        assert.ok(r.sourceHand[SUITS.indexOf(trialSuit)].length>=4,id+'/couleur secondaire');
      }
      const entry={id,key:group.key,family:r.sourceFamily,major,shape:r.sourceShape.join('-'),h:r.sourceH,answer:r.sourceAnswer,trialSuit:group.key==='fit:ouvreur_essai_couleur'?r.sourceAnswer.slice(-1):null};
      selected.push(entry);details.push(entry);
    }
  }
  const blocked = new Set(proposal.blocked.map(x=>x.id));
  assert.deepEqual([...blocked],['SEF-V44-054']);
  assert.equal(byReg.get('SEF-V44-054').sourceAuction.join('|'),'Vous : 1♥|Partenaire : 2♥');
  assert.equal(byReg.get('SEF-V44-054').sourceAnswer,'3♠');
  // Apres 3♠ sur 2♥, le retour a 3♥ serait une enchere descendante, impossible.
  for (const row of details) {
    if(row.key==='fit:ouvreur_essai_couleur' && !blocked.has(row.id)){
      assert.ok(row.major==='♥' ? ['♣','♦'].includes(row.trialSuit)
        : ['♣','♦','♥'].includes(row.trialSuit),'Essai sans retour possible a 3M: '+row.id);
    }
  }
  const eligible = selected.filter(x=>!blocked.has(x.id));
  assert.equal(selected.length,14);
  assert.equal(new Set(selected.map(x=>x.family)).size,14);
  assert.equal(new Set(selected.map(x=>x.major+':'+x.shape)).size,10);
  assert.equal(eligible.length,13);
  assert.equal(new Set(eligible.map(x=>x.family)).size,13);
  return {proposal,selected,eligible,details,sourceHash:hash,distinctSourceFamilies:14,distinctMajorShapes:10};
}
function simulate(eligible, weakKey, targeted) {
  const weak=eligible.filter(x=>x.key===weakKey);
  const other=eligible.filter(x=>x.key!==weakKey);
  assert.ok(weak.length>=2 && other.length>=2);
  // Comparateur neutre : rotation equilibree entre familles, sans tenir compte des erreurs.
  const buckets = [...new Set(eligible.map(x=>x.key))].map(k=>eligible.filter(x=>x.key===k));
  const all=[];
  for(let j=0;j<Math.max(...buckets.map(b=>b.length));j++)
    for(const bucket of buckets) if(bucket[j]) all.push(bucket[j]);
  const selections=[], sessions=[];
  for(let i=0;i<12;i++){
    const items = targeted ?
      [weak[(2*i)%weak.length],weak[(2*i+1)%weak.length],
       other[(2*i)%other.length],other[(2*i+1)%other.length]] :
      Array.from({length:4},(_,j)=>all[(4*i+j)%all.length]);
    assert.equal(new Set(items.map(x=>x.family)).size,4,'Doublon de famille pendant une seance');
    assert.ok(new Set(items.map(x=>x.key)).size>=2,'Seance monolithique');
    selections.push(...items);
    sessions.push(items.map(x=>x.id));
  }
  const counts=Object.fromEntries([...new Set(eligible.map(x=>x.key))].map(k=>[k,selections.filter(x=>x.key===k).length]));
  return {
    sessions:12,presentations:selections.length,
    weakPresentations:selections.filter(x=>x.key===weakKey).length,
    otherPresentations:selections.filter(x=>x.key!==weakKey).length,
    // Reponses modelisees : erreur 100 % sur la faiblesse, succes ailleurs. Pas d'apprentissage simule.
    syntheticWrong:selections.filter(x=>x.key===weakKey).length,
    uniqueFamilies:new Set(selections.map(x=>x.family)).size,
    uniqueWeakFamilies:new Set(selections.filter(x=>x.key===weakKey).map(x=>x.family)).size,
    skillsSeen:new Set(selections.map(x=>x.key)).size,
    duplicateFreeSessions:sessions.length,
    counts, sessions
  };
}
function run() {
  const data=audit();
  const profiles=data.proposal.scenarios.map(p=>{
    const before=simulate(data.eligible,p.weakKey,false);
    const after=simulate(data.eligible,p.weakKey,true);
    return {profile:p.id,weakKey:p.weakKey,before,after,
      weakExposureGain:after.weakPresentations-before.weakPresentations,
      relativeGainPct:100*(after.weakPresentations/before.weakPresentations-1)};
  });
  return {sourceHash:data.sourceHash,sourceQcm:14,sourceFamilies:data.distinctSourceFamilies,
    contextTemplates:data.distinctMajorShapes,eligibleForSimulation:data.eligible.length,
    excluded:[...new Set(data.proposal.blocked.map(x=>x.id))],
    skills: data.proposal.groups.map(g=>({key:g.key,proposed:g.ids.length,eligible:data.eligible.filter(x=>x.key===g.key).length})),
    profiles};
}
if(require.main===module) console.log(JSON.stringify(run(),null,2));
module.exports={audit,simulate,run};
