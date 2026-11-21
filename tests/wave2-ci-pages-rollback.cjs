'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync,spawnSync}=require('node:child_process');
const pages=fs.readFileSync(path.resolve(__dirname,'..','.github/workflows/verified-pages.yml'),'utf8');
const startMarker="      - name: Refuser le déploiement si une modification ultérieure n'est pas validée\n";
const endMarker="      - name: Générer le catalogue et la version à partir du commit testé\n";
assert.ok(pages.includes(startMarker),'Missing checked deployment guard');
assert.ok(pages.includes(endMarker),'Missing catalogue generation step');
const block=pages.slice(pages.indexOf(startMarker)+startMarker.length,pages.indexOf(endMarker));
assert.ok(block.includes('        run: |\n'),'Deployment guard must have shell block');
let bash=block.split('        run: |\n')[1].split('\n').filter(l=>l.startsWith('          ')).map(l=>l.slice(10)).join('\n');
const verifiedExpression='VERIFIED="$'+'{{ github.event.workflow_run.head_sha }}"';
assert.ok(bash.includes(verifiedExpression),'Verified SHA must come from workflow_run');
bash=bash.replace(verifiedExpression,'VERIFIED="$VERIFIED_SHA"');
for(const expected of [
 "workflow_run.conclusion == 'success'",
 "workflow_run.head_branch == 'main'",
 "workflow_run.event != 'pull_request'",
 "needs.pages-source.outputs.enabled == 'true'",
 'git merge-base --is-ancestor "$VERIFIED" origin/main',
 'git diff --name-only "$VERIFIED" origin/main'
])assert.ok(pages.includes(expected),'Missing Pages guard: '+expected);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-pages-rollback-'));
try{
 const remote=path.join(tmp,'remote.git'),work=path.join(tmp,'work');
 function git(cwd,...args){return execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim()}
 fs.mkdirSync(work);
 git(tmp,'init','--bare',remote);
 git(work,'init','-b','main');
 git(work,'config','user.name','CI Sandbox');
 git(work,'config','user.email','ci-sandbox@example.invalid');
 git(work,'remote','add','origin',remote);
 function commit(file,body){fs.writeFileSync(path.join(work,file),body);git(work,'add',file);git(work,'commit','-m','sandbox '+file);git(work,'push','origin','HEAD:main')}
 function run(sha){return spawnSync('bash',['-c',bash],{cwd:work,env:{...process.env,VERIFIED_SHA:sha},encoding:'utf8',timeout:10000})}
 function expect(ok,sha,reason){const p=run(sha);assert.equal(p.error,undefined,'Shell execution failed');assert.equal(p.status,ok?0:1,reason+' '+p.stdout+' '+p.stderr);return p}
 commit('quizz.html','tested source');
 const tested=git(work,'rev-parse','HEAD');
 expect(true,tested,'Exact tested HEAD must be accepted');
 commit('catalogue.json','generated catalogue');
 expect(true,tested,'Generated catalogue only is accepted');
 commit('site-version.json','generated version');
 expect(true,tested,'Both generated JSON files are accepted');
 commit('quizz.html','untested modification');
 assert.match(expect(false,tested,'Untested source must be rejected').stdout,/Modification non validée/);
 git(work,'checkout','--orphan','independent');
 git(work,'rm','-r','-f','.');
 fs.writeFileSync(path.join(work,'quizz.html'),'independent history');
 git(work,'add','quizz.html');git(work,'commit','-m','unrelated history');
 git(work,'push','--force','origin','HEAD:main');
 assert.match(expect(false,tested,'Old SHA must be rejected').stdout,/Le commit testé n'est plus/);
 console.log('WAVE2 CI PAGES ROLLBACK PASS: exact SHA, generated JSON, untested source and unrelated ancestry checked');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
