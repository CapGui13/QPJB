'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {needsFull}=require('../scripts/ci-transversal-scope.cjs');
const base='a'.repeat(40),head='b'.repeat(40),merge='c'.repeat(40),mb='d'.repeat(40);
const input={event:'pull_request',base,head,merge};
function deps(levels=['QUICK','UI'],alter={}){
 let i=0;
 return {git:args=>args[0]==='rev-parse'?merge:args[1]==='--is-ancestor'?'':mb,
 classify:(b,h)=>({schema:'QPJB_CI_PLAN_V1',baseSha:b,headSha:h,level:levels[i++]}),...alter};
}
test('quick and UI use targeted primary CI',()=>assert.equal(needsFull(input,deps()),false));
test('full on either PR range remains full',()=>{for(const levels of [['FULL','QUICK'],['QUICK','FULL']])assert.equal(needsFull(input,deps(levels)),true);});
test('manual recipe always full',()=>assert.equal(needsFull({...input,event:'workflow_dispatch'},deps()),true));
test('unknown level, absent evidence or classifier error stays full',()=>{for(const d of [deps(['UNKNOWN','QUICK']),deps([]),deps([], {classify:()=>null}),deps([], {classify:()=>{throw Error('proof missing');}})])assert.equal(needsFull(input,d),true);});
test('wrong SHA evidence stays full',()=>assert.equal(needsFull(input,deps([], {classify:()=>({schema:'QPJB_CI_PLAN_V1',baseSha:base,headSha:base,level:'QUICK'})})),true));
test('missing SHA or wrong checkout stays full',()=>{assert.equal(needsFull({...input,head:''},deps()),true);assert.equal(needsFull(input,deps([], {git:()=>base})),true);});
test('missing ancestry stays full',()=>assert.equal(needsFull(input,deps([], {git:args=>{if(args[0]==='rev-parse')return merge;throw Error('missing ancestry');}})),true));
