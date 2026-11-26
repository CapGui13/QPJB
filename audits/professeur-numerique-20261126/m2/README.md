# M2 — architecture de l'apprentissage, livraison finale (#388)

Base figée f8ae2120eb893c68b4cac315b7901ece69806b87. Catalogue HTML blob 99049d0d5790767ba991414240aa7d837c1b188e, prérequis a0333a153c274ab49f8e355c4695f8116b50d967. Module final blob 99c0fa237639975e337df7b4608bc8ed3cc72e54. Contrat #386 ; références #293 #366–369 #375 #377–381 #385 #255 #256 #365 #376. PR brouillon #393. Aucun changement de production.

## Objectifs, carte et limites

99/99 concepts, 1879/1879 IDs existants classés, objectifs observables écrits par concept, prérequis agrégés (nombre d'IDs, min et max d'exposition), six étapes, 1234 exemples par étape et critère, relations de consolidation et discrimination, 14 paires de contraste contextuel relues, 18 paires de transfert relues et explicitement justifiées. Les prérequis agrégés ne constituent pas des exigences communes à tous les IDs ; pas de nouvelle barrière. Les exemples et bonnes enchères restent des données internes enseignant, jamais à afficher avant réponse.

Les rôles par ID s'appuient sur les mains, familles, séquences, réponses proposées et indices du corrigé réel. Qualification lexicale de chaque corrigé, et relecture ciblée des huit cas où l'indice n'était pas détecté, des frontières et des paires explicitement retenues. Ce n'est pas une validation éditoriale manuelle individuelle des 1879 cas. Les critères de discrimination exigent des choix réciproques, une même séquence et un contexte explicite comparable (position, vulnérabilité, atout), des mains/familles distinctes et un axe commun du corrigé. Les paires structurelles restent des candidats, non une preuve d'isolation causale. En particulier les contraintes non indiquées demeurent inconnues, jamais inventées. Les paires de transfert sont exclusivement relues et motivées : même principe réinvesti dans une autre structure, y compris entre concepts. Un Passe adverse simplement rendu explicite ou une même bonne enchère de sens différent ne suffit pas.

| Rôle | Avant, première carte M2 (IDs / concepts) | Final (IDs / concepts) |
| --- | ---: | ---: |
| Découverte | 919 / 99 | 908 / 99 |
| Consolidation | 726 / 62 | 659 / 59 |
| Discrimination | 1254 / 89 | 1165 / 87 |
| Approfondissement | 635 / 43 | 1010 / 76 |
| Transfert | 561 / 47 | 34 / 22 |
| Review | 1879 / 99 | 1879 / 99 |

Avant M2, le moteur disposait des quatre stages de prérequis, non de ces six fonctions. Les chiffres ci-dessus comparent deux cartographies M2, pas deux parcours en production. La réduction des étiquettes résulte d'une qualification plus stricte ; ne pas l'interpréter comme perte d'exercices. Les lacunes de rôle restent HOLD, pas des besoins démontrés d'ajouter des QCM. 15 réservoirs ≤5 familles ; un seul cas 3–3 meilleure mineure (SEF-012-1). Les neuf exemples d'entrée du soutien majeur sont uniquement des soutiens simples avec trois atouts. Les autres cas restent accessibles selon le moteur. Approfondissement = plusieurs axes effectivement présents dans le corrigé, plus frontière, contexte compétitif ou développement ; jamais difficulté seule. Aucun ajout M1 anticipé.

## API UMD

Global navigateur QPJBApprentissageConcepts, CommonJS module.exports. schema QPJB_CONCEPTS_V1. describe(concept), classify(id) renvoient les objets figés ou null. recommend({history,concept,candidates,selected,category}) renvoie {schema,concepts,candidates:[{id,delta,reason,concept,role}]} ; uniquement candidats fournis, tri souple et borné, aucune sélection, aucune persistance, aucun changement de score. Catégories review/maintenance/weakness/due neutres. Les alternatives éligibles sans rôle cible attesté sont neutres et signalées ; aucune barrière. Le coordinateur peut consommer uniquement le signal explicatif ou l'utiliser après éligibilité.

