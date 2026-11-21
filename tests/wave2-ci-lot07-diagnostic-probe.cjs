'use strict';
// Prove the failure diagnostics using a real browser and a deliberate failure.
// A nonzero child exit is expected; artifacts and its reason are mandatory.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const browser=process.env.PW_BROWSER||'chromium';
assert(['chromium','webkit'].includes(browser),'Supported browser');
const dir=path.resolve(__dirname,'..','artifacts','lot07-publication',browser);
const json=path.join(dir,'probe-phone-failure.json');
const png=path.join(dir,'probe-phone-failure.png');
for(const file of [json,png])if(fs.existsSync(file))fs.unlinkSync(file);
const child=spawnSync(process.execPath,[path.join(__dirname,'training-lot07-publication-browser.cjs')],{
 env:{...process.env,PW_BROWSER:browser,PW_LOT07_DIAGNOSTIC_PROBE:'1'},
 encoding:'utf8',timeout:90000
});
assert.equal(child.error,undefined,'Probe process must not time out or fail to launch');
assert.equal(child.status,1,'Expected controlled application-test failure, not success or signal');
assert.match(child.stderr,/LOT07_DIAGNOSTIC_PROBE JC-BH-079-03/);
assert.ok(fs.existsSync(json),'JSON diagnostic must be persisted');
assert.ok(fs.existsSync(png),'PNG diagnostic must be persisted');
assert.ok(fs.statSync(png).size>1000,'PNG diagnostic should not be empty');
const diagnostic=JSON.parse(fs.readFileSync(json,'utf8'));
assert.equal(diagnostic.stage,'sonde:JC-BH-079-03');
assert.equal(diagnostic.inspection.id,'JC-BH-079-03');
assert.equal(diagnostic.inspection.seatCount,1);
assert.ok(diagnostic.childUrl.includes('/entrainement/'),'Correct frame is reported');
assert.ok(diagnostic.activeFrames.includes(diagnostic.childUrl),'Frame still attached');
assert.ok(Array.isArray(diagnostic.frameEvents),'Frame events recorded');
console.log('WAVE2 CI LOT07 DIAGNOSTIC PROBE PASS '+browser+
 ' (expected failure, reason+JSON+PNG+attached frame verified)');
