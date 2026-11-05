'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Quizz JSON data is embedded');
const data=JSON.parse(match[1]);
const exercises=data.exercises;
const {createHash}=require('node:crypto');
const historical=require('./quizz-baseline-993-gitsha.json');
assert.ok(exercises.length>=historical.count,'The 993 historical exercises must be preserved');
const oldPayload=JSON.stringify(require('./quizz-v488-approved-revisions.cjs').normalizedPrefix(exercises,historical.count));
const oldGitSha=createHash('sha1').update('blob '+Buffer.byteLength(oldPayload,'utf8')+'\0'+oldPayload,'utf8').digest('hex');
assert.equal(oldGitSha,historical.gitBlobSha,'The 993 historical exercises MUST remain byte-for-byte unchanged as JSON objects');
assert.ok(exercises.length>=historical.count,'All 969 previous exercises and 12 curated cases are retained');
assert.equal(data.themes.length,22,'Original 22 topics are retained');
assert.ok(html.includes('id="free-form"'),'A free response form precedes the choices');
assert.ok(html.includes('function normalizeBid('),'Bidding input parser exists');
assert.ok(html.includes('id="show-choices"'),'A reveal-choices button exists');
assert.ok(html.includes('Le SEF est notre référence unique.'),'The SEF is explicitly shown as the single reference system');
for(const x of exercises){
 for(const part of [x.context,x.explain]){
  assert.doesNotMatch(String(part||''),/accord de paire|accords SEF retenus|dans cet accord|dans ce système|^accord Walsh/i,'No pair-specific caveat in '+x.id);
 }
}

assert.ok(exercises.every(x=>!x.whyNot&&!x.takeaway),'Only correct-bid explanations are stored');

// V4.56 — 40 redemandes relues, trois questions conditionnelles sous Walsh.
const reviewedV457 = exercises.filter(x=>x.pedagogicalReview20261104V457);
assert.equal(reviewedV457.length,58,'V4.57 : 58 redemandes examinees');
assert.equal(reviewedV457.filter(x=>x.context.includes('Walsh actif.')).length,3,'V4.57 : trois contextes Walsh');
for(const ex of reviewedV457){
 assert.equal(ex.theme,'red','V4.57 rubrique');
 assert.equal(ex.hand.flat().length,13,'V4.57 13 cartes');
 assert.deepEqual(ex.hand.map(h=>h.length),ex.shape,'V4.57 distribution');
 assert.equal(ex.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0),ex.h,'V4.57 points H');
 assert.equal(ex.choices.length,4,'V4.57 quatre choix');
 assert.equal(new Set(ex.choices).size,4,'V4.57 choix distincts');
 assert.ok(ex.choices.includes(ex.answer),'V4.57 bonne enchere presente');
 assert.equal(ex.pedagogicalReview20261104V457.answerUnchanged,true,'V4.57 reponse conservee');
 assert.ok(ex.sourceOriginalExplain20261104V457&&ex.explain!==ex.sourceOriginalExplain20261104V457,'V4.57 ancien corrige archive');
 assert.ok(ex.sourceOriginalContext20261104V457&&ex.context!==ex.sourceOriginalContext20261104V457,'V4.57 ancien contexte archive');
 assert.ok(ex.context.startsWith('Vous avez ouvert de '),'V4.57 vouvoiement');
}
assert.match(exercises.find(x=>x.id==='SEF-V412-002').explain,/mini-maxi/,'V4.57 2SA mini-maxi');
assert.match(exercises.find(x=>x.id==='SEF-V416-003').explain,/forcing de manche/,'V4.57 bicolore a saut');
assert.match(exercises.find(x=>x.id==='SEF-V413-013').explain,/ne garantit pas/,'V4.57 2K ne promet pas six cartes');

const reviewedV456 = [{"id":"SEF-042-2","answer":"1♠","ctx":true,"edited":true,"walsh":false},{"id":"SEF-043-1","answer":"1♠","ctx":true,"edited":true,"walsh":false},{"id":"SEF-043-3","answer":"1♠","ctx":true,"edited":true,"walsh":false},{"id":"SEF-044-1","answer":"1SA","ctx":true,"edited":true,"walsh":false},{"id":"SEF-044-2","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-045-1","answer":"2SA","ctx":true,"edited":true,"walsh":false},{"id":"SEF-046-1","answer":"2SA","ctx":true,"edited":true,"walsh":false},{"id":"SEF-047-1","answer":"1SA","ctx":false,"edited":true,"walsh":true},{"id":"SEF-048-1","answer":"2♥","ctx":true,"edited":false,"walsh":false},{"id":"SEF-049-1","answer":"2♥","ctx":true,"edited":true,"walsh":false},{"id":"SEF-049-2","answer":"2♥","ctx":true,"edited":true,"walsh":false},{"id":"SEF-050-2","answer":"2♠","ctx":true,"edited":true,"walsh":false},{"id":"SEF-051-1","answer":"2♦","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N106-1","answer":"2♥","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N106-2","answer":"2♥","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N107-2","answer":"2♠","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N108-1","answer":"2♥","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N109-1","answer":"2♠","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N110-1","answer":"1♠","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N111-1","answer":"1♠","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N112-2","answer":"1SA","ctx":false,"edited":true,"walsh":true},{"id":"SEF-N113-1","answer":"1SA","ctx":false,"edited":true,"walsh":true},{"id":"SEF-N114-1","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N115-1","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N116-1","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N117-1","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N118-1","answer":"2SA","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N119-2","answer":"2SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N120-1","answer":"2SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N121-1","answer":"2♥","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N122-1","answer":"2♥","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N123-2","answer":"2♠","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N123-1","answer":"2♠","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N124-1","answer":"1SA","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N125-1","answer":"2♦","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N126-1","answer":"2♣","ctx":true,"edited":false,"walsh":false},{"id":"SEF-N127-2","answer":"2♥","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N128-2","answer":"2♦","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N129-2","answer":"2♣","ctx":true,"edited":true,"walsh":false},{"id":"SEF-N130-1","answer":"2♦","ctx":false,"edited":true,"walsh":false}];
assert.equal(reviewedV456.length,40,'V4.56 : 40 redemandes');
assert.equal(reviewedV456.filter(x=>x.ctx).length,36,'V4.56 : 36 contextes archives');
assert.equal(reviewedV456.filter(x=>x.edited).length,20,'V4.56 : 20 corriges archives');
assert.equal(reviewedV456.filter(x=>x.walsh).length,3,'V4.56 : trois questions conditionnelles Walsh');
for(const row of reviewedV456){
 const x=exercises.find(y=>y.id===row.id);
 assert.ok(x&&x.theme==='red','V4.56 rubric and ID: '+row.id);
 assert.equal(x.answer,row.answer,'V4.56 answer preserved: '+row.id);
 assert.equal(x.hand.flat().length,13,'V4.56 thirteen cards: '+row.id);
 assert.equal(x.choices.length,4,'V4.56 four choices: '+row.id);
 assert.equal(new Set(x.choices).size,4,'V4.56 unique choices: '+row.id);
 assert.ok(x.choices.includes(x.answer),'V4.56 expected choice present: '+row.id);
 const expectedH=x.hand.flat().reduce((v,c)=>v+({A:4,R:3,D:2,V:1}[c]||0),0);
 assert.equal(x.h,expectedH,'V4.56 HCP verified: '+row.id);
 assert.deepEqual(x.hand.map(h=>h.length),x.shape,'V4.56 distribution verified: '+row.id);
 assert.equal(x.pedagogicalReview20261104V456?.answerUnchanged,true,'V4.56 stable answer: '+row.id);
 assert.equal(x.pedagogicalReview20261104V456?.editorialChange,row.edited,'V4.56 editorial flag: '+row.id);
 assert.equal(x.pedagogicalReview20261104V456?.contextEdited,row.ctx,'V4.56 context flag: '+row.id);
 if(row.ctx){
  assert.ok(x.sourceOriginalContext20261104V456?.startsWith('Tu as ouvert'),'V4.56 original context stored: '+row.id);
  assert.ok(x.context.startsWith('Vous avez ouvert'),'V4.56 vouvoiement: '+row.id);
 }
 if(row.edited){assert.ok(x.sourceOriginalExplain20261104V456&&x.explain!==x.sourceOriginalExplain20261104V456,'V4.56 prior explain stored: '+row.id);}
 if(row.walsh){
  assert.match(x.context,/Walsh actif/,'V4.56 explicit Walsh condition: '+row.id);
  assert.equal(x.answer,'1SA','V4.56 Walsh 1NT conditional: '+row.id);
  assert.equal(x.pedagogicalReview20261104V456.verdict,'coherent_sous_walsh_explicite_reserve_referentiel','V4.56 conditional not certified SEF: '+row.id);
 }
}

