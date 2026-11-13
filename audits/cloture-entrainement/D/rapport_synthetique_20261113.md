# Mission D — clôture des anomalies historiques de l’Entraînement QPJB

**Date de constat : 13 novembre 2026**  
**Dépôt :** `CapGui13/QPJB` · **référence contrôlée :** `main` au commit `2e9e41c8538fbf5f154dbb86e05b907168cdc6bb`  
**Périmètre strict :** Entraînement (638 enchères, 188 exercices de carte, **826 identifiants uniques**). **Quiz SEF exclu.**

## Décision de clôture

Le rapprochement de **102 lignes de suivi historique** — anomalies, soupçons levés, incohérences des sources et anciens défauts techniques — fait apparaître **quatre seuls écarts d’inventaire appelant encore une décision**. Une ligne du registre n’est pas nécessairement une erreur avérée de l’application.

| Statut du registre | Nombre | Interprétation |
| --- | ---: | --- |
| **RÉSOLU** | **75** | Correction, clarification, vérification négative ou arbitrage déjà présent sur `main`. |
| **SOURCE_INCOHÉRENTE_DOCUMENTÉE** | **17** | Le PDF original contient un écart matériel, conventionnel ou stratégique documenté ; l’application le signale ou conserve l’arbitrage avec sa provenance. Ne pas « réparer » silencieusement les sources. |
| **OUVERT** | **4** | Exercice ou sous-question repéré dans un fascicule mais sans identifiant autonome dans le catalogue actuel ; décision d’inventaire et contrôle anti-doublon nécessaires, **sans ajout par la mission D**. |
| **INDÉTERMINABLE** | **6** | Ancienne réserve de convention non tranchable par les seules preuves historiques ; fiche publiée en auto-évaluation non notée, sans correction imposée ni audit général à relancer. |
| **Total** | **102** | **Ce total n’est pas le nombre d’exercices du catalogue.** |

Le fichier [`registre_anomalies_20261113.csv`](registre_anomalies_20261113.csv) contient pour chaque ligne : `ID, source, PR, nature, statut, preuve, action_restante`.

## Liste courte des décisions réellement ouvertes

