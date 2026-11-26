# M3-C — livraison autonome au coordinateur

Contrat #386 ; mission mère #389 ; PR mère #392. Base d'attribution **71b0823235db1400eaf57c2552df35c18094f30a** ; blob catalogue **99049d0d5790767ba991414240aa7d837c1b188e**. Branche `professeur-numerique/m3-c`. Aucun changement des fichiers communs ; aucune fusion, publication ou PR concurrente.

## Méthode et bilan définitif

Objectif fixé : examiner les 546 options unknown des 396 QCM attribués, une justification par ID et enchère, conserver les 642 hypothèses antérieures, aucun changement hors périmètre, pas de quota de diagnostics ou de patches. Les 10 fichiers revue contiennent chacun les décisions nominatives, les faits de main et de séquence, la bonne enchère et le corrigé figé. 254 fiches comportaient au moins un unknown ; les 142 autres étaient déjà couvertes. La cartographie d'attribution n'a pas été modifiée.

| Famille | QCM | Unknown au départ | Hypothèses supplémentaires | Restent unknown |
|---|---:|---:|---:|---:|
| red | 143 | 144 | 131 | 13 |
| second | 128 | 223 | 208 | 15 |
| forcing | 77 | 134 | 118 | 16 |
| roudi | 48 | 45 | 45 | 0 |
| Total | 396 | 546 | 502 | 44 |

502 hypothèses (toutes confidence medium), 28 unknown de fond, 15 distracteurs faibles, 1 HOLD éditorial nouveau. Couverture potentielle du lot : 642/1188 (54,0 %) → 1144/1188 (96,3 %). Ce chiffre est une couverture de propositions de diagnostic, pas une mesure de la justesse des raisonnements réels des élèves. Aucun résultat de QCM, barème ou maîtrise n'est modifié. Les choix faibles et les jugements possibles ne sont pas classés artificiellement. Les diagnostics antérieurs, même à confiance faible, sont conservés sans changement.

Catégories des 502 hypothèses : force 155, distribution 84, priorité 99, fit 99, contexte 17, forcing 16, niveau 11, convention 21. Le détail des 16 concepts est dans mesures.json.

## Fichiers et intégration

- `revue-*.json` : 546 lignes (ID + choice + concept + disposition + category + reason + confidence + evidence), y compris les refus d'attribution.
- `diagnostics.json` : manifeste de ces dix fichiers ; ne pas dupliquer leurs données.
- `signatures.json` : signatures figées des 254 fiches ayant au moins un unknown, compatibles avec la fonction signature du moteur mère.
- `overlay.cjs` : adaptateur CommonJS isolé exportant createOverlay(base,docs,signed). Le coordinateur peut aplatir l'index dans l'UMD mère ; reprendre exactement les gardes. Appliquer seulement si le diagnostic mère est unknown pour une ambiguïté reconnue, le choix était offert et le concept et la signature sont identiques. Les réponses libres qui correspondent à un choix offert suivent le même chemin ; les réponses libres hors choix restent au moteur mère. Les drapeaux assisted et hadFreeError sont conservés et ne démontrent ni maîtrise ni intention. Pas de connexion à l'UI.
- `hold.json` : 28 refus motivés, 15 choix faibles, un nouveau HOLD sur SEF-V417-008/3♠ (réserve historique sur une exploration de chelem), un HOLD antérieur résolu conservé, alertes au coordinateur sur les indices éditoriaux et les trois Passe en redemande libre précédemment signalés.
- `patches.json` : 1 proposition non appliquée, SEF-V411-019, remplacement 4♥ par 2♠ pour distinguer l'excès de force du choix de couleur malgré le fit. Bonne réponse Passe, trois autres choix uniques et licites ; aucun diagnostic antérieur supprimé. Ne pas traiter la nouvelle option comme déjà intégrée. Les fuites de réponse demandent un arbitrage éditorial plutôt qu'un remplacement improvisé.
- `test.cjs` et `mesures.json` : recette reproductible et résultats réels.

Pour l'intégration : lire d'abord HOLD et patches, puis intégrer les 502 entrées seulement après les gardes de la branche mère. La revue d'une mauvaise option ne prouve pas l'erreur mentale qui l'a produite. Les choix de jugement et les conventions insuffisamment documentées restent sans attribution. Ne pas modifier le moteur de production ni les anciens IDs pour appliquer cette livraison isolée.

## Références historiques prises en compte

Issues #293, #366–369, #375, #377–381, #385, #386, #389 ; PR #392 ; cartographie, moteur diagnostic, revue-cycle3, patches, hold et mesures de la base figée ; catalogue réel (main, h, distribution, séquence, contexte, bonne réponse, corrigé et métadonnées historiques). Référentiel QPJB SEF, contre-expertises V471/V480, revue Roudi 33 du 02/11, revue fortes/forcing du 02/11, correctifs Drury/Roudi/fortes/forcing, revue 28 V454, revues 40 et 58 redemandes V456/V457, revue 79 secondes enchères V460 et arbitrages du 05/11. Les tableaux historiques longs ont été consultés par extraits pertinents et les métadonnées/corrigés actifs sont la référence, notamment après révision Walsh. Ne pas prétendre avoir consulté le livre SEF intégral.

## Recette exécutée et limites

Le test a réellement été exécuté en V8 avec les sources exactes du moteur mère, de l'adaptateur et du test, et le catalogue/les revues récupérés de GitHub (émulation CommonJS). PASS : 5637 mauvaises options et 1879 bonnes réponses comparées, 2985 diagnostics antérieurs strictement identiques, 502 changements attendus, 44 unknown conservés, 0 changement hors périmètre, 2061 contrôles complémentaires, 1 patch vérifié (proposition seulement), non-mutation des entrées. Benchmark indicatif : 37580 appels, 2287 ms dans cet environnement. Pas de validation humaine empirique des hypothèses.

Commande à rejouer dans un checkout de la branche : `node audits/professeur-numerique-20261126/m3/parallel/c/test.cjs`. Le terminal de cette instance ne résout pas github.com ; clone/Node natif du dépôt, CI, Chromium, WebKit et recette intégrée non exécutés. Ce n'est pas une validation de publication. Les tests de l'adaptateur n'ont pas la prétention de certifier la validité pédagogique universelle de chaque enchère.

**MISSION M3-C DÉFINITIVEMENT TERMINÉE : OUI** — périmètre autonome, intégration et arbitrages au coordinateur.
