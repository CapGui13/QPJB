'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {routineRange,changedQcm,syntax,check}=require('../scripts/ci-routine.cjs');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-routine-'));
const git=(...a)=>execFileSync('git',a,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const write=(p,s)=>{const f=path.join(dir,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s)};
const q={id:'SEF-1',hand:[['A'],[],[],[]],context:'old',explain:'why',answer:'Passe',choices:['Passe','1SA','1♠','1♥'],theme:'ouv'};
const html=(e=q,js='const scroll = 1;')=>'<script id="training-data" type="application/json">'+JSON.stringify({exercises:[e]})+'</script><script>'+js+'</script>';
try{
 git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
 write('quizz.html',html());write('qpjb-bridge-ui.css','body { color:red }');write('quizz-parcours.js','const engine=1;');write('index.html','<script>const x=1;</script>');
 git('add','.');git('commit','-qm','base');const base=git('rev-parse','HEAD');
 function scenario(label,message,edit,ok,valid=ok){
  git('reset','--hard',base);git('clean','-fd');edit();git('add','-A');git('commit','-qm',message);const head=git('rev-parse','HEAD');
  assert.equal(!!routineRange(base,head,dir),ok,label);
  if(ok){if(valid)check(base,head,dir);else assert.throws(()=>check(base,head,dir));}
  console.log('ROUTINE_CASE '+label);
 }
 scenario('simple UI','routine(ui): scroll',()=>write('quizz.html',html(q,'const scroll=2;')),true);
 scenario('CSS','routine(ui): color',()=>write('qpjb-bridge-ui.css','body { color:blue }'),true);
 scenario('explicit editorial','routine(qcm): correction',()=>write('quizz.html',html({...q,explain:'better'})),true);
 scenario('syntax error blocked','routine(ui): invalid',()=>write('index.html','<script>const = ;</script>'),true,false);
 scenario('ordinary unmarked remains legacy','fix: scroll',()=>write('quizz.html',html(q,'const scroll=2;')),false);
 scenario('engine always FULL','routine(ui): engine',()=>write('quizz-parcours.js','const engine=2;'),false);
 scenario('mixed data and UI rejected','routine(ui): data',()=>write('quizz.html',html({...q,explain:'better'},'const scroll=2;')),false);
 scenario('storage change rejected','routine(ui): save',()=>write('index.html','<script>localStorage.clear();</script>'),false);
 scenario('changed hand rejected','routine(qcm): hand',()=>write('quizz.html',html({...q,hand:[[],[],[],['A']]})),false);
 scenario('bad answer rejected','routine(qcm): answer',()=>write('quizz.html',html({...q,answer:'2SA'})),false);
 scenario('unlisted file rejected','routine(ui): extra',()=>{write('quizz.html',html(q,'const scroll=3;'));write('new.js','x')},false);
 git('reset','--hard',base);
 write('qpjb-bridge-ui.css','body { color:blue }');git('add','.');git('commit','-qm','routine(ui): color');
 write('quizz.html',html({...q,explain:'better'}));git('add','.');git('commit','-qm','routine(qcm): correction');
 assert.equal(routineRange(base,git('rev-parse','HEAD'),dir).length,2);
 write('quizz-parcours.js','const engine=3;');git('add','.');git('commit','-qm','fix: engine');
 assert.equal(routineRange(base,git('rev-parse','HEAD'),dir),null);
 console.log('ROUTINE_POLICY_PASS');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