const reviewedV455 = [{"id":"SEF-001-1","expected":"1SA","edited":false},{"id":"SEF-001-2","expected":"1SA","edited":false},{"id":"SEF-002-3","expected":"1SA","edited":true},{"id":"SEF-002-1","expected":"1SA","edited":true},{"id":"SEF-003-2","expected":"1SA","edited":true},{"id":"SEF-003-1","expected":"1SA","edited":true},{"id":"SEF-004-1","expected":"2SA","edited":false},{"id":"SEF-005-1","expected":"2SA","edited":false},{"id":"SEF-005-2","expected":"2SA","edited":false},{"id":"SEF-006-2","expected":"1♠","edited":false},{"id":"SEF-006-1","expected":"1♠","edited":false},{"id":"SEF-007-1","expected":"1♥","edited":false},{"id":"SEF-007-2","expected":"1♥","edited":false},{"id":"SEF-008-2","expected":"1♠","edited":true},{"id":"SEF-009-1","expected":"1♦","edited":false},{"id":"SEF-009-2","expected":"1♦","edited":false},{"id":"SEF-010-3","expected":"1♣","edited":false},{"id":"SEF-010-1","expected":"1♣","edited":false},{"id":"SEF-011-2","expected":"1♦","edited":true},{"id":"SEF-012-1","expected":"1♣","edited":true},{"id":"SEF-013-1","expected":"Passe","edited":false},{"id":"SEF-013-2","expected":"Passe","edited":false},{"id":"SEF-014-1","expected":"Passe","edited":true},{"id":"SEF-014-2","expected":"Passe","edited":false}];
assert.equal(reviewedV455.length,24,'V4.55: 24 ouvertures revues');
assert.equal(reviewedV455.filter(x=>x.edited).length,8,'V4.55: huit corriges enrichis');
for(const item of reviewedV455){
 const x=exercises.find(z=>z.id===item.id);
 assert.ok(x&&x.theme==='ouv','V4.55 ID et rubrique : '+item.id);
 assert.equal(x.answer,item.expected,'V4.55 reponse stable : '+item.id);
 assert.equal(x.choices.length,4,'V4.55 quatre choix : '+item.id);
 assert.equal(x.pedagogicalReview20261104V455?.answerUnchanged,true,'V4.55 reponse ancienne : '+item.id);
 assert.equal(x.pedagogicalReview20261104V455?.editorialChange,item.edited,'V4.55 edition tracee : '+item.id);
 assert.match(x.sourceOriginalContext20261104V455,/^Tu es donneur/,'V4.55 contexte archive : '+item.id);
 assert.match(x.context,/^Vous êtes donneur/,'V4.55 vouvoiement : '+item.id);
 if(item.edited)assert.ok(x.sourceOriginalExplain20261104V455&&x.explain!==x.sourceOriginalExplain20261104V455,'V4.55 ancien corrige archive : '+item.id);
}
const counterV455=[
 {id:'SEF-V417-008',answer:'4♠',prior:'reserve_option_3pique_exploration_chelem'},
 {id:'SEF-V426-004',answer:'Passe',prior:'reserve_relais_2sa_non_propose'}
];
assert.equal(counterV455.length,2,'V4.55 contre expertises');
for(const row of counterV455){
 const x=exercises.find(x=>x.id===row.id);
 assert.ok(x,'V4.55 reserve : '+row.id);
 assert.equal(x.answer,row.answer,'V4.55 ancienne reponse maintenue : '+row.id);
 assert.equal(x.pedagogicalCounterExpertise20261104V455?.answerUnchanged,true,'V4.55 progression intacte : '+row.id);
 assert.equal(x.pedagogicalCounterExpertise20261104V455?.previousVerdict,row.prior,'V4.55 ancienne reserve tracee : '+row.id);
 assert.ok(x.pedagogicalCounterExpertise20261104V455?.verdict.startsWith('reserve_levee_'),'V4.55 reserve levee : '+row.id);
 assert.ok(x.sourceOriginalExplain20261104V455&&x.explain!==x.sourceOriginalExplain20261104V455,'V4.55 ancien texte archive : '+row.id);
}

const reviewedV454 = [{"id":"SEF-V3-047-4","answer":"Contre","sourceAnswer":null,"edited":true},{"id":"SEF-V3-053-1","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V3-053-3","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V4-046-3","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V4-046-1","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V4-047-1","answer":"4♥","sourceAnswer":null,"edited":true},{"id":"SEF-V4-065-1","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V4-065-2","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V4-069-1","answer":"Contre","sourceAnswer":null,"edited":true},{"id":"SEF-V44-002","answer":"2♣","sourceAnswer":null,"edited":true},{"id":"SEF-V44-007","answer":"3SA","sourceAnswer":null,"edited":true},{"id":"SEF-V44-011","answer":"4♥","sourceAnswer":null,"edited":true},{"id":"SEF-V44-012","answer":"4♠","sourceAnswer":null,"edited":true},{"id":"SEF-V44-013","answer":"4SA","sourceAnswer":null,"edited":false},{"id":"SEF-V44-014","answer":"3SA","sourceAnswer":"4SA","edited":true},{"id":"SEF-V44-015","answer":"2♦","sourceAnswer":null,"edited":false},{"id":"SEF-V44-016","answer":"2♥","sourceAnswer":null,"edited":false},{"id":"SEF-V49-017","answer":"2♥","sourceAnswer":null,"edited":false},{"id":"SEF-V411-014","answer":"4♥","sourceAnswer":null,"edited":true},{"id":"SEF-V411-015","answer":"4♠","sourceAnswer":null,"edited":true},{"id":"SEF-V412-016","answer":"Passe","sourceAnswer":null,"edited":true},{"id":"SEF-V417-002","answer":"2♥","sourceAnswer":null,"edited":true},{"id":"SEF-V418-004","answer":"Contre","sourceAnswer":null,"edited":false},{"id":"SEF-V418-007","answer":"2♦","sourceAnswer":null,"edited":true},{"id":"SEF-V419-001","answer":"1♠","sourceAnswer":null,"edited":false},{"id":"SEF-V420-002","answer":"2♠","sourceAnswer":null,"edited":true},{"id":"SEF-V422-004","answer":"3♠","sourceAnswer":null,"edited":true},{"id":"SEF-V425-004","answer":"2♠","sourceAnswer":null,"edited":true}];
assert.equal(reviewedV454.length,28,'V4.54 28 revues et 1 correction');
assert.equal(reviewedV454.filter(x=>x.sourceAnswer).length,1,'Une seule bonne enchere modifiee');
assert.equal(reviewedV454.filter(x=>x.edited).length,22,'22 textes eleves modifies et archives');
for(const row of reviewedV454){
 const x=exercises.find(e=>e.id===row.id);
 assert.ok(x,'V4.54 ID conserve : '+row.id);
 assert.equal(x.answer,row.answer,'V4.54 reponse finale : '+row.id);
 assert.equal(x.choices.length,4,'V4.54 4 choix conserves : '+row.id);
 assert.equal(x.pedagogicalReview20261104V454?.answerUnchanged,!row.sourceAnswer,'V4.54 trace de correction : '+row.id);
 assert.equal(x.pedagogicalReview20261104V454?.editorialChange,row.edited,'V4.54 changement de texte trace : '+row.id);
 if(row.edited)assert.ok(x.sourceOriginalExplain20261104V454&&x.explain!==x.sourceOriginalExplain20261104V454,'V4.54 corrigé archivé : '+row.id);
 if(row.sourceAnswer)assert.equal(x.sourceOriginalAnswer20261104V454,row.sourceAnswer,'V4.54 ancienne enchere archivee : '+row.id);
}
const quant=exercises.find(x=>x.id==='SEF-V44-014');
assert.equal(quant.answer,'3SA','2SA+11H: enchere SEF 3SA');
assert.equal(quant.sourceOriginalAnswer20261104V454,'4SA','Ancien 4SA archive');
assert.match(quant.explain,/12 H/,'4SA quantitatif exige 12 H sur 2SA');
assert.ok(html.includes("'SEF-V44-014':'sef-2026-11-04-2nt-11h-3nt-correction'"),'Migration progressive de cette seule correction');
assert.ok(html.includes('archivedPreRevision:former')&&html.includes('revisedSefProgress'),'Archivage ancien historique de cet exercice');

