# M3-A — livraison autonome au coordinateur

Base figée : 71b0823235db1400eaf57c2552df35c18094f30a. Contrat #386, mission #389, PR mère #392. Attribution exclusivement par préfixe de concept de cartographie.json à ce SHA. Aucune modification du moteur partagé, du catalogue, des tests communs, ni fusion/publication.

## Bilan
442 QCM, 1 326 mauvaises options : 778 hypothèses historiques inchangées ; 548 unknown revus individuellement, dont 403 nouvelles hypothèses (282 confiance haute, 121 moyenne), 138 unknown ordinaires, un HOLD actif historique et six nouveaux HOLD proposés. Après intégration des seuls diagnostics : 1 181/1 326 (89,1 %), contre 778/1 326 (58,7 %), sans prétendre identifier le raisonnement de l'élève. Les 145 options restantes conservent le statut moteur unknown. Les patches ne sont pas inclus dans ces comptes.

| Préfixe | QCM | Revues | Hypothèses | Unknown ordinaires | HOLD |
| --- | ---: | ---: | ---: | ---: | ---: |
| ouv | 108 | 88 | 47 | 39 | 2 |
| sa1 | 134 | 150 | 117 | 33 | 0 |
| sa2 | 67 | 83 | 65 | 18 | 0 |
| sa | 6 | 12 | 6 | 6 | 0 |
| barrage | 76 | 127 | 92 | 33 | 2 |
| fortes | 51 | 88 | 76 | 9 | 3 |

## Livrables et intégration
- Les dix fichiers revue-*.json sont les pièces de travail avec main, séquence, contexte et corrigé, et non la source finale des dispositions.
- revue.json est la consolidation finale faisant autorité ; index par ID et enchère, signature du contenu, règle antérieure, justification, disposition.
- diagnostics.json contient uniquement les 403 hypothèses statiques, avec signature et règle précédente. Ne pas traiter la catégorie comme une preuve du raisonnement réel.
- integrer.cjs : adaptateur pur de référence. À transposer au moteur partagé par le coordinateur ; il ne remplace que des unknown compatibles avec la règle et le contenu figés, conserve les drapeaux et preuves de l'appel réel, ne modifie aucun objet, ne remplace ni correct, ni hypothesis historique, ni HOLD.
- patches.json : trois remplacements ciblés de Passe par 2♣ fort à 20–21 H réguliers (SEF-005-1, SEF-N021-2, SEF-N021-1). Propositions indépendantes, non appliquées ; préserver les choix non concernés. Quatre autres distracteurs faibles (1SA à 1 ou 3 H et une majeure sixième, SEF-V3-101-1/-2 et SEF-V3-102-2/-3) sont signalés mais laissés en place faute de remplacement démontré meilleur.
- hold.json : le HOLD actif et la réserve historique résolue conservés ; six options nouvelles en réserve, sur quatre IDs (SEF-L33-005, SEF-V3-105-3, SEF-V44-048, SEF-L14-013). Le dernier relève de la cohérence du Texas après 2♣–2♦–2SA, pas d'une révision de la bonne réponse. Les deux jugements historiques pertinents de revue-cycle3 sont maintenus unknown.
- bilan.json : résultats exacts par concept, catégorie, confiance et assertions.

## Recette
25 171 assertions passées : cartographie des 5 637 mauvaises options du dépôt reproduite, couverture exacte des 548, préservation de tous les résultats non concernés, réponses correctes assistées, signatures, absence de mutation, intégrité des trois propositions de patch et exclusion des HOLD. Exécution du corps exact de test.cjs dans V8 à partir des blobs GitHub réels, chargement CommonJS par adaptateur mémoire. Node v22.16.0 disponible mais checkout inaccessible (DNS github.com non résolu) ; commande native à lancer par le coordinateur : node audits/professeur-numerique-20261126/m3/parallel/a/test.cjs. Ni navigateur ni test UI intégré exécutés. Les contrôles automatisés vérifient l'intégrité, pas une validation externe de chaque jugement de bridge ; les décisions éditoriales et patches demeurent des propositions.

MISSION M3-A DÉFINITIVEMENT TERMINÉE : OUI — périmètre autonome seulement ; intégration et arbitrages restent au coordinateur.
