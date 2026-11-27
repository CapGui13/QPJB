'use strict';
// Reuse D's exact independent native replay, with explicit archive provenance.
// No candidate selection is rerun here; it was executed in 45998005831.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const file=path.join(__dirname,'coherence-concrete-m4p-d-archive.cjs');
let source=fs.readFileSync(file,'utf8');
function once(a,b){assert.equal(source.split(a).length,2,'D archive anchor changed');source=source.replace(a,b);}
once("assert.equal(wrapper.encoding,'gzip+base64');","assert.equal(wrapper.run,45998005831);assert.ok(Number.isInteger(wrapper.job));");
once("/^[DK]-.+\\.json$/","/^TP-.+\\.json$/");
once("assert.equal(files.length,profile?6:36);","assert.equal(files.length,profile?3:18);");
once("'5129f278687dc9ab617bda108279d126b9959a98'","'e3dffa3905a5743d87f0e6c9801fee366a686522'");
once("assert.equal(p.horizon,180);","assert.equal(p.horizon,180);assert.equal(p.after.policy,'TP');");
once("reports.push({file:f,profile:p.profile,seed:p.seed,changes:v.changes,extra:v.regressions.filter(x=>x.metric!=='latency-observation').length});",`reports.push({file:f,profile:p.profile,seed:p.seed,changes:v.changes,extra:v.regressions.filter(x=>x.metric!=='latency-observation').length});
 const compact=r=>({id:r.id,concept:r.concept,h:r.h,shape:r.shape,hand:r.hand,auction:r.auction,answer:r.answer,level:r.level,role:r.role,reason:r.reason,position:r.position});
 const direct=p.after.changes.map(c=>({event:c,before:p.before.sessions[c.session-1].rows.map(compact),after:p.after.sessions[c.session-1].rows.map(compact)}));
 if(direct.length)console.log('M4TP_DIRECT '+JSON.stringify({profile:p.profile,seed:p.seed,direct}));
 `);
const argv=[process.argv[0],process.argv[1],path.join(root,'audits/coherence-concrete-20261126/m4/integration/native'),process.argv[2]];
new Function('require','process','__dirname','console',source)(require,{...process,argv},__dirname,console);
