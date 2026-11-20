'use strict';
/* LOT B — simulations V1 comparées, catalogue ORIGINAL, sans mutation ni publication.
 * Run: node tests/quizz-parcours-lot-b.cjs
 * Chaque profil déroule 153 séances; snapshots à 40, 65 et 153.
 * Le moteur d'avant est reconstruit EXACTEMENT en retirant les 3 blocs LOT_B.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const CURRENT=require('../quizz-parcours.js');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Catalogue SEF embarqué présent');
const DATA=JSON.parse(match[1]),catalogue=DATA.exercises;
assert.equal(catalogue.length,1523,'Le catalogue original reste inchangé');
assert.equal(DATA.themes.length,22,'Les 22 rubriques restent disponibles');
const beforeCatalogue=JSON.stringify(catalogue);

function removeBlock(source,mark,indent){
  const begin=indent+'// LOT_B_'+mark+'_BEGIN\n';
  const end=indent+'// LOT_B_'+mark+'_END\n';
  const a=source.indexOf(begin),b=source.indexOf(end,a);
  assert.ok(a>=0&&b>a,'Le bloc LOT B '+mark+' est présent');
  return source.slice(0,a)+source.slice(b+end.length);
}
let previousSource=removeBlock(code,'EVIDENCE','    ');
previousSource=removeBlock(previousSource,'PICK','      ');
previousSource=removeBlock(previousSource,'SCORE','        ');
previousSource=removeBlock(previousSource,'DIVERSITY','    ');
const afterTail='+microNeed+microVariety+axisNeed+axisVariety+masteryCooldown+microDiscovery+lotBPriority;';
const beforeTail='+microNeed+microVariety+axisNeed+axisVariety+masteryCooldown+microDiscovery;';
assert.ok(previousSource.includes(afterTail),'Marqueur de score conservé');
previousSource=previousSource.replace(afterTail,beforeTail);
const prefix=Buffer.from('blob '+Buffer.byteLength(previousSource,'utf8')+'\0');
const blobSHA=crypto.createHash('sha1').update(prefix).update(previousSource,'utf8').digest('hex');
assert.equal(blobSHA,'504450f6254e91927c6945ac42dfc15c995fdaf9',
  'La référence AVANT est exactement le quizz-parcours.js de main audité');
const oldModule={exports:{}};
new Function('module','window',previousSource)(oldModule,null);
const BEFORE=oldModule.exports;
const baseThemes=new Set(['ouv','majeur','mineur','sa','red','second','stayman']);
const hash=str=>{let h=2166136261;for(let i=0;i<str.length;i++){
  h^=str.charCodeAt(i);h=Math.imul(h,16777619);
}return h>>>0;};
const keys=Object.keys(BEFORE.empty()).sort();
assert.deepEqual(Object.keys(CURRENT.empty()).sort(),keys,'Schema de sauvegarde intact');
assert.deepEqual(CURRENT.ROADMAP,BEFORE.ROADMAP,'Aucun changement du calendrier des rubriques');

function outcome(profile,q,session){
  const draw=hash(q.id+'|'+session+'|'+profile)%100;
  if(profile==='tout_juste')return {result:'correct',helped:false};
  if(profile==='echec_persistant')return {result:'wrong',helped:false};
  if(profile==='erreurs_moderees')return {result:draw<28?'wrong':'correct',helped:false};
  if(profile==='aides')return {result:draw<14?'wrong':'correct',helped:draw>=14&&draw<56};
  if(profile==='progression_graduelle'){
    const rate=75-Math.floor(60*Math.min(1,(session-1)/90));
    return {result:draw<rate?'wrong':'correct',helped:false};
  }
  throw Error('Profil inconnu: '+profile);
}
function simulate(P,profile){
  const state=P.empty(),allThemes=new Set(),allIds=new Set(),families=new Set();
  const count={qcm:0,wrong:0,helped:0,foundation:0,advanced:0,
    difficulty:0,hard:0,level3:0,whileWeak:0,
    recallDirect:0,recallAlternate:0,recallQuestion:0,recallTotal:0,
    contexts:new Set(),highDiversity:new Set()};
  const snapshots={};
  for(let session=1;session<=153;session++){
    const recent=(state.journal||[]).slice(-8)
      .filter(e=>e.mode==='parcours').flatMap(e=>e.answers)
      .filter(a=>baseThemes.has(a.theme));
    const hadWeak=recent.length>=10&&
      recent.filter(a=>a.result!=='correct'||a.assisted||a.hadFreeError).length*2>=recent.length;
    const deck=P.start(state,catalogue);
    assert.equal(deck.length,10,profile+' séance '+session+': dix QCM');
    const selection=state.active.selection;
    for(let i=0;i<deck.length;i++){
      const q=deck[i],sel=selection[i],answer=outcome(profile,q,session);
      assert.ok(session-1>=P.INTRO[q.theme],profile+' prérequis chronologique');
      count.qcm++;
      count.wrong+=Number(answer.result==='wrong');
      count.helped+=Number(answer.helped);
      count.foundation+=Number(baseThemes.has(q.theme));
      count.advanced+=Number(!baseThemes.has(q.theme));
      count.whileWeak+=Number(hadWeak&&!baseThemes.has(q.theme));
      count.difficulty+=q.difficulty;
      count.hard+=Number(q.difficulty>=4);
      count.level3+=Number(q.difficulty>=3);
      allThemes.add(q.theme);allIds.add(q.id);
      families.add(q.caseFamily||q.id);
      count.contexts.add(q.theme+'|'+String(q.auction?.[0]||''));
      count.highDiversity.add(q.theme+'|'+String(q.answer||''));
      count.recallDirect+=Number(sel.reason==='rappel_erreur_aide');
      count.recallAlternate+=Number(sel.reason==='rappel_nouvelle_situation');
      count.recallQuestion+=Number(sel.reason==='rappel_question');
      count.recallTotal+=Number(sel.kind==='revision');
      assert.ok(P.record(state,q,answer.result,i,
        answer.result==='correct'?q.answer:null,answer.helped,false));
    }
    assert.equal(P.finish(state,catalogue),true,'Séance '+session+' terminée');
    if([40,65,153].includes(session)){
      const restored=P.load(JSON.stringify(state));
      assert.equal(restored.completed,session,'Sauvegarde inchangée et restaurable');
      const opened=P.summary(state,catalogue).unlocked;
      const ratio=n=>Number((100*n/count.qcm).toFixed(2));
      snapshots[session]={
        sessions:session,qcm:count.qcm,errors:count.wrong,errorsPct:ratio(count.wrong),
        helped:count.helped,meanDifficulty:Number((count.difficulty/count.qcm).toFixed(3)),
        level3:count.level3,level4plus:count.hard,
        foundations:count.foundation,foundationPct:ratio(count.foundation),
        advanced:count.advanced,advancedWhileWeak:count.whileWeak,
        unlocked:opened,themesSeen:allThemes.size,contexts:count.contexts.size,
        decisions:count.highDiversity.size,uniqueQCM:allIds.size,
        uniqueFamilies:families.size,cataloguePct:ratio(allIds.size)*count.qcm/1523,
        recallTotal:count.recallTotal,recallDirect:count.recallDirect,
        recallAlternate:count.recallAlternate,recallQuestion:count.recallQuestion
      };
      snapshots[session].cataloguePct=Number((100*allIds.size/catalogue.length).toFixed(2));
    }
  }
  return snapshots;
}
function run(){
  const profiles=['tout_juste','echec_persistant','erreurs_moderees','aides','progression_graduelle'];
  const results={source:{baselineBlob:blobSHA,modified:'work/lot-b-v1-adaptive-20261120'},
    catalogue:catalogue.length,profiles:{}};
  for(const profile of profiles){
    results.profiles[profile]={before:simulate(BEFORE,profile),after:simulate(CURRENT,profile)};
    console.log('LOT_B_PROFILE '+profile+' '+JSON.stringify(results.profiles[profile]));
  }
  const persistent=results.profiles.echec_persistant;
  assert.equal(persistent.before[40].unlocked,22,'Reproduction: tout est déverrouillé');
  assert.equal(persistent.after[40].unlocked,22,'Aucune rubrique gelée');
  assert.ok(persistent.after[40].foundations>=persistent.before[40].foundations+10,
    'Les fondations faibles doivent être réellement plus présentes');
  assert.ok(persistent.after[40].themesSeen>=persistent.before[40].themesSeen-1,
    'Au plus une rubrique perdue à 40 séances');
  assert.ok(persistent.after[40].uniqueFamilies>=persistent.before[40].uniqueFamilies-5,
    'Pas d’effondrement des familles distinctes');
  assert.ok(persistent.after[40].level4plus<=persistent.before[40].level4plus+2,
    'Pas d’injection massive de difficulté 4+ en échec persistant');
  assert.deepEqual(results.profiles.tout_juste.before,
    results.profiles.tout_juste.after,'Élève sans erreurs : sélection strictement identique');
  for(const profile of profiles){
    for(const stop of [65,153]){
      assert.equal(results.profiles[profile].after[stop].unlocked,22,
        profile+' débloque toutes les rubriques au plus tard à 65');
      assert.ok(results.profiles[profile].after[stop].themesSeen>=18,
        profile+' garde une découverte thématique effective');
    }
  }
  assert.equal(JSON.stringify(catalogue),beforeCatalogue,'QCM jamais modifiés');
  const out=path.join(root,'artifacts','lot-b');
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'comparatif.json'),JSON.stringify(results,null,2)+'\n');
  console.log('LOT B PASS — 5 profils x 153 séances x 2 versions, résultats avant/après aux séances 40,65,153');
  return results;
}
if(require.main===module)run();
module.exports={run};
