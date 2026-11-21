# LONG M3 — PASSE 16 : refuser les faux comparatifs de stockages vides

Branche `wave2/experience-eleve-20261121`, parent `425a5cb6b527827d42e9dfa5ec16610023952c9f`.

## Faux positif détecté dans le test P15
Deux exécutions où aucune séance n'aurait été enregistrée produisaient la même projection `{activeIds:[],answers:[],attempts:[]}`, et `assert.deepEqual` pouvait annoncer une sauvegarde « identique » alors que **les deux sauvegardes étaient absentes**. Le test de non-régression devait exiger une preuve *positive*, pas seulement l'égalité.

## Correction
- `assertProgressEvidence()` dans `tests/wave2-ux-storage-projection.cjs` rejette explicitement un parcours sans ID, une correction sans réponse enregistrée ou un historique de tentative vide.
- `tests/wave2-ux-visual.cjs` exécute ce garde **sur chaque capture avant et après**, puis compare les projections seulement si les deux sont non vides.
- `tests/wave2-ux-storage-projection-test.cjs` étend les contre-exemples pour les trois absences ; l'ancien test de modification d'enchère et de neutralisation des dates reste intact.

## Tests réellement exécutés
Source exacte du module chargée dans le runtime JavaScript, quatre cas synthétiques évalués : progression normale **acceptée** ; séance vide, réponse absente et tentative absente **rejetées**. **4/4 comportements attendus**. Syntaxes des trois scripts JS correctes. Aucun changement de code de production ou de JSON (1 523 QCM, 22 rubriques).

## Vérification CI / mission
Les suites historiques du HEAD P11 étaient 5/5 vertes. Sur les SHA P12 à P15, certains workflows sont encore en file d'attente ou en cours au dernier relevé ; aucune réussite globale n'est inventée. Le nouveau runner M3 (8 étapes, Chromium+WebKit et comparatifs réels) reste non exécuté faute d'accès au checkout du dépôt depuis l'environnement local et de raccordement CI réservé à M5.

**PASSE 16 FINIE (fail-closed du comparatif des sauvegardes). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P17 — exécuter la recette Playwright réelle et analyser les rapports/captures ; relever les runs GitHub terminés.**
