'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Quizz JSON data is embedded');
const data=JSON.parse(match[1]);
const exercises=data.exercises;
assert.equal(exercises.length,993,'All 969 previous exercises and 12 curated cases are retained');
assert.equal(data.themes.length,22,'Original 22 topics are retained');
assert.ok(html.includes('id="free-form"'),'A free response form precedes the choices');
assert.ok(html.includes('function normalizeBid('),'Bidding input parser exists');
assert.ok(html.includes('id="show-choices"'),'A reveal-choices button exists');
assert.ok(html.includes('Le SEF est notre référence unique.'),'The SEF is explicitly shown as the single reference system');
for(const x of exercises){
 for(const part of [x.context,x.explain,x.takeaway,x.whyNot?.reason]){
  assert.doesNotMatch(String(part||''),/accord de paire|accords SEF retenus|dans cet accord|dans ce système|^accord Walsh/i,'No pair-specific caveat in '+x.id);
 }
}

const contrasted=exercises.filter(x=>x.whyNot);
assert.ok(contrasted.length>=125,'Pedagogical contrasts from the focused SEF review are retained');
assert.equal(exercises.filter(x=>/^SEF-C-\d{3}$/.test(x.id)).length,12,'Twelve audited C01 situations');
assert.equal(exercises.filter(x=>/^SEF-C2-\d{3}$/.test(x.id)).length,12,'Twelve audited C02 convention situations');
const stayman6=exercises.find(x=>x.id==='SEF-V49-016');
assert.equal(stayman6?.h,6,'Boundary: six H in two four-card majors');
assert.equal(stayman6?.answer,'Passe','Classic SEF Stayman requires at least 8 H');
assert.ok(stayman6.choices.includes('2♣'),'The natural beginner temptation is still offered');
const stayman8=exercises.find(x=>x.id==='SEF-N096-1');
assert.equal(stayman8?.answer,'2♣','Contrasting hand at eight H still uses Stayman');
assert.ok(html.includes('archivedPreRevision:former')&&html.includes('pedagogicalRevision:revisedStaymanCode'),'Prior student progress is archived for corrected exercise');
const revisedRules={
 'SEF-V4-097-1':'2♥',
 'SEF-V4-103-1':'2♠',
 'SEF-V44-067':'2SA',
 'SEF-V44-068':'2SA'
};
for(const [id,bid] of Object.entries(revisedRules)){
 const x=exercises.find(z=>z.id===id);
 assert.equal(x?.answer,bid,'SEF 2024 Drury or 2SA after Passe: '+id);
 assert.ok(x?.whyNot?.reason&&x.takeaway,'SEF 2024 cases explain the tempting alternative: '+id);
}
for(const id of ['SEF-V44-067','SEF-V44-068']){
 const x=exercises.find(z=>z.id===id);
 assert.equal(x.auction.length,4,'Fit with singleton is announced directly by 2SA: '+id);
 assert.equal(x.shape[x.id==='SEF-V44-067'?1:0],4,'Four trump cards: '+id);
 assert.ok(x.shape.includes(1),'Singleton required for 2SA in third seat: '+id);
}
const nonForcing=exercises.filter(x=>/1SA\s*\(?forcing\)?/i.test(
 x.auction.join(' ')+x.context+x.explain+(x.difficultyReason||'')));
assert.deepEqual(nonForcing.map(x=>x.id),[],'SEF major-opening 1SA must be non forcing');
const ntReply=exercises.find(x=>x.id==='SEF-V421-004');
assert.equal(ntReply?.h,10,'Response of 1SA must not be 11 H with a major opening');
assert.ok(html.includes('revisedSefNov2026')&&html.includes('revisedSefProgress'),'Corrected SEF progress is archived without touching unrelated records');
for(const x of contrasted){
 assert.ok(x.whyNot?.bid&&x.whyNot?.reason&&x.takeaway,'Complete teaching contrast '+x.id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Comparison corresponds to an offered option: '+x.id);
 assert.notEqual(x.answer,x.whyNot.bid,'Comparison is not the right answer: '+x.id);
}
const known=new Set();
const themeIds=new Set(data.themes.map(x=>x.id));
const validRanks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const hcp={A:4,R:3,D:2,V:1};
for(const x of exercises){
 assert.ok(x.id&&!known.has(x.id),'Unique exercise ID: '+x.id);
 known.add(x.id);
 assert.ok(themeIds.has(x.theme),'Valid topic: '+x.id);
 assert.ok([1,2,3,4,5].includes(x.difficulty),'Valid level: '+x.id);
 assert.equal(x.hand.length,4,'Four suits: '+x.id);
 assert.equal(x.hand.flat().length,13,'Thirteen cards: '+x.id);
 assert.deepEqual(x.hand.map(a=>a.length),x.shape,'Correct shape: '+x.id);
 assert.equal(x.hand.flat().reduce((s,r)=>s+(hcp[r]||0),0),x.h,'Correct HCP: '+x.id);
 for(const suit of x.hand){
  assert.equal(new Set(suit).size,suit.length,'No duplicate rank in a suit: '+x.id);
  assert.ok(suit.every(r=>validRanks.has(r)),'Known cards: '+x.id);
 }
 assert.ok(Array.isArray(x.auction),'Auction is available: '+x.id);
 assert.ok(x.auction.every(c=>/^(Vous|Partenaire|Adversaire|Réponse)\s*:/.test(c)),'Auction speaker labels: '+x.id);
 assert.equal(x.choices.length,4,'Four answers: '+x.id);
 assert.equal(new Set(x.choices).size,4,'Unique answers: '+x.id);
 assert.ok(x.choices.includes(x.answer),'Correct answer is a choice: '+x.id);
 assert.ok(x.explain&&x.explain.trim(),'Explanation: '+x.id);
}
const script=html.match(/<script>\s*([\s\S]*?)<\/script><\/body>/);
assert.ok(script,'Application script is embedded');
new Function(script[1]);
for(const marker of [
 'function conventionNote(', 'function getRecord(', 'function recordAttempt(',
 'function adaptiveLevel(', 'function diverseTake(', 'function stats(',
 'function finishSession(', 'function skipCurrent(',
 'function render(', 'function choose(', 'id="selection-mode"',
 'session-navigation', 'context-note'
])assert.ok(html.includes(marker),'Expected new functionality: '+marker);
const annotated=exercises.filter(x=>x.auction.some(a=>/\([^)]*\)\s*$/.test(a)));
assert.ok(annotated.length>100,'Convention annotations are present in dataset');
console.log('Quizz integrity: PASS | '+exercises.length+' exercises, '+data.themes.length+' topics, '+annotated.length+' annotated situations');
