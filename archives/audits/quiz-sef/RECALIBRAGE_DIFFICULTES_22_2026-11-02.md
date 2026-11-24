# QPJB — recalibrage indépendant des difficultés (22 cas)

**Date :** 2 novembre 2026 · **Catalogue :** `CapGui13/QPJB`, `main`, `quizz.html`.  
**Commit de code :** [`7d889c5`](https://github.com/CapGui13/QPJB/commit/7d889c5494a296fa2d677c23371ff5ac60bc3764).

## Méthode

Relecture individuelle de **22 fiches signalées** par les audits pédagogiques précédents : main, points H, séquence, bonne réponse, mauvaises propositions et nombre de raisonnements nécessaires. La difficulté est réévaluée **selon la décision à prendre** plutôt que le nombre de tours d'enchères ou le nombre de points H. Échelle de référence : **1** rappel immédiat d'une règle ; **2** règle courante avec une contrainte ; **3** choix entre plusieurs règles ou convention à interpréter ; **4** plusieurs inférences successives ; **5** véritable arbitrage délicat entre réponses plausibles. La difficulté est une estimation pédagogique, non un taux d'erreur observé chez les élèves.

## Décisions individuelles

| ID | Rubrique | Avant | Après | Bonne réponse conservée | Motif de la note |
|---|---|---:|---:|---|---|
| `SEF-056-1` | second | 4 | **2** | 2♥ | Répéter simplement cinq Cœurs avec une main faible après 1SA, sans créer de séquence forcing. |
| `SEF-V44-024` | second | 4 | **2** | 2♠ | Répéter économiquement une couleur sixième avec une main faible après la redemande mineure. |
| `SEF-N051-2` | majeur | 4 | **3** | 2SA | Reconnaître le 2SA fitté à trois atouts avec une force propositionnelle après 1♥. |
| `SEF-N056-1` | majeur | 4 | **3** | 2SA | Reconnaître le 2SA fitté à trois atouts avec une force propositionnelle après 1♠. |
| `SEF-N013-2` | ouv | 3 | **2** | 1♦ | Appliquer la meilleure mineure avec deux majeures quatrièmes et trois Carreaux. |
| `SEF-N139-2` | second | 3 | **2** | Passe | Avec quatre Cœurs et une main faible, conserver la partielle à 1SA après la redemande de l’ouvreur. |
| `SEF-N140-1` | second | 3 | **2** | Passe | Avec quatre Piques et une main modeste, conserver 1SA plutôt qu’une nouvelle enchère. |
| `SEF-N067-1` | majeur | 4 | **3** | 2♦ | Distinguer soutien majeur et réponse forcing dans une couleur sixième avec une force suffisante. |
| `SEF-008-2` | ouv | 2 | **2** | 1♠ | Avec deux majeures cinquièmes, ouvrir de la majeure la plus chère. |
| `SEF-N002-2` | ouv | 1 | **2** | 1♥ | Tenir compte de la majeure cinquième malgré une main régulière de la zone 1SA. |
| `SEF-N003-1` | ouv | 1 | **2** | 1♠ | Préférer l’ouverture d’une majeure cinquième à 1SA malgré 16 H réguliers. |
| `SEF-N008-1` | ouv | 1 | **2** | 1♦ | Appliquer la meilleure mineure en présence de quatre Trèfles et quatre Carreaux. |
| `SEF-N013-3` | ouv | 3 | **2** | 1♦ | Choisir la meilleure mineure plutôt que l’une des deux majeures quatrièmes. |
| `SEF-V45-009` | fortes | 5 | **3** | 2♥ | Appliquer la réponse conventionnelle montrant zéro As après l’ouverture forcing de manche. |
| `SEF-V45-010` | fortes | 4 | **3** | 2♠ | Appliquer le codage d’un As majeur après l’ouverture de 2♦ forcing de manche. |
| `SEF-V45-011` | fortes | 4 | **3** | 3♣ | Appliquer le codage d’un As de Trèfle unique après l’ouverture de 2♦ forcing de manche. |
| `SEF-V45-012` | fortes | 4 | **3** | 3♦ | Appliquer le codage d’un As de Carreau unique après l’ouverture de 2♦ forcing de manche. |
| `SEF-V44-062` | roudi | 5 | **4** | 2SA | Interpréter une réponse négative au Roudi et proposer la manche à 2SA avec 11 H. |
| `SEF-V44-063` | roudi | 5 | **4** | 3SA | Interpréter l’absence de fit au Roudi et conclure à 3SA avec 13 H. |
| `SEF-V44-064` | roudi | 5 | **4** | 3♥ | Combiner réponse minimum au Roudi, fit confirmé et force propositionnelle pour annoncer 3♥. |
| `SEF-V44-065` | roudi | 5 | **4** | 4♠ | Combiner fit confirmé, ouverture maximum et force du répondant pour conclure à 4♠. |
| `SEF-V44-066` | roudi | 5 | **4** | 4♥ | Combiner fit confirmé au Roudi et force de manche du répondant pour conclure à 4♥. |

## Bilan et limites

- **22/22 exercices lus individuellement** ; **21 notes corrigées** ; **1 note conservée** (`SEF-008-2`, difficulté 2, motif de notation précisé).
- **0 changement** de main, bonne enchère, séquence, distracteurs, identifiant et progression. Les justifications des notes de difficulté ont été rédigées dans `difficultyReason`.
- Les règles de répétition faible de la majeure après 1m–1M–1SA et de Roudi ont été recoupées : [Roudi et inférences — ABC du bridge](https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-2-2b-Roudi.html) et [Roudi en situation — Bridge Saint-Cloud](https://www.bridgesaintcloud.fr/quesaquo1508.html). Le cas `SEF-056-1` à cinq Cœurs a été **conservé**, sans substituer mécaniquement une exigence de six cartes qui n'est pas universelle dans cette séquence.
- Contrôle avant commit : **993 exercices**, 13 cartes, points H et distributions exacts, quatre choix distincts incluant la bonne réponse, difficulté comprise entre 1 et 5.
- **Ne pas généraliser** ce calibrage aux 971 autres exercices sans examen individuel. Il ne constitue ni une certification des réponses des 993 ni une analyse statistique des résultats des joueurs.
