"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), path=require("node:path");
const root=path.join(__dirname,".."), dir=path.join(root,"audits/coherence-concrete-20261126/m4/parallel/c/");
const load=p=>JSON.parse(fs.readFileSync(path.join(dir,p),"utf8"));
const old=JSON.parse(fs.readFileSync(path.join(root,"audits/coherence-concrete-20261126/m4/register.json"),"utf8"));
const {buildStatus,classify}=require("../quizz-coherence-m4p-c-statuts.js");
const p=load("relations.json"), files=["fondamentaux.json","reponses.json","competitif.json","s1-20-solde.json","s21-65-passe1.json","s21-65-passe2.json","s21-65-passe3.json","s21-65-passe4.json","s21-65-passe5.json","fondamentaux-mineur-solde.json","fondamentaux-majeur-red-solde.json","second-base-solde.json","chelem-solde.json","sa-solde.json","forcing-roudi-drury-solde.json","fortes-barrage-fit-solde.json","michaels-multilandy-rubensohl-solde.json","red-ouverture-competitif-solde.json","intervenir-contre-solde.json","reponse-inter-reveil-solde.json","apres-inter-solde.json"];
const observed=new Set([...load("baseline/part1-index.json").ids,...load("baseline/part2-index.json").ids]);
const themes=load("index.json").byId;
const idx=buildStatus(old,files.map(p=>[p,load(p)]),p,observed,themes);
assert.equal(Object.keys(idx).length,1915);assert.equal(new Set(old.map(x=>x.concept)).size,99);
for(const x of old){assert.equal(idx[x.id].structuralSource,"themes/"+themes[x.id]+".json");assert.equal(idx[x.id].signature,x.features.decision);assert.equal(idx[x.id].family,x.family);assert.equal(idx[x.id].concept,x.concept);assert.ok(idx[x.id].status!=="automatique_seulement"||!observed.has(x.id));}
for(const [a,b,t] of p){const ab=classify(idx,p,a,b),ba=classify(idx,p,b,a);assert.deepEqual(ab,ba);assert.ok(ab.status==="HOLD"||ab.relation===t);assert.ok(!ab.substitutionAutomatique);}
assert.equal(classify(idx,p,"SEF-001-1","unknown").status,"HOLD");assert.deepEqual(idx,load("statuts.json").byId);for(const id of load("baseline/cible-11-s21-65.json").ids)assert.ok(idx[id].status!=="automatique_seulement");
console.log("M4-C statuts OK");

const core=new Set(["ouv.passe","ouv.mineure","ouv.majeure","ouv.sa1","mineur.base","majeur.base","majeur.soutien","sa1.seuil","red.base"]);
assert.equal(old.filter(x=>core.has(x.concept)).length,381);for(const x of old.filter(x=>core.has(x.concept)))assert.ok(idx[x.id].status!=="automatique_seulement");
assert.equal(p.length,240);assert.equal(classify(idx,p,"SEF-V3-059-5","SEF-V3-057-1").status,"HOLD");

const chelem=old.filter(x=>x.concept.startsWith("chelem.")); assert.equal(chelem.length,111); for(const x of chelem)assert.ok(idx[x.id].status!=="automatique_seulement"); assert.equal(Object.values(idx).filter(x=>x.status!=="automatique_seulement").length,1915);

const sa=old.filter(x=>/^sa[12]\./.test(x.concept)); assert.equal(sa.length,218); for(const x of sa)assert.ok(idx[x.id].status!=="automatique_seulement");

const relays=old.filter(x=>/^(roudi|drury|forcing)\./.test(x.concept)); assert.equal(relays.length,174); for(const x of relays)assert.ok(idx[x.id].status!=="automatique_seulement");

const strongFit=old.filter(x=>/^(fortes|barrage|apres_fit|fit)\./.test(x.concept)); assert.equal(strongFit.length,193); for(const x of strongFit)assert.ok(idx[x.id].status!=="automatique_seulement"); assert.equal(classify(idx,p,"SEF-L14-013","V2-M2-009").status,"HOLD");

const convComp=old.filter(x=>/^(michaels|multilandy|rubensohl)\./.test(x.concept)); assert.equal(convComp.length,188); for(const x of convComp)assert.ok(idx[x.id].status!=="automatique_seulement");

const redComp=old.filter(x=>/^(red\.|second\.|ouv\.|mineur\.|sa\.|competitif\.)/.test(x.concept)); assert.equal(redComp.length,548); for(const x of redComp)assert.ok(idx[x.id].status!=="automatique_seulement");

const intContre=old.filter(x=>/^(intervenir|contre)\./.test(x.concept)); assert.equal(intContre.length,164); for(const x of intContre)assert.ok(idx[x.id].status!=="automatique_seulement");

const repRev=old.filter(x=>/^(reponse_inter|reveil)\./.test(x.concept)); assert.equal(repRev.length,128); for(const x of repRev)assert.ok(idx[x.id].status!=="automatique_seulement");

const afterInter=old.filter(x=>/^apres_inter\./.test(x.concept)); assert.equal(afterInter.length,90); for(const x of afterInter)assert.ok(idx[x.id].status!=="automatique_seulement"); assert.equal(Object.values(idx).filter(x=>x.status==="automatique_seulement").length,0);
