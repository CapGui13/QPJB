# M3-D — livraison autonome au coordinateur

Base figée : `71b0823235db1400eaf57c2552df35c18094f30a`. Branche `professeur-numerique/m3-d`. Contrat #386, mission #389, PR mère #392. Périmètre exclusif par préfixe de concept (et non par thème apparent de l'enchère) : chelem, michaels, multilandy, rubensohl.

## Sources et démarche

Cartographie mère au SHA de base, catalogue embarqué réel (blob 99049d0d5790767ba991414240aa7d837c1b188e), diagnostic UMD et travaux M3 existants. Contrats et références #293, #366–369, #375, #377–381, #385, #386, #389, #392 ; cohérence intégrale #342, #349, #356 et arbitrages #271 (commentaire de clôture : 53/53) et #364 (35 réserves arbitrées), registre `audits/coherence-integrale-20261125/integration/arbitrages-finaux.json` au SHA figé. Les accords locaux validés priment ; la négation de la Dame au palier contraint reste distincte d'un code positif non étudié. Aucun nouvel accord n'est déduit.

Objectif : revoir les 563 mauvaises options initialement unknown, sans quota de promotion, une justification par couple ID/enchère, examiner les confusions force/distribution/fit/priorité/niveau/forcing/convention/contexte et le jugement compétitif. Les 10 fichiers revue-*.json contiennent chaque option, sa disposition et les données de la main, séquence, contexte et réponse attendue. Les justifications sont des pistes à partir de la décision, pas des affirmations sur la pensée de l'élève. Les hypothèses proposées sont de confiance medium ; les inconnues restent low. Pas de généralisation du jugement compétitif, des accords de paire ni des plans de chelem propres aux exercices.

## Bilan chiffré exhaustif

| Famille | QCM | Hypothèses antérieures conservées | Unknown initial | Hypothèses nouvelles | Unknown simple | Faible | HOLD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chelem | 109 | 169 | 158 | 148 | 8 | 2 | 0 |
| Michaëls | 85 | 81 | 174 | 148 | 17 | 5 | 4 |
| Multi-Landy | 39 | 20 | 97 | 83 | 12 | 0 | 2 |
| Rubensohl | 62 | 52 | 134 | 130 | 4 | 0 | 0 |
| Total | 295 | 322 | 563 | 509 | 41 | 7 | 6 |

Les 563/563 options sont revues, 509 nouvelles hypothèses proposées et 54 maintiens en unknown (41 causes insuffisamment isolées, 7 distracteurs faibles, 6 HOLD). Couverture du lot avant : 322/885 (36,4 %), après raccordement candidat sans patch : 831/885 (93,9 %). Ce sont des couvertures de diagnostic possible, non des mesures de maîtrise, de réussite ou de validité psychométrique. Les 322 hypothèses antérieures du périmètre et les trois HOLD actifs du moteur mère restent strictement inchangés.

Catégories des 509 propositions : convention 130, priorité 88, distribution 77, niveau 62, fit 49, force 47, contexte 43, forcing 13. Le jugement de compétition non isolable reste unknown/HOLD plutôt que d'imposer une catégorie. Pas de promotion automatique à partir de l'existence d'un contraste.

## Fichiers et raccordement

- `diagnostics.json` : table par ID, signature identique au moteur mère, concept et entrées par enchère. 509 hypothèses, sans les inconnues ni les HOLD.
- `integration.cjs` : démonstrateur d'adaptation à diagnose() existant, non chargé en production. La proposition ne s'applique que si le moteur mère renvoie unknown avec règle ambiguous ou canonical-ambiguous-contrast, si l'ID/concept/signature concordent et si le choix est effectivement offert. Aucun écrasement de diagnostic préexistant, pas de diagnostic libre extrapolé à un autre choix. Les flags d'aide viennent de la décision effectivement transmise ; une réponse assistée ne prouve aucune maîtrise. Le coordinateur peut intégrer la table dans la fabrique UMD, en gardant ces mêmes gardes.
- `hold.json` : six arbitrages éditoriaux à soumettre au coordinateur, sans changement de réponse, corrigé ni score. V2-M5-024/Passe ; SEF-V479-008/2♥ ; SEF-V478-001/Passe ; SEF-V478-004/Passe ; SEF-Q26-M5-008/Passe ; V2-M5-040/Passe.
- `patches.json` : une proposition de remplacement ciblé, SEF-V479-013 : 3♦ → 3♠. Après le passe-ou-corrige, deux distracteurs mineurs répétaient la même confusion ; le saut dans la vraie majeure permet de distinguer niveau et convention. Ancienne/nouvelle liste exacte, bonne réponse Passe inchangée, diagnostics des trois options après proposition. Ne pas appliquer sans arbitrage coordinateur, et remplacer seulement l'entrée correspondante dans la table si accepté.
- Les sept distracteurs faibles (dans les revues Michaëls réponses et Blackwood suites) restent unknown. Les remplacer mécaniquement par une surenchère compétitive possiblement défendable ou un code non documenté serait une dégradation : aucune substitution sûre démontrée pour ces sept cas.
- `test.cjs`, `test-results.json` : recette isolée et résultats réels.

## Validation réelle

Exécution du code exact du test local avec injections des fichiers Git réels dans V8, sans accès à un checkout Node natif : **27 797 assertions PASS**, 563/563 options vérifiées, 509 promotions, 54 unknown conservées, 5 128 autres mauvaises options du catalogue identiques au diagnostic mère (dont celles hors lot), 1 879 bonnes réponses inchangées, 5 637 réponses libres invalides/incomplètes conservées, 509 gardes de signature et 509 gardes choix offert, flags, non-mutation, légalité du patch et protection des trois HOLD historiques. Temps observé : 1 296 ms pour le parcours complet du test (indication de banc V8, pas benchmark navigateur). Le runChecks exact du test partagé M3-diagnostic au SHA figé est également passé, injecté en mémoire : 5 637 mauvaises options, 2 985 hypothèses/2 652 unknown avant M3-D ; parité UMD CommonJS/window sur 7 516 appels. Les autres tests partagés ont été lus ; leurs snapshots ne sont pas recalculés ni écrasés par M3-D. Node natif, CI et navigateur réel non exécutés. Rejouer depuis le checkout de cette branche avec `node audits/professeur-numerique-20261126/m3/parallel/d/test.cjs`. Les tests mécaniques ne certifient pas un apprentissage humain ni une revue éditoriale indépendante.

## Clôture

Aucun fichier partagé, aucune main, bonne enchère, explication canonique, métadonnée, score, moteur de production ou cartographie mère modifiés. Seuls des fichiers ajoutés sous le répertoire M3-D. Aucune PR concurrente, fusion, publication. Vérification diff et SHA transmis à la PR mère. L'intégration et l'arbitrage des HOLD demeurent au coordinateur.

MISSION M3-D DÉFINITIVEMENT TERMINÉE : OUI (périmètre autonome).
