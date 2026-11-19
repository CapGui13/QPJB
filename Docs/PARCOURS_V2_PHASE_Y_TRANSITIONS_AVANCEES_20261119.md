# QPJB — Phase Y : revue qualitative des premières transitions avancées

**19 novembre 2026 · PR #214 · Audit documentaire sur le parcours V2-F inchangé · aucune publication.**

## Pourquoi cette phase ?

La phase W a mesuré une montée de difficulté éditoriale et plusieurs premières apparitions de rubriques notées 4/5. La phase X a ensuite montré qu'accélérer globalement le niveau cible dégradait la diversité des familles dans certains parcours. L'enjeu est donc de **lire les situations d'enchères réellement tirées lors de la première rencontre avec une rubrique avancée**, plutôt que de retoucher le classement des difficultés sans regarder les cartes et les séquences.

**Une première rencontre avec une rubrique ne prouve pas qu'un concept est nouveau pour l'élève.** La note 4/5 n'est qu'une étiquette du catalogue. Les profils et réponses des simulations sont fictifs.

## Sources et méthode

- Catalogue intact : **1 523 QCM originaux** du Quiz SEF, dont les **ID, mains, points H, distributions, enchères, énoncés, bonnes réponses, distracteurs, explications et raisons de difficulté** sont conservés dans les extraits.
- Référence : le simulateur **V2-F non modifié**, avec **9 profils/graines déterministes** (balanced / fragile-mineures / facile × 13 / 29 / 47) et **45 séances × 10 QCM**.
- Script : `scripts/parcours-v2-transitions-y.cjs`. Tests d'identité source et d'absence de mutation : `tests/quizz-v2-transitions-y.cjs`. Rapport de CI : `qpjb-v2-y-audit` (JSON intégral et résumé).
- Rubriques examinées : **fortes, forcing, multilandy, rubensohl, michaels, chelem**. Pour chaque scénario, le script remonte la **première séance et la position dans la séance**, l'identité exacte du QCM, la difficulté, l'existence d'un **rappel explicitement écrit dans l'énoncé** et les **autres questions dans la même séance**.

## Exposition contextuelle précédente — pas une table de prérequis

Pour fournir des indices aux enseignants lors de la revue, on regarde l'exposition (en nombre de QCM) à des rubriques **voisines**, dans les séances antérieures et les **cinq séances immédiatement précédentes**.

| Première rubrique avancée | Rubriques voisines observées, à titre indicatif |
|---|---|
| Fortes | Choix d'ouverture, sans-atout |
| Quatrième couleur forcing / forcing | Redemande de l'ouvreur, deuxième enchère |
| Multi-Landy | Intervention adverse et sans-atout |
| Rubensohl | Sans-atout et séquences après intervention |
| Michaels | Intervention et réveil |
| Chelem | Enchères après fit et sans-atout |

**Ces rapprochements sont uniquement des aides à la lecture.** Ils ne démontrent ni que l'élève a vu la convention exacte, ni qu'il a compris les bases, ni qu'une règle de SEF ou un prérequis a été validé. En particulier, `intervenir`, `contre`, `reponse_inter` et `apres_inter` ne sont jamais fusionnés. Une absence dans les cinq séances précédentes n'est **pas** une preuve de « notion sans préparation ».

Le script cherche strictement le mot **« Rappel : »** dans l'énoncé. Un exemple peut comporter une aide implicite ou des explications non précédées de ce mot ; un « Rappel » présent n'en garantit pas la compréhension.

## Critères de relecture humaine

Les premiers exemples annotés 4 ou 5 **sans rappel explicite** et **sans exposition récente à une rubrique voisine** sont présentés comme des **signaux prioritaires de revue documentaire** : non comme des fautes pédagogiques, des QCM à supprimer ou des objectifs maîtrisés. Chaque signal comporte son ID, la séance, le texte original et les rubriques antérieures observées. Le rapport complet permet de vérifier les contextes de chaque scénario, plutôt que de décréter un problème à partir des seuls agrégats.

Le bon test qualitatif porte sur les **vraies séquences d'enchères et les distracteurs** : l'énoncé rend-il l'accord compréhensible ? Est-ce un contraste utile ? Une autre main déjà vue introduisait-elle le même choix ? Les réponses et explications doivent être préservées tant qu'une erreur n'est pas établie par les sources.

## Décision attendue

Conserver V2-F. Après lecture du rapport JSON validé, consigner les exemples originaux méritant une revue d'enseignante ; ne pas activer de prérequis, de leçon imposée, de progression forcée ou de score de « maîtrise ». Toute évolution future doit être testée avec les mêmes exigences de **22 rubriques, 440–450 familles, rappels et diversité des mineures**.

**Statut initial : Y_SOURCE_REVIEW / NON_ELEVES / V2_F_INCHANGE / CI_A_VERIFIER.**
