'use strict';
// M1/P19 : verifie des decisions en attente, sans approbation implicite.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'../audits/wave2/pedagogie');
const read=name=>JSON.parse(fs.readFileSync(path.join(base,name),'utf8'));
const need=(ok,msg)=>{if(!ok)throw new Error(msg)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clone=a=>JSON.parse(JSON.stringify(a));
function verify(r,m,s,t,c){
 need(r.status==='NO_APPROVAL_NO_RELEASE'&&r.historicalProposalsUnapplied===36,'Registre HOLD/36 invalide');
 need(r.editorial.length===6&&r.agreements.length===11,'Inventaire 6+11 invalide');
 const e=r.editorial.map(x=>x.id),a=r.agreements.map(x=>x.id);
 need(new Set([...e,...a]).size===17,'IDs dupliques');
 need(same(e,m.humanDecisions.editorial.map(x=>x.id)),'P14/P16 editoriaux divergents');
 need(same(a,m.humanDecisions.agreements.map(x=>x.id))&&same(a,s.sourceChecks.map(x=>x.id)),'P14/P15/P16 accords divergents');
 need(m.status==='MISSION_NON_TERMINEE_HOLD'&&m.merge==='FORBIDDEN'&&m.publish==='FORBIDDEN','HOLD leve sans decision');
 need(m.humanDecisions.editorial.every(x=>x.approved===false),'Validation editoriale sans visa humain');
 need(m.humanDecisions.agreements.every(x=>x.confirmedByHuman===false),'Accord approuve sans visa humain');
 for(const p of r.editorial){
   need(p.oldAnswer===p.newAnswer&&same(p.oldChoices,p.newChoices),'Reponse ou choix modifies : '+p.id);
   need(p.fields.length===1&&['context','explain'].includes(p.fields[0]),'Champ editorial hors cible : '+p.id);
 }
 const counts={};
 s.sourceChecks.forEach((p,i)=>{
   need(p.reviewStatus==='HOLD_NEEDS_REFERENT'&&p.answerUnchanged===true,'Source liberee sans visa : '+p.id);
   need(p.tier===m.humanDecisions.agreements[i].tier,'Degre de preuve divergent : '+p.id);
   counts[p.tier]=(counts[p.tier]||0)+1;
 });
 need(same(counts,s.summary),'Repartition des 11 preuves incoherente');
 need(t.status==='HOLD_NEEDS_CONVENTION_CHOICE'&&t.releaseStatus==='HOLD'&&t.catalogueModified===false,'Texas libere');
 need(t.affectedQcm==='SEF-L25-004'&&t.case.answer==='Passe','Cas Texas altere');
 need(t.case.hand.reduce((n,x)=>n+x.length,0)===13,'Main Texas non complete');
 need(t.case.diamondStopper===true&&t.case.diamondRanks==='AD84'&&t.case.fitThirdHeart===false,'Contre-exemple Texas perdu');
 need(t.simulatedAgreementPolicies.length===2&&t.simulatedAgreementPolicies[0].whenQcm==='Passe'&&t.simulatedAgreementPolicies[1].whenQcm==='NON_DEFINI_DANS_LES_TROIS_CHOIX','Divergence Texas masquee');
 need(c.realNodeExecution===false&&c.realGitHubCIExecution===false&&c.nextSuiteScriptNames.length===13,'Checkpoint historique P18 altere');
 return [e.length,a.length];
}
const r=read('ARBITRAGES_P14_HOLD.json'),m=read('MATRICE_REPRISE_P16_HOLD.json');
const s=read('PREUVES_SEF_P15_HOLD.json'),t=read('TEXAS_CONTRADICTOIRE_P17_HOLD.json');
const c=read('CHECKPOINT_P18_TESTS_HOLD.json');
const counts=verify(r,m,s,t,c);
const wrong=clone(m);wrong.humanDecisions.agreements[8].confirmedByHuman=true;
let rejected=false;try{verify(r,wrong,s,t,c)}catch(e){rejected=true}need(rejected,'Fausse approbation non detectee');
const wrongTexas=clone(t);wrongTexas.case.diamondStopper=false;
rejected=false;try{verify(r,m,s,wrongTexas,c)}catch(e){rejected=true}need(rejected,'Arret Carreau supprime sans alerte');
console.log('PASS wave2-pedagogie-gates-p19 : '+counts.join('+')+' HOLD, 2 contre-tests detectes');
