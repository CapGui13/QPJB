'use strict';
const assert=require('node:assert/strict');
const {assertHandReflow}=require('./wave2-ux-reflow-check.cjs');
const valid={documentWidth:390,viewportWidth:390,
 handClientWidth:355,handScrollWidth:355,handRect:{left:18,right:373},
 rankRects:[{left:24,right:112},{left:114,right:180},{left:195,right:244},{left:249,right:365}]};
assert.equal(assertHandReflow(valid),true);
assert.equal(assertHandReflow({...valid,documentWidth:391}),true);
assert.throws(()=>assertHandReflow({...valid,documentWidth:396}),/débordement horizontal de la page/);
// Reproduction du faux succès observé dans une capture historique Entraînement:
// documentWidth 390, mais un symbole de main s'étend à 444 CSS px.
assert.throws(()=>assertHandReflow({...valid,handScrollWidth:426}),/main tronquée/);
assert.throws(()=>assertHandReflow({...valid,rankRects:[...valid.rankRects.slice(0,3),{left:249,right:444}]}),
 /longueur de couleur sort de la main/);
assert.throws(()=>assertHandReflow({...valid,rankRects:valid.rankRects.slice(0,3)}),
 /quatre couleurs/);
assert.throws(()=>assertHandReflow({...valid,handScrollWidth:null}),/mesure handScrollWidth absente/);
console.log('PASS M3 reflow : 2 états valides + 5 corruptions/rognages correctement rejetés');
