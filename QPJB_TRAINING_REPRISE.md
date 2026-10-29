# QPJB Training — point de reprise léger

Dernière vérification : 29 octobre 2026. Ce fichier sert de mémoire de travail entre conversations ChatGPT afin d'éviter les erreurs `conversation_too_large`. **Il ne fait pas partie de l'interface de l'application.**

## Dépôt et code de référence

- Dépôt : `CapGui13/QPJB`, branche `main` ; site : https://capgui13.github.io/QPJB/
- Application QPJB intégratrice : `index.html`.
- Module d'entraînement : `entrainement/index.html` (HTML/CSS/JavaScript et exercices intégrés, fichier volumineux).
- Le module Entraînement fonctionne à l'intérieur de l'application QPJB ; on ne réintroduit pas Vercel.
- Commit le plus récent lors de cette vérification : `f9b13632b360ffaa52f29cfdf02909d419aceb53` (ajustement de la navigation QCM sur iPhone).
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

## Prochaine intervention

1. Lire ce fichier et le **dernier commit** de la branche `main`, sans recoller les longues conversations précédentes.
2. Examiner uniquement le CSS et la structure de l'écran QCM mobile (`index.html` intégrateur + `entrainement/index.html`).
3. Corriger de façon ciblée les problèmes encore visibles sur la prochaine capture iPhone ; faire des vérifications de non-régression.
4. Committer les changements avec un message explicite, puis consigner ici uniquement le nouveau SHA, ce qui a été fait et ce qui reste à vérifier.

## Règles de travail pour limiter les plantages ChatGPT

- Privilégier des consultations par lignes, recherches ciblées et diffs courts ; éviter de renvoyer dans le chat les 2 Mo du fichier d'entraînement ou tout l'historique.
- Pour une nouvelle conversation, donner seulement le lien vers ce fichier et le problème concret/capture.
- Dès que la discussion devient longue, repartir sur un nouveau chat avec ce fichier de reprise. Ne pas supprimer les anciens chats.
