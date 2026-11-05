# Quiz SEF QPJB — V4.88, lot 0 : 4 erreurs prioritaires de solution

**Date :** 5 novembre 2026.
**Base de départ :** commit main `222957df35b4331b0adbd93dccfe1088d08e9520`, blob `quizz.html` `780a7de4ffca46e92594b0c5dc09add79cdaab01`.
**Périmètre :** uniquement Quiz SEF et ses tests; aucune donnée `/entrainement/` modifiée.

## Corrections appliquées

| QCM | Ancienne solution | Nouvelle solution | Motif |
|---|---|---|---|
| `SEF-V44-060` | 2♦ | **1♦** | En réveil sur (1♣)–Passe–Passe, le SEF 2024 attribue à 2♦ la signification artificielle d'un bicolore majeur 5–5. Main unicolore à Carreau : 1♦ naturel. |
| `SEF-V416-012` | 3SA | **4♥** | Après 2SA–3♦ (Texas)–3♥, la rectification établit le fit cœur; 6 H en face de 20–21 H permettent de conclure à la manche majeure. |
| `SEF-V416-013` | 3SA | **4♠** | Même rectification fittée après 2SA–3♥–3♠. |
| `SEF-C-005` | 3♥ | **Passe** | Cinq Piques et 3 H ne garantissent pas la manche après 2SA. Sans fit, le Texas mènerait à 3SA en SEF 2024. |

## Références

- FFB / Université du Bridge : [Diaporama des changements du SEF 2024](https://bridgesarzeau.club.ffbridge.fr/document-download/660d6e418fbdc_DiaporamaChangementsSEF2024V3.pdf), **diapositive 23** (Texas sur 2SA : rectification fittée, réponse en cinq cartes avec force de manche) et **diapositive 29** (après (1♣)–Passe–Passe, 2♦ = bicolore majeur).
- iBridge : [Rectification du Texas après 2SA](https://xvm-167-89.ghst.net/public/fichedetails/391).

## Protection et suivi

- Nombre total d'exercices inchangé : **1 223**. Aucune nouvelle fiche ni suppression.
- La liste `tests/quizz-v488-approved-revisions.json` stocke avant/après des 4 QCM. Chaque modification est vérifiée **exactement** contre l'approbation déclarée; les autres exercices conservent leur empreinte historique à travers les tests V4.71–V4.87.
- Anciennes réponses, corrigés et choix conservés dans les champs `sourceOriginal*20261105V488` de chaque exercice.
- Progression de l'élève : les quatre réussites éventuellement enregistrées sont **archivées**, puis la maîtrise est remise à zéro sur ces **quatre IDs seulement**; tests navigateur pour vérifier la migration non réitérée et la conservation des autres exercices.
- Ne pas fusionner avant succès de tous les contrôles CI et des tests Chromium / WebKit, puis contrôle des tests sur `main` et publication Pages.
