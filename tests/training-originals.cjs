'use strict';
// Mission H — contrôle strict du troisième module de l'Entraînement.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dataScript=read('entrainement/training-originals-data.js');
const ctx=vm.createContext({});
vm.runInContext(dataScript+';globalThis.__items=QPJB_ORIGINALS;',ctx,{timeout:15000});
const items=JSON.parse(JSON.stringify(ctx.__items));
const unique=new Set(items.map(x=>x.id));
const byType=Object.fromEntries([...new Set(items.map(x=>x.category))].map(k=>[k,items.filter(x=>x.category===k).length]));
const byOrigin=Object.fromEntries([...new Set(items.map(x=>x.origin))].map(k=>[k,items.filter(x=>x.origin===k).length]));
const register=read('audits/cloture-entrainement/H/registre_tracabilite_1020.csv');
const app=read('entrainement/training-app.js');
const ui=read('entrainement/training-originals.js');
const html=read('entrainement/originaux.html');
const master=JSON.parse(read('entrainement/training-data.js').trim().slice(8,-1));
assert.equal(items.length,139);
assert.equal(unique.size,139,'IDs complémentaires dupliqués');
assert.deepEqual(byType,{encheres:92,flanc:3,jeu_carte:27,entame:17});
assert.deepEqual(byOrigin,{F:2,G:137});
const historicIds=new Set([...master.bidding,...master.play].map(x=>x.id));
assert.equal(historicIds.size,826,'Catalogue historique altéré');
for(const x of items){
 assert(!historicIds.has(x.id),'Identifiant historique réutilisé : '+x.id);
 assert(/^SRC-BH-[A-Z0-9-]+$/.test(x.id),'Mauvais identifiant '+x.id);
 for(const k of ['sourceId','prompt','solution','pdfSujet','pdfCorrige','shaSujet','shaCorrige'])
  assert(typeof x[k]==='string'&&x[k].trim(),'Valeur de source manquante : '+x.id+'/'+k);
 assert(/^[a-f0-9]{64}$/.test(x.shaSujet),'Sujet SHA invalide : '+x.id);
 assert(/^[a-f0-9]{64}$/.test(x.shaCorrige),'Corrigé SHA invalide : '+x.id);
 assert(x.origin==='G'||x.origin==='F');
 assert(x.sourceRole!=='corrigé'||!x.situation,'Le texte de la solution ne doit pas apparaître dans l’énoncé : '+x.id);
 assert(!Object.hasOwn(x,'choices')&&!Object.hasOwn(x,'options'),'Aucun distracteur inventé : '+x.id);
 assert(register.includes(x.sourceId),'Exercice absent de la traçabilité : '+x.id);
}
assert.equal(master.bidding.length,638);
assert.equal(master.play.length,188);
assert.equal(items.length+historicIds.size,965);
assert(html.includes('training-originals-data.js')&&html.includes('training-originals.js'),'Chargement du module absent');
assert((app.match(/Ouvrir les 139 exercices originaux/g)||[]).length===3,'Lien depuis accueil / deux rubriques');
assert(ui.includes("KEY='QPJB_TRAINING_QCM_V1'"),'Progression hors espace partagé');
assert(!ui.includes('localStorage.clear('),'Aucune remise à zéro de progression');
new Function(ui);
console.log('MISSION H SUCCESS : 139 originaux distincts F/G, 826 historiques inchangés, total 965, provenance PDF complète');