const reviewedV453 = [{"id":"SEF-V3-080-1","answer":"2♠","edited":true},{"id":"SEF-V3-080-2","answer":"2♠","edited":true},{"id":"SEF-V3-085-3","answer":"Passe","edited":true},{"id":"SEF-V3-086-1","answer":"Passe","edited":true},{"id":"SEF-V3-086-2","answer":"Passe","edited":true},{"id":"SEF-V3-089-2","answer":"Passe","edited":true},{"id":"SEF-V3-089-1","answer":"Passe","edited":true},{"id":"SEF-V3-090-2","answer":"Passe","edited":true},{"id":"SEF-V44-041","answer":"1♠","edited":false},{"id":"SEF-V410-025","answer":"1♠","edited":false},{"id":"SEF-V410-028","answer":"1SA","edited":false},{"id":"SEF-V411-013","answer":"2♦","edited":false},{"id":"SEF-V412-017","answer":"1♠","edited":false},{"id":"SEF-V413-010","answer":"1♠","edited":false},{"id":"SEF-V413-011","answer":"1SA","edited":false},{"id":"SEF-V417-010","answer":"Contre","edited":false},{"id":"SEF-V417-011","answer":"2♦","edited":false},{"id":"SEF-V418-005","answer":"1♠","edited":false},{"id":"SEF-V419-007","answer":"3♥","edited":true},{"id":"SEF-V420-009","answer":"1♥","edited":false},{"id":"SEF-V420-010","answer":"2♦","edited":false},{"id":"SEF-V420-011","answer":"2♥","edited":false},{"id":"SEF-V421-008","answer":"2♠","edited":false},{"id":"SEF-V425-006","answer":"2SA","edited":false},{"id":"SEF-V425-008","answer":"3♣","edited":false}];
assert.equal(reviewedV453.length,25,'V4.53 : 25 revues apres intervention');
for(const rec of reviewedV453){
 const ex=exercises.find(x=>x.id===rec.id);
 assert.ok(ex&&ex.theme==='apres_inter','V4.53 theme et ID : '+rec.id);
 assert.equal(ex.answer,rec.answer,'V4.53 reponse conservee : '+rec.id);
 assert.equal(ex.pedagogicalReview20261104V453?.answerUnchanged,true,'V4.53 progression preservee : '+rec.id);
 assert.equal(ex.pedagogicalReview20261104V453?.verdict,'reponse_coherente_dans_les_choix','V4.53 verdict : '+rec.id);
 assert.equal(ex.pedagogicalReview20261104V453?.editorialChange,rec.edited,'V4.53 changement trace : '+rec.id);
 if(rec.edited){assert.ok(ex.sourceOriginalExplain20261104V453&&ex.sourceOriginalExplain20261104V453!==ex.explain,'V4.53 texte anterieur archive : '+rec.id);}
}

const reviewedV452 = [{"id":"SEF-V4-009-1","expected":"3♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-010-1","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-011-1","expected":"3♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-012-1","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-021-1","expected":"3♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-022-3","expected":"4♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-023-3","expected":"3♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V4-024-2","expected":"4♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V416-005","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V416-006","expected":"3♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V423-003","expected":"3♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-N140-1","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V44-022","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-023","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-024","expected":"4♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-025","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-026","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-028","expected":"1SA","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V49-039","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V410-018","expected":"2♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V410-019","expected":"2SA","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V411-010","expected":"4♥","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V411-019","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V411-020","expected":"4♠","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V411-021","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V412-005","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V413-006","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V417-007","expected":"Passe","review":"reponse_coherente_dans_les_choix"},{"id":"SEF-V417-008","expected":"4♠","review":"reserve_option_3pique_exploration_chelem"},{"id":"SEF-V418-003","expected":"3SA","review":"reponse_coherente_dans_les_choix"}];
assert.equal(reviewedV452.length,30,'V4.52 Quizz : 30 revues');
for (const review of reviewedV452) {
 const ex=exercises.find(x=>x.id===review.id);
 assert.ok(ex,'Exercice Quizz manquant : '+review.id);
 assert.equal(ex.answer,review.expected,'Bonne enchère préservée : '+review.id);
 assert.equal(ex.choices.length,4,'QCM conservé : '+review.id);
 assert.equal(ex.pedagogicalReview20261104?.answerUnchanged,true,'Réponse élève stable : '+review.id);
 assert.equal(ex.pedagogicalReview20261104.verdict,review.review,'Verdict traçable : '+review.id);
 if(ex.pedagogicalReview20261104.editorialChange) {
  assert.ok(ex.sourceOriginalExplain20261104&&ex.explain!==ex.sourceOriginalExplain20261104,'Ancien corrigé conservé : '+review.id);
 }
}


// Quizz V4.51 : 31 reponses au Contre, distinction entre Passe adverse et soutien adverse.
const counterReviewed=["SEF-V3-057-1","SEF-V3-057-4","SEF-V3-058-3","SEF-V3-058-1","SEF-V3-059-5","SEF-V3-059-1","SEF-V3-060-2","SEF-V3-060-1","SEF-V3-061-2","SEF-V3-061-3","SEF-V3-062-4","SEF-V3-062-1","SEF-V3-063-1","SEF-V3-063-2","SEF-V3-064-4","SEF-V3-064-2","SEF-V3-065-3","SEF-V3-066-4","SEF-V3-067-4","SEF-V3-068-4","SEF-V3-069-1","SEF-V3-070-2","SEF-V3-071-3","SEF-V3-072-1","SEF-V3-073-1","SEF-V49-030","SEF-V49-031","SEF-V419-008","SEF-V421-009","SEF-V422-005","SEF-C-010"];
assert.equal(counterReviewed.length,31,'31 counter-review entries expected');
for(const id of counterReviewed){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x&&x.pedagogicalReview20261103V451?.answerUnchanged===true,'Counter answer preserved '+id);
 assert.ok(x.sourceOriginalExplain20261103V451&&x.explain!==x.sourceOriginalExplain20261103V451,'Counter explanation archived '+id);
 assert.equal(x.choices.length,4,'Four options preserved '+id);
 const rightHandPassed=x.auction.at(-1)==='Adversaire : Passe';
 assert.equal(x.pedagogicalReview20261103V451.context,rightHandPassed?'obligatoire_apres_passe':'libre_apres_soutien','Counter logic '+id);
 assert.ok(rightHandPassed?x.explain.includes('Passe convertirait')||x.explain.includes('Passe transformerait')||x.explain.includes('Passer transformerait'):x.explain.includes('plus obligatoire')||x.explain.includes('facultatif')||x.explain.includes('supprime'), 'Pass explanation '+id);
}


