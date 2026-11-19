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

## Résultats contrôlés — GitHub Actions #44489961198

**CI W réussie le 19/11/2026** : tests de provenance/non-mutation et 9 simulations complètes, artefact `qpjb-v2-w-audit` (fichiers `phase-w-matrix.json` et `phase-w-summary.json`). L'audit global de la PR est indépendant de cette validation ciblée.

| Fenêtre | Moyenne de difficulté éditoriale (9 scénarios, min–max) | Part des QCM notés 4/5 | Nouvelles rubriques |
|---|---:|---:|---:|
| 1–5 | **1,14–1,20** | **0 %** | 5 |
| 6–10 | **1,50–1,56** | **0 %** | 2–3 |
| 11–20 | **2,04–2,16** | **1–2 %** | 2–6 |
| 21–30 | **2,55–2,66** | **10–12 %** | 2–8 |
| 31–45 | **3,39–3,52** | **51,33–57,33 %** | 4–6 |

**Au démarrage :** sur les 50 premiers QCM, **41 à 44 sont classés niveau 1**, **5 à 8 niveau 2** et **1 niveau 3** ; aucun niveau 4/5. Pour les séances 6–10, les 50 QCM comprennent **22 à 25 niveau 1**, **24 à 28 niveau 2**, et **0 à 2 niveau 3**. Cela rend la phase initiale **très facile au sens des étiquettes éditoriales**, malgré le mélange de types d'ouvertures/réponses. Il ne faut pas conclure qu'elle est trop facile *pour les élèves* sans observation réelle.

**Sur les dix dernières séances**, seulement **2 à 9 QCM** sont notés niveau 1/2 parmi les 100 QCM. Le passage d'une part 4/5 de 10–12 % aux séances 21–30 à plus de 50 % aux séances 31–45 **mérite une étude d'étalement** : ce n'est pas un « saut de difficulté » prouvé, car l'introduction des thèmes et le niveau cible éditorial changent aussi.

**Première exposition des rubriques (exemples utiles) :**
- `intervenir` : admissible dès **séance 11**, rencontré pour la première fois **séances 12–29** selon le scénario ; cette dispersion est réelle, mais la phase T avait déjà montré pourquoi un remplacement forcé pouvait nuire à la variété et aux rappels.
- `reponse_inter` : admissible dès **séance 14**, première présence **14–27**.
- `forcing` : admissible dès **séance 29**, premier exemple **29–40**, parfois noté 4.
- `michaels` : admissible dès **séance 37**, première présence **37–44**, toujours avec une question notée 4 dans les neuf parcours.
- `chelem` : admissible dès **séance 40**, rencontré en **séance 40** dans les neuf parcours, première question toujours notée 4.

Toutes les **22 rubriques** sont rencontrées dans chaque simulation. Les micro-contextes identifiables (et non certifiés comme acquis) sont au nombre de **30–38 par parcours**. **2 à 4 rubriques** sont abordées pour la première fois avec un QCM noté 4 ou 5 selon les scénarios ; ce sont principalement des rubriques avancées, et non des premiers cours d'ouverture.

**Contrôle de contenu pour des exemples de première exposition difficile :**
- `SEF-V45-044` (`michaels`, niveau 4) : cue-bid bicolore après 1♠ adverse, réponse 2♠.
- `SEF-V483-016` (`chelem`, niveau 4) : contrôles et arrêt à 4♠ avant Blackwood.
- `SEF-V480-015` (`forcing`, niveau 4) : priorité de redemande 3♣ après quatrième couleur forcing.
Ces exemples sont conformes aux réponses **présentes dans le catalogue**, mais ne constituent pas une certification extérieure des conventions ou de leur difficulté cognitive.

### Interprétation et option suivante

1. **Ne rien supprimer et ne pas changer les 22 introductions.**
2. Le risque éditorial prioritaire à étudier est **l'étalement** : très peu de questions niveau 3 dans les dix premières séances, puis concentration des 4/5 dans les 15 dernières. La diversité des familles et des réponses est un garde-fou incontournable.
3. Un futur comparateur **X**, seulement sur une **copie hors production de V2-F**, pourrait tester une montée éditoriale légèrement plus rapide à l'intérieur des seules rubriques déjà éligibles, sans nouveaux QCM, sans forcer de nouveaux thèmes et sans déplacer les rappels programmés. Critères d'abandon : recul de la couverture des 22 rubriques, des réponses mineures, des familles distinctes ou des rappels, ou multiplication des niveaux 4/5 avant les prérequis contextuels.
4. **Pas de conclusion selon laquelle une question plus difficile est automatiquement plus formatrice.** Les profils de réussite restent fictifs.

## Décision après validation de la CI

Ne retenir un éventuel changement de progression que si des cas **concrets et vérifiés** révèlent un défaut substantiel, puis comparer la proposition avec V2-F sur le **maintien des familles distinctes, des ouvertures/réponses mineures, des 22 rubriques et des rappels**. Les métriques ne justifient **aucune injection ou exclusion automatique**.

Tests : `tests/quizz-v2-progression-w.cjs` (catalogue original, déterminisme, niveaux, absence de mutation). Le rapport détaillé de la CI est enregistré dans `artifacts/v2-w/phase-w-matrix.json` et son résumé dans `phase-w-summary.json`.

**Statut : `W_OBSERVATOIRE_SANS_DECISION / V2_F_REFERENCE / AUCUN_DEPLOIEMENT`.**
