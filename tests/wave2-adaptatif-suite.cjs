#!/usr/bin/env node
'use strict';
// M2 : exécution Node reproductible, sans modifier les workflows réservés à M5.
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const QUICK = [
  {id:'contrat', file:'tests/wave2-adaptatif-suite-selftest.cjs', args:[]},
  {id:'invariants', file:'tests/wave2-adaptatif-invariants.cjs', args:[]},
  {id:'catalogue-ux-coexistence', file:'tests/wave2-adaptatif-invariants-contract.cjs', args:[]},
  {id:'golden-selftest', file:'tests/wave2-adaptatif-golden.cjs', args:['--selftest']},
  {id:'parallel-selftest', file:'tests/wave2-adaptatif-parallel.cjs', args:['--selftest']},
  {id:'selection-600', file:'tests/wave2-adaptatif-selection-regression.cjs', args:[]},
  {id:'reprise', file:'tests/wave2-adaptatif-resume.cjs', args:[]}
];
const RESEARCH = [
  {id:'baseline-30', file:'tests/wave2-adaptatif-parallel.cjs', args:[]},
  {id:'fondamentaux-modere153-g29', file:'tests/wave2-adaptatif-candidates.cjs',
    args:['--variant','foundation','--profile','modere','--horizon','153','--seed','29']},
  {id:'rappels-modere153-g11', file:'tests/wave2-adaptatif-candidates.cjs',
    args:['--variant','recall','--profile','modere','--horizon','153','--seed','11']},
  {id:'anciennete-modere153-g11', file:'tests/wave2-adaptatif-candidates.cjs',
    args:['--variant','overdue','--profile','modere','--horizon','153','--seed','11']},
  {id:'score-cache-modere65-g11', file:'tests/wave2-adaptatif-candidates.cjs',
    args:['--variant','score-cache','--profile','modere','--horizon','65','--seed','11']}
];
function plan(mode) {
  if (mode === '--quick') return QUICK.map(s => ({...s,args:[...s.args]}));
  if (mode === '--full') return [...QUICK,...RESEARCH].map(s => ({...s,args:[...s.args]}));
  throw new Error('Mode inconnu : '+mode);
}
function main(argv=process.argv.slice(2), opts={}) {
  const log=opts.log||console.log, error=opts.error||console.error;
  const runner=opts.runner||spawnSync, mode=argv[0]||'--quick';
  if (argv.length>1 || !['--quick','--full','--list'].includes(mode)) {
    error('Usage : node tests/wave2-adaptatif-suite.cjs [--quick|--full|--list]');
    return 2;
  }
  if (mode==='--list') {
    log(JSON.stringify({quick:plan('--quick'),full:plan('--full')},null,2));
    return 0;
  }
  const root=path.resolve(__dirname,'..'),steps=plan(mode),start=Date.now();
  for (let i=0;i<steps.length;i++) {
    const s=steps[i];
    log('[M2] '+(i+1)+'/'+steps.length+' '+s.id);
    const result=runner(process.execPath,[path.resolve(root,s.file),...s.args],
      {cwd:root,stdio:'inherit'});
    if (result.error || result.status!==0) {
      error('[M2] ECHEC '+s.id+' : '+(result.error?.message||'code='+result.status+' signal='+result.signal));
      return Number.isInteger(result.status)&&result.status>0?result.status:1;
    }
  }
  log('[M2] PASS '+steps.length+'/'+steps.length+
    ' en '+((Date.now()-start)/1000).toFixed(1)+' s');
  return 0;
}
if (require.main===module) process.exitCode=main();
module.exports={plan,main};
