# M3 #422 — passage au coordinateur

Base figée `2d336054bc91fbd6ac762c093ecb5ec6da9f97e8`. PR brouillon #436. Aucun fichier historique ni production modifié.

## Politique de raccordement

**Ne pas appliquer de patch de métadonnée expérimental.** `patches()` ne contient que des HOLD et `applyExperimental()` est neutre par défaut. `rules(ctx)` est un avis pur : l'éligibilité native reste souveraine, et les champs transition ne donnent aucun crédit autonome. Le registre des 317 arcs et des 1 915 IDs est dans decision-register.json. La revue d'arc ne vaut pas visa individuel des 1 566 IDs seulement structurels.

## Décisions concrètes

| Sujet | Résultat et décision |
|---|---|
| Texas 1SA, prérequis conceptuel sur six mains de manche | 15/18→0/18 découvertes fortes, mais faible/103 : 43→38 preuves à S65. HOLD |
| Texas, maintien du stage historique | 195 séances identiques au candidat précédent (3 profils graine 103). HOLD |
| Texas, départage souple à égalité | 15→0 découvertes fortes, même trajectoire jusqu'à S20 que le premier candidat sur 15/18, dont faible/103. HOLD |
| Texas, même distribution/enchère/score | 15→3 découvertes fortes à S20 ; faible/103 : preuves S65 43→43 mais dette fondamentale S153 300→348. HOLD |
| Stayman 2SA en réponse | 1→0 premières réponses 2SA, mais 17/18 trajectoires modifiées ; les 17 S8 concernées contiennent déjà des réponses simples. Préférer un arbitrage d'ordre M2 sans retirer d'IDs, sous réserve de la sensibilité historique du score à l'ordre |
| 8 reclassements red.bicolore et 67 allègements de prérequis red.base | Aucun gain concret de composition démontré dans les bancs courts. HOLD |

## Priorités de raccordement (non obligatoires)

1. M1/M4 : si le moteur peut choisir un Texas élémentaire sans déplacer un rappel, l'avis M3 signale les IDs élémentaires du vivier. Ne pas mettre en production un départage candidat qui a échoué à un garde-fou.
2. M2 : dans une séance découverte des réponses Stayman contenant à la fois réponses élémentaires et 2SA, placer au moins une réponse simple avant 2SA, si les invariants d'ordre et de notation sont garantis. Le même principe s'applique à un Texas faible et fort déjà présents dans la même séance. Ne jamais modifier une séance active.
3. M6 : comparer toutes les 18 paires au SHA intégré sur S5/20/65/153/180, appliquer les seuils historiques inchangés, vérifier les écarts individuels de dette/preuve, familles, rappels, latence, reprise, navigateurs et publication. L'absence de verrou ne suffit pas à démontrer l'absence de régression.

## Reproduction

Voir README et les commandes CLI de tests/coherence-concrete-m3-*.cjs. Résultats effectivement rejoués sur V8 : 4 049 assertions (3 862 + 164 + 23), 91 920 évaluations de parité, zéro divergence sur les motifs testés. Les traces S180 de référence et du verrou initial sont complètes pour 18 paires ; le candidat même-distribution est testé à S180 sur six profils, graine 103 uniquement. Aucune recette Node CLI/Chromium/WebKit attestée dans cette branche. Les sélections d'IDs S6–65 sont archivées mais les justifications exactes du moteur ne sont pas toutes conservées après S20. Aucun visa d'activation, de fusion ou de publication.

**MISSION DÉFINITIVEMENT TERMINÉE : NON — recette native et intégrée non attestée ; aucun candidat de sélection validé sans régression ; revue individuelle exhaustive non revendiquée.**
