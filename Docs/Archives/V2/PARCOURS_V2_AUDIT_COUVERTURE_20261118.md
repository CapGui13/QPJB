# QPJB — V2 phase A : état réel de la couverture pédagogique

**Date : 18 novembre 2026.** Source unique : le catalogue JSON intégré dans `quizz.html`, analysé par `scripts/audit-parcours-v2.cjs` avec les fonctions `microKey` et `axisKey` de `quizz-parcours.js`. Aucun examen arbitraire d'une bonne réponse, aucun exercice créé ni corrigé modifié.

## Résultats vérifiés

- **1 523 QCM**, **22 rubriques**, **1 315 familles** pédagogiques distinctes (`caseFamily || id`).
- **903 QCM** ont une micro-compétence détectée par la taxonomie actuelle (25 clés, principalement des contextes d'enchère). Cela **ne signifie pas** que ces 903 QCM ont été individuellement contre-expertisés du point de vue des prérequis.
- **620 QCM** sans micro-compétence actuelle, dont **40** possèdent malgré tout un des trois axes transversaux explicitement audités (fit / force / palier) et **580** n'ont ni micro-compétence ni axe.
- **105 QCM** possèdent un axe transversal, dont **65** ont également une micro-compétence. Les axes ne peuvent pas être attribués aux autres QCM par simple analogie de formulation.
- **12 rubriques** sont entièrement dépourvues de micro-compétences, notamment plusieurs conventions et les chelems. Le problème est surtout structurel, non un manque de QCM.

### Couverture détaillée par rubrique

| Rubrique | QCM | Micro existante | Sans micro | Avec axe audité | Familles à examiner |
|---|---:|---:|---:|---:|---:|
| Choisir son ouverture | 84 | 83 | **1** | 0 | 1 |
| Répondre à 1♣ / 1♦ | 84 | 84 | **0** | 4 | 0 |
| Répondre à 1♥ / 1♠ | 85 | 85 | **0** | 11 | 0 |
| Répondre à 1SA / 2SA | 86 | 72 | **14** | 26 | 14 |
| La redemande de l’ouvreur | 124 | 124 | **0** | 0 | 0 |
| La 2e enchère du répondant | 121 | 121 | **0** | 19 | 0 |
| Après Stayman et Texas | 65 | 0 | **65** | 0 | 59 |
| Interventions | 65 | 65 | **0** | 0 | 0 |
| Après un contre d’appel | 64 | 64 | **0** | 0 | 0 |
| Après intervention adverse | 146 | 145 | **1** | 0 | 1 |
| Barrages simples à la couleur | 65 | 0 | **65** | 5 | 52 |
| Après un fit majeur | 48 | 0 | **48** | 26 | 48 |
| Répondre à une intervention | 67 | 0 | **67** | 1 | 56 |
| Réveils simples | 60 | 60 | **0** | 5 | 0 |
| Le Roudi | 38 | 0 | **38** | 4 | 35 |
| Le Drury | 40 | 0 | **40** | 4 | 36 |
| Ouvertures fortes et réponses | 42 | 0 | **42** | 0 | 42 |
| Troisième et quatrième couleur forcing | 54 | 0 | **54** | 0 | 54 |
| Défense contre 1SA : Multi-Landy | 31 | 0 | **31** | 0 | 31 |
| Après intervention sur notre 1SA | 49 | 0 | **49** | 0 | 49 |
| Interventions bicolores (Michaels) | 40 | 0 | **40** | 0 | 40 |
| Contrôles, Splinters et Blackwood | 65 | 0 | **65** | 0 | 65 |
| **Total (QCM)** | **1 523** | **903** | **620** | **105** | — |

Le nombre « familles à examiner » est compté **par rubrique** : il n'est pas à sommer comme un nombre global de familles. Les QCM ayant des réponses différentes ou des énoncés voisins peuvent appartenir à une même famille ; la révision ne doit pas les traiter comme autant de compétences nouvelles.

## File de revue individuelle : 620 QCM

Fichier : `Docs/PARCOURS_V2_REVUE_620_20261118.csv`. **Chaque ligne conserve** l'ID source, la rubrique, la famille, la difficulté, la réponse originale, l'axe déjà audité s'il existe et la justification éditoriale exacte. Le statut `A_CLASSER_MANUELLEMENT` signifie uniquement *classification fine non encore effectuée* ; il ne remet pas en question les corrections du Quiz SEF.

La colonne `difficultyReason` est **un indice pour organiser l'audit**, pas une preuve suffisante pour affecter une compétence : les contre-exemples, les alternatives recevables, le rôle du joueur et le déroulement complet des enchères doivent être examinés dans le QCM original et, si nécessaire, dans sa source.

### Groupes à traiter, dans l'ordre pédagogique envisagé

- **ouv** — 1 QCM sans micro-compétence, 1 familles ; motifs éditoriaux les plus fréquents : Reconnaître 2♣ forte et artificielle avec 22 H réguliers, à distinguer de 2SA limité à 20–21 H. (1).
- **sa** — 14 QCM sans micro-compétence, 14 familles ; motifs éditoriaux les plus fréquents : Appliquer la réponse négative au Stayman à quatre réponses sur ouverture de 2SA. (1) ; Décision conventionnelle du SEF 2024. (1) ; Décision de l'ouvreur maximum sur une invitation à 4SA quantitatif, non Blackwood. (1).
- **stayman** — 65 QCM sans micro-compétence, 59 familles ; motifs éditoriaux les plus fréquents : Compléter naturellement un Stayman ou un Texas (31) ; Texas mineurs sur 1SA sans intervention, SEF 2024 : partielle ou description de la courte. (8) ; Réévaluer la manche ou le fit après la réponse au Stayman (7).
- **apres_fit** — 48 QCM sans micro-compétence, 48 familles ; motifs éditoriaux les plus fréquents : Réévaluer la force avec une courte et un fit établi (6) ; Déterminer le bon niveau après découverte du fit (5) ; Accepter ou refuser une invitation à la manche (4).
- **reponse_inter** — 67 QCM sans micro-compétence, 56 familles ; motifs éditoriaux les plus fréquents : Soutenir ou répondre simplement à l’intervention du partenaire (16) ; Passe en l’absence de force ou de fit sur intervention du partenaire (8) ; Soutien de barrage à quatre atouts avec singleton et vulnérabilité favorable. (5).
- **apres_inter** — 1 QCM sans micro-compétence, 1 familles ; motifs éditoriaux les plus fréquents : Le saut à 4♥ après un Spoutnik simple annonce 18–19 HLD (SEF 2024). (1).
- **barrage** — 65 QCM sans micro-compétence, 52 familles ; motifs éditoriaux les plus fréquents : Reconnaître une ouverture faible à six cartes ou l’écarter (22) ; Évaluer la longueur et la qualité d’un barrage au palier de 3 (5) ; Développement du barrage ou décision de manche (2).
- **roudi** — 38 QCM sans micro-compétence, 35 familles ; motifs éditoriaux les plus fréquents : Répétition faible de la majeure sans lancer le Roudi (7) ; Déclencher le Roudi pour rechercher un fit 5-3 (4) ; Reconnaître l’absence de perspective et conserver 1SA (4).
- **drury** — 40 QCM sans micro-compétence, 36 familles ; motifs éditoriaux les plus fréquents : Réponse simple après ouverture en troisième position (6) ; Après le Drury, montrer une ouverture normale par le relais positif 2♦. (2) ; Employer le Drury après un Passe d’entrée et un fit (2).
- **fortes** — 42 QCM sans micro-compétence, 42 familles ; motifs éditoriaux les plus fréquents : Développement SEF 2024 avec choix d'enchère justifié. (2) ; Distinguer les ouvertures fortes et leur redemande précise (2) ; Reconnaître le relais obligatoire sur ouverture forte (2).
- **forcing** — 54 QCM sans micro-compétence, 54 familles ; motifs éditoriaux les plus fréquents : Priorités de redemande après quatrième couleur forcing : fit différé, tenue, distribution et zone. (15) ; Utiliser une troisième couleur artificielle forcing (3) ; Enchères de suite en situation complexe ; distinguer distributions garanties, relais et force selon le protocole affiché. (2).
- **multilandy** — 31 QCM sans micro-compétence, 31 familles ; motifs éditoriaux les plus fréquents : Choisir la réponse ou redemande après intervention Multi-Landy, selon le rôle et la convention. (13) ; Reconnaître une structure de base du Multi-Landy (4) ; Distinction de deux enchères proches dans le système convenu. (3).
- **rubensohl** — 49 QCM sans micro-compétence, 49 familles ; motifs éditoriaux les plus fréquents : Rubensohl : redemande de l'ouvreur, Texas impossible, majeure quatrième et arrêt de l'intervention. (14) ; Appliquer un transfert Rubensohl malgré l’intervention adverse (4) ; Distinction de deux enchères proches dans le système convenu. (3).
- **michaels** — 40 QCM sans micro-compétence, 40 familles ; motifs éditoriaux les plus fréquents : Répondre au Michaël précisé en choisissant le bon fit et le palier adapté. (13) ; Compétition après Michaël précisé : sécurité distributionnelle, fit et palier (9) ; Distinction de deux enchères proches dans le système convenu. (2).
- **chelem** — 65 QCM sans micro-compétence, 65 familles ; motifs éditoriaux les plus fréquents : Contrôles avant Blackwood, après soutien majeur et départ en contrôle de l'ouvreur : rang, courte, ordre et coup de frein. (16) ; Compter les clés dans la réponse au Blackwood 30–41 (4) ; Séquence d'exploration du chelem à reconstituer, lecture du fit et des contrôles, décision d'interroger sur les clés plutôt que conclure. (4).

Ce relevé des formulations est descriptif. Les fréquences observées dans une même justification ne prouvent ni unicité de compétence ni équivalence pédagogique.

## Prérequis : propositions, pas encore règles d'ouverture de thèmes

Le fichier `Docs/PARCOURS_V2_PRE-REQUIS_PROPOSITIONS_20261118.json` décrit un **graphe provisoire de familiarisation**, entre les 22 rubriques actuelles. Ce graphe sert à planifier une revue par un enseignant et à identifier les lacunes de couverture ; il **ne change pas les seuils** et **n'active aucun verrou dans le programme**.

Le programme publié conserve le calendrier actuel `ROADMAP`. Une véritable progression par acquis devra s'appuyer sur des compétences plus précises, être validée par des séances distinctes et conserver un chemin de secours pour que l'élève ne reste pas bloqué.

## Ordre de travail conseillé après cet audit

1. Valider les premières compétences de réponse à SA, puis les suites de Stayman/Texas et les enchères après fit : elles interviennent tôt dans la progression.
2. Traiter les réponses à une intervention et les barrages, puis les réveils/Roudi/Drury.
3. Traiter les ouvertures fortes, enchères forcing, défenses conventionnelles, bicolores et chelems.
4. Recontrôler aussi les 903 cas déjà catégorisés : une catégorie « réponse à 1♣ » est parfois trop générale pour représenter un objectif enseignable.
5. **Seulement ensuite**, réaliser un tirage expérimental basé sur les prérequis dans un module séparé, comparer le comportement actuel et le comportement proposé sur 65 séances simulées, puis décider du déploiement.

## Reproductibilité et sécurité

- `node scripts/audit-parcours-v2.cjs --check` : affiche le bilan et refuse une variation silencieuse de la base (1 523 QCM, 903 micro, 105 axes, etc.).
- `node scripts/audit-parcours-v2.cjs --csv` : régénère exactement la file de 620 QCM.
- `node scripts/audit-parcours-v2.cjs --all-csv` : produit un inventaire complet des 1 523 QCM.
- **Aucune modification** de `quizz.html`, `quizz-parcours.js`, de leurs réponses ni des bilans et sauvegardes. Ce lot ne change pas l'expérience visible par les élèves.