// Quizz V4.50 : sept précisions de seuils, sans changement d'enchère ni de QCM.
for(const id of ["SEF-024-2","SEF-024-1","SEF-N034-1","SEF-N044-2","SEF-N044-1","SEF-N098-1","SEF-N098-2"]){
 const ex=exercises.find(x=>x.id===id);
 assert.ok(ex&&ex.answer==='Passe','Réponse SEF conservée pour '+id);
 assert.equal(ex.choices.length,4,'Quatre choix conservés pour '+id);
 assert.ok(ex.sourceOriginalExplain20261103V450&&ex.sourceOriginalExplain20261103V450!==ex.explain,"Corrigé d'origine archivé pour "+id);
 assert.equal(ex.pedagogicalReview20261103V450?.answerUnchanged,true,'Aucune ancienne bonne réponse modifiée : '+id);
}


// Revue Quizz du 3 novembre : 2 atouts face à une ouverture de 2 majeur faible
// promettant 6 cartes = fit huitième, sans invitation obligatoire.
for(const [id,suit,h] of [['SEF-V3-106-1',0,2],['SEF-V3-106-2',0,6],['SEF-V3-103-4',1,4],['SEF-V3-103-3',1,6]]){
 const ex=exercises.find(x=>x.id===id);
 assert.ok(ex&&ex.answer==='Passe'&&ex.hand[suit].length===2&&ex.h===h,'Barrage source unchanged: '+id);
 assert.equal(ex.sourceOriginalExplain20261103,'Sans fit ni force suffisante, Passe sur l’ouverture de 2 faible évite de monter inutilement.','Original wording archived: '+id);
 assert.ok(ex.explain.includes('huit atouts')&&ex.explain.includes('Passe')&&!ex.explain.includes('Sans fit ni force'),'Correct eight-trump explanation: '+id);
 assert.equal(ex.pedagogicalReview20261103?.answerUnchanged,true,'No change to correct answer: '+id);
}


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
// V4.36 : 1SA est non forcing ; « Passe » ne doit plus être traité comme un
// distracteur absolument faux pour les onze redemandes à la couleur auditées.
const freeNtRebids={
 'SEF-049-1':['2♥','3♥'], 'SEF-049-2':['2♥','3♥'],
 'SEF-050-2':['2♠','3♠'], 'SEF-N122-1':['2♥','3♥'],
 'SEF-N123-2':['2♠','3♠'], 'SEF-N123-1':['2♠','3♠'],
 'SEF-N127-2':['2♥','3♥'], 'SEF-N128-2':['2♦','3♦'],
 'SEF-N129-2':['2♣','3♣'], 'SEF-N131-1':['2♣','3♣'],
 'SEF-V410-005':['2♦','3♦']
};
for(const [id,[correct,jump]] of Object.entries(freeNtRebids)){
 const x=exercises.find(z=>z.id===id);
 assert.ok(x,'Reviewed opening major rebid exists: '+id);
 assert.equal(x.answer,correct,'Maintain correct SEF economical rebid: '+id);
 assert.ok(x.choices.includes(jump),'The tempting but excessive jump is offered: '+id);
 assert.ok(!x.choices.includes('Passe'),'Nonforcing pass is not falsely presented as categorically illegal: '+id);
 assert.match(x.context,/non forcing/i,'The learner sees the SEF nonforcing rule: '+id);
 
}
// V4.37 : corriger les réponses caricaturales 2SA avec 0 à 4 H après
// intervention adverse. Ne pas déplacer les bonnes réponses ni les IDs.
const reviewedWeakResponses={
 'SEF-V3-085-3':'2♣',
 'SEF-V3-086-1':'2♦','SEF-V3-086-2':'2♦',
 'SEF-V3-087-3':'2♦','SEF-V3-087-2':'2♦',
 'SEF-V3-088-2':'2♥','SEF-V3-088-1':'2♥'
};
const weakReviewIds=[
 'SEF-V3-053-1','SEF-V3-053-3','SEF-V3-080-1','SEF-V3-080-2',
 ...Object.keys(reviewedWeakResponses),
 'SEF-V3-089-2','SEF-V3-089-1','SEF-V3-106-1','SEF-V3-106-2',
 'SEF-V4-065-1','SEF-V4-065-2','SEF-V4-066-1',
 'SEF-V4-067-4','SEF-V4-067-1','SEF-V4-068-2','SEF-V4-068-3'
];
assert.equal(new Set(weakReviewIds).size,22,'Twenty-two distinct reviewed teaching situations');
for(const id of weakReviewIds){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'Reviewed low-H exercise remains available: '+id);
 assert.equal(x.answer,id.startsWith('SEF-V3-080-')?'2♠':'Passe','Review retained the original SEF response: '+id);
 
 
 if(id in reviewedWeakResponses){
  assert.ok(x.h<=4,'Corrected 2SA trap applies only to a very weak hand: '+id);
  assert.ok(x.choices.includes(reviewedWeakResponses[id]),'Natural tempting new suit offered: '+id);
  assert.ok(!x.choices.includes('2SA'),'An implausible 2SA is no longer offered: '+id);
 }
}
// V4.38 : revue des 15 situations Stayman/Texas et des 23 deuxièmes
// enchères encore signalées. Les bonnes réponses sont figées.
const reviewedStayman=[
 'SEF-V3-002-1','SEF-V3-004-1','SEF-V3-005-1','SEF-V3-006-3',
 'SEF-V3-007-4','SEF-V3-008-2','SEF-V3-009-1','SEF-V3-010-2',
 'SEF-V3-021-2','SEF-V3-022-1','SEF-V3-024-1','SEF-V3-025-1',
 'SEF-V3-026-1','SEF-V416-012','SEF-V416-013'
];
const reviewedSecond=[
 'SEF-N140-1','SEF-V44-022','SEF-V49-022','SEF-V49-024','SEF-V49-025',
 'SEF-V49-026','SEF-V49-028','SEF-V49-039','SEF-V410-018','SEF-V410-019',
 'SEF-V411-010','SEF-V411-019','SEF-V411-020','SEF-V411-021','SEF-V412-005',
 'SEF-V413-002','SEF-V413-006','SEF-V417-007','SEF-V417-008',
 'SEF-V418-003','SEF-V421-003','SEF-V421-005','SEF-V423-006'
];
assert.equal(reviewedStayman.length,15,'All fifteen indicated Stayman/Texas cases are reviewed');
assert.equal(reviewedSecond.length,23,'All twenty-three second-response cases are reviewed');
assert.equal(new Set([...reviewedStayman,...reviewedSecond]).size,38);
const expectedRevised={
 'SEF-N140-1':['Passe','2♣','3SA'],
 'SEF-V49-026':['Passe','2♦','2SA'],
 'SEF-V410-018':['2♠','2♥','3♠'],
 'SEF-V3-021-2':['3SA','Passe','4SA'],
 'SEF-V3-022-1':['3SA','Passe','4SA']
};
for(const id of [...reviewedStayman,...reviewedSecond]){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'SEF exercise not found: '+id);
 
 
 const theme=reviewedStayman.includes(id)?'stayman':'second';
 assert.equal(x.theme,theme,'Exercise family still correct: '+id);
 if(expectedRevised[id]){
  const [correct,added,removed]=expectedRevised[id];
  assert.equal(x.answer,correct,'SEF answer remains the same: '+id);
  assert.ok(x.choices.includes(added),'New tempting answer present: '+id);
  assert.ok(!x.choices.includes(removed),'Obvious or ambiguous old choice removed: '+id);
 }
}

