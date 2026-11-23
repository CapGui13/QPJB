'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const manifest=require('../audits/pedagogie/validation-globale-29-20261124.json');
const byId=new Map(manifest.items.map(e=>[e.id,e]));
const oldAxisBlock="const AXIS_AUDIT=[\n    [\n      \"fit\",\n      \"majeur\",\n      \"Soutien simple sur ouverture majeure\",\n      [\n        \"SEF-026-3\",\n        \"SEF-026-1\",\n        \"SEF-027-2\",\n        \"SEF-027-1\",\n        \"SEF-N049-1\",\n        \"SEF-N049-3\",\n        \"SEF-N050-2\",\n        \"SEF-N050-1\",\n        \"SEF-N054-1\",\n        \"SEF-N055-2\",\n        \"SEF-N055-1\"\n      ]\n    ],\n    [\n      \"fit\",\n      \"mineur\",\n      \"Soutien mineur : différence entre main régulière et main avec singleton.\",\n      [\n        \"SEF-020-1\",\n        \"SEF-N031-2\",\n        \"SEF-V412-014\",\n        \"SEF-V412-015\"\n      ]\n    ],\n    [\n      \"fit\",\n      \"roudi\",\n      \"Déclencher le Roudi pour rechercher un fit 5-3\",\n      [\n        \"SEF-V4-073-1\",\n        \"SEF-V4-079-3\",\n        \"SEF-V4-085-3\",\n        \"SEF-V4-091-3\"\n      ]\n    ],\n    [\n      \"fit\",\n      \"drury\",\n      \"Employer le Drury après un Passe d’entrée et un fit\",\n      [\n        \"SEF-V4-098-1\",\n        \"SEF-V4-104-1\"\n      ]\n    ],\n    [\n      \"fit\",\n      \"reponse_inter\",\n      \"Reconnaître le fit 5-3 après l’intervention du partenaire.\",\n      [\n        \"SEF-V49-032\"\n      ]\n    ],\n    [\n      \"force\",\n      \"sa\",\n      \"Calcul élémentaire de la zone de manche face à Sans-Atout\",\n      [\n        \"SEF-031-2\",\n        \"SEF-031-1\",\n        \"SEF-032-1\",\n        \"SEF-033-1\",\n        \"SEF-033-2\",\n        \"SEF-041-2\",\n        \"SEF-041-1\",\n        \"SEF-N088-3\",\n        \"SEF-N088-1\",\n        \"SEF-N089-2\",\n        \"SEF-N089-1\",\n        \"SEF-N090-1\",\n        \"SEF-N091-3\",\n        \"SEF-N091-1\",\n        \"SEF-N092-1\",\n        \"SEF-N092-2\",\n        \"SEF-N093-1\",\n        \"SEF-N093-3\",\n        \"SEF-N097-3\",\n        \"SEF-N097-1\",\n        \"SEF-N098-1\",\n        \"SEF-N098-2\",\n        \"SEF-N099-2\",\n        \"SEF-N099-1\",\n        \"SEF-N100-3\",\n        \"SEF-N100-2\"\n      ]\n    ],\n    [\n      \"force\",\n      \"apres_fit\",\n      \"Refuser tout espoir de manche avec l’ouverture minimale\",\n      [\n        \"SEF-V4-001-1\",\n        \"SEF-V4-003-3\",\n        \"SEF-V4-013-3\",\n        \"SEF-V4-015-3\"\n      ]\n    ],\n    [\n      \"force\",\n      \"apres_fit\",\n      \"Apprécier une main non minimale pour proposer la manche\",\n      [\n        \"SEF-V4-002-1\",\n        \"SEF-V4-004-1\",\n        \"SEF-V4-014-1\",\n        \"SEF-V4-016-2\"\n      ]\n    ],\n    [\n      \"force\",\n      \"apres_fit\",\n      \"Réévaluer la force avec une courte et un fit établi\",\n      [\n        \"SEF-V4-007-1\",\n        \"SEF-V4-007-2\",\n        \"SEF-V4-008-1\",\n        \"SEF-V4-019-1\",\n        \"SEF-V4-020-1\",\n        \"SEF-V4-020-3\"\n      ]\n    ],\n    [\n      \"force\",\n      \"drury\",\n      \"Reconnaître le seuil exact du Drury : 10 HLD ne suffisent pas\",\n      [\n        \"SEF-V4-097-1\",\n        \"SEF-V4-103-1\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"second\",\n      \"Choix du contrat partiel après la redemande de l’ouvreur\",\n      [\n        \"SEF-052-3\",\n        \"SEF-052-1\",\n        \"SEF-053-2\",\n        \"SEF-053-3\",\n        \"SEF-054-1\",\n        \"SEF-054-2\",\n        \"SEF-055-3\",\n        \"SEF-055-2\",\n        \"SEF-N134-1\",\n        \"SEF-N134-3\",\n        \"SEF-N135-3\",\n        \"SEF-N136-1\",\n        \"SEF-N137-1\",\n        \"SEF-N138-1\",\n        \"SEF-N138-2\",\n        \"SEF-N141-2\",\n        \"SEF-N142-1\",\n        \"SEF-N142-3\",\n        \"SEF-V44-025\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Déterminer le bon niveau après découverte du fit\",\n      [\n        \"SEF-V4-010-1\",\n        \"SEF-V4-012-1\",\n        \"SEF-V4-022-3\",\n        \"SEF-V4-024-2\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Distinguer le barrage d’une proposition de manche\",\n      [\n        \"SEF-V4-005-2\",\n        \"SEF-V4-006-2\",\n        \"SEF-V4-017-2\",\n        \"SEF-V4-018-1\"\n      ]\n    ],\n    // Lot D validé : 4 justifications individuelles remplacent l'ancien\n    // libellé générique. Axe \"palier\" et 105 preuves conservés ; filtre exact inchangé.\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Après 1♥–2♥–2SA, refuser l'essai généralisé avec un soutien minimum de 6 HLD.\",\n      [\n        \"SEF-V4-009-1\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Distinguer soutien minimum et acceptation de manche après 1♥–2♥–2SA.\",\n      [\n        \"SEF-V4-011-1\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Refuser un essai généralisé de manche avec un fit Pique minimum de 6 HLD.\",\n      [\n        \"SEF-V4-021-1\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"apres_fit\",\n      \"Ne pas confondre honneurs épars et soutien suffisant pour accepter la manche après 2SA d'essai.\",\n      [\n        \"SEF-V4-023-3\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"reveil\",\n      \"Distinguer un réveil à saut ou au palier de deux\",\n      [\n        \"SEF-V4-053-4\",\n        \"SEF-V4-054-2\",\n        \"SEF-V4-070-2\",\n        \"SEF-V4-071-2\",\n        \"SEF-V4-072-3\"\n      ]\n    ],\n    [\n      \"palier\",\n      \"barrage\",\n      \"Évaluer la longueur et la qualité d’un barrage au palier de 3\",\n      [\n        \"SEF-V3-099-3\",\n        \"SEF-V3-099-1\",\n        \"SEF-V3-100-4\",\n        \"SEF-V44-046\",\n        \"SEF-V44-047\"\n      ]\n    ]\n  ];";
const gitBlob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\0','utf8').update(s,'utf8').digest('hex');
function normalizeRow(row,allowPrevious=false){
 const e=byId.get(row.id);
 if(!e)return row;
 const previous={...row};
 for(const k of e.fields){
  assert(['context','explain','difficultyReason'].includes(k));
  assert(row[k]===e.after[k]||(allowPrevious&&row[k]===e.before[k]),'Modification QCM autre que le visa global : '+e.id+'#'+k);
  previous[k]=e.before[k];
 }
 return previous;
}
function restoreGlobal(raw){
 const data=JSON.parse(raw);
 assert(Array.isArray(data.exercises),'Catalogue absent');
 assert.equal(manifest.items.length,21);
 assert.equal(manifest.items.reduce((n,e)=>n+e.fields.length,0),46);
 const present=new Set(data.exercises.filter(q=>byId.has(q.id)).map(q=>q.id));
 assert.equal(present.size,21,'Modification QCM autre que le visa global : ID manquant');
 data.exercises=data.exercises.map(q=>normalizeRow(q));
 return JSON.stringify(data);
}
function restoreEngine(code){
 const re=/const AXIS_AUDIT\s*=\s*\[[\s\S]*?\n  \];/g;
 assert.equal([...code.matchAll(re)].length,1);
 const oldRows=JSON.parse(oldAxisBlock.replace(/^const AXIS_AUDIT\s*=\s*/,'').replace(/;$/,'').replace(/^\s*\/\/.*$/gm,''));
 const changed=new Map(manifest.items.filter(e=>e.axis).map(e=>[e.id,e]));
 assert.equal(changed.size,8);
 const rows=oldRows.flatMap(([axis,theme,reason,ids])=>{
  const keep=ids.filter(id=>!changed.has(id));
  return [...(keep.length?[[axis,theme,reason,keep]]:[]),...ids.filter(id=>changed.has(id)).map(id=>[axis,theme,changed.get(id).after.difficultyReason,[id]])];
 });
 const expected='const AXIS_AUDIT=[\n    // Visa global 24/11 : huit motifs individualisés, 105 associations inchangées.\n'+rows.map(row=>'    '+JSON.stringify(row)).join(',\n')+'\n  ];';
 assert.equal(code.match(re)[0],expected,'Table des axes hors visa global');
 const restored=code.replace(re,oldAxisBlock);
 assert.equal(gitBlob(restored),manifest.sourceEngineBlob,'Moteur historique modifié hors table');
 return restored;
}
module.exports={manifest,normalizeRow,restoreGlobal,restoreEngine,gitBlob};