| Identifiant absent de `main` | Constat historique | Suite limitée, confiée aux missions d’inventaire A/C |
| --- | --- | --- |
| **`JC-BH-037-M01`** | *Bridge Hebdo* n°37, p. 2 : position de maniement **♥RDV2 face à ♥543** ; les M02/M03/M04 existent, mais pas M01 ([rapport #149](../../ENTRAINEMENT_P1_BH037_039_056_057_2026-11-13.md)). | Vérifier s’il s’agit d’un exercice autonome et s’il existe déjà sous un autre ID ; proposer ensuite une décision d’inventaire. |
| **`EN-BH-061-01`** | Le premier exercice BH061 n’est pas présent comme QCM autonome ; une discordance de cartes est signalée dans le corrigé ([rapport #132](../../ENTRAINEMENT_P1_BH061_4_CONTEXTES_2026-11-11.md)). | Rapprocher sujet, corrigé et catalogue ; ne pas choisir des cartes par supposition. |
| **`EN-BH-085-06`** | La sixième question du fascicule BH085 n’est pas publiée ; seules les cinq autres ont reçu leur double étape forcing/enchère ([rapport #130](../../ENTRAINEMENT_P1_BH085_5_DOUBLE_COMPETENCE_2026-11-11.md)). | Confirmer l’autonomie de la sixième question et l’absence de doublon avant décision. |
| **`EN-BH-103-06`** | BH103, exercice n°6 (cue-bid 2♣) absent ; cartes du sujet et du corrigé contradictoires ([rapport #128](../../ENTRAINEMENT_P1_BH103_5_CONTEXTE_2026-11-10.md)). | Rapprocher les deux versions et vérifier un éventuel autre ID ; aucune correction hypothétique. |

**À retenir : quatre décisions d’inventaire, pas quatre exercices dont la création serait déjà autorisée.** Les missions A/B/C pourront également découvrir d’autres écarts sources/catalogue ; ce rapport D ne préjuge pas de leur inventaire exhaustif.

## Incohérences de source déjà traitées : ne pas rouvrir

- **`JC-BH-135-J01` — PR #146** : les deux PDF impriment **♣6 chez Nord et Sud**, sans ♣7. Sur `main`, les deux cartes litigieuses sont **masquées** et l’explication signale le défaut. Les neuf levées reconstituées dans le rapport reposent explicitement sur une **substitution hypothétique**, jamais sur une donne originale certifiée. [Preuve historique](../../ENTRAINEMENT_P1_BH132_BH135_2026-11-12.md).
- **`JC-BH-110-P2` — PR #144** : Nord ♣AV3 dans le sujet, ♣AV6 dans la solution ; la solution réutilise ♥2 et omet ♥4. La fiche avertit de ces écarts et n’attribue pas à l’original les treize plis calculés sur une **réparation hypothétique**. [Preuve historique](../../ENTRAINEMENT_P1_BH107_108_109_110_115_2026-11-12.md).
- **`JC-023` — PR #140** : ♠6 imprimé deux fois (Ouest/Sud) et ♠3 absent du corrigé. Le `quarantineReason` de `main` identifie précisément l’erreur, conserve les mains visibles et distingue les variantes jouées **sur une reconstruction hypothétique**. [Preuve historique](../../ENTRAINEMENT_P1_JC023_CARTE_DUPLIQUEE_2026-11-12.md).
- Même principe pour **`JC-BH-107-P2`** (♥6 dupliqué), **`JC-BH-109-P2`** (3SA prétendument assuré mais six plis défensifs possibles), **`JC-015`** (le corrigé évoque ♣R alors que ♣D manque), **`JC-020`** (impasse ♦V non garantie) et les divergences sujet/corrigé des enchères : les limites ou corrections documentaires sont maintenant expliquées dans les fiches. Les PDF originaux ne sont pas modifiés.

## Corrections et anciennes réserves dont la présence est confirmée

- **PR #130–#138** : doubles compétences BH085/BH086 ; vulnérabilités BH061 ; divergence BH088 ; contextualisations BH078/BH093 et B12/B20/B22 ; nuances et plans corrigés JC002/015/016/020.
- **PR #140–#142** : avertissement JC023, inférence conditionnelle de JC009, développement Pique de JC-BH-060-01.
- **PR #144–#146** : BH107–110 et BH115 ; vérifications négatives BH116/119/122/123/125 (notamment la critique **erronée** sur ♠V de BH123) ; BH132 et BH135.
- **PR #148–#149** : branches de maniement BH079/BH082 ; correction de la Dame sèche de **`JC-BH-039-M01`** ; autres maniements/plans BH037/039/056/057 validés dans les limites des sources.
- **PR antérieures #97, #121, #125, #127–#129 et quarantaines de novembre** : contexte restauré, systèmes d’enchères annoncés, origine des corrigés conflictuels archivée ; les anciennes quarantaines `JC-BH-014-Q01`, `JC-BH-028-Q04`, `JC-BH-036-Q02`, `EN-2sa-006`, `EN-BH-090-06`, `EN-suite-repondant-003` et `EN-BH-077-04` ne sont pas des anomalies encore ouvertes.
- **Quatre défauts techniques de l’audit du 29 octobre** : compteur des tentatives par visite, bandeau de sauvegarde immédiat, préservation du focus dans le filtre et dernière navigation demandée pendant un fondu. Les quatre mécanismes correctifs sont effectivement visibles dans `entrainement/training-app.js` sur `main`.

Six réserves conventionnelles anciennes demeurent **INDÉTERMINABLES**, sans fait nouveau justifiant une réouverture : `EN-1sa-008`, `EN-BH-048-03`, `EN-BH-092-05`, `EN-BH-115-05`, `EN-BH-019-04`, `EN-BH-025-01`. Les fiches en cause ont `reviewStatus=transcrit_source` : **auto-évaluation, non notation automatique**. Elles ne s’ajoutent donc **pas** à la liste des quatre décisions immédiates.

## Méthode et limites des preuves

1. Consultation des comptes rendus d’audit historiques déjà présents dans le dépôt et des PR concernées ; vérification de leur état de fusion, notamment **17 PR Entraînement fusionnées entre #130 et #149**. Les PR **#139, #143 et #147**, exclusivement Quiz SEF, sont délibérément exclues. #143 reste une PR brouillon Quiz SEF distincte.
2. Relecture en lecture seule des données de `main` à [ce commit](https://github.com/CapGui13/QPJB/tree/2e9e41c8538fbf5f154dbb86e05b907168cdc6bb/entrainement), des deux modules `training-data-bidding.js` et `training-data-play.js`, et des mécanismes de `training-app.js`. Comptage réel : **638 + 188 = 826 IDs distincts**. Les quatre IDs signalés `OUVERT` sont **absents** du catalogue contrôlé ; les autres IDs du registre, hors identifiants techniques, sont présents.
3. Les SHA-256 des PDF, leurs contradictions et les lignes de levées proviennent **des audits antérieurs cités**, et **non d’une nouvelle inspection des PDF** lors de cette mission. Les démonstrations sur donne modifiée sont conservées comme *hypothèses* et ne constituent pas des preuves de la donne originale ; une ligne légale ne prouve pas non plus une optimalité double-dummy universelle.
4. Cette consolidation **ne certifie pas pédagogiquement la totalité des 826 exercices** et ne prétend pas avoir refait les tests navigateur/CI. Elle certifie le rapprochement documentaire et la présence des dispositifs évoqués sur le commit examiné.

**Conclusion opérationnelle :** remettre uniquement les **quatre références absentes** aux équipes d’inventaire A/C pour décision. Ne relancer aucun audit déjà concluant sans **contradiction nouvelle et précise**. **Aucun ajout/suppression d’exercice, aucune modification de PDF, de catalogue, d’interface ni de Quiz SEF dans cette PR ; deux fichiers de documentation seulement.**
