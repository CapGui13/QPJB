"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), path=require("node:path");
const root=path.join(__dirname,".."), dir=path.join(root,"audits/coherence-concrete-20261126/m4/parallel/c/");
const load=p=>JSON.parse(fs.readFileSync(path.join(dir,p),"utf8"));
const old=JSON.parse(fs.readFileSync(path.join(root,"audits/coherence-concrete-20261126/m4/register.json"),"utf8"));
const {buildStatus,classify}=require("../quizz-coherence-m4p-c-statuts.js");
const p=load("relations.json"), files=["fondamentaux.json","reponses.json","competitif.json","s1-20-solde.json","s21-65-passe1.json","s21-65-passe2.json","s21-65-passe3.json","s21-65-passe4.json"];
const observed=new Set([...load("baseline/part1-index.json").ids,...load("baseline/part2-index.json").ids]);
const themes=load("index.json").byId;
const idx=buildStatus(old,files.map(p=>[p,load(p)]),p,observed,themes);
assert.equal(Object.keys(idx).length,1915);assert.equal(new Set(old.map(x=>x.concept)).size,99);
for(const x of old){assert.equal(idx[x.id].structuralSource,"themes/"+themes[x.id]+".json");assert.equal(idx[x.id].signature,x.features.decision);assert.equal(idx[x.id].family,x.family);assert.equal(idx[x.id].concept,x.concept);assert.ok(idx[x.id].status!=="automatique_seulement"||!observed.has(x.id));}
for(const [a,b,t] of p){const ab=classify(idx,p,a,b),ba=classify(idx,p,b,a);assert.deepEqual(ab,ba);assert.ok(ab.status==="HOLD"||ab.relation===t);assert.ok(!ab.substitutionAutomatique);}
assert.equal(classify(idx,p,"SEF-001-1","unknown").status,"HOLD");assert.deepEqual(idx,load("statuts.json").byId);
console.log("M4-C statuts OK");
