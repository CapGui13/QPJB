# QPJB — Phase AC : pré-validation éditoriale des mini-leçons Rubensohl et Michaels

**19 novembre 2026 · PR #214 · Lecture des sources QPJB et rapprochement avec des supports pédagogiques publics.**
**Périmètre : les deux leçons de la phase AB, et rien d'autre. Aucun changement du Quiz SEF public ni de V2-F.**

## Décision centrale : « débutant en convention » n'est pas « débutant au bridge »

Ces deux thèmes **ne conviennent pas à quelqu'un qui découvre les enchères pour la première fois**. Avant Rubensohl, il faut savoir lire 1SA, identifier le répondant et l'intervention adverse ; avant Michaels, savoir lire une ouverture de 1 à la couleur, connaître les majeures/mineures et compter les longueurs.

**Leçons désormais positionnées comme « première découverte d'une convention pour joueur possédant les bases ».** Le message est visible en tête du document HTML et rappelé dans chaque leçon. On n'interprète jamais la lecture d'une page comme une maîtrise démontrée.

## Grille de relecture éditoriale

| Dimension | Défaut initial possible | Correction AC | Limite résiduelle |
|---|---|---|---|
| Public ciblé | « Pour débutants » pouvait être compris comme première leçon de bridge | Niveau précis et **3 prérequis par leçon**, affichés avant les exemples | Validation du vrai niveau des participants par l'enseignante |
| Termes non connus | Cue-bid, bicolore, Texas, Landy, Stayman, forcing de manche sans définition préalable | **5 définitions en langage courant par leçon**, affichées avant les règles | Ne remplace pas un cours complet des interventions |
| Contextes Rubensohl | Risque de mémoriser une seule correspondance 3♣ | Opposition explicite entre **Landy artificiel** et **2♦ naturel adverse** ; « Texas impossible » expliqué | Deux exemples **ne suffisent pas** pour toutes les interventions |
| Michaels précisés | Risque de confondre la couleur adverse avec une couleur longue du bicolore | Définitions de **cue-bid** et **5–5**, puis lecture de 1♦–2♦ et 1♠–2♠ | Ne couvre ni toutes les variantes ni tous les cas d'ouverture |
| Mémorisation mécanique | L'élève pouvait retenir une réponse sans les raisons | **3 ou 4 pièges à éviter** et un objectif de restitution personnelle | Pas de test d'acquisition, volontairement |
| Diagnostic | Une page de cours pouvait être confondue avec un QCM évaluatif | Document autonome, **aucune question ni réponse à saisir** | Impossible de conclure à l'efficacité sans retour des élèves |

Ces ajouts sont des **supports de compréhension**, non de nouvelles règles d'enchères.

## Vérifications des accords : source QPJB vs supports externes

Les **cinq QCM source et leurs corrigés restent la référence du contenu**. Pour vérifier qu'une interprétation de notre rédaction n'était pas manifestement isolée, un rapprochement a été effectué avec des ressources pédagogiques publiques (sans les substituer aux sources QPJB) :

1. **Rubensohl après 2♣ Landy adverse :** la fiche des *Cercles de Bridge Woluwé-Saint-Lambert* indique, dans sa présentation du Rubensohl simplifié, **3♣ comme Texas Carreau**, avec une main constructive. Cela concorde avec `SEF-V486-022`. Source externe : https://www.cbwsl.be/index.php/hebdobridge/2084867010-hebdobridge0076
2. **Rubensohl après intervention naturelle à 2♦ :** la fiche *iBridge – Le Rubensohl après 2 Carreaux* présente **3♣ comme Texas impossible, donc Stayman forcing de manche**. Cela concorde avec le contexte explicite de `SEF-V481-009`. Source externe : https://www.ibridge.fr/public/fichedetails/336
3. **Michaels précisés :** l'article de PF Bridge *Comment mémoriser les interventions bicolores*, s'appuyant sur le SEF 2018 et le SEF expliqué, indique **2♦ après ouverture mineure pour les deux majeures** et **le cue-bid de l'ouverture majeure pour l'autre majeure et Trèfle**. Concordance avec `SEF-C2-007` et `SEF-V45-044`. Source externe : https://pfbridge.fr/posts/2019/08/comment-m%C3%A9moriser-les-interventions-bicolores/

**Attention :** ces pages sont des **supports secondaires, pas une certification officielle exhaustive du SEF 2024**. Les accords de paire peuvent varier ; les leçons doivent conserver leur périmètre limité aux séquences documentées par QPJB. Aucun autre traitement du Contre, de l'intervention ou du Michaels n'est inféré.

## Vérifications techniques ajoutées

- `scripts/parcours-v2-lecons-ab.cjs` : chaque leçon doit maintenant posséder **au moins trois prérequis, quatre définitions, trois confusions à éviter et un objectif de restitution**, faute de quoi la validation échoue.
- `scripts/parcours-v2-apercu-lecons-ab.cjs` : l'HTML affiche le niveau visé, les prérequis et un lexique **avant** les quatre sections originales, puis les pièges, le résumé et l'objectif final. Aucun QCM ni formulaire.
- `tests/quizz-v2-lecons-ab.cjs` : contrôle de ces contenus, de la présence des avertissements, de la syntaxe JavaScript de navigation et de l'absence de mutation des **1 523 QCM**.
- CI de référence : `.github/workflows/qpjb-v2-ab-focused.yml`, avec les **neuf mêmes simulations**. Les simulations contrôlent uniquement la disponibilité documentaire, la diversité des exercices et l'absence d'effet sur V2-F ; elles ne mesurent **pas** la compréhension.

## Points à faire arbitrer par une enseignante avant publication

- **Niveau :** la leçon est-elle adaptée à un joueur qui connaît le SEF d'ouverture et de réponse mais n'a jamais étudié Rubensohl/Michaels ?
- **Exactitude :** les deux séquences 3♣ après 1SA et les cue-bids Michaels reflètent-ils exactement les accords enseignés au club ?
- **Compréhension :** l'élève peut-il reformuler la différence entre une enchère naturelle et artificielle et expliquer le 5–5 sans lire le texte ?
- **Ergonomie :** le lexique est-il suffisamment visible sans alourdir la lecture sur mobile ?
- **Éthique pédagogique :** toute évaluation ultérieure sera-t-elle proposée **sans aide**, sans assimiler la lecture préalable du document à une compétence acquise ?

**Verdict AC : contenu restructuré pour être plus accessible à un débutant *de ces conventions*, avec cohérence documentaire corroborée sur les cas ciblés. `VALIDATION_PEDAGOGIQUE_HUMAINE_REQUISE` ; aucune réussite d'élève observée ; aucun déploiement.**
