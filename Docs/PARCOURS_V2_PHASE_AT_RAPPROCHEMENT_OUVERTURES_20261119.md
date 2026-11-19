# QPJB — Phase AT : rapprochement des sources d'ouverture authentiques

**19 novembre 2026 · PR #214 en brouillon · lecture seule, sans mutation du Quiz SEF.**

## Résultat vérifié

L'exécution [GitHub Actions AT #44546391115](https://github.com/CapGui13/QPJB/actions/runs/44546391115) a lu le **vrai catalogue SEF (1 523 QCM)**, **les 638 QCM d'enchères d'Entraînement** et **les 139 originaux supplémentaires** du module à réponse libre. Elle a généré l'artefact [`qpjb-v2-at-candidats-ouvertures`](https://github.com/CapGui13/QPJB/actions/runs/44546391115/artifacts/14540562901), contenant un inventaire JSON détaillé, les 38 mains et leurs références de source.

| Corpus / critère | Effectif | Interprétation |
| --- | ---: | --- |
| Quiz SEF, catégorie « ouverture » | **84 QCM** | **55 familles** pédagogiques distinctes dans la classification actuelle |
| Entraînement, thème `ouverture` | **26 QCM** | 26 mains complètes |
| Entraînement, thème `barrage` | **12 QCM** | 12 mains complètes, inclut Passe ou 1♣ sur certaines situations |
| **Total des deux thèmes Entraînement** | **38 QCM** | **38 mains différentes**, toutes 13 cartes et avec référence de source |
| Mains identiques à un des 84 QCM SEF | **0** | Différence **des cartes**, pas preuve que la compétence soit nouvelle |
| Entraînement, niveau éditorial 1 | **26** | Niveau propre au module Entraînement |
| Entraînement, niveau éditorial 2 | **12** | Non directement comparable à la difficulté du Quiz SEF |
| Originaux complémentaires (réponse libre) | **139**, dont 92 enchères | Aucun de ces 92 prompts ne nomme explicitement une **ouverture autonome** dans le repérage lexical ; certaines séquences complètes commencent par une ouverture et nécessitent une revue manuelle |

**Attention : 38 mains nouvelles par rapport au Quiz SEF ne signifient pas 38 nouvelles compétences, 38 corrigés validés, ni 38 QCM à intégrer automatiquement.** Ce sont des candidats matériels, exclusivement à examiner.

## Provenance des 38 QCM d'Entraînement

Les 26 questions `ouverture` proviennent de :
- BH-058 : **2** exercices (IDs `EN-BH-058-01/02`) ;
- BH-067 : **6** (`EN-BH-067-01..06`) ;
- BH-086 : **6** (`EN-BH-086-01..06`) ;
- BH-096 : **6** (`EN-BH-096-01..06`) ;
- BH-114 : **6** (`EN-BH-114-01..06`).

Les 12 exercices `barrage` proviennent de :
- Bridge & Mois n°12 : **4** (`EN-barrage-001..004`, références `B12-1..4`) ;
- BH-049 : **3** (`EN-BH-049-02..04`) ;
- BH-078 : **3** (`EN-BH-078-01..03`) ;
- BH-032 : **2** (`EN-BH-032-P2-01/02`).

Les inventaires PDF de missions A/B confirment séparément que, dans la rubrique « choix de l'ouverture » de BH, **18 questions page 1** des fascicules 67/96/114 sont de l'enchère, alors que les **6 autres entrées** de ces mêmes fascicules sont des exercices page 2 de jeu/flanc. Pour Bridge & Mois n°12, **4** cas sont des décisions d'ouverture ; les deux autres suivent l'ouverture d'un autre joueur. Ces 22 décisions initiales sont déjà représentées parmi les 38 fiches Entraînement ; **ne pas les compter une deuxième fois**.

Le rapport documentaire des originaux Bridge Hebdo mentionne **140 couples de PDF Débutant** avec SHA-256 contrôlés, plus un n°41 Avancé **sans corrigé**. Les originaux Bridge & Mois inventoriés comprennent **23 couples de PDF** et **138 cas d'enchères**. Les PDF eux-mêmes n'ont **pas été relus individuellement dans la phase AT** : la preuve de la provenance des fiches est issue des champs et inventaires existants, avec statuts de relecture conservés.

## Statuts des 38 fiches : aucun accord pédagogique V2 automatique

| Statut d'Entraînement existant | Nombre |
| --- | ---: |
| `import_global_concordance_documentaire_relecture_pedagogique_requise` | **31** |
| `a_relire` | **3** |
| `transcrit_source` | **2** |
| `valide_edition_lot04_20261106` | **2** |

Même les deux `valide_edition` ne sont **pas validées pour le parcours V2** : l'adaptation du contenu, des choix et des explications, la notion visée et la conformité avec le système enseigné sont à revoir avant toute utilisation dans V2.

## Impact sur notre objectif

- **Augmenter la variété de mains faciles** : 38 candidats authentiques potentiels, sous réserve de validation unitaire.
- **Ajouter des décisions d'ouverture complexes pour les séances 25–65** : **aucune quantité confirmée à ce stade**. Les 38 fiches sont de niveau 1 ou 2 propre à Entraînement ; la catégorisation ne démontre pas un gain sur les niveaux avancés.
- **Réutiliser les 139 originaux** : ne pas transformer automatiquement une **séquence complète à réponse libre** en QCM isolé. Si une nouvelle décision d'ouverture est identifiée dans le PDF, isoler exactement la main, la position, le contexte et la correction imprimée. Vérifier l'absence de redondance pédagogique.
- **Exclure** toute source bloquée, notamment BH-041 Avancé sans corrigé.

**Décision : maintenir V2-F (moteur de référence) et la PR #214 en brouillon.** Conserver les 38 fiches dans une réserve de revue structurée, sans toucher au Quiz SEF ni au module Entraînement. Une éventuelle adaptation V2 serait un chantier distinct après contrôle des sources et validation de l'enseignante.

**Statut : `AT_38_MAINS_CANDIDATES / 0_DOUBLON_CARTE_EXACTE / 0_APPROBATION_V2 / MANQUE_OUVERTURES_AVANCEES_NON_RESOLU`.**
