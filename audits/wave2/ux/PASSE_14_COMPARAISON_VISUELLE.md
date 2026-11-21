# LONG M3 — PASSE 14 : preuve visuelle avant/après reproductible

Branche `wave2/experience-eleve-20261121` ; parent `2013bef367ef540193ffb9aaee1b3f5b56d667e4` ; base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.

## Dette ouverte
Les précédentes passes documentaient un gain de lisibilité mobile, mais il manquait un comparatif reproductible fondé sur **la même main et la même séquence**, avant/après, dans les deux moteurs de navigateur.

## Livraison
- `tests/wave2-ux-visual.cjs` récupère la **vraie version de base** avec `git show` (ou `git fetch --depth=1` du SHA demandé, en lecture seule) et refuse de continuer si elle n'est pas disponible.
- Les deux fichiers sont chargés dans le **même navigateur** avec `Math.random` stabilisé et des contextes vierges ; aucune sauvegarde élève n'est utilisée.
- Trois tailles de vue : **320×844**, **390×844** et **844×390 (paysage)**. Pour chaque taille, captures à trois phases : question, quatre propositions, corrigé, **avant et après** ; cela produit **18 images/moteur** et un manifeste JSON SHA-256 de chaque capture.
- Contrats obligatoires : bloc QCM strictement identique, main et séquence comparables, absence de débordement après, et **taille de la main mobile objectivement accrue** (≥18,5 px après).
- `tests/wave2-ux-runner.cjs` inclut maintenant les comparatifs Chromium et WebKit : **7 étapes** pour la recette complète ; échec explicite si une preuve manque.

## Preuves déjà vérifiées (sans prétendre à une capture)
Source JS du nouveau test et du runner syntaxiquement valide. Le commit de base GitHub contient bien la règle CSS de police **11 px sous 340 px**, tandis que la branche contient l'override mobile à 19 px. La condition de comparaison correspond à une amélioration testable ; les sorties images/manifeste ne sont **pas encore produites**.

## Conditions pour conclure
Lancer `node tests/wave2-ux-runner.cjs` dans un checkout de la branche disposant de Playwright 1.64.1 et de l'objet de base récupérable. Inspecter les comparatifs et corriger toute assertion en échec. Pour WebKit, l'environnement des workflows GitHub officiels reste nécessaire. Les workflows M5 ne sont pas touchés ici.

**PASSE 14 FINIE (recette de comparaison programmée). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P15 — ajouter une vérification de la sauvegarde non mutée pendant les captures, puis fournir le manifeste d’intégration à la CI.**
