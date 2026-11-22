# QPJB — M1 / Passe 8 : contre-expertise des trois réserves de P5

**PASSE 8 FINIE (dossiers préparés pour validation, NON appliqués). MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## Périmètre
Relecture **des trois seuls QCM demeurés « à discuter » en P5**, sur le JSON embarqué figé (blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`). Les 36 dossiers historiques de la vague 1 restent exclus ; aucun élargissement artificiel de l'audit. Les revues antérieures (`REVUE_20_SOUTIENS_MAJEURS_2026-11-04.md`, `REVUE_59_REPONSES_MAJEURES_2026-11-04.md`) avaient conservé les trois bonnes réponses : il ne s'agit **pas** de réinvalider ces réponses.

## Reconstitution factuelle
| ID | Main (♠ ♥ ♦ ♣) | H vérifiés | Forme | Séquence | Réponse | Quatre choix distincts | Diagnostic |
|---|---|---:|---|---|---|---|---|
| `SEF-N051-2` | ♠932 ♥A62 ♦RV76 ♣R92 | 11 | 3-3-4-3 | Partenaire 1♥ | **2SA** | 2♥, 2SA, 1SA, Passe | Bonne enchère cohérente, précision de position souhaitable |
| `SEF-N056-1` | ♠V62 ♥864 ♦RD98 ♣RD7 | 11 | 3-3-4-3 | Partenaire 1♠ | **2SA** | Passe, 1SA, 2♠, 2SA | Bonne enchère cohérente, précision de position souhaitable |
| `SEF-N067-1` | ♠A109 ♥AV ♦D109754 ♣V6 | 12 (14 HL avec 6♦) | 3-2-6-2 | Partenaire 1♥ | **2♦** | 1SA, 2♥, Passe, 2♦ | Bonne enchère ; formulation « forcing pour un tour » à préciser |

**Vérifications structurelles :** 3 mains de 13 cartes, points H recalculés, formes conformes, 4 choix uniques par cas, bonne enchère présente, choix et réponse conservés.

## Arbitrage contradictoire et alternatives
1. **`SEF-N051-2`** — 3 ♥ et 11 HLD réguliers, 2SA fitté 11–12 HLD sans intervention si le partenaire ouvre en première ou deuxième position. `2♥` sous-décrit la force ; `1SA` masque le soutien et `Passe` n'exploite pas 11 H. **Réserve réelle :** l'énoncé ne précise pas la position d'ouverture, alors qu'un partenaire précédemment passé renvoie à une autre structure (Drury). **Proposition :** ajouter « ouvre de 1♥ en première position » ; réponse et explication inchangées.
2. **`SEF-N056-1`** — 3 ♠, 11 HLD et main régulière : même raisonnement. `2♠` ne promet pas la force invitante attendue, `1SA` omet le fit, `Passe` n'est pas pertinent. **Proposition :** préciser « ouvre de 1♠ en première position », sans changer la solution.
3. **`SEF-N067-1`** — 6 ♦, 2 ♥, 12 H et 14 HL en ajoutant les 2 points de longueur. `2♥` annoncerait un fit absent ; `Passe` sous-décrirait la force ; `1SA` n'est pas le meilleur choix avec une couleur sixième et la force suffisante pour `2♦`. **Proposition :** garder la réponse `2♦` mais expliquer expressément le `2 sur 1 auto-forcing` (sans prétendre qu'il est forcément forcing de manche).

## Sources et portée
- Club affilié FFB, *Quand la réponse de 2SA est-elle fittée ?* (21 décembre 2025) : en 1re/2e position sans intervention, 2SA = 3 atouts et 11–12 HLD ; autres positions traitées différemment. [Consulter](https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523).
- Document pédagogique hébergé FFB, *Les changements de couleur en 2/1*, page imprimée 8 : 11 H usuels (10 H possibles avec une sixième) et **forcing + auto-forcing**, le répondant reparle si l'ouvreur reste sous manche. [Source FFB](https://cdn.ffbridge.fr/cms/default/0001/08/e59ea4330e7ca327d0a950ee3adaa3528f173607.pdf).
- La position d'ouverture n'est pas enregistrée comme un champ autonome dans ces trois QCM. La modification du contexte est donc une **clarification pédagogique proposée**, non une preuve que la bonne enchère actuelle est fausse.

## Paquet complet non appliqué
`PROPOSITIONS_P8_HOLD.json` documente, pour chaque ID : main, points, forme, enchères, **texte intégral de l'ancien contexte et du corrigé**, 4 choix, réponse, niveau, raison, nouveau texte complet et champs impactés. Statuts des **3 propositions : À DISCUTER** (validation humaine séparée), **0 correction approuvée ou intégrée**. Le test `tests/wave2-pedagogie-cas-sef.cjs` vérifie les snapshots des enregistrements originaux et refuse toute dérive de choix/réponse/niveau/raison, ainsi que la présence dans les 36 dossiers.

**Limites :** pas de revue exhaustive des 47 IDs remplacés entre P3 et P7 ; ils restent à contre-expertiser par échantillons. Aucun résultat d'apprentissage élève inféré. **PROCHAINE PASSE : P9 — stress-test du manifeste P7 et contre-épreuve qualité/variété des 47 nouveaux ID, comparaison quantifiée à P3, tests négatifs.**