history suit journal réel #385 (mode parcours, session humaine <= completed, answers), anciennes entries.assessment uniquement exposition, jamais preuve. Succès strictement autonomes avec choix exact et flags explicites ; consolidation ciblée et séance active ne prouvent pas de maîtrise. Deux familles et séances distinctes sont un indice, pas la maîtrise. Réussites des deux décisions d'une paire documentée en séances distinctes : indice de discrimination/transfert, non mesure de compréhension verbale. Fragilité de famille : erreur/aide/absence de preuve récente au niveau de la dernière évaluation de la famille ; une réussite isolée ailleurs ne l'efface pas. Deux réussites ultérieures sur deux autres familles et deux séances lèvent la fragilité conceptuelle active, mais unresolvedWeakFamilies conserve l'incertitude historique. Aucun seuil de maîtrise ou d'intervalle de révision ajouté. mastery reste not_established. Moteur responsable de la révision temporelle.

## Recette finale exécutée

19 449 assertions du test concepts : les 99 concepts, 1879 IDs, liens, 495 scénarios concept/profil, cas historiques et limites, exemples, non-mutation, modes UMD CommonJS/window simulés. 5 664 assertions du banc journal sur le moteur de base réel, 9 trajectoires synthétiques, 6 profils, graines 11/47/103, 403 séances, 4030 réponses. Total final : 25 113 assertions. Les fichiers recette-finale-s20.json, recette-finale-s65.json et recette-finale-s153.json contiennent les résultats du blob final ; les autres recettes sont des états intermédiaires.

| Test final | Avant (premier exercice du deck sélectionné, rôle cible attesté) | Après (premier exercice du classement informatif) |
| --- | ---: | ---: |
| S20, 6 profils | 106/120 | 120/120 |
| S65, autonome et aide | 93/130 | 130/130 |
| S153, intermédiaire | 80/153 | 153/153 |
| Total | 279/403 | 403/403 |

Le classement est testé sur les dix QCM déjà sélectionnés par le moteur, sans les réordonner effectivement ni modifier la séance. Ces chiffres mesurent uniquement la capacité à mettre en tête un candidat dont le rôle correspond à l'objectif calculé, non la qualité d'un futur moteur intégré. Aucun ID ajouté, retiré ou substitué, aucune mutation des états, reprise par load JSON déterministe, zéro séance courte. À S65 autonome : 99 concepts rencontrés, 89 preuves multi-familles/séances ; aide fréquente : 97 concepts rencontrés, une seule preuve multi-familles/séances. À S153 intermédiaire : 99 concepts, 1368 familles ; 51 concepts avec preuves multi-familles, 40 fragiles, 8 premières réussites. Comparaison intermédiaire de la récupération : fragiles 75 → 40, les erreurs historiques restent tracées. Temps de recommandation moyen ~2,13 ms à S153, max 5 ms sur ce banc V8 (indicatif, pas benchmark navigateur).

Commandes checkout : 
- node tests/professeur-numerique-m2-concepts.cjs
- node tests/professeur-numerique-m2-journal.cjs --full

Les fonctions de test des sources exactes ont été exécutées dans V8, avec chargement CommonJS et window simulés. Les commandes Node natives et Chromium/WebKit réels n'ont pas été exécutées : le dépôt privé est accessible au connecteur GitHub, non au conteneur Node (résolution réseau indisponible). Pas de revendication CI non vérifiée. Le plan global 6 profils × 3 graines × horizons 20/65/153/180, intégration UI, recette navigateur et publication restent au coordinateur, conformément au périmètre #386. Les simulations ne prouvent pas l'apprentissage humain ; aucune donnée d'élève publiée.

## Traçabilité

qualification.json : indices de corrigé par ID, avant/après de la première qualification et huit reprises manuelles ; ses statistiques de transfert sont intermédiaires. Le module final fait foi sur les rôles. recette.json et journaux-* : historiques de développement ; recette-finale-s* : résultats finaux. Aucun changement de bonne réponse, prérequis, catalogue, moteur ou autre mission. Pas de fusion.

## Clôture

Production autonome complète et testée sous V8. Limites : les candidats de discrimination/consolidation ne sont pas tous validés manuellement ; les 18 paires de transfert ont été relues, mais les 77 concepts restants sans transfert attesté restent HOLD, pas déclarés incomplets à tort. La qualification éditoriale intégrale et la validation native restent des limites explicites, la recette globale appartenant au coordinateur.
