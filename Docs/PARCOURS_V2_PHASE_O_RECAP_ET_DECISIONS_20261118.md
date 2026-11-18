# QPJB V2 — Phase O : réparer la sémantique avant de modifier les tirages

**18 novembre 2026 · PR #214 · audit documentaire uniquement · aucun déploiement.**

## 1. Résultat observé par V2-N

Journaux de l'audit GitHub Actions **#44386868644**, job **#135093704466**, script `scripts/parcours-v2-observatoire-n.cjs`. Ces chiffres sont calculés avec **9 scénarios fictifs** (3 profils × 3 graines), **45 séances de 10 QCM** par scénario :

| Contrôle V2-F inchangé | Résultat |
|---|---:|
| Rubriques couvertes | **22/22 dans les 9 scénarios** |
| Familles QCM différentes | **440 à 450** pour 450 présentations |
| QCM rencontrés rattachés à au moins une des 15 fondations candidates | **43 à 54** |
| Fondations candidates ayant au moins un exemple rencontré | **12 à 14 / 15** |
| Rappels ciblés | **69 à 77** |

**Sous-couverture de la cartographie K+L :** l'exemple unique de `fondation:gambling` n'apparaît dans **aucun** des neuf scénarios, celui de `fondation:texas_minor_2sa` n'apparaît que dans **un** scénario, et `fondation:slam` est absent de **trois** scénarios. Ces absences ne démontrent pas un manque d'apprentissage : les premières présentations conventionnelles sont tardives, les QCM pertinents sont peu nombreux et ce sont des réponses synthétiques.

> ⚠️ La cartographie K+L présente un décalage de sens pour la fondation « contre adverse ». Elle ne doit pas être interprétée telle quelle pour mesurer une exposition à cette compétence.

## 2. Erreur d'interprétation détectée

La fondation candidate `fondation:intervention` est actuellement intitulée « Comprendre le contre adverse et ses conséquences », mais ses **13 QCM** répertoriés ont tous la rubrique `intervenir` et proposent à l'élève **d'intervenir sur l'ouverture adverse** : interventions naturelles, 1SA, Contre *de notre camp*, ou Passe. **Aucun** ne montre le répondant face à un Contre d'appel de l'adversaire.

Le contraste est substantiel au bridge :

- **Notre intervention après 1♥ adverse** : devons-nous intervenir, contrer ou passer ?
- **Le partenaire ouvre de 1♥ et l'adversaire contre** : faut-il soutenir, passer, annoncer 1SA, faire un Surcontre, ou utiliser une convention de soutien ?

Il ne s'agit pas de la même notion, même si les deux relèvent de situations compétitives.

## 3. Proposition réversible

Le fichier `Docs/PARCOURS_V2_PHASE_O_CONTRE_ADVERSE_AUDIT_20261118.json` sépare à titre **strictement candidat** :

1. **Choisir son intervention sur l'ouverture adverse** — les 13 QCM historiques de K+L, conservés intacts.
2. **Répondre après ouverture du partenaire suivie d'un Contre d'appel adverse** — 12 QCM existants des rubriques `apres_inter`, dont les séquences précisent toutes `Adversaire : Contre` et des réponses contrastées : Passe, Surcontre, 1♠, 1SA, 2♥, 2♠, 2SA.

Ces 12 cas correspondent à **12 familles indépendantes** dans le catalogue. Ils comprennent notamment `SEF-V470-001` à `SEF-V470-006`, plus des soutiens majeurs et des réponses constructives. **Aucune nouvelle donne ni réponse n'a été inventée.** Cela ne constitue pas une contre-expertise SEF 2024 : la sélection doit encore être relue par un enseignant.

Les fichiers `tests/quizz-v2-semantique-o.cjs` et `tests/quizz-v2-contre-o.cjs` vérifient les IDs, séquences, réponses originales, familles et le statut non actif. Le script `scripts/parcours-v2-contre-o.cjs` mesure, toujours avec **V2-F sans aucune injection**, combien de ces deux groupes apparaissent dans les mêmes neuf parcours fictifs. Il ne modifie ni les tirages ni les rappels.

## 4. Décisions pédagogiques

- **NE PAS renommer silencieusement** les 15 fondations historiques dans le graphe J ou dans l'interface avant revue.
- **NE PAS** assimiler les 13 exercices d'intervention aux 12 exercices après contre pour calculer un score ou un prérequis.
- **NE PAS** forcer 3SA gambling ou le Texas mineur après 2SA simplement parce qu'ils sont peu rencontrés ; d'abord vérifier le statut du système d'enchères enseigné et la disponibilité d'exercices indépendants.
- Conserver la rotation V2-F des ouvertures, réponses et rappels : elle couvre déjà toutes les 22 rubriques et introduit des exemples de manière variée.

**Statut : `V2_F_REFERENCE / AUDIT_CONTRE_ADVERSE_O_CANDIDAT / CORRECTIONS_CATALOGUE_AUCUNE / DEPLOIEMENT_AUCUN`.**
