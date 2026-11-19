# QPJB V2 — Revue des 43 pistes d'ouverture (phase AW)

**19 novembre 2026 · PR #214 · lecture des originaux · aucun QCM créé ou modifié.**

## Résultat concret

La revue combine **38 QCM déjà présents dans Entraînement**, documentés par [AT](./PARCOURS_V2_PHASE_AT_RAPPROCHEMENT_OUVERTURES_20261119.md), et **5 décisions supplémentaires** détectées dans les PDF originaux **BH-035 p.2, BH-049 p.1 et BH-078 p.1**.

Parmi les cinq supplémentaires, **trois sont de vraies ouvertures fortes issues du BH-035** :

| Source | Main et décision imprimée | Notion candidate | Situation |
| --- | --- | --- | --- |
| `BH-035-S02-01` | 20 H / 21 HL annoncés, 5♥ et 4♣ → **1♥** | Bicolore fort : éviter 2♣ fort indéterminé pour décrire la main | À expertiser SEF |
| `BH-035-S02-02` | 19 H / 21 HL annoncés, 6♠ solides → **2♣** | Ouverture 2♣ fort indéterminé, unicolore puissant | À expertiser SEF |
| `BH-035-S02-03` | 17 H / 20 HL annoncés, 6♥ et 5♦ → **1♥** | Bicolore fort 6–5, anticiper la redemande à 3♦ | À expertiser SEF |

Les mains et les réponses de ces trois cas concordent dans le sujet et le corrigé originaux. Leurs deux empreintes SHA-256 de fichiers PDF ont été vérifiées contre l'inventaire Mission A et les pages correspondantes ont été examinées visuellement. **Ce contrôle de provenance ne vaut pas validation de conformité SEF 2024 ou du seuil de 2♣ retenu dans le système enseigné.**

Les deux autres questions d'ouverture, **`BH-049-S01-01`** (Passe avec sept Trèfles non assez solides pour barrer) et **`BH-078-S01-04`** (Passe avec sept Piques faibles et levées défensives), présentent une **divergence documentaire** :

| Source | Sujet original | Corrigé original | Verdict |
| --- | --- | --- | --- |
| `BH-049-S01-01` | ♦D42 | ♦V42 | **Quarantaine** ; le corrigé dit Passe |
| `BH-078-S01-04` | ♥R109 | ♥R104 | **Quarantaine** ; le corrigé dit Passe |

Les données exactes et les fichiers PDF/empreintes sont enregistrés dans [le manifeste AV](./PARCOURS_V2_PHASE_AV_ORIGINAUX_OUVERTURES_20261119.json). **Ne pas corriger les cartes à la place du document source** ; la main du sujet prévaut dans l'inventaire de travail.

