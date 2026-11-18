# QPJB V2 — Phase M : contre-test du mélange, protection de la variété
**18 novembre 2026 — PR #214, branche d'audit uniquement.**

## 1. Mesures réelles de la phase L (neuf simulations de réponses fictives)
Source : **GitHub Actions** « QPJB Training smoke » run **44382955713**, job d'intégrité **135079844258**, et le script `scripts/parcours-v2-variete-l.cjs` — neuf scénarios (3 profils synthétiques × 3 graines fixes), 45 séances × 10 QCM.

| Indicateur sur 450 présentations par scénario | V2-F (référence) | V2-L (injection systématique) |
|---|---:|---:|
| Familles indépendantes rencontrées | **440 à 450** | **413 à 426** |
| Rubriques différentes en moyenne par séance | **5,64 à 7,38** | **5,71 à 6,96** |
| Rappels ciblés effectués | **69 à 77** | **67 à 78** |
| Séances ayant ≥4 fois la même réponse | **0** | **0** |
| Injections ciblées | **0** | **43** |

L'écart de V2-L par rapport à V2-F est de **−17 à −27 familles**, en moyenne **−23,56 familles distinctes** par scénario. La moyenne de rubriques différentes par séance recule d'environ **0,16** dans la comparaison scénario par scénario ; la moyenne des rappels recule d'environ **0,22**, avec un cas à −6. Le moteur L a entraîné une couverture de seulement **21/22 rubriques** dans deux scénarios, contre 22/22 pour la référence.

**Décision : ne pas déployer V2-L ni imposer une fondation par séance.** La diversité n'est pas à confondre avec un nombre de notions épinglées. En outre, ce sont des parcours fictifs : cette mesure technique ne démontre aucune meilleure mémorisation.

## 2. Variante M, expérimentation complémentaire

`scripts/parcours-v2-mix-m.cjs` **ne modifie pas la sélection V2-F dans le site public**. Il part des dix questions déjà sélectionnées et ne substitue un QCM **que si toutes** les conditions suivantes sont réunies :

- Séance ≥3 ; au plus une substitution, parmi les positions 7 à 10, sur un créneau d'exercice de pratique et non de rappel programmé.
- La famille du nouvel exercice est **encore inédite** dans le scénario, et son thème est absent des dix questions déjà tirées.
- La famille remplacée a déjà été vue dans les séances passées, **ou** la séance de référence présente au plus quatre thèmes différents.
- L'ancien thème reste présent au moins une autre fois dans la séance, de sorte que le remplacement augmente strictement le nombre de thèmes différents de la séance.
- Le cas candidat est issu d'une fondation classée `CANDIDATE`, ni conventionnellement litigieuse ni couvert par une seule famille, et sa difficulté reste dans la zone d'introduction autorisée.
- Aucune répétition de famille ni quatre réponses identiques dans la séance résultante ; la substitution évite aussi les concepts dont une révision est déjà à échéance.

La variante M ne promet **pas** une amélioration globale ; elle est plus rare par construction. C'est une expérience de validation à froid qui doit être abandonnée si elle dégrade la couverture, les rappels, l'ordre des prérequis ou la lisibilité pédagogique.

## 3. Contrôles
- `node tests/quizz-v2-mix-m.cjs` vérifie la reproductibilité, les QCM originaux, les familles uniques par séance, le nombre maximal de substitutions et l'absence de maîtrise fictive.
- `node scripts/parcours-v2-variete-m.cjs` compare neuf scénarios avec le même catalogue et les mêmes graines (référence V2-F, variante M). Mesures : familles différentes, rubriques, rappels, quatre réponses identiques, injections et répétitions évitées.
- Les nouveaux scripts et tests sont ajoutés **uniquement** à la branche de la PR #214, sans effet sur les 1 523 QCM, leurs réponses, ni les sauvegardes.

**Statut : `V2-F_REFERENCE / V2-L_REJETE / V2-M_EXPERIMENTAL`**. Décision finale M subordonnée aux résultats du workflow du dernier commit.
