# QPJB Training — point de reprise léger

Dernière vérification : 29 octobre 2026. Ce fichier sert de mémoire de travail entre conversations ChatGPT afin d'éviter les erreurs `conversation_too_large`. **Il ne fait pas partie de l'interface de l'application.**

## Dépôt et code de référence

- Dépôt : `CapGui13/QPJB`, branche `main` ; site : https://capgui13.github.io/QPJB/
- Application QPJB intégratrice : `index.html`.
- Module d'entraînement : `entrainement/index.html` (page HTML légère) ; `entrainement/training-style.css` (styles) ; `entrainement/training-app.js` (logique) ; `entrainement/training-data.js` (données des exercices, très volumineux, à préserver).
- Le module Entraînement fonctionne à l'intérieur de l'application QPJB ; on ne réintroduit pas Vercel.
- Derniers commits de **code** vérifiés : `0de7fca8a6d810c5d9365c1c78c61e3ea74d08c5` (masquage de l'ancien affichage durant l'ouverture Enchères), `c9b34d8ec6362e623bc30d2bc4565d9733447a1f` (QCM iPhone sur toute la hauteur, main agrandie, chargement stable des polices), après `20f62e6022553c7852f3382651d495a9b38cbb86` (éviter les resets après réponse).
- Commits récents pertinents à consulter au besoin : `fa5c64a`, `1006bc3`, `474fdc9`, `23c467f`, `302b7dc`.

## Priorité actuelle : ergonomie des QCM sur iPhone

La demande utilisateur n'est **pas encore validée visuellement** sur iPhone. Objectif : voir simultanément main, séquence d'enchères et 4 réponses sans devoir faire défiler. Éviter un rendu comprimé, une largeur limitée à la moitié de l'écran, le texte de retour flou, un haut d'écran coupé et un grand vide en bas.

Règles UX décidées :
- Une seule ligne pour les cartes de la main sur mobile.
- Quatre propositions visibles, grille de deux colonnes de largeur égale.
- Dans la page d'exercice, supprimer la barre de navigation redondante et le tag de catégorie répété.
- Garder seulement le bouton Retour et le numéro d'exercice sur la même ligne.
- Utiliser effectivement la largeur disponible, sans écraser inutilement les composants ; conserver un texte net et lisible.
- Navigation interne sans recharger toute l'application.

## Contraintes non négociables

- Ne modifier **que la partie Entraînement** sauf dépendance indispensable, à expliquer.
- Ne pas changer les exercices, les réponses, corrigés, identifiants ou les PDF originaux.
- Ne pas casser les affichages desktop, le reste du site QPJB, ni les données et sauvegardes des utilisateurs.
- Ne pas prétendre qu'un correctif iPhone est visuellement validé à partir d'un simple commit ou de tests JavaScript.

## Intervention du 29 octobre 2026 — correctif QCM sur iPhone

