# M3 — PASSE 9 : exécution dynamique isolée des transitions de focus
Branche `wave2/experience-eleve-20261121`, parent `854d4a86800ca2cf1df54c96288a91599449cf44`.

## Méthode
Les fonctions `setQuizSkipTarget`, `focusQuizQuestion` et `exitSession` ont été **extraites du code réel `quizz.html`**, puis exécutées dans un faux DOM minimal. La contre-épreuve vérifie les cibles de navigation, l'absence de focus sur les éléments masqués et l'ordre « restaurer le scroll → focaliser sans scroll ».

## Résultats
- **Scénario guidé avec question** : `#question-heading` focalisé avec `preventScroll`, puis lien restauré vers `#parcours-start`, scroll à 317 et focus différé sur le bon bouton. **Réussi**.
- **Sélection libre sans exercice** : repli sur `#back-home`, puis retour vers `#new` avec focus sans saut. **Réussi**.
- Code de `tests/wave2-ux-focus.cjs` préparé pour la CI, sans dépendance Playwright ; source Node compilable et émulation équivalente exécutée dans l'outil d'analyse.
- Aucun changement de QCM, de moteur, de sauvegarde, de CSS ou de `quizz.html` dans cette passe. Les **30 garde-fous statiques** et la somme SHA-256 du catalogue (P8) sont conservés.

## Contrat d'intégration (hors périmètre CI)
Ajouter `node tests/wave2-ux-focus.cjs` à la CI M3, en plus des contrats et des 2 navigateurs déjà documentés.

## Limite
L'**exécution navigateur M3 réelle** n'est pas remplacée par cette simulation : elle reste nécessaire avant fusion. Les workflows historiques P4 sont tous verts.

**PASSE 9 FINIE (test dynamique isolé). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P10 — bilan des runs post-P5 et anomalies ciblées, en préservant HOLD.**
