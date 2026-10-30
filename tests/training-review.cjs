'use strict';
// Priorité de révision testée sans navigateur ni mutation de sauvegarde.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','entrainement/training-app.js'),'utf8');
const a=app.indexOf('const REVIEW_AFTER_DAYS=30;');
const b=app.indexOf('function pageHome()',a);
assert(a>=0&&b>a,'Review logic is present and isolated');
const days=n=>new Date(Date.now()-n*86400000).toISOString();
const saved={
 failOld:{done:true,validated:false,lastAttemptAt:days(70)},
 failNew:{done:true,validated:false,lastAttemptAt:days(2)},
 masteredOld:{done:true,validated:true,lastAttemptAt:days(45)},
 masteredRecent:{done:true,validated:true,lastAttemptAt:days(6)},
 masteredLegacy:{done:true,validated:true},
 fresh:{}
};
const before=JSON.stringify(saved);
const exercises=['masteredRecent','fresh','masteredOld','failNew','masteredLegacy','failOld']
 .map(id=>({id,level:1}));
const evaluate=new Function('saved','validatedState','rel','status',
 app.slice(a,b)+';return {filtered,reviewInformation,stat,resultLabel};');
const {filtered,reviewInformation,stat,resultLabel}=evaluate(
 saved,rec=>!rec?.done?null:rec.validated,()=>exercises,'failed');
assert.deepEqual(filtered().map(x=>x.id),['failOld','failNew','masteredOld'],
 'Unmastered attempts come first; 30-day-old first-try passes come after');
assert.equal(reviewInformation({id:'masteredRecent'}),null,'A recent success is excluded');
assert.equal(reviewInformation({id:'masteredLegacy'}),null,'Missing historic timestamps do not invent overdue revisions');
assert.equal(stat({id:'masteredOld'}),'↻');
assert.equal(resultLabel({id:'failNew'}).startsWith('À retravailler'),true);
assert.equal(JSON.stringify(saved),before,'Filtering never alters learner results');
console.log('QPJB review priority: PASS');
