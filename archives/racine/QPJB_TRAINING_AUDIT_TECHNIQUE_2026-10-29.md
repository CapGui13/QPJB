# QPJB Training — audit technique hors pédagogie
Date : 29 octobre 2026. Inspection statique ciblée de `entrainement/training-app.js`, `index.html` intégrateur, CSS, `service-worker.js` et tests. **Aucune modification de l'application ni des données.**

## Défauts ou incohérences directement démontrables dans le code

1. **Compteur de tentatives et choix successifs** — `training-app.js`, `recordAnswer` → `persistResult`. `persistResult` ajoute une ligne d'historique et incrémente `attempts` pour **chaque sélection**, même en changeant de réponse dans une même visite. Or le commentaire indique « Une visite sur la fiche = une nouvelle tentative ». Distinguer explicitement *visite/tentative* et *sélection* avant toute modification du format sauvegardé (compatibilité `localStorage`). Tester choix faux → juste, décochage → nouveau choix et Refaire.
2. **Alerte d'échec de sauvegarde affichée tardivement** — `update()` place `storageWarning=true` en cas d'erreur `localStorage`, mais l'alerte `storageNotice()` n'est injectée que dans `render()`. Les réponses normales passent par `updateBiddingAnswer` ou `updateCardAnswer` **sans** `render()` : l'échec n'est donc pas immédiatement visible. Ajouter une mise à jour locale du bandeau d'avertissement et tester avec `localStorage.setItem` en échec forcé.
3. **Perte de focus sur changement de filtre** — `pageList()` utilise un `<select onchange="status=this.value;redrawList()">` ; `redrawList()` appelle `render()`, qui remplace tout le contenu de `#root` via `innerHTML`. Le `select` actif est détruit : la navigation clavier / lecteur d'écran perd le focus. Mettre à jour la liste seule ou restaurer le focus et la position de défilement.
4. **Demandes internes de navigation écartées pendant un fondu** — `trainingNavigate` fait `if(trainingPendingNav)return;` ; une deuxième action capturée avant l'acquittement n'est pas mémorisée. Le parent applique le fondu et possède un watchdog de 1500 ms. Tester doubles clics et clics rapides sur thème/exercice/Retour et préférer la dernière intention si la situation est reproduite.

## Risques et axes de qualité — pas de panne démontrée

5. **CSS difficile à maintenir** — `training-core.css` ~63 Ko, 221 occurrences de `!important` ; `training-integrated.css` ~30 Ko, 393 occurrences : **614 au total**, 49 blocs `@media` comptés. Les surcharges sont nombreuses. Simplifier **par composants et par passes avec captures / tests**, pas par suppression globale des `!important`. Tests de non-régression : iPhone court (375 × 667), iPhone 12, enchères 1 et 3 rangs, défense avec mains voisines, desktop.
6. **Chargement initial coûteux sur mobile** — `training-data.js` ~1,86 million de caractères pour 677 exercices (563 enchères, 114 carte). 30 images `data:image/...` y représentent ~841 000 caractères (45 %). Étudier le découpage/lazy-load et la mise en cache hors ligne, après mesure, en gardant **les exercices et les originaux intacts**. Attention à la robustesse offline/PWA.
7. **Accessibilité après navigation** — `trainingApplyPage()` appelle `render()` sans replacer le focus sur le titre ou le `main` ; seuls les boutons de réponse récupèrent explicitement le focus. Faire vérifier l'annonce de changement d'écran et les parcours clavier/VoiceOver. Le risque est étayé par la structure DOM mais pas testé avec un vrai lecteur d'écran.
8. **Couverture de test limitée** — GitHub Actions exécute Chromium + WebKit **simulés** et tests statiques ; les tests `training-browser.cjs` vérifient notamment la largeur, les 4 réponses et la hauteur d'un exercice à 3 lignes sur écran court, mais pas les dysfonctionnements de sauvegarde, le focus clavier/VoiceOver, les transitions ultra-rapides, le mode avion et Safari/PWA sur iPhone physique. Ajouter des scénarios ciblés avant de modifier ces zones.
9. **PWA hors ligne** — `service-worker.js` est réseau-d'abord avec cache de secours et sans précache explicite ; la première utilisation offline ou une mise à jour avec nouveaux paramètres de version pourrait ne pas avoir toutes les ressources. À tester concrètement, sans présenter cela comme une panne confirmée.

## Priorisation proposée
- **P1** : sauvegarde / avertissement (2), compteur tentatives et conservation de progression (1).
- **P2** : filtre et focus (3), clics pendant transitions (4), compléments de tests (8).
- **P3** : rationalisation CSS progressive (5), mesure de performance et chargement différé (6), accessibilité générale (7), PWA offline (9).

La relecture pédagogique et les trois QCM en quarantaine ne sont **pas concernés**. Aucun corrigé, identifiant, PDF, donnée, version ni fichier JS/CSS de production n'a été modifié par cet audit.
