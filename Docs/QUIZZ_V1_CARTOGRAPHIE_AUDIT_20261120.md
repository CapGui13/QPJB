# QPJB — Cartographie des compétences V1 : registre de revue 79 + 541

**20 novembre 2026 — chantier #226, état : audit documentaire et contrôle des sources, non homologation pédagogique.**

## Périmètre

La **V1 reste l'unique parcours proposé aux élèves**. Cette livraison est intégralement **en lecture seule** : aucun changement de `quizz.html`, `quizz-parcours.js`, des réponses, des métadonnées d'exercices utilisées en production, de l'interface, des sauvegardes (`qpjb-sef-parcours-01`) ou du Quiz libre.

Deux registres de travail ont été extraits de sources GitHub réelles :

1. [79 propositions](../audits/QPJB_V1_COMPETENCES_79_CANDIDATES_20261120.json) : identifiant, provenance SA/Stayman-Texas, notion proposée, question V1 avec sa **main, sa séquence, ses choix, sa réponse, son explication**, réponse V2, différences éditoriales et réserves.
2. [541 cas à classer](../audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json) : identifiants de la file d'origine, thème, famille, **main, séquence, énoncé, choix, réponse, explication, difficulté**. Pas de compétence inventée.

Le fichier source d'extraction est `quizz.html` (catalogue V1), et le fichier archive V2 `preview/v2-eleve/parcours-sef-65-r1.html` contient les deux lots de propositions. La file initiale de **620** est `Docs/PARCOURS_V2_REVUE_620_20261118.csv`. La procédure `node scripts/verify-v1-competences-register.cjs` contrôle leur cohérence contre les sources à chaque modification.

## Comptage réel

| Statut | QCM | Interprétation |
| --- | ---: | --- |
| Micro-clé déduite de la règle déterministe V1 | **903** | Repère de contexte, **pas** une homologation de la maîtrise |
| Proposition de classification SA | **14** | 8 notions candidates à confirmer |
| Proposition Stayman/Texas | **65** | 25 notions candidates à confirmer |
| Pas de classification fine | **541** | Examen manuel requis |
| **Total** | **1 523** | 1 523 ID source distincts |

Les 79 attributions candidates sont présentes dans le catalogue V1 et dans la file d'origine des 620. Aucun doublon, aucun ID manquant. **0/79 candidat ne devient automatiquement une compétence homologuée dans V1.**

Les **33 groupes candidats** incluent **10 groupes avec un seul exercice** : il serait artificiel de leur attribuer un niveau de maîtrise sur une seule réussite. Certains groupes à plusieurs QCM contiennent aussi plusieurs variantes d'une même famille ; le nombre d'exercices ne mesure donc pas le nombre de situations indépendantes.

## Différences de contenu V1 / V2 prouvées par les sources

Il existe **3 QCM différents** parmi 1 523 entre les catalogues ; les 1 520 autres ont le même contenu.

- `SEF-V416-008` : **V1 = 4♥**, question de conclusion en manche après Stayman ; **V2 = 4♣**, nouvel énoncé demandant le double transfert pour faire déclarer l'ouvreur. Les **contextes, choix, réponses et explications** ont été changés dans la V2.
- `SEF-V416-009` : **V1 = 4♠**, conclusion en manche ; **V2 = 4♦**, double transfert pour faire déclarer l'ouvreur. Même changement de quatre champs dans V2.
- `SEF-L25-007` : réponse **2SA inchangée**, mais explication reformulée dans V2 pour ne pas limiter la modulation du Texas Trèfle à une main obligatoirement maximum. L'explication V1 contient encore la notion « ouvreur maximum ».

**Ne jamais copier uniquement la réponse V2 dans la question V1 : ce ne sont pas toujours les mêmes questions.** La décision de conserver la V1 ne supprime pas les arbitrages de la V2 ; elle impose de les réexaminer comme changements éditoriaux propres à la V1 avant fusion.

## Alerte sur les étiquettes candidates

- `SEF-L23-006` et `SEF-L39-001` : le groupe `sa:texas_majeur_2sa_fit` (« rectification fittée ») contient un cas **sans fit** et un cas **avec fit**. Proposition de titre : « Choisir la rectification du Texas majeur sur 2SA selon la présence du fit ».
- `SEF-L25-007` : la note d'origine des 14 dit « main maximum », contrairement à la décision approuvée de main **non minimum** ; il faudra adapter la description candidate avant homologation.
- `SEF-L06-029` : le reclassement « Ouvertures conventionnelles / barrages » est enregistré uniquement pour la **V2** ; `theme=sa` reste intact dans la V1.
- Les deux doubles transferts `SEF-V416-008/009` ne doivent pas être considérés comme la même compétence appliquée aux deux versions : dans la V1, on conclut directement à 4M ; dans la V2 on choisit le transfert sous une consigne différente.

## Répartition des 541 examens encore nécessaires

| Rubrique source | QCM |
| --- | ---: |
| Répondre à une intervention (`reponse_inter`) | 67 |
| Barrages (`barrage`) | 65 |
| Chelems et contrôles (`chelem`) | 65 |
| 3e/4e couleur forcing (`forcing`) | 54 |
| Rubensohl (`rubensohl`) | 49 |
| Après un fit majeur (`apres_fit`) | 48 |
| Ouvertures fortes (`fortes`) | 42 |
| Drury (`drury`) | 40 |
| Michaels (`michaels`) | 40 |
| Roudi (`roudi`) | 38 |
| Multi-Landy (`multilandy`) | 31 |
| Ouvertures (`ouv`) | 1 |
| Après intervention adverse (`apres_inter`) | 1 |
| **Total** | **541** |

## Prochain lot pédagogique V1

1. Contrôler les **79** propositions à partir de l'intégralité des mains, séquences, explications et, quand nécessaire, du SEF de référence. Signer chaque décision « confirmée / à corriger / ambiguë » ; **ne pas activer** de compétence candidate avant sa revue.
2. Traiter en priorité **après-fit, barrages, chelems et forcing**, car ces thèmes sont actuellement sans micro-compétence fine dans la V1. Distinguer recherche de manche, contrôle, invitation, barrage, signification conventionnelle, et rôle du joueur.
3. Après validation éditoriale des notions, simuler le moteur V1 sur plusieurs profils d'élèves (autonome, erreurs, aides/passes), avec des mesures de variété, couverture, reprises et maîtrise. Aucun prérequis bloquant par inférence.
4. Tester les changements de moteur uniquement sur une branche distincte, sans toucher aux sauvegardes existantes.

**Cette PR ne certifie aucune réponse nouvelle et ne livre aucun nouveau moteur.** Elle rend simplement la suite du chantier vérifiable, question par question.
