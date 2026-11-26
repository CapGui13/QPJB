'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m2/';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const audit=json(dir+'pass21-arbitrages.json'),reg=json(dir+'registre.json'),previous=json(dir+'pass20-propositions.json');
const remaining=Object.entries(reg.rows).flatMap(([id,r])=>r[3].filter(o=>['HOLD','canonical-contrast'].includes(o[1])).map(o=>[id+'|'+o[0],o[1]]));
assert.equal(audit.base,reg.base);assert.equal(audit.count,remaining.length);assert.equal(Object.keys(audit.rows).length,remaining.length);
for(const [k,d] of remaining){const x=audit.rows[k],p=previous.pending[k];assert.ok(x&&p,k);assert.equal(x.disposition,d,k);assert.equal(x.owner,'coordinateur');assert.equal(x.runtime,'canonical-only');for(const field of ['concept','choice','answer','auction','h','shape','evidence'])assert.deepEqual(x[field],p[field],k+' '+field);assert.ok(x.reason.length>55&&x.reason!==p.reason,k);}
const cli=script=>JSON.parse(execFileSync(process.execPath,[path.join(root,script)],{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024}));
const metrics=cli('tests/durable-m2-remediation.cjs'),double=cli('tests/durable-m2-demo.cjs');
assert.equal(metrics.options,5745);assert.equal(metrics.questions,1915);assert.equal(metrics.dispositions.HOLD,52);assert.equal(metrics.dispositions['canonical-contrast'],1);
const demo=read(dir+'demo.html'),cases=JSON.parse(demo.split('<script id="fixtures" type="application/json">')[1].split('</script>')[0]);
const {chromium,webkit}=require('playwright');
async function browserRun(name,engine){
 const browser=await engine.launch({headless:true});let checks=0,scenarios=0;
 try{for(const viewport of [{width:360,height:800},{width:1280,height:800}]){
  const context=await browser.newContext({viewport,offline:true});const page=await context.newPage();const errors=[],external=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
  await page.goto(pathToFileURL(path.join(root,dir+'demo.html')).href);
  const el=id=>page.locator('#'+id),eq=(a,b,m)=>{assert.deepEqual(a,b,name+' '+m);checks++;};
  const focus=()=>page.evaluate(()=>document.activeElement?.id||document.activeElement?.textContent);
  const noLeak=async()=>{eq(await el('result').isVisible(),false,'hidden result');eq(await el('canonical').textContent(),'','empty canonical');eq(await el('options').locator('button').count(),0,'no options');eq(await focus(),'free','free focused');eq(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no horizontal overflow');};
  const submit=async c=>{await el('free').fill(c);await el('free').press('Enter');};
  const choose=async c=>{const b=el('options').getByRole('button',{name:c,exact:true});await b.focus();await b.press('Enter');};
  const checkResult=async(q,status)=>{eq(await el('result').isVisible(),true,'result visible');eq(await el('canonical').textContent(),q.explain,'exact canonical');eq(await focus(),'result','result focused');eq((await el('status').textContent()).includes(status),true,'status');eq(await el('options').locator('button').count(),0,'options cleared');};
  const next=async()=>{await el('next').focus();await el('next').press('Enter');};
  for(const c of cases){await noLeak();await submit('invalid');eq(await el('result').isVisible(),false,'invalid no result');eq((await el('status').textContent()).includes('valide'),true,'invalid status');await el('help').focus();await el('help').press('Enter');eq(await el('options').locator('button').count(),4,'help options');eq(await focus(),c.first.q.choices[0],'help focus');await choose(c.first.q.choices.find(x=>x!==c.first.q.answer));await checkResult(c.first.q,'incorrecte');await next();await noLeak();await submit(c.next.q.answer);await checkResult(c.next.q,'sans aide');await next();scenarios++;}
  for(const c of cases){await noLeak();await submit(c.first.q.choices.find(x=>x!==c.first.q.answer));eq(await el('result').isVisible(),false,'first guess hidden');eq(await el('options').locator('button').count(),4,'first guess options');await choose(c.first.q.answer);await checkResult(c.first.q,'après aide');await next();await noLeak();await submit(c.next.q.answer);await checkResult(c.next.q,'sans aide');await next();scenarios++;}
  eq(errors,[],'no page error');eq(external,[],'no network');await context.close();
 }return {name,version:browser.version(),checks,scenarios,viewports:[360,1280]};}finally{await browser.close();}
}
(async()=>{const browsers=[await browserRun('chromium',chromium),await browserRun('webkit',webkit)];console.log(JSON.stringify({source:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),metrics,double,auditedPending:remaining.length,browsers},null,2));})().catch(e=>{console.error(e);process.exitCode=1;});
