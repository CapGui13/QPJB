# Parcours QPJB V2 — phase K : cartographie des 15 fondations
**18 novembre 2026 — proposition hors production, PR #214.**

## Résultat vérifiable
- **15 fondations** reprises à l'identique du graphe documentaire de phase J.
- **47 identifiants QCM distincts** extraits du catalogue original de 1 523 QCM dans `quizz.html`. **50 associations** au total : un QCM peut illustrer plusieurs notions, mais il ne constitue alors **pas deux preuves indépendantes**.
- **2 fondations insuffisamment étayées** par une seule famille indépendante : Texas mineur sur 2SA et 3SA gambling. Une troisième (Texas mineur sur 1SA) nécessite un arbitrage SEF/convention avant d'être recommandée. L'évaluation des points H est **indirecte** : les QCM demandent une décision d'ouverture, pas un comptage isolé.
- Les **15 fondations de la phase J restent inchangées et non actives**. Cette phase K est une table de correspondances candidate, **pas** un ensemble de prérequis obligatoires.

## Inventaire
La colonne « séance min. » est un **repère hypothétique d'introduction**, non un temps d'apprentissage validé ni un seuil de déblocage. Les nombres de familles sont calculés avec `caseFamily || id`.

| Fondations candidates | Séance min. | QCM liés | Familles | État |
|---|---:|---:|---:|---|
| Evaluer points H, longues et distribution | 0 | 4 | 4 | Indirecte (pas de calcul H démontré) |
| Identifier une ouverture 1SA 15–17 H | 0 | 3 | 3 | Candidate, revue enseignant |
| Identifier une ouverture 2SA 20–21 H | 0 | 3 | 3 | Candidate, revue enseignant |
| Repérer le fit majeur et le nombre d'atouts | 1 | 3 | 3 | Candidate, revue enseignant |
| Distinguer invitation et conclusion à la manche | 3 | 4 | 4 | Candidate, revue enseignant |
| Comprendre l'objectif d'un Stayman après 1SA | 7 | 4 | 4 | Candidate, revue enseignant |
| Comprendre le transfert majeur après 1SA | 7 | 3 | 3 | Candidate, revue enseignant |
| Comprendre le contre adverse et ses conséquences | 10 | 3 | 3 | Candidate, revue enseignant |
| Comprendre le Stayman après 2SA | 12 | 4 | 4 | Candidate, revue enseignant |
| Comprendre le transfert majeur après 2SA | 12 | 4 | 4 | Candidate, revue enseignant |
| Comprendre le Texas mineur après 1SA | 16 | 4 | 4 | Arbitrage conventionnel |
| Comprendre le Texas mineur après 2SA | 22 | 1 | 1 | Insuffisante (une famille) |
| Distinguer 4SA quantitatif de 4SA Blackwood | 24 | 5 | 5 | Candidate, revue enseignant |
| Comprendre l'ouverture conventionnelle de 3SA gambling | 30 | 1 | 1 | Insuffisante (une famille) |
| Comprendre l'exploration de chelem | 39 | 4 | 4 | Candidate, revue enseignant |

## Rotation exploratoire, sans moteur de maîtrise
`scripts/parcours-v2-fondations.cjs` expose `proposeFoundations(data, completedSessions, limit=4)`, une fonction **non appelée par le site élève**.
1. Elle ignore les notions qui n'ont pas atteint leur repère de première présentation, mais n'interdit jamais l'accès à un exercice du catalogue.
2. Elle écarte par défaut les deux couvertures insuffisantes et le Texas mineur sur 1SA non arbitré ; les exercices restent conservés dans le Quiz SEF.
3. Elle choisit jusqu'à **deux notions récemment introduites** (depuis deux séances), puis complète avec des notions plus anciennes en rotation déterministe ; l'objectif est de ne pas recommencer quarante questions d'ouverture identiques.
4. Elle retourne des **IDs et libellés pour revue**, sans déduire de compétence acquise, sans mémoriser les réponses, sans modifier la sélection publique ni les rappels existants. Les 22 rubriques et leurs 1 315 familles restent le terrain de jeu du moteur V2 ; cette cartographie de 47 QCM ne saurait remplacer le catalogue.

La répartition réelle des QCM, la progression pédagogique, les alternatives recevables et la performance d'élèves devront être évaluées ultérieurement ; les neuf simulations de phase J sont synthétiques.

## Arbitrages nécessaires
- **Comptage H :** ajouter/retrouver des exercices vérifiant explicitement le comptage et le raisonnement, ou cesser d'en faire une fondation certifiable. Réutiliser une main où le total H est seulement pris en compte ne suffit pas.
- **2SA et Texas mineurs :** confirmer les accords adoptés et l'intitulé exact des compétences, puis rechercher plusieurs familles indépendantes avant toute certification.
- **Texas mineurs sur 1SA :** revoir les suites SEF 2024 et la modulation du Texas Trèfle, sans changer d'office les réponses.
- **3SA gambling :** cas conventionnel unique, rattachement aux barrages à réexaminer. À traiter comme situation particulière, pas comme seuil de maîtrise.
- **4SA quantitatif / Blackwood :** maintenir deux objectifs distincts. Les QCM de Blackwood présents comme contraste ne prouvent pas la maîtrise du quantitatif.
- **Vie privée / traçabilité :** aucun profil d'élève ni résultat réel n'est utilisé. Aucun `localStorage`, API ou changement de données publiques.

## Contrôles
- `node tests/quizz-v2-fondations.cjs` : vérifie les 47 IDs et les 50 liens sur les textes originaux, les 15 noms du graphe J, les familles, les réponses et justifications inchangées, les statuts d'alerte et l'absence de maîtrise/déblocage.
- `node scripts/parcours-v2-fondations.cjs 12` : simple exemple de rotation à 12 séances terminées.
- L'interface V1.10 et le prototype autonome H/I restent **inchangés**. Les futurs arbitrages feront l'objet de modifications séparées, explicites et testées.

**Décision de phase K : CARTOGRAPHIE_DOCUMENTAIRE_REALISEE / EXPERIMENTATION_EN_ATTENTE / PAS_DE_DEPLOIEMENT.**
