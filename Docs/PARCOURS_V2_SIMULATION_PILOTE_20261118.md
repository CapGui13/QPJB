# Parcours V2 — phase F : simulation isolée de tirages (sans déploiement)

**Date : 18 novembre 2026 — expérimentation algorithmique, non une validation pédagogique.**

Ce pilote utilise les **1 523 QCM du Quiz SEF existant**, les **79 annotations candidates SA/Stayman/Texas** (14 + 65) et le moteur **V1.10** en lecture locale pour comparer les tirages. Il ne modifie ni les QCM, ni leurs corrigés, ni le JavaScript du parcours publié, ni les sauvegardes, ni les scores réels d'élèves.

## Exécution

```bash
node scripts/parcours-v2-pilot.cjs --sessions=65 --seed=13 --check
node scripts/parcours-v2-pilot.cjs --sessions=65 --seed=13 --fragile-mineures --check
node tests/quizz-v2-simulation.cjs
```

La sortie est un **JSON** sur la console. La simulation est reproductible avec sa graine (`--seed`). Les réponses sont fictives : profil `balanced` ≈83 % de réussite calculée par empreinte déterministe et profil `fragile-mineures` ≈60 % pour les ouvertures mineures / réponses à une mineure, contre ≈83 % ailleurs. Ces taux sont une **hypothèse** de simulation, pas une statistique pédagogique.

## Principes testés

1. **Début sans tunnel de 40 ouvertures** : première séance de dix choix d'ouvertures variés; dès la seconde, alternance entre choix d'ouverture, réponses à **1♣ et 1♦** et réponses à **1♥ et 1♠**. Des réponses à 1SA sont ensuite accessibles.
2. **Variété** : bonus aux QCM non vus, pénalités aux décisions et contextes répétés; au plus une occurrence d'une même famille originale dans une séance. La préférence pour des familles non vues récemment n'est pas une interdiction éternelle : on conserve la possibilité de réviser.
3. **Révisions** : après un échec fictif sur une notion, une reprise est envisagée deux séances plus tard sur **une autre famille pédagogique**, quand il existe une famille distincte. Une seule observation de notion par séance est comptabilisée pour la simulation; une erreur ultérieure l'emporte.
4. **Étagement** : les catégories proposées de Stayman/Texas sont introduites en simulation à partir des séances fictives 8, 12, 16, 20 ou 24 (numérotation humaine) selon le niveau provisoire de revue. Cela **ne crée aucun prérequis réel** et ne garantit pas que la notion soit validée.
5. **Comparaison** : on exécute aussi la vraie sélection V1.10 en mémoire avec les mêmes scénarios fictifs et on compare des mesures **descriptives** : nombre d'IDs et de familles distinctes, familles en double dans une séance, séances comportant quatre enchères identiques ou plus, distribution des choix d'ouverture.


## Mesures reproductibles — graine 13, 65 séances, 650 questions

Les calculs ci-dessous ont été obtenus **avec le véritable moteur V1.10**, le pilote V2-F et le **même catalogue** de 1 523 QCM. Ce sont exclusivement des simulations de tirages avec résultats de réponses fictifs ; **une plus grande diversité n'établit pas une meilleure mémorisation**.

| Indicateur | V1.10 profil standard | Pilote V2-F standard | V1.10 profil fragile sur mineures | Pilote V2-F fragile |
| --- | ---: | ---: | ---: | ---: |
| Questions sélectionnées | 650 | 650 | 650 | 650 |
| IDs distincts | 523 | **650** | 522 | **650** |
| Familles originales distinctes | 505 | **650** | 489 | **650** |
| Séances avec ≥4 réponses identiques | 2 | **0** | 1 | **0** |
| Réponses à 1♣ | 8 | **30** | 4 | **30** |
| Réponses à 1♦ | 8 | **28** | 54 | **28** |
| Réponses à 1♥ | 13 | **30** | 14 | **30** |
| Réponses à 1♠ | 8 | **27** | 7 | **27** |
| Réponses à 1SA | 16 | **35** | 8 | **35** |

Les choix d'**ouverture** sont également plus équilibrés : pilote standard **1♣ ×8, 1♦ ×12, 1♥ ×7, 1♠ ×8 et 1SA ×6**, contre **1♣ ×30, 1♦ ×26, 1♥ ×7, 1♠ ×11 et 1SA ×3** dans la V1.10 simulée. Le pilote couvre les **22 rubriques** sur le parcours complet ; le volume de certaines notions avancées reste à examiner.

**Attention à l'interprétation :** V1.10 pratique volontairement des rappels du même exercice et de la même famille, alors que ce premier pilote choisit quasi exclusivement des familles nouvelles tant qu'il en reste. Le gain de diversité est réel *dans cette expérience*, mais il ne dit rien sur la consolidation à long terme. Les révisions V2 se font par nouveaux exercices rattachés à une notion déjà vue (quand disponibles). Il faudra comparer les courbes d'acquisition sur de vraies séances volontaires, et pas seulement maximiser l'unicité.

### Défaut découvert puis corrigé pendant l'expérimentation

La première version du pilote imposait un créneau 1♣ dans chaque séance (65 apparitions de 1♣ contre 6 de 1♦) et réutilisait trop de familles. Elle **a été corrigée** : rotation des créneaux d'ouverture et élargissement vers d'autres thèmes lorsque les familles d'un créneau sont épuisées. Ce point est désormais couvert par `--check`.

## Limites et alertes

- Le simulateur n'utilise ni IA ni API externe, conformément au projet de moteur algorithmique autonome.
- Il n'a **aucune notion de maîtrise** ; aucun score de compétence validé, aucun déblocage de chapitre, aucune migration de sauvegarde.
- La taxonomie existante V1.10 identifie 903 QCM via une micro-compétence de contexte. La nouvelle annotation ne concerne que 79 QCM supplémentaires, sans les considérer déjà contre-expertisés selon le SEF.
- Les 25 micro-objectifs candidats de Stayman/Texas comportent **6 mono-exemples**; les erreurs/révisions simulées sur ces notions ne peuvent pas former une preuve autonome.
- Les objectifs pédagogiques SEF encore à arbitrer (Texas Trèfle après 1SA, 3SA gambling, transfert vs conclusion directe, conventions contrées) restent **des données du catalogue original** ; le pilote ne les corrige pas.
- Si des séances semblent préférer certains choix d'ouverture malgré les mécanismes de diversité, il faudra réviser les **quotas et pénalités du pilote** plutôt que d'en tirer une conclusion à partir d'une seule graine.

## Tests et conditions avant étude du déploiement

Le test `tests/quizz-v2-simulation.cjs` vérifie la correspondance des 79 annotations avec les IDs du catalogue, la reproductibilité, la présence des ouvertures 1♣/1♦/1♥/1♠/1SA dès le début, les réponses aux quatre ouvertures à la séance suivante, l'unicité des familles par séance et l'absence de QCM créés.

**Aucune mise en production ne sera décidée à partir des seuls résultats synthétiques.** Étapes à venir : lecture comparative des tirages, revue des points SEF ambigus, ajustements si nécessaire et test utilisateur volontaire sur une V2 de prévisualisation séparée.
