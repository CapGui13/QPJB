# QPJB Training — reprise EXPRESS (29/10/2026)

> **Lire ce fichier, pas les anciennes conversations.** Historique détaillé conservé dans [QPJB_TRAINING_REPRISE.md](./QPJB_TRAINING_REPRISE.md). Utiliser des lectures GitHub ciblées et ne jamais renvoyer des fichiers/logs complets dans la conversation.

## Où en est-on ?
- Dépôt : `CapGui13/QPJB`, branche `main`. Site : https://capgui13.github.io/QPJB/
- Dernier commit vérifié au 29/10/2026 : `7dd50310fee31bfeb69e913d4fcb9fc20381ac65` (documentation classement BH-017).
- Dernier chantier livré : reclassement des **quatre** exercices `JC-BH-017-Q01` à `Q04` depuis « Défense et signalisation » vers « Décisions de plan de jeu · QCM » ; mains mort Nord / déclarant Sud. Commit données : `741238308366f865fa8ead20d877a435ae2c9c58`. Énoncés, options, réponses, explications, identifiants, 326 PDF, progression inchangés.
- Contrôles automatiques au commit `72e23068` : 38 vérifications statiques et tests navigateur Playwright iPhone 12 **simulé** réussis. À confirmer sur Safari/PWA iPhone réel.
- Ergonomie : module Entraînement intégré à QPJB, fondu commun, navigation et Retour harmonisés, QCM d'enchères sur une ligne de main, quatre réponses en grille 2 × 2, explications dépliantes, désélection au second clic, corrections locales sans re-render complet. Les retours visuels sur iPhone restent déterminants.

## Fichiers et précautions
- `index.html` : intégrateur QPJB.
- `entrainement/index.html` : entrée du module.
- `entrainement/training-app.js` : logique et navigation.
- `entrainement/training-core.css` et `entrainement/training-integrated.css` : CSS ; `qpjb-design-tokens.css` : design commun.
- `entrainement/training-data.js` : volumineux (~1,86 Mo), **ne jamais lire en entier pour un problème de style**.
- `tests/training-smoke.cjs`, `tests/training-browser.cjs` : tests de non-régression.
- Ne pas changer le contenu pédagogique pendant une passe UI/UX, sauf demande explicite. Préserver les sauvegardes et le site hors Entraînement. Ne pas confondre test Chromium simulé et validation iPhone réelle.

## Prochaine action
Se baser sur le **problème concret donné dans le nouveau chat**, inspecter seulement les fichiers concernés et le dernier commit, corriger et tester par petites étapes. À chaque étape : réponse courte (résultat, SHA, test et limite), puis actualiser ce résumé en remplaçant les informations obsolètes. Conserver l'historique détaillé sans le recopier.

## Éviter la saturation de ChatGPT
L'erreur « longueur maximale de la conversation » / `conversation_too_large` vient de la limite de la conversation ChatGPT, **pas de QPJB Training**. La scission du module en fichiers réduit les sorties, sans supprimer cette limite. Dans une exécution GitHub, traiter les grosses données en interne et n'afficher au chat que les extraits utiles (< 2 000 caractères par retour en général). Utiliser un nouveau chat après un chantier achevé, sans copier d'anciens échanges.