// V4.39 : distinguer SEF 2024 de la convention « collante » hors SEF.
// Après une mineure et une intervention à 1♦/1♥, le Spoutnik dénie une majeure quatrième.
const naturalMajorSef24={
 'SEF-V410-025':['1♠','1♦','1♥',4],
 'SEF-V418-005':['1♠','1♣','1♥',4],
 'SEF-V420-009':['1♥','1♣','1♦',4]
};
for(const [id,[bid,open,intervention,minLength]] of Object.entries(naturalMajorSef24)){
 const x=exercises.find(v=>v.id===id);
 assert.ok(x,'Corrected SEF natural-major answer exists: '+id);
 assert.equal(x.auction[0],'Partenaire : '+open,'Opening correct: '+id);
 assert.equal(x.auction[1],'Adversaire : '+intervention,'Intervention correct: '+id);
 assert.equal(x.answer,bid,'Natural response, not inverted Spoutnik: '+id);
 assert.ok(x.hand[bid==='1♠'?0:1].length>=minLength,'At least four cards in chosen major: '+id);
 
 
 const mapEntry=new RegExp("'"+id+"':'sef24-spoutnik-");
 assert.match(html,mapEntry,'Prior progress archived before the corrected answer: '+id);
}

// V4.39 : diversifier les pièges sans modifier les bonnes réponses des autres cas.
const replacementTraps={
 'SEF-V4-047-1':['4♥','3♥','Passe'],
 'SEF-V4-100-2':['1SA','1♠','3♥'],
 'SEF-V4-100-3':['1SA','2♦','3♥'],
 'SEF-V4-106-1':['1SA','2♦','3♠'],
 'SEF-V4-106-2':['1SA','2♦','3♠'],
 'SEF-V44-041':['1♠','Contre','Passe'],
 'SEF-V44-042':['2♥','3♥','Passe'],
 'SEF-V417-010':['Contre','2♦','1SA'],
 'SEF-V421-007':['Surcontre','2♦','3♠']
};
for(const [id,[correct,pitfall,discarded]] of Object.entries(replacementTraps)){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'V4.39 exercise exists: '+id);
 assert.equal(x.answer,correct,'SEF result remains correct: '+id);
 assert.ok(x.choices.includes(pitfall)&&!x.choices.includes(discarded),
  'Replaced a less instructive distractor: '+id);
 
}
const manualPriorityCases={
 'SEF-V44-045':'Surcontre', 'SEF-V410-027':'Contre',
 'SEF-V413-002':'Passe', 'SEF-V421-003':'Passe',
 'SEF-V421-005':'Passe', 'SEF-V422-002':'Passe',
 'SEF-V423-006':'Passe', 'SEF-V424-007':'Surcontre'
};
for(const [id,bid] of Object.entries(manualPriorityCases)){
 const x=exercises.find(y=>y.id===id);
 assert.equal(x?.answer,bid,'Manual priority review confirms SEF result: '+id);
 
}
// V4.40 : préserver l'audit des réponses « presque plausibles » sans
// présenter le relais 2SA sur un 2 faible comme une faute systématique.
const weakTwoChoiceReview={
 'SEF-V3-108-1':'4♠',
 'SEF-V44-049':'4♠',
 'SEF-V426-004':'Passe'
};
for(const [id,correct] of Object.entries(weakTwoChoiceReview)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Reviewed weak-two exercise exists: '+id);
 assert.equal(x.answer,correct,'Original SEF answer preserved: '+id);
 assert.ok(!x.choices.includes('2SA'),'Remove ambiguous 2NT game inquiry as a wrong option: '+id);
 assert.ok(x.choices.includes('3♦'),'Require a genuine new-suit length error instead: '+id);
 
 
}
const detailedReviewIds=[
 'SEF-V3-108-1','SEF-V4-009-1','SEF-V4-010-1',
 'SEF-V4-011-1','SEF-V4-012-1','SEF-V4-021-1','SEF-V4-022-3',
 'SEF-V4-024-2','SEF-V44-002','SEF-V44-007','SEF-V44-013',
 'SEF-V44-014','SEF-V44-015','SEF-V44-016','SEF-V44-049',
 'SEF-V44-063','SEF-V44-065','SEF-V44-066','SEF-V45-013',
 'SEF-V45-014','SEF-V45-016','SEF-V45-017','SEF-V45-018',
 'SEF-V45-019','SEF-V45-022','SEF-V45-025','SEF-V45-037',
 'SEF-V412-016','SEF-V416-006','SEF-V423-003',
 'SEF-V426-004','SEF-V426-006'
];
assert.equal(detailedReviewIds.length,32,'Review includes thirty-two distinct decisions');
assert.equal(new Set(detailedReviewIds).size,32);
for(const id of detailedReviewIds){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Reviewed exercise exists: '+id);
 
 
 
}

// V4.41 : contrôle systématique de toutes les anciennes vigilances
// non expliquées, et remplacement de six « 2SA » caricaturaux en réveil.
const reviewedUnexplained=[
 'SEF-N034-1','SEF-V4-061-2','SEF-V4-062-4','SEF-V4-062-1',
 'SEF-V4-063-1','SEF-V4-064-2','SEF-V4-064-1','SEF-V44-011',
 'SEF-V44-012','SEF-V45-008','SEF-V49-017','SEF-V410-028',
 'SEF-V411-013','SEF-V412-017','SEF-V413-010','SEF-V413-011',
 'SEF-V417-011','SEF-V419-001','SEF-V425-006'
];
assert.equal(new Set(reviewedUnexplained).size,19,'Nineteen unique exercises reviewed');
const revisedBalancingBids={
 'SEF-V4-061-2':['Contre','1♠',4],
 'SEF-V4-062-4':['Contre','1♠',4],
 'SEF-V4-062-1':['Contre','2♣',4],
 'SEF-V4-063-1':['Contre','2♦',4],
 'SEF-V4-064-2':['Contre','2♥',4],
 'SEF-V4-064-1':['Contre','2♥',4]
};
for(const id of reviewedUnexplained){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'SEF situation still present: '+id);
 
 
 
 if(id in revisedBalancingBids){
  const [correct,temptation,shortLength]=revisedBalancingBids[id];
  assert.equal(x.answer,correct,'Correct balancing double is preserved: '+id);
  assert.ok(x.choices.includes(temptation)&&!x.choices.includes('2SA'),
    'Natural alternative replaces unrealistic 2NT: '+id);
  
  const suit={'♠':0,'♥':1,'♦':2,'♣':3}[temptation.slice(-1)];
  assert.equal(x.shape[suit],shortLength,'Four cards, not a natural five-card balancing suit: '+id);
 }
}
// V4.42 : remplacer sept faux pièges 2SA sur des réveils très faibles
// par des annonces naturelles légales mais trop courtes et trop faibles.
const weakBalancingNatural={
 'SEF-V4-065-1':'1♦','SEF-V4-065-2':'1♦',
 'SEF-V4-066-1':'1♥',
 'SEF-V4-067-4':'1♠','SEF-V4-067-1':'1♠',
 'SEF-V4-068-2':'2♣','SEF-V4-068-3':'2♣'
};
assert.equal(Object.keys(weakBalancingNatural).length,7);
for(const [id,temptation] of Object.entries(weakBalancingNatural)){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'Réveil très faible encore présent : '+id);
 assert.equal(x.answer,'Passe','Bonne réponse inchangée : '+id);
 assert.ok(x.h<=4,'Petite main de réveil : '+id);
 assert.ok(x.choices.includes(temptation)&&!x.choices.includes('2SA'),
   'Piège naturel à la place de 2SA : '+id);
 const suit={'♠':0,'♥':1,'♦':2,'♣':3}[temptation.slice(-1)];
 assert.equal(x.shape[suit],3,'Seulement trois cartes : '+id);
 
 
}
// V4.43 : compte HLD après une intervention à la couleur.
const hldFit=exercises.find(x=>x.id==='SEF-V3-075-3');
assert.equal(hldFit?.h,9,'La main reste à neuf points H');
assert.deepEqual(hldFit?.shape,[1,3,5,4],'Singleton Pique, trois atouts Cœur');
assert.deepEqual(hldFit?.auction,['Partenaire : 1♥','Adversaire : 1♠'],'Séquence d’intervention');
assert.equal(hldFit?.answer,'2SA','Douze HLD imposent 2SA fitté en SEF 2024');
assert.ok(hldFit?.choices.includes('2♥'),'Le soutien insuffisant devient un piège instructif');

