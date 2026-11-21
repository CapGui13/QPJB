# QPJB V2 — publication du parcours guidé SEF R1

**20 novembre 2026.** La demande de finalisation et de publication autorise la diffusion de ce parcours après validation des contrôles. La PR #217 intègre exclusivement le parcours depuis la rubrique « Quizz », sans bouton supplémentaire sur l'accueil.

- PR #216 fusionnée dans `main` : `e0fb21011b54e354e6eea5ef0e61ef90bcb5eafd`.
- Parcours : 65 séances ; source de 1 523 QCM ; aucun supplément expérimental ; 19 arbitrages pédagogiques approuvés. Aucune modification du Quiz SEF classique, de `quizz.html`, ni des corrigés.
- Un seul bouton « Quizz » sur l'accueil ; lien « Parcours guidé · 65 séances » dans la rubrique Quizz, ouverture dans un nouvel onglet.
- Sauvegarde locale inchangée par rapport au candidat R1 : `qpjb-v2-eleve-65-pedago-r1` ; version `QPJB-V2-65-19A-20261120-R1`, schéma 2. Export/import JSON et refus des versions incompatibles ; aucune suppression, migration automatique ou réinitialisation.
- La signalétique « candidat privé/HOLD » est adaptée à la diffusion. Pour prouver l'intégrité du contenu R1, le garde-fou annule seulement les 8 substitutions de diffusion en mémoire et vérifie l'empreinte SHA-256 du candidat original : `4edc289dfa6d1e929e6985985152321adf8edb342923b4fadc061405aef386b6`.
- Avant fusion : vérifier les deux jobs GitHub Actions, notamment Chromium bureau et WebKit mobile sur le dernier commit. Après fusion : contrôler le workflow GitHub Pages et l'accès public. Le fichier reste `noindex,nofollow` : accessible depuis Quizz mais non destiné aux moteurs de recherche.
- Retour arrière : retirer uniquement le lien de Quizz si nécessaire ; conserver temporairement l'URL R1 afin de ne pas couper l'accès aux progressions existantes. Ne jamais nettoyer les clés `localStorage`.
