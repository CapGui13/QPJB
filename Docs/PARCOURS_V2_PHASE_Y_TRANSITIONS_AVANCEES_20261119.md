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

## Résultats validés — 9 scénarios fictifs

**GitHub Actions : [audit Y #44493817983](https://github.com/CapGui13/QPJB/actions/runs/44493817983), succès** (tests d'identité source, non-mutation et matrice des neuf scénarios). Artefact `qpjb-v2-y-audit` : `phase-y-matrix.json` et `phase-y-summary.json` contenant les enchères et explications exactes.

| Première rubrique | Première séance (min–max) | Premiers QCM notés 4/5 | Premier énoncé avec marqueur littéral « Rappel : » |
|---|---:|---:|---:|
| Fortes | 27–42 | 1/9 | 1/9 |
| Forcing | 29–40 | 2/9 | 0/9 |
| Multi-Landy | 33–37 | 1/9 | 6/9 |
| Rubensohl | 35 exactement | 0/9 (premiers QCM tous niveau 3) | 0/9 |
| Michaels | 37–44 | **9/9** | **8/9** |
| Chelem | 40 exactement | **9/9** | **9/9** |

Dans **les neuf parcours**, on trouve au moins un exercice d'une rubrique voisine dans les **cinq séances précédant** chaque premier contact pour cinq des six thèmes. Pour *chelem*, c'est **8/9**. Cette exposition thématique **ne démontre pas** que l'élève ait déjà étudié les conventions précises. Le signal automatique composite « premier QCM 4/5, sans `Rappel :`, sans rubrique voisine récemment vue » renvoie **0 cas**, ce qui n'épuise évidemment **pas** la revue pédagogique.

### Cas concrets à examiner par l'enseignante

**Y-01 — `SEF-V486-022` : Rubensohl sur 2♣ Landy adverse, première question dans 6/9 parcours.** Séance **35**, difficulté éditoriale **3**, main 2-2-6-3 de 10 H. Séquence : partenaire 1SA (15–17) — adversaire 2♣ Landy ; réponse cataloguée **3♣**, Texas pour les Carreaux. L'énoncé explique que 2♣ est un Landy, et demande d'appliquer le SEF, mais il **ne donne pas avant la réponse la signification de 3♣ dans ce dispositif**. Le corrigé la fournit. Question de revue : convient-il pour une **première exposition**, ou faut-il une étape de découverte/explication avant l'évaluation ? **Aucune erreur de corrigé affirmée.**

**Y-02 — `SEF-V481-009` : autre première situation Rubensohl, 3/9 parcours.** Séance **35**, difficulté **3**, après 1SA — (2♦ naturel) — 3♣ ; l'enchère du partenaire est déjà décrite dans la séquence comme **« Texas impossible : Stayman forcing de manche »**. La bonne réponse cataloguée est **3♠** avec quatre Piques. Ce cas comporte donc une **aide contextuelle dans la séquence**, sans le marqueur littéral « Rappel : ». Il ne doit pas être qualifié de « sans aide » par la seule recherche de ce mot.

**Y-03 — `SEF-L04-029` : Michaels en séquence compétitive longue, première rencontre dans 1/9 parcours.** Profil fictif *facile*, graine **29**, séance **37**, difficulté **4**. Après l'ouverture adverse de 1♠, le partenaire a annoncé 2♠ (Michaël précisé) ; les adversaires sont montés à 4♠ après plusieurs tours. La main possède six ♦, mais seulement deux ♥ et deux ♣ ; la réponse cataloguée **Passe** évite d'inventer un fit. L'énoncé **décrit explicitement le Michaël précisé**, même s'il n'utilise pas « Rappel : ». Ce n'est donc **pas** une convention inexpliquée ; c'est une **première situation très élaborée**, potentiellement lourde pédagogiquement. Huit autres parcours commencent avec un cas Michaels possédant le marqueur `Rappel :`.

**Y-04 — `SEF-V480-015` : quatrième couleur forcing, première exposition dans 1/9 parcours.** Difficulté **4**, séance **38**, séquence 1♣–1♥–1♠–2♦ (quatrième couleur forcing), avec une main 4-2-1-6. Bonne réponse cataloguée **3♣** (six Trèfles sans arrêt Carreau ni trois Cœurs). La séquence **nomme elle-même la quatrième couleur forcing**, mais ne présente pas de rappel pédagogique explicite. Les rubriques *red* et *second* ont toutefois été rencontrées auparavant : **ce n'est pas une preuve que la quatrième couleur forcing soit connue**.

### Interprétation

- **Michaels et chelem** : les premières questions sont toutes notées 4. Pour le chelem, les neuf énoncés initiaux donnent un `Rappel :` explicite ; cela constitue une aide visible, pas une preuve de maîtrise.
- **Rubensohl** : la première rencontre est stable à la séance 35, mais des sous-situations **sensiblement différentes** (après Landy ou après intervention naturelle) peuvent ouvrir cette rubrique. Il faut les étudier **séparément** ; ne pas confondre exposition au thème et enseignement de la convention.
- **Forcing** : les premières rencontres commencent aux séances 29–40. Deux sur neuf sont directement notées 4. Les relations avec *red/second* sont seulement des indices de contexte.
- **Décision** : prioriser l'examen qualitatif de Y-01 et Y-03, sans réécrire leur réponse, supprimer leur ID ni forcer un ordre de tirage.

**Statut validé : `Y_CI_SUCCES / 4_CAS_SOURCE_RELUS / V2_F_INCHANGE / AUCUN_DEPLOIEMENT`.**