- Commit de code : `69579462bc656cbba8116d8b824c9d6cecd16829` (branche `main`).
- Modification **uniquement** dans le CSS de `entrainement/index.html` : hauteur des quatre boutons d'enchères ajustée à la hauteur disponible (`clamp(48px,7.2dvh,62px)`), police restant entre 18 et 22 px ; pour les écrans de hauteur ≤ 760 px, marges, en-tête, séquence et espacements moins volumineux.
- Conservé : quatre choix en deux colonnes de largeur égale, main sur une seule ligne, retour + numéro sur la même rangée, navigation interne et données/corrigés intacts.
- Contrôles effectués : diff GitHub (une seule insertion CSS ciblée ; aucun changement d'exercice, de JavaScript ou de PDF). **Pas de validation visuelle sur iPhone physique** ; ne pas affirmer que le défilement a totalement disparu pour chaque donne.
- À vérifier sur l'iPhone : QCM d'enchères avant et après réponse, écrans courts et longs (particulièrement séquences d'enchères nombreuses), bouton Retour non tronqué, pas de largeur divisée ni de défilement horizontal, quatre propositions visibles. Si besoin, fournir une capture après actualisation du site/PWA.

## Intervention du 29 octobre 2026 — stabilité du défilement

- Commit : `20f62e6022553c7852f3382651d495a9b38cbb86`.
- Dans `index.html` (code de navigation Entraînement seulement) : le message `qpjb-training-view` est envoyé par le module à chaque rendu, y compris après chaque réponse. Il ne provoque désormais redimensionnement, masquage de l'en-tête et `scrollTo(0,0)` **que si l'état liste/exercice change**.
- Diff limité au gestionnaire des messages du module. Aucun changement aux exercices, corrigés, PDF ou affichages hors entraînement.
- Audit CSS : plusieurs règles iPhone de dimensions successives sont présentes dans `entrainement/index.html` ; le dernier bloc CSS prévaut, sans suppression non testée pour l'instant.
- **À vérifier sur iPhone** : après sélection d'une réponse, absence de saut intempestif de la page mère, quatre réponses visibles, disposition en deux colonnes, main en une ligne et bonne hauteur d'affichage. Pas de test sur iPhone physique effectué.

## Intervention du 29 octobre 2026 — capture iPhone, saut d'ouverture et espace inutilisé

- Capture réelle : le QCM d'Enchères occupe seulement le haut de l'écran, grande zone vide sous les boutons de navigation. Cartes trop petites ; la table d'enchères peut comporter trois rangées.
- Commit module `c9b34d8ec6362e623bc30d2bc4565d9733447a1f` : CSS final du QCM intégré en disposition flexible sur `100dvh` (sans hauteur figée), panneaux qui se partagent l'espace, quatre réponses conservées en grille 2×2 et plus grandes, caractères de la main agrandis, table d'enchères intrinsèquement extensible. CSS réservé aux QCM d'enchères intégrés, sans modifier les données.
- Le chargement retardé de la police de 600 ms a été retiré ; CSS police chargé dès l'en-tête. Le module n'annonce plus « prêt » avant `document.fonts.ready`, et ne reconstruit plus la page des rubriques si elle est déjà affichée.
- Commit intégrateur `0de7fca8a6d810c5d9365c1c78c61e3ea74d08c5` : masquer la vue précédente à l'ouverture du module, puis ne révéler l'iframe qu'après confirmation de son rendu, plutôt qu'immédiatement à `ready`.
- Contrôles statiques : fichiers relus après commit, CSS équilibré, données des exercices inchangées, chargement retardé absent et écoute des messages cohérente. **Pas de test visuel iPhone après ces modifications.**
- Prochaine vérification visuelle indispensable : ouverture d'« Enchères » sans double saut, QCM avec une rangée puis trois rangées d'enchères, quatre propositions simultanément visibles, main lisible, feedback après réponse (défilement autorisé si corrigé long).

## Prochaine intervention

1. Lire ce fichier et le **dernier commit** de la branche `main`, sans recoller les longues conversations précédentes.
2. Examiner uniquement `entrainement/training-style.css`, `entrainement/training-app.js` et, si nécessaire, `index.html` intégrateur. Ne pas recharger les données des exercices pour des changements d'ergonomie.
3. Tester les QCM sur l'iPhone (portrait, réponses avant/après validation, exercices courts/longs), puis corriger exclusivement les problèmes encore visibles sur une capture ; ne pas modifier les données.
4. Committer les changements avec un message explicite, puis consigner ici uniquement le nouveau SHA, ce qui a été fait et ce qui reste à vérifier.

## Règles de travail pour limiter les plantages ChatGPT

- Privilégier des consultations ciblées et des retours d'outil < 2 000 caractères ; éviter absolument de renvoyer dans le chat les ~1,9 Mo du fichier de données, les logs complets ou tout l'historique.
- Pour une nouvelle conversation, donner seulement le lien vers ce fichier et le problème concret/capture.
- Dès que la discussion devient longue, repartir sur un nouveau chat avec ce fichier de reprise. Ne pas supprimer les anciens chats.

## Intervention du 29 octobre 2026 — réduction structurelle du risque HTTP 413

- **Erreur diagnostiquée dans les conversations ChatGPT** : `HTTP 413`, code `conversation_too_large`, parfois affiché `Unknown error`. Les requêtes `rgstr` bloquées défilant en rouge sont un symptôme distinct et ne suffisent pas à expliquer le refus `conversation`. Ce n'est pas un plantage de QPJB.
- **Cause aggravante du flux GitHub** : l'ancien `entrainement/index.html` pesait **2 052 228 octets** (Git SHA `83a7fb861ddf0a58f6a98297acb1dd9b45d00f50`). `fetch_file` retournait un contenu vide, même avec des plages de lignes ; `fetch_blob` permet de récupérer son contenu **à l'intérieur d'une exécution isolée** sans le déverser dans le chat.
- **Refactorisation atomique appliquée** sur `main` : commit `afeb2678d53516272783cdf570a4d84375664dd8`. Les blocs existants ont été déplacés sans réécriture :
  - `entrainement/index.html` : page HTML (3 643 caractères), liens vers les trois ressources séparées ;
  - `entrainement/training-style.css` : CSS inchangé (86 015 caractères) ;
  - `entrainement/training-data.js` : `const D` et données intégralement conservés (1 859 045 caractères) ;
  - `entrainement/training-app.js` : logique JavaScript inchangée (67 213 caractères).
- **Contrôles réalisés** : séparation/reconcaténation exacte des blocs HTML, données JSON `D` parsées et préservées, création des blobs GitHub, vérification du commit et des fichiers dans la branche `main`. **Le rendu réel et le chargement sur iPhone n'ont PAS encore été testés** : toute régression doit être traitée en priorité.
- **Règles impératives pour les prochaines corrections** : pour l'ergonomie, ne lire et modifier que `training-style.css` ou `training-app.js` ainsi que l'intégrateur `index.html` si strictement nécessaire. **Ne pas modifier `training-data.js`** sauf correction pédagogique explicitement demandée. Utiliser GitHub via exécution isolée avec une sortie très courte (SHA, résultat des tests, diff ciblé), jamais un dump du contenu, des historiques ou des logs. Vérifier un seul problème à la fois, puis consigner le SHA et le point restant.
- **Limite honnête** : cette organisation évite de recharger inutilement les données et réduit la taille des sorties ; elle ne permet pas de corriger elle-même une limite de taille du service ChatGPT ni les requêtes `rgstr` bloquées. Si `conversation_too_large` réapparaît dans un chat, continuer depuis ce fichier dans un nouveau chat court, sans recopier les anciennes conversations.

## Intervention du 29 octobre 2026 — reprise QCM iPhone après modularisation

- Commit **JavaScript** `dcc319c61ddaaffa0cc453e2a98ac696f86731ab` : `entrainement/training-app.js`, le message `qpjb-training-view` vers l'intégrateur part désormais **après** `root.innerHTML` et la mise en forme des symboles. La page mère ne modifie donc plus la hauteur de l'iframe au milieu d'un rendu. Aucun changement de réponse ou de données.
- Commit **CSS** `95fd54f7dd8485925a5c00078e3e2afd0a77180f` : simplification des trois blocs de retouches mobiles les plus récents en **une base iPhone cohérente**, et deux adaptations pour hauteurs ≤ 750 px et ≤ 620 px. Navigation Retour + numéro, main en une seule ligne agrandie, tableau d'enchères extensible, réponses en grille 2 × 2 sur pleine largeur ; réduction contrôlée des espacements sur écrans bas. Les 137 QCM comportant 3 lignes d'enchères (parmi 563 QCM d'enchères analysés) sont un cas de test prioritaire.
- Contrôles réalisés : syntaxe de `training-app.js` parsée sans erreur ; CSS avec accolades équilibrées ; ordre de notification du rendu confirmé ; chargement des ressources externes confirmé dans l'HTML ; fichier pédagogique `training-data.js` non touché.
- **Non validé physiquement** : comportement visuel sur un iPhone, notamment l'ouverture sans double saut, la lisibilité de la main de 13 cartes, la présentation avant/après réponse et les QCM à trois rangées. Tester après mise à jour de GitHub Pages. En cas de bug, demander uniquement une capture du QCM concerné et corriger `training-style.css` ou `training-app.js`, pas les données.

## Intervention du 29 octobre 2026 — affichage QCM validé sur une ligne, correction du saut après réponse

- Retour iPhone : les QCM avec **une seule ligne d'enchères** sont satisfaisants. L'exercice test à **trois lignes** proposé est `EN-2sa-001` (« Répondre et poursuivre après 2SA » → exercice 01), avec la séquence 2SA – 3♥ – 3♠ – ?.
- Demandes utilisateur : agrandir le texte de la barre de la main ; remonter légèrement « Quelle est votre enchère ? » sans réduire l'espace entre la question et les quatre boutons ; faire apparaître progressivement le corrigé sous les boutons sans saut ni rechargement du QCM.
- Commit logique `4059493485de7b79cf31e2df6ffe440ece9dabd5` : ajout de `updateBiddingAnswer` dans `training-app.js`. Un clic met à jour les états de réponse et le corrigé **sans appeler `render()` sur les QCM d'enchères**. Cas guidés et auto-corrigés pris en charge ; jeu de la carte reste inchangé.
- Commit CSS `4837cda5714d296a39aaa1895b909900c77272cb` : rangs de la main agrandis (clamp 16–19 px selon la largeur), hauteur stable du panneau supérieur, question alignée au début du panneau inférieur, corrigé déroulé via transition CSS 0fr → 1fr avec prise en charge de `prefers-reduced-motion`.
- Mises à jour des versions anti-cache : `d6cd5b0ece9c49d9a8109dff3516436d644167e0` (CSS/JS `20261029c`), `d13d2757a5a8532d3465ea6263a309f1d8046ed8` (iframe `rev=20261029c`).
- Vérifications statiques : `training-app.js` parse correctement, URL des versions présentes, transition CSS présente, données d'exercices `training-data.js` inchangées (SHA `e68972068d699898c05ec1a9bb6dba37f9881d17`). **Pas encore de test visuel sur iPhone** : refaire l'exercice 01 de la rubrique après 2SA, cliquer sur une réponse puis comparer la position des cartes et des boutons avant/après le dépliage.

## Intervention du 29 octobre 2026 — décochage et animations secondaires

- Demandes : second clic sur réponse cochée = désélectionner et retrouver l'écran avant réponse ; « Pourquoi les autres propositions ne conviennent pas » s'ouvre comme le corrigé principal ; grossir encore les cartes de la main ; taille de police identique entre les 4 boutons.
- Commits logique `14e852c93b6b74f7d4c23a70369ee0e49d1255ac` puis `2507f18ee7c9f4bde961ea340ca144498ea74948` : `respond` et `chooseSource` décochent si même choix ; remise à zéro de `redoAttempt`, `redoAnswered`, `chosen`, `playSeen` sans `render()`. Le corrigé se referme avec animation inverse ; protection contre clics rapides via `openRequested`. Les exercices/corrigés et le **suivi historique des résultats sauvegardés** ne changent pas (comme pour « Refaire cet exercice »).
- Les sections « Pourquoi les autres propositions... » des enchères et du jeu de la carte sont désormais commandées par un bouton accessible (aria-expanded) et un contenu animé (280 ms, dépliage + repliage) ; arrêt des animations si `prefers-reduced-motion`.
- Commit CSS `a04495acff74d060b12609bc80ae2ddbae79b582` : texte de la main en clamp(18px,5.45vw,21px), 17px sur très petits écrans ; les 4 boutons gardent le même clamp(20px,5.5vw,22px), y compris symboles de couleur colorisés et états sélectionnés.
- Anti-cache `66d902286f910f9170e1d22127f2b67deace914d` (3 ressources `20261029d`) et `643ff4877d568f61600ef7c46c764a607a67162f` (iframe `rev=20261029d`).
- Tests statiques : syntaxe JavaScript validée, CSS équilibré, SHA de `training-data.js` inchangé ; tests ciblés de séquences sélection→désélection→nouvelle sélection validés, en mode QCM ordinaire et guidé. **Reste à valider physiquement sur iPhone**, notamment main de 13 cartes et ouverture des explications sans saut.

## Intervention du 29 octobre 2026 — harmonisation QPJB / Entraînement

Objectif explicite : intégrer Entraînement dans les comportements préexistants de QPJB, sans réécrire les QCM ni les corrigés.

- **Fondu commun et navigation cohérente** : commit `78b44284fe854b16020a049687cb9f5ca038054a`. Tous les changements internes de page Entraînement (thème ↔ liste ↔ QCM, précédent/suivant) passent par le fondu `fadeSwap` de QPJB via messages iframe parent/enfant ; les réponses et déroulés des corrigés ne l'utilisent pas. Retour à une liste : conservation de la position de défilement dans le contexte de rubrique.
- **Design partagé et CSS mieux structuré** : commit `ccf2d8528f61316be3cc33c642f3703195d75a1b`. Nouvelle source commune `qpjb-design-tokens.css` (violet, fonds, contrastes, arrondis, polices) chargée par QPJB et l'iframe. `entrainement/training-style.css` a été réparti en `training-core.css` et `training-integrated.css` dans le même ordre de cascade ; ancien monolithe supprimé. Conservation du QCM compact, cartes sur une ligne et réponses 2 × 2. Version de cache `20261029e`. Les styles pédagogiques restent spécifiques.
- **Historique navigateur au niveau des sous-pages** : commit `e98148a16c9f040dc223dcc22c9cdb928781ebe9`. Les transitions internes ajoutent un état à l'historique ; Retour navigateur rétablit thème/liste/QCM via QPJB. Sortie vers Accueil QPJB depuis une sous-page : remonter le nombre d'étapes internes plutôt que rester coincé dans Training.
- **Stabilisation** : commits `8c7c8ba8f224`, `b0530b54885e`, `7c832fd9cbc1` : restauration des sous-pages au rechargement, recalcul de la zone utile et valeurs CSS de repli hors ligne. Commit `5755f5356b0e474f279ce0216659dbc4f7ec2c51` : fondu même sur les onglets Training et suppression d'une règle de hauteur concurrente, le calcul étant centralisé dans `qpjbTrainingResize()`.
- **Correctif découvert par test navigateur** : le clic sur un onglet juste après un retour pouvait être perdu tant que `fadeSwap` était occupé. Commit `348c40e0e5fef666ba1e6dce711706fd2a381d23` : le dernier clic demandé est différé puis exécuté après la transition en cours.
- **Non-régression automatique** : `tests/training-smoke.cjs`, `tests/training-browser.cjs` et workflow `.github/workflows/training-smoke.yml`, exécution sur les changements d'interface. Résultat confirmé au commit `348c40e` : **27 vérifications statiques + test Playwright Chromium réussi**, avec iPhone 12 simulé (390 × 844), écran mobile court (375 × 667), QCM d'enchères à trois lignes, quatre propositions, désélection d'une réponse, ouverture des explications complémentaires, Retour navigateur et navigation Jeu de la carte. Aucune erreur JS non interceptée détectée dans ce test.
- **Données garanties intactes** : `training-data.js` non modifié, ainsi que les exercices, réponses, corrigés, PDF et le format de progression `localStorage`.
- **Limites** : la simulation Chromium ne valide pas le rendu exact de Safari iOS/PWA physique. Ne pas déclarer l'ergonomie Safari entièrement validée ; la vérification sur l'iPhone réel reste nécessaire. La séparation CSS réduit le risque de corrections en cascade, mais les anciennes surcharges `!important` ne sont pas toutes éliminées : les retirer uniquement par passes limitées, avec tests visuels, sans régression.
- **Pour les prochaines retouches** : cibler `entrainement/training-integrated.css` pour l'interface intégrée, `training-core.css` pour les vues autonomes et communes, `training-app.js` pour la logique, et `qpjb-design-tokens.css` pour les seuls tokens communs. Éviter de modifier `training-data.js` pour des problèmes de style ou de navigation.
