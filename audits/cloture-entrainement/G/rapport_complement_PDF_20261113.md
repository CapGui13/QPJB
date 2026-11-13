# Mission G — complément PDF du 13 novembre 2026 (non clôturé)

**Périmètre strict : Entraînement QPJB.** Aucune publication, aucun ajout d'exercice, aucun Quiz SEF modifié.

## Pièces disponibles et traitement

Archive originale retrouvée : `BridgeHebdo_originaux_2026-10-23.zip`, 280 PDF dont 140 corrigés. Les fichiers A/C/E de leurs branches respectives servent de référentiel : 859 sources Bridge Hebdo, 826 fiches publiées et 189 absents. Les arbitrages F (3 paires) et les audits historiques D **ne sont pas relancés**.

Le premier contrôle automatisé des 189 contre C a rapproché les mains structurées ; les corrections sont ensuite lues dans les PDF d'origine, y compris les pages secondaires. Un nouveau registre **189 lignes** documente l'avancement et les alertes sans déguiser les cas incertains en exercices validés.

## Redondances pédagogiques désormais étayées par les sources PDF

| Source `MANQUANT` | ID déjà publié | Preuve et nuance |
|---|---|---|
| `BH-037-S02-01` | `JC-BH-024-Q01` | Même `RDV2` face à `543`, même objectif (trois levées) et même impasse à l'As ; transposition de Trèfle à Cœur confirmée par BH-024 corrigé p.1 et BH-037 corrigé p.2 |
| `BH-061-S01-01` | `EN-BH-064-01` | Même choix 1♠ en intervention et même justification : la **main du sujet BH-061** contient ♠ARV75, mais son corrigé ♠ARV105, identique à BH-064 ; conserver la discordance du sujet dans la provenance |
| `BH-064-S01-03` | `EN-BH-061-03` | Même main et ouverture adverse 1♥, même vulnérabilité E-O **confirmée dans les corrigés**, même réponse 1♠ |
| `BH-064-S01-04` | `EN-BH-061-04` | Même main, 1♣ adverse, tous vulnérables, réponse Contre pour la forte intervention |
| `BH-082-S01-04` | `EN-BH-133-04` | Même main et séquence 1♣–1SA–?, réponse 3SA |
| `BH-134-S01-06` | `EN-BH-092-06` | Même main et séquence 1SA–2♣–2♥–4SA–?, refus quantitatif par Passe |

**Ces six cas sont des redondances pédagogiques par rapport à une fiche publiée ; les sources restent traçables et aucun exercice n'est supprimé.**

Deux autres cas ont les mêmes cartes que des fiches publiées mais des décisions différentes : `BH-004-2-S01-01` vs `JC-BH-004-2-Q01` (enchères vs plan de jeu) ; `BH-005-S01-01` vs `JC-BH-005-Q01` (enchères vs plan de jeu). Leur **autonomie est étayée**, mais la **justesse de l'enchère et son corrigé** n'ont pas encore été validés indépendamment.

## Divergences entre sujet et corrigé à expertiser

Une lecture géométrique automatisée a porté sur **123 situations S01** : **42 mains identiques**, **20 différences apparentes** et **61 non comparables fiablement**. Les vingt différences sont répertoriées individuellement dans `alertes_20_ecarts_apparents_sujet_corrige_S01_20261113.csv`. Elles ne prouvent pas toutes une erreur de source, car extraction et structure des pages peuvent introduire des erreurs. Les cas déjà documentés par les audits historiques ne sont pas réaudités, mais conservés comme alertes connues.

Les autres situations sont hors de ce balayage S01, notamment les jeux de la carte sur pages secondaires. Un contrôle antérieur a extrait quelques donnes complètes de 52 cartes, mais **cela ne démontre ni l'exactitude d'un plan, ni sa non-redondance**.

## Total à cette étape

| Statut G pour les 189 | Nombre |
|---|---:|
| Redondance étayée par correspondance de décision + PDF | **6** |
| Même donne, **décision autonome** | **2** |
| BH-041 Avancé : **corrigé introuvable**, correction bloquée | **9** |
| Absence d'équivalence et/ou justesse **non conclusives** | **172** |
| **Total** | **189** |

Les 9 BH-041 Avancé : `BH-041-AVANCE-S01-01` à `BH-041-AVANCE-S01-08` et `BH-041-AVANCE-S02-01`. Ne pas inventer de réponse, ni confondre avec BH-041 Débutant.

**Le chiffre de 172 n'est ni un nombre d'exercices intégrables ni un nombre de doublons.** La comparaison exhaustive de chaque décision avec les **826 fiches**, y compris les formats non structurés, et la vérification indépendante des corrigés des cas non redondants ne sont pas encore conclues. **Il n'existe donc pas encore de liste définitive d'intégrables pédagogiquement validés.**

## Livrables complémentaires de la PR

- `registre_189_reevaluation_pdfs_20261113.csv` : tous les 189 IDs, leur source exacte, le rapprochement justifié et le statut de correction.
- `alertes_20_ecarts_apparents_sujet_corrige_S01_20261113.csv` : différences d'extraction à arbitrer, sans réparation hypothétique.

**PR en brouillon, sans fusion. Aucune modification sous `entrainement/`, aucune publication.**
