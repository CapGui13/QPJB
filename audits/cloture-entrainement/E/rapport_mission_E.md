# Mission E — Rapprochement sources originales / catalogue QPJB Entraînement

**13 novembre 2026. Rapport documentaire, aucune création ni publication d'exercice. PR brouillon.**

## Sources et version vérifiées

- **A / Bridge Hebdo** : [PR #154](https://github.com/CapGui13/QPJB/pull/154), branche `audit/entrainement-cloture-A-20261113`, `A/inventaire_exercices.csv` : **859 situations**.
- **B / Bridge & Mois** : [PR #153](https://github.com/CapGui13/QPJB/pull/153), branche `audit/entrainement-cloture-B-20261113`, `B/inventaire_bridge_et_mois.csv` : **161 situations**, plus 2 sous-questions non arbitrées.
- **C / catalogue publié** : [PR #150](https://github.com/CapGui13/QPJB/pull/150), branche `audit/entrainement-cloture-C-20261113`, `C/catalogue-entrainement-main.csv` : **826 IDs uniques**, 665 Bridge Hebdo + 161 Bridge & Mois. Référence `main` au commit `2e9e41c8538fbf5f154dbb86e05b907168cdc6bb`.
- Comparaison GitHub à `main` `a6700c0f988832d9b4f728229ad1e6392bd54e3d` : 4 commits plus récents, **aucun** fichier de données Entraînement touché (uniquement `quizz.html`, `site-version.json` et `tests/quizz-integrity.cjs`).

## Résultat exhaustif sur les 1 020 sources individualisées disponibles

| Classe | Bridge Hebdo | Bridge & Mois | Total |
| --- | ---: | ---: | ---: |
| INTÉGRÉ sans contradiction de main déjà connue | 665 | 155 | **820** |
| MANQUANT dans QPJB | 189 | 0 | **189** |
| REDONDANCE À EXAMINER, non supprimée | 5 | 0 | **5** |
| SOURCE AMBIGUË (sujet/corrigé B différents) | 0 | 6 | **6** |
| SOURCE INACCESSIBLE parmi les lignes inventoriées | 0 | 0 | **0** |
| **Sources individualisées** | **859** | **161** | **1 020** |

**826 liens vers un ID QPJB** sont établis (665 BH et 161 BM), dont les six liens BM contradictoires marqués SOURCE AMBIGUË. Les **820** sont ceux sans contradiction de main déjà signalée. Aucun ID QPJB des 826 ne reste sans source appariée dans ce référentiel.

Le fichier `rapprochement_sources_qpjb.csv` expose chaque cas : source, fascicule, page, énoncé résumé, PDF exact, SHA-256, ID et référence QPJB, classification, preuve, réserves et action. Il ne remplace pas les documents originaux.

## Exercices non représentés

`exercices_manquants.csv` contient **189 exercices individualisés**, tous Bridge Hebdo. Cinq autres situations des fascicules BH-001/BH-002 sont à l'état **REDONDANCE À EXAMINER**, **sans** décider de leur suppression : énoncés/donnes très proches, mais équivalence pédagogique non établie.

Parmi les 189 absences, **9 concernent BH-041 AVANCÉ** (8 enchères + 1 flanc) : sujet original conservé, **corrigé introuvable**. Ces exercices sont bien absents de QPJB, mais **la correction ne peut être vérifiée**. Il ne faut pas les assimiler au BH-041 Débutant.

## Contrôle Bridge & Mois : erreur importante de références

- **138/138 enchères rapprochées sur la référence de cas ET le contenu exact de la main (4 couleurs)**. **136** QPJB reprennent la main du sujet ; **2** (`B03-3`, `B22-6`) reprennent le corrigé, alors que celui-ci diffère du sujet.
- **23/23 exercices de carte** rapprochés par correspondance **univoque du nom exact du PDF corrigé**, pas par le code `Bxx-carte` : **22/23 codes** d'origine contenus dans `reference_source` de QPJB sont faux pour ces cartes.
- Sur les enchères, **132/138 fiches** déclarent un numéro de fascicule et un nom de PDF corrigé qui correspondent à **un autre** fascicule que celui de l'exercice. Les six autres sont cohérentes. **154/161 fiches B** présentent donc au moins un défaut de provenance connu (132 références PDF/numéro pour les enchères, 22 codes de source pour les cartes).
- **6 divergences source sujet/corrigé** : `B03-3`, `B12-3`, `B16-3`, `B18-1`, `B21-4`, `B22-6`. Les quatre du milieu reprennent le **sujet** dans QPJB ; les deux premières/dernières citées B03-3 et B22-6 reprennent le **corrigé**. Le contenu canonique est à décider, sans écrasement d'une variante.

`ecarts_referencement_bridge_mois.csv` liste les **154 cas**, document original, document déclaré, référence QPJB, et variante de la main reprise.

### Six liens incertains pour les mains contradictoires

| Source B | Fiche QPJB | Version retenue dans QPJB |
|---|---|---|
| `B03-3` | `EN-1m-003` | corrigé |
| `B12-3` | `EN-barrage-003` | sujet |
| `B16-3` | `EN-bicolore-003` | sujet |
| `B18-1` | `EN-1sa-007` | sujet |
| `B21-4` | `EN-redemande-035` | sujet |
| `B22-6` | `EN-redemande-014` | corrigé |

## Contrôles Bridge Hebdo et limites

- **665/665** fiches Bridge Hebdo appariées de manière univoque sur le fascicule, l'index de cas, la page, le type, le texte de question et la référence QPJB, tout en tenant compte des changements de numérotation.
- **34/34** mains structurées des BH-126 à BH-140 publiées et comparables dans les deux inventaires concordent exactement sur les quatre couleurs.
- **8 rapprochements** présentent une typologie A/C différente : quatre cas `BH-017` (A « flanc », C déclarant), `BH-104-S01-05`, `BH-116-S02-01`, `BH-129-S02-01`, `BH-131-S02-01` (A « jeu_carte », C défense). Ces cas sont associés par numéro, page et énoncé, **pas** déclarés redondants. Les catégories doivent être harmonisées ultérieurement.
- Les inventaires A ont des sources textuelles ou visuelles attestées, mais **la comparaison automatisée des 665 lignes ne revalide pas indépendamment chaque carte des PDF**. Les 34 mains explicitement comparables sont contrôlées ; les autres appariements sont documentaires, fondés sur les cas/références/compétences. L'absence de doublon transversal ne peut pas être certifiée à partir des seules métadonnées.

## Décisions et sources non vérifiables

`decisions_redondance_et_autonomie.csv` comporte **20 points documentés** : 5 ressemblances BH non intégrées, 6 contradictions sujet/corrigé B, **7** questions explicatives dans les corrigés BH non comptées dans les 859 situations et **2** sous-questions B non comptées dans les 161 exercices. Les 9 dernières questions ne sont **pas artificiellement ajoutées** au total des 1 020.

`sources_inaccessibles_et_lacunes.csv` conserve les réserves : **fascicule historique BH nº38** (sujet et corrigé absents, existence non démontrée), **corrigé du BH-041 AVANCÉ** (inaccessible), et **périmètre hors archives du 23/10/2026** non démontré. La mission B atteste seulement ses 23 fascicules archivés. Aucun décompte d'exercices manquants supplémentaires n'est inventé pour une source non accessible.

**EXHAUSTIVITÉ GLOBALE : NON DÉMONTRÉE.** Résultat exhaustif **sur les 1 020 situations individualisées dans A/B**, pas sur tous les fascicules qui auraient pu exister.

## Livrables et verrou d'édition

`rapprochement_sources_qpjb.csv` (1 020) ; `exercices_manquants.csv` (189) ; `decisions_redondance_et_autonomie.csv` (20) ; `ecarts_referencement_bridge_mois.csv` (154) ; `sources_inaccessibles_et_lacunes.csv` (3) ; ce `rapport_mission_E.md`.

**Seulement des fichiers sous `audits/cloture-entrainement/E/`. Aucun exercice créé/publié ; aucun code, PDF, catalogue ou Quiz SEF modifié. PR brouillon : ne pas fusionner automatiquement.**
