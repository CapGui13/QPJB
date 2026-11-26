'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'audits/professeur-numerique-20261126/m4/demo.html'),'utf8');
const source=fs.readFileSync(path.join(root,'quizz-remediation.js'),'utf8');
const tag='<script src="../../../quizz-remediation.js"></script>';
assert.ok(html.includes(tag),'expected module loader');
const inline=html.replace(tag,()=>'<script>'+source+'</script>');
(async()=>{
 const engine=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(engine));
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{
 for(const width of [320,390,1280]){
  const page=await browser.newPage({viewport:{width,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent(inline);
  const dataset=await page.evaluate(()=>({cases,pairs}));
  const assertLayout=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'no horizontal overflow '+width);
  const pick=async i=>{await page.locator('#case').selectOption(String(i));assert.equal(await page.locator('#feedback').isVisible(),false);assert.equal(await page.locator('#canonical').textContent(),'');assert.equal(await page.locator('#extra').textContent(),'');await assertLayout();};
  const submit=async bid=>{await page.locator('#bid').fill(bid);await page.locator('#bid').press('Enter')};
  const choice=async bid=>page.locator('#choices').getByRole('button',{name:bid,exact:true}).click();
  for(let i=0;i<dataset.cases.length;i++){
   const c=dataset.cases[i],q=c.exercise;
   await pick(i);await submit(q.answer.replace('♠','P').replace('♥','C').replace('♦','K').replace('♣','T').toLowerCase());
   assert.equal(await page.locator('#verdict').textContent(),'Bonne réponse sans aide');assert.equal(await page.locator('#canonical').textContent(),q.explain);
   assert.equal(await page.locator('#extra').textContent(),'');await assertLayout();
   await pick(i);await page.locator('#past').check();await page.locator('#show').click();await choice(c.choice);
   assert.equal(await page.locator('#canonical').textContent(),q.explain);assert.match(await page.locator('#extra').textContent(),/Rappel/);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'feedback');await assertLayout();
   const pair=dataset.pairs[q.id];
   if(pair){await page.locator('#feedback').press('Enter');assert.equal(await page.locator('#phase').textContent(),'Réinvestissement : une autre main de la même notion.');
    assert.equal(await page.locator('#canonical').textContent(),'');assert.equal(await page.evaluate(()=>document.activeElement.id),'question');
    assert.notEqual(pair.exercise.id,q.id);assert.notEqual(pair.sourceFamily,pair.transferFamily);assert.notDeepEqual(pair.exercise.hand,q.hand);
    await submit(pair.exercise.answer);assert.equal(await page.locator('#canonical').textContent(),pair.exercise.explain);
    assert.equal(await page.locator('#extra').textContent(),'');await assertLayout();
   }
   await pick(i);await submit('xyz');assert.match(await page.locator('#status').textContent(),/non reconnue/);assert.equal(await page.locator('#feedback').isVisible(),false);
   await submit(c.choice);assert.equal(await page.locator('#feedback').isVisible(),false);assert.equal(await page.locator('#canonical').textContent(),'');await choice(q.answer);
   assert.equal(await page.locator('#verdict').textContent(),'Bonne réponse après correction');assert.equal(await page.locator('#canonical').textContent(),q.explain);assert.notEqual(await page.locator('#extra').textContent(),'');
   await pick(i);await page.locator('#show').click();await choice(q.answer);assert.equal(await page.locator('#verdict').textContent(),'Bonne réponse avec les propositions');
  }
  assert.deepEqual(errors,[]);await page.close();console.log('M4_BROWSER_PASS '+engine+' width='+width+' cases='+dataset.cases.length);
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
