# M5 — PASSE 5 : performance, coût et diagnostics des écarts

## Jeu de mesures, source et méthode

Sources : jobs de GitHub Actions des runs réels (`/actions/runs/<id>/jobs`), représentés dans `observed-performance.json`. Fenêtre totale = premier `started_at` au dernier `completed_at`, **sans attente de file d'exécution**. Temps cumulé = somme des durées des jobs (approximation de consommation de runners, **pas** une facture GitHub Actions). Cohortes : six runs antérieurs comparables avec simulations longues dans `integrity` et trois postérieurs avec 4 jobs indépendants ; les contenus des révisions ont varié, donc causalité limitée.

Avant : 44904840413 (655 s), 44901166434 (576 s), 44932359285 (583 s), 44907083903 (544 s), 44898084583 (626 s), 44895310983 (566 s). **Médiane 579,5 s** et **812,5 s cumulés** par run.

Après : 44935166484 (280 s), 44944243351 (291 s), 44949454425 (379 s). **Médiane 291 s** et **785 s cumulés**. Gain médian mur : **49,8 %** ; gain approximatif en temps cumulé : **3,4 %**.

**Variabilité à suivre :** simulations longues 223, 227, puis **379 s** sur le run 44949454425, alors que les tests se sont tous terminés avec succès. Distinguer ralentissement de runner et régression : pas de conclusion sans répétition. Le contrôle émet un avertissement au-dessus de 1,5× la médiane observée (379 > 340,5), sans masquer l'échec d'un vrai test ni bloquer un déploiement sur un seul ralentissement.

## Instrument de mesure

`tests/wave2-ci-performance.cjs` : calcul reproductible depuis l'échantillon daté ; rejette jeu de jobs incomplet, ID de run dupliqué ou chronologie impossible (trois contre-exemples intégrés). Avertit, sans échouer, si le gain médian tombe sous **25 %**, si le temps cumulé augmente ou si la simulation longue dépasse **1,5×** sa médiane. La source est un **instantané historique**, pas une sonde GitHub temps réel ; actualisation explicitement nécessaire au prochain audit.

Le contrôle rapide ajoute cette analyse à la suite des 58 commandes historiques, sans en déplacer ni en supprimer une. Les deux sondes navigateurs P4 restent nécessaires. Pas d'optimisation additionnelle de parallélisation : le chemin critique est le maximum des jobs et la période observée ne prouve pas qu'un fractionnement plus coûteux de WebKit/du parcours serait bénéfique.

## Contrôle des autres workflows

Leur déclenchement est pour la plupart limité aux chemins concernés. Les recettes V2 HOLD, registre V1, originaux et intégration V1/V2 sont spécialisées ; l'équivalence avec Training smoke n'est pas démontrée, donc **aucune suppression**. Le workflow Pages reçoit tous les fins de Training smoke, mais ses jobs de publication restent sautés sur PR ; le run Pages 44943188024 après une validation `main` était réussi, tandis que des runs Pages issus de PR sont sautés.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE 6 :** vérifier expérimentalement la logique du verrou Pages et le rollback dans un dépôt Git temporaire, sans déployer.
