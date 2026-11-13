# Mission F — Arbitrage ciblé des redondances Entraînement
**Date :** 13 novembre 2026 · **Dépôt :** `CapGui13/QPJB` · **Périmètre :** Entraînement seulement · **État :** décisions documentaires proposées, sans édition du catalogue.

## Entrées documentaires réellement examinées

- **A** : [inventaire des originaux Bridge Hebdo](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-A-20261113/audits/cloture-entrainement/A/inventaire_exercices.csv) et [rapport de source](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-A-20261113/audits/cloture-entrainement/A/rapport_sources_examinees.md).
- **B** : [inventaire Bridge & Mois](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-B-20261113/audits/cloture-entrainement/B/inventaire_bridge_et_mois.csv) ; **aucune redondance à examiner** identifiée par E dans ce corpus, donc aucun cas B réaudité.
- **C** : [catalogue de référence](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-C-20261113/audits/cloture-entrainement/C/catalogue-entrainement-main.csv), notamment `JC-BH-001-Q01` (plan de jeu à 3SA).
- **E** : [décisions à prendre](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-E-20261113/audits/cloture-entrainement/E/decisions_redondance_et_autonomie.csv), [rapprochement exhaustif](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-E-20261113/audits/cloture-entrainement/E/rapprochement_sources_qpjb.csv) et [rapport E](https://github.com/CapGui13/QPJB/blob/audit/entrainement-cloture-E-20261113/audits/cloture-entrainement/E/rapport_mission_E.md).

E signale **5 situations « REDONDANCE À EXAMINER »**, toutes rattachées à **BH-001/BH-002**. Leurs comparaisons impliquent une sixième situation témoin, `BH-001-S01-02`, déjà intégrée. **Trois couples pédagogiques ont été arbitrés ; aucun autre groupe n'a été examiné.**

## Donne et structure communes

Les deux sujets originaux du **12 novembre 2021**, n° 1 et n° 2, proposent la même donne partielle à deux mains :

| Main | ♠ | ♥ | ♦ | ♣ | Distribution |
|---|---|---|---|---|---|
| Nord | 853 | A86 | A653 | V42 | 3-3-4-3 |
| Sud | A92 | RV7 | RD84 | A65 | 3-3-4-3 |

Donneur : **Sud**. Les deux sujets posent (1) la séquence d'enchères puis (2) le plan de jeu sur l'entame du **6♠**. Le second comporte en supplément un cadre de diagramme/enchères vierge ; les mêmes cartes et les mêmes demandes sont présentes. Les deux corrigés contiennent en plus une question explicite de défense **en troisième position** : quelle carte doit fournir Est sur l'entame du 6♠ ? Les deux extraits A donnent la **Dame de ♠**, supérieure à la carte du mort.

Les PDF BH-001 et BH-002 ont des **SHA-256 distincts** (il s'agit de fichiers distincts) ; ceci **n'implique pas** une différence pédagogique. Les empreintes et noms exacts de chaque sujet/corrigé sont conservés pour chacune des six situations dans le CSV joint. Les différences visibles dans la transcription sont de présentation et de transition éditoriale ; aucune autre décision ou nuance pédagogique indépendante n'est attestée par A/E pour BH-002.

## Verdicts motivés

| Groupe | Comparaison | Verdict | Source ou ID à conserver | Conséquence |
|---|---|---|---|---|
| **F-01 — enchères** | `BH-001-S01-01` ↔ `BH-002-S01-01` | **REDONDANT CONFIRMÉ** pour BH-002 ; **DISTINCT** pour la décision d'enchères | **`BH-001-S01-01`**, ID QPJB non encore attribué | Conserver le premier original pour une future intégration ; ne pas intégrer sa copie BH-002 |
| **F-02 — plan du déclarant** | `BH-001-S01-02` ↔ `BH-002-S01-02` | **REDONDANT CONFIRMÉ** pour BH-002 ; premier déjà **DISTINCT** et intégré | **`JC-BH-001-Q01`** (source `BH-001-S01-02`) | Ne pas intégrer le second exemplaire ; conserver le QPJB existant |
| **F-03 — défense en troisième position** | `BH-001-C02-01` ↔ `BH-002-C02-01` | **REDONDANT CONFIRMÉ** pour BH-002 ; **DISTINCT** pour la décision de défense | **`BH-001-C02-01`**, ID QPJB non encore attribué | Conserver le premier original pour une future intégration ; ne pas intégrer sa copie BH-002 |

**Raison principale de conserver trois compétences, malgré une même donne :** l'élève prend trois décisions à des instants et pour des joueurs différents : construire la séquence d'enchères, établir le plan de jeu du déclarant à 3SA, puis fournir la carte du défenseur en troisième position. Ce ne sont **pas** trois variantes d'une même question. En revanche, à l'intérieur de chaque couple BH-001/BH-002, cartes, conditions, question et technique se recoupent sans valeur pédagogique supplémentaire prouvée. On conserve par défaut **BH-001**, première source numérotée et déjà ancrée dans QPJB pour le plan de jeu.

## Comptage réel

- **5** situations signalées par E comme candidates à la redondance.
- **3** de ces 5 = **REDONDANT CONFIRMÉ** : `BH-002-S01-01`, `BH-002-S01-02`, `BH-002-C02-01`.
- **2** de ces 5 = **DISTINCT**, absentes du catalogue : `BH-001-S01-01` (enchères) et `BH-001-C02-01` (flanc).
- **1** situation témoin déjà intégrée = `BH-001-S01-02` → `JC-BH-001-Q01`.
- **0** situation « À ARBITRER » **dans ces trois couples**, au niveau de l'équivalence pédagogique.
- **3 redondances confirmées au total**, correspondant à **3 copies originales à ne pas intégrer** (et non à 3 suppressions du catalogue).
- Le rapprochement E conservait **189** situations `MANQUANT` hors de ce groupe ; **2** situations distinctes sont ici libérées de la catégorie « à examiner ». Le reliquat à intégrer peut ainsi être estimé à **191 situations distinctes documentées** (189 + 2), **sous réserve des autres travaux éditoriaux et des limites documentaires déjà signalées par E**. Il ne s'agit pas de 191 exercices créés ni publiés.

## Ce que F ne tranche pas

Les **6 divergences sujet/corrigé Bridge & Mois** décrites par E sont des **ambiguïtés de source**, pas des doublons attestés. Les **7 interrogations explicatives BH** et **2 questions complémentaires BM** hors inventaires sont des cas **d'autonomie pédagogique à statuer**, pas des groupes comparatifs explicitement marqués redondants. Aucun de ces 15 sujets n'est arbitrée ici. Les 189 autres absences et la qualité des corrigés ne sont pas réauditées.

## Verrous de sécurité et livrables

- **CSV** : `audits/cloture-entrainement/F/comparaisons_redondances.csv` — **6 lignes de sources originales regroupées en 3 couples**, verdict individuel, cartes, conditions, motivation, copie à conserver, ID QPJB existant si disponible, nom exact des PDF et empreintes SHA-256.
- **Rapport** : ce fichier.
- **Aucune suppression, aucun nouvel exercice, aucune modification de source, catalogue, code ou PDF.**
- **Quiz SEF non consulté ni modifié.**
- Les décisions sont proposées pour validation lors de l'intégration future, et **aucun retrait du catalogue n'est autorisé**.
- Branche de travail : `audit/entrainement-cloture-F-20261113`. PR laissée **en brouillon, sans fusion**.

**Limite :** cette mission statue à partir des transcriptions et rapprochements A/C/E, qui comportent les deux mains, les questions et les extraits des corrigés ; elle ne constitue pas une nouvelle relecture intégrale des PDF ni un audit du fond des solutions, expressément exclus du mandat.