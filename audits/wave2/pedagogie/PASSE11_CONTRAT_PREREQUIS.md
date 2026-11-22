# QPJB — M1 / Passe 11 : contrat de prérequis, validations d'accords, barrières de déploiement

**PASSE 11 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## Problème laissé ouvert par P7–P10
La progression avancée N3 → N4 → N5 contient 16 cas des phases 3/4, dont **6 cas demandent confirmation d'un accord précis** et **1 cas (Blackwood) a une clarification encore en HOLD**. La ROADMAP connaît le moment d'introduction des thèmes, mais **pas de preuve de compréhension individuelle**. Un futur raccordement ne doit ni inverser les préalables ni supposer la maîtrise.

## Contrat documentaire P11 (aucune règle appliquée)
Manifest `CONTRAT_PREREQUIS_P11_HOLD.json` : **16 entrées existantes** (8 thèmes avancés × 2 paliers), chacune porte :
- `id`, `theme`, `phase`, difficulté actuelle et cible ; zéro nouveau QCM.
- `earliestIntroSessionIndex` lu dans le moteur `ROADMAP` **en lecture seule** (indices : Roudi 22, Drury 24, fortes 26, forcing 28, Multi-Landy 32, Rubensohl 34, Michaels 36, chelem 39).
- `priorExposureIds` : IDs de **deux cas N3 préalables par rubrique** pour une phase 3, et de **ces deux cas + un cas N4** pour une phase 4. Ces éléments constituent une **séquence d'étude**, pas un diagnostic de réussite, et ne doivent pas être utilisés comme preuve de maîtrise.
- `requiresExplicitAgreement` pour les six accords non tranchés ; `requiresEditorialDecision` pour la proposition Blackwood ; statut final `HOLD` dans tous les cas.
- Le dernier Drury a niveau réel N4 malgré la cible N5 : un repli transparent, jamais maquillé en N5.

## Simulation du contrat, sans créer de données élèves
La fonction indépendante de test renvoie toujours `REVIEWABLE_HOLD_NOT_DEPLOYABLE` lorsque toutes les conditions sont réunies, jamais « publiez ». Les `seenIds`, `agreements` et `editorials` sont des ensembles *fictifs* injectés par le scénario, pas des données d'élèves.

| Scénario simulé | Hors calendrier | Exemples préalables non vus | Accord non confirmé | Éditorial HOLD | Revisables, toujours HOLD |
|---|---:|---:|---:|---:|---:|
| débutant_index0 | 16 | 0 | 0 | 0 | **0** |
| avancé_index39_sans_preexposition | 0 | 16 | 0 | 0 | **0** |
| avancé_index39_preexpositions_sans_validations | 0 | 0 | 6 | 1 | **9** |
| avancé_index39_preexpositions_et_validations_explicites | 0 | 0 | 0 | 0 | **16** |
| index24_preexpositions_et_validations | 12 | 0 | 0 | 0 | **4** |

**Résultat** : index 39 sans pré-exposition : 0/16 révisables ; avec exposition simulée mais sans arbitrage des accords : 9/16 ; avec tous les arbitrages fictivement positifs : 16/16 **révisables, toujours non déployables**. Dès index 24, seuls Roudi et Drury sont introduits : au mieux 4/16 révisables.

## Portes et responsabilités (contrat pour coordination #260)
1. **M1** propose séquences, IDs, risques et dossiers de validation. N'ajoute pas de logique de tirage, de stockage ou d'interface.
2. **Coordination** devra valider les conventions à 6 IDs et la clarification du Blackwood avant toute intégration, ainsi que l'adéquation pédagogique des transitions.
3. **Équipe moteur** est libre d'évaluer un contrat de recommandation compatible avec ses garanties ; n'utiliser ni `priorExposureIds` comme preuve de maîtrise ni indices ROADMAP comme équivalent de prérequis acquis.
4. **HOLD** : la simulation n'autorise jamais fusion/publication ni levée du brouillon.

Test `tests/wave2-pedagogie-prerequis.cjs` : vérifie la liste des seize cas, le lien avec la ROADMAP, les pré-expositions par thème, le repli Drury, les six accords et une clarification non validés, et exerce des contre-exemples fictifs.

**PROCHAINE PASSE : P12 — réaliser une revue de cohérence finale des livrables P7–P11, explorer les dérives possibles du référentiel et étayer l'état de clôture réel ; si des décisions pédagogiques restent ouvertes, mission NON terminée.**
