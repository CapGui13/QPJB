'use strict';
// The AL prepublication gate must be observable and must fail closed in --require-ready mode.
// This does not grant authorization to deploy, merge or alter any QCM.
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const entry=path.join(__dirname,'../scripts/parcours-v2-publication-gate-al.cjs');
const manifest=require('../Docs/PARCOURS_V2_PHASE_AL_MANIFESTE_ARBITRAGE_20261119.json');
const result=require(entry).result;
assert.equal(result.catalog,1523);
assert.equal(result.flags,19);
assert.equal(result.manifestCases,19);
const expected=manifest.releaseDecision==='GO'&&manifest.teacherApproval===true&&
  manifest.cases.every(c=>c.editorialApproval==='APPROVED');
assert.equal(result.publicationReady,expected,'Status and authorization mismatch');
const cli=spawnSync(process.execPath,[entry,'--require-ready'],{encoding:'utf8'});
assert.equal(cli.error,undefined,'CLI launch failed');
assert.equal(cli.status,expected?0:1,
  'Explicit --require-ready gate does not match the manifest decision');
if(!expected){
  assert.match(cli.stderr,/PUBLICATION BLOQUÉE/,
    'Pending editorial decisions must be explicitly rejected');
  assert.equal(result.mergedByThisScript,false);
  assert.equal(result.deployedByThisScript,false);
}
console.log('QPJB V2 AL GATE TEST PASS — ready='+expected+' exit='+cli.status);
