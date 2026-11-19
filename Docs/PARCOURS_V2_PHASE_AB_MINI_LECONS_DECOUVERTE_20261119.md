# QPJB — Phase AB : deux mini-leçons de découverte, séparées des QCM

**19 novembre 2026 · Prototype éditorial hors production · PR #214**

## Pourquoi cette phase ?

La phase Y a recensé les premiers contacts avec les conventions avancées dans neuf parcours fictifs. La phase Z a ajouté cinq *aides de méthode* avant des QCM Rubensohl et Michaels. La revue AA a confirmé leur limite : **une aide à lire la question n'enseigne pas l'accord conventionnel lui-même**. Un élève qui ignore totalement la correspondance entre enchère et convention ne peut pas la deviner de façon fiable.

La phase AB crée donc une étape **distincte des QCM** : une mini-leçon à lire pour découvrir l'accord, sans main d'exercice, sans réponse à cocher, sans notation et sans enregistrement. Ce sont des contenus didactiques sous réserve de validation enseignante, **pas** un système d'acquis ni de nouvelles questions dans le catalogue.

## Leçon 1 — Rubensohl : sens contextuel des enchères après 1SA

**Source contrôlée :**
- `SEF-V486-022` : le partenaire a ouvert de **1SA (15–17 H)**, l'adversaire intervient à **2♣ Landy** (deux majeures). Dans **cet accord source**, le répondant peut utiliser **3♣ comme Texas pour les Carreaux**.
- `SEF-V481-009` : notre camp ouvre de **1SA**, l'adversaire intervient naturellement à **2♦**, le partenaire annonce **3♣** (dans la séquence source : « Texas impossible : Stayman forcing de manche »). L'ouvreur prend en compte sa majeure quatrième pour continuer.

**Objectif pédagogique :** comprendre que `3♣` **n'a pas le même sens dans ces deux contextes**, et qu'il faut lire les enchères et les accords de la paire avant d'interpréter une proposition. La leçon contient quatre séquences pédagogiques courtes, un tableau de comparaison à déplier et une synthèse.

**Limite assumée :** ces deux situations ne constituent pas une table exhaustive du Rubensohl. Le contenu **reproduit les accords exprimés dans les corrigés QPJB** ; il ne prétend pas certifier, à lui seul, la conformité d'autres séquences ou versions de SEF.

## Leçon 2 — Michaels précisés : lire un cue-bid bicolore

**Sources contrôlées :**
- `SEF-C2-007` : après **1♦ adverse**, le **cue-bid 2♦** annonce dans l'accord QPJB **les deux majeures au moins cinquièmes**.
- `SEF-V45-044` : après **1♠ adverse**, le **cue-bid 2♠** annonce **cinq Cœurs et cinq Trèfles au minimum**.
- `SEF-L04-029` : quand une compétition se prolonge, **ne pas fabriquer un fit** et tenir compte des couleurs garanties, du palier et de la vulnérabilité.

**Objectif pédagogique :** relier le cue-bid aux couleurs promises par l'accord, puis distinguer **l'annonce du bicolore** de la **décision compétitive ultérieure**. Leçons et explications sont distinctes des mains, choix multiples et corrigés des exercices.

**Limite assumée :** ce sont les **Michaels précisés**, non les Michaels non précisés. Les autres cas du système ne sont pas ajoutés sans source établie.

## Format de consultation

Le générateur `scripts/parcours-v2-apercu-lecons-ab.cjs` crée **`mini-lecons-decouverte.html`**, un document autonome, accessible hors ligne :

- un bouton de navigation entre les deux leçons ;
- pour chaque leçon, un objectif, quatre petits blocs d'explication et des séquences en toutes lettres ;
- deux sections dépliables pour la comparaison et l'essentiel à retenir ;
- les identifiants des QCM sources pour traçabilité, **sans intégrer les questions elles-mêmes**.

L'HTML ne comprend **ni formulaire, ni main d'exercice, ni saisie de réponses, ni statistique, ni requête réseau, ni stockage local**. Le prototype se consulte séparément de la démonstration Z (qui présente, elle, les QCM originaux).

## Intégrité et périmètre

Le script `scripts/parcours-v2-lecons-ab.cjs` valide les accords présentés contre les **cinq QCM originaux** des **1 523** questions du catalogue. Si un accord, une réponse ou une séquence source évolue, la validation doit échouer jusqu'à relecture.

Le test `tests/quizz-v2-lecons-ab.cjs` contrôle :
- l'existence de **deux leçons** et des **cinq sources** ;
- la provenance des accords et l'exclusion de questions/corrigés entiers dans l'HTML ;
- l'absence de notation et de collecte de réponses ;
- la validité du JavaScript de navigation et l'identité du catalogue original.

Le workflow `.github/workflows/qpjb-v2-ab-focused.yml` construit l'artefact **`qpjb-v2-ab-mini-lessons`**, contenant le document HTML, les leçons structurées, la matrice d'exposition et une synthèse. Sur **neuf simulations fictives V2-F × 45 séances**, la matrice contrôle que les deux leçons restent documentaires et disponibles pour les premières rencontres Rubensohl/Michaels, **sans insertion dans les séances**.

## Décision

**Ne pas intégrer les leçons automatiquement au Quiz SEF** : pour l'instant, proposer un document à relire par l'enseignante. Toute utilisation réelle devra distinguer clairement **apprentissage guidé**, **entraînement** et **évaluation sans aide**. Aucun nouveau QCM, correction, famille, prérequis, score ni moteur n'est créé ou modifié.

**Statut initial : `AB_DEUX_LECONS_SOURCES / NON_NOTE / HTML_HORS_LIGNE / VALIDATION_ENSEIGNANTE_REQUISE / AUCUN_DEPLOIEMENT`.**