assert.match(hldFit?.explain||'',/9 H.*1 L.*2 D.*12 HLD/i,'Décompte complet avec le cinquième Carreau');
assert.ok(html.includes("'SEF-V3-075-3':'sef24-hld-11-2nt-fit-after-overcall'"),
  'La tentative ancienne est archivée avant remise à travailler');
const hldWeak=exercises.find(x=>x.id==='SEF-V3-075-2');
assert.equal(hldWeak?.answer,'2♥','À six H avec un singleton le soutien simple reste correct');
const forcingRoles=exercises.filter(x=>x.theme==='forcing'&&x.auction.some(a=>/^Vous :/.test(a)));
assert.ok(forcingRoles.length>=8,'Huit séquences de forcing décrivent explicitement Sud');
assert.ok(!exercises.some(x=>x.auction.some(a=>/^Réponse :/.test(a))),
  'La rubrique forcing ne présente plus le rôle ambigu « Réponse »');
// V4.44 : régression des 17 soutiens à exactement trois atouts après intervention.
// Les points L d'une couleur secondaire cinquième comptent aussi en HLD.
const fitHldAfterOvercall={
 "SEF-V3-074-3": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♥"
 },
 "SEF-V3-074-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♥"
 },
 "SEF-V3-075-2": {
  "h": 6,
  "L": 1,
  "D": 2,
  "hld": 9,
  "answer": "2♥"
 },
 "SEF-V3-075-3": {
  "h": 9,
  "L": 1,
  "D": 2,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-076-3": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♥"
 },
 "SEF-V3-076-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♥"
 },
 "SEF-V3-077-2": {
  "h": 8,
  "L": 0,
  "D": 1,
  "hld": 9,
  "answer": "2♥"
 },
 "SEF-V3-078-3": {
  "h": 7,
  "L": 0,
  "D": 1,
  "hld": 8,
  "answer": "2♠"
 },
 "SEF-V3-078-1": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-079-2": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♠"
 },
 "SEF-V3-079-3": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-080-1": {
  "h": 7,
  "L": 0,
  "D": 1,
  "hld": 8,
  "answer": "2♠"
 },
 "SEF-V3-080-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-081-3": {
  "h": 11,
  "L": 1,
  "D": 2,
  "hld": 14,
  "answer": "2SA"
 },
 "SEF-V3-082-1": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-083-1": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-084-3": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 }
};
assert.equal(Object.keys(fitHldAfterOvercall).length,17,'Dix-sept cas de soutien revus');
for(const [id,expected] of Object.entries(fitHldAfterOvercall)){
 const x=exercises.find(v=>v.id===id);
 assert.ok(x,'La question de fit existe : '+id);
 const trump=x.auction[0].slice(-1)==='♥'?1:0;
 assert.equal(x.shape[trump],3,'Exactement trois atouts : '+id);
 const L=x.shape.reduce((sum,len,i)=>sum+(i===trump?0:Math.max(0,len-4)),0);
 const D=x.shape.reduce((sum,len,i)=>sum+(i===trump?0:len===0?3:len===1?2:len===2?1:0),0);
 assert.equal(L,expected.L,'Points de longueur : '+id);
 assert.equal(D,expected.D,'Points de courte : '+id);
 assert.equal(x.h+L+D,expected.hld,'Total HLD avec fit : '+id);
 assert.equal(x.answer,expected.answer,'Bon palier de soutien : '+id);
 assert.ok(x.explain.includes(expected.hld+' HLD'),'Valeur HLD expliquée : '+id);
 
 assert.ok(x.choices.includes(x.answer),'Bonne réponse proposée : '+id);
}
for(const id of ["SEF-V3-081-3","SEF-V3-082-1","SEF-V3-083-1","SEF-V3-084-3"]){
 const x=exercises.find(z=>z.id===id);
 
}
// V4.45 — soutien avec quatre atouts en compétition selon le SEF 2024.
const fit4Cases={
 'SEF-V419-007':{answer:'3♥',h:8,L:0,D:1,S:2,hld:11},
 'SEF-V420-011':{answer:'2♥',h:7,L:0,D:1,S:2,hld:10,bad:'3♥'},
 'SEF-V421-008':{answer:'2♠',h:7,L:0,D:1,S:2,hld:10,bad:'3♠'},
 'SEF-V425-008':{answer:'3♣',h:9,L:1,D:2,S:2,hld:14,bad:'3♠'}
};
for(const [id,expected] of Object.entries(fit4Cases)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Soutien à quatre atouts présent : '+id);
 const major=x.auction[0].slice(-1),idx=major==='♥'?1:0;
 assert.equal(x.shape[idx],4,'Quatre atouts : '+id);
 const L=x.shape.reduce((sum,n,i)=>sum+(i===idx?0:Math.max(0,n-4)),0);
 const D=x.shape.reduce((sum,n,i)=>sum+(i===idx?0:n===0?3:n===1?2:n===2?1:0),0);
 const S=2;
 assert.equal(x.h,expected.h,'H conservés ou corrigés : '+id);
 assert.equal(L,expected.L,'Points de longueur : '+id);
 assert.equal(D,expected.D,'Points de courte : '+id);
 assert.equal(S,expected.S,'Neuvième atout : '+id);
 assert.equal(x.h+L+D+S,expected.hld,'Décompte HLD : '+id);
 assert.equal(x.answer,expected.answer,'Décision SEF correcte : '+id);
 assert.ok(x.explain.includes(expected.hld+' HLD'),'Corrigé chiffré : '+id);
 assert.ok(x.choices.includes(x.answer),'Quatre choix incluent la réponse : '+id);

}
for(const id of ['SEF-V420-011','SEF-V421-008','SEF-V425-008']){
 assert.ok(html.includes("'"+id+"':'sef24-fit4-"),'Révision de progression non destructive : '+id);
}
const cueCase=exercises.find(x=>x.id==='SEF-V425-008');
assert.ok(cueCase?.choices.includes('3♣')&&!cueCase?.choices.includes('2♦'),
 'Le cue-bid instructif remplace une nouvelle couleur hors sujet');
