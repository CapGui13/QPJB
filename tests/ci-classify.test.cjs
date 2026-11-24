'use strict';
const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const cli=path.resolve(__dirname,'../scripts/ci-classify.cjs');
const {parseRaw}=require(cli);
const repo=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-ci-m1-'));
const report='audits/wave2/ux/PASSE_14_COMPARAISON_VISUELLE.md';
const pbn='Séance 1-01 Aix/B1 - première.pbn';
const img='Docs/01 - Table de décision.png';
function git(...args){
  const r=spawnSync('git',args,{cwd:repo,encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);return r.stdout.trim();
}
function write(p,content='new unique data for '+p+'\n'){
  const f=path.join(repo,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,content);
}
function remove(p){fs.rmSync(path.join(repo,p));}
function rename(a,b){fs.mkdirSync(path.dirname(path.join(repo,b)),{recursive:true});fs.renameSync(path.join(repo,a),path.join(repo,b));}
function commit(){git('add','-A');git('commit','--allow-empty','-qm','fixture');return git('rev-parse','HEAD');}
git('init','-q');git('config','user.name','M1 fixture');git('config','user.email','m1@example.invalid');git('config','core.filemode','true');
for(const p of [report,pbn,img,'qpjb-bridge-ui.css','qpjb-design-tokens.css','index.html','catalogue.json','site-version.json','scripts/secret.js','audits/README.md'])write(p,'base content of '+p+'\n'.repeat(3));
const base=commit();
after(()=>fs.rmSync(repo,{recursive:true,force:true}));
function reset(){git('reset','--hard',base);git('clean','-fdx');}
function run(b,h,cwd=repo){return spawnSync(process.execPath,[cli,'--base',b,'--head',h],{cwd,encoding:'utf8'});}
function expect(b,h,level,expected,cwd=repo){
  const r=run(b,h,cwd);assert.equal(r.status,0,r.stderr);
  const x=JSON.parse(r.stdout);
  assert.equal(x.schema,'QPJB_CI_PLAN_V1');assert.equal(x.baseSha,b);assert.equal(x.headSha,h);
  assert.equal(x.level,level,JSON.stringify(x));assert.equal(x.publish,level!=='DOC_ONLY');
  assert.ok(Array.isArray(x.reasons)&&x.reasons.length&&x.reasons.every(s=>typeof s==='string'));
  assert.ok(Array.isArray(x.changes));
  if(expected)assert.deepEqual(x.changes.map(c=>[c.status,c.path,c.oldPath||null]).sort(),expected.sort());
  return x;
}
function scenario(name,level,edit,expected){
  test(name,()=>{reset();edit();const h=commit();expect(base,h,level,expected);});
}
const one=(s,p,o=null)=>[[s,p,o]];
scenario('historic report edit only','DOC_ONLY',()=>write(report),one('M',report));
scenario('report deletion is not doc only','FULL',()=>remove(report),one('D',report));
scenario('unlisted markdown','FULL',()=>write('audits/new.md'),one('A','audits/new.md'));
scenario('operational README','FULL',()=>write('audits/README.md'),one('M','audits/README.md'));
scenario('historical report with tracked reference','FULL',()=>{write(report);write('scripts/ref.js',report);});
scenario('image edit','QUICK',()=>write(img),one('M',img));
scenario('image delete','QUICK',()=>remove(img),one('D',img));
scenario('pbn edit','QUICK',()=>write(pbn),one('M',pbn));
scenario('pbn delete','QUICK',()=>remove(pbn),one('D',pbn));
for(const p of ['Docs/nouvelle.jpg','Docs/nouvelle.JPEG','Docs/nouvelle.PNG','Docs/nouvelle.gif','Docs/nouvelle.webp',"Docs/L’ouverture (1) & suite.png",'Séance 2-05 Aix/B1 - défausse.PBN','Séance 0-02 Mumu/B2 - 7SA.pbn'])
  scenario('allowed addition '+p,'QUICK',()=>write(p),one('A',p));
for(const p of ['Docs/nouvelle.svg','Docs/evil.html.png','Docs/nested/x.png','docs/x.png','DOCS/x.png','Docs2/x.png','Docs/.hidden.png','Docs/ x.png','Docs/a%2Fb.png','Docs/a#b.png','Docs/a\\b.png','Docs/a\nb.png','Docs/a\tb.png','Docs/e\u0301.png','Séance 1-1 Aix/x.pbn','Seance 1-01 Aix/x.pbn','Séance 1-01 aix/x.pbn','Séance 1-01 Aix/nested/x.pbn','Séance 1-01 Aix/.seance-vide','archives/x.pbn','random/x.pbn','Docs/x.pbn','entrainement/assets/x.png','launch/x.png','qpjb-bridge-ui.CSS','entrainement/training-core.css','manifest.json','service-worker.js','tests/new.cjs','.github/workflows/x.yml','archives/site/index A.html','config.json'])
  scenario('conservative path '+JSON.stringify(p),'FULL',()=>write(p),one('A',p));
for(const p of ['catalogue.json','site-version.json','index.html','scripts/secret.js'])
  scenario('sensitive modification '+p,'FULL',()=>write(p),one('M',p));
for(const p of ['qpjb-bridge-ui.css','qpjb-design-tokens.css'])
  scenario('allowed UI '+p,'UI',()=>write(p),one('M',p));
scenario('UI plus image','UI',()=>{write(img);write('qpjb-bridge-ui.css');},[['M',img,null],['M','qpjb-bridge-ui.css',null]]);
scenario('image plus unknown','FULL',()=>{write(img);write('x.txt');},[['M',img,null],['A','x.txt',null]]);
scenario('rename allowed to allowed','QUICK',()=>rename(img,'Docs/renamed.png'),one('R100','Docs/renamed.png',img));
scenario('rename allowed to sensitive','FULL',()=>rename(img,'outside.png'),one('R100','outside.png',img));
scenario('rename sensitive to allowed','FULL',()=>rename('scripts/secret.js','Docs/from-script.png'),one('R100','Docs/from-script.png','scripts/secret.js'));
scenario('copy allowed to allowed','QUICK',()=>write('Docs/copy.png',fs.readFileSync(path.join(repo,img))),one('C100','Docs/copy.png',img));
scenario('copy sensitive to allowed','FULL',()=>write('Docs/copy.png',fs.readFileSync(path.join(repo,'scripts/secret.js'))),one('C100','Docs/copy.png','scripts/secret.js'));
scenario('copy allowed to sensitive','FULL',()=>write('outside.png',fs.readFileSync(path.join(repo,img))),one('C100','outside.png',img));
scenario('case collision','FULL',()=>write(img.toUpperCase().replace('DOCS/','Docs/')));
scenario('new symlink image','FULL',()=>fs.symlinkSync('../index.html',path.join(repo,'Docs/link.png')),one('A','Docs/link.png'));
scenario('regular becomes symlink','FULL',()=>{remove(img);fs.symlinkSync('../index.html',path.join(repo,img));},one('T',img));
scenario('execute bit change','FULL',()=>fs.chmodSync(path.join(repo,img),0o755),one('M',img));
scenario('executable addition','FULL',()=>{write('Docs/run.png');fs.chmodSync(path.join(repo,'Docs/run.png'),0o755);},one('A','Docs/run.png'));
test('gitlink/submodule mode',()=>{reset();git('update-index','--add','--cacheinfo','160000,'+base+',Docs/module.png');git('commit','-qm','gitlink');expect(base,git('rev-parse','HEAD'),'FULL',one('A','Docs/module.png'));});
test('cumulative sensitive surviving',()=>{reset();write('index.html');commit();write(img);expect(base,commit(),'FULL',[['M',img,null],['M','index.html',null]]);});
test('sensitive reverted between base and head',()=>{reset();const original=fs.readFileSync(path.join(repo,'index.html'));write('index.html');commit();write('index.html',original);write(img);expect(base,commit(),'FULL',one('M',img));});
test('multiple quick commits',()=>{reset();write(img);commit();write(pbn);expect(base,commit(),'QUICK',[['M',img,null],['M',pbn,null]]);});
test('nonancestor',()=>{reset();write(img);const a=commit();reset();write(pbn);const b=commit();expect(a,b,'FULL');});
test('empty net diff',()=>{reset();expect(base,commit(),'FULL',[]);});
test('same SHA',()=>{reset();expect(base,base,'FULL',[]);});
test('subdirectory invocation still sees complete diff',()=>{reset();write('index.html');write(img);expect(base,commit(),'FULL',[['M',img,null],['M','index.html',null]],path.join(repo,'Docs'));});
test('missing/invalid base or head blocks',()=>{reset();for(const [b,h] of [['',base],[base.slice(0,7),base],['f'.repeat(40),base],[base,'f'.repeat(40)],[base,git('rev-parse','HEAD:index.html')]]){const r=run(b,h);assert.notEqual(r.status,0);assert.equal(r.stdout,'');assert.match(r.stderr,/CI_CLASSIFY_ERROR/);}});
test('outside git blocks',()=>{const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-outside-'));try{const r=run(base,base,tmp);assert.notEqual(r.status,0);assert.equal(r.stdout,'');}finally{fs.rmSync(tmp,{recursive:true,force:true});}});
test('shallow history cannot quick',()=>{reset();write(img);const h=commit();const temp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-shallow-'));try{const r=spawnSync('git',['clone','-q','--depth=2','file://'+repo,temp],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);expect(base,h,'FULL',one('M',img),temp);}finally{fs.rmSync(temp,{recursive:true,force:true});}});
test('malformed raw output blocks',()=>{for(const b of [Buffer.from('no NUL'),Buffer.from('bogus\0'),Buffer.from([0xff,0]),Buffer.from(':100644 100644 '+base+' '+base+' R100\0only-one\0')])assert.throws(()=>parseRaw(b));});
test('non UTF-8 git pathname blocks',()=>{reset();const f=Buffer.concat([Buffer.from(repo+'/Docs/'),Buffer.from([0xff]),Buffer.from('.png')]);fs.writeFileSync(f,'x');const h=commit();const r=run(base,h);assert.notEqual(r.status,0);assert.equal(r.stdout,'');fs.unlinkSync(f);});

test('unchanged tracked reference prevents report-only shortcut',()=>{reset();write('scripts/ref.js',report);const b=commit();write(report);expect(b,commit(),'FULL',one('M',report));});
scenario('report and image union escalates for M2 complete diff','FULL',()=>{write(report);write(img);},[['M',report,null],['M',img,null]]);
test('submodule ignore configuration cannot mask gitlink',()=>{
  reset();git('config','diff.ignoreSubmodules','all');
  try{
    git('update-index','--add','--cacheinfo','160000,'+base+',Docs/sub.png');git('commit','-qm','gitlink');
    const b=git('rev-parse','HEAD');
    git('update-index','--cacheinfo','160000,'+b+',Docs/sub.png');git('commit','-qm','update gitlink');
    expect(b,git('rev-parse','HEAD'),'FULL',one('M','Docs/sub.png'));
  }finally{git('config','--unset','diff.ignoreSubmodules');}
});
test('classifier reads commits, ignores worktree changes and does not mutate index',()=>{
  reset();write(img);const h=commit();write('index.html');git('add','index.html');write(pbn);
  const before=git('status','--porcelain=v1');expect(base,h,'QUICK',one('M',img));assert.equal(git('status','--porcelain=v1'),before);assert.equal(git('rev-parse','HEAD'),h);
});
test('rename report to another markdown never doc only',()=>{reset();rename(report,'audits/relabelled.md');expect(base,commit(),'FULL',one('R100','audits/relabelled.md',report));});
test('new commit with merge side branch sensitive and reverted remains FULL',()=>{
  reset();const original=fs.readFileSync(path.join(repo,'index.html'));write('index.html');commit();write('index.html',original);const side=commit();
  reset();write(img);commit();git('merge','--no-ff','-qm','merge side',side);
  expect(base,git('rev-parse','HEAD'),'FULL',one('M',img));
});

scenario('pedagogical historical review excluded after real reference discovery','FULL',()=>write('audits/REVUE_20_SOUTIENS_MAJEURS_2026-11-04.md'),one('A','audits/REVUE_20_SOUTIENS_MAJEURS_2026-11-04.md'));

const mark='Séance 2-05 Aix/.seance-vide';
scenario('new empty session marker','QUICK',()=>write(mark,''),one('A',mark));
scenario('nonempty marker remains full','FULL',()=>write(mark,'not empty'),one('A',mark));
scenario('empty marker outside session','FULL',()=>write('Docs/.seance-vide',''),one('A','Docs/.seance-vide'));
scenario('empty marker nested','FULL',()=>write('Séance 2-05 Aix/sub/.seance-vide',''),one('A','Séance 2-05 Aix/sub/.seance-vide'));
test('empty marker deletion',()=>{reset();write(mark,'');const b=commit();remove(mark);expect(b,commit(),'QUICK',one('D',mark));});
test('nonempty historical marker deletion remains full',()=>{reset();write(mark,'bad');const b=commit();remove(mark);expect(b,commit(),'FULL',one('D',mark));});
test('nonempty marker modification remains full',()=>{reset();write(mark,'');const b=commit();write(mark,'bad');expect(b,commit(),'FULL',one('M',mark));});
scenario('session marker symlink','FULL',()=>{fs.mkdirSync(path.dirname(path.join(repo,mark)),{recursive:true});fs.symlinkSync('../index.html',path.join(repo,mark));},one('A',mark));
scenario('CSS deletion full','FULL',()=>remove('qpjb-bridge-ui.css'),one('D','qpjb-bridge-ui.css'));
test('CSS addition full',()=>{reset();const css='qpjb-design-tokens.css';remove(css);const b=commit();write(css);expect(b,commit(),'FULL',one('A',css));});
scenario('CSS rename full','FULL',()=>rename('qpjb-bridge-ui.css','Docs/from-css.png'),one('R100','Docs/from-css.png','qpjb-bridge-ui.css'));
scenario('CSS copy full','FULL',()=>write('Docs/from-css.png',fs.readFileSync(path.join(repo,'qpjb-bridge-ui.css'))),one('C100','Docs/from-css.png','qpjb-bridge-ui.css'));
scenario('report and CSS union escalates for M2','FULL',()=>{write(report);write('qpjb-bridge-ui.css');});
test('case collision at parent folder even with distinct filenames',()=>{reset();write('docs/other.txt');const b=commit();write(img);expect(b,commit(),'FULL',one('M',img));});
test('Unicode collision at parent folder',()=>{reset();write('Se\u0301ance 1-01 Aix/other.txt');const b=commit();write(pbn);expect(b,commit(),'FULL',one('M',pbn));});
test('raw JSON contract strips internal modes and oids',()=>{reset();write(img);const h=commit();const p=expect(base,h,'QUICK',one('M',img));assert.deepEqual(Object.keys(p.changes[0]).sort(),['path','status']);});

// CI v2: positive presentation/content cases and adversarial boundaries.
const homeV2='<html><style>body{color:red}</style><title>QPJB</title><style>.card{color:white}</style><script>safe()</script></html>';
const cfgV2={descriptions:{'SDE Nov 26':'Séance spéciale'},links:{'SDE Nov 26/B1':'https://bridge-training.com/player/index.php?dds=abc123'}};
for(const [name,level,change] of [
 ['home color','UI',s=>s.replace('color:red','color:blue')],
 ['home title','UI',s=>s.replace('<title>QPJB','<title>Le Quai')],
 ['home JS','FULL',s=>s.replace('safe()','evil()')],
 ['home event injection','FULL',s=>s.replace('<html>','<html onload="evil()">')],
 ['home style breakout','FULL',s=>s.replace('color:red','color:red}</style><script>evil()</script><style>body{color:red')],
 ['home markup','FULL',s=>s.replace('<script>','<a href="bad">x</a><script>')]
])test('v2 '+name,()=>{reset();write('index.html',homeV2);const b=commit();write('index.html',change(homeV2));expect(b,commit(),level);});
for(const [name,level,change] of [
 ['description','QUICK',x=>{x.descriptions['SDE Nov 26']='Nouvelle description';}],
 ['link','QUICK',x=>{x.links['SDE Nov 26/B1']='https://bridge-training.com/player/index.php?dds=xyz';}],
 ['unknown key','FULL',x=>{x.script='evil';}],
 ['unsafe URL','FULL',x=>{x.links['SDE Nov 26/B1']='javascript:alert(1)';}],
 ['unsafe description','FULL',x=>{x.descriptions['SDE Nov 26']='<script>'; }]
])test('v2 config '+name,()=>{reset();write('config.json',JSON.stringify(cfgV2));const b=commit();const x=JSON.parse(JSON.stringify(cfgV2));change(x);write('config.json',JSON.stringify(x));expect(b,commit(),level);});
scenario('v2 SDE PBN','QUICK',()=>write('SDE Nov 26/B1 - donne.pbn'));
scenario('v2 fake SDE folder','FULL',()=>write('SDE garbage 26/B1.pbn'));
