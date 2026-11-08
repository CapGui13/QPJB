'use strict';
const {chromium,webkit,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const project=path.resolve(__dirname,'..');
const contentTypes={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 const relative=pathname.slice('/QPJB/'.length);
 let file=path.resolve(project,relative);
 if(!file.startsWith(project+path.sep)&&file!==project){res.writeHead(403);res.end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
     const ext=path.extname(file);
     res.writeHead(200,{'content-type':contentTypes[ext]||'application/octet-stream'});
     fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
 const browserType=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(browserType),'Supported browser under test');
 const browser=await ({chromium,webkit})[browserType].launch({headless:true,args:browserType==='chromium'?['--no-sandbox']:[]});
 let errors=[];
 try{
  const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const frame=page.frameLocator('#training-frame');
  await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
  const initialData=await page.frames().find(f=>f.url().includes('/entrainement/'))
    .evaluate(()=>({bidding:D.bidding.length,play:D.play.length}));
  assert.deepEqual(initialData,{bidding:631,play:0},
    'Bidding opens without parsing the complete card-play collection');
  await frame.locator('.topic-group .tile').filter({hasText:'Répondre et poursuivre après 2SA'}).first().click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  const accessibilityFrame=page.frames().find(f=>f.url().includes('/entrainement/'));
  await accessibilityFrame.waitForFunction(()=>document.activeElement?.id==='root',{timeout:10000});
  assert.ok((await frame.locator('#root').getAttribute('aria-label')).includes('Liste des exercices'),
    'The exercise list has an accessible screen name');
  await frame.locator('.item').first().click();
  const quiz=frame.locator('.qpjb-bid-quiz');
  await quiz.waitFor({state:'visible',timeout:15000});
  await accessibilityFrame.waitForFunction(()=>document.activeElement?.id==='root',{timeout:10000});
  assert.ok((await frame.locator('#root').getAttribute('aria-label')).startsWith('Exercice '),
    'Opening a quiz announces its exercise number');
  // Alignement des symboles de la main et reprise des couleurs des propositions.
  const handSuitAudit=await quiz.locator('.suits').evaluate(root=>{
    const items=[...root.querySelectorAll('.suit')].map(el=>{
      const symbol=el.querySelector('.sym'),cards=el.querySelector('span:last-child');
      const a=symbol.getBoundingClientRect(),b=cards.getBoundingClientRect();
      return {glyph:symbol.textContent,color:getComputedStyle(symbol).color,
        align:getComputedStyle(el).alignItems,delta:Math.abs((a.top+a.bottom)/2-(b.top+b.bottom)/2)};
    });
    return items;
  });
  assert.equal(handSuitAudit.length,4,'The bidding hand retains all four suit groups');
  assert.ok(handSuitAudit.every(x=>x.align==='center'&&x.delta<=1.5),
    'Suit symbols share the same vertical center as the card ranks: '+JSON.stringify(handSuitAudit));
  assert.equal(handSuitAudit.find(x=>x.glyph==='♣')?.color,'rgb(23, 101, 182)',
    'Clubs in hand match the darker blue used in answer buttons');
  assert.equal(handSuitAudit.find(x=>x.glyph==='♦')?.color,'rgb(179, 91, 8)',
    'Diamonds in hand match the darker orange used in answer buttons');
  const auctionRows=await quiz.locator('.auc tbody tr').count();
  const choices=quiz.locator('.choices>.choice');
  assert.equal(auctionRows,3,'Test QCM must include three auction rows');
  assert.equal(await choices.count(),4,'Four proposals must be present');
  // L'ordre visuel n'est plus l'ordre éditorial : les données conservent
  // leurs indices d'origine pour les réponses, les corrigés et la progression.
  const choiceTwo=quiz.locator('.choices>.choice[data-answer-index="2"]');
  const choiceZero=quiz.locator('.choices>.choice[data-answer-index="0"]');
  assert.deepEqual((await choices.allTextContents()).map(x=>x.trim()),
    ['Passe','3SA','4SA','5SA'],'Bidding replies are shown from cheapest to highest');
  assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.answerIndex))),
    [3,2,0,1],'Visual sorting preserves original choice indices');

  const metrics=await quiz.evaluate(el=>{
   const buttons=el.querySelector('.choices').getBoundingClientRect();
   const rect=el.getBoundingClientRect();
   return {buttonsBottom:buttons.bottom,viewport:el.ownerDocument.documentElement.clientHeight,quizWidth:rect.width,bodyWidth:el.ownerDocument.documentElement.clientWidth};
  });
  assert.ok(metrics.quizWidth>metrics.bodyWidth*0.85,'QCM must use available mobile width');
  await choiceTwo.click();
  await frame.locator('.qpjb-answer-area.is-open').waitFor({state:'visible',timeout:5000});
  assert.equal(await quiz.locator('.choice.selected').count(),1,'Answer selected');
  const firstAnswer=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  await choiceTwo.click();
  assert.equal(await quiz.locator('.choice.selected').count(),0,'Second tap unselects answer');
  assert.equal(await frame.locator('.qpjb-answer-area[aria-hidden="true"]').count(),1,'Explanation closes');
  await choiceTwo.click();
  const afterRecheck=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  assert.equal(afterRecheck.attempts,firstAnswer.attempts,'Unselect and reselect do not count as another visit');
  assert.equal(afterRecheck.history,firstAnswer.history+1,'Each selection remains in history');
  assert.equal(afterRecheck.validated,firstAnswer.validated,'First selection determines visit validation');
  await choiceZero.click();
  const changedChoice=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  assert.equal(changedChoice.attempts,firstAnswer.attempts,'Changing to another choice does not increase visit count');
  assert.equal(changedChoice.history,afterRecheck.history+1,'Changed choice is recorded');
  assert.equal(changedChoice.validated,firstAnswer.validated,'Changed choice cannot rewrite first try');
  await choiceTwo.click();
  const extra=frame.locator('.postsolution-trigger');
  await extra.waitFor({state:'attached',timeout:5000});
  const explanationId=await extra.getAttribute('aria-controls');
  assert.ok(explanationId,'Expandable explanations identify their controlled content');
  await extra.click();
  assert.equal(await extra.getAttribute('aria-expanded'),'true','Alternative explanations expand');
  assert.equal(await frame.locator('#'+explanationId).getAttribute('aria-hidden'),'false',
    'Explanations become visible to assistive technologies');
  assert.equal(await frame.locator('#'+explanationId).getAttribute('inert'),null,
    'Expanded explanations are interactive');
  const blackSuits=frame.locator('.postsolution-item .symbol-suit.suit-black');
  assert.ok(await blackSuits.count()>0,'Black suits in dynamically inserted explanations must be colorized');

  // Reproduire la phrase de la capture réelle : le ♣ de « 1♣ »
  // devenait creux à cause du contour blanc sur le fond du corrigé.
  await frame.locator('.feedback').first().evaluate(el=>{
    const p=document.createElement('p');
    p.className='qpjb-suit-probe';
    p.textContent='on ouvre de 1♣, par souci d’économie. Pourquoi pas 1♣ ?';
    el.appendChild(p);
    colorAllSuits(p);
  });
  assert.equal(await frame.locator('.qpjb-suit-probe .symbol-suit.suit-club').count(),2,
    'Two clubs from the screenshot are wrapped as suit glyphs');

  // Contrôler le trèfle noir (même dans les corrigés sombres) et l'absence de contour.
  for(const scheme of ['light','dark']){
    await page.emulateMedia({colorScheme:scheme});
    assert.equal(await accessibilityFrame.evaluate(()=>matchMedia('(prefers-color-scheme:dark)').matches),
      scheme==='dark','The training iframe follows the chosen color scheme');
    const scan=await frame.locator('#root').evaluate(root=>{
      const elements=[...root.querySelectorAll(
        '.symbol-suit.suit-red,.symbol-suit.suit-black,.sym.red,.sym.black,'+
        '.candidate-suits b.red,.candidate-suits b.black,.deal-suit.red,.deal-suit.black,'+
        '.deal-playing-card.red,.deal-playing-card.black')];
      const errors=[];
      for(const el of elements){
        const isRed=el.classList.contains('red')||el.classList.contains('suit-red');
        const club=el.classList.contains('suit-club'),diamond=el.classList.contains('suit-diamond');
        const style=getComputedStyle(el);
        const fill=style.getPropertyValue('-webkit-text-fill-color')||style.color;
        const values=(fill.match(/\d+/g)||[]).slice(0,3).map(Number);
        const good=values.length===3&&(club
          ?values[2]>values[0]+35&&values[2]>values[1]+18
          :diamond?values[0]>values[2]+70&&values[1]>values[2]+20
          :isRed?values[0]>=120&&values[0]>values[1]+45&&values[0]>values[2]+35
          :values.every(n=>n<=80));
        if(!good)errors.push({where:el.parentElement?.className,cls:el.className,
          text:el.textContent?.slice(0,12),fill});
        if(el.classList.contains('symbol-suit')&&el.textContent?.includes('\uFE0F'))
          errors.push({cls:el.className,reason:'emoji variation selector'});
        if(el.classList.contains('symbol-suit')&&parseFloat(style.webkitTextStrokeWidth||'0')>0)
          errors.push({cls:el.className,reason:'outlined suit instead of solid glyph'});
      }
      return {count:elements.length,errors:errors.slice(0,12)};
    });
    assert.ok(scan.count>5,'Suit audit must cover actual rendered symbols');
    assert.deepEqual(scan.errors,[],scheme+' bridge suit colors in the rendered QCM: '+JSON.stringify(scan.errors));
  }
  await page.emulateMedia({colorScheme:'light'});

  // Simuler une écriture refusée : avertir immédiatement sans reconstruire le QCM.
  await quiz.evaluate(()=>{
    window.__qpjbOriginalSetItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,val){
      if(key===KEY)throw new Error('simulated storage failure');
      return window.__qpjbOriginalSetItem.call(this,key,val);
    };
  });
  await choiceZero.click();
  await frame.locator('#root .storage-warning[role="alert"]').waitFor({state:'visible',timeout:5000});
  assert.equal(await quiz.count(),1,'Storage warning does not recreate the exercise');
  await quiz.evaluate(()=>{
    Storage.prototype.setItem=window.__qpjbOriginalSetItem;
    delete window.__qpjbOriginalSetItem;
  });
  await choiceTwo.click();
  await frame.locator('#root .storage-warning').waitFor({state:'detached',timeout:5000});
  assert.equal(await frame.locator('.restart-exercise').count(),0,
    'No redo control is offered after the answer');
  assert.equal(await quiz.locator('.choice.selected').count(),1,
    'Changing the selected answer remains possible without an explicit restart');

  // Deux onglets de la même origine : chaque exercice doit rester disponible
  // même si les deux sauvegardes partent sans attendre les événements storage.
  const otherTab=await context.newPage();
  otherTab.on('pageerror',e=>errors.push(e.message));
  // Une page d'entraînement hors iframe doit être redirigée : tester le vrai parcours.
  await otherTab.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
  await otherTab.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  await otherTab.frameLocator('#training-frame').locator('#root').waitFor({state:'visible'});
  const otherTrainingFrame=otherTab.frames().find(f=>f.url().includes('/entrainement/'));
  assert.ok(otherTrainingFrame,'The second tab opens the embedded training frame');
  const syncIds=await accessibilityFrame.evaluate(()=>
    D.bidding.filter(x=>!saved[x.id]&&x.reviewStatus!=='a_verifier').slice(0,3).map(x=>x.id));
  assert.equal(syncIds.length,3,'Three untouched exercises are available for two-tab tests');
  await Promise.all([
    accessibilityFrame.evaluate(ex=>persistResult(ex,'A',true,true),syncIds[0]),
    otherTrainingFrame.evaluate(ex=>persistResult(ex,'B',false,true),syncIds[1])
  ]);
  await accessibilityFrame.waitForFunction(keys=>keys.every(ex=>!!saved[ex]),syncIds.slice(0,2));
  await otherTrainingFrame.waitForFunction(keys=>keys.every(ex=>!!saved[ex]),syncIds.slice(0,2));
  assert.equal(await otherTrainingFrame.evaluate(()=>JSON.stringify(saved)===localStorage.getItem(KEY)),true,
    'A second tab has the complete persisted progress');
  // Deux visites concurrentes d'un MÊME exercice : combiner les deux
  // historiques et deux tentatives identifiées, pas uniquement le dernier choix.
  await Promise.all([
    accessibilityFrame.evaluate(ex=>persistResult(ex,'A',true,true),syncIds[2]),
    otherTrainingFrame.evaluate(ex=>persistResult(ex,'B',false,true),syncIds[2])
  ]);
  await accessibilityFrame.waitForFunction(ex=>saved[ex]?.attempts===2&&saved[ex]?.history?.length===2,syncIds[2]);
  await otherTrainingFrame.waitForFunction(ex=>saved[ex]?.attempts===2&&saved[ex]?.history?.length===2,syncIds[2]);
  const reconciled=await otherTrainingFrame.evaluate(ex=>({attempts:saved[ex].attempts,
    visits:new Set(saved[ex]._syncVisits).size,history:saved[ex].history.map(x=>x.pick)}),syncIds[2]);
  assert.equal(reconciled.visits,2,'Both tabs preserve their separate visit IDs');
  assert.deepEqual([...reconciled.history].sort(),['A','B'],'Both choices remain in history');
  await otherTab.close();

  await page.goBack({waitUntil:'domcontentloaded'});
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await quiz.count(),0,'Browser back returns to the list');

  // Changer de filtre doit garder la navigation et le select en place.
  const listFilter=frame.locator('.tools select.field');
  await frame.locator('section.hero').evaluate(el=>{el.dataset.stableListHeader='yes'});
  await listFilter.focus();
  await listFilter.selectOption('todo');
  assert.equal(await listFilter.evaluate(el=>document.activeElement===el),true,'Filter keeps keyboard focus');
  assert.equal(await frame.locator('#count').getAttribute('role'),'status',
    'Screen readers receive the updated number of filtered exercises');
  assert.equal(await frame.locator('section.hero').getAttribute('data-stable-list-header'),'yes',
    'Filter does not rebuild the whole page');
  assert.equal(await frame.locator('#entries .item').count(),Number((await frame.locator('#count').innerText()).match(/\d+/)[0]),
    'Filter count matches rendered exercises');
  // Les numéros doivent conserver leur position initiale après filtrage.
  const numbersMatch=await listFilter.evaluate(()=>{
    const expected=new Map(rel().map((x,i)=>[x.id,String(i+1).padStart(2,'0')]));
    return [...document.querySelectorAll('#entries .item')].every(button=>{
      const exerciseId=button.getAttribute('onclick')?.split("'")[1];
      return button.querySelector('.num')?.textContent?.trim()==='Ex. '+expected.get(exerciseId);
    });
  });
  assert.ok(numbersMatch,'All exercise numbers match the original order');
  const legend=await frame.locator('.training-legend').innerText();
  assert.ok(legend.includes('premier choix')&&legend.includes('À retravailler'),
    'Progress legend distinguishes first try from final answer');
  const visibleStates=await frame.locator('#entries .state').evaluateAll(nodes=>
    nodes.every(n=>!!n.getAttribute('aria-label')&&
      /Validé au premier choix|À retravailler|Révision conseillée|Pas encore commencé/.test(n.getAttribute('aria-label'))));
  assert.ok(visibleStates,'Progress states have meaningful accessible labels');
  await listFilter.selectOption('all');
  assert.equal(await listFilter.evaluate(el=>document.activeElement===el),true,'Focus remains after reset filter');

  // Deux actions internes successives : la dernière ne doit pas disparaître pendant le fondu.
  const previousTopic=await listFilter.evaluate(()=>cat);
  await listFilter.evaluate(()=>{
    topic('ouverture');
    topic(cat);
  });
  const frameAfterQueue=page.frames().find(f=>f.url().includes('/entrainement/'));
  await frameAfterQueue.waitForFunction(previous=>view==='list'&&cat===previous&&!trainingPendingNav&&!trainingQueuedNav,
    previousTopic,{timeout:15000});
  assert.equal(await listFilter.evaluate(()=>cat),previousTopic,'Last requested topic wins during a transition');

  // Navigation réelle précédent/suivant, sans rechargement de l'iframe ni perte de progression.
  const trainingFrameForNav=page.frames().find(f=>f.url().includes('/entrainement/'));
  assert.ok(trainingFrameForNav,'Training iframe is available for internal navigation');
  const bidRecord=await trainingFrameForNav.evaluate(()=>{
    const exId=D.bidding.find(x=>saved[x.id]?.done)?.id;
    const record=exId?saved[exId]:null;
    return {exId,persisted:!!record?.done,attempts:record?.attempts,history:record?.history?.length};
  });
  assert.ok(bidRecord.exId&&bidRecord.persisted,'Answered bidding exercise is saved');
  assert.ok(bidRecord.attempts>=1&&bidRecord.history>=1,'Bidding answer history is stored');
  let iframeNavigations=0;
  page.on('framenavigated',f=>{if(f===trainingFrameForNav)iframeNavigations++});
  await frame.locator('.item').first().click();
  await quiz.waitFor({state:'visible',timeout:15000});
  const firstBidId=await trainingFrameForNav.evaluate(()=>id);
  const firstIndex=await trainingFrameForNav.evaluate(()=>current().choices.indexOf(current().correct));
  await quiz.locator('.choice[data-answer-index="'+firstIndex+'"]').click();
  const firstChoice=await trainingFrameForNav.evaluate(()=>({
    selected:chosen,attempts:saved[id]?.attempts??0,history:saved[id]?.history?.length??0,
    redoAnswered,corrected:!!document.querySelector('.feedback,.source-correction')
  }));
  assert.ok(firstChoice.corrected,'First exercise reveals its explanation');
  const firstAlternatives=quiz.locator('.postsolution-trigger').first();
  const hasAlternatives=await firstAlternatives.count()>0;
  if(hasAlternatives){
    await firstAlternatives.click();
    // La transition ne doit pas commencer tant que l'accordeon n'est pas ouvert.
    // On teste bien l'ouverture effective, sans diminuer l'exigence de restauration.
    await trainingFrameForNav.waitForFunction(
      ()=>document.querySelector('.postsolution-trigger')?.getAttribute('aria-expanded')==='true',
      null,{timeout:5000}
    );
  }
  await frame.locator('.footnav button.primary').click();
  await trainingFrameForNav.waitForFunction(previous=>view==='quiz'&&id!==previous,firstBidId);
  assert.equal(await quiz.locator('.choices>.choice').count(),4,'Next exercise has four choices');
  const secondBidId=await trainingFrameForNav.evaluate(()=>id);
  const secondIndex=await trainingFrameForNav.evaluate(()=>current().choices.indexOf(current().correct));
  await quiz.locator('.choice[data-answer-index="'+secondIndex+'"]').click();
  const secondChoice=await trainingFrameForNav.evaluate(()=>({
    selected:chosen,attempts:saved[id]?.attempts??0,history:saved[id]?.history?.length??0
  }));
  await frame.locator('.footnav button').first().click();
  await trainingFrameForNav.waitForFunction(first=>view==='quiz'&&id===first,firstBidId);
  assert.equal(iframeNavigations,0,'Internal previous/next navigation does not reload the training iframe');
  assert.equal(await quiz.locator('.choice.selected').count(),1,'Returning to an answered exercise keeps its selected answer');
  assert.equal(await quiz.locator('.choice.selected').getAttribute('data-answer-index'),String(firstIndex),
    'The previous answer remains checked');
  const restored=await trainingFrameForNav.evaluate(()=>({
    selected:chosen,attempts:saved[id]?.attempts??0,history:saved[id]?.history?.length??0,
    redoAnswered,corrected:!!document.querySelector('.feedback,.source-correction')
  }));
  assert.deepEqual(restored,firstChoice,'Previous preserves the exact answer state without recording a new attempt');
  if(hasAlternatives){
    // Le changement d'ID peut precéder la fin du rendu de la page precedente.
    try{
      await trainingFrameForNav.waitForFunction(
        ()=>document.querySelector('.postsolution-trigger')?.getAttribute('aria-expanded')==='true',
        null,{timeout:5000}
      );
    }catch(error){
      const diagnostic=await trainingFrameForNav.evaluate(()=>({
        exercise:id,view,expanded:document.querySelector('.postsolution-trigger')?.getAttribute('aria-expanded'),
        openClass:document.querySelector('.postsolution-notes')?.classList.contains('is-open'),
        remembered:sessionQuizStates.get(id)?.alternativesOpen??null,
        pendingNav:!!trainingPendingNav,queuedNav:!!trainingQueuedNav
      }));
      console.error('TRAINING_RESTORE_ALTERNATIVES_DIAGNOSTIC',JSON.stringify(diagnostic));
      throw error;
    }
    assert.equal(await quiz.locator('.postsolution-trigger').first().getAttribute('aria-expanded'),'true',
      'Opened alternative explanations stay open when going back');
  }
  await frame.locator('.footnav button.primary').click();
  await trainingFrameForNav.waitForFunction(second=>view==='quiz'&&id===second,secondBidId);
  assert.equal(await quiz.locator('.choice.selected').getAttribute('data-answer-index'),String(secondIndex),
    'Next also returns to the previous selection in the second exercise');
  const secondRestored=await trainingFrameForNav.evaluate(()=>({
    selected:chosen,attempts:saved[id]?.attempts??0,history:saved[id]?.history?.length??0
  }));
  assert.deepEqual(secondRestored,secondChoice,'Neither direction increments visits during navigation');
  await frame.locator('.footnav button').first().click();
  await trainingFrameForNav.waitForFunction(first=>view==='quiz'&&id===first,firstBidId);
  await frame.locator('.qpjb-quiz-nav button.back').click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  const recordAfterNavigation=await trainingFrameForNav.evaluate(exId=>saved[exId],firstBidId);
  assert.ok(recordAfterNavigation?.done&&recordAfterNavigation.attempts>=bidRecord.attempts,
    'Internal navigation preserves the saved answer');


  // Exercice 12 de la rubrique 2SA : les commentaires comportent des Cœurs et Carreaux.
  await frame.locator('.item').nth(11).click();
  await quiz.waitFor({state:'visible',timeout:15000});
  const correctOriginalIndex=await accessibilityFrame.evaluate(()=>current().choices.indexOf(current().correct));
  assert.ok(correctOriginalIndex>=0,'The correct option exists in the original source list');
  await quiz.locator('.choices>.choice[data-answer-index="'+correctOriginalIndex+'"]').click();
  const redExtra=frame.locator('.postsolution-trigger');
  await redExtra.waitFor({state:'visible',timeout:5000});
  await redExtra.click();
  const redSymbols=frame.locator('.postsolution-item .symbol-suit.suit-red');
  assert.ok(await redSymbols.count()>0,'Red suits in dynamically inserted explanations must be colorized');
  const suitColors=await redSymbols.first().evaluate(el=>({
    symbol:getComputedStyle(el).color,parent:getComputedStyle(el.parentElement).color
  }));
  assert.notEqual(suitColors.symbol,suitColors.parent,'Heart/Diamond must have a distinct red color');
  await page.goBack({waitUntil:'domcontentloaded'});
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  // Les exercices guidés se trient aussi, mais gardent leur identifiant de choix source.
  await accessibilityFrame.evaluate(()=>item('EN-2sa-005'));
  await accessibilityFrame.waitForFunction(()=>view==='quiz'&&id==='EN-2sa-005',{timeout:15000});
  const guidedChoices=frame.locator('.qpjb-bid-quiz .choices>.choice');
  assert.deepEqual((await guidedChoices.allTextContents()).map(t=>t.replace(/[\uFE0E\uFE0F]/g,'').trim()),
    ['Passe','3♥','3♠','3SA'],'Guided exercises follow the same cheapest-first rule');
  await frame.locator('.qpjb-bid-quiz .choice[data-answer-index="3"]').click();
  assert.equal(await frame.locator('.qpjb-bid-quiz .choice.selected').getAttribute('data-answer-index'),'3',
    'Guided choice retains original source index after visual sorting');
  await frame.locator('.source-correction > p:first-of-type > strong').waitFor({state:'visible',timeout:15000});
  assert.equal((await frame.locator('.source-correction > p:first-of-type > strong').textContent()).replace(/[\uFE0E\uFE0F]/g,'').trim(),'3♠',
    'SEF chase-croise after 2SA negative Stayman must show five hearts with 3 spades');
  assert.match((await frame.locator('.source-correction h3').textContent()),/explication pédagogique validée/,
    'Corrected SEF result must not be attributed to the original PDF');
  await frame.locator('.qpjb-quiz-nav button.back').click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});

  // Le second espace pédagogique doit utiliser la même navigation et le même fondu.
  await page.locator('.training-tab[data-mode="play"]').click();
  await frame.locator('.training-overview').filter({hasText:'Jeu de la carte'}).waitFor({state:'visible',timeout:15000});
  await frame.locator('.topic-group .tile').first().click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  await frame.locator('.item').first().click();
  await frame.locator('main .panel').first().waitFor({state:'visible',timeout:15000});
  await page.goBack({waitUntil:'domcontentloaded'});
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});

  // La table est orientée depuis le JOUEUR (en bas), pas figée sur Nord en haut.
  const childFrame=page.frame({url:/\/entrainement\//});
  assert.ok(childFrame,'Training iframe must exist');
  // Reprise B/C : ouvrir les 27 nouveaux écrans avec un vrai moteur navigateur.
  // Contrôle de la question, des mains de 13 cartes et des places physiques.
  const newBidIds=['EN-BH-134-05','EN-BH-135-02','EN-BH-084-01','EN-BH-084-02',
   'EN-BH-084-03','EN-BH-084-04','EN-BH-084-05','EN-BH-084-06',
   'EN-BH-111-02','EN-BH-111-03','EN-BH-111-05','EN-BH-032-P2-06',
   'EN-BH-036-P2-05','EN-BH-036-P2-06','EN-BH-040-P2-01',
   'EN-BH-040-P2-02','EN-BH-043-P2-02'];
  const newCardIds=['JC-BH-107-P2','JC-BH-108-P2','JC-BH-109-P2','JC-BH-110-P2',
   'JC-BH-115-P2','JC-BH-116-P2','JC-BH-119-P2','JC-BH-122-P2',
   'JC-BH-123-P2','JC-BH-125-P2'];
  const extensionScreens=await childFrame.evaluate(({bidIds,cardIds})=>{
    const result=[];
    for(const exerciseId of bidIds){
      cat='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const q=current(),answers=[...document.querySelectorAll('.qpjb-bid-quiz .choices .choice')];
      result.push({id:exerciseId,type:'bidding',loaded:!!q&&!!document.querySelector('.qpjb-bid-quiz'),
       choices:answers.length,validAnswer:answers.some(n=>n.textContent.replace(/[\uFE0E\uFE0F]/g,'').trim()===q?.correct),
       handSuits:document.querySelectorAll('.qpjb-bid-quiz .suits .suit').length,
       wrongSeat:q?.auction.flat().filter(v=>v==='?').length!==1||!q.auction.some(row=>row[0]==='?'),
       overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2});
    }
    for(const exerciseId of cardIds){
      cat='play';ptopic='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const q=current(),seats=[...document.querySelectorAll('.play-free-panel .deal-seat')]
        .map(x=>x.dataset.seat).sort();
      const expected=exerciseId==='JC-BH-116-P2'?['east','north']:['north','south'];
      result.push({id:exerciseId,type:'card',loaded:!!q&&!!document.querySelector('.play-free-panel'),
       visibleSeats:seats,expected,correctPerspective:
         document.querySelector('.play-free-panel .deal-viewer')?.dataset.perspective===
         (exerciseId==='JC-BH-116-P2'?'east':'south'),
       hasAnalysisButton:!!document.querySelector('.play-free-panel button[onclick="revealPlay()"]'),
       overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2});
    }
    return result;
  },{bidIds:newBidIds,cardIds:newCardIds});
  assert.equal(extensionScreens.length,27,'All 27 extension screens inspected');
  for(const q of extensionScreens){
   assert.ok(q.loaded,'Extension exercise opens in integrated training: '+q.id);
   assert.ok(!q.overflow,'Extension exercise fits the iPhone width: '+q.id);
   if(q.type==='bidding'){
    assert.ok(q.choices>=3&&q.choices<=4&&q.validAnswer&&q.handSuits===4&&!q.wrongSeat,
      'Bidding hand, 3/4 choices, answer and South seat: '+q.id);
   }else{
    assert.deepEqual(q.visibleSeats,q.expected,'Only authentic known card hands are shown: '+q.id);
    assert.ok(q.correctPerspective&&q.hasAnalysisButton,
      'Card player perspective and reveal action are correct: '+q.id);
   }
  }
  // Lot 04 — contrôle explicite des 29 rendus sur le moteur navigateur réel.
  // Les captures sont conservées comme preuves CI; ne modifie aucune donnée source.
  const lot04BidIds=[
    'EN-BH-032-P2-01','EN-BH-032-P2-02','EN-BH-033-P2-02',
    'EN-BH-036-P2-01','EN-BH-036-P2-02','EN-BH-036-P2-03','EN-BH-036-P2-04',
    'EN-BH-040-P2-03','EN-BH-040-P2-04','EN-BH-040-P2-05',
    'EN-BH-042-P2-01','EN-BH-042-P2-02','EN-BH-043-P2-01','EN-BH-137-03'
  ];
  const lot04CardIds=[
    'JC-BH-039-M02','JC-BH-039-M03','JC-BH-039-M04',
    'JC-BH-087-P2','JC-BH-088-P2-A','JC-BH-092-P2','JC-BH-093-P2',
    'JC-BH-094-P2','JC-BH-099-P2','JC-BH-102-P2','JC-BH-106-P2',
    'JC-BH-054-P2','JC-BH-062-P2','JC-BH-067-P2','JC-BH-069-P2'
  ];
  const lot04Dir=path.join(project,'artifacts','training-visual',browserType,'lot04');
  fs.mkdirSync(lot04Dir,{recursive:true});
  const lot04RenderChecks=[];
  for(const target of lot04BidIds){
    const state=await childFrame.evaluate(exerciseId=>{
      cat='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const x=current();
      const quiz=document.querySelector('.qpjb-bid-quiz');
      const options=[...(quiz?.querySelectorAll('.choices .choice')||[])];
      const visibleSuits=quiz?.querySelectorAll('.suits .suit').length||0;
      const heading=quiz?.querySelector('.panel h2')?.textContent.trim()||'';
      const auctionText=quiz?.querySelector('.auc')?.textContent||'';
      return {id:exerciseId,loaded:!!x&&!!quiz,choices:options.length,
        validAnswer:options.some(e=>e.textContent.replace(/[\uFE0E\uFE0F]/g,'').trim()===x?.correct),
        visibleSuits,sourceSuits:x?.hand?.length||0,heading,
        yesNo:options.map(e=>e.textContent.trim()),
        auctionShown:!!auctionText.trim(),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2};
    },target);
    assert.ok(state.loaded,'Lot 04 bidding screen opens: '+target);
    assert.ok(state.validAnswer&&state.auctionShown&&!state.overflow,
      'Lot 04 bidding answer/auction/mobile width: '+target+' '+JSON.stringify(state));
    if(target==='EN-BH-137-03'){
      assert.deepEqual(state.yesNo,['Oui','Non'],'Stayman question keeps exactly Oui/Non');
      assert.equal(state.visibleSuits,0,'Stayman yes/no has no fabricated hand');
      assert.equal(state.heading,'Analyser la séquence','No misleading seat on Stayman yes/no');
    }else{
      assert.equal(state.choices,4,'Lot 04 QCM has four answers: '+target);
      assert.equal(state.visibleSuits,4,'Lot 04 four visible suits: '+target);
      assert.equal(state.sourceSuits,4,'Lot 04 data contains four suits: '+target);
      assert.equal(state.heading,'Vous êtes en Est','Lot 04 real turn to bid is East: '+target);
    }
    lot04RenderChecks.push({type:'bidding',...state});
    await frame.locator('#root').screenshot({path:path.join(lot04Dir,target+'.png'),animations:'disabled'});
  }
  for(const target of lot04CardIds){
    const state=await childFrame.evaluate(exerciseId=>{
      cat='play';ptopic='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const x=current();
      const panel=document.querySelector('.play-free-panel');
      const seatEls=[...(panel?.querySelectorAll('.deal-seat')||[])];
      const seats=seatEls.map(e=>e.dataset.seat).sort();
      const partial=exerciseId.startsWith('JC-BH-039-')||exerciseId==='JC-BH-088-P2-A';
      const handLengths=(x?.holdings||[]).map(h=>h.rows.reduce((n,row)=>n+
        row.ranks.replace(/10/g,'T').replace(/\s/g,'').length,0));
      return {id:exerciseId,loaded:!!x&&!!panel,
        seats,handLengths,partial,
        perspective:panel?.querySelector('.deal-viewer')?.dataset.perspective,
        promptShown:!!panel?.querySelector('p')&&(panel.textContent||'').trim().length>80,
        reveal:!!panel?.querySelector('button[onclick="revealPlay()"]'),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2};
    },target);
    assert.ok(state.loaded&&state.reveal&&state.promptShown,
      'Lot 04 free-plan question/answer action renders: '+target+' '+JSON.stringify(state));
    assert.deepEqual(state.seats,['north','south'],'Lot 04 does not reveal defenders: '+target);
    assert.equal(state.perspective,'south','Lot 04 declarer is correctly positioned: '+target);
    assert.deepEqual(state.handLengths,state.partial
      ? (target==='JC-BH-088-P2-A'?[4,3]:[4,4]):[13,13],
      'Lot 04 authentic full vs partial hands: '+target);
    assert.equal(state.overflow,false,'Lot 04 fits iPhone width: '+target);
    lot04RenderChecks.push({type:'play',...state});
    await frame.locator('#root').screenshot({path:path.join(lot04Dir,target+'.png'),animations:'disabled'});
    // Sur téléphone, le contenu long défile DANS l'iframe. Un screenshot
    // du root seul ne photographie pas les cartes situées sous le viewport.
    // Faire réellement défiler le navigateur jusqu'à la main du déclarant.
    const southHand=frame.locator('.play-free-panel .deal-seat[data-seat="south"]');
    await southHand.scrollIntoViewIfNeeded();
    const southView=await southHand.evaluate(el=>{
      const rect=el.getBoundingClientRect();
      return {top:rect.top,bottom:rect.bottom,viewport:el.ownerDocument.documentElement.clientHeight};
    });
    assert.ok(southView.top<southView.viewport&&southView.bottom>0,
      'Lot 04 South hand is reachable by actual mobile scrolling: '+target+' '+JSON.stringify(southView));
    await page.screenshot({path:path.join(lot04Dir,target+'-sud-visible.png'),fullPage:false});
    if(['JC-BH-088-P2-A','JC-BH-062-P2','JC-BH-069-P2'].includes(target)){
      await childFrame.evaluate(()=>revealPlay());
      const actual=await childFrame.evaluate(()=>
        document.querySelector('.play-free-panel .analysis-body')?.textContent||'');
      const expected=target==='JC-BH-088-P2-A'?'double impasse':
        target==='JC-BH-062-P2'?'CINQ levées':'Valet en Ouest';
      assert.ok(actual.includes(expected),
        'Lot 04 corrected pedagogical analysis displayed for '+target+' ('+expected+')');
      await frame.locator('#root').screenshot({path:path.join(lot04Dir,target+'-corrige.png'),animations:'disabled'});
      const detailedAnswer=frame.locator('.play-free-panel .analysis-body');
      await detailedAnswer.scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(lot04Dir,target+'-corrige-visible.png'),fullPage:false});
    }
  }
  assert.equal(lot04RenderChecks.length,29,'All 29 Lot 04 screens inspected in actual browser');
  fs.writeFileSync(path.join(lot04Dir,'lot04-render-audit.json'),
    JSON.stringify({browser:browserType,screenCount:29,checks:lot04RenderChecks},null,2));


  // Lot 05 — 14 visual checks and screenshots on Chromium and WebKit.
  const lot05BidIds=["EN-BH-136-03","EN-BH-139-05","EN-BH-126-06","EN-BH-129-05"];
  const lot05PlayIds=["JC-BH-132-Q01","JC-BH-132-Q05","JC-BH-132-Q06","JC-BH-077-P2","JC-BH-086-P2","JC-BH-114-P2-01","JC-BH-114-P2-02","JC-BH-114-P2-03","JC-BH-114-P2-04","JC-BH-104-05"];
  const lot05Dir=path.join(project,'artifacts','training-visual',browserType,'lot05');
  fs.mkdirSync(lot05Dir,{recursive:true});
  const lot05RenderChecks=[];
  for(const target of lot05BidIds){
    const state=await childFrame.evaluate(exerciseId=>{
      cat='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const x=current(),quiz=document.querySelector('.qpjb-bid-quiz');
      const choices=[...(quiz?.querySelectorAll('.choices .choice')||[])];
      return {id:exerciseId,loaded:!!x&&!!quiz,choices:choices.length,
        correctShown:choices.some(e=>e.textContent.replace(/[\uFE0E\uFE0F]/g,'').trim()===x?.correct),
        suits:quiz?.querySelectorAll('.suits .suit').length||0,
        heading:quiz?.querySelector('.panel h2')?.textContent.trim()||'',
        auctionShown:!!quiz?.querySelector('.auc')?.textContent.trim(),
        turnSeats:(x?.auction||[]).flatMap(row=>row.map((v,i)=>v==='?'?i:-1)).filter(i=>i>=0),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2};
    },target);
    assert.ok(state.loaded&&state.choices===4&&state.correctShown&&state.suits===4&&
      state.auctionShown&&!state.overflow&&state.heading==='Vous êtes en Sud'&&
      state.turnSeats.length===1&&state.turnSeats[0]===0,
      'Lot 05 bidding renders safely: '+target+' '+JSON.stringify(state));
    lot05RenderChecks.push({type:'bidding',...state});
    await frame.locator('#root').screenshot({path:path.join(lot05Dir,target+'.png'),animations:'disabled'});
  }
  for(const target of lot05PlayIds){
    const state=await childFrame.evaluate(exerciseId=>{
      cat='play';ptopic='all';id=exerciseId;trainingApplyPage('quiz',false,false);
      const x=current(),panel=document.querySelector('.play-free-panel');
      return {id:exerciseId,loaded:!!x&&!!panel,
        seats:[...(panel?.querySelectorAll('.deal-seat')||[])].map(e=>e.dataset.seat).sort(),
        expected:(x?.holdings||[]).map(h=>({N:'north',S:'south',E:'east',W:'west'}[h.seat])).sort(),
        perspective:panel?.querySelector('.deal-viewer')?.dataset.perspective,
        expectedPerspective:(x?.holdings||[]).some(h=>h.label==='Vous · Est')?'east':'south',
        reveal:!!panel?.querySelector('button[onclick="revealPlay()"]'),
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2};
    },target);
    assert.ok(state.loaded&&state.reveal&&!state.overflow&&
      state.perspective===state.expectedPerspective,
      'Lot 05 defender/declarer correctly oriented: '+target+' '+JSON.stringify(state));
    assert.deepEqual(state.seats,state.expected,'Lot 05 source-visible hands only: '+target);
    lot05RenderChecks.push({type:'play',...state});
    await frame.locator('#root').screenshot({path:path.join(lot05Dir,target+'.png'),animations:'disabled'});
    const player=frame.locator('.play-free-panel .deal-seat[data-seat="'+state.expectedPerspective+'"]');
    await player.scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(lot05Dir,target+'-joueur-visible.png'),fullPage:false});
    await childFrame.evaluate(()=>revealPlay());
    const analysis=frame.locator('.play-free-panel .analysis-body');
    assert.ok((await analysis.innerText()).length>80,'Lot 05 explanation revealed: '+target);
    await frame.locator('#root').screenshot({path:path.join(lot05Dir,target+'-corrige.png'),animations:'disabled'});
  }
  assert.equal(lot05RenderChecks.length,14,'All 14 Lot 05 exercises checked');
  fs.writeFileSync(path.join(lot05Dir,'lot05-render-audit.json'),
    JSON.stringify({browser:browserType,screenCount:14,checks:lot05RenderChecks},null,2));

  await childFrame.evaluate(()=>playTopic('defense'));
  await frame.locator('.hero h1').filter({hasText:'Défense et signalisation'}).waitFor({state:'visible',timeout:15000});

  // Tester l'orientation pure pour les quatre joueurs, sans toucher aux exercices.
  const perspectives=await childFrame.evaluate(()=>{
    const physical=['north','east','south','west'];
    const sample=Object.fromEntries(physical.map(pos=>[pos,{title:'Vous · '+prettySeat(pos),
      rows:[{suit:'♠',ranks:'ARV'}]}]));
    return physical.map(perspective=>{
      const container=document.createElement('div');
      container.innerHTML=dealViewer(sample,{perspective});
      const table=container.querySelector('.deal-viewer');
      const bottom=table.querySelector('.deal-seat.south');
      const top=table.querySelector('.deal-seat.north');
      const right=table.querySelector('.deal-seat.east');
      const left=table.querySelector('.deal-seat.west');
      return {perspective,at:table.dataset.perspective,
        bottom:bottom?.dataset.seat,top:top?.dataset.seat,
        right:right?.dataset.seat,left:left?.dataset.seat,
        badge:bottom?.querySelector('.deal-seat-pos')?.textContent,
        marker:table.querySelector('.deal-player-group>.deal-marker.south span')?.textContent||null};
    });
  });
  assert.deepEqual(perspectives,[
    {perspective:'north',at:'north',bottom:'north',top:'south',right:'west',left:'east',badge:'N',marker:'N'},
    {perspective:'east',at:'east',bottom:'east',top:'west',right:'north',left:'south',badge:'E',marker:'E'},
    {perspective:'south',at:'south',bottom:'south',top:'north',right:'east',left:'west',badge:'S',marker:null},
    {perspective:'west',at:'west',bottom:'west',top:'east',right:'south',left:'north',badge:'O',marker:'O'}
  ],'Four rotations keep the physical seat labels consistent with the screen');

  // Ouest joue : Ouest en bas, Est en haut, Nord à gauche, Sud à droite.
  await childFrame.evaluate(()=>item('JC-BH-041-Q02'));
  const westTable=frame.locator('.deal-viewer.player-oriented[data-perspective="west"]');
  await westTable.waitFor({state:'visible',timeout:15000});
  assert.equal(await westTable.locator('.deal-seat.south[data-seat="west"] .deal-seat-pos').innerText(),'O',
    'West player hand sits at bottom with an O badge');
  assert.equal(await westTable.locator('.deal-player-group>.deal-marker.south[data-seat="west"] span').innerText(),'O',
    'The separate O circle sits immediately above the West hand');
  assert.equal(await westTable.locator('.deal-seat.west[data-seat="north"]').count(),1,
    'North dummy rotates to the left when West plays');
  assert.equal(await westTable.locator('.deal-marker.north[data-seat="east"] span').innerText(),'E',
    'Top marker becomes East when West plays');
  assert.equal(await westTable.locator('.deal-marker.east[data-seat="south"] span').innerText(),'S',
    'Right marker becomes South when West plays');
  const westPos=await westTable.evaluate(el=>{
    const hand=el.querySelector('.deal-seat.south').getBoundingClientRect(),
      dummy=el.querySelector('.deal-seat.west').getBoundingClientRect(),
      center=el.querySelector('.deal-center').getBoundingClientRect(),
      shell=el.closest('.deal-viewer-shell').getBoundingClientRect();
    return {below:hand.top>=center.bottom-2,left:dummy.right<=center.left+3,
      wide:dummy.width>=135,inShell:dummy.left>=shell.left-3&&dummy.right<=shell.right+3,
      sideMoved:!!el.querySelector('.deal-lateral-hand')};
  });
  assert.ok(westPos.below&&westPos.left&&westPos.wide&&westPos.inShell&&!westPos.sideMoved,
    'West-oriented hand, dummy and table stay usable on iPhone: '+JSON.stringify(westPos));

  // Est joue : Est en bas, Ouest en haut, Nord à droite, Sud à gauche.
  await childFrame.evaluate(()=>item('JC-BH-006-Q01'));
  const eastTable=frame.locator('.deal-viewer.player-oriented[data-perspective="east"]');
  await eastTable.waitFor({state:'visible',timeout:15000});
  assert.equal(await eastTable.locator('.deal-seat.south[data-seat="east"] .deal-seat-pos').innerText(),'E',
    'East hand sits at bottom with an E badge');
  assert.equal(await eastTable.locator('.deal-player-group>.deal-marker.south[data-seat="east"] span').innerText(),'E',
    'The separate E circle sits immediately above the East hand');
  const circleAbove=await eastTable.evaluate(el=>{
    const c=el.querySelector('.deal-player-group>.deal-marker.south').getBoundingClientRect();
    const hand=el.querySelector('.deal-player-group>.deal-seat.south').getBoundingClientRect();
    return c.bottom<=hand.top+1&&c.top<hand.top;
  });
  assert.ok(circleAbove,'The E direction circle is visually above the player hand');
  assert.equal(await eastTable.locator('.deal-seat.east[data-seat="north"]').count(),1,
    'North dummy rotates to the right when East plays');
  assert.equal(await eastTable.locator('.deal-marker.north[data-seat="west"] span').innerText(),'O',
    'Top marker becomes West when East plays');
  assert.equal(await eastTable.locator('.deal-marker.west[data-seat="south"] span').innerText(),'S',
    'Left marker becomes South when East plays');
  const eastPos=await eastTable.evaluate(el=>{
    const hand=el.querySelector('.deal-seat.south').getBoundingClientRect(),
      dummy=el.querySelector('.deal-seat.east').getBoundingClientRect(),
      center=el.querySelector('.deal-center').getBoundingClientRect(),
      shell=el.closest('.deal-viewer-shell').getBoundingClientRect();
    return {below:hand.top>=center.bottom-2,right:dummy.left>=center.right-3,
      wide:dummy.width>=135,inShell:dummy.left>=shell.left-3&&dummy.right<=shell.right+3,
      sideMoved:!!el.querySelector('.deal-lateral-hand')};
  });
  assert.ok(eastPos.below&&eastPos.right&&eastPos.wide&&eastPos.inShell&&!eastPos.sideMoved,
    'East-oriented hand, dummy and table stay usable on iPhone: '+JSON.stringify(eastPos));
  const eastLeadPlacement=await eastTable.evaluate(el=>{
    const top=el.querySelector('.deal-leader-group>.deal-marker.north');
    const lead=el.querySelector('.deal-leader-group>.deal-played');
    const hand=el.querySelector('.deal-seat.south').getBoundingClientRect();
    const dummy=el.querySelector('.deal-seat.east').getBoundingClientRect();
    return {
      leadSeat:lead?.dataset.seat,
      topSeat:top?.dataset.seat,
      correctVerticalOrder:!!lead&&!!top&&top.getBoundingClientRect().bottom<=lead.getBoundingClientRect().top+1,
      equalWidth:Math.abs(hand.width-dummy.width)<=1,
      equalHeight:Math.abs(hand.height-dummy.height)<=1,
      playerWidth:hand.width,dummyWidth:dummy.width,playerHeight:hand.height,dummyHeight:dummy.height
    };
  });
  assert.equal(eastLeadPlacement.leadSeat,'west','The lead belongs to West');
  assert.equal(eastLeadPlacement.topSeat,'west','The top marker is West');
  assert.ok(eastLeadPlacement.correctVerticalOrder,'West lead is shown under West');
  assert.ok(eastLeadPlacement.equalWidth&&eastLeadPlacement.equalHeight,
    'Dummy and player boxes must be identical: '+JSON.stringify(eastLeadPlacement));


  // Lorsqu'une seule main est visible, elle doit aussi être en bas (Est et Ouest).
  for(const [exercise,seat,badge] of [['JC-BH-023-Q01','east','E'],['JC-BH-021-Q01','west','O']]){
    await childFrame.evaluate(ex=>item(ex),exercise);
    await childFrame.waitForFunction(({exercise,seat})=>id===exercise&&
      document.querySelector('.deal-viewer.player-oriented')?.dataset.perspective===seat,
      {exercise,seat},{timeout:15000});
    const table=frame.locator('.deal-viewer.player-oriented');
    assert.equal(await table.getAttribute('data-perspective'),seat,
      'Explicit player seat determines the whole table orientation');
    assert.equal(await table.locator('.deal-seat.south').getAttribute('data-seat'),seat,
      'Only visible hand stays at bottom');
    assert.equal(await table.locator('.deal-seat.south .deal-seat-pos').innerText(),badge,
      'Bottom badge matches the player in the exercise text');
    assert.equal(await table.locator('.deal-player-group>.deal-marker.south span').innerText(),badge,
      'Circle above the only visible hand matches the player');
  }

  // Entames : la bonne carte apparaît au bon siège sans recréer les mains.
  await childFrame.evaluate(()=>item('JC-BH-020-Q01'));
  await childFrame.waitForFunction(()=>id==='JC-BH-020-Q01'&&document.querySelector('.cq-stage .cq-option'));
  const leadStage=frame.locator('.cq-stage'),leadTable=leadStage.locator('.deal-viewer');
  assert.equal(await leadTable.getAttribute('data-perspective'),'east',
    'East leads from the bottom of their own oriented table');
  await leadTable.evaluate(el=>{el.dataset.stableLeadTable='yes'});
  assert.equal(await leadStage.locator('.deal-played').count(),0,'No lead is shown before choosing');
  const leadOptions=leadStage.locator('.cq-option');
  await leadOptions.nth(0).click();
  await leadStage.locator('.deal-played').waitFor({state:'attached',timeout:5000});
  assert.equal(await leadStage.locator('.deal-played').getAttribute('data-seat'),'east',
    'Played lead belongs to East, not West');
  assert.equal(await leadTable.getAttribute('data-stable-lead-table'),'yes',
    'Displaying the lead preserves the original table DOM');
  const leadGrid=await leadStage.locator('.cq-options').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
  assert.equal(leadGrid,2,'Short card options appear in two columns on iPhone');
  await leadOptions.nth(0).click();
  assert.equal(await leadStage.locator('.deal-played').count(),0,
    'Unselecting removes the lead without recreating the table');
  assert.equal(await leadTable.getAttribute('data-stable-lead-table'),'yes',
    'Unselection keeps the same cards and table');
  await leadOptions.nth(1).click();
  assert.equal(await leadStage.locator('.deal-played').count(),0,
    'A wrong lead does not reveal the expected card');

  // Les anciens diagrammes restent fidèles quand leur orientation est ambiguë.
  for(const ex of ['JC-010','JC-012']){
    await childFrame.evaluate(exercise=>item(exercise),ex);
    await childFrame.waitForFunction(exercise=>id===exercise&&
      !!document.querySelector('.legacy-defense-source .legacy-defense-heading'),ex,{timeout:15000});
    const original=frame.locator('.legacy-defense-source');
    assert.ok((await original.locator('figcaption').last().innerText()).includes('aucune orientation supposée'),
      'Historical defense source never assigns unverified seats');
    assert.ok((await original.locator('img').getAttribute('src')).includes(ex+'.webp'),
      'Original defense image remains unchanged');
  }

  // Une longue proposition garde la pleine largeur (pas de colonne illisible).
  await childFrame.evaluate(()=>playTopic('plan-qcm'));
  await childFrame.waitForFunction(()=>view==='list'&&ptopic==='plan-qcm',{timeout:15000});
  await childFrame.evaluate(()=>item('JC-BH-004-1-Q01'));
  await childFrame.waitForFunction(()=>id==='JC-BH-004-1-Q01'&&document.querySelector('.cq-stage'),{timeout:15000});
  const longGrid=await frame.locator('.cq-options').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
  assert.equal(longGrid,1,'Long card options remain in one readable column');

  // Un choix de carte n'efface plus l'énoncé ou la table : même nœud DOM.
  await childFrame.evaluate(()=>item('JC-BH-041-Q02'));
  await childFrame.waitForFunction(()=>id==='JC-BH-041-Q02'&&document.querySelector('.cq-stage .cq-option'));
  const cardPanel=frame.locator('.cq-stage'),cardOptions=cardPanel.locator('.cq-option');
  await cardPanel.evaluate(el=>{el.dataset.stableCard='yes'});
  await cardOptions.nth(0).click();
  await frame.locator('.qpjb-card-answer-area.is-open').waitFor({state:'visible',timeout:5000});
  const cardFirst=await cardPanel.evaluate(()=>({attempts:saved[id].attempts,validated:saved[id].validated}));
  assert.equal(await cardPanel.getAttribute('data-stable-card'),'yes','Card exercise is not recreated on answer');
  assert.equal(await cardPanel.locator('.cq-option.wrong').count(),1,'Wrong answer marked without render');
  await cardOptions.nth(0).click();
  assert.equal(await cardPanel.locator('.cq-option.selected').count(),0,'Second click unselects a card answer');
  assert.equal(await cardPanel.locator('.qpjb-card-answer-area[aria-hidden="true"]').count(),1,'Card explanation closes in place');
  await cardOptions.nth(1).click();
  const cardSecond=await cardPanel.evaluate(()=>({attempts:saved[id].attempts,validated:saved[id].validated}));
  assert.equal(cardSecond.attempts,cardFirst.attempts,'Card reselect counts as the same visit');
  assert.equal(cardSecond.validated,cardFirst.validated,'Card first selection keeps the validation status');
  assert.equal(await cardPanel.getAttribute('data-stable-card'),'yes','Correct answer also preserves the card viewer');
  assert.equal(await cardPanel.locator('.cq-option.correct').count(),1,'Correct card answer marked');
  await cardPanel.locator('.qpjb-card-answer-area.is-open').waitFor({state:'visible',timeout:5000});

  // Les trois adaptations de carte sont ouvertes mais non notées : navigation et sauvegardes intactes.
  await childFrame.evaluate(()=>playTopic('defense'));
  await frame.locator('.hero h1').filter({hasText:'Défense et signalisation'}).waitFor({state:'visible',timeout:15000});
  const guidedPlayBefore=await childFrame.evaluate(()=>localStorage.getItem(KEY));
  assert.equal(await childFrame.evaluate(()=>D.play.filter(x=>x.reviewStatus!=='a_verifier').length),188,
    'All 188 card exercises are now available');
  const adaptedCardRoutes=[
    {id:'JC-BH-014-Q01',topic:'communications',answer:0,choices:4},
    {id:'JC-BH-028-Q04',topic:'defense',answer:2,choices:3},
    {id:'JC-BH-036-Q02',topic:'maniements',answer:1,choices:4}
  ];
  for(const entry of adaptedCardRoutes){
    const rendered=await childFrame.evaluate(x=>{
      cat='play';ptopic=x.topic;id=x.id;trainingApplyPage('quiz',false,false);
      return {view,id,options:document.querySelectorAll('.cq-stage .cq-option').length,
        guided:current()?.reviewStatus,original:current()?.sourceOriginalPrompt};
    },entry);
    assert.equal(rendered.view,'quiz','Guided card route opens for '+entry.id);
    assert.equal(rendered.id,entry.id,'Guided card ID restored '+entry.id);
    assert.equal(rendered.options,entry.choices,'All card choices displayed for '+entry.id);
    assert.equal(rendered.guided,'transcrit_source','Card is in ungraded self-assessment '+entry.id);
    assert.ok(rendered.original?.length>15,'Original prompt is retained '+entry.id);
    await childFrame.evaluate(idx=>chooseSource(idx),entry.answer);
    assert.equal(await childFrame.evaluate(()=>document.querySelector('.cq-option.selected')?.dataset.answerIndex),
      String(entry.answer),'Guided answer selected for '+entry.id);
    assert.equal(await childFrame.evaluate(()=>document.querySelector('.qpjb-card-answer-area')?.getAttribute('aria-hidden')),
      null,'Correction is available without grading for '+entry.id);
    assert.ok((await childFrame.evaluate(()=>document.querySelector('.qpjb-card-answer-area')?.textContent||''))
      .includes('Il n’y a pas de notation automatique'),'No automatic grade for '+entry.id);
    await childFrame.evaluate(idx=>chooseSource(idx),entry.answer);
    assert.equal(await childFrame.evaluate(()=>document.querySelector('.qpjb-card-answer-area')?.getAttribute('aria-hidden')),
      'true','Second click unchecks the guided answer for '+entry.id);
  }
  assert.equal(await childFrame.evaluate(()=>localStorage.getItem(KEY)),guidedPlayBefore,
    'Guided card selections never rewrite saved progress automatically');

  // Les plans libres importés ont deux mains réelles, jamais une image manquante.
  // Exerce le rendu hérité du lot 02 ET les nouvelles fiches du lot 03.
  const lot03FreePlanChecks=[
    {id:'JC-BH-084-P2',expectedLead:'west'},
    {id:'JC-BH-074-P2',expectedLead:'west'},
    {id:'JC-BH-078-P2',expectedLead:'west'}
  ];
  for(const entry of lot03FreePlanChecks){
    const state=await childFrame.evaluate(target=>{
      cat='play';ptopic='plan-libre';id=target;trainingApplyPage('quiz',false,false);
      const panel=document.querySelector('.play-free-panel');
      const viewer=panel?.querySelector('.deal-viewer');
      return {id,view,viewer:!!viewer,
        hands:[...(panel?.querySelectorAll('.deal-seat')||[])].map(e=>e.getAttribute('data-seat')).sort(),
        leadSeat:panel?.querySelector('.deal-played')?.getAttribute('data-seat')||null,
        imageFallback:!!panel?.querySelector('.game-img-wrap .game-img'),
        perspective:viewer?.getAttribute('data-perspective')};
    },entry.id);
    assert.equal(state.id,entry.id,'Free plan navigates to exact original exercise');
    assert.equal(state.view,'quiz','Free plan route opens correctly '+entry.id);
    assert.equal(state.viewer,true,'Two-hand card diagram is rendered '+entry.id);
    assert.deepEqual(state.hands,['north','south'],'Only the two known hands are displayed '+entry.id);
    assert.equal(state.leadSeat,entry.expectedLead,'West opening lead is shown '+entry.id);
    assert.equal(state.imageFallback,false,'No invalid legacy screenshot fallback '+entry.id);
    assert.equal(state.perspective,'south','Declarer remains in South '+entry.id);
  }
  await childFrame.evaluate(()=>revealPlay());
  const lot03FreeAnswer=await childFrame.evaluate(()=>
    document.querySelector('.play-free-panel .analysis-body')?.textContent||'');
  const normalizedPlan=lot03FreeAnswer.replace(/[\uFE0E\uFE0F]/g,'');
  assert.ok(normalizedPlan.includes('PLAN LÉVÉE PAR LÉVÉE')&&normalizedPlan.includes('♣A'),
    'Lot 03 free response reveals its full explanatory plan');

  // BH-017 : le déclarant cherche à éviter l'adversaire dangereux, pas une défense.
  await childFrame.evaluate(()=>playTopic('plan-qcm'));
  await frame.locator('.hero h1').filter({hasText:'Décisions de plan de jeu'}).waitFor({state:'visible',timeout:15000});
  const bh17Ids=await childFrame.evaluate(()=>rel().filter(x=>x.id.startsWith('JC-BH-017-')).map(x=>x.id));
  assert.equal(bh17Ids.length,4,'BH-017 is present in plan QCM');
  await childFrame.evaluate(()=>item('JC-BH-017-Q01'));
  const bh17Viewer=frame.locator('.deal-viewer.compact');
  await bh17Viewer.waitFor({state:'visible',timeout:15000});
  assert.equal(await bh17Viewer.locator('.deal-seat.north').count(),1,'BH-017 dummy is North');
  assert.equal(await bh17Viewer.locator('.deal-seat.south').count(),1,'BH-017 declarer is South');
  assert.equal(await bh17Viewer.locator('.deal-seat.west,.deal-seat.east').count(),0,'BH-017 does not show a defender hand');
  await childFrame.evaluate(()=>playTopic('defense'));
  await frame.locator('.hero h1').filter({hasText:'Défense et signalisation'}).waitFor({state:'visible',timeout:15000});
  assert.equal(await childFrame.evaluate(()=>rel().filter(x=>x.id.startsWith('JC-BH-017-')).length),0,'BH-017 no longer appears in Defense');

  // Anciennes captures incertaines : ne jamais inventer la place du joueur.
  await childFrame.evaluate(()=>item('JC-010'));
  await frame.locator('.legacy-defense-source .game-img').waitFor({state:'visible',timeout:15000});
  await childFrame.waitForFunction(()=>document.querySelector('.legacy-defense-source .game-img')?.naturalWidth>0,null,{timeout:15000});
  assert.ok((await frame.locator('.legacy-defense-source .game-img').getAttribute('src')).endsWith('/JC-010.webp'),
    'Original defense facsimile loads correctly from its WebP file');
  assert.equal(await frame.locator('.deal-viewer.compact').count(),0,
    'Uncertain defense source must not invent an opposite N/S pair');

  // Un déclarant garde au contraire les deux mains en vis-à-vis.
  await childFrame.evaluate(()=>playTopic('plan-libre'));
  await frame.locator('.hero h1').filter({hasText:'Construire son plan de jeu'}).waitFor({state:'visible',timeout:15000});
  await childFrame.evaluate(()=>item('JC-001'));
  await frame.locator('.deal-viewer.compact .deal-seat.north').waitFor({state:'visible',timeout:15000});
  assert.equal(await frame.locator('.deal-viewer.compact .deal-seat.south').count(),1,
    'Declarer and dummy should remain opposite');
  await frame.locator('button[onclick="revealPlay()"]').click();
  assert.equal(await childFrame.evaluate(()=>document.activeElement?.getAttribute('onclick')==='revealPlay()'),true,
    'Revealing a free-form analysis preserves keyboard focus');
  assert.equal(await frame.locator('.play-source').count(),0,
    'The original image toggle is removed from declarer exercises');
  assert.equal(await frame.locator('.deal-viewer.compact .deal-seat.north').count(),1,
    'The reconstructed diagram stays visible without the source image toggle');

  // Régression desktop : ouvrir « Pourquoi les autres propositions » ne doit
  // pas déclencher de changement de largeur lors de l'apparition de la scrollbar.
  const desktopContext=await browser.newContext({viewport:{width:1280,height:800},locale:'fr-FR'});
  try{
    const desktopPage=await desktopContext.newPage();
    desktopPage.on('pageerror',e=>errors.push(e.message));
    await desktopPage.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
    await desktopPage.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
    const deskFrame=desktopPage.frameLocator('#training-frame');
    await deskFrame.locator('.topic-group .tile').filter({hasText:'Répondre et poursuivre après 2SA'}).first().click();
    await deskFrame.locator('.item').first().click();
    await deskFrame.locator('.qpjb-bid-quiz').waitFor({state:'visible',timeout:15000});
    const deskChild=desktopPage.frames().find(f=>f.url().includes('/entrainement/'));
    const correctIndex=await deskChild.evaluate(()=>current().choices.indexOf(current().correct));
    await deskFrame.locator('.choice[data-answer-index="'+correctIndex+'"]').click();
    const deskAccordion=deskFrame.locator('.postsolution-trigger').first();
    await deskAccordion.waitFor({state:'visible',timeout:10000});
    const measure=()=>deskChild.evaluate(()=>{
      const main=document.querySelector('main').getBoundingClientRect();
      const quiz=document.querySelector('.qpjb-bid-quiz').getBoundingClientRect();
      return {width:document.documentElement.clientWidth,
        gutter:getComputedStyle(document.documentElement).scrollbarGutter,
        mainX:main.x,mainWidth:main.width,quizX:quiz.x,quizWidth:quiz.width,
        overflow:document.documentElement.scrollWidth>window.innerWidth+1};
    });
    await deskChild.waitForFunction(()=>document.documentElement.classList.contains('qpjb-parent-scroll'));
    await desktopPage.waitForTimeout(400);
    const layout=()=>desktopPage.evaluate(()=>{
      const frame=document.getElementById('training-frame');
      return {outer:document.body.classList.contains('qpjb-training-outer-scroll'),
        frameHeight:frame.getBoundingClientRect().height,
        viewport:window.innerHeight,documentHeight:document.documentElement.scrollHeight};
    });
    const initialLayout=await layout();
    assert.ok(initialLayout.outer,'Desktop exercise must use the main page scrollbar');
    assert.ok(initialLayout.frameHeight<initialLayout.viewport*1.7,
      'No runaway iframe height in a quiz: '+JSON.stringify(initialLayout));
    const before=await measure();
    await deskAccordion.click();
    await deskChild.waitForFunction(()=>document.querySelector('.postsolution-notes')?.classList.contains('is-open'));
    await desktopPage.waitForTimeout(350);
    const after=await measure();
    assert.equal(before.gutter,'auto','The embedded desktop quiz does not reserve an internal scrollbar');
    const expandedLayout=await layout();
    assert.ok(expandedLayout.frameHeight<expandedLayout.viewport*2.7,
      'Opening detailed explanations must not stretch the iframe by multiple screens: '+JSON.stringify(expandedLayout));
    assert.ok(expandedLayout.documentHeight>=expandedLayout.frameHeight,
      'The parent document must contain the complete expanded exercise');
    const childScroll=await deskChild.evaluate(()=>({
      scrollHeight:document.documentElement.scrollHeight,
      clientHeight:document.documentElement.clientHeight,
      scrollY:window.scrollY
    }));
    assert.ok(childScroll.scrollHeight<=childScroll.clientHeight+8,
      'The inner iframe must not require independent scrolling: '+JSON.stringify(childScroll));
    assert.equal(after.width,before.width,'Expanding alternatives must not resize the document');
    assert.ok(Math.abs(after.mainX-before.mainX)<1&&Math.abs(after.mainWidth-before.mainWidth)<1
      &&Math.abs(after.quizX-before.quizX)<1&&Math.abs(after.quizWidth-before.quizWidth)<1,
      'Expanding alternatives must not horizontally shift the QCM: '+JSON.stringify({before,after}));
    assert.equal(after.overflow,false,'Expanded alternatives must not overflow horizontally');
    await desktopPage.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    assert.ok(await desktopPage.evaluate(()=>window.scrollY)>20,'The outer browser window scrolls on desktop');
    assert.equal(await deskChild.evaluate(()=>window.scrollY),0,'The inner document stays unscrolled');
    await deskAccordion.click();
    await desktopPage.waitForTimeout(350);
    const closed=await measure();
    assert.ok(Math.abs(closed.quizWidth-before.quizWidth)<1&&Math.abs(closed.quizX-before.quizX)<1,
      'Collapsing alternatives keeps original dimensions');
  }finally{await desktopContext.close()}

  // Les sauvegardes doivent survivre à un rechargement complet de QPJB.
  const savedBeforeReload=await childFrame.evaluate(()=>localStorage.getItem(KEY));
  const storageKey=await childFrame.evaluate(()=>KEY);
  assert.ok(savedBeforeReload?.includes(firstBidId),'Saved progress includes the first bidding exercise');
  await page.reload({waitUntil:'domcontentloaded'});
  // QPJB peut restaurer la route Entraînement au chargement : le bouton d'accueil
  // devient alors invisible. Lire la même origine directement est plus fiable.
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),storageKey),savedBeforeReload,
    'Progress in localStorage is identical after a full application reload');

  // Petit téléphone : les quatre choix du QCM à trois rangées doivent tenir.
  const smallContext=await browser.newContext({
    viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,
    hasTouch:true,locale:'fr-FR'
  });
  const smallPage=await smallContext.newPage();
  smallPage.on('pageerror',e=>errors.push(e.message));
  await smallPage.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
  await smallPage.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const smallFrame=smallPage.frameLocator('#training-frame');
  await smallFrame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
  await smallFrame.locator('.topic-group .tile').filter({hasText:'Répondre et poursuivre après 2SA'}).first().click();
  await smallFrame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  await smallFrame.locator('.item').first().click();
  const smallQuiz=smallFrame.locator('.qpjb-bid-quiz');
  await smallQuiz.waitFor({state:'visible',timeout:15000});
  assert.equal(await smallQuiz.locator('.auc tbody tr').count(),3);
  assert.equal(await smallQuiz.locator('.choices>.choice').count(),4);
  const smallMetrics=await smallQuiz.evaluate(el=>{
    const rect=el.querySelector('.choices').getBoundingClientRect();
    return {buttonsBottom:rect.bottom,viewport:el.ownerDocument.documentElement.clientHeight};
  });
  assert.ok(smallMetrics.buttonsBottom<=smallMetrics.viewport+5,
    'All four answers should be visible on a short mobile screen: '+JSON.stringify(smallMetrics));
  await smallContext.close();

  // Lot 08 : parcourir effectivement les quatre nouvelles questions sur iPhone simulé.
  // La validation d'affichage n'est pas une certification pédagogique indépendante.
  const lot08Context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  try{
    const lot08Page=await lot08Context.newPage();
    lot08Page.on('pageerror',e=>errors.push('Lot08 '+e.message));
    await lot08Page.goto('http://127.0.0.1:8765/QPJB/',{waitUntil:'domcontentloaded'});
    await lot08Page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
    const lot08Frame=lot08Page.frameLocator('#training-frame');
    await lot08Frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
    const lot08Child=lot08Page.frames().find(f=>f.url().includes('/entrainement/'));
    const newCases=[
      {id:'EN-BH-089-03',theme:'rep1M',correct:'1♠'},
      {id:'EN-BH-097-01',theme:'redemande',correct:'3♦'},
      {id:'EN-BH-097-04',theme:'redemande',correct:'3♠'},
      {id:'EN-BH-097-06',theme:'suite-repondant',correct:'2SA'}
    ];
    for(const spec of newCases){
      await lot08Child.evaluate(theme=>topic(theme),spec.theme);
      await lot08Frame.locator('.item').first().waitFor({state:'visible',timeout:12000});
      await lot08Child.evaluate(exerciseId=>item(exerciseId),spec.id);
      const lot08Quiz=lot08Frame.locator('.qpjb-bid-quiz');
      await lot08Quiz.waitFor({state:'visible',timeout:12000});
      const details=await lot08Child.evaluate(()=>({id,correct:current()?.correct,choices:current()?.choices,question:current()?.question}));
      assert.equal(details.id,spec.id,'Lot 08 selected ID appears in the embedded quiz');
      assert.equal(details.correct,spec.correct,'Lot 08 correct bid is preserved');
      assert.equal(await lot08Quiz.locator('.suits .suit').count(),4,'Lot 08 hand shows four suits');
      assert.equal(await lot08Quiz.locator('.choices>.choice').count(),4,'Lot 08 displays four actual choices');
      assert.ok(details.question?.length>25,'Lot 08 includes the pedagogical question');
      const index=details.choices.indexOf(spec.correct);
      assert.ok(index>=0,'Lot 08 expected answer is in the options');
      await lot08Quiz.locator('.choice[data-answer-index="'+index+'"]').click();
      await lot08Quiz.locator('.feedback .feedok').waitFor({state:'visible',timeout:6000});
      const feedbackText=await lot08Quiz.locator('.feedback').textContent();
      assert.ok(feedbackText?.includes('Bonne réponse'),'Lot 08 positive feedback is displayed for '+spec.id);
      const explanationText=await lot08Quiz.locator('.feedback p').first().textContent();
      assert.ok(explanationText?.trim().length>30,'Lot 08 explanation is present in the DOM for '+spec.id);
      const width=await lot08Quiz.evaluate(el=>({scroll:el.ownerDocument.documentElement.scrollWidth,client:el.ownerDocument.documentElement.clientWidth}));
      assert.ok(width.scroll<=width.client+3,'Lot 08 quiz has no horizontal overflow on mobile: '+JSON.stringify(width));
    }
  }finally{await lot08Context.close()}
  assert.equal(errors.length,0,'No uncaught JavaScript errors: '+errors.join('; '));
  console.log(JSON.stringify({result:'PASS',device:'iPhone 12',browser:browserType,auctionRows,choices:4,metrics,browserBack:'list',playNavigation:'passed',shortPhone:'passed',errors:0}));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
