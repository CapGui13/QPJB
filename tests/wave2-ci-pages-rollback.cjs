'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {execFileSync,spawnSync}=require('node:child_process');
const pages=fs.readFileSync(path.resolve(__dirname,'..','.github/workflows/verified-pages.yml'),'utf8');
const startMarker="      - name: Refuser le déploiement si une modification ultérieure n'est pas validée\n";
const endMarker="      - uses: actions/configure-pages@v5\n";
assert.ok(pages.includes(startMarker)&&pages.includes(endMarker));
const block=pages.slice(pages.indexOf(startMarker)+startMarker.length,pages.indexOf(endMarker));
const bash=block.split('        run: |\n')[1].split('\n').filter(l=>l.startsWith('          ')).map(l=>l.slice(10)).join('\n');
for(const expected of [
 "workflow_run.conclusion == 'success'",
 "workflow_run.head_branch == 'main'",
 "workflow_run.event != 'pull_request'",
 "needs.pages-source.outputs.enabled == 'true'",
 "needs.pages-source.outputs.publish == 'true'",
 'node scripts/ci-publication-guard.cjs verify',
 'git/ref/heads/main'
])assert.ok(pages.includes(expected),'Missing Pages guard: '+expected);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'qpjb-pages-rollback-'));
try{
 const remote=path.join(tmp,'remote.git'),work=path.join(tmp,'work'),bin=path.join(tmp,'bin');
 function git(cwd,...args){return execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim()}
 fs.mkdirSync(work);fs.mkdirSync(bin);
 git(tmp,'init','--bare',remote);
 git(work,'init','-b','main');
 git(work,'config','user.name','CI Sandbox');
 git(work,'config','user.email','ci-sandbox@example.invalid');
 git(work,'remote','add','origin',remote);
 // Test the exact privileged YAML shell block with a real temporary Git
 // remote. The fake gh only translates the one expected read-only API call.
 fs.writeFileSync(path.join(bin,'gh'),'#!/bin/bash\nset -eu\n[[ "$1" == api && "$2" == repos/test/repo/git/ref/heads/main && "$3" == --jq && "$4" == .object.sha ]]\ngit --git-dir="$REMOTE" rev-parse refs/heads/main\n',{mode:0o755});
 function commit(file,body){fs.writeFileSync(path.join(work,file),body);git(work,'add',file);git(work,'commit','-m','sandbox '+file);git(work,'push','origin','HEAD:main');return git(work,'rev-parse','HEAD')}
 function run(sha,overrides={}){return spawnSync('bash',['-c',bash],{cwd:work,env:{...process.env,PATH:bin+':'+process.env.PATH,REMOTE:remote,GITHUB_REPOSITORY:'test/repo',VERIFIED_SHA:sha,GITHUB_SHA:sha,GITHUB_RUN_ID:'5',GITHUB_RUN_ATTEMPT:'2',ARCHIVE_NAME:'github-pages-5-2',...overrides},encoding:'utf8',timeout:10000})}
 function expect(ok,sha,reason,overrides){const p=run(sha,overrides);assert.equal(p.error,undefined);assert.equal(p.status,ok?0:1,reason+' '+p.stdout+' '+p.stderr);return p}
 const tested=commit('quizz.html','tested source');
 expect(true,tested,'Exact tested HEAD must be accepted');
 expect(false,tested,'Wrong workflow SHA',{GITHUB_SHA:'a'.repeat(40)});
 expect(false,tested,'Archive from earlier attempt',{ARCHIVE_NAME:'github-pages-5-1'});
 expect(false,tested,'Archive from different run',{ARCHIVE_NAME:'github-pages-6-2'});
 const generated=commit('catalogue.json','unattested catalogue');
 expect(false,tested,'Generated JSON does not bypass publication freshness');
 expect(true,generated,'Exact newer validated SHA');
 commit('site-version.json','unattested version');
 expect(false,generated,'Second generated JSON cannot bypass freshness');
 commit('quizz.html','untested modification');
 expect(false,tested,'Untested source must be rejected');
 git(work,'checkout','--orphan','independent');
 git(work,'rm','-r','-f','.');
 fs.writeFileSync(path.join(work,'quizz.html'),'independent history');
 git(work,'add','quizz.html');git(work,'commit','-m','unrelated history');
 git(work,'push','--force','origin','HEAD:main');
 expect(false,tested,'Old SHA must be rejected after rollback');
 console.log('WAVE2 CI PAGES ROLLBACK PASS: actual shell, exact SHA, generated JSON, stale source, wrong archive/run and unrelated ancestry');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
