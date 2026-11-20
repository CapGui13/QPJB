# QPJB V1 — contre-expertise ciblée, lot H (8 QCM)

**Date : 20 novembre 2026.** Suivi [#226](https://github.com/CapGui13/QPJB/issues/226).  
**Portée : documentation uniquement — aucune compétence activée, aucun QCM/corrigé modifié.**

## Méthode

Lecture directe des mains, séquences, réponses, explications et drapeaux des registres `audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json` et `audits/QPJB_V1_FINAL_ROUDI_38_PRECLASSIFICATION_20261120.json` (sources originales V1 recopiées et contrôlées en amont, voir PR #229 et #233). Vérification des conventions avec :
- [ABC du bridge — réponses à l'ouverture en majeure](https://abc-du-bridge.scenari-community.org/003-02/co/003-02-02.html) : soutien simple de **6 à 10 HLD**, passe **sous 6 HLD**.
- [Bridge Saint-Cloud — Roudi et inférences](https://bridgesaintcloud.fr/quesaquo1509.html) : **2♣ Roudi** possible avec une majeure sixième et **11–12 HL**, après redemande à 1SA.

Les sept premières mains sont toutes **4–3–3–3**, avec **5 H**, **exactement trois cartes d'atout** et **aucune courte ni atout surnuméraire** : elles valent ainsi 5 HLD selon l'évaluation standard dans ce contexte. Le problème détecté est **l'enchère antérieure de soutien simple 2M** qui figure dans la séquence, pas nécessairement la réponse finale demandée à l'élève.

## Résultats individualisés

| ID | Séquence source | Réponse V1 inchangée | Verdict de pré-expertise | Suite |
|---|---|---|---|---|
| `SEF-V4-009-1` | 1♥–2♥–2SA | 3♥ | **ANOMALIE DE PRÉREQUIS** : 2♥ annoncé avec 5 HLD (♥954) | Ne pas homologuer avant révision de la séquence ou de la main |
| `SEF-V4-011-1` | 1♥–2♥–2SA | 3♥ | **ANOMALIE DE PRÉREQUIS** : 2♥ annoncé avec 5 HLD (♥A76) | Même décision |
| `SEF-V4-021-1` | 1♠–2♠–2SA | 3♠ | **ANOMALIE DE PRÉREQUIS** : 2♠ annoncé avec 5 HLD (♠V32) | Même décision |
| `SEF-V4-023-3` | 1♠–2♠–2SA | 3♠ | **ANOMALIE DE PRÉREQUIS** : 2♠ annoncé avec 5 HLD (♠953) | Même décision |
| `SEF-V416-006` | 1♠–2♠–3♦ | 3♠ | **ANOMALIE DE PRÉREQUIS** : 2♠ annoncé avec 5 HLD (♠R93) | Même décision |
| `SEF-V418-006` | 1♥–2♥–3♣ | 3♥ | **ANOMALIE DE PRÉREQUIS** : 2♥ annoncé avec 5 HLD (♥V74) | Même décision |
| `SEF-V421-012` | 1♥–2♥–3♦ | 3♥ | **ANOMALIE DE PRÉREQUIS** : 2♥ annoncé avec 5 HLD (♥975) | Même décision |
| `SEF-L10-030` | 1♣–1♠–1SA | 2♣ | **RÉPONSE COHÉRENTE AVEC LE ROUDI DÉCRIT** : 6 ♠, 9 H + 2 L = 11 HL ; `difficultyReason` erronée (« répétition 6 cartes faible ») | Corriger ultérieurement **la métadonnée pédagogique**, conserver 2♣ et faire la validation complète de l'item |

## Distinction essentielle

Les sept réponses finales à 3♥/3♠ peuvent rester **logiques conditionnellement à un fit annoncé**, mais l'élève voit une séquence initiale incompatible avec les exigences SEF de soutien simple. **Ne pas changer automatiquement les sept bonnes réponses**. Une réparation éditoriale exige de reconstituer chaque main/séquence et de revalider les quatre choix proposés. Il n'est pas non plus rigoureux de déclarer les sept exercices « faux » en bloc, puisque la question porte sur **la réponse à un essai déjà formulé**.

Pour `SEF-L10-030`, la contradiction porte sur la seule justification de difficulté : la main de 11 HL choisit **Roudi 2♣**, non une répétition faible. Ne pas contaminer le groupe `roudi:repetition_faible`.

## Statut après cette pré-expertise

- **8/620 fiches examinées de manière ciblée** ; **0 homologation finale** et **0 activation V1**.
- **7 fiches bloquées pour une incohérence de séquence pédagogique** ; **1 fiche Roudi avec cohérence du choix et motif de difficulté à corriger**.
- Les **612 autres propositions** ne sont pas expertisées par ce lot. Les 903 micro-repères heuristiques n'acquièrent pas une homologation implicite.
- Suite suggérée : préparer une correction éditoriale explicitement approuvée des sept séquences, rectifier le seul commentaire de `SEF-L10-030`, puis procéder par petits lots SEF avec décision *confirmé / à corriger / ambigu* et preuve par ID. Ne modifier ni le moteur, ni `quizz.html`, ni les sauvegardes avant ces arbitrages.

**Coordination multi-instances :** ce document nouveau sur branche séparée ne recouvre aucun fichier des PR #231/#232/#233 ou du moteur V1. Pas de fusion automatique ni déploiement.
