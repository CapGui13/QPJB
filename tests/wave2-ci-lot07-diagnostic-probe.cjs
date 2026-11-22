'use strict';
// Exercise both generic failure and actual frame detachment under a real browser.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const browser=process.env.PW_BROWSER||'chromium';
assert(['chromium','webkit'].includes(browser),'Supported browser');
const dir=path.resolve(__dirname,'..','artifacts','lot07-publication',browser);
function verify(mode,prefix,expectedStage,detached){
 const json=path.join(dir,prefix+'-failure.json');
 const png=path.join(dir,prefix+'-failure.png');
 for(const file of [json,png])if(fs.existsSync(file))fs.unlinkSync(file);
 const child=spawnSync(process.execPath,[path.join(__dirname,'training-lot07-publication-browser.cjs')],{
  env:{...process.env,PW_BROWSER:browser,PW_LOT07_DIAGNOSTIC_PROBE:mode},
  encoding:'utf8',timeout:90000
 });
 assert.equal(child.error,undefined,'Probe must not time out');
 assert.equal(child.status,1,'Expected application-test failure, not success/signal: '+mode);
 assert.ok(fs.existsSync(json),'JSON diagnostic missing: '+mode);
 assert.ok(fs.existsSync(png),'PNG diagnostic missing: '+mode);
 assert.ok(fs.statSync(png).size>1000,'Empty PNG: '+mode);
 const info=JSON.parse(fs.readFileSync(json,'utf8'));
 assert.equal(info.stage,expectedStage);
 assert.ok(info.childUrl.includes('/entrainement/'),'Training child URL absent');
 assert.ok(Array.isArray(info.frameEvents),'Frame navigation/detachment not recorded');
 assert.ok(info.error,'Original failure reason lost');
 if(detached){
  assert.ok(info.frameEvents.some(e=>e.event==='detachement'),'Actual iframe detachment event not captured');
  assert.ok(!info.activeFrames.includes(info.childUrl),'Detached frame incorrectly reported as attached');
 }else{
  assert.match(child.stderr,/LOT07_DIAGNOSTIC_PROBE JC-BH-079-03/);
  assert.equal(info.inspection.id,'JC-BH-079-03');
  assert.equal(info.inspection.seatCount,1);
  assert.ok(info.activeFrames.includes(info.childUrl),'Active frame missing from diagnostic');
 }
}
verify('1','probe-phone','sonde:JC-BH-079-03',false);
verify('detach','probe-detach-phone','sonde-detachement:JC-BH-079-03',true);
console.log('WAVE2 CI LOT07 DIAGNOSTIC PROBE PASS '+browser+
 ' (generic failure + real iframe detachment; JSON, PNG, frame events verified)');
