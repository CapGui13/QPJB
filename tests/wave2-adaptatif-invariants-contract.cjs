#!/usr/bin/env node
'use strict';
// M2 P14 : une modification UX hors JSON ne doit pas casser le garde-fou.
const assert=require('node:assert/strict');
const {extractCatalogueJson,fingerprint}=require('./wave2-adaptatif-invariants.cjs');
const data='{"demonstration":1}'; // Donnee technique, aucune donne de bridge inventee.
const tag='<script id="training-data" type="application/json">'+data+'</script>';
const first='<html><head><title>Avant</title></head><body>'+tag+'</body></html>';
const second='<html><head><title>Apres</title><style>.ui{padding:2rem}</style></head><body>'+tag+'</body></html>';
assert.equal(extractCatalogueJson(first),extractCatalogueJson(second));
assert.equal(fingerprint(extractCatalogueJson(first)),fingerprint(extractCatalogueJson(second)));
const changed=first.replace(data,'{"demonstration":2}');
assert.notEqual(fingerprint(extractCatalogueJson(first)),fingerprint(extractCatalogueJson(changed)));
assert.equal(fingerprint(''),'811c9dc5');
assert.equal(fingerprint('a'),'e40c292c');
assert.throws(()=>extractCatalogueJson('<html></html>'),/Un et un seul/);
assert.throws(()=>extractCatalogueJson(first+tag),/Un et un seul/);
console.log('PASS: changements de style/DOM permis, mutation JSON detectee, manque/doublon bloques');
