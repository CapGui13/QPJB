'use strict';
// Run against the immutable inventory in #281, using a disposable shared clone.
// Synthetic commits are NEVER pushed. They exercise Git classification, not
// the image/PBN validity checks assigned to M2.
const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const cli=path.join(root,'scripts/ci-classify.cjs');
const {pathLevel}=require(cli);
const base='cffac8d53ce5fc5bdb2d08f0b0b028253cb11ae3';
const reports=["audits/wave2/ux/PASSE_14_COMPARAISON_VISUELLE.md","audits/wave2/recommandations/PASSE25_RETRAIT_LANCEUR_NODE22_20261121.md","audits/wave2/ci/PASSE_9_PREUVES_HORODATEES.md"];
const excluded='audits/REVUE_20_SOUTIENS_MAJEURS_2026-11-04.md';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-real-m1-'));
const clone=path.join(tmp,'repo');
function git(cwd,args,input){
  const r=spawnSync('git',args,{cwd,input,maxBuffer:64*1024*1024});
  assert.equal(r.status,0,String(r.stderr));return r.stdout;
}
function g(...a){return String(git(clone,a)).trim();}
git(root,['clone','--shared','--no-checkout','--quiet',root,clone]);
after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
const names=String(git(clone,['ls-tree','-r','-z','--name-only',base])).split('\0').filter(Boolean);
const docs=names.filter(p=>/^Docs\/[^/]+$/.test(p));
const pbns=names.filter(p=>/\.pbn$/i.test(p));
function edit(p,append='\nM1 classification fixture\n'){
  const data=git(clone,['show',base+':'+p]);
  const oid=String(git(clone,['hash-object','-w','--stdin'],Buffer.concat([data,Buffer.from(append)]))).trim();
  g('update-index','--add','--cacheinfo','100644,'+oid+','+p);
}
function fixture(name,level,change,expected){
  test(name,()=>{
    g('read-tree',base);change();
    const tree=g('write-tree');
    const head=g('-c','user.name=M1 fixture','-c','user.email=m1@example.invalid','commit-tree',tree,'-p',base,'-m','M1 isolated proof');
    const r=spawnSync(process.execPath,[cli,'--base',base,'--head',head],{cwd:clone,encoding:'utf8'});
    assert.equal(r.status,0,r.stderr);
    const p=JSON.parse(r.stdout);
    assert.equal(p.schema,'QPJB_CI_PLAN_V1');assert.equal(p.level,level,JSON.stringify(p));
    assert.equal(p.baseSha,base);assert.equal(p.headSha,head);assert.equal(p.publish,level!=='DOC_ONLY');
    assert.deepEqual(p.changes.map(c=>[c.status,c.path,c.oldPath||null]),expected);
    console.log('M1_REAL_PLAN '+JSON.stringify(p));
  });
}
test('immutable real inventory: all 100 existing course paths recognized',()=>{
  assert.equal(pbns.length,93);assert.equal(docs.length,7);
  assert.equal(new Set(pbns.map(p=>p.split('/')[0])).size,15);
  for(const p of [...docs,...pbns])assert.equal(pathLevel(p),'QUICK',p);
  for(const p of ['qpjb-bridge-ui.css','qpjb-design-tokens.css'])assert.ok(names.includes(p)&&pathLevel(p)==='UI');
  for(const report of [...reports,excluded])assert.ok(names.includes(report));
});
// Each reviewed candidate is expected to be isolated; any reference is
// a failed inventory assumption, never a reason to bypass the guard.
for(const report of reports)fixture('real historical report '+report,'DOC_ONLY',()=>edit(report),[['M',report,null]]);
fixture('real referenced pedagogical review stays full','FULL',()=>{
  const r=spawnSync('git',['grep','--full-name','-I','-i','-F','-l','-e',excluded.split('/').pop().slice(0,-3),base,'--','.',':(exclude)'+excluded],{cwd:clone,encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
  console.log('M1_EXCLUDED_REPORT_REFERENCES '+JSON.stringify(r.stdout.trim().split('\n')));
  edit(excluded);
},[['M',excluded,null]]);
fixture('real existing course image copy','QUICK',()=>{
  const p=docs[0],oid=g('rev-parse',base+':'+p);
  g('update-index','--add','--cacheinfo','100644,'+oid+',Docs/M1 copie réelle.jpg');
},[['C100','Docs/M1 copie réelle.jpg',docs[0]]]);
fixture('real PBN edit','QUICK',()=>edit(pbns[0]),[['M',pbns[0],null]]);
fixture('real shared CSS edit','UI',()=>edit('qpjb-bridge-ui.css'),[['M','qpjb-bridge-ui.css',null]]);
fixture('real generated catalogue remains full','FULL',()=>edit('catalogue.json'),[['M','catalogue.json',null]]);
fixture('real public alias source remains full','FULL',()=>edit('archives/site/index A.html'),[['M','archives/site/index A.html',null]]);

fixture('real CSS deletion remains full','FULL',()=>g('update-index','--force-remove','qpjb-bridge-ui.css'),[['D','qpjb-bridge-ui.css',null]]);
fixture('real mixed historical report plus public image escalates','FULL',()=>{edit(reports[0]);edit(docs[0]);},[['M',docs[0],null],['M',reports[0],null]]);
