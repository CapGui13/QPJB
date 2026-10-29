# QPJB Training — audit des exercices libres, lot 1

Date : 29 octobre 2026. Source du dépôt : `CapGui13/QPJB`, branche `main`.
Ce rapport décrit une **relecture ciblée**, pas une validation automatique de tous les exercices.

## Méthode
- Relire les champs `questionText` et `answerText` des entrées `D.play` dans `entrainement/training-data.js`, sans imprimer les images encodées.
- Comparer aux deux pages PDF **exercice et solution** des originaux archivés dans `/QPJB Training/Archives/BM_originaux_2026-10-23.zip`.
- Lire le diagramme complet de la page 2 des solutions, rechercher une erreur manifeste dans le plan de jeu et relever les nuances pédagogiques. Les cartes des défenseurs sont révélées dans les solutions, pas dans les énoncés.
- Aucun champ de données ni PDF original modifié.

## Résultats de la première passe

| Identifiant | Original | Vérifications et conclusion | Statut |
| --- | --- | --- | --- |
| `JC-001` | `3 BRIDGE&MOIS_DEBUTANT EXERCICE_7-02.pdf` / `3 BRIDGE&MOIS_DEBUTANT SOLUTION_7-02.pdf`, page 2 | 6SA, entame Dame de Cœur, 11 levées immédiates ; nécessité d'une 12e levée à ♠ ou ♣. Les explications et diagrammes concordent avec le PDF ; raison de commencer par l'impasse indirecte à ♠ cohérente avec la possibilité de se rabattre sur ♣ après échec en Est. Pas d'erreur nouvelle établie. | Relecture initiale effectuée ; pas de changement de `reviewStatus`. |
| `JC-002` | `6 BRIDGE&MOIS_DEBUTANT EXERCICE.pdf` / `6 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf`, page 2 | 3SA, huit levées immédiates. Le choix de l'affranchissement de ♣ plutôt que la double impasse à ♠ est conforme à la source et cohérent dans le contexte. **Réserve de formulation** : la source parle d'une solution à « 100% » puis précise elle-même qu'une contre-attaque à ♠ peut la faire échouer ; ne pas présenter ce chiffre comme une garantie absolue. Texte actuel conforme au PDF, aucune réécriture. | Relecture initiale effectuée ; réserve à réexaminer avant éventuelle simplification pédagogique. |
| `JC-003` | `10 BRIDGE&MOIS_DEBUTANT EXERCICE.pdf` / `10 BRIDGE&MOIS_DEBUTANT SOLUTION.pdf`, page 2 | 4♥, entame Roi de Pique. Le traitement de ♥ par impasse contre V puis R, la coupe du 3e tour de ♠ au mort et la défausse du dernier ♠ de Sud sur ♦ avant de rendre la main à ♣ concordent avec la source. Aucun défaut manifeste décelé dans la ligne décrite. | Relecture initiale effectuée ; pas de changement de `reviewStatus`. |

## Limites et suite
- Cette relecture compare les textes et diagrammes sources et vérifie la cohérence de la ligne décrite ; **elle ne prouve pas la validité mathématique de toutes les répartitions** ni la meilleure ligne en double-dummy.
- Avant toute modification de statut ou réécriture, documenter le cas précis et sa démonstration. Pour `JC-002`, le « 100% » est une réserve de **présentation**, pas un verdict de mauvaise réponse.
- Continuer par `JC-004`, `JC-005`, `JC-006`, dans un nouveau petit lot.
- Les **114 exercices conservés, 111 accessibles et 3 en quarantaine** restent inchangés. Le présent lot est une note d'audit documentaire ; les 22 éléments marqués `a_relire` n'ont pas été modifiés.

## Conservation
Aucun changement à `entrainement/training-data.js`, aux identifiants, aux PDF, aux réponses, au stockage des progressions ou à l'application en ligne. 
