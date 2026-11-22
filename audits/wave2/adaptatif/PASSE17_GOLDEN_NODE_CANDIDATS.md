# M2 — PASSE 17 : tests longitudinaux verrouillés et variantes contre-testées en Node

**PASSE 17 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON** (recette `--full` du moteur historique encore en cours).

## Problème réel de couverture

Le banc M2 historique `wave2-adaptatif-benchmark.cjs` parcourait 30 scénarios avec assertions de structure, mais **ne comparait pas les métriques de chacun** aux neuf fichiers de référence P2. Une évolution accidentelle du comportement après les 12 séances du test court pouvait donc passer à tort : aucune vérification de la diversité et des difficultés longitudinales par profil/graine.

## Développement sur la seule branche M2

- `tests/wave2-adaptatif-golden.cjs` : 30 vecteurs de référence extraits des **9 JSON P2**, regroupés par profil (5) × horizon (65/153) × graine (11/29/47). Comparaison de **18 attributs projetés** dont IDs uniques, thèmes, familles, contextes, décisions, nombre de questions difficiles/faibles/aidées, rappels, fondamentaux, occasions dues, diversités par séance et empreinte FNV-1a des **22 fréquences par thème**. Échecs explicites sur absence, duplication et dérive de famille.
- `tests/wave2-adaptatif-parallel.cjs` : 5 processus Node indépendants (un par profil, 6 scénarios par processus) ; validation des horizons/graines/IDs et confrontation finale aux **30** références. Pas d'altération du tirage ni du code de production ; le parallélisme sert à exécuter plus efficacement le banc de recherche.
- `tests/wave2-adaptatif-suite.cjs` et son autotest sont raccordés : **7 contrôles rapides, 12 commandes complètes**, avec exécution parallèle contrôlée à la place de la boucle unique séquentielle.

Commits sources : `c4a244e1` (goldens), `62e1f7e9` (suite), `a808dbc4` (autotest), `b1f2fa6a` (cinq processus), `17e51694` (suite parallèle), `22ea6f2b` (autotest). Tous dans `tests/wave2-adaptatif-*`.

## Vérifications effectivement exécutées

- **Node.js 22.16.0 natif**, avec les vrais fichiers `quizz.html` et `quizz-parcours.js` (Git blobs de référence exacts) et les scripts M2 copiés à l'identique : `node tests/wave2-adaptatif-suite.cjs --quick` **7/7 PASS** ; auto-tests golden et parallèle, 600 tirages, cinq variantes de sauvegarde et contrôle du catalogue.
- 30 scénarios **`score-cache` sous Node CLI** (5 profils × 65/153 × 3 graines) : **32 700 réponses synthétiques** et **30/30 projections identiques** aux neuf références P2 (les 18 attributs incluant la répartition par thème). Candidat isolé, aucune mutation du moteur.
- **Quatre commandes Node natives candidates** (toutes code de sortie 0) et confrontation indépendante de **20 indicateurs communs** aux archives de référence P2/P3/P4/P8 : **4/4 empreintes identiques**.
  - `foundation` / `modere` / 153 / g29 : 1 087 familles, difficulté 4–5 **25,10 %**, contre sa référence **1 097 familles / 25,88 %**.
  - `recall` / `modere` / 153 / g11 : **974 familles**, difficulté 4–5 **31,31 %**, contre **1 108 / 27,84 %**.
  - `overdue` / `modere` / 153 / g11 : **1 109 familles**, difficulté 4–5 **30,72 %**, contre **1 108 / 27,84 %**.
  - `score-cache` / `modere` / 65 / g11 : 475 familles / 14,15 % difficiles, égaux à sa référence.
- Empreintes Git des fichiers source `suite`, `selftest`, `parallel`, `golden` comparées à GitHub et identiques ; le test du module golden exact a également été exécuté sur ses références et sur les 30 sorties Node.

## Portée du verdict et limite

Les candidats `foundation`, `recall`, `overdue` restent **rejetés/non dominants** : baisse éventuelle de difficulté au prix de familles perdues, ou hausse des questions difficiles / baisse de variété. L'optimisation `score-cache` est neutre sur cette matrice, mais son intégration au moteur est **interdite par le contrat historique de SHA** sans arbitrage séparé (ne pas le modifier ici).

Une première exécution du banc séquentiel non optimisé a été **interrompue volontairement**, non à la suite d'une assertion défaillante, mais pour remplacer la boucle coûteuse par cinq processus indépendants. La nouvelle suite **`--full`** est lancée avec la vérification dorée des 30 trajectoires historiques, et ses résultats **ne sont pas encore connus** lors de cette passe. Aucun succès non obtenu n'est revendiqué.

La CI historique de la tête avant les nouveaux commits était verte (run `44997794775`), mais les tests M2 dédiés ne font pas partie du workflow général. Le raccordement CI reste hors périmètre, sous responsabilité M5.

**Aucun moteur, catalogue, QCM, sauvegarde ni workflow GitHub modifié. PR #263 DRAFT/HOLD.**

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P18** — analyser les sorties réellement terminées de la nouvelle suite complète (30 références, quatre candidats), corriger si besoin, puis décider objectivement de la clôture technique et du HOLD d'intégration. Ne pas fabriquer de validation en cas d'échec ou de processus incomplet.