// V4.46 : 25 nouveaux contrastes documentés dans les quatre familles de conventions.
const newConventionContrasts={
 "SEF-V45-023": {
  "theme": "multilandy",
  "bid": "2♥",
  "answer": "2♣"
 },
 "SEF-V45-024": {
  "theme": "multilandy",
  "bid": "2♦",
  "answer": "2♣"
 },
 "SEF-V45-026": {
  "theme": "multilandy",
  "bid": "2♥",
  "answer": "2♦"
 },
 "SEF-V45-028": {
  "theme": "multilandy",
  "bid": "2♦",
  "answer": "2♠"
 },
 "SEF-V45-031": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "2♠"
 },
 "SEF-V45-032": {
  "theme": "rubensohl",
  "bid": "3♣",
  "answer": "2SA"
 },
 "SEF-V45-033": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "3♣"
 },
 "SEF-V45-034": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "3♦"
 },
 "SEF-V45-035": {
  "theme": "rubensohl",
  "bid": "2♠",
  "answer": "3♥"
 },
 "SEF-V45-036": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "3SA"
 },
 "SEF-V45-038": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "2♥"
 },
 "SEF-V45-039": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "3♣"
 },
 "SEF-V45-041": {
  "theme": "michaels",
  "bid": "1♥",
  "answer": "2♦"
 },
 "SEF-V45-042": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "2♦"
 },
 "SEF-V45-044": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "2♠"
 },
 "SEF-V45-045": {
  "theme": "michaels",
  "bid": "1♠",
  "answer": "3♣"
 },
 "SEF-V45-046": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "3♣"
 },
 "SEF-V45-047": {
  "theme": "michaels",
  "bid": "3♦",
  "answer": "2SA"
 },
 "SEF-V45-048": {
  "theme": "michaels",
  "bid": "3♦",
  "answer": "2SA"
 },
 "SEF-V45-050": {
  "theme": "chelem",
  "bid": "5♦",
  "answer": "5♣"
 },
 "SEF-V45-054": {
  "theme": "chelem",
  "bid": "5♦",
  "answer": "5♣"
 },
 "SEF-V45-055": {
  "theme": "chelem",
  "bid": "5♣",
  "answer": "5♦"
 },
 "SEF-V45-056": {
  "theme": "chelem",
  "bid": "4♠",
  "answer": "4♣"
 },
 "SEF-V45-057": {
  "theme": "chelem",
  "bid": "4♠",
  "answer": "4♥"
 },
 "SEF-V45-058": {
  "theme": "chelem",
  "bid": "4♥",
  "answer": "3♠"
 }
};
assert.equal(Object.keys(newConventionContrasts).length,25,'Vingt-cinq situations de conventions vérifiées');
for(const [id,expected] of Object.entries(newConventionContrasts)){
 const x=exercises.find(z=>z.id===id);
 assert.ok(x,'Exercice de convention disponible : '+id);
 assert.equal(x.theme,expected.theme,'Bonne famille de convention : '+id);
 assert.equal(x.answer,expected.answer,'Bonne réponse inchangée : '+id);
 
 
 
}
// Contrôle autonome des réponses 30–41 : 4 As + le Roi de l'atout agréé.
const blackwoodKeys={
 'SEF-V45-050':{trump:0,keys:0,queen:true,answer:'5♣'},
 'SEF-V45-051':{trump:0,keys:1,queen:true,answer:'5♦'},
 'SEF-V45-052':{trump:0,keys:2,queen:false,answer:'5♥'},
 'SEF-V45-053':{trump:0,keys:2,queen:true,answer:'5♠'},
 'SEF-V45-054':{trump:0,keys:3,queen:false,answer:'5♣'},
 'SEF-V45-055':{trump:1,keys:1,queen:false,answer:'5♦'},
 'SEF-C2-009':{trump:1,keys:2,queen:false,answer:'5♥'},
 'SEF-C2-010':{trump:1,keys:2,queen:true,answer:'5♠'}
};
const _suitNames=['Pique','Cœur','Carreau','Trèfle'];
for(const [id,expected] of Object.entries(blackwoodKeys)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Question Blackwood présente : '+id);
 const ases=x.hand.reduce((n,suit)=>n+Number(suit.includes('A')),0);
 const k=ases+Number(x.hand[expected.trump].includes('R'));
 assert.equal(k,expected.keys,'Quatre As plus Roi d’atout : '+id);
 assert.equal(x.hand[expected.trump].includes('D'),expected.queen,
   'Présence de la Dame d’atout : '+id);
 assert.ok(x.context.includes(_suitNames[expected.trump]),'Atout agréé explicite : '+id);
 assert.equal(x.answer,expected.answer,'Blackwood 30–41 : '+id);
}
// Comparaisons Multi-Landy, Rubensohl et Michaels : formes attendues des bicolores.
const _conventionLengths={
 'SEF-V45-023':[5,4,2,2],
 'SEF-V45-024':[4,5,2,2],
 'SEF-V45-026':[2,6,3,2],
 'SEF-V45-028':[5,2,2,4],
 'SEF-V45-031':[5,2,3,3],
 'SEF-V45-032':[2,2,3,6],
 'SEF-V45-033':[2,2,6,3],
 'SEF-V45-034':[4,2,4,3],
 'SEF-V45-035':[5,2,3,3],
 'SEF-V45-038':[3,5,2,3],
 'SEF-V45-039':[4,4,2,3],
 'SEF-V45-041':[5,5,2,1],
 'SEF-V45-042':[5,5,1,2],
 'SEF-V45-044':[1,5,2,5],
 'SEF-V45-045':[5,1,5,2],
 'SEF-V45-046':[1,5,5,2],
 'SEF-V45-047':[1,2,5,5],
 'SEF-V45-048':[2,1,5,5]
};
for(const [id,shape] of Object.entries(_conventionLengths)){
 const x=exercises.find(z=>z.id===id);
 assert.deepEqual(x?.shape,shape,'La distribution conventionnelle est conservée : '+id);
}
// V4.47 : audit des réveils naturels, zones HL et seuil du Contre de force.
const wakeStrong=[{"id":"SEF-V4-053-3","bid":"2♥","hl":14},{"id":"SEF-V4-055-1","bid":"2♦","hl":14},{"id":"SEF-V4-056-1","bid":"2♣","hl":14},{"id":"SEF-V4-069-1","bid":"2♥","hl":14}];
const wakeLimited=[{"id":"SEF-V4-053-4","bid":"2♥","hl":11},{"id":"SEF-V4-055-3","bid":"2♦","hl":11},{"id":"SEF-V4-056-2","bid":"2♣","hl":11},{"id":"SEF-V4-070-2","bid":"2♥","hl":13}];
const wakeSuitIndex={'♠':0,'♥':1,'♦':2,'♣':3};
for(const item of [...wakeStrong,...wakeLimited]){
 const x=exercises.find(v=>v.id===item.id);
 assert.ok(x,'Exercice de réveil disponible : '+item.id);
 assert.equal(x.theme,'reveil','Famille réveil : '+item.id);
 const idx=wakeSuitIndex[item.bid.slice(-1)];
 const L=Math.max(0,x.shape[idx]-4);
 assert.equal(x.shape[idx],6,'Six cartes : '+item.id);
 assert.equal(L,2,'Cinquième et sixième cartes, soit deux points L : '+item.id);
 assert.equal(x.h+L,item.hl,'Compte HL : '+item.id);
 assert.ok(x.choices.includes(item.bid)&&x.choices.includes('Contre'),'Deux réponses à comparer : '+item.id);
 assert.ok(x.explain.includes(item.hl+' HL'),'Corrigé complet : '+item.id);
 
}
for(const item of wakeStrong){
 const x=exercises.find(e=>e.id===item.id);
 assert.equal(x.answer,'Contre','La main de 14 HL commence par Contre : '+item.id);
 
 assert.ok(html.includes("'"+item.id+"':'sef-reveil-14hl-contre-"),'Archivage du résultat précédent : '+item.id);
}
for(const item of wakeLimited){
 const x=exercises.find(e=>e.id===item.id);
 assert.equal(x.answer,item.bid,'Réveil limité naturel maintenu : '+item.id);
 
}
// Tester tous les réveils naturels de la base, pas seulement les cas corrigés.
// Les contre-exemples avec 14 HL sont traités par Contre et sortent de cet ensemble.
for(const x of exercises.filter(e=>e.theme==='reveil'&&e.auction.length===3)){
 const m=x.answer.match(/^([1-7])([♠♥♦♣])$/);
 if(!m)continue;
 const length=x.shape[wakeSuitIndex[m[2]]],hl=x.h+Math.max(0,length-4);
 assert.ok(length>=5,'Réveil à la couleur avec cinq cartes au moins : '+x.id);
 assert.ok(hl>=8&&hl<=13,'Réveil naturel limité à 8-13 HL : '+x.id+'='+hl);
}
// V4.48 : contrôler les interventions directes et 18 comparaisons.
const directCalls=[
 {
  "id": "SEF-V3-043-3",
  "bid": "Contre",
  "kind": "nt"
 },
 {
  "id": "SEF-V3-044-1",
  "bid": "Contre",
  "kind": "nt"
 },
 {
  "id": "SEF-V3-045-2",
  "bid": "Contre",
  "kind": "nt"
 },
 {
  "id": "SEF-V3-046-3",
  "bid": "Contre",
  "kind": "nt"
 },
 {
  "id": "SEF-V3-048-2",
  "bid": "1SA",
  "kind": "contre"
 },
 {
  "id": "SEF-V3-048-1",
  "bid": "1SA",
  "kind": "contre"
 },
 {
  "id": "SEF-V3-049-2",
  "bid": "1SA",
  "kind": "contre"
 },
 {
  "id": "SEF-V3-050-1",
  "bid": "1SA",
  "kind": "contre"
 },
 {
  "id": "SEF-V3-028-1",
  "bid": "Contre",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V3-029-4",
  "bid": "1SA",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V3-035-1",
  "bid": "Contre",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V3-038-4",
  "bid": "1SA",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V44-032",
  "bid": "Contre",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V44-033",
  "bid": "Contre",
  "kind": "naturelle"
 },
 {
  "id": "SEF-V3-055-2",
  "bid": "2♣",
  "kind": "passe"
 },
 {
  "id": "SEF-V3-056-1",
  "bid": "Contre",
  "kind": "passe"
 },
 {
  "id": "SEF-V49-029",
  "bid": "2♣",
  "kind": "passe"
 },
 {
  "id": "SEF-V3-052-2",
  "bid": "Contre",
  "kind": "passe"
 }
];
const directSuitIndices={'♠':0,'♥':1,'♦':2,'♣':3};
assert.equal(directCalls.length,18);
for(const item of directCalls){
 const x=exercises.find(e=>e.id===item.id);
 assert.ok(x,'Intervention existante '+item.id);
 assert.equal(x.theme,'intervenir');
 assert.ok(x.choices.includes(item.bid)&&x.answer!==item.bid);
 
 
 const opener=x.auction[0].match(/^Adversaire : 1([♠♥♦♣])$/);
 assert.ok(opener,'Ouverture adverse à 1 : '+item.id);
 const idx=directSuitIndices[opener[1]];
 if(item.kind==='nt'){
  assert.equal(x.answer,'1SA');
  assert.equal(x.h,16,'Main 1SA au-dessus du seuil FFB : '+item.id);
  assert.ok(x.shape.every(k=>k>=2&&k<=4),'Main régulière : '+item.id);
  assert.ok(x.hand[idx].includes('A'),'Arrêt de l’ouverture adverse : '+item.id);
 }else if(item.kind==='contre'){
  assert.equal(x.answer,'Contre');
  assert.equal(x.shape[idx],1,'Singleton de la couleur adverse : '+item.id);
  assert.ok(x.shape.every((n,i)=>i===idx||n===4),'Autres couleurs quatrièmes : '+item.id);
 }else if(item.kind==='naturelle'){
  const natural=x.answer.match(/^[12]([♠♥♦♣])$/);
  assert.ok(natural,'Intervention à la couleur : '+item.id);
  assert.ok(x.shape[directSuitIndices[natural[1]]]>=5,'Majeure/mineure longue : '+item.id);
 }else if(item.kind==='passe'){
  assert.equal(x.answer,'Passe');
  assert.ok(x.h<=6,'Main faible : '+item.id);
 }
}
for(const id of ["SEF-V3-044-1","SEF-V3-045-2","SEF-V3-046-3"]){
 assert.ok(html.includes("'"+id+"':'sef-nt-direct-16h-"),'Ancienne tentative archivée : '+id);
}

