# LONG M3 — PASSE 12 : contre-épreuve réelle de non-régression du stockage

**Base de la passe :** `04c090d5354e602bd4d6cdf9ea8e57f63ae07ba9` sur `wave2/experience-eleve-20261121`.

## Constat démontré (rouge avant correction)
Dans `tests/wave2-ux-contract.cjs`, les vérifications « clé de sauvegarde libre » et « fonction saveParcours » étaient **à l'intérieur du bloc `try` conditionné à `git show`**. Dans un checkout Git superficiel, l'exception était tolérée et ces vérifications étaient omises. 
**Preuve :** injection en mémoire d'une modification du nom de la clé parcours `qpjb-sef-parcours-01` → `qpjb-sef-parcours-99`, sans toucher au catalogue ; le test **ancien est passé** lorsque `git show` signalait une absence d'historique.

## Correction (verte après)
Les contrôles de stockage sont désormais **obligatoires et hors `try/catch`**, indépendants de Git :
- clé de progression du quiz et clé de parcours ;
- écriture de l'état de parcours dans `localStorage` ;
- réinjection des réponses lors de la reprise ;
- enregistrement des tentatives d'apprentissage.
Le garde SHA-256 immuable du bloc QCM (P8) reste indépendant de Git et continue de s'appliquer.

## Tests effectivement exécutés
Exécution de **la source exacte du test CJS**, avec shims des modules Node `fs`, `crypto`, `assert`, `child_process` pour simuler un checkout sans histoire Git (sans prétendre remplacer Node/Playwright) :
- version initiale avec clé parcours volontairement corrompue : **succès anormal** démontré ;
- version corrigée sur `quizz.html` inchangé : **succès** ;
- version corrigée avec clé parcours volontairement corrompue : **échec attendu** ;
- version corrigée avec `QPJBParcours.record` volontairement altéré : **échec attendu**.
**4 scénarios / 4 comportements conformes aux attentes ; 30/30 assertions UX de structure satisfaites dans l'exécution de la version corrigée.**
Le JSON source est toujours identique au commit de base (**1 523 QCM, 22 rubriques**). Aucune donnée élève ni fonction de production modifiée par cette passe.

## Recette navigateur
Le workflow GitHub de P11 est **5/5 vert**, dont Training smoke historique Chromium/WebKit. Malgré plusieurs tentatives, le checkout complet de la branche n'a pas pu être monté dans le navigateur local (environnement sans résolution GitHub). Le nouveau script `tests/wave2-ux-browser.cjs` **n'est pas exécuté** par ces workflows. Ne pas déduire son succès des tests historiques ; conserver HOLD.

**PASSE 12 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**
**PROCHAINE PASSE : P13 — renforcer la robustesse des scénarios Chromium/WebKit et préparer le raccordement CI sans modifier les workflows réservés à M5.**
