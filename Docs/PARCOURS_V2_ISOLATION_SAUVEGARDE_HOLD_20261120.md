# QPJB V2 — Aperçu éditorial HOLD et isolement des sauvegardes

**20 novembre 2026 — PR #216, sans publication.**

## Constat tiré du moteur autonome de 65 séances

La version élève originale (empreinte SHA-256 \`c478dd2d24c13e2e706cbdc168b7a822258f9fe1c09c65cf44cb75516c29d879\`) écrit sous la clé locale \`qpjb-preview-v2-eleve-01\`.

- Sa sauvegarde contient \`schema:1\`, \`engineState\`, \`current\` (items, position, answers, revealed), \`completed\` (scores par séance), \`nextSession\`, et \`finished\`.
- Une réponse active enregistrée inclut notamment \`{value, correct, sidecar}\`. Le moteur \`finishSession\` exploite ces \`correct\` pour ses statistiques et pour programmer les rappels.
- \`restore()\` contrôle la structure, mais **ne vérifie aucune version du barème**. Si la correction d'un QCM change à clé identique, un historique ancien peut être interprété à l'aide des nouvelles réponses : éviter cela.
- Les données sont stockées localement dans le navigateur, pas sur GitHub. Le script n'en connaît pas le contenu.

## Décision technique pour le PROTOTYPE VALIDÉ PÉDAGOGIQUEMENT, NON PUBLIÉ

Créer un aperçu autonome avec trois corrections de QCM **validées par l'utilisatrice** et une rubrique V2 approuvée pour le gambling, **sans publier les corrections**.

- Clé exclusive du prototype : **\`qpjb-preview-v2-eleve-02-hold\`**.
- La clé **\`qpjb-preview-v2-eleve-01\` reste intacte** ; aucune importation, migration, suppression, ni réévaluation automatique n'est effectuée.
- Les anciens élèves peuvent poursuivre leur ancienne progression dans l'ancien fichier d'aperçu. Le nouveau prototype commence un historique distinct.
- Le HTML généré affiche un avertissement « CORRECTIONS VALIDÉES — PUBLICATION NON AUTORISÉE », une balise \`noindex\`, et le manifeste \`HOLD\` ; **il ne doit pas être distribué aux élèves ni déployé**.
- Les 1 523 IDs et les mains/enchères sont conservés ; seuls \`V416-008\`, \`V416-009\` et \`L25-007\` changent de contenu dans ce prototype ; \`L06-029\` reste strictement identique dans le catalogue.

## Générateur et contrôles

\`\`\`sh
node scripts/v2-editorial-dry-run.cjs
node scripts/v2-editorial-hold-sandbox.cjs
\`\`\`

Le deuxième générateur requiert la source figée dans \`source-v2/preview/v2-eleve/parcours-sef-65.html\`, récupérée par le workflow dédié. Il vérifie son SHA-256, l'identité du catalogue d'origine et les empreintes des quatre exercices, effectue les modifications en mémoire, puis teste le HTML produit, notamment l'unicité de la nouvelle clé. L'artefact GitHub Actions reste disponible **1 jour** pour limiter le stockage.

**Validation pédagogique terminée : 19/19 cas explicitement approuvés dans la PR #216.** Avant publication : adopter expressément une politique de sauvegarde pérenne, intégrer les changements dans un candidat V2 de diffusion et demander une autorisation de publication distincte. La présente PR **reste en Draft et HOLD**.

L'aperçu affiche « Ouvertures conventionnelles / barrages » pour `SEF-L06-029`, via une rubrique V2 distincte du thème `sa` du Quiz SEF ; **le moteur de progression hérité reste à adapter** avant une publication qui exige un reclassement complet dans les statistiques de compétences.
