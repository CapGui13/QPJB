# QPJB Training — reprise EXPRESS (29/10/2026)

> **Lire ce fichier, pas les anciennes conversations.** Historique détaillé conservé dans [QPJB_TRAINING_REPRISE.md](./QPJB_TRAINING_REPRISE.md). Utiliser des lectures GitHub ciblées et ne jamais renvoyer des fichiers/logs complets dans la conversation.

## Où en est-on ?
- **Audit des exercices libres, lot 1 terminé (29/10)** : relecture source de `JC-001`, `JC-002` et `JC-003` (PDF exercices et solutions, plans de jeu) ; aucune erreur de fond démontrée. Réserve sur la formulation « 100% » de `JC-002`. Rapport : [`QPJB_TRAINING_AUDIT_LIBRES_LOT01_2026-10-29.md`](./QPJB_TRAINING_AUDIT_LIBRES_LOT01_2026-10-29.md), commit `3172847e`. **Aucune donnée pédagogique modifiée.** Prochain petit lot : `JC-004` à `JC-006`.
- **État courant validé (29/10, après audit pédagogique) : 114 exercices conservés, 111 disponibles (81 QCM + 30 libres), 3 QCM mis en quarantaine.** Dernier rapport : [QPJB_TRAINING_AUDIT_PEDAGOGIQUE_2026-10-29.md](./QPJB_TRAINING_AUDIT_PEDAGOGIQUE_2026-10-29.md).
- Dépôt : `CapGui13/QPJB`, branche `main`. Site : https://capgui13.github.io/QPJB/
- Dernière correction fonctionnelle au 29/10/2026 : `a023dec3aa43b717fcaa35dddecf0f8561926212` (accès aux QCM en quarantaine bloqué même via anciens parcours). Tests : `0cfc2ca`, `8a8fc6f`, `c2f85d0`. Audit pédagogique indépendant : `QPJB_QCM_AMBIGUS_AUDIT_2026-10-29.md`.
- Dernier chantier livré : reclassement des **quatre** exercices `JC-BH-017-Q01` à `Q04` depuis « Défense et signalisation » vers « Décisions de plan de jeu · QCM » ; mains mort Nord / déclarant Sud. Commit données : `741238308366f865fa8ead20d877a435ae2c9c58`. Énoncés, options, réponses, explications, identifiants, 326 PDF, progression inchangés.
- Contrôles automatiques au commit `72e23068` : 38 vérifications statiques et tests navigateur Playwright iPhone 12 **simulé** réussis. À confirmer sur Safari/PWA iPhone réel.
- **Audit pédagogique suivant (29/10)** : les QCM `JC-BH-028-Q04` (carte du mort non précisée) et `JC-BH-036-Q02` (distracteur compatible avec la bonne séquence) avaient un `quarantineReason` mais étaient toujours notés. Leurs seuls `reviewStatus` sont passés de `transcrit_source` à `a_verifier` (commit `b2cb6ad467064d550d8897e80167bfd1825daef1`), ce qui les exclut des listes via le filtre existant : **112 exercices de carte disponibles sur 114 conservés**. Données d'origine, options, bonnes réponses, corrigés, IDs et sauvegardes inchangés. Test garde-fou `39a52db`, cache module `d6a8528`, cache QPJB `bf59991`. 8 assertions ciblées vérifiées en lecture du dépôt ; statut GitHub Actions et iPhone physique non confirmés. Ne réintégrer ces deux exercices qu'après résolution pédagogique explicite.
- **Sécurisation du 29/10** : `item(v)` refuse les IDs non admissibles, `current()` ne retourne pas d'exercice exclu, et les routes `quiz` restaurées vers un ID exclu reviennent à la liste sans altérer les sauvegardes. L'ancien test navigateur qui ouvrait `JC-BH-028-Q04` (désormais en quarantaine) a été remplacé par un test d'accès bloqué / conservation du stockage. **44 contrôles statiques exécutés et réussis** avec les fichiers GitHub actuels ; exécution Playwright sur GitHub Actions non confirmée, Safari physique non testé. Le fichier d'audit propose des modifications pour les deux QCM, mais **aucun contenu pédagogique n'a été modifié ni réactivé**.
- Ergonomie : module Entraînement intégré à QPJB, fondu commun, navigation et Retour harmonisés, QCM d'enchères sur une ligne de main, quatre réponses en grille 2 × 2, explications dépliantes, désélection au second clic, corrections locales sans re-render complet. Les retours visuels sur iPhone restent déterminants.

