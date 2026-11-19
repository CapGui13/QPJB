'use strict';
/* QPJB AI — reversible same-origin coexistence prototype, NOT a site change.
 * V2 uses its own localStorage key; V1 and historical quiz data are READ ONLY.
 * Generated HTML can be served from /QPJB/artifacts/v2-ai/ beside quizz.html.
 * No account authentication or V1->V2 mastery inference is attempted.
 */
const fs=require('node:fs');
const path=require('node:path');
const AG=require('./parcours-v2-build-reprise-ag.cjs');
const ROOT=path.resolve(__dirname,'..');
const SRC=path.join(ROOT,'preview','parcours-v2-autonome.html');
const DEST=path.join(ROOT,'artifacts','v2-ai','parcours-v2-cohabitation.html');
const V1_KEY='qpjb-sef-parcours-01';
const V1_TRAINING_KEY='qpjb-sef-entrainement-01';
const V2_KEY='qpjb-sef-parcours-v2-01';
const AG_KEY='qpjb-preview-v2-ag-local-resume-v1';
const LEGACY_SCRIPT=[
  '// Read-only legacy inspection. No write to V1 or training keys.',
  "const aiLegacyKey='qpjb-sef-parcours-01';",
  'function aiReadLegacy(){',
  '  try{',
  '    const old=window.localStorage.getItem(aiLegacyKey);',
  "    if(!old)return {status:'ABSENT',completed:0};",
  "    if(old.length>2000000)return {status:'UNKNOWN',completed:null};",
  '    const value=JSON.parse(old);',
  "    if(!value||typeof value!=='object'||value.version!==window.QPJBParcours.VERSION)",
  "      return {status:'UNKNOWN',completed:null};",
  '    const previous=window.QPJBParcours.load(old);',
  "    return {status:'PRESERVED',completed:previous.completed};",
  "  }catch(_){return {status:'UNKNOWN',completed:null};}",
  '}',
  'function aiShowLegacy(){',
  "  const el=document.getElementById('ai-legacy-status');",
  '  if(!el)return;',
  '  const s=aiReadLegacy();',
  "  el.textContent=s.status==='PRESERVED'",
  "    ?'Parcours classique conservé : '+s.completed+' séance(s) terminée(s). Il reste accessible séparément.'",
  "    :s.status==='ABSENT'",
  "      ?'Aucune progression du parcours classique trouvée dans ce navigateur. Le parcours classique reste indépendant.'",
  "      :'Impossible de lire la progression classique ; elle n’est pas modifiée par cette version de test.';",
  '}'
].join('\n');
function replaceOnce(s,a,b){
 const p=s.indexOf(a);
 if(p<0||s.indexOf(a,p+a.length)>=0)
   throw Error('AI : marqueur source absent ou répété '+a.slice(0,80));
 return s.slice(0,p)+b+s.slice(p+a.length);
}
function build(original){
 let html=AG.build(original);
 const start=html.indexOf('<script>(function previewApp(){');
 if(start<0)throw Error('AI : script V2 manquant');
 const before=html.slice(0,start),app=html.slice(start);
 if(!before.includes('QPJB — Prévisualisation autonome du parcours V2')||
    !app.includes(AG_KEY))
   throw Error('AI : aperçu inattendu');
 html=replaceOnce(html,
   '<title>QPJB — Prévisualisation autonome du parcours V2</title>',
   '<title>QPJB — Parcours V2, intégration réversible en test</title>');
 html=replaceOnce(html,AG_KEY,V2_KEY);
 html=replaceOnce(html,
   '<span class="ribbon">Prototype d’audit • V2 • Non publié</span>',
   '<span class="ribbon">Intégration V2 • Test privé • Non publié</span>');
 html=replaceOnce(html,
   '<p class="sub">Tester de vraies questions et le tirage algorithmique en toute autonomie, sans compte, sans historique d’élève et sans connexion réseau.</p>',
   '<p class="sub">Un parcours de QCM progressif sans leçons ni validation manuelle. La sauvegarde V2 est indépendante de celle du parcours classique.</p>');
 html=replaceOnce(html,
   '<button id="nav-review" data-action="review-open">Cas à arbitrer</button></nav>',
   '<button id="nav-review" data-action="review-open" hidden aria-hidden="true" tabindex="-1">Cas à arbitrer</button>'+
   '<a id="ai-return-v1" href="../../quizz.html" style="display:inline-flex;align-items:center;padding:9px 14px;color:#134fa1;font-weight:700;">Retour au parcours classique</a></nav>');
 html=replaceOnce(html,
   '<div id="app" aria-live="polite"></div>',
   '<div class="panel note" id="ai-legacy-status" role="status" aria-live="polite">Vérification de la progression classique…</div>'+
   '<div id="app" aria-live="polite"></div>');
 html=replaceOnce(html,
   'QPJB · Prévisualisation locale de la PR #214 · Source : Quiz SEF existant · Tout résultat est temporaire.',
   'QPJB · Candidat d’intégration V2 de la PR #214 · Sauvegarde V2 locale séparée · Aucune modification du site public.');
 // Hide editorial review controls while retaining the original catalog and engines byte for byte.
 html=replaceOnce(html,
   '<button data-action="review-open">Examiner les cas SEF sensibles</button>',
   '');
 html=replaceOnce(html,
   '<button data-action="review-open">Revoir les cas sensibles</button>',
   '');
 const last="agRestore();\nrender();\n})();</script></body></html>";
 if(!html.includes(last))throw Error('AI : point de démarrage de l’application manquant');
 html=replaceOnce(html,last,
   LEGACY_SCRIPT+'\nagRestore();\naiShowLegacy();\nrender();\n})();</script></body></html>');
 if(html.includes(AG_KEY)||html.includes('teacherConfirmedBeforeSession')||
    !html.includes(V1_KEY)||!html.includes(V2_KEY)||
    !html.includes('window.localStorage.getItem(aiLegacyKey)'))
   throw Error('AI : séparation de stockage incorrecte');
 return html;
}
function create(output=DEST){
 const html=build(fs.readFileSync(SRC,'utf8'));
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,html,'utf8');
 return {schema:'QPJB_AI_COHABITATION_1',output,
   bytes:Buffer.byteLength(html),originalQcm:1523,
   v1Key:V1_KEY,v1TrainingKey:V1_TRAINING_KEY,v2Key:V2_KEY,
   v1ReadOnly:true,v1TrainingReadOnly:true,
   v2NoAutomaticMigration:true,noMasteryTransfer:true,
   standaloneForSameOriginSiteTest:true,teacherAuthorization:false,
   lessonsIncluded:false,siteModified:false,merged:false,deployed:false};
}
module.exports={build,create,V1_KEY,V1_TRAINING_KEY,V2_KEY,AG_KEY,LEGACY_SCRIPT};
if(require.main===module)
 process.stdout.write(JSON.stringify(create(process.argv[2]||DEST),null,2)+'\n');
