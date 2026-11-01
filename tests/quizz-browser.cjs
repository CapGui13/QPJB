'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 const engine=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(engine));
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 const errors=[];
 try{
  const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8766/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  assert.ok((await page.locator('.stage').textContent()).includes('Le SEF est notre référence unique.'),'The quiz describes its single SEF reference');
  assert.ok(!(await page.locator('.stage').textContent()).includes('accord de paire'),'No pair settings are advertised');
  assert.equal(await page.locator('#selection-mode option').count(),5);
  assert.equal(await page.locator('#topic option').count(),23);
  const dimensions=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  assert.ok(dimensions.width<=dimensions.viewport+2,'No horizontal overflow on iPhone: '+JSON.stringify(dimensions));
  // A known convention case must retain its decision-relevant note.
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#topic').selectOption('roudi');
  await page.locator('#difficulty').selectOption('5');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  let hasMaxNote=false;
  const totalRoudi=Number(await page.locator('#total').textContent());
  assert.ok(totalRoudi>=5,'Roudi level-five pool exists');
  for(let i=0;i<totalRoudi;i++){
   hasMaxNote=hasMaxNote||(await page.locator('#body .context-note').allTextContents()).some(t=>t.includes('fit, maximum'));
   await page.locator('#pass').click();
  }
  assert.ok(hasMaxNote,'Roudi maximum fit is visible without hover');
  await page.locator('#done-home').click();
  await page.locator('#topic').selectOption('ouv');
  await page.locator('#difficulty').selectOption('1');
  await page.locator('#mode').selectOption('10');
  await page.locator('#new').click();
  assert.equal(await page.locator('#body .hand .suit').count(),4,'Hand displays four suits');
  assert.equal(await page.locator('#answers button').count(),0,'No propositions before choosing to display them');
  assert.equal(await page.locator('#free-answer').count(),1,'A free-response field comes first');
  assert.equal(await page.locator('#show-choices').count(),1,'The learner may request four choices');
  assert.equal(await page.locator('.feedback').count(),0,'No answer is revealed in advance');
  assert.equal(await page.locator('#next').isDisabled(),true,'Next is blocked until answered');
  assert.equal(await page.locator('#done').textContent(),'0','A viewed card is not a completed card');
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answers button').count(),4,'All four choices appear on request');
  const initialOrder=await page.locator('#answers button').allTextContents();
  await page.locator('#answers button').first().click();
  assert.equal(await page.locator('#done').textContent(),'1','Answered card counts as completed');
  assert.equal(await page.locator('#next').isEnabled(),true,'Next becomes available');
  const before=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01')||'{}')).reduce((s,x)=>s+(x.history?.length||0),0));
  await page.locator('#next').click();
  assert.equal(await page.locator('#next').isDisabled(),true,'New card needs its own response');
  await page.locator('#previous').click();
  assert.deepEqual(await page.locator('#answers button').allTextContents(),initialOrder,'Choices are stable when returning');
  assert.equal(await page.locator('.feedback').count(),1,'Previous answer is preserved');
  await page.locator('#next').click();
  const after=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01')||'{}')).reduce((s,x)=>s+(x.history?.length||0),0));
  assert.equal(after,before,'Navigating backward does not add an attempt');
  await page.locator('#pass').click();
  assert.equal(await page.locator('#done').textContent(),'2','Skipped question counts as processed');
  assert.equal(await page.locator('#progressbar').evaluate(el=>el.style.width),'20%','Progress follows processed questions');
  for(let i=2;i<10;i++)await page.locator('#pass').click();
  assert.ok((await page.locator('#body').textContent()).includes('Fin de la séance'),'Session ends after ten treated questions');
  assert.ok((await page.locator('#body').textContent()).includes('9 passé(s)'),'Summary distinguishes skipped questions');
  await page.locator('#done-home').click();
  await page.locator('#selection-mode').selectOption('review');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  assert.ok(Number(await page.locator('#total').textContent())>=9,'Skipped questions appear in review mode');
  // New users start their smart session at the easiest level.
  await page.locator('#back-home').click();
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#new').click();
  assert.ok((await page.locator('#level-name').textContent()).includes('Niveau 1'),'New learner starts at level one');

  // A successful exercise becomes a revision, but a later error removes that mastery.
  await page.locator('#back-home').click();
  await page.locator('#topic').selectOption('ouv');
  await page.locator('#difficulty').selectOption('1');
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#mode').selectOption('10');
  await page.locator('#new').click();
  const hand=await page.locator('#body .hand .suit .rank').allTextContents();
  const source=JSON.parse(await page.locator('#training-data').textContent());
  const chosen=source.exercises.find(x=>x.theme==='ouv'&&x.hand.map(s=>s.join('')).join('|')===hand.join('|')&&x.auction.length===0);
  assert.ok(chosen,'Opening case is identifiable');
  assert.equal(await page.locator('#answers button').count(),0,'Free entry precedes QCM on a fresh question');
  const freeAlias=chosen.answer.replace('♠','P').replace('♥','C').replace('♦','K').replace('♣','T').replace('SA','NT').replace('Passe','PASS');
  await page.locator('#free-answer').fill(freeAlias);
  await page.locator('#free-form button[type=submit]').click();
  assert.equal(await page.locator('#answers button').count(),0,'Successful free response never reveals QCM');
  let record=await page.evaluate(id=>JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01'))[id],chosen.id);
  assert.equal(record.lastResult,'correct','First successful attempt is retained');
  assert.equal(record.ok,true,'Independent mastery is current after an unassisted success');
  assert.equal(record.assisted,false,'A free correct answer is not assisted');
  await page.locator('#back-home').click();
  await page.locator('#selection-mode').selectOption('revision');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  assert.equal(await page.locator('#total').textContent(),'1','Revision proposes the successful exercise');
  assert.equal(await page.locator('#answers button').count(),0,'Revisions also start without choices');
  await page.locator('#show-choices').click();
  const revisionChoices=(await page.locator('#answers button').allTextContents()).map(s=>s.trim());
  const wrongIndex=revisionChoices.findIndex(s=>s!==chosen.answer);
  await page.locator('#answers button').nth(wrongIndex).click();
  record=await page.evaluate(id=>JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01'))[id],chosen.id);
  assert.equal(record.lastResult,'wrong','Later mistake updates last result');
  assert.equal(record.ok,false,'Incorrect new attempt cancels current mastery');
  assert.equal(record.attempts,2,'Exactly two attempts were recorded');
  assert.equal(record.correct,1,'Previous correct answer is still remembered');
  assert.equal(record.wrong,1,'New error is counted');
  await page.locator('#back-home').click();
  await page.locator('#selection-mode').selectOption('review');
  await page.locator('#new').click();
  assert.equal(await page.locator('#total').textContent(),'1','The failed revision is eligible for review');

  // Audit C01 : au moins une correction complète "pourquoi pas" + "à retenir"
  // doit être réellement visible à l'écran après une tentative.
  await page.locator('#back-home').click();
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#topic').selectOption('sa');
  await page.locator('#difficulty').selectOption('2');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  const dataC01=JSON.parse(await page.locator('#training-data').textContent());
  assert.equal(dataC01.exercises.length,993,'Twenty-four curated cases are available');
  assert.equal(dataC01.exercises.filter(x=>x.whyNot).length,78,'All 78 curated comparisons are embedded');
  let contrasted=false;
  const count=Number(await page.locator('#total').textContent());
  for(let i=0;i<count;i++){
   await page.locator('#show-choices').click();
   await page.locator('#answers button').first().click();
   if(await page.locator('.feedback-contrast').count()){
    assert.equal(await page.locator('.feedback-lesson').count(),1,
      'Each compared alternative includes a takeaway');
    assert.ok((await page.locator('.feedback-contrast').textContent()).includes('Pourquoi pas'),
      'A tempting wrong bid is explained');
    contrasted=true;break;
   }
   if(i<count-1)await page.locator('#next').click();
  }
  assert.ok(contrasted,'At least one enriched answer is visible on simulated iPhone');

  // Audit C02 : la couleur d'atout est indispensable au comptage des cinq clés.
  // Vérifier son rendu et la réponse au Blackwood dans la version iPhone.
  await page.locator('#back-home').click();
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#topic').selectOption('chelem');
  await page.locator('#difficulty').selectOption('4');
  await page.locator('#mode').selectOption('0');
  await page.locator('#new').click();
  const blackwoodData=JSON.parse(await page.locator('#training-data').textContent());
  const desired=blackwoodData.exercises.find(x=>x.id==='SEF-C2-009');
  assert.ok(desired,'Blackwood coeur C02 example is present');
  assert.equal(desired.answer,'5♥','Two keys without queen must answer 5♥ under agreed RKCB');
  let validatedBlackwood=false;
  const chelemCount=Number(await page.locator('#total').textContent());
  for(let i=0;i<chelemCount;i++){
   const handShown=(await page.locator('#body .hand .suit .rank').allTextContents()).join('|');
   if(handShown===desired.hand.map(x=>x.join('')).join('|')){
    const contextText=await page.locator('#body .context-note').textContent();
    assert.ok(contextText.includes('Atout Cœur agréé'),
      'The agreed trump suit is visible before choosing a Blackwood reply');
    assert.equal(await page.locator('#answers button').count(),0,'Blackwood opens without candidate answers');
    await page.locator('#show-choices').click();
    const options=(await page.locator('#answers button').allTextContents()).map(x=>x.trim());
    await page.locator('#answers button').nth(options.indexOf('5♥')).click();
    assert.ok((await page.locator('#body .feedback').textContent()).includes('Bonne réponse'),
      'The agreed two-key response is accepted');
    assert.equal(await page.locator('.feedback-contrast').count(),1,'The RKCB comparison is visible');
    validatedBlackwood=true;break;
   }
   await page.locator('#pass').click();
  }
  assert.ok(validatedBlackwood,'C02 agreed-trump Blackwood is testable on an iPhone-sized screen');



  // Nouvelle mécanique : une réponse erronée libre affiche les quatre pièges,
  // sans révéler la bonne réponse, et ne donne pas la maîtrise autonome.
  await page.locator('#back-home').click();
  await page.locator('#topic').selectOption('ouv');
  await page.locator('#difficulty').selectOption('1');
  await page.locator('#mode').selectOption('10');
  await page.locator('#selection-mode').selectOption('all');
  await page.locator('#new').click();
  const hand2=await page.locator('#body .hand .suit .rank').allTextContents();
  const case2=blackwoodData.exercises.find(x=>x.theme==='ouv'&&x.auction.length===0&&x.hand.map(s=>s.join('')).join('|')===hand2.join('|'));
  assert.ok(case2,'Opening question is identifiable in the catalog');
  assert.equal(await page.locator('#answers button').count(),0);
  await page.locator('#free-answer').fill('2ZZ');
  await page.locator('#free-form button[type=submit]').click();
  assert.equal(await page.locator('#answers button').count(),0,'Malformed bid does not trigger suggestions');
  assert.equal(await page.locator('#done').textContent(),'0','Malformed bid is not graded');
  assert.ok(await page.locator('.free-entry-error').count(),'Invalid input has accessible feedback');
  const wrong=case2.choices.find(c=>c!==case2.answer);
  await page.locator('#free-answer').fill(wrong);
  await page.locator('#free-form button[type=submit]').click();
  assert.equal(await page.locator('#answers button').count(),4,'Incorrect free bid reveals four choices');
  assert.equal(await page.locator('.feedback').count(),0,'The solution is not disclosed before choosing from the four');
  assert.equal(await page.locator('#done').textContent(),'0','A wrong free guess is not a completed graded question');
  const fourOptions=(await page.locator('#answers button').allTextContents()).map(s=>s.trim());
  assert.ok(fourOptions.includes(case2.answer),'Correct bid is among plausible suggestions');
  await page.locator('#answers button').nth(fourOptions.indexOf(case2.answer)).click();
  let assistedRecord=await page.evaluate(id=>JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01'))[id],case2.id);
  assert.equal(assistedRecord.lastResult,'correct','Correct assisted answer is tracked');
  assert.equal(assistedRecord.assisted,true,'Four-choice success is assisted');
  assert.equal(assistedRecord.ok,false,'Assisted success is not considered independent mastery');
  assert.equal(assistedRecord.history.at(-1).firstGuess,wrong,'First free bid is retained in history');
  assert.ok((await page.locator('.feedback').textContent()).includes('À retravailler'),'Assisted questions are earmarked for review');
  await page.locator('#next').click();
  assert.equal(await page.locator('#answers button').count(),0,'Each new card again hides the four options');
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answers button').count(),4,'Choices may be requested without a failed bid');
  assert.equal(await page.locator('.feedback').count(),0,'Requesting choices does not reveal the correct option');
  const directOptions=(await page.locator('#answers button').allTextContents()).map(s=>s.trim());
  const hand3=await page.locator('#body .hand .suit .rank').allTextContents();
  const case3=blackwoodData.exercises.find(x=>x.theme==='ouv'&&x.auction.length===0&&x.hand.map(s=>s.join('')).join('|')===hand3.join('|'));
  assert.ok(case3,'Second independent opening question is identifiable');
  await page.locator('#answers button').nth(directOptions.indexOf(case3.answer)).click();
  const directRecord=await page.evaluate(id=>JSON.parse(localStorage.getItem('qpjb-sef-entrainement-01'))[id],case3.id);
  assert.equal(directRecord.assisted,true,'Direct choice mode also records assistance');
  assert.equal(directRecord.ok,false,'Direct assisted answers remain reviewable');


  // Vérifier l'intégration dans QPJB : pas de navigation vers quizz.html,
  // même iframe après retour, état de l'exercice et quatre choix conservés.
  const integratedContext=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  try{
    const app=await integratedContext.newPage();
    await app.goto('http://127.0.0.1:8766/QPJB/',{waitUntil:'domcontentloaded'});
    await app.addStyleTag({content:'#splash{opacity:0!important;visibility:hidden!important;pointer-events:none!important}'});
    await app.locator('.training-button-quizz').click();
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='block',null,{timeout:12000});
    const embedded=app.frameLocator('#quizz-frame');
    await embedded.locator('#new').waitFor({state:'visible',timeout:12000});
    assert.equal(new URL(app.url()).pathname,'/QPJB/','The Quizz opens inside the parent app URL');
    assert.equal(await app.locator('#main-header').isVisible(),true,'Quizz settings share the normal QPJB header');
    assert.equal(await embedded.locator('.app-top').isVisible(),false,'No duplicate header in embedded Quizz');
    await app.evaluate(()=>{
      document.getElementById('quizz-frame').dataset.persistenceProbe='same-iframe';
      window.__quizzInternalFadeSeen=false;
      const layer=document.getElementById('fade-overlay');
      new MutationObserver(()=>{
        if(layer.classList.contains('fade-in'))window.__quizzInternalFadeSeen=true;
      }).observe(layer,{attributes:true,attributeFilter:['class']});
    });
    await embedded.locator('#new').click();
    await embedded.locator('body.session-mode').waitFor({state:'visible',timeout:12000});
    await app.waitForFunction(()=>document.getElementById('main-header').style.display==='none',null,{timeout:12000});
    assert.equal(await app.evaluate(()=>window.__quizzInternalFadeSeen),true,'Quizz page transitions reuse the QPJB fade overlay');
    await embedded.locator('#show-choices').click();
    assert.equal(await embedded.locator('#answers button').count(),4,'Embedded Quizz keeps four choices on demand');
    await embedded.locator('#qpjb-quiz-return').click();
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='none',null,{timeout:12000});
    assert.equal(new URL(app.url()).pathname,'/QPJB/','Back returns to the app without a document navigation');
    await app.locator('.training-button-quizz').click();
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='block',null,{timeout:12000});
    assert.equal(await app.locator('#quizz-frame').getAttribute('data-persistence-probe'),'same-iframe','The iframe DOM is reused rather than reloaded');
    assert.equal(await embedded.locator('body.session-mode').count(),1,'An ongoing Quizz session survives returning to the app');
    assert.equal(await embedded.locator('#answers button').count(),4,'Previously revealed proposals remain visible');
    // Les boutons Retour/Avancer du navigateur ne doivent pas recharger la page non plus.
    await app.evaluate(()=>history.back());
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='none',null,{timeout:12000});
    await app.evaluate(()=>history.forward());
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='block',null,{timeout:12000});
    assert.equal(await app.locator('#quizz-frame').getAttribute('data-persistence-probe'),'same-iframe','Browser history restores the same Quizz document');
    assert.equal(await embedded.locator('#answers button').count(),4,'Browser history preserves the active question');
    await embedded.locator('#back-home').click();
    await embedded.locator('body:not(.session-mode)').waitFor({state:'visible',timeout:12000});
    await app.waitForFunction(()=>document.getElementById('main-header').style.display!=='none',null,{timeout:12000});
    assert.equal(await embedded.locator('#new').isVisible(),true,'The settings screen reappears without reload');
    await embedded.locator('#qpjb-quiz-return').click();
    await app.waitForFunction(()=>document.getElementById('vquizz').style.display==='none',null,{timeout:12000});
    await app.close();
  }finally{await integratedContext.close()}

  assert.deepEqual(errors,[],'No JavaScript runtime exceptions');
  console.log('Quizz browser: PASS ('+engine+')');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
