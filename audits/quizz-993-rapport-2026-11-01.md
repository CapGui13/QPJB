# Audit des quatre propositions du Quizz QPJB — 1er novembre 2026

## Périmètre

Relevé des **993 exercices SEF**, répartis en **22 rubriques**, soit **3 972 propositions** (993 bonnes enchères et 2 979 distracteurs).

**Principe pédagogique :** les trois mauvaises propositions doivent représenter des erreurs *compréhensibles* sur la force, la distribution, le fit, le palier ou les conventions, et non trois enchères absurdes. Elles doivent rester clairement fausses dans la situation donnée, avec le SEF comme référentiel unique, sans accords de paire supplémentaires.

## Modifications effectuées

Entre la version `prototype-2026-11-01-v4-30-libre-puis-qcm` et la version `v4-33-audit-pieges` :

| Mesure | Résultat |
|---|---:|
| Exercices conservés | 993 / 993 |
| Identifiants supprimés | 0 |
| Bonnes enchères modifiées | 0 |
| Distracteurs remplacés | **93** |
| Exercices avec au moins un distracteur amélioré | **83** |
| Contrôles de cohérence des quatre choix | 993 / 993 |

### Exemples représentatifs

| Problème | Avant | Après | Intention |
|---|---|---|---|
| 1SA et répondant très faible | 3SA | 2♦ | Mauvais Texas avec trop peu de Cœurs, plutôt qu'une manche manifestement exclue |
| 1m–1M–1SA avec 6–7 H | 3SA | 2♣ | Utilisation intempestive du Roudi |
| Réponse à un contre d'appel avec 3–7 H | 2SA | 2M avec saut | Confusion entre réponse minimum et saut invitant |
| Réponse à un contre d'appel avec 9–10 H | 3SA | 3M | Excès de soutien au lieu d'une réponse invitante adaptée |
| Sur une intervention adverse avec une main nulle | 3SA | 2M | Soutien insuffisant mais tentant |
| Stayman, majeure non trouvée | Saut à la manche opposée | Enchère au palier de 3 ou invitation à SA | Faire travailler le sens des réponses au Stayman |
| Drury et Roudi | Passe sur réponse artificielle | Repli ou invitation inadaptée | Comparer des décisions de continuation effectivement envisageables |

Les modifications n'ajoutent aucune convention qui nécessiterait un accord de paire particulier.

## Contrôle automatique après amélioration

Le contrôle systématique a comparé les enchères, les points H, la distribution, les séquences et les alternatives effectivement correctes dans d'autres exercices du catalogue. Une proposition peut rester très instructive sans jamais être correcte ailleurs.

| Catégorie indicative | Exercices |
|---|---:|
| Signal automatique favorable | **794** |
| Vigilance / à relire | **188** |
| Revue prioritaire selon les critères automatiques | **11** |
| **Total** | **993** |

**2 421 des 2 979 mauvaises propositions** sont aussi des bonnes réponses dans au moins un autre exercice avec une séquence normalisée identique. Cela suggère des choix pédagogiques contrastifs, mais ne suffit pas à prouver leur pertinence dans la main étudiée.

Le contrôle structurel existant vérifie également qu'il y a quatre enchères distinctes, que la réponse attendue est offerte et que les contrats non encore disponibles ne figurent pas parmi les choix. Aucun choix de contrat impossible n'a été détecté par ce contrôle, qui a lui-même des limites (par exemple l'interprétation de certaines enchères artificielles).

## Revue prioritaire : ne signifie pas « erreur confirmée »

Les onze exercices principalement signalés sont :
`SEF-V3-077-2`, `SEF-V44-045`, `SEF-V44-067`, `SEF-V44-068`, `SEF-V410-027`, `SEF-V413-002`, `SEF-V421-003`, `SEF-V421-005`, `SEF-V422-002`, `SEF-V423-006` et `SEF-V424-007`.

Ils présentent souvent des séquences peu représentées dans le reste de la base : aucun autre exercice ne démontre qu'une alternative y serait parfois la bonne. Plusieurs alternatives restent cohérentes comme **erreurs de débutant** : confusion entre soutien simple et invitation, absence de fit, mauvais usage du Spoutnik ou réponse à un contre d'appel.

**Point d'attention supplémentaire sur la réponse correcte elle-même :** l'exercice `SEF-V49-016` retient 2♣ Stayman après 1SA avec 6 H et deux majeures quatrièmes. Le seuil standard du Stayman mérite ici une revue spécifique, ainsi que la comparaison avec `SEF-V412-016` (5 H, Passe). La bonne réponse a été **laissée inchangée** pour ne pas modifier les résultats sans vérification approfondie.

## Ce que cet audit permet — et ne permet pas

- Tous les exercices ont subi des contrôles systématiques et les choix clairement caricaturaux les mieux identifiés ont été corrigés.
- L'audit n'est **pas** une certification manuelle indépendante de chaque enchère et de chacun des 2 979 distracteurs.
- Les jugements de force en HLD, de vulnérabilité ou de continuation conventionnelle peuvent dépendre d'informations absentes de certains énoncés.
- Un QCM avec trois erreurs très proches n'est pas toujours possible lorsqu'il s'agit d'un relais obligatoire : une erreur simple et instructive reste parfois préférable à une alternative artificiellement compliquée.
- Une revue pédagogique plus poussée devra prioriser les 188 cas en vigilance et vérifier que certains distracteurs séduisants ne constituent pas en réalité une deuxième bonne enchère.

## Documents et automatisation

- [Relevé des 993 exercices et de leurs quatre propositions](./quizz-993-propositions-2026-11-01.csv)
- [Données sources du Quizz](../quizz.html)
- [Script d'audit automatique](../tests/quizz-quality.cjs)

La suite de validation GitHub produit également deux fichiers `artifacts/quizz-content/qualite-993.csv` et `qualite-993.md` à chaque exécution, pour surveiller les évolutions futures.
