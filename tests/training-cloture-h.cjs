'use strict';
// Mission H : vérification autonome du registre de clôture des originaux.
// Aucune publication, aucune modification du Quiz SEF.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function parseCSV(content){
  const rows=[];let row=[],value='',quoted=false,first=true;
  content=content.replace(/^\uFEFF/,'');
  for(let i=0;i<content.length;i++){
    const ch=content[i];
    if(quoted){
      if(ch==='"'&&content[i+1]==='"'){value+='"';i++;}
      else if(ch==='"')quoted=false;
      else value+=ch;
    }else if(ch==='"'&&first){quoted=true;first=false;}
    else if(ch===','){row.push(value);value='';first=true;}
    else if(ch==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';first=true;}
    else {value+=ch;first=false;}
  }
  if(value||row.length){row.push(value);rows.push(row);}
  const header=rows.shift();
  assert(header&&header.length>1,'CSV manquant ou vide');
  return rows.filter(r=>r.length!==1||r[0]!=='').map((r,i)=>{
    assert.equal(r.length,header.length,'Ligne CSV '+(i+2)+' malformée');
    return Object.fromEntries(header.map((name,j)=>[name,r[j]]));
  });
}
function dataModule(kind){
  const text=fs.readFileSync(path.join(root,'entrainement','training-data-'+kind+'.js'),'utf8').trim();
  const prefix='D.'+kind+'=';
  assert(text.startsWith(prefix),'Module '+kind+' invalide');
  return JSON.parse(text.slice(prefix.length).replace(/;\s*$/,''));
}
const dir=path.join(root,'audits/cloture-entrainement/H');
const rows=parseCSV(fs.readFileSync(path.join(dir,'registre_tracabilite_1020.csv'),'utf8'));
const candidates=parseCSV(fs.readFileSync(path.join(dir,'matrice_transcription_139.csv'),'utf8'));
const expected={PUBLIE_EXISTANT:820,PUBLIE_SOURCE_AMBIGUE:6,A_INTEGRER:139,BLOQUE_SOURCE:46,REDONDANT:9};
const ids=new Set(),stats={},qIds=new Set();
for(const x of rows){
  assert(x.id_source&&!ids.has(x.id_source),'ID source absent ou dupliqué : '+x.id_source);
  ids.add(x.id_source);
  assert(x.reference_pdf_sujet&&x.sha256_sujet&&x.reference_pdf_corrige&&x.sha256_corrige,'Provenance incomplète : '+x.id_source);
  assert(/^[a-f0-9]{64}$/.test(x.sha256_sujet)&&/^[a-f0-9]{64}$/.test(x.sha256_corrige),'SHA-256 non valide : '+x.id_source);
  assert(Object.hasOwn(expected,x.decision_finale),'Décision absente : '+x.id_source);
  stats[x.decision_finale]=(stats[x.decision_finale]||0)+1;
  assert(x.justification_decision,'Justification absente : '+x.id_source);
  if(x.decision_finale.startsWith('PUBLIE')){
    assert(x.id_qpjb&&!qIds.has(x.id_qpjb),'ID publié absent ou non unique : '+x.id_source);
    qIds.add(x.id_qpjb);
    assert.equal(x.statut_application,'EXISTANT_SUR_MAIN');
  }else assert.equal(x.statut_application,'NON_PUBLIE_SUR_MAIN');
  if(x.decision_finale==='REDONDANT') assert(x.id_qpjb||x.source_a_conserver,'Redondance sans témoin : '+x.id_source);
}
assert.equal(rows.length,1020,'Corpus original incomplet');
for(const [status,n] of Object.entries(expected)) assert.equal(stats[status],n,'Bilan incorrect : '+status);
const candidateIds=new Set(candidates.map(x=>x.id_source));
assert.equal(candidates.length,139,'Matrice de transcription incomplète');
assert.equal(candidateIds.size,139,'Doublon dans la matrice');
for(const row of rows){
  const candidate=row.decision_finale==='A_INTEGRER';
  assert.equal(candidateIds.has(row.id_source),candidate,'Matrice incohérente : '+row.id_source);
}
const bidding=dataModule('bidding'), play=dataModule('play');
const catalogIds=[...bidding,...play].map(x=>x.id),unique=new Set(catalogIds);
assert.equal(bidding.length,638,'Catalogue Enchères modifié sans intégration documentée');
assert.equal(play.length,188,'Catalogue Carte modifié sans intégration documentée');
assert.equal(unique.size,826,'IDs de la base en double');
assert.equal(qIds.size,826,'Correspondance catalogue incomplet');
for(const id of qIds)assert(unique.has(id),'ID publié absent de la branche : '+id);
console.log('H OK — 1020 sources : '+JSON.stringify(stats));
console.log('H OK — 826 IDs publiés préservés ; 139 candidats à transcrire, 46 bloqués, 9 redondants.');
console.log('ATTENTION : ce contrôle n’est pas une validation de publication des 139 candidats.');