Le [contrôle GitHub Actions AV #44549619023](https://github.com/CapGui13/QPJB/actions/runs/44549619023) a réussi : les **5 mains** ont 13 cartes, et **aucune n'est une main strictement identique** à une ouverture du Quiz SEF (84 QCM) ou à l'une des 638 fiches d'Entraînement en enchères. Cette preuve d'absence de doublon *de cartes* ne constitue **pas** une preuve de compétence nouvelle.

## Rapprochement pédagogique des 38 QCM déjà présents

Les 38 fiches d'Entraînement ont été classées dans **22 groupes de notions provisoires** selon leurs justifications. **12 groupes contiennent au moins deux QCM**, soit 28 exercices regroupés ; l'excédent arithmétique de **16 fiches au-delà d'un premier exemple par groupe** n'est **pas** une liste de 16 doublons avérés. Plusieurs peuvent présenter un contraste pédagogique utile selon le H, la distribution, la vulnérabilité ou la place.

Exemples de regroupements à examiner :

- **Cinq** QCM sur le bicolore majeur 5–5 et l'ouverture de la plus chère : `EN-BH-058-02`, `EN-BH-067-04`, `EN-BH-086-03`, `EN-BH-096-01`, `EN-BH-114-03`. Ne pas tous réutiliser dans une même progression sans justifier leur différence.
- **Trois** QCM sur l'ouverture de 1SA 15–17 H en main régulière : `EN-BH-067-01/02`, `EN-BH-096-03` (un honneur absent / mineure cinquième / force différente).
- **Deux** QCM d'ouverture mineure régulière 19 H : `EN-BH-067-06` et `EN-BH-114-04`.
- **Deux** QCM d'ouverture de barrage en mineure, couleur commandée : `EN-barrage-001` et `EN-BH-049-02`.
- **Deux** QCM « Barrage refusé car majeure 4e annexe » : `EN-barrage-003` et `EN-BH-049-03`.

**Précision importante sur les niveaux :** les 26 QCM `ouverture` sont classés niveau 1 dans Entraînement, mais certaines décisions sont plus subtiles que ce niveau ne le suggère. Vérifier notamment `EN-BH-114-05` (bicolore mineur fort à 20 H → 1♦), `EN-BH-096-06` (20 H et Carreau long → 1♦), `EN-BH-114-06` (19 H et mineure sixième, corrigé → 2SA **à confirmer selon le système**), ainsi que `EN-BH-067-06` (régulier 19 H → 1♣). Le niveau Entraînement ne doit donc pas servir de verrou de difficulté au moteur V2.

## Pourquoi les fascicules supplémentaires ne livrent pas davantage d'ouvertures

Lecture directe des tableaux de séquences :

- **BH-032 p.2 :** les deux premiers cas sont des ouvertures initiales, **déjà intégrés** dans Entraînement ; les quatre suivants sont des décisions après barrage adverse (intervenir / répondre), pas une ouverture libre.
- **BH-058 p.1 :** les deux premiers cas sont des ouvertures, **déjà présents** ; les quatre autres répondent à l'ouverture 1♣ du partenaire.
- **BH-049 p.1 :** les quatre premiers cas sont des ouvertures (dont le cas 1 manquant et divergent), les cas 5 et 6 répondent au 3♣/3♦ du partenaire.
- **BH-078 p.1 :** les quatre premiers cas sont des ouvertures (dont le cas 4 manquant et divergent), les cas 5 et 6 répondent au barrage 3♠ du partenaire.
- **BH-035 p.2 :** **cas 1–3 = ouvertures**, **cas 4–6 = réponses à l'ouverture forte 2♣** : ne pas gonfler le stock d'ouverture avec les six.
- **Bridge & Mois n°12 :** les quatre décisions d'ouverture sont déjà représentées dans Entraînement ; les deux derniers cas sont d'autres séquences.

Cette vérification évite de compter les mêmes situations sous deux noms ou de confondre ouverture, intervention et réponse. Le présent contrôle est **ciblé**, pas une nouvelle lecture exhaustive de tous les fascicules des archives.

## Décision de développement

1. **Aucune intégration automatique à V2** : la variante V2-F et les 1 523 QCM du Quiz SEF restent inchangés.
2. **Priorité éditoriale :** revoir les **3 ouvertures fortes BH-035** contre la fiche SEF 2024 / accords QPJB, puis les **4 ouvertures à main forte ou atypique** déjà présentes dans Entraînement.
3. **Déduplication pédagogique :** examiner les 12 groupes à plusieurs exercices ; conserver les variantes si elles illustrent une autre décision ou un contraste utile, pas uniquement parce que leur main est différente.
4. **Deux cas en quarantaine :** BH-049-01 et BH-078-04 ne sont pas proposés au moteur tant que leur carte discordante n'est pas explicitement arbitrée.
5. **BH-041 Avancé sans corrigé** reste exclu. Aucun exercice supplémentaire ne doit être attribué à cette source.
6. **Ne pas fusionner ni publier** la PR #214 : l'audit de provenance n'est pas une validation des 43 décisions et de leur place dans la progression.

**État : `38_EXISTANTS_REGROUPES_22_NOTIONS_CANDIDATES / 3_NOUVEAUX_FORTS_A_EXPERTISER / 2_SOURCES_DIVERGENTES / 0_QCM_INTEGRE / PR_DRAFT`.**
