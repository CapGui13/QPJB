# M2 — Clôture de la recette autonome

Source testée : `4f3f999d3a45c21ae55d72248e93dda86ef8ce69`. Contrat #396, mission #398, PR #407 (brouillon). [Recette native](https://github.com/CapGui13/QPJB/actions/runs/45897139272), job 140173726579 : succès. Archive [15154700819](https://github.com/CapGui13/QPJB/actions/runs/45897139272/artifacts/15154700819) téléchargée, SHA-256 vérifié, JSON inspecté et chiffres concordants avec les logs. Copie durable des résultats : `recette-native.json`.

## Mesures avant/après

| Indicateur | Avant | Après |
|---|---:|---:|
| QCM contrôlés | — | 1915 |
| Options incorrectes contrôlées | — | 5745 |
| Remédiations ciblées | 140 | 3371 |
| Compléments non vides | 119 | 288 |
| Pistes de transfert | 140 | 3371 |
| Références distinctes de transfert | non mesuré | 2495 |
| Corrigés suffisants | — | 1797 |
| Abstentions prudentes | — | 524 |
| Cas à arbitrer | — | 53 |

## Tests natifs

- Node 22 : 108176 assertions sur 1915 QCM et 5745 options, intégrité des données/registres/transferts régénérés, zéro main invalide. Exécution du banc : 8601 ms (temps global, pas latence individuelle).
- Double DOM : 37 paires de scénarios, 296 contrôles.
- Chromium 156.0.8078.4 et WebKit 27.2 : chacun 148 scénarios, 3408 contrôles, largeur 360 et 1280, hors ligne, clavier et focus, absence de fuite avant validation, absence de débordement horizontal et d'erreurs de page.
- 115288 assertions/contrôles comptabilisés dans ces quatre bancs, sans compter séparément les vérifications du dossier des arbitrages. Ce ne sont pas 115288 tests indépendants.
- Dossier des arbitrages : 53/53 vérifiés ; 52 HOLD et 1 contraste restent au coordinateur, conformément au contrat. Repli canonique prudent, aucun nouvel accord inventé.

## Limites

Revue éditoriale IA, non humaine ; les 524 abstentions restent volontaires et la revue exhaustive humaine n'est pas revendiquée. Les 53 arbitrages ne sont pas résolus sur le fond ; ils sont transmis au coordinateur. Aucune preuve d'apprentissage humain ni intégration ou publication revendiquée. Certains historiques longs n'ont pas été relus intégralement, comme indiqué dans le README. Les modules de production historiques ne sont pas modifiés. Le coordinateur doit mettre à jour le manifeste, intégrer le delta M2 et refaire la recette intégrée.

MISSION DÉFINITIVEMENT TERMINÉE : OUI — périmètre autonome technique, livrables et recette native attestés ; arbitrages pédagogiques et intégration réservés au coordinateur.
