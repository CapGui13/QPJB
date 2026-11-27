# M2 — Livraison autonome finale : cohérence interne

Contrats #419/#421. Base immuable `2d336054bc91fbd6ac762c093ecb5ec6da9f97e8`. PR brouillon #426 vers main. Aucun changement de production existante, aucun merge individuel.

## Version et preuve

- Algorithme d'ordre testé en recette native : `6bd6a8b66f97abbc9429988259eefb8d8f42fbea`. Run [45904459078](https://github.com/CapGui13/QPJB/actions/runs/45904459078), **21/21 jobs réussis** : 18 trajectoires appariées S180, unité Node 3986 assertions et reprise de consolidation, Chromium 156 et WebKit 27.2 (2071 assertions chacun). Les 18 ZIP sont identifiés par ID et SHA256 dans registre-final.json ; ils contiennent les 10 QCM réels de chaque séance, avant/après, fiches S1–5 lisibles et traces S1–180.
- Les 18 ZIP ont été téléchargés et contrôlés indépendamment sous Node 22.16.0 : **175141 assertions PASS**, 3240 séances par bras, 32400 QCM par bras. Aucun changement d'ensemble d'IDs, aucune modification du motif de sélection, aucune violation des gardes de permutation locale.
- Amendement explicatif `08b18fc1123c305d38fff5426cfb406d402c9425` : les vrais motifs français du moteur sont utilisés pour distinguer acquisition, application, rappel, consolidation, discrimination et réinvestissement conditionnel. Les étiquettes ne constituent pas une preuve de maîtrise ou de transfert. L'algorithme de permutation, le coût et les bornes restent inchangés. Comparaison réelle des deux versions en V8 sur 18 × S20 : les 360 ordres, métriques, motifs et états finaux sont strictement identiques. Tests de rôles permanents `57388b8f4465629bf1bbb20d114f92c0fca30507` : 3996 assertions V8 PASS, dont parité des 1915 motifs historiques. Pas de nouvelle recette native S180/Chromium/WebKit revendiquée sur le SHA de l'amendement explicatif.
- Le complément de rôles fourni avec les archives est reconstruit à partir des questions et motifs réels des deux bras ; il correspond au mapping du module corrigé, et ses décomptes S1–20 concordent avec le replay V8. Il ne remplace ni ne modifie les traces natives brutes. Comptage candidat S180 : acquisition 1410, application 11227, rappel 10045, consolidation ciblée 8168, discrimination 269, réinvestissement conditionnel 1281. Le compteur historique roleInversions de l'optimiseur utilise l'ancienne heuristique sur kind ; son zéro n'est PAS une preuve de qualité des rôles natifs. Les progrès mesurés sont ceux des prérequis, stades, difficultés, alternances et contrastes.

## Résultat apparié réellement obtenu

| Horizon | Séances | Ordres différents | Gains directs locaux | Sets modifiés | Hausses ponctuelles |
|---|---:|---:|---:|---:|---:|
| S5 | 90 | 86 | 85 | 0 | 0 |
| S20 | 360 | 347 | 309 | 0 | 0 |
| S65 | 1170 | 1130 | 993 | 0 | 21 |
| S153 | 2754 | 2675 | 2391 | 0 | 61 |
| S180 | 3240 | 3155 | 2840 | 0 | 79 |

Les 400 decks sans gain local sûr conservent leur ordre historique courant. Une différence d'ordre contre le témoin indépendant n'est pas nécessairement un gain direct M2. Chaque disposition est documentée dans registre-final.json (3240 unités, zéro unité omise, 79 événements détaillés avec valeurs du témoin et du deck historique courant). Toutes les métriques de composition suivies sont identiques aux 90 checkpoints : familles, premières expositions, maxGaps, histogrammes de difficulté, premières expositions thématiques, themeGaps, dette simplifiée des fondamentaux.

