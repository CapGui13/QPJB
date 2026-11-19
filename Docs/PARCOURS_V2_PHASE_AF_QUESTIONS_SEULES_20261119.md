# QPJB — Phase AF : retour au parcours de QUESTIONS SEULES, Rubensohl sous contrôle de l'enseignante

**19 novembre 2026 · PR #214 · consigne pédagogique explicite de l'utilisatrice.**

## Décision de produit

- **Pas de leçons dans le programme pour l'instant.** L'enseignante explique les notions **à l'oral**, puis le parcours ne propose que des **questions** provenant du catalogue QPJB.
- **Rubensohl est très avancé.** Son apparition ne doit **pas** être déclenchée par le seul numéro de séance. Il est bloqué **par défaut**, jusqu'à une **confirmation positive de l'enseignante** indiquant que la convention a été enseignée. La réussite à des questions antérieures **ne déverrouille pas** le Rubensohl et ne constitue pas une validation automatique d'enseignement.
- Cette décision ne retire **aucune** des **1 523 questions** du catalogue : elle protège leur **éligibilité de sélection** dans le seul prototype V2-F. Les cinq questions d'ouverture initiales, les réponses aux ouvertures et les rappels continuent à utiliser le système existant.
- La feuille de route originale `quizz-parcours.js` introduit la rubrique Rubensohl à partir de l'index **34**, c'est-à-dire la **35e séance**. La préférence de difficulté V2-F n'est qu'un classement, et ne peut pas remplacer le choix de l'enseignante.

## Mise de côté des mini-leçons

Les expérimentations documentaires **AB à AE** (mini-leçons, reformulations et protocole d'observation) sont **ARCHIVÉES / HORS PÉRIMÈTRE ACTIF**. Aucun HTML de leçon, présentation de cours, repère de lecture ou questionnaire de reformulation n'est inséré dans la nouvelle expérience « questions seules ». Ces fichiers restent des archives expérimentales sur la branche de travail, sans intégration au Quiz SEF, sans nouveau bouton ou obligation d'en consulter le contenu. **Aucun essai avec des joueurs n'est demandé pour poursuivre la création du parcours de QCM.**

## Implémentation expérimentale AF

Le fichier `scripts/parcours-v2-questions-seules-af.cjs` constitue une **surcouche de test**, sans modification du moteur V2-F ni de la page publique :

1. `visibleQuestions(catalog,false)` conserve les objets originaux mais **exclut** ceux de la rubrique `rubensohl` et ceux qui **mentionnent explicitement « Rubensohl »** dans leur énoncé, séquence ou explication. Cela évite de masquer seulement l'étiquette alors que des exercices d'une autre rubrique demanderaient la convention.
2. `run(...,{teacherConfirmedBeforeSession:null})` est le **comportement de test par défaut** : aucun déverrouillage automatique, même tardivement.
3. Une **confirmation explicite** est représentée dans les scénarios synthétiques par `teacherConfirmedBeforeSession:N`. Le nombre N est **l'événement fictif de décision d'une enseignante**, pas un moment prescrit d'enseignement. Même après confirmation, le moteur respecte l'introduction originale de la rubrique ; il ne force pas l'apparition immédiate de la convention.
4. Les **10 questions d'origine par séance**, l'absence de famille répétée dans une même séance, les réponses aux ouvertures et les rappels ciblés restent des invariants à examiner et non des acquis supposés.
5. Lors d'un déverrouillage expérimental, le support des rappels est recalculé à partir des sources originales autorisées pour éviter de figer l'état de révision à la première séance.

**Attention** : aucune **interface de contrôle enseignante** n'est encore intégrée au site. La confirmation est pour l'instant un **paramètre de simulation**, pas un bouton utilisable en production. Il faudra définir puis tester l'interface plus tard, avec l'utilisatrice.

## Vérifications

- `tests/quizz-v2-questions-seules-af.cjs` : Rubensohl exclu sans confirmation (y compris mention dans la source), objets QCM et réponses inchangés, 10 questions par séance, absence de répétition de famille, déverrouillage fictif explicite seulement, zéro leçon.
- `.github/workflows/qpjb-v2-af-focused.yml` : comparaison **9 profils/graines × 45 séances** entre V2-F de référence, V2-F sans Rubensohl enseigné et un scénario **uniquement illustratif** de confirmation avant la séance 40.
- `.github/workflows/training-smoke.yml` : nouveau test AF inclus dans la suite générale.

Les statistiques simulées de diversité et de rappels servent à **détecter les effets secondaires** d'un verrou de convention, **pas** à estimer les chances de réussite d'un élève. Une baisse éventuelle de diversité doit être déclarée avant tout arbitrage et ne justifie pas une réintroduction automatique de Rubensohl.

## Limites

La décision confirmée porte explicitement sur **Rubensohl**. On ne déduit pas que **Michaels, Multi-Landy, chelem ou forcing** ont déjà été enseignés. Ils continuent pour l'instant à suivre la progression V2-F existante ; un éventuel contrôle enseignant pour d'autres notions devra être discuté séparément. Aucun élève réel ni séance d'enseignement n'ont été observés.

**Statut de départ : `AF_QUESTIONS_SEULES / RUBENSOHL_BLOQUE_PAR_DEFAUT / 0_LECON / AUCUNE_MODIFICATION_PRODUCTION / RESULTATS_CI_A_VERIFIER`.**