## Fichiers et précautions
- `index.html` : intégrateur QPJB.
- `entrainement/index.html` : entrée du module.
- `entrainement/training-app.js` : logique et navigation.
- `entrainement/training-core.css` et `entrainement/training-integrated.css` : CSS ; `qpjb-design-tokens.css` : design commun.
- `entrainement/training-data.js` : volumineux (~1,86 Mo), **ne jamais lire en entier pour un problème de style**.
- `tests/training-smoke.cjs`, `tests/training-browser.cjs` : tests de non-régression.
- Ne pas changer le contenu pédagogique pendant une passe UI/UX, sauf demande explicite. Préserver les sauvegardes et le site hors Entraînement. Ne pas confondre test Chromium simulé et validation iPhone réelle.

## Validation technique complémentaire — 29/10/2026

- **Workflow GitHub Actions réussi :** [40945050902](https://github.com/CapGui13/QPJB/actions/runs/40945050902), commit CI `fe75aed46ac791b5858db7fd6e2c0bb1b97e08e8`.
- **Deux moteurs indépendants : Chromium et WebKit**, émulation iPhone 12 avec Playwright ; **44 contrôles statiques par moteur**, parcours navigateur réussis, aucune erreur JavaScript non interceptée. Le WebKit Linux simulé n'est PAS une validation physique Safari/iPhone/PWA.
- Tests renforcés par `545891eb` puis corrigés dans `9b3923a` : Précédent/Suivant sans rechargement d'iframe, sauvegarde des réponses pendant la navigation, persistance après rechargement complet de QPJB, QCM à trois rangées, petits écrans, réponses/corrigés, défense, navigation retour et accès refusé aux deux exercices en quarantaine.
- Le premier échec du nouveau test venait d'une hypothèse de scénario : après rechargement, QPJB peut restaurer automatiquement l'écran Entraînement et masquer son bouton d'accueil. La vérification a été remplacée par la lecture du `localStorage` de la même origine ; le workflow final est vert.
- Moteur WebKit ajouté à `tests/training-browser.cjs` (commit `b63f561d`) et à la matrice `.github/workflows/training-smoke.yml` (commit `fe75aed4`). Aucun énoncé, corrigé, identifiant ou PDF n'a été retouché durant cette passe.

## Audit pédagogique, tests et sécurité — 29/10/2026
- **BH-014 Q01** : correction d'origine problématique pour encaisser toutes les cartes maîtresses sans rentrée extérieure. `JC-BH-014-Q01` mis en quarantaine **sans réécriture** de ses mains, choix ou corrigé (commit `8c070fc7`).
- **BH-042 Q01** : séquence `1♠` d'Est, `1SA` de Sud, puis `3SA` par Nord rétablie dans la question à partir du PDF source ; réponse inchangée (commit `e4ae9f08`). Anti-cache actualisé (`20261029m`).
- **Preuves** : solutions PDF originales BH-007, 014, 017, 020, 021, 022, 023, 024, 028, 031, 034, 036, 040, 041 confrontées ; 60 QCM actifs rattachés à ces dossiers. Contrôle structurel initial sur 112 disponibles. Relecture de fond encore nécessaire, particulièrement des 30 exercices libres.
- **GitHub Actions entièrement vert** : [exécution 40948941842](https://github.com/CapGui13/QPJB/actions/runs/40948941842) ; **46 contrôles statiques réussis sur chaque moteur**, puis parcours navigateur iPhone 12 simulé **Chromium + WebKit**, zéro erreur JS non interceptée. iPhone physique non testé. Les données ne sont pas des résultats garantis de Safari réel.
- Les trois dossiers bloqués sont : `JC-BH-014-Q01`, `JC-BH-028-Q04`, `JC-BH-036-Q02`. 326 PDF originaux, autres contenus et historique de progression préservés.
- Rapport complet : `QPJB_TRAINING_AUDIT_PEDAGOGIQUE_2026-10-29.md`. Ne pas réintégrer ces exercices sans plan de jeu/justification solide.

## Prochaine action
Base technique vérifiée sur Chromium et WebKit ; prochaine étape recommandée : poursuivre la relecture des 30 exercices libres à partir des documents d'origine, puis revérifier quelques parcours sur iPhone Safari/PWA réel. Ne pas réintégrer les trois QCM en quarantaine sans validation pédagogique. Se baser sur le problème concret du nouveau chat, inspecter des fichiers ciblés et continuer par petites étapes. Toujours noter SHA, tests et limites, sans recopier l'historique.

## Éviter la saturation de ChatGPT
L'erreur « longueur maximale de la conversation » / `conversation_too_large` vient de la limite de la conversation ChatGPT, **pas de QPJB Training**. La scission du module en fichiers réduit les sorties, sans supprimer cette limite. Dans une exécution GitHub, traiter les grosses données en interne et n'afficher au chat que les extraits utiles (< 2 000 caractères par retour en général). Utiliser un nouveau chat après un chantier achevé, sans copier d'anciens échanges.
