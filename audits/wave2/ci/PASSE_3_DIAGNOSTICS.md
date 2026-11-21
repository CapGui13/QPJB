# M5 — PASSE 3 : contre-épreuve des diagnostics, résultat du premier CI

Source: [Training smoke 44944243351](https://github.com/CapGui13/QPJB/actions/runs/44944243351), commit initial `f0dbd69733172e68afc8f318e07d4e0ecd3d588a`, tentative 1, 21 novembre 2026, conclusion **success**.

- 4 jobs obligatoires au vert : audit rapide **12 s**, Chromium **256 s**, WebKit **290 s**, simulations longues **227 s** ; intervalle du premier démarrage au dernier achèvement **291 s** (20:03:48–20:08:39 UTC).
- Lot07 : **51 contrôles** sur Chromium, **51** sur WebKit ; 3 entames × téléphone/bureau dans chaque navigateur, sans échec. Les 58 commandes CLI historiques sont toujours exécutées (garde-fou dans l'audit). La réussite observée est **une exécution**, pas une preuve statistique de non-flakiness.
- Résultat P1/P2 : hypothèse de remplacement d'iframe encore non confirmée ; l'essai ne l'a pas reproduite. Des captures PNG du lot 07 existent dans les deux artefacts navigateur.

## Problème résiduel concret

Le handler P2 ne produisait capture et état que si `hand.waitFor` échouait ; une assertion de contenu, un changement de page ou un échec après révélation ne produisait pas le même diagnostic. De plus, `page.frames().find` pouvait retrouver un cadre sans établir qu'il était encore celui de `#training-frame`.

## Correction et tests P3

- Utiliser `elementHandle().contentFrame()` du véritable `#training-frame` pour lier toutes les vérifications au cadre concerné.
- Au moindre échec du test, enregistrer `*-failure.json` (étape, URLs, événements de navigation/détachement, état applicatif, erreurs JavaScript) et `*-failure.png`, en préservant l'erreur initiale.
- Ajouter une sonde **négative contrôlée**, WebKit et Chromium, qui injecte un échec *après vérification du rendu réel*, exige code de sortie 1 et prouve la présence et la cohérence de JSON+PNG. Aucun skip ni allongement arbitraire des délais de la recette normale.
- Préserver les assertions catalogue 638+188, les trois entames, et tous les contrôles historiques.

**Validation attendue après ce commit :** workflow Actions complet, puis vérification des deux sondes et des deux validations navigateur. Sans ce retour, ne pas déclarer cette nouvelle instrumentation validée.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.** **PROCHAINE PASSE 4 :** plusieurs cycles complets comparables, durée et taux d'échec, régression de la couverture.