const ntReply=exercises.find(x=>x.id==='SEF-V421-004');
assert.equal(ntReply?.h,10,'Response of 1SA must not be 11 H with a major opening');
assert.ok(html.includes('revisedSefNov2026')&&html.includes('revisedSefProgress'),'Corrected SEF progress is archived without touching unrelated records');
for(const x of []){
 
 
 
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


 // Déterminisme et intégrité des séances : espacement sans suppression ni doublon.
const vm=require('node:vm');
const spacingSource=html.match(/function spaceCloseFamilies\(items,minGap=3\)\{[\s\S]*?\n\}/);
assert.ok(spacingSource,'Spacing function exists');
const spaceCloseFamilies=vm.runInNewContext('('+spacingSource[0]+')');
const sample=[
 {id:'A-1',caseFamily:'A'},{id:'A-2',caseFamily:'A'},
 {id:'B-1',caseFamily:'B'},{id:'C-1',caseFamily:'C'},
 {id:'D-1',caseFamily:'D'},{id:'B-2',caseFamily:'B'},
 {id:'E-1',caseFamily:'E'}
];
const spaced=spaceCloseFamilies(sample);
assert.equal(spaced.length,sample.length,'Spacing retains all exercises');
assert.deepEqual([...spaced.map(x=>x.id)].sort(),sample.map(x=>x.id).sort(),'Spacing preserves exact IDs');
assert.deepEqual(spaced.map(x=>x.id),spaceCloseFamilies(sample).map(x=>x.id),'Spacing deterministic for a given shuffled input');
for(let i=0;i<spaced.length;i++){
 const recent=spaced.slice(Math.max(0,i-3),i).map(x=>x.caseFamily);
 if(spaced.slice(i+1).some(x=>!recent.includes(x.caseFamily)))
  assert.ok(!recent.includes(spaced[i].caseFamily),'Avoid close repetition while alternatives exist');
}
assert.ok(exercises.length>=historical.count,'No exercise removed for spacing');


// Régression ciblée SEF novembre 2026 — Drury, fuite de réponses et progression.
// Les niveaux de difficulté ne sont pas figés ici : ils peuvent être recalibrés
// individuellement sans casser la CI (incident antérieur sur Roudi).
{
 const byId=new Map(exercises.map(x=>[x.id,x]));
 const supportCases=[
  ['SEF-V4-099-2','2♥',1],
  ['SEF-V4-105-2','2♠',0]
 ];
 for(const [id,bid,trumpSuit] of supportCases){
  const x=byId.get(id);
  assert.ok(x,'Drury support case exists: '+id);
  assert.equal(x.h,6,'Drury 2M must meet the 6 HLD minimum: '+id);
  assert.equal(x.hand[trumpSuit].length,3,'Drury support with three trumps: '+id);
  assert.equal(x.answer,bid,'Drury support answer kept: '+id);
  assert.match(x.explain,/6 HLD/,'Drury explanation states the limit: '+id);
 }
 const neutralContext=['SEF-C2-011','SEF-C2-012','SEF-V45-003'];
 for(const id of neutralContext){
  const x=byId.get(id);
  assert.ok(x,'Neutralised hint exercise exists: '+id);
  assert.ok(!x.context.includes(x.answer),'The question must not reveal the correct bid: '+id);
  assert.equal(x.choices.length,4,'Distractors retained: '+id);
 }
 assert.ok(!/11 HLD/.test(byId.get('SEF-C2-011').context),'Do not reveal the precise HLD calculation in the question');
 assert.ok(byId.get('SEF-V45-022').difficulty<=3,'A natural weak 2♥ repeat must not be level 5');
 for(const id of [...supportCases.map(x=>x[0]),...neutralContext]){
  assert.match(html,new RegExp("'"+id+"':'sef-2026-11-02-[^']+'"),
   'Revision marker must archive prior progress for the modified exercise: '+id);
 }
}
