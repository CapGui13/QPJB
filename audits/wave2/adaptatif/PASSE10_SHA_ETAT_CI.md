# M2 — PASSE 10 : vérification indépendante des SHA et état CI

**PASSE 10 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Vérification indépendante : défaut de la passe 9 bien corrigé

Sur le code réellement lu de `wave2/adaptatif-20261121` :

- Implémentation SHA-1 indépendante en JavaScript V8, validée avec le vecteur de test `sha1("abc") = a9993e364706816aba3e25717850c26c9cd0d89d`.
- Blob Git `quizz-parcours.js` calculé : **`d0f06f1c259f7a766f2d1c8c47289374a74138dc`**, identique à la base de référence.
- Blob Git `quizz.html` calculé : **`9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`**, identique à la base ; aucune modification des 1 523 QCM/22 rubriques.
- Reproduction **des mêmes transformations textuelles** que le test historique `tests/quizz-parcours-lot-b.cjs` (retrait blocs LOT_B `EVIDENCE`, `PICK`, `SCORE`, `DIVERSITY`, neutralisation du tail de score, neutralisation des 4 motifs homologués) : Git SHA calculé **`504450f6254e91927c6945ac42dfc15c995fdaf9`**, **égal au SHA attendu** dans le test qui avait échoué avant P9.
- Le défaut de hash `5b6a93...` constaté par GitHub Actions avant restauration **ne se reproduit plus** avec la source exacte courante. Cette vérification est indépendante du test CI, mais n'est pas un substitut à l'exécution complète des scénarios historiques dans Node.

## État GitHub à cette passe

- PR #263 : **ouverte, brouillon / HOLD**, tête au contrôle `ccd345d4e242f95f5590b22d9d73fa1e0d65fd0f`, base `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`, aucun merge.
- Diff de branche : **42 fichiers**, **tous** sous `tests/wave2-adaptatif-*` ou `audits/wave2/adaptatif/**`, aucun changement produit, ni workflow ni tests historiques modifiés ; 50 commits d'avance, 0 derrière.
- Workflow GitHub Actions « QPJB Training smoke » run `44953350845` (tête P9) : `queued`, les jobs de syntaxe, simulations V1 et navigateurs **non terminés** au dernier contrôle. Les dernières têtes d'audit provoquent d'autres exécutions, mais **aucune conclusion verte sur la tête actuelle n'est revendiquée**.
- Les nouveaux tests M2 ne sont pas appelés par les workflows historiques, et notre périmètre interdit leur modification. `node --check` et les suites V8 ont été testés selon la grille des rapports ; la validation Node CLI ciblée reste à produire.

## Validation de reprise recommandée dans un checkout Node 22

```bash
node tests/wave2-adaptatif-invariants.cjs
node tests/wave2-adaptatif-selection-regression.cjs
node tests/wave2-adaptatif-resume.cjs
node tests/wave2-adaptatif-benchmark.cjs --json
node tests/wave2-adaptatif-candidates.cjs --variant score-cache --json --horizon 65 --seed 11
node tests/quizz-parcours.cjs
```

Les candidats `foundation`, `recall` et `overdue` sont conservés **uniquement en banc de recherche**, avec rejets documentés en P5/P4/P8. Aucun n'est implémenté dans le moteur. La variante `score-cache` reste utile pour un futur chantier où le verrou historique pourra être adapté par le responsable autorisé, mais **ne doit pas être forcée** dans ce périmètre.

## Reprise autonome précise

**PROCHAINE PASSE : P11**, selon états GitHub : relever le résultat réel de « QPJB Training smoke » sur un commit où le moteur est déjà restauré, relever les étapes Node et leurs logs ; corriger exclusivement dans notre périmètre si un nouvel échec est reproductible. Si les runners restent `queued`, laisser la PR HOLD et inscrire explicitement « CI non validé ». Si CI passe, conserver la réserve des nouveaux tests Node non inclus dans workflows et proposer une validation isolée sans enfreindre le périmètre. **Ne pas déclarer une mission définitivement terminée sur des tests non exécutés.**

**HOLD :** pas de fusion, pas de publication, pas de catalogue modifié.
