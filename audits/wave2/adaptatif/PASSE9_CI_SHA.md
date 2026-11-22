# M2 — PASSE 9 : correction du défaut de CI historique, sans élargir le périmètre

**PASSE 9 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Défaut reproduit par le CI GitHub (vrai Node 22)

À la tête de PR `bd669a468d93d510a128233b0dd753a31604a709`, workflow « QPJB ergonomie — progression et quiz (HOLD) », run `44952973326`, job `136994759473` :

1. `node --check quizz-parcours.js` et `node --check tests/quizz-ergonomie.cjs` : **PASS** (Node 22.23.5).
2. `node tests/quizz-parcours.cjs` : première phase **PASS** (1 523 QCM, 22 thèmes, 65 séances, 522 IDs), puis **échec** au test historique `tests/quizz-parcours-lot-b.cjs` ligne 69 :
   - SHA reconstruit depuis le moteur modifié : `5b6a93cbd29addf92dfa0673f28a97f40968a8dc` ;
   - SHA historique attendu : `504450f6254e91927c6945ac42dfc15c995fdaf9`.
3. Le test retire les blocs LOT_B de la source puis compare exactement le blob historique ; **même une optimisation qui préserve les tirages** rompt ce contrat de bytecode source. Il est interdit de modifier `tests/quizz-parcours-lot-b.cjs` dans M2 : donc pas de contournement dans les tests historiques.

Ce défaut était une régression **de compatibilité avec le dispositif de contrôle**, non une modification de tirages démontrée. Il faut néanmoins le traiter comme une régression bloquante avant fusion.

## Correction livrée

- Commit `09e01b1723d2a67821b72127f905d804dbeb024b` : restauration exacte de `quizz-parcours.js` au blob historique `d0f06f1c259f7a766f2d1c8c47289374a74138dc`, confirmé via l'API GitHub. **Ce fichier ne figure désormais plus dans le diff de PR.**
- Optimisation de tri préservée **uniquement comme variante expérimentale** `--variant score-cache` sous `tests/wave2-adaptatif-candidates.cjs` (correctif syntaxique dans `20978f8e10670c3743d18ef5e1aba13a29a9f938`), et pas dans le moteur de production.
- Variante expérimentale `score-cache` sur échecs/65/graine11 : **29 indicateurs strictement identiques** à P7 avec 1 523 QCM et 22 thèmes ; 600 sélections × 5 profils / 12 séances du test `tests/wave2-adaptatif-selection-regression.cjs` encore **PASS** après restauration du moteur.
- Nouveau contrôle ciblé `tests/wave2-adaptatif-invariants.cjs` (commit `94f2feda8bf81345c900d0ea5ca767501d9ec667`) : demande explicitement à Node de vérifier les deux blobs Git et l'effectif 1 523/22. **Sa syntaxe a été contrôlée en V8, il n'a pas été exécuté sous Node sur un checkout complet**.
- Réexamen GitHub de la PR : **41 fichiers modifiés, 41 autorisés**, uniquement `tests/wave2-adaptatif-*` et `audits/wave2/adaptatif/**`. Catalogue `quizz.html` blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`, inchangé. Diff contre base initiale : 49 commits en avance, 0 en retard lors du contrôle, PR DRAFT/HOLD, non fusionnée.

## Validation et limites

Le test historique Node **a échoué avant** la restauration ; on ne doit pas appeler ce run « vert ». Le prochain run GitHub Actions était encore **queued** au moment du rapport. Le CI actuel exécute notamment `node tests/quizz-parcours.cjs`, mais ne lance pas automatiquement nos nouveaux fichiers `tests/wave2-adaptatif-*` et la mission interdit de toucher aux workflows. La commande Node dédiée sur un checkout complet reste nécessaire.

## Étape suivante

**PASSE 10 :** vérifier le run GitHub Actions de la tête restaurée, diagnostiquer tout échec restant, exécuter/valider autant que possible les preuves existantes ; si le CI demeure indisponible, établir un bilan de reprise précis et ne pas déclarer l'achèvement définitif. Ne pas forcer un nouveau changement de moteur pour améliorer artificiellement un benchmark au détriment du garde-fou SHA.

**HOLD :** pas de fusion, pas de publication, aucune modification des 1 523 QCM, 22 rubriques ou des 36 propositions pédagogiques.
