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
  const auctionRows=await quiz.locator('.auc tbody tr').count();
  const choices=quiz.locator('.choices>.choice');
  assert.equal(auctionRows,3,'Test QCM must include three auction rows');
  assert.equal(await choices.count(),4,'Four proposals must be present');
  const metrics=await quiz.evaluate(el=>{
   const buttons=el.querySelector('.choices').getBoundingClientRect();
   const rect=el.getBoundingClientRect();
   return {buttonsBottom:buttons.bottom,viewport:el.ownerDocument.documentElement.clientHeight,quizWidth:rect.width,bodyWidth:el.ownerDocument.documentElement.clientWidth};
  });
  assert.ok(metrics.quizWidth>metrics.bodyWidth*0.85,'QCM must use available mobile width');
  await choices.nth(2).click();
  await frame.locator('.qpjb-answer-area.is-open').waitFor({state:'visible',timeout:5000});
  assert.equal(await quiz.locator('.choice.selected').count(),1,'Answer selected');
  const firstAnswer=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  await choices.nth(2).click();
  assert.equal(await quiz.locator('.choice.selected').count(),0,'Second tap unselects answer');
  assert.equal(await frame.locator('.qpjb-answer-area[aria-hidden="true"]').count(),1,'Explanation closes');
  await choices.nth(2).click();
  const afterRecheck=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  assert.equal(afterRecheck.attempts,firstAnswer.attempts,'Unselect and reselect do not count as another visit');
  assert.equal(afterRecheck.history,firstAnswer.history+1,'Each selection remains in history');
  assert.equal(afterRecheck.validated,firstAnswer.validated,'First selection determines visit validation');
  await choices.nth(0).click();
  const changedChoice=await quiz.evaluate(()=>({attempts:saved[id].attempts,history:saved[id].history.length,validated:saved[id].validated}));
  assert.equal(changedChoice.attempts,firstAnswer.attempts,'Changing to another choice does not increase visit count');
  assert.equal(changedChoice.history,afterRecheck.history+1,'Changed choice is recorded');
  assert.equal(changedChoice.validated,firstAnswer.validated,'Changed choice cannot rewrite first try');
  await choices.nth(2).click();
  const extra=frame.locator('.postsolution-trigger');
  await extra.waitFor({state:'attached',timeout:5000});
  await extra.click();
  assert.equal(await extra.getAttribute('aria-expanded'),'true','Alternative explanations expand');
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
  assert.equal(await frame.locator('.qpjb-suit-probe .symbol-suit.suit-black').count(),2,
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
        const style=getComputedStyle(el);
        const fill=style.getPropertyValue('-webkit-text-fill-color')||style.color;
        const values=(fill.match(/\d+/g)||[]).slice(0,3).map(Number);
        const good=values.length===3&&(isRed
          ?values[0]>=120&&values[0]>values[1]+45&&values[0]>values[2]+35
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
  await choices.nth(0).click();
  await frame.locator('#root .storage-warning[role="alert"]').waitFor({state:'visible',timeout:5000});
  assert.equal(await quiz.count(),1,'Storage warning does not recreate the exercise');
  await quiz.evaluate(()=>{
    Storage.prototype.setItem=window.__qpjbOriginalSetItem;
    delete window.__qpjbOriginalSetItem;
  });
  await choices.nth(2).click();
  await frame.locator('#root .storage-warning').waitFor({state:'detached',timeout:5000});
  assert.equal(await frame.locator('.restart-exercise').count(),0,
    'No redo control is offered after the answer');
  assert.equal(await quiz.locator('.choice.selected').count(),1,
    'Changing the selected answer remains possible without an explicit restart');

  // Deux onglets de la même origine : chaque exercice doit rester disponible
  // même si les deux sauvegardes partent sans attendre les événements storage.
  const otherTab=await context.newPage();
  otherTab.on('pageerror',e=>errors.push(e.message));
  await otherTab.goto('http://127.0.0.1:8765/QPJB/entrainement/?mode=bidding',{waitUntil:'domcontentloaded'});
  await otherTab.locator('#root').waitFor({state:'visible'});
  const syncIds=await accessibilityFrame.evaluate(()=>
    D.bidding.filter(x=>!saved[x.id]&&x.reviewStatus!=='a_verifier').slice(0,3).map(x=>x.id));
  assert.equal(syncIds.length,3,'Three untouched exercises are available for two-tab tests');
  await Promise.all([
    accessibilityFrame.evaluate(ex=>persistResult(ex,'A',true,true),syncIds[0]),
    otherTab.evaluate(ex=>persistResult(ex,'B',false,true),syncIds[1])
  ]);
  await accessibilityFrame.waitForFunction(keys=>keys.every(ex=>!!saved[ex]),syncIds.slice(0,2));
  await otherTab.waitForFunction(keys=>keys.every(ex=>!!saved[ex]),syncIds.slice(0,2));
  assert.equal(await otherTab.evaluate(()=>JSON.stringify(saved)===localStorage.getItem(KEY)),true,
    'A second tab has the complete persisted progress');
  // Deux visites concurrentes d'un MÊME exercice : combiner les deux
  // historiques et deux tentatives identifiées, pas uniquement le dernier choix.
  await Promise.all([
    accessibilityFrame.evaluate(ex=>persistResult(ex,'A',true,true),syncIds[2]),
    otherTab.evaluate(ex=>persistResult(ex,'B',false,true),syncIds[2])
  ]);
  await accessibilityFrame.waitForFunction(ex=>saved[ex]?.attempts===2&&saved[ex]?.history?.length===2,syncIds[2]);
  await otherTab.waitForFunction(ex=>saved[ex]?.attempts===2&&saved[ex]?.history?.length===2,syncIds[2]);
  const reconciled=await otherTab.evaluate(ex=>({attempts:saved[ex].attempts,
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
  await frame.locator('.footnav button.primary').click();
  await trainingFrameForNav.waitForFunction(previous=>view==='quiz'&&id!==previous,firstBidId);
  assert.equal(await quiz.locator('.choices>.choice').count(),4,'Next exercise has four choices');
  await frame.locator('.footnav button').first().click();
  await trainingFrameForNav.waitForFunction(first=>view==='quiz'&&id===first,firstBidId);
  assert.equal(iframeNavigations,0,'Internal previous/next navigation does not reload the training iframe');
  assert.equal(await quiz.locator('.choice.selected').count(),0,'Returning to a saved exercise starts without stale selection');
  await frame.locator('.qpjb-quiz-nav button.back').click();
  await frame.locator('.item').first().waitFor({state:'visible',timeout:15000});
  const recordAfterNavigation=await trainingFrameForNav.evaluate(exId=>saved[exId],firstBidId);
  assert.ok(recordAfterNavigation?.done&&recordAfterNavigation.attempts>=bidRecord.attempts,
    'Internal navigation preserves the saved answer');


  // Exercice 12 de la rubrique 2SA : les commentaires comportent des Cœurs et Carreaux.
  await frame.locator('.item').nth(11).click();
  await quiz.waitFor({state:'visible',timeout:15000});
  await quiz.locator('.choices>.choice').nth(2).click();
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

  // Une longue proposition garde la pleine largeur (pas de colonne illisible).
  await childFrame.evaluate(()=>playTopic('plan-qcm'));
  await childFrame.waitForFunction(()=>view==='list'&&ptopic==='plan-qcm',{timeout:15000});
  await childFrame.evaluate(()=>item('JC-BH-004-1-Q01'));
  await childFrame.waitForFunction(()=>id==='JC-BH-004-1-Q01'&&document.querySelector('.cq-stage'),{timeout:15000});
  const longGrid=await frame.locator('.cq-options').evaluate(el=>
    getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length);
  assert.equal(longGrid,1,'Long card options remain in one readable column');

  // // Un choix de carte n'efface plus l'énoncé ou la table : même nœud DOM.
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

  // Quarantaine : une ancienne route ou un appel direct ne doit pas présenter/noter un QCM ambigu.
  await childFrame.evaluate(()=>playTopic('defense'));
  await frame.locator('.hero h1').filter({hasText:'Défense et signalisation'}).waitFor({state:'visible',timeout:15000});
  const quarantineBefore=await childFrame.evaluate(()=>localStorage.getItem(KEY));
  assert.equal(await childFrame.evaluate(()=>D.play.filter(x=>x.reviewStatus!=='a_verifier').length),111,
    'Only 111 of 114 card exercises are available');
  for(const blockedId of ['JC-BH-014-Q01','JC-BH-028-Q04','JC-BH-036-Q02']){
    const direct=await childFrame.evaluate(bid=>{item(bid);return {view,id}},blockedId);
    assert.equal(direct.view,'list','Direct navigation to '+blockedId+' is ignored');
    assert.notEqual(direct.id,blockedId,'Quarantined ID is not selected');
    const restored=await childFrame.evaluate(bid=>{
      id=bid;trainingApplyPage('quiz',false,false);
      return {view,id,answers:document.querySelectorAll('.cq-option').length};
    },blockedId);
    assert.equal(restored.view,'list','Restored route to '+blockedId+' falls back to list');
    assert.equal(restored.id,'','Invalid restored route is cleared');
    assert.equal(restored.answers,0,'Invalid restored route shows no answer buttons');
  }
  assert.equal(await childFrame.evaluate(()=>localStorage.getItem(KEY)),quarantineBefore,
    'Blocking quarantined questions does not modify saved learner progress');

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
  await frame.locator('.play-source summary').click();
  await childFrame.waitForFunction(()=>document.querySelector('.play-source .game-img')?.naturalWidth>0,null,{timeout:15000});
  assert.ok((await frame.locator('.play-source .game-img').getAttribute('src')).endsWith('/JC-001.webp'),
    'Original declarer facsimile loads correctly from its WebP file');

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

  assert.equal(errors.length,0,'No uncaught JavaScript errors: '+errors.join('; '));
  console.log(JSON.stringify({result:'PASS',device:'iPhone 12',browser:browserType,auctionRows,choices:4,metrics,browserBack:'list',playNavigation:'passed',shortPhone:'passed',errors:0}));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
