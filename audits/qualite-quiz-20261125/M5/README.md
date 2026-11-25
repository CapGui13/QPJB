# M5 — qualité Quiz — lot compétitif

Base : `4bb2df19929f921aff81468be22830445d4f87b0` ; catalogue blob `55633e60ad6e8583616ad11b1da3acf1da013844` ; prérequis blob `9071d5ab03115c9967fb3c54ee819f91a1cec84e`. Mission #311, contrat #306, progression #293, registre #271. Branche `qualite-quiz/m5-competitives`. Aucun fichier de production modifié.

## Bilan

- 251/251 anciens QCM examinés sur main, enchères, choix, réponse, corrigé, contexte, difficulté et prérequis ; 158 conservés côté catalogue, 90 corrigés, 3 réserves (voir ci-dessous). 10 nouveaux QCM livrés, soit 261 QCM du périmètre après application par le pilote. Les 251 IDs historiques sont intacts.
- 0 réponse modifiée ; 2 mains ajustées pour cohérence attestée (L26-006 : HLD hors zone, L43-003 : contrôle Trèfle incohérent), 1 jeu de choix ajusté (V3-090-2). Toutes les anciennes valeurs figurent dans le patch.
- Les 86 corrections prévues ont été complétées par 4 motifs de difficulté hérités d'une ouverture sur des réponses au deux faible et par les corrections réellement nécessaires. Voir le compte exact ci-dessus ; aucune réécriture pour allonger un texte satisfaisant.
- 18 propositions de prérequis par ID dans review.json, dont contrôle fitté et 3SA gambling cross-lots. Elles sont distinctes du patch catalogue et doivent être appliquées par le pilote dans la source de prérequis, après vérification du calendrier et des dépendances. Aucun moteur modifié.
- 6 lacunes retenues, 10 QCM livrés, toutes quantités atteintes. Deux concepts à deux familles passent chacun à quatre familles ; les autres apports ciblent les critères d'exclusion du barrage, sa prolongation, le 2SA bicolore concurrentiel, et la redemande minimum après Spoutnik.
- 3 réserves : L13-010 et L13-012 sont déjà HOLD dans #271 ; L28-007 utilise le même seuil 7 HL que L13-010. Ne pas rouvrir ces arbitrages, modifier les bonnes enchères ou généraliser ces règles. Le contrat #306 dit « 53 soldés », mais le registre #271 lu intégralement précise 24 complets, 7 partiels et 22 HOLD : la réserve est respectée. Le Landyk de L05-014 est un cadre explicite du cas, repris comme tel, non une norme nouvelle.

## Format et application

`plan.json` : inventaire initial, quantités et justification des non-ajouts. `review.json` : tableau compact, une décision par ID ; les propositions `prerequisProposal` sont séparées des corrections catalogue. `patch.json` : tableau d'entrées `{id,old,new,reason,source}` ; `old:null` signale un nouveau QCM complet dans `new`, avec `prerequis` à côté. Le pilote attribue les IDs définitifs, conserve les autres champs historiques et applique par égalité exacte des anciennes valeurs. Les nouveaux QCM ont des familles propres, sans nouvelle rubrique. Ne pas écraser les autres métadonnées historiques.

## Contrôles ciblés réellement exécutés

Chargement et parsing JSON des blobs figés ; filtre 251 QCM ; 251 décisions uniques ; correspondance exact des champs old contre la base ; quatre choix distincts contenant la réponse, légalité des paliers des choix de couleur/SA, 13 cartes, valeurs H, forme et rangs, IDs/familles uniques pour les nouveaux QCM, absence de doublon exact main triée + séquence pour ajouts et mains corrigées ; réponses/IDs/thèmes historiques préservés ; métadonnées nouveaux IDs et propositions existantes avec concepts connus et planchers non diminués. Résultat : zéro erreur dans les contrôles ciblés exécutés lors de la construction. Aucun test navigateur ou FULL lancé (réservé au pilote), aucun prétendu contrôle d'une version intégrée. La vérification du graphe global et des contraintes éditoriales à l'intégration demeure nécessaire.

## Sources et limite

Audits archivés V473 (soutiens ; références FFB et formation des moniteurs), V477 (Michaël précisé), V478 (compétition), revue SEF barrages 38 du 02/11 ; cas comparables nommés dans chaque entrée. Le texte intégral du livre SEF 2024 n'est pas disponible dans les sources consultées : aucune citation directe inventée. La décision sur les variantes HOLD reste au pilote. Les précisions de vulnérabilité des cas à barrage/surenchère sont des cadrages pédagogiques explicites, pas des règles universelles de levées totales. Les corrigés déjà satisfaisants sont préservés ; le niveau n'est pas modifié sans motif avéré.

Aucune fusion, publication, modification du catalogue, du moteur ou des workflows par M5.
