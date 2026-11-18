# QPJB V2 — Phase S : priorité mesurée aux situations compétitives

**18 novembre 2026 · PR #214 · banc d'essai détaché de la plateforme publique.**

## 1. Vérification de R sur les 21 axes candidats

Les résultats suivants ont été lus dans les journaux de GitHub Actions **#44404334816**, job d'intégrité **#135155418222**, exécutant `tests/quizz-v2-extension-r.cjs` et `scripts/parcours-v2-observatoire-r.cjs`. Le job d'intégrité a conclu **success** ; les tests navigateurs sont suivis séparément.

**Neuf scénarios synthétiques** : trois profils de réponses fictives, trois graines, 45 séances × 10 QCM = 450 présentations par scénario. Aucune mesure d'élèves.

| Axe supplémentaire R, rattaché à des IDs originaux vérifiés | Présentations | Première séance de l'axe | Scénarios sans apparition |
|---|---:|---:|---:|
| Choisir l'ouverture 1♣ (6 QCM sources) | 3–4 | 4–8 | 0 |
| Choisir l'ouverture 1♦ (6 QCM sources) | 4–6 | 1 | 0 |
| Répondre après 1♣ (12 QCM sources) | 8–9 | 2–5 | 0 |
| Répondre après 1♦ (11 QCM sources) | 7–9 | 2–6 | 0 |
| Stayman/Texas contré par un Contre d'entame (6 QCM sources) | 0–3 | 31–45 quand présent | **5/9** |

**Attention à ne pas mélanger deux dénominateurs.** Les chiffres ci-dessus ne concernent que les **41 QCM cartographiés** en R. En revanche, si l'on compte **tous** les QCM du catalogue de 1 523 questions, V2-F propose durant les **cinq premières séances** de chacun des neuf parcours **3–4 ouvertures 1♣**, **3–4 ouvertures 1♦**, **5–6 réponses à 1♣** et **5 réponses à 1♦**.

Les neuf simulations de V2-F continuent à couvrir **22/22 thèmes**, **440–450 familles distinctes**, avec **69–77 rappels ciblés**, sans modification du moteur. Les ouvertures/réponses mineures sont donc déjà présentes assez tôt pour ne pas justifier une injection forcée. Les six conventions contrées relèvent d'une couche avancée, avec accord SEF à relire.

## 2. Question de recherche S

Les vraies situations compétitives étaient moins régulières dans l'analyse Q :
- Groupe « notre intervention / réponse après Contre » : **3–10 questions sources sur 450** ;
- Première exposition de ce groupe entre les **séances 15 et 28**.

Peut-on proposer à l'apprenant une situation de concurrence un peu plus tôt **sans dégrader** la diversité de familles, les 22 thèmes, les rappels ciblés et le mélange des réponses ?

### Prototype S isolé

Le fichier `scripts/parcours-v2-pilot-s.cjs` est une **copie expérimentale** de `scripts/parcours-v2-pilot.cjs`. Un test assure qu'elle ne diffère du moteur F que par **deux modifications** : (a) quatre créneaux cibles à la place d'un `any`, (b) reconnaissance explicite de ces deux types de créneau.

| Séance humaine | Sélection expérimentale souhaitée |
|---:|---|
| 13 | Choisir notre intervention sur une ouverture adverse au palier de 1 |
| 17 | Répondre après une ouverture du partenaire suivie d'un Contre adverse |
| 21 | Choisir notre intervention sur une ouverture adverse au palier de 1 |
| 25 | Répondre après une ouverture du partenaire suivie d'un Contre adverse |

Ces premières rencontres respectent les introductions préexistantes du simulateur : `intervenir` autorisé depuis l'indice de séance 10 et `apres_inter` depuis l'indice 14. La sélection laisse les positions d'ouverture et de réponse, ainsi que les deux créneaux de rappels, **intacts en intention** ; elle remplace uniquement un créneau général `any` dans ces quatre séances. Le sélecteur garde les filtres d'éligibilité, la diversité et les QCM originaux de la référence.

## 3. Comparatif reproductible et critères d'abandon

`scripts/parcours-v2-comparer-s.cjs` exécute le moteur F **et** la copie S sur les **mêmes neuf profils/graines × 45 séances**. Les deux utilisent les mêmes réponses fictives déterministes, calculées à partir de l'ID QCM et de la séance ; sélectionner une autre question peut changer la suite des rappels.

Mesures comparées :
- Date de première présentation de notre intervention et de la réponse après un Contre adverse ;
- Nombre d'exercices compétitifs durant les 25 premières séances ;
- Nombre de familles originales distinctes sur 450 questions, couverture de 22 rubriques et absence de quatre réponses identiques ;
- Nombre de rappels ciblés et maintien des occurrences 1♣, 1♦ ainsi que de leurs réponses pendant les 25 premières séances.

**Critères de rejet conservateurs :** S ne doit faire perdre **aucune** famille distincte, aucune rubrique, aucun rappel ciblé, aucune ouverture/réponse mineure sur les 25 premières séances et ne doit créer aucune séance avec quatre réponses identiques. Il doit augmenter les expositions compétitives précoces dans au moins **7 scénarios sur 9** pour simplement mériter une revue éditoriale.

Un échec de ces critères n'est **pas** un échec de la CI : la CI vérifie l'intégrité du banc d'essai et publie les chiffres. Dans ce cas, on **écarte S** et on conserve le moteur F.

`tests/quizz-v2-comparer-s.cjs` vérifie la stricte limite des deux changements, l'identité des douze premières séances, l'usage réel des quatre cibles, la conservation des QCM originaux, des règles d'introduction et l'unicité de famille dans les séances.

**Statut avant résultat de CI S : `S_NON_ACTIF_EN_COMPARAISON / F_REFERENCE / ZERO_DEPLOIEMENT`.**
