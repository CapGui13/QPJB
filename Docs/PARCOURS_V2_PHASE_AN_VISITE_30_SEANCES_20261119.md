# QPJB — Visite des 30 premières séances V2-F (phase AN)

**19 novembre 2026 · PR #214 · expérimentation hors production · moteur V2-F inchangé.**

## Ce qui est livré et comment l'examiner

L'outil `scripts/parcours-v2-visite-30.cjs` utilise exclusivement les **1 523 QCM originaux** de `quizz.html`, le moteur réel de simulation `scripts/parcours-v2-pilot.cjs`, et ses 79 annotations candidates. Il produit un **carnet HTML autonome**, avec 30 séances × 10 QCM pour **trois profils fictifs** : équilibré (graine 13), fragile sur les mineures (graine 29), très à l'aise (graine 47). Toutes les mains, séquences, propositions et justifications des 900 présentations sont celles du catalogue.

**Artefact vérifié par [GitHub Actions #44536343525](https://github.com/CapGui13/QPJB/actions/runs/44536343525/artifacts/14534959959)** : archive `qpjb-v2-visite-30-seances`, avec `visite-30-seances.html`, `visite-30-seances.json`, `synthese-30-seances.json`. Télécharger l'archive depuis la page GitHub Actions, décompresser et ouvrir le HTML dans Edge/Chrome. Aucune connexion au site ou modification de la progression réelle de l'élève.

Le test `tests/quizz-v2-visite-30.cjs` a confirmé **l'identité exacte, dans l'ordre, des 900 tirages avec V2-F**, la présence des IDs originaux, la conservation des mains et corrigés, les dix familles distinctes par séance et la validité syntaxique du script HTML. Ce test ne constitue **pas** une évaluation avec des élèves.

## Constats concrets sur 30 séances

| Mesure | Équilibré (13) | Fragile mineures (29) | Très à l'aise (47) |
| --- | ---: | ---: | ---: |
| Familles distinctes sur 300 QCM | 299 | 297 | 296 |
| Rubriques rencontrées / 22 | 17 | 17 | 16 |
| Rappels programmés exécutés | 47 | 46 | 40 |
| Séances avec 3 bonnes réponses identiques | 0 | 0 | 0 |
| Famille répétée à intervalle ≤ 3 séances | 0 | 0 | 0 |
| Questions issues des 19 alertes éditoriales | 0 | 0 | 1 |

Difficulté **éditoriale moyenne** (niveau 1 à 5 du catalogue, **pas** difficulté réelle mesurée) :

| Séances | Équilibré | Fragile mineures | Très à l'aise |
| --- | ---: | ---: | ---: |
| 1–5 | 1,18 | 1,18 | 1,16 |
| 6–10 | 1,56 | 1,54 | 1,52 |
| 11–20 | 2,11 | 2,11 | 2,09 |
| 21–30 | 2,63 | 2,55 | 2,59 |

**Force du moteur :** la diversité des bonnes réponses, des familles et des situations de réponse à l'ouverture est réelle dans ces trois tirages. Les rappels ciblés existent et n'entraînent pas de répétition d'une même famille dans une séance.

**Défaut à corriger en priorité :** les **choix d'ouverture directe** (`ouv:1♣`, `ouv:1♦`, `ouv:1♥`, `ouv:1♠`, `ouv:1SA` et `ouv:Passe`) deviennent très rares après la séance 20. Entre les séances 21 et 30, le total de ces six catégories est **1** dans le scénario équilibré, **4** dans le scénario fragile mineures, **6** dans le scénario très à l'aise. Les réponses à l'ouverture demeurent nombreuses : dans le scénario équilibré, 49 réponses aux cinq ouvertures 1♣/1♦/1♥/1♠/1SA sur cette fenêtre de 100 QCM. Cela **ne répond pas pleinement à la demande de garder des ouvertures de plus en plus élaborées entrelacées dans le parcours**.

**Autre point :** les 100 premiers QCM restent classés très faciles. Le score de difficulté moyen progresse mais les notes 4/5 n'apparaissent pas avant la 11e séance dans ces trois scénarios. Il faut juger la pertinence d'une éventuelle accélération sur les mains, pas imposer artificiellement des questions complexes ; les variantes X-mild et X-early ont déjà été rejetées pour régressions de diversité.

## Suite recommandée

1. Examiner dans le carnet, notamment les séances **1–5, 6–10, 21–25 et 26–30**, les familles d'ouvertures réellement présentées et la nature des nouvelles notions.
2. Mesurer, pour chaque séance, le **stock de QCM d'ouverture admissibles et de familles encore inutilisées** : distinguer une difficulté de sélection d'un manque de contenu source.
3. Créer **une variante isolée**, sans remplacer V2-F, qui réintroduit périodiquement le choix d'ouverture seulement lorsque des familles pédagogiquement distinctes sont disponibles, avec garde-fous : zéro doublon de famille par séance, maintien des rappels, réponses mineures, couverture et progression.
4. Comparer la variante sur **les mêmes profils/graines** et conserver V2-F si les nouvelles questions d'ouverture dégradent la diversité.

**Aucune modification de `quizz.html`, `quizz-parcours.js`, des corrigés, des sauvegardes, ni du site publié.** PR #214 en brouillon.

**Statut : `30_SEANCES_EXAMINEES / JOURNAL_HTML_TELECHARGEABLE / OUVERTURES_APRES_S20_A_AMELIORER / V2_F_REFERENCE`.**
