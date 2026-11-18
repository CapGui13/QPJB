# QPJB — Phase Q : progression souple des 16 axes, sans validation automatique
**18 novembre 2026 · PR #214 · proposition hors production, non fusionnée.**

## 1. Objectif et méthode

Conserver **V2-F** comme référence : ce moteur d'essai alterne les types d'ouverture, les réponses, les exercices de chaque rubrique et les rappels, sans quatre réponses identiques dans une même séance sur les précédentes simulations. Les tentatives de forcer une fondation par séance (V2-L) ou d'injecter une variété localement (V2-M) n'ont pas fait mieux de façon robuste.

La progression Q ne remplace donc **aucun** tirage et ne consigne aucune maîtrise. Elle décrit seulement les compétences candidates dans des groupes pédagogiques, signale les relations de contexte à examiner et lit les séances fictives pour repérer les situations effectivement présentées.

Le fichier structuré est `Docs/PARCOURS_V2_PHASE_Q_PROGRESSION_CANDIDATE_20261118.json` : **16 axes** repris de P, **5 groupes pédagogiques**, **15 liens conceptuels suggérés**. Chaque lien est `LIEN_CONCEPTUEL_POUR_REVUE`, `isHardPrerequisite: false`, `preventsPresentation: false` et `proofOfMastery: false`. Le graphe J, les QCM et la progression publique sont inchangés.

## 2. Cinq groupes à entrelacer, pas cinq chapitres cloisonnés

| Ensemble de travail | Contenu | Précaution |
|---|---|---|
| Choix d'ouverture et premier fit | Points H (indice indirect), 1SA, 2SA, fit majeur | Continuer **1♣, 1♦, 1♥, 1♠, 1SA et Passe**, plus les réponses à 1♣/1♦/1♥/1♠ ; 2SA reste un contraste de force, pas une série imposée d'emblée |
| Premières conventions | Invitation/manche, Stayman 1SA, Texas majeur 1SA | Mélanger réponses après ouverture, convenances et décisions de manche ; ne pas juxtaposer 30 ouvertures faciles |
| Concurrence : deux rôles | **Notre intervention** sur ouverture adverse / **réponse au Contre adverse** après ouverture du partenaire | Ce sont **deux axes parallèles**, et aucun n'est un prérequis imposé pour l'autre |
| Développements à 2SA | Stayman 2SA, Texas majeur 2SA, Texas mineurs 1SA/2SA, 4SA quantitatif | Conventions mineures et quantitatif à relire ; en particulier, le Texas mineur sur 2SA n'a qu'une famille source |
| Chelems et cas spéciaux | Contrôles, Blackwood et chelem ; 3SA gambling | La présence d'un QCM ne prouve pas la maîtrise ; ne pas forcer le gambling, qui n'a qu'une famille candidate |

L'ordre de ces *ensembles* ne doit pas être traité comme un calendrier fixe ou un déblocage ; par exemple, une ouverture à 2SA peut servir de contraste tôt, puis être retravaillée en conventions plus tard.

## 3. Relations suggérées et absence de verrou

Les **15** liens documentés décrivent des dépendances de contexte à discuter :

- Reconnaître une ouverture de 1SA fournit le contexte du Stayman et du Texas après 1SA ; le même raisonnement existe pour 2SA.
- Reconnaître un fit aide à comparer soutien, invitation/manche et certains choix après Contre adverse.
- Les développements Stayman/Texas après 2SA peuvent s'enseigner par analogie avec les séquences après 1SA.
- Quantitatif et explorations de chelem demandent un rappel du contexte de force, du fit et des différentes utilisations de 4SA.

**Ce sont des suggestions, non des conditions nécessaires.** Les contextes qui dépendent de conventions encore à arbitrer ou de preuves insuffisantes restent explicitement marqués `highRisk`. Aucune réussite de QCM n'autorise automatiquement une transition ; aucun échec n'interdit de voir la notion suivante.

## 4. Trois angles morts explicites

La cartographie P (16 axes / 122 QCM sources / 134 associations) ne possède **pas encore d'axe documentaire autonome** pour :

1. **Le choix des ouvertures mineures 1♣ / 1♦.** Ces QCM existent dans les tirages V2-F, mais ne sont pas isolés en fondation certifiable.
2. **Les réponses aux ouvertures 1♣ / 1♦.** Le moteur V2-F les travaille déjà par créneaux `rep:1♣` et `rep:1♦` ; il faut déterminer si leur diversité suffit pédagogiquement, sans répéter trop longtemps la même décision.
3. **Les Contres d'entame sur Stayman et Texas après 1SA.** Ces cas sont différents du Contre d'appel adverse sur l'ouverture du partenaire.

Il ne faut **pas inventer de questions** ou créer un prérequis certifié à partir de ces trois lacunes de cartographie. On peut rechercher davantage d'exercices originaux, puis demander une validation pédagogique.

## 5. Deux micro-objectifs J à ne pas classer au mauvais endroit

Le graphe J associe `fondation:intervention` à deux micro-objectifs :

- `stayman:stayman_1sa_contre_choisir_reponse` : les QCM `SEF-L25-001`, `SEF-L25-002`, `SEF-L25-003` concernent le **Contre d'entame adverse sur 2♣ Stayman**, pas une intervention de notre camp.
- `stayman:texas_majeur_1sa_contre_choisir_reponse` : les QCM `SEF-L25-004`, `SEF-L25-005`, `SEF-L25-006` concernent le **Contre d'entame adverse sur 2♦ Texas**, pas le Contre d'appel sur 1♥/1♠ du partenaire.

Les réponses, séquences et explications ont été consultées dans le catalogue **original** de `quizz.html`. La nouvelle phase Q **signale l'ambiguïté**, sans réaffecter ces six QCM au nouvel axe de réponse après Contre adverse : une telle réaffectation serait elle aussi inexacte.

## 6. Outils de vérification et état

- `tests/quizz-v2-progression-q.cjs` : contrôle les **16 axes, 5 groupes, 15 liens sans cycles ni verrous**, les deux micro-objectifs spécialisés J, et l'absence de toute prétention de maîtrise.
- `scripts/parcours-v2-reperes-q.cjs` : observatoire passif de V2-F sur neuf scénarios fictifs × 45 séances, qui calcule les occurrences des cinq groupes, les ouvertures mineures et réponses dès les premières séances, puis la répartition par tranches de 5/10 séances. **Aucun résultat n'est certifié tant que la CI n'est pas terminée.**
- `tests/quizz-v2-reperes-q.cjs` : vérifie l'intégrité du scénario, l'existence des ouvertures et réponses mineures précoces, l'absence de réécriture des tirages et des rappels.

Le site élève, ses QCM, ses corrigés, ses sauvegardes, et le module Entraînement ne changent pas.

**Décision : `V2-F_REFERENCE / PHASE_Q_PROPOSITION_PEDAGOGIQUE / AUCUN_PREALABLE_VERROUILLANT / AUCUN_DEPLOIEMENT`.**
