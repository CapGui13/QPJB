'use strict';
// Structural audit of every QPJB training exercise. Do not alter source texts.
// Partial hands are legitimate for suit-combination/impasse lessons.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(ROOT,'entrainement/training-data.js'),'utf8').trim();
assert(src.startsWith('const D=')&&src.endsWith(';'),'Training data must be a standalone JS object');
const D=JSON.parse(src.slice(8,-1));
const app=fs.readFileSync(path.join(ROOT,'entrainement/training-app.js'),'utf8');
const begin=app.indexOf('function seatFromLabel('),end=app.indexOf('function stripMeta(',begin);
assert(begin>=0&&end>begin,'Find actual card renderer and seat mapping');
const actual=new Function('esc','visibleAnswer',app.slice(begin,end)+
 ';return {buildCardSeats,renderCardDiagram,resolveLeadSeat,playerSeatFromExercise,parsePlayedCard,screenSeat};')(
 value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),()=>null);

const errors=[],warnings=[],ids=new Set();
const stats={bidding:0,play:0,cardQcm:0,legacyPlay:0,partialHands:0,
  openingLeadQuestions:0,visibleOpeningLeads:0,deliberateFourHandLessons:0,
  quarantined:0,renderedCardHands:0};
function error(id,code,detail){errors.push({id,code,detail})}
function warn(id,code,detail){warnings.push({id,code,detail})}
function cardKey(rank,suit){return suit+rank}
function rankChars(value){
  const chars=String(value||'').toUpperCase().replace(/10/g,'T').replace(/\s+/g,'');
  if(!/^[ARDVT98765432]*$/.test(chars))return null;
  return [...chars];
}
function checkId(ex,kind){
  if(typeof ex.id!=='string'||!ex.id.trim())error(kind,'missing-id','Invalid identifier');
  else if(ids.has(ex.id))error(ex.id,'duplicate-id','Identifier occurs more than once');
  else ids.add(ex.id);
}
for(const ex of D.bidding){
  stats.bidding++;checkId(ex,'bidding');
  if(!Array.isArray(ex.choices)||ex.choices.length<2)error(ex.id,'missing-choices','Need at least two replies');
  else {
    if(!ex.choices.includes(ex.correct))error(ex.id,'answer-missing','Correct reply absent from choices');
    if(ex.choices.some(c=>typeof c!=='string'||!c.trim()))
      error(ex.id,'blank-choice','Blank bidding answer');
    if(new Set(ex.choices.map(c=>c.trim())).size!==ex.choices.length)
      error(ex.id,'duplicate-choice','Two bidding answers are identical');
  }
}
const allowedFourHands=new Set([
  'JC-BH-031-Q01','JC-BH-031-Q02','JC-BH-031-Q03','JC-BH-031-Q04'
]);
for(const ex of D.play){
  stats.play++;checkId(ex,'play');
  if(ex.reviewStatus==='a_verifier'){
    stats.quarantined++;
    if(!ex.quarantineReason)error(ex.id,'missing-quarantine-reason','Unsafe exercise has no explanation');
  }
  if(ex.exerciseFormat!=='carte_qcm'){stats.legacyPlay++;continue}
  stats.cardQcm++;
  if(!Array.isArray(ex.options)||ex.options.length<2||ex.options.length>6||
      !Number.isInteger(ex.answerIndex)||ex.answerIndex<0||
      ex.answerIndex>=ex.options.length){
    error(ex.id,'bad-correct-index','Card QCM answer points outside options');
    continue;
  }
  if(ex.options.some(v=>typeof v!=='string'||!v.trim()))
    error(ex.id,'blank-card-choice','Blank card QCM answer');
  if(new Set(ex.options.map(v=>v.trim())).size!==ex.options.length)
    error(ex.id,'duplicate-card-choice','Identical answer texts');

  let seats,html,player;
  try{
    seats=actual.buildCardSeats(ex);
    player=actual.playerSeatFromExercise(ex,seats);
    html=actual.renderCardDiagram(ex);
  }catch(e){error(ex.id,'diagram-render-failed',String(e));continue}
  const visible=Object.entries(seats)
    .filter(([,h])=>h?.rows?.length>0).map(([p])=>p).sort();
  const shown=[...html.matchAll(/<section class="deal-seat (north|south|east|west)" data-seat="(north|south|east|west)"/g)]
    .map(m=>m[2]).sort();
  stats.renderedCardHands+=shown.length;
  if(JSON.stringify(visible)!==JSON.stringify(shown))
    error(ex.id,'hidden-hand-disclosed',JSON.stringify({sourceVisible:visible,rendered:shown}));
  const perspective=html.match(/\bdata-perspective="(north|south|east|west)"/)?.[1];
  if(perspective!==player)error(ex.id,'wrong-perspective',JSON.stringify({perspective,player}));
  if(visible.length>2){
    if(visible.length===4&&allowedFourHands.has(ex.id))stats.deliberateFourHandLessons++;
    else error(ex.id,'unexpected-visible-hands',visible.join(', '));
  }
  if(!visible.length)error(ex.id,'missing-hands','No cards visible in the exercise');
  const unique=new Set();
  for(const [seat,hand] of Object.entries(seats)){
    if(!hand?.rows?.length)continue;
    if(!['north','south','east','west'].includes(seat))error(ex.id,'invalid-seat',seat);
    let total=0,suits=new Set();
    for(const row of hand.rows){
      if(!'♠♥♦♣'.includes(row.suit)||row.suit.length!==1){
        error(ex.id,'invalid-suit',JSON.stringify({seat,row}));continue;
      }
      if(suits.has(row.suit))error(ex.id,'duplicate-suit-row',seat+' '+row.suit);
      suits.add(row.suit);
      const ranks=rankChars(row.ranks);
      if(!ranks){error(ex.id,'unrecognized-rank',JSON.stringify({seat,row}));continue}
      if(ranks.length>13)error(ex.id,'too-many-cards-in-suit',seat+' '+row.suit);
      total+=ranks.length;
      for(const rank of ranks){
        const key=cardKey(rank,row.suit);
        if(unique.has(key))error(ex.id,'duplicate-card',key+' shown more than once');
        unique.add(key);
      }
    }
    if(total>13)error(ex.id,'too-many-cards-in-hand',seat+' '+total);
    if(total<13)stats.partialHands++; // Intentional; never a blocking anomaly.
  }

  const lead=actual.parsePlayedCard(ex.lead);
  const renderedLeads=[...html.matchAll(/class="deal-played (north|south|east|west)" data-seat="(north|south|east|west)"/g)];
  if(!!lead!==!!renderedLeads.length ||
     (lead&&renderedLeads.length!==1))
    error(ex.id,'incorrect-lead-visibility',
      JSON.stringify({lead:ex.lead,shown:renderedLeads.length}));
  if(lead){
    stats.visibleOpeningLeads++;
    const actualSeat=actual.resolveLeadSeat(ex);
    if(renderedLeads[0]?.[2]!==actualSeat)
      error(ex.id,'wrong-lead-seat',JSON.stringify({expected:actualSeat,rendered:renderedLeads[0]?.[2]}));
    const wording=String(ex.prompt||'');
    if(/\bouest\s+entame\b/i.test(wording)&&actualSeat!=='west')
      error(ex.id,'west-opening-lead-lost',wording.slice(0,140));
    if(/\best\s+entame\b/i.test(wording)&&actualSeat!=='east')
      error(ex.id,'east-opening-lead-lost',wording.slice(0,140));
    // An opening lead must not be among declarer/dummy cards.
    // JC-BH-041-Q02 legitimately shows West's own lead in the initial hand.
    for(const [seat,hand] of Object.entries(seats)){
      const row=hand?.rows?.find(row=>row.suit===lead.suit);
      const ranks=rankChars(row?.ranks);
      if(ranks?.includes(lead.rank.replace('10','T'))&&seat!==actualSeat)
        error(ex.id,'lead-in-opponent-hand',ex.lead+' appears in '+seat);
    }
    if(html.includes('lead-at-top')){
      const expectedTop=actual.screenSeat(actualSeat,player);
      if(expectedTop!=='north'||!html.includes('deal-leader-group'))
        error(ex.id,'top-lead-not-under-leader','Opening lead not anchored to the top player');
    }
  }

  if(ex.topic==='Entame'){
    stats.openingLeadQuestions++;
    const correct=actual.parsePlayedCard(ex.options[ex.answerIndex]);
    if(!correct){error(ex.id,'unparseable-expected-lead',ex.options[ex.answerIndex]);continue}
    const hand=seats[player];
    if(!hand?.rows?.length){error(ex.id,'opening-lead-hand-missing',player);continue}
    const row=hand.rows.find(row=>row.suit===correct.suit);
    if(!rankChars(row?.ranks)?.includes(correct.rank.replace('10','T')))
      error(ex.id,'expected-lead-not-in-hand',ex.options[ex.answerIndex]+' is absent from '+player);
  }
}

