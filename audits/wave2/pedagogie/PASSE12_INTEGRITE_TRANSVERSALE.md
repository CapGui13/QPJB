# QPJB — M1 / Passe 12 : contrôle transversal, complétude et bilan non définitif

**PASSE 12 FINIE (intégrité documentaire). MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## Inventaire croisé des résultats de P7 à P11
| Preuve | Attendu | Vérifié |
|---|---|---|
| P7 progression | 3 profils ; 92 IDs distincts ; 22 thèmes ; 36 exclusions historiques | PASS |
| P8 trois dossiers | Trois anciennes/nouvelles formulations intégrales, mêmes choix et réponses, statut À DISCUTER | PASS |
| P9 comparaison | 47 IDs remplaçant des cas P3 ; 15 prioritaires N4/N5 | PASS |
| P10 contre-expertise | Les 15 prioritaires issus de P9 ; 6 accords à confirmer ; 1 clarification Blackwood | PASS |
| P11 prérequis | Les 16 cas avancés existants ; 6 confirmations ; 1 clarification ; aucun système de maîtrise inféré | PASS |
| Barrière HOLD | Documents non déployables et aucune modification du catalogue | PASS |

Le fichier `BILAN_P12_INTEGRITE_HOLD.json` conserve les identifiants des **32 remplacements P9 qui n'ont pas été contre-lus individuellement en P10**, les statistiques et les portes non levées. Il ne les prétend pas erronés ; certains possèdent une métadonnée de revue antérieure. **47 remplacements – 15 contrôles ciblés = 32 encore à instruire dans la mission en cours.**

## Assurance de non-régression
- Catalogue : **1 523 QCM**, 22 rubriques, blob historique inchangé `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`.
- **36 propositions historiques** toujours exclues des parcours expérimentaux, non appliquées.
- Propositions nouvelles : **3 P8 + 1 P10 = 4 rédactions à discuter** ; aucune bonne réponse changée, 0 QCM appliqué.
- Les **6 accords conventionnels avancés** restent à confirmer ; même un parcours au niveau adapté ne démontre pas leur pertinence pédagogique.
- PR HOLD ; aucun raccordement au moteur, à l'UI, aux sauvegardes ou au pipeline GitHub.

## Exécution regroupée proposée
Nouveau `tests/wave2-pedagogie-suite.cjs` permettant de lancer **sept tests existants / nouveaux** : P5 garde-fou, P7 sélection, P8 corrections, P9 stress, P10 examen avancé, P11 prérequis et P12 cohérence. À exécuter en environnement Node via `node tests/wave2-pedagogie-suite.cjs`. La suite échoue à la première régression et ne remplace pas l'exécution CI. Les scripts de l'app et les workflows CI restent **hors périmètre**.

`tests/wave2-pedagogie-coherence.cjs` recoupe P7 à P11, teste des corruptions artificielles en mémoire et refuse un manifeste qui intégrerait un des 36 dossiers historiques. Un résultat PASS sous JS sandbox ne doit pas être confondu avec un succès CI.

## Pourquoi la mission demeure ouverte
- **G1** : Soumettre à validation humaine les trois clarifications P8, sans application.
- **G2** : Confirmer les six conventions avancées/variantes identifiées P10.
- **G3** : Arbitrer la clarification Blackwood P10.
- **G4** : Contre-lire individuellement les 32 remplacements de P9 non expertisés lors de P10.
- **G5** : Disposer d'une exécution Node indépendante (puis CI par coordinateur) des sept tests wave2-pedagogie-*.
- **G6** : Confronter l'ordre et les prérequis aux autres missions (#256 à #258), sans toucher à leurs fichiers.

**PROCHAINE PASSE : P13 — examiner les 32 remplacements restants (sans leur inventer d'erreurs), et sélectionner un sous-ensemble d'ambiguïtés concrètes pour contre-expertise avec source SEF ou accord local ; maintenir HOLD tant que les validations manquent.**
