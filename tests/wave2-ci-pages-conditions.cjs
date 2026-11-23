'use strict';
// End-to-end truth table for the actual Pages workflow_run gate.
// Run in read-only mode; no deployment API call, checkout, token or push.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const yml=fs.readFileSync(path.resolve(__dirname,'..','.github/workflows/verified-pages.yml'),'utf8');
function section(source,name){
 const marker='\n  '+name+':\n',at=source.indexOf(marker);
 assert(at>=0,'Pages job missing: '+name);
 const remainder=source.slice(at+marker.length),next=remainder.search(/\n  [a-z0-9_-]+:\n/);
 return next<0?remainder:remainder.slice(0,next);
}
function validate(source){
 const first=section(source,'pages-source'),publish=section(source,'publish');
 const match=first.match(/^    if: >-\n      \d*\$\{\{([\s\S]*?)\}\}/m);
 assert(match,'Missing workflow_run conditional');
 const expression=match[1].replace(/\s+/g,' ').trim();
 assert(/^[a-z_.() '&|!=]+$/.test(expression),'Unexpected conditional syntax');
 let cases=0;
 for(const conclusion of ['success','failure','cancelled'])
 for(const head_branch of ['main','feature'])
 for(const event of ['push','pull_request']){
  const actual=vm.runInNewContext(expression,{github:{event:{workflow_run:{conclusion,head_branch,event}}}},{timeout:100});
  const expected=conclusion==='success'&&head_branch==='main'&&event!=='pull_request';
  assert.equal(actual,expected,'Source gate wrong for '+JSON.stringify({conclusion,head_branch,event}));
  cases++;
 }
 assert.match(first,/BUILD_TYPE=\$\(gh api/,'Pages source must be read from API');
 assert.ok(first.includes('if [[ "$BUILD_TYPE" == "workflow" ]]; then'),
   'Source gate must reject non-Actions Pages');
 assert.match(first,/echo "enabled=false" >> "\$GITHUB_OUTPUT"/);
 assert.ok(publish.includes('    needs: pages-source\n'),'Publish job must depend on pages-source');
 const second=publish.match(/^    if: \${\{(.*?)\}\}/m);
 assert(second,'Publish has no guard');
 assert.equal(second[1].trim(),"needs.pages-source.outputs.enabled == 'true'",
   'Publish must require an enabled Pages source');
 return cases;
}
assert.equal(validate(yml),12);
const changed=[
 yml.replace("conclusion == 'success' &&","conclusion == 'success' ||"),
 yml.replace("head_branch == 'main'","head_branch != 'main'"),
 yml.replace("event != 'pull_request'","event == 'pull_request'"),
 yml.replace('if [[ "$BUILD_TYPE" == "workflow" ]]; then','if [[ "$BUILD_TYPE" != "workflow" ]]; then'),
 yml.replace('    needs: pages-source\n','    needs: other-job\n'),
 yml.replace("needs.pages-source.outputs.enabled == 'true'","needs.pages-source.outputs.enabled != 'true'")
];
for(const broken of changed){assert.notEqual(broken,yml,'Counterexample mutation did not apply');assert.throws(()=>validate(broken));}
console.log('WAVE2 CI PAGES CONDITIONS PASS: 12 workflow_run outcomes, 6 dangerous mutations rejected, source+publish gates preserved');
