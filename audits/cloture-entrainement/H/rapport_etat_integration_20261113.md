# Mission H — état vérifié de la clôture Entraînement (13 novembre 2026)

**Périmètre : Entraînement uniquement. Ne pas modifier Quiz SEF, ne pas fusionner / publier sans accord.**

## Comptabilité traçable (1 020 sources)

| Décision | Nombre |
|---|---:|
| Déjà publié, correspondance établie | 820 |
| Déjà publié, divergence documentaire connue | 6 |
| **À intégrer, distinct et jugé recevable par G (137) ou F (2)** | **139** |
| Source absente, incohérente ou réponse non validable | 46 |
| Redondance confirmée par G (6) ou F (3) | 9 |
| **Total des exercices originaux recensés** | **1 020** |

**826 fiches QPJB existent déjà sur main (638 enchères, 188 cartes, IDs uniques).** Cible théorique après les 139 intégrations : **965** (sous réserve de transcrire sans erreur chaque fiche). Les 46 bloqués ne doivent pas être comptés comme publiables, ni les 9 redondances.

## État réel de la mission H dans cette branche

- Nouvel exercice publié sur cette branche : **0**. Aucune application ou donnée d'exercice n'a été modifiée.
- Exercice corrigé sur cette branche : **0** ; les 75 cas « RÉSOLU » de D sont des décisions historiques déjà matérialisées, pas 75 corrections nouvelles. D comporte également 17 sources incohérentes documentées, 4 cas ouverts d'inventaire et 6 indéterminables.
- Décomptes, sources et décisions : chaque ligne du fichier `registre_tracabilite_1020.csv` couvre un exercice source de A/B, avec son statut E, F/G, sa justification, son PDF et ses SHA-256.
- `matrice_transcription_139.csv` rassemble les 139 candidats distincts, leur énoncé/extraction, la réponse brute lorsqu'elle est disponible, les extraits du corrigé et les notes de G/F. **Ce sont des éléments de transcription, pas des fiches déjà validées pour l'interface.**
- Sur les 137 candidats G, **46 n'ont aucune réponse imprimée isolée dans le champ dédié**. Les extraits de preuve du rapport G sont limités (jusqu'à 650 caractères) et le texte des mains/séquences n'est pas toujours structuré. On ne peut pas les transformer mécaniquement en 137 QCM sûrs, sans risquer d'inventer une enchère, une main ou une explication. Les deux candidats F n'ont pas de grille de réponses applicative normalisée non plus.
- Aucune réserve de G ne doit être traitée comme une autorisation d'inventer des données. Les 9 exercices BH-041 Avancé restent bloqués en l'absence de leur corrigé.
- Les six divergences Bridge & Mois déjà publiées et les 154 anomalies de provenance recensées par E demandent une **correction éditoriale traçable**, mais ne représentent pas 154 exercices supplémentaires.

## Documents de référence non fusionnés

- A [PR #154](https://github.com/CapGui13/QPJB/pull/154) — 859 originaux Bridge Hebdo
- B [PR #153](https://github.com/CapGui13/QPJB/pull/153) — 161 originaux Bridge & Mois
- C [PR #150](https://github.com/CapGui13/QPJB/pull/150) — catalogue des 826 fiches
- D [PR #151](https://github.com/CapGui13/QPJB/pull/151) — 102 anomalies historiques
- E [PR #156](https://github.com/CapGui13/QPJB/pull/156) — rapprochement 1 020
- F [PR #158](https://github.com/CapGui13/QPJB/pull/158) — 3 redondances, 2 décisions nouvelles
- G [PR #160](https://github.com/CapGui13/QPJB/pull/160) — 137 intégrables, 46 bloqués, 6 redondances

## Condition non satisfaite — publication

**Ne pas fusionner cette PR comme une clôture éditoriale achevée.** Le registre de décision est exhaustif **sur le corpus identifié de 1 020 sources** ; en revanche, les 139 exercices recevables ne figurent pas encore dans les modules de l'application. Les limites des archives historiques (BH nº38 ancien, corrigé BH-041 Avancé, sources hors archives) empêchent aussi de certifier l'exhaustivité de publications jamais retrouvées.

L'étape restante n'est pas un nouvel audit pédagogique : c'est la **transcription technique des 139 cas validés depuis les originaux complets** et leur intégration dans `training-data-bidding.js`, `training-data-play.js`, `training-data.js`, avec mise à jour de `training-data-bootstrap.js` et validation Chromium/WebKit. Aucun résultat de tests de cette intégration n'est revendiqué ici.
