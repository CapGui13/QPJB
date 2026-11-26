# M1 — Adaptation cognitive (contrats #396 et #397)

Base immuable : d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7. PR #405 brouillon. Production existante intacte.

## Cartographie et objectifs
- 1915 QCM, 99 concepts, 5745 options erronées, 5416 hypothèses et 329 unknown ; chacune exécutée via QPJBProfesseur.diagnose du SHA figé. 1207 high, 4014 medium, 195 low. Aucun nouveau visa éditorial : les motifs de #395 sont conservés.
- Registre 0–3 : une entrée par ID, concept, famille, difficulté, prérequis, rôles, contraste historique, chaque choix avec statut, catégorie, confiance, critère lexical, règle, raison et disposition. Les règles lexicales distinguent notamment H, HL, HLD, longueur, priorité de fit, forcing, palier ; elles ne certifient pas un raisonnement psychologique. Les 195 low et les 329 unknown sont exclus des adaptations.
- Cibles : 100% des options recensées ; aucun bonus sans récurrence indépendante multi-famille/multi-séance ; bonus borné à 48 ; S1–3 identiques ; aucun contournement de filtre, quota, rappel explicite, famille ou reprise. Objectif comparatif : hausse des occasions de discrimination et familles >=95% de référence par trajectoire, pas de régression substantielle de preuve/exposition.

## Intégration
Le coordinateur charge quizz-durable-m1-adaptation.js après le module professeur. API UMD/CommonJS schema QPJB_DURABLE_ADAPTATION_V1 ; analyze({history,exercises,diagnose}) retourne {schema,signals,observations,limits}. Les signalIds, références aux ID/familles/séances, force, limites, récupération et succès contradictoires sont explicites. Fournir QPJBProfesseur.diagnose. Calculer une fois par construction de nouvelle séance ; aucun stockage supplémentaire. rank({history,exercises,candidates,selected,signals,conceptStates,category}) renvoie uniquement des bonus d'IDs candidats ; appliquer après tous les filtres de choose() et après rankPedagogy, exclusivement si !explicitRecall && !priority et s>=3. Ne rien modifier dans active, ni sur consolidation, ni si signal incomplet. conceptStates facultatif : aucun override de maîtrise. Voir tests/durable-m1-banc.cjs pour les ancres exactes du moteur.

La fenêtre est de 10 séances normales. Un signal isolé, une aide seule, un choix non offert, une première enchère inconnue, une incohérence d'identité ou une confiance faible sont neutres. Deux erreurs indépendantes, sur deux familles et deux séances, sont requises pour récurrence ; trois familles/séances et deux high pour force élevée, avec atténuation par preuves contradictoires. Deux réussites autonomes ultérieures sur familles/séances distinctes réduisent le signal à recovered ; ce n'est pas une preuve de maîtrise. Le journal réel ne stocke pas toujours firstGuess : aucune reconstruction. Les réussites assistées ne comptent pas comme preuve autonome. Les axes transversaux convention et compétition restent informatifs, pas de transfert automatique entre conventions.

Le rang exige une autre famille, une difficulté comparable, un exercice inédit, un contraste référencé ou des décisions réciproques, et un rôle de discrimination existant. Maximum 32 sur récurrence, 48 sur signal fort, 24 transversal, 12 récupération partielle. Aucun bonus découverte/maintenance. Le choix reste au score du moteur. Les empreintes du catalogue figé servent à l'abstention en cas de modification, pas à l'authentification cryptographique. Si catalogue évolue, régénérer et contrôler le registre/index avant activation. Le signal est une hypothèse, non une certitude sur l'intention ni un défaut de connaissance établi.

## Tests et bilan
Contrat exécuté sur données et sources réelles sous V8 (adaptateurs mémoire pour Node), 25319 assertions, dont les contrôles transversaux et UMD window simulé. Le test vérifie les 5745 options, anciens historiques, assistance, correction, répétition de famille, récupération, bornes, non-mutation et groupe concept-critère. 621 groupes examinés structurellement ; 82 offrent au moins un bonus dans le scénario de paire d'erreurs testé. Ce nombre n'est pas une limite de couverture générale. Voir tests-contrat.json.

Banc réellement raccordé en mémoire au moteur de #395, paire intermédiaire graine 47 S180 réalisée sur le premier module (commit 8f814d4) : 10→32 ciblages, 1501→1517 familles, 99 concepts et 22 rubriques conservés, 91 concepts avec preuves multifamilles/multiséances, 0 éligibilité/doublon/séance courte/violation Passe, S1–3 exactes, 587→627 erreurs simulées, dette fondamentale 693→688. Les différences de réponses simulées sont des compromis, pas un effet mesuré chez l'élève. Le dernier durcissement ec3a159 (contrat réexécuté) ne constitue pas à lui seul une nouvelle recette S180.

## Reproduction
```sh
node tests/durable-m1-contract.cjs
node tests/durable-m1-banc.cjs intermediaire 47 180
for p in autonome intermediaire faible cible aide passe; do
  for seed in 11 47 103; do node tests/durable-m1-banc.cjs "$p" "$seed" 180; done
done
for p in force longueur fit forcing convention competition recuperation; do
  node tests/durable-m1-banc.cjs "$p" 47 180
done
```
Le banc lit la base exacte via git show, fonctionne sans réseau sur checkout complet. Les profils sont synthétiques. Le DNS du terminal a empêché le checkout natif ; Node natif/Chromium/WebKit non attestés par M1.

## HOLD / statut
Recette des 18 paires S180 et profils spécifiques non intégralement exécutée ; vérifier les compromis par profil, la stabilité de l'exposition et les mesures de latence. Les signaux de récupération sont des preuves indirectes ; la sélection ne démontre ni rétention humaine ni transfert réel. Aucun merge ni publication. Le coordinateur arbitre et raccorde.

**MISSION DÉFINITIVEMENT TERMINÉE : NON** (recette comparative exhaustive non attestée).
