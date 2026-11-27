# Reprise corrective M2 — 26 novembre 2026

Base figée 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Candidat correctif testé en V8 : ac33ebff7fcf473cb9194b4840385ce0a29857c6. PR brouillon #426.

## Code et preuve des six corrections

La fonction de coût historique excluait les alternances ABAB de son objectif strict : une permutation qui supprimait seulement ABAB ne pouvait être retenue. Le coût corrigé donne priorité à answerABAB, themeABAB et stageInversions (10000 par événement, en plus des poids historiques). Les autres bornes restent intactes : aucun indicateur HARD ou SOFT ne peut dépasser sa valeur dans le deck historique courant. Recherche élargie à 24 voisins puis deux mouvements quand un risque demeure; à S2, recherche contrainte bornée à 90000 préfixes, uniquement en cas d'inversion/ABAB résiduel. Aucun traitement ad hoc d'ID ni changement de sélection.

Les six contre-exemples issus de la recette 45902482555 sont maintenant des fixtures sur vrais IDs dans tests/coherence-concrete-m2-unit.cjs. Suite exacte exécutée en V8 sur le catalogue 1915 et les métadonnées figées : 2071 assertions PASS (pas de Node/Chromium/WebKit sur le nouveau SHA à cet instant). Les six défauts passent de 1 à 0, toutes les autres métriques locales non dégradées; S2 requiert seulement 22 préfixes dans les deux cas.

S2 faible/11 et modere/11 : le fit SEF-PN26-M1-005 (2♥, stade 0, N1) passe avant SEF-028-1 (2♠, stade 1, N2). Les deux ouvertures de meilleure mineure restent Q1–2, Passe Q4, réponse majeure et réponse SA avant les fits, fits séparés. Aucun changement de main/ID/bonne réponse.

## Rectification et audit exhaustif de la campagne précédente

La recette native précédente (45902482555, 21/21 jobs) avait six contre-exemples mis en évidence dans les bilans cumulés par profil, mais ils ne représentaient pas tous les événements ponctuels. Le nouveau test tests/coherence-concrete-m2-state-audit.cjs a été exécuté sous Node v22.16.0 sur les 18 archives précédemment téléchargées. Blob Git exact edefd86eb79da72f3070f11ce06defbc567a9b75. **175123 assertions PASS**; 3240 séances par bras, 0 modification d'ensemble d'IDs, 0 changement du motif de sélection par ID, 0 violation des gardes locaux.

Comparaison longitudinale contre le témoin indépendant : **106 hausses ponctuelles**, et non seulement six. Répartition : 70 largeJumps, 20 prereqOrderInversions, 8 stageInversions, 5 answerABAB, 1 themeABAB, 1 missedContrasts, 1 difficultyInversions. Elles peuvent coexister avec les gains cumulés; les 6 fixtures ne prouvent pas la disparition de ces 106 événements dans la nouvelle trajectoire. Les métriques agrégées de la campagne antérieure restent celles du README. Le runner corrigé émet chaque régression longitudinale individuelle, sans compensation ni filtre.

## Alerte préservation de l'évaluation (coordinateur)

Audit exact des états finaux de la campagne précédente : entries, micros et axes identiques pour les 18 couples; 53 enregistrements skills par rubrique diffèrent (compteurs ou niveaux), dont 18 différences de niveau : 10 baisses et 8 hausses, réparties sur 5 couples profil/graine. Les histogrammes de difficulté des QCM sont inchangés : ils ne doivent pas être confondus avec les niveaux de rubrique. Exemples : modere/103 majeur 2→1, second 1→2, roudi 4→3; cible/47 second 3→2, stayman 4→5. Aucune preuve humaine ou changement de note par QCM.

Cause dans quizz-parcours.js record() : le compteur skills est actualisé à chaque réponse. Avec level=2, clean=2 et deux réponses de même rubrique dans une séance (une autonome de difficulté ≥2, une erreur), succès puis erreur peut promouvoir à 3 avant remise à zéro de clean; erreur puis succès remet clean à zéro puis n'accumule qu'une preuve, le niveau reste 2. C'est une sensibilité intrinsèque à l'ordre dans le moteur historique. Le salt de logicalOrder utilise aussi les résultats du journal dans l'ordre des questions, ce qui explique des ordres historiques différents au fil des séances même si les IDs sont identiques.

HOLD intégration : ne pas confondre preuve individuelle et niveau de rubrique; le coordinateur doit arbitrer une évaluation indépendante de l'ordre ou une politique explicite de préservation de l'ordre de notation, et la compatibilité des sauvegardes. M2 ne modifie ni record/finish, ni le stockage, ni le moteur de maîtrise. Ne pas traiter cet effet comme un défaut de catalogue, ni masquer une baisse de niveau. Le banc d'audit vérifie les états séparément et n'impose pas de seuil abaissé.

## Recette du nouveau candidat

PR technique isolée #435, run 45903425019, checkout exact ac33ebff7fcf473cb9194b4840385ce0a29857c6 : 18 trajectoires appariées S180 + unité + Chromium/WebKit. Le run a été déclenché mais les jobs sont en file d'attente au moment de ce rapport; aucun succès natif revendiqué sur le nouveau SHA. La preuve V8 ciblée et l'audit Node des anciennes archives sont effectivement exécutés. Le précédent run 45902457800 (lab durable historique, ancien SHA) est 25/25 jobs réussi; ce n'est pas une recette du nouveau candidat raccordé.

Commande d'audit : node tests/coherence-concrete-m2-state-audit.cjs <dossier contenant les 18 JSON -S180.json> [summary.json]. Vérifie 18 couples, intégrité des traces, permutations, familles, motifs, raisons, gardes par deck, régressions par séance et écarts d'états. Le registre initial reste l'archive de la version précédente, pas une preuve de la version actuelle.

Aucune modification de production existante ni fusion. MISSION DÉFINITIVEMENT TERMINÉE : NON — nouvelle recette longitudinale native et arbitrage de l'évaluation encore ouverts.