| Métrique | S5 avant→après | S20 avant→après | S65 avant→après | S180 avant→après |
|---|---:|---:|---:|---:|
| Inversions de prérequis | 96→1 | 428→3 | 1116→51 | 3268→316 |
| Inversions de stade | 8→0 | 18→0 | 37→0 | 128→0 |
| Inversions de difficulté | 7→0 | 9→0 | 14→2 | 87→10 |
| Sauts de difficulté ≥2 | 1→0 | 135→4 | 1454→400 | 5998→2164 |
| Contrastes manqués | 244→102 | 257→102 | 263→102 | 266→102 |
| ABAB réponse | 0→0 | 1→0 | 7→0 | 38→0 |
| ABAB thème | 0→0 | 0→0 | 0→0 | 4→1 |
| Réponse identique adjacente | 0→0 | 0→0 | 0→0 | 48→48 |
| Miroirs, miroirs proches, triples, familles adjacentes | 0→0 | 0→0 | 0→0 | 0→0 |

Aucune hausse ponctuelle de métrique protégée jusqu'à S20. À S180, tous les indicateurs protégés cumulés sont non dégradés pour chaque profil/graine. Sur les 90 points intermédiaires/finals, un seul présente une hausse cumulée : modere/47 S65 (difficultyInversions +1 à S52, mêmes IDs). Au total 79 hausses ponctuelles, toutes S21–180 : 58 sauts, 18 inversions de prérequis, 3 inversions de difficulté. Il s'agit de comparaisons longitudinales contre un témoin indépendant ; aucune permutation locale n'aggrave son propre historique. Les 79 événements ne sont ni ignorés ni réputés inexistants. Une nouvelle optimisation ne garantit pas leur suppression car le journal change le sel de l'ordre historique.

Latence P95 native à S180 par profil/graine : baseline 30–54 ms, candidat 30–52 ms, sur runners (pas une mesure mobile). Aucune preuve d'amélioration de l'apprentissage humain.

## Exemples et raccordement

Voir les fiches natives dans les 18 artefacts. La première séance illustre les différences de force sur même distribution (mineure/1SA et Passe/ouverture). S2 protège meilleure mineure, Passe et réponses naturelles avant fit ; la recherche contrainte place le fit simple avant le fit avancé. S3 rappelle 1SA avant 2SA. S4 rapproche les seuils de réponse à 1SA. S5 présente les réponses naturelles avant la redemande et conserve les contrastes Stayman/Texas lorsqu'une permutation admissible les rapproche. Les dispositions sont dépendantes du profil et de la composition réellement sélectionnée, pas un curriculum figé.

Appeler QPJBCoherenceM2.order(ctx) uniquement après l'ordre historique et avant la matérialisation d'une nouvelle séance, avec history en lecture seule et selected contenant les vrais kind/reason. Ne jamais repasser une séance active par M2. Le module reste pur et synchrone; l'annotation n'intervient pas dans le classement. Intégration dans le moteur, cache, stockage, site-version et publication réservés au coordinateur.

## HOLD et limites d'activation

L'évaluation historique reste sensible à l'ordre de réponse (record()). Sur la dernière campagne : entries, micros et axes identiques pour les 18 couples; 56 enregistrements skills différents, dont 15 niveaux différents (9 hausses, 6 baisses, 5 couples). Une note de rubrique ne doit pas dépendre artificiellement de l'ordre des questions. Cause et contre-exemple documentés dans REPRISE.md, alerte transmise à #419. Ne pas activer M2 sans arbitrage explicite du coordinateur et recette de préservation de l'évaluation.

Au dernier contrôle, les suites historiques smoke 45904418622 et laboratoire durable 45904418620 du SHA d'ordre sont en file; les 4 workflows d'intégration sont ignorés (non exécutés sur cette branche), et aucun visa de publication n'est revendiqué. Les résultats des suites d'anciennes versions ne sont pas assimilés à ceux du SHA courant. La campagne isolée 21/21 et le replay de l'amendement explicatif sont attestés, mais la recette intégrée finale ne l'est pas. Les modules M1/M3/M4 doivent résoudre les prérequis absents, la composition et les rappels non sélectionnés.

Livraison autonome M2 : code, banc, registre exhaustif, bilan, exemples, archives et PR brouillon livrés. Aucun merge ni activation. HOLD final = arbitrage et recette intégrée réservés au coordinateur; la clôture globale du contrat n'est pas attestée.