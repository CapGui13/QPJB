# QPJB — Phase W : progression des notions et difficulté éditoriale

**19 novembre 2026 · PR #214 · V2-F inchangé, aucun déploiement.**

## Objectif

Après la revue U/V des répétitions (qui a confirmé des contrastes pédagogiques utiles), mesurer **comment la difficulté indiquée dans le catalogue et les premières situations présentées évoluent** au fil d'un parcours simulé. Éviter de juxtaposer longuement des décisions faciles, mais aussi de confondre une question notée « 5 » avec une compétence réellement difficile pour un apprenant.

## Sources vérifiables

- Le **catalogue d'origine** du Quiz SEF intégré à `quizz.html` comporte 1 523 QCM, dont les notes éditoriales se répartissent ainsi : difficulté **1 : 142**, **2 : 479**, **3 : 466**, **4 : 342**, **5 : 94**.
- Le simulateur `scripts/parcours-v2-pilot.cjs` conserve la feuille de route `P.INTRO` du moteur V1.10 pour les **22 rubriques**, et les introductions supplémentaires `STAGE_START` pour les **79 annotations candidates**. La fonction `available` vérifie l'introduction et le stage, **mais ne bloque pas les questions d'une rubrique selon le score de difficulté 1–5**.
- Le **niveau cible** du moteur est seulement une préférence de sélection : `min(5, 1 + floor(sessionIndex/12))`, avec index de séance commençant à zéro. Ce niveau ne prouve ni progression cognitive ni maîtrise.
- Les clés `P.microKey` (ou les 79 annotations) sont les seules « micro-contextes » mentionnés. Le repli `rubrique:*` **n'est pas compté comme micro-compétence acquise**.

## Protocole W

Le script `scripts/parcours-v2-progression-w.cjs` simule **9 parcours fictifs** : 3 profils × graines 13, 29, 47, chacun **45 séances × 10 QCM**. Il contrôle l'identité des objets issus des 1 523 exercices et ne réécrit ni les tirages ni les réponses.

Fenêtres de lecture : **1–5, 6–10, 11–20, 21–30 et 31–45**. Pour chaque fenêtre sont mesurés : moyenne *éditoriale*, histogramme des cinq notes, part des questions notées 4/5, nombre de rubriques nouvellement rencontrées, nombre de micro-contextes nouvellement rencontrés.

Autres signaux : première séance d'apparition de chaque rubrique versus séance d'introduction ; difficulté de la première question de cette rubrique ; première rencontre de chaque micro-contexte candidat, avec sa note ; nombre de questions 4/5 lors des cinq et dix premières séances et nombre de questions 1/2 dans les dix dernières séances. Les **échantillons à relire sont des IDs originaux** et ne représentent pas des erreurs avérées.

## Précautions pédagogiques

Une note de difficulté éditoriale n'évalue pas la *difficulté réelle* : seule une étude avec les erreurs et les raisonnements d'élèves pourrait renseigner cet aspect. Une question de niveau 1/2 tardive peut être un rappel pertinent. Une question de niveau 4/5 à la première exposition peut être une situation de découverte ou un contraste voulu. La première rencontre d'un thème n'est **pas** la première maîtrise d'une notion.

La classification candidate SA/Stayman et les graphes d'axes P/Q/R sont **documentaires** et partiellement à arbitrer. W ne crée ni prérequis bloquant, ni catégorie acquise, ni règle SEF supplémentaire. Les questions `reponse_inter` et `apres_inter` conservent leur rôle d'origine ; pas de regroupement abusif des différents Contres.

## Décision attendue après la CI

Ne retenir un éventuel changement de progression que si des cas **concrets et vérifiés** révèlent un défaut substantiel, puis comparer la proposition avec V2-F sur le **maintien des familles distinctes, des ouvertures/réponses mineures, des 22 rubriques et des rappels**. Les métriques ne justifient **aucune injection ou exclusion automatique**.

Tests : `tests/quizz-v2-progression-w.cjs` (catalogue original, déterminisme, niveaux, absence de mutation). Le rapport détaillé de la CI est enregistré dans `artifacts/v2-w/phase-w-matrix.json` et son résumé dans `phase-w-summary.json`.

**Statut : `W_OBSERVATOIRE_SANS_DECISION / V2_F_REFERENCE / AUCUN_DEPLOIEMENT`.**
