# QPJB V2 — Préparation du correctif 4 QCM (HOLD)

**20 novembre 2026 · proposition de modification, jamais une validation de publication.**

Cette branche contient un correctif **documenté, simulé et vérifiable**, sans altérer `quizz.html`, le moteur V2, les 1 523 QCM publics, leurs sauvegardes ou le déploiement GitHub Pages. Les corrections ne sont **pas appliquées**.

## Périmètre autorisé si validation éditoriale ultérieure

- `SEF-V416-008` : après Stayman `1SA–2♣–2SA`, proposer `4♣→4♥` pour faire jouer l'ouvreur ; modifier la consigne, les choix, la réponse et l'explication.
- `SEF-V416-009` : même structure avec `4♦→4♠`.
- `SEF-L25-007` : conserver la réponse `2SA`, clarifier seulement l'explication du Texas Trèfle avec `♣R103`.
- `SEF-L06-029` : conserver **tout** le QCM et son thème source `sa` ; proposer une classification V2 distincte « Ouvertures conventionnelles / barrages ».

**Source :** `main` à `a0ffaed6e49ab7259de800773a4ee384be755339` ; blob exact `quizz.html` `dfd1f21dfc3c2256b066b36b777c437d2973e895`.

**Fichiers :** `Docs/PARCOURS_V2_CORRECTIONS_4_QCM_HOLD_20261120.json` décrit les modifications à relire ; `scripts/v2-editorial-dry-run.cjs` en effectue une simulation **en mémoire seulement** et bloque si la source ou un exercice a changé.

### Test

```sh
node scripts/v2-editorial-dry-run.cjs
```

Ce test vérifie l'identité de la source, les empreintes des quatre QCM, l'unicité des 1 523 IDs, les champs autorisés et les options/réponses ; il interdit les changements de mains, de points, d'enchères, du thème source et de tout QCM hors périmètre.

**Statut :** `editorialApproval=PENDING`, `approved=false`, `releaseDecision=HOLD`. Ne pas fusionner cette PR sans décision pédagogique explicite et sans stratégie de conservation des sauvegardes élèves. Les 15 autres cas de la revue des 19 restent en attente de confirmation pédagogique dans la PR #214.

Voir les propositions détaillées et la revue HTML de la [PR #215](https://github.com/CapGui13/QPJB/pull/215).
