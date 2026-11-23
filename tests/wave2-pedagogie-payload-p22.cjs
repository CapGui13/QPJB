'use strict';
// M1 P22: une evolution UI ne peut pas invalider un catalogue QCM identique.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const contract=JSON.parse(fs.readFileSync(path.join(root,'audits/wave2/pedagogie/CATALOGUE_EMPREINTE_P22_HOLD.json'),'utf8'));
const expected='22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a';
assert.equal(contract.catalogueSha256RawUtf8,expected);
assert.equal(contract.verifiedSameRawJSONM1M3,true);
function payload(text){
 const tag='<script id="training-data" type="application/json">';
 const i=text.indexOf(tag),j=text.indexOf('</script>',i+tag.length);
 assert(i>=0&&j>i,'Script training-data absent');
 return text.slice(i+tag.length,j);
}
const digest=text=>crypto.createHash('sha256').update(text,'utf8').digest('hex');
const raw=payload(html);
validateApproved(raw);
assert.equal(digest(restoreApprovedContexts(raw)),expected,'Charge QCM modifiee hors deux contextes');
const data=JSON.parse(raw);
assert.equal(data.exercises.length,1523);assert.equal(data.themes.length,22);
const uiOnly='<!---- UI P22 : styles, barre de navigation, aides mobiles ---->';
assert.equal(digest(restoreApprovedContexts(payload(uiOnly+html))),expected,'Modification UI externe a corrompu le QCM');
assert.equal(digest(restoreApprovedContexts(payload(html+uiOnly))),expected,'Modification UI apres le QCM a corrompu le QCM');
const corrupted=raw.replace('"exercises"', '"exercisEs"');
assert.notEqual(corrupted,raw,'Mutateur JSON sans effet');
assert.throws(()=>validateApproved(corrupted),'Une mutation du catalogue doit être rejetée');
const two=['wave2-pedagogie-progressions.cjs','wave2-pedagogie-catalogue-p21.cjs'];
for(const name of two){
 const code=fs.readFileSync(path.join(root,'tests',name),'utf8');
 assert(code.includes("createHash('sha256')"),'Garde-fou SHA-256 manquant dans '+name);
 assert(code.includes(expected),'Empreinte JSON attendue absente dans '+name);
 assert(!code.includes("assert.equal(hashGit(html)"),'Garde-fou HTML global encore actif : '+name);
}
console.log('PASS wave2-pedagogie-payload-p22 : QCM 1523 / 22, SHA-256 JSON, UI libre, mutation du catalogue detectee');