// Vérification du lot 02 de jeu de la carte : la source peut montrer une main
// incomplète, mais jamais une carte identique à deux joueurs distincts.
const lot02CardLessons=D.play.filter(x=>String(x.playEditorialStatus||'').startsWith('lot02_'));
if(lot02CardLessons.length!==17)
  error('lot02','missing-card-lessons','Expected 17 imported card exercises, found '+lot02CardLessons.length);
for(const ex of lot02CardLessons){
  if(!Array.isArray(ex.holdings)||ex.holdings.length!==2)
    error(ex.id,'lot02-missing-known-hands','Only two genuine known hands may be displayed');
  const seen=new Set();
  for(const hand of ex.holdings||[]){
    let count=0;
    for(const row of hand.rows||[]){
      const rr=rankChars(row.ranks);
      if(!rr){error(ex.id,'lot02-invalid-rank',JSON.stringify(row));continue;}
      count+=rr.length;
      for(const rank of rr){
        const card=cardKey(rank,row.suit);
        if(seen.has(card))error(ex.id,'lot02-duplicate-card',card+' appears in two hands');
        seen.add(card);
      }
    }
    if(count>13)error(ex.id,'lot02-too-many-cards',hand.label+': '+count);
  }
  const seats=actual.buildCardSeats(ex);
  const player=actual.playerSeatFromExercise(ex,seats);
  if(ex.id==='JC-BH-129-01'&&
      (player!=='west'||!seats.west?.rows?.some(r=>r.suit==='♠'&&r.ranks==='AR1054')||
       !!seats.east?.rows?.length))
    error(ex.id,'lot02-wrong-defender','BH-129 source is played by West with ♠AR1054');
  if(ex.id==='JC-BH-131-01'&&player!=='east')
    error(ex.id,'lot02-wrong-defender','BH-131 source is played by East');
  if(ex.id==='JC-BH-135-J01'&&
      (!ex.sourceAudit?.suitIssue?.includes('♣6 dupliqué')||
       !ex.prompt.includes('mains affichées sont donc partielles')||
       !seats.north?.rows?.some(r=>r.suit==='♣'&&r.ranks==='9842')||
       !seats.south?.rows?.some(r=>r.suit==='♣'&&r.ranks==='A103')))
    error(ex.id,'lot02-unaltered-source-duplicate','BH-135 must not invent which hand owns ♣6');
}


