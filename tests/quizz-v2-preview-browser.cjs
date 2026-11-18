'use strict';
// QPJB V2-I : essai réel de la page autonome, Desktop + viewport mobile.
// Ne charge ni le site QPJB ni les sauvegardes réelles des élèves.
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium,webkit,devices}=require('playwright');
const engine=process.env.PW_BROWSER||'chromium';
const url=pathToFileURL(path.resolve(__dirname,'../preview/parcours-v2-autonome.html')).href;
(async()=>{
  assert.ok(['chromium','webkit'].includes(engine));
  const browser=await ({chromium,webkit})[engine].launch({
    headless:true,args:engine==='chromium'?['--no-sandbox']:[]
  });
  try{
    for(const mode of ['desktop','mobile']){
      const opts=mode==='mobile'?
        {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
        {viewport:{width:1365,height:850},locale:'fr-FR',reducedMotion:'reduce'};
      const context=await browser.newContext(opts);
      const page=await context.newPage(),errors=[],requests=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('request',r=>requests.push(r.url()));
      await context.setOffline(true);
      await page.goto(url,{waitUntil:'domcontentloaded'});
      await page.getByText('Un laboratoire pour tester').waitFor({state:'visible'});
      assert.ok(await page.getByText('1 523',{exact:true}).isVisible());
      assert.deepEqual(errors,[]);
      assert.ok(requests.every(u=>u.startsWith('file://')||u.startsWith('data:')),
        'Aucune requête HTTP ni chargement externe');
      assert.ok(requests.length<=2,'Un unique fichier local ; au plus une demande de favicon');
      async function noOverflow(){
        const sizes=await page.evaluate(()=>({
          content:document.documentElement.scrollWidth,
          viewport:document.documentElement.clientWidth
        }));
        assert.ok(sizes.content<=sizes.viewport+2,
          'Débordement horizontal en '+mode+': '+JSON.stringify(sizes));
      }
      await noOverflow();
      await page.locator('#nav-play').click();
      await page.getByText('Question 1 sur 10').waitFor();
      for(let i=0;i<10;i++){
        assert.ok(await page.locator('button.choice').count()>=3);
        const before=await page.locator('button.choice').first().textContent();
        assert.ok(before.trim());
        await page.locator('button.choice').first().click();
        await page.getByText('Réponse du catalogue :').waitFor();
        assert.ok(await page.locator('.feedback').isVisible());
        if(i===0||i===9){
          await page.locator('#nav-review').click();
          await page.getByText('Revue pédagogique — 19 cas signalés').waitFor();
          await page.locator('#nav-play').click();
          await page.getByText('Question '+(i+1)+' sur 10').waitFor();
          assert.ok(await page.locator('.feedback').isVisible(),
            'Réponse conservée en reprenant une séance partielle');
        }
        await page.locator('button[data-action=next]').click();
      }
      await page.getByText('Bilan de la séance 1').waitFor();
      await noOverflow();
      await page.locator('button[data-action=start]').last().click();
      await page.getByText('Séance fictive 2').waitFor();
      // Tester la persistance en mémoire dans l'onglet, mais pas entre rechargements.
      await page.locator('#nav-review').click();
      await page.getByText('Revue pédagogique — 19 cas signalés').waitFor();
      assert.equal(await page.locator('.reviewItem').count(),19);
      await page.locator('.reviewItem').nth(2).click();
      assert.ok(await page.getByText('SEF-V416-008',{exact:true}).count()>=1);
      await page.locator('button[data-action=review-answer]').first().click();
      await page.getByText('Réponse du catalogue :').waitFor();
      await noOverflow();
      await page.locator('button[data-action=reset]').count().then(async n=>{
        // La vue Revue n'a pas de bouton de reset : revenir au parcours.
        if(n)await page.locator('button[data-action=reset]').first().click();
      });
      await page.locator('button[data-action=home]').first().click();
      await page.getByText('Un laboratoire pour tester').waitFor();
      await page.reload({waitUntil:'domcontentloaded'});
      await page.getByText('Un laboratoire pour tester').waitFor();
      await page.locator('#nav-play').click();
      await page.getByText('Séance fictive 1').waitFor();
      assert.deepEqual(errors,[],'Aucune exception navigateur');
      assert.ok(requests.every(u=>u.startsWith('file://')),'Aucun appel HTTP externe');
      await noOverflow();
      await context.close();
    }
  }finally{await browser.close();}
  console.log('QPJB V2 PREVIEW BROWSER PASS: '+engine+' desktop/mobile, mode hors-ligne, 10 questions, revue et absence de débordement');
})().catch(e=>{console.error(e);process.exitCode=1;});
