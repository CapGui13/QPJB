'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dir='audits/wave2/pedagogie/';
const register=read(dir+'ARBITRAGES_P14_HOLD.json');
const p8=read(dir+'PROPOSITIONS_P8_HOLD.json');
const p10=read(dir+'CONTRE_RELECTURE_P10_15_HOLD.json');
const p13=read(dir+'REVUE_P13_32_HOLD.json');
const m7=read(dir+'PROGRESSION_P7_HOLD.json');
assert.equal(register.status,'NO_APPROVAL_NO_RELEASE');
assert.equal(register.historicalProposalsUnapplied,36);
assert.equal(register.editorial.length,6);
assert.equal(register.agreements.length,11);
const ids=register.editorial.map(x=>x.id);
assert.equal(new Set(ids).size,6);
assert.deepEqual(register.editorial.map(x=>x.origin),['P8','P8','P8','P10','P13','P13']);
assert.deepEqual(register.editorial.slice(0,3).map(x=>x.id),p8.proposals.map(x=>x.id));
assert.equal(register.editorial[3].id,p10.editorialProposalNotApplied.id);
assert.deepEqual(register.editorial.slice(4).map(x=>x.id),p13.proposedEditorialEditsNotApplied.map(x=>x.id));
const old=[
...read('audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json').proposals,
...read('audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json').proposals
];
assert.equal(old.length,36);const excluded=new Set(old.map(x=>x.id));
for(const p of register.editorial){
 assert(!excluded.has(p.id));
 assert.equal(p.newAnswer,p.oldAnswer);
 assert.deepEqual(p.newChoices,p.oldChoices);
 assert(p.fields.length>0);
}
const selected=new Set(m7.profiles.flatMap(p=>p.phases.flatMap(ph=>ph.cases.map(x=>x.id))));
const agreeIds=new Set(register.agreements.map(x=>x.id));
assert.equal(agreeIds.size,11);
assert(register.agreements.every(x=>selected.has(x.id)&&!excluded.has(x.id)));
assert.equal(register.agreements.filter(x=>x.origin==='P10').length,6);
assert.equal(register.agreements.filter(x=>x.origin==='P13').length,5);
const altered=structuredClone(register.editorial[0]);altered.newAnswer='7SA';assert.notEqual(altered.newAnswer,altered.oldAnswer);
console.log('PASS wave2-pedagogie-validations : 6 rédactions, 11 accords et 36 anciennes propositions en HOLD');
