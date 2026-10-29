# QPJB Training — point de reprise léger

Dernière vérification : 29 octobre 2026. Ce fichier sert de mémoire de travail entre conversations ChatGPT afin d'éviter les erreurs `conversation_too_large`. **Il ne fait pas partie de l'interface de l'application.**

## Dépôt et code de référence

- Dépôt : `CapGui13/QPJB`, branche `main` ; site : https://capgui13.github.io/QPJB/
- Application QPJB intégratrice : `index.html`.
- Module d'entraînement : `entrainement/index.html` (HTML/CSS/JavaScript et exercices intégrés, fichier volumineux).
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
2. Examiner uniquement le CSS et la structure de l'écran QCM mobile (`index.html` intégrateur + `entrainement/index.html`).
3. Tester les QCM sur l'iPhone (portrait, réponses avant/après validation, exercices courts/longs), puis corriger exclusivement les problèmes encore visibles sur une capture ; ne pas modifier les données.
4. Committer les changements avec un message explicite, puis consigner ici uniquement le nouveau SHA, ce qui a été fait et ce qui reste à vérifier.

## Règles de travail pour limiter les plantages ChatGPT

- Privilégier des consultations par lignes, recherches ciblées et diffs courts ; éviter de renvoyer dans le chat les 2 Mo du fichier d'entraînement ou tout l'historique.
- Pour une nouvelle conversation, donner seulement le lien vers ce fichier et le problème concret/capture.
- Dès que la discussion devient longue, repartir sur un nouveau chat avec ce fichier de reprise. Ne pas supprimer les anciens chats.
