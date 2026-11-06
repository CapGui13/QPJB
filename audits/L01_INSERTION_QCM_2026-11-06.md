# QPJB – L01 : pré-intégration de 30 QCM, 6 novembre 2026

- **Source relue** : `quizz.html` sur `main`, blob `67036b9dfc68ebc28e96d4fd38c4eb671834f65c`, 1 223 exercices.
- **Candidats** : lot L01, V4 revu puis V5 (9 énoncés clarifiés pour supprimer les réponses trop visibles).
- **Contenu proposé** : 30 QCM avec IDs stables `SEF-L01-A-01` à `SEF-L01-F-06`, 12 chelem (dont 1 contrôle CHE-2), 8 Rubensohl, 4 ouvertures quatrième position, 6 Drury.
- **Références** : `/QPJB/Quiz SEF/Extension V4.110 L01/L01_CANDIDATS_FINAL_V5.json` (Bibliothèque ChatGPT), `L01_RAPPORT_CONTRE_EXPERTISE_V4.md`.
- **Statuts après relecture documentaire** : 30 `VALIDE`, 0 `A_REVOIR`, 0 `REFUSE`. Ne vaut pas preuve de jouabilité de toutes les donnes complètes, les mains adverses étant inconnues.
- **Intégrité** : aucune modification des 1 223 entrées existantes ; ajouts exclusivement à la fin de `exercises`. Clé localStorage `qpjb-sef-entrainement-01` et migrations précédentes conservées ; pas de modification de `/entrainement/`.
- **Tests ajoutés** : `tests/quizz-l01-regression.cjs` (13 cartes, HCP, 4 choix, IDs, doublons de mains, cohérence des thèmes, fuite des réponses), branché au job `integrity` du workflow `QPJB Training smoke`.
- **Précondition de fusion** : CI verte (intégrité, Chromium et WebKit), contrôle de la PR, puis déploiement après workflow sur `main`. Ne pas confondre PR et publication.
