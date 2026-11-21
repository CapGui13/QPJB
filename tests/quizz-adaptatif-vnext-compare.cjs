'use strict';
/*
 * QPJB mission 2 — comparateur expérimental (proposition non retenue).
 * Exécution: node tests/quizz-adaptatif-vnext-compare.cjs
 * Aucune mutation de quizz.html, des QCM, du stockage ou du moteur durant le test.
 * Comparaison des mêmes 1 523 QCM avec le moteur de référence figé.
 * Le moteur du dépôt est volontairement inchangé. Le comparateur rejoue
 * en mémoire une variante expérimentale pour conserver les mesures de rejet.
 * Une sortie VNEXT_PASS valide seulement le fonctionnement du banc de tests,
 * pas la décision pédagogique de déployer une variante.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
let source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');
const temporaryHarness=source.indexOf('\n// VNEXT_BENCHMARK_CI_TEMP_BEGIN');
if(temporaryHarness>=0)source=source.slice(0,temporaryHarness);
const anchor=`const lotBPriority=foundationNeed+explorationFloor+discovery+
          newFamily+rareContext+rareAnswer+hardWhileStruggling;`;
const proposal=`// VNEXT_LOCAL_FOUNDATION_BEGIN
        // Une fragilité locale peut exister même quand le taux global
        // d'erreurs est modéré. Favoriser des situations neuves de cette
        // rubrique, sans réservation de place ni verrouillage de thèmes.
        const locallyWeak=!struggling&&kind!=='revision'&&foundationThemes.has(t)&&
          evidence&&evidence.attempts>=4&&evidence.weak*5>=evidence.attempts*3;
        const localNeed=locallyWeak&&recent>=999?Math.min(70,Math.round(80*evidence.weak/evidence.attempts)):0;
        const lotBPriority=foundationNeed+explorationFloor+discovery+
          newFamily+rareContext+rareAnswer+hardWhileStruggling+localNeed;
        // VNEXT_LOCAL_FOUNDATION_END`;
assert.ok(source.includes(anchor)||source.includes(proposal),
  'Version du moteur inconnue : abandon de la comparaison');
const baselineSource=source.includes(proposal)?source.replace(proposal,anchor):source;
const candidateSource=baselineSource.replace(anchor,proposal);
assert.notEqual(baselineSource,candidateSource);
const blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+Buffer.byteLength(b)+'\0'))
  .update(b).digest('hex');
assert.equal(blob(baselineSource),'d0f06f1c259f7a766f2d1c8c47289374a74138dc',
  'Le moteur avant doit être strictement le commit de référence demandé');
function api(code){
  const mod={exports:{}};
  new Function('module','window',code)(mod,null);
  return mod.exports;
}
const BEFORE=api(baselineSource),AFTER=api(candidateSource);
assert.equal(BEFORE.VERSION,AFTER.VERSION);
assert.deepEqual(BEFORE.ROADMAP,AFTER.ROADMAP);
assert.deepEqual(Object.keys(BEFORE.empty()).sort(),Object.keys(AFTER.empty()).sort());
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Catalogue SEF réel embarqué');
const data=JSON.parse(match[1]),exercises=data.exercises;
assert.equal(exercises.length,1523);
assert.equal(data.themes.length,22);
const catalogueChecksum=crypto.createHash('sha256').update(JSON.stringify(exercises)).digest('hex');
const byId=new Map(exercises.map(x=>[x.id,x]));
const foundations=new Set(['ouv','majeur','mineur','sa','red','second','stayman']);
const hash=x=>{let h=2166136261;for(let i=0;i<x.length;i++){
  h^=x.charCodeAt(i);h=Math.imul(h,16777619);
}return h>>>0;};
const names=['tout_juste','echecs_persistants','erreurs_moderees','aides','progression_graduelle'];
function answer(profile,x,session){
  const draw=hash(x.id+'|'+session+'|'+profile)%100;
  if(profile==='tout_juste')return {result:'correct',assisted:false};
  if(profile==='echecs_persistants')return {result:'wrong',assisted:false};
  if(profile==='erreurs_moderees')return {result:draw<28?'wrong':'correct',assisted:false};
  if(profile==='aides')return {result:draw<14?'wrong':'correct',assisted:draw>=14&&draw<56};
  const failRate=75-Math.floor(60*Math.min(1,(session-1)/90));
  return {result:draw<failRate?'wrong':'correct',assisted:false};
}
function weakEvidence(state){
  const stats={},recent=(state.journal||[]).filter(x=>x.mode==='parcours').slice(-8);
  for(const event of recent)for(const a of event.answers||[]){
    if(!foundations.has(a.theme))continue;
    const stat=stats[a.theme]||(stats[a.theme]={attempts:0,weak:0});
    stat.attempts++;
    if(a.result!=='correct'||a.assisted||a.hadFreeError)stat.weak++;
  }
  const total=Object.values(stats).reduce((r,x)=>({attempts:r.attempts+x.attempts,weak:r.weak+x.weak}),{attempts:0,weak:0});
  const struggling=total.attempts>=10&&total.weak*2>=total.attempts;
  return new Set(struggling?[]:Object.entries(stats)
    .filter(([,x])=>x.attempts>=4&&x.weak*5>=x.attempts*3)
    .map(([theme])=>theme));
}
function simulate(P,name,paired=false){
  const state=P.empty(),seenIds=new Set(),seenFamilies=new Set(),
    themes=new Set(),contexts=new Set(),decisions=new Set();
  const total={questions:0,difficultySum:0,difficulty4plus:0,discoveries:0,
    reviews:0,directReviews:0,alternativeReviews:0,repeats:0,weakFoundationQcm:0,
    foundationQcm:0,lateReviews:0,lateReviewCount:0};
  const pairedTotals={baseline:0,candidate:0,opportunities:0};
  const stops={};
  for(let session=1;session<=153;session++){
    const weak=weakEvidence(state);
    if(paired&&weak.size){
      const v1=BEFORE.select(exercises,state,10);
      const vNext=AFTER.select(exercises,state,10);
      if(weak.size){
        pairedTotals.baseline+=v1.filter(x=>weak.has(byId.get(x.id).theme)).length;
        pairedTotals.candidate+=vNext.filter(x=>weak.has(byId.get(x.id).theme)).length;
        pairedTotals.opportunities++;
      }
    }
    const deck=P.start(state,exercises),selection=state.active?.selection||[];
    assert.equal(deck.length,10,name+' séance '+session+' : exactement 10 QCM');
    assert.equal(new Set(deck.map(x=>x.caseFamily||x.id)).size,10,
      name+' séance '+session+' : pas de doublon de famille');
    if(session===1||session===65||session===153){
      const restored=P.load(JSON.stringify({...state,active:null}));
      assert.deepEqual(P.select(exercises,restored,10),P.select(exercises,restored,10),
        'Sélection déterministe à état identique');
    }
    for(let i=0;i<deck.length;i++){
      const q=deck[i],sel=selection[i],prev=state.entries[q.id];
      assert.ok(session-1>=P.INTRO[q.theme],name+' prérequis '+q.id);
      assert.ok(sel&&sel.id===q.id,'Motif de sélection traçable');
      total.questions++;
      total.difficultySum+=q.difficulty;
      total.difficulty4plus+=Number(q.difficulty>=4);
      total.discoveries+=Number(sel.kind==='nouveau');
      total.reviews+=Number(sel.kind==='revision');
      total.directReviews+=Number(sel.kind==='revision'&&!!prev);
      total.alternativeReviews+=Number(sel.kind==='revision'&&!prev);
      total.repeats+=Number(!!prev);
      total.foundationQcm+=Number(foundations.has(q.theme));
      total.weakFoundationQcm+=Number(weak.has(q.theme));
      if(sel.kind==='revision'&&prev&&prev.streak===0){
        total.lateReviews+=Math.max(0,session-1-prev.due);
        total.lateReviewCount++;
      }
      seenIds.add(q.id);seenFamilies.add(q.caseFamily||q.id);
      themes.add(q.theme);contexts.add(q.theme+'|'+String(q.auction?.[0]||''));
      decisions.add(q.theme+'|'+String(q.answer||''));
      const a=answer(name,q,session);
      assert.ok(P.record(state,q,a.result,i,a.result==='correct'?q.answer:null,a.assisted,false));
    }
    assert.equal(P.finish(state,exercises),true);
    if(session===65||session===153){
      const saved=JSON.stringify(state),reload=P.load(saved);
      assert.equal(reload.completed,session,'Sauvegarde V1 rechargeable');
      assert.deepEqual(Object.keys(reload).sort(),Object.keys(state).sort(),
        'Aucune clé de sauvegarde ajoutée ou supprimée');
      stops[session]={
        qcm:total.questions,meanDifficulty:+(total.difficultySum/total.questions).toFixed(3),
        difficulty4plus:total.difficulty4plus,uniqueQcm:seenIds.size,
        uniqueFamilies:seenFamilies.size,contexts:contexts.size,decisions:decisions.size,
        repetitions:total.repeats,discoveries:total.discoveries,
        recalls:total.reviews,directRecalls:total.directReviews,
        alternativeRecalls:total.alternativeReviews,
        lateWeakRecallAverage:total.lateReviewCount?
          +(total.lateReviews/total.lateReviewCount).toFixed(2):0,
        foundationPct:+(100*total.foundationQcm/total.questions).toFixed(2),
        weakFoundationQcm:total.weakFoundationQcm,
        themesSeen:themes.size,unlocked:P.summary(state,exercises).unlocked
      };
      assert.equal(stops[session].unlocked,22,'Les 22 thèmes restent ouverts');
      assert.ok(stops[session].themesSeen>=18,'Découverte réellement maintenue');
    }
  }
  return {stops,pairedTotals};
}
// Contrôle ciblé indépendant du hasard des cinq profils.
(function targeted(){
  const state=BEFORE.empty();state.completed=20;
  state.journal=[{mode:'parcours',session:19,answers:[
    ...Array.from({length:6},(_,i)=>({id:'D'+i,theme:'mineur',result:'wrong',assisted:false,hadFreeError:false})),
    ...Array.from({length:30},(_,i)=>({id:'C'+i,theme:['ouv','majeur','sa','red','second'][i%5],
      result:'correct',assisted:false,hadFreeError:false}))
  ]}];
  const themes=['ouv','mineur','majeur','sa','red','second','stayman','roudi','intervenir','contre'];
  const pool=Array.from({length:240},(_,i)=>({id:'q-'+i,theme:themes[i%10],
    difficulty:2,answer:['1♣','1♦','1♥','1♠'][i%4],
    auction:['Partenaire : '+(i%2?'1♣':'1♦')],caseFamily:'F-'+i}));
  const count=items=>items.filter(x=>pool.find(q=>q.id===x.id).theme==='mineur').length;
  assert.equal(count(BEFORE.select(pool,state,10)),1);
  assert.equal(count(AFTER.select(pool,state,10)),2,
    'Un fondamental localement fragile reçoit davantage de situations nouvelles');
})();
const results={reference:'1736c99561dd83b0d9e279747066f32274ec8771',
  baselineBlob:blob(baselineSource),candidateBlob:blob(candidateSource),
  catalogue:exercises.length,catalogueChecksum,profiles:{}};
let localGain=0;
for(const name of names){
  const before=simulate(BEFORE,name,true),after=simulate(AFTER,name);
  results.profiles[name]={before:before.stops,after:after.stops,paired:before.pairedTotals};
  localGain+=before.pairedTotals.candidate-before.pairedTotals.baseline;
  for(const stop of [65,153]){
    const b=before.stops[stop],a=after.stops[stop];
    assert.equal(a.qcm,stop*10);
    assert.equal(a.unlocked,22);
    assert.ok(a.themesSeen>=b.themesSeen-2,name+' thèmes régressés');
    assert.ok(a.uniqueFamilies>=b.uniqueFamilies-(stop===65?25:60),name+' familles régressées');
    assert.ok(a.contexts>=b.contexts-8,name+' contextes régressés');
    assert.ok(a.difficulty4plus<=b.difficulty4plus+25,name+' difficultés 4+ régressées');
  }
  if(name==='tout_juste'||name==='echecs_persistants')
    assert.deepEqual(before.stops,after.stops,'Pas de modification si absence de fragilité locale isolée');
  console.log('VNEXT_PROFILE '+name+' '+JSON.stringify(results.profiles[name]));
}
assert.ok(localGain>0,'Amélioration locale mesurée sur états strictement identiques');
assert.equal(crypto.createHash('sha256').update(JSON.stringify(data.exercises)).digest('hex'),catalogueChecksum);
console.log('VNEXT_RESULT '+JSON.stringify({localGain,profiles:names.length,stops:[65,153],catalogue:exercises.length}));
console.log('VNEXT_EXPLORATION_ONLY — variante non retenue, moteur de référence inchangé');