// Lot 03 : les dix plans libres doivent conserver uniquement Nord et Sud,
// sans doublon de carte, et garder leur entame (BH-074 = ♠5 par Ouest).
const expectedLot03CardIds=[
 'JC-BH-056-P2','JC-BH-057-P2','JC-BH-063-P2','JC-BH-065-P2',
 'JC-BH-066-P2','JC-BH-068-P2','JC-BH-074-P2','JC-BH-075-P2',
 'JC-BH-076-P2','JC-BH-078-P2'
];
const lot03Cards=D.play.filter(x=>x.playEditorialStatus==='lot03_double_lecture_20261106');
if(lot03Cards.length!==10)
 error('lot03','wrong-card-count','Expected 10 new plan-libre lessons, got '+lot03Cards.length);
if(JSON.stringify(lot03Cards.map(x=>x.id))!==JSON.stringify(expectedLot03CardIds))
 error('lot03','card-selection-changed','Only the 10 double-reviewed original references may be added');
for(const ex of lot03Cards){
 if(ex.exerciseFormat==='carte_qcm'||ex.options?.length)
  error(ex.id,'lot03-wrong-format','A free-response plan must not be a single-answer QCM');
 if(!Array.isArray(ex.holdings)||ex.holdings.length!==2){
  error(ex.id,'lot03-hidden-hand-risk','Only two source-proven hands are allowed');continue;
 }
 const seen=new Set(),seats=actual.buildCardSeats(ex);
 const known=Object.entries(seats).filter(([,h])=>h?.rows?.length);
 if(known.length!==2||!seats.north||!seats.south||seats.east||seats.west)
  error(ex.id,'lot03-wrong-seats',JSON.stringify(known.map(([p])=>p)));
 if(actual.playerSeatFromExercise(ex,seats)!=='south')
  error(ex.id,'lot03-wrong-declarer','South must be the visible declarer');
 for(const h of ex.holdings){
  let total=0;
  for(const row of h.rows){
   const ranks=rankChars(row.ranks);
   if(!ranks){error(ex.id,'lot03-bad-rank',JSON.stringify(row));continue}
   total+=ranks.length;
   for(const rank of ranks){
    const card=cardKey(rank,row.suit);
    if(seen.has(card))error(ex.id,'lot03-duplicate-known-card',card);
    seen.add(card);
   }
  }
  if(total!==13)error(ex.id,'lot03-incomplete-source-hand',h.label+' has '+total);
 }
 if(!ex.prompt?.trim()||!ex.answerText?.trim()||!ex.sourceAudit?.known_hands_only)
  error(ex.id,'lot03-missing-source-or-solution','Plan and source must be documented');
 if(ex.id==='JC-BH-074-P2'&&
   (ex.lead!=='♠5 (Ouest)'||!ex.prompt.includes('♠9 d’Est')||
    !ex.prompt.includes('♠R')))
  error(ex.id,'lot03-lead-sequence','Only opening lead ♠5 is shown on the diagram');
}

if(stats.bidding!==627||stats.play!==185||stats.cardQcm!==84)
  error('dataset','unexpected-counts',JSON.stringify(stats));
if(stats.openingLeadQuestions!==24)
  error('dataset','opening-lead-lessons-missing',String(stats.openingLeadQuestions));
if(stats.quarantined!==0)
  error('dataset','unexpected-active-quarantine',String(stats.quarantined));
for(const id of allowedFourHands){
  if(!D.play.some(ex=>ex.id===id))
    error(id,'missing-four-hand-exception','Known full-diagram lesson removed');
}
const report={result:errors.length?'FAIL':'PASS',stats,errors,warnings,
  note:'Vérification structurelle et géométrique. Ne certifie pas les raisonnements ni les corrigés pédagogiques.'};
const out=path.join(ROOT,'artifacts','training-integrity');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log('QPJB card integrity: '+JSON.stringify({result:report.result,stats,errors:errors.length,warnings:warnings.length}));
if(errors.length){console.error(JSON.stringify(errors.slice(0,35),null,2));process.exitCode=1}
