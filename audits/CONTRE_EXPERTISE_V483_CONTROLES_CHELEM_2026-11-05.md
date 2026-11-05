# QPJB Quiz V4.83 — Contre-expertise : contrôles avant Blackwood

**Date :** 5 novembre 2026. **Dépôt :** `CapGui13/QPJB`, branche `quiz-v483-controles-chelem-sef`, départ de `main` `eb85049a3fe385b38407db4454452fb278bfc112`. **Périmètre :** uniquement le Quiz SEF `quizz.html`.

## Besoin démontré par la cartographie

La rubrique « Contrôles, Splinters et Blackwood » comportait **21 QCM**, dont **18 sur le Blackwood ou la Dame d'atout** et **3 Splinters**, mais **aucune question demandant de nommer un contrôle de chelem** avant le Blackwood. Les données des **1 145 QCM** ont été relues et classées dans `audits/CARTOGRAPHIE_1145_QUIZ_SEF_2026-11-05.csv`, avec une synthèse dans `audits/CARTOGRAPHIE_PEDAGOGIQUE_V482_1145_2026-11-05.md`.

La V4.83 apporte **16 décisions**, centrées sur une même compétence réellement nouvelle : après un fit Pique établi et une première enchère de contrôle de l'ouvreur, le répondant doit nommer **son contrôle de premier ou second tour le plus économique**, ou **revenir à 4♠** si aucun contrôle pertinent n'est disponible. Comparaisons de mains volontairement proches : As, Roi, singleton, chicane ; Dame/Valet sans contrôle ; deux contrôles possibles ; contrôle redondant dans la couleur déjà montrée ; « bon nombre de points » mais trou non contrôlé.

L'objectif est de placer la séquence de contrôles **avant** le Blackwood, compétence absente alors que le Quiz enseigne déjà le Blackwood. Pas de remplissage pour atteindre un quota.

## Convention et limites

- **Le contrôle de 1er tour** est l'As ou la chicane ; **le contrôle de 2e tour** est le Roi ou le singleton, quand l'atout est déjà fixé.
- Un saut de contrôle signifie que la couleur sautée **n'est pas contrôlée par le joueur qui parle**, une fois le processus engagé ; il ne prouve pas qu'aucun des deux partenaires ne la contrôle.
- Si aucune information de contrôle exploitable ne peut être donnée sous le palier de la manche Pique, revenir à **4♠** constitue un coup de frein ; **4SA Blackwood** est prématuré tant que les contrôles indispensables ne sont pas clarifiés.
- Deux séquences comparables et enseignées : `1♠ – 3♠ – 4♣` et `1♠ – 3♠ – 4♦`. Il s'agit **de la réponse du joueur soutenant à quatre cartes**, après que l'ouvreur a déclenché les contrôles. Ce lot ne prétend pas couvrir tous les mécanismes experts de lancement des contrôles (3SA relais, contrôle interrogatif, anticolores, etc.) et ne demande pas à l'élève de choisir des accords de paire.

**Références de méthode :**
- [iBridge : *Procédure pour demander un chelem à l'atout*](https://www.ibridge.fr/public/fichedetails/526) — attribution des contrôles, priorité économique et arrêt quand un contrôle manque.
- [Bridge Club Palmarium / FFB : *Les enchères de contrôle*](https://clubpalmarium.club.ffbridge.fr/documents/encheres-de-controle-371980) — différence contrôle/essai après fit majeur, As/Roi/courtes, et exemples `1♠–3♠`.
- [Chailley : *La gestion des contrôles*](https://www.bridge-chailley.fr/la-gestion-des-controles/) — ordre, coups de frein et prudence sur les développements experts.

## Reconstitution des 16 mains, réponses et 48 propositions erronées

Notation main : **♠ / ♥ / ♦ / ♣**. Chaque main contient **13 cartes**, sans doublon de rang dans une même couleur, avec H et forme recalculés. Le soutien annoncé à 3♠ comporte toujours **quatre Piques**. Le fit est connu, les adversaires passent.

| ID | Contrôle initial ouvreur | Main | H | Forme | Bonne enchère | Trois autres choix |
|---|---|---|---:|---|---|---|
| `SEF-V483-001` | 4♣ | ♠RV94 / ♥D85 / ♦A72 / ♣964 | 10 | 4–3–3–3 | **4♦** | 4♥, 4♠, 4SA |
| `SEF-V483-002` | 4♣ | ♠DV95 / ♥A84 / ♦R72 / ♣984 | 10 | 4–3–3–3 | **4♦** | 4♥, 4♠, 4SA |
| `SEF-V483-003` | 4♣ | ♠R1085 / ♥A942 / ♦7 / ♣V1082 | 8 | 4–4–1–4 | **4♦** | 4♥, 4♠, 4SA |
| `SEF-V483-004` | 4♣ | ♠D1086 / ♥R1093 / ♦— / ♣V9876 | 6 | 4–4–0–5 | **4♦** | 4♥, 4♠, 4SA |
| `SEF-V483-005` | 4♣ | ♠R986 / ♥A84 / ♦D105 / ♣972 | 9 | 4–3–3–3 | **4♥** | 4♦, 4♠, 4SA |
| `SEF-V483-006` | 4♣ | ♠A975 / ♥R73 / ♦V84 / ♣V106 | 9 | 4–3–3–3 | **4♥** | 4♦, 4♠, 4SA |
| `SEF-V483-007` | 4♣ | ♠RV98 / ♥8 / ♦DV95 / ♣10864 | 7 | 4–1–4–4 | **4♥** | 4♦, 4♠, 4SA |
| `SEF-V483-008` | 4♣ | ♠RD98 / ♥DV4 / ♦D109 / ♣874 | 10 | 4–3–3–3 | **4♠** | 4♦, 4♥, 4SA |
| `SEF-V483-009` | 4♣ | ♠D986 / ♥V97 / ♦D85 / ♣A104 | 9 | 4–3–3–3 | **4♠** | 4♦, 4♥, 4SA |
| `SEF-V483-010` | 4♣ | ♠D1085 / ♥7 / ♦A943 / ♣R862 | 9 | 4–1–4–4 | **4♦** | 4♥, 4♠, 4SA |
| `SEF-V483-011` | 4♦ | ♠RV97 / ♥A72 / ♦986 / ♣V84 | 9 | 4–3–3–3 | **4♥** | 4♠, 4SA, 5♣ |
| `SEF-V483-012` | 4♦ | ♠A964 / ♥R83 / ♦D72 / ♣875 | 9 | 4–3–3–3 | **4♥** | 4♠, 4SA, 5♣ |
| `SEF-V483-013` | 4♦ | ♠RV108 / ♥6 / ♦A973 / ♣10852 | 8 | 4–1–4–4 | **4♥** | 4♠, 4SA, 5♣ |
| `SEF-V483-014` | 4♦ | ♠R1098 / ♥DV4 / ♦975 / ♣A86 | 10 | 4–3–3–3 | **4♠** | 4♥, 4SA, 5♣ |
| `SEF-V483-015` | 4♦ | ♠D1096 / ♥— / ♦R1076 / ♣V9852 | 6 | 4–0–4–5 | **4♥** | 4♠, 4SA, 5♣ |
| `SEF-V483-016` | 4♦ | ♠RV85 / ♥D97 / ♦A104 / ♣862 | 10 | 4–3–3–3 | **4♠** | 4♥, 4SA, 5♣ |

### Analyse individuelle de chacun des 48 distracteurs

- **`SEF-V483-001` → 4♦** : 4♥ sauterait le contrôle Carreau prioritaire ; 4♠ arrêterait prématurément les contrôles ; 4SA brûlerait l'étape de vérification avant les cartes clés.
- **`SEF-V483-002` → 4♦** : 4♥ cacherait le Roi de Carreau, contrôle de second tour ; 4♠ fermerait la recherche malgré ce contrôle ; 4SA serait trop tôt avant d'avoir précisé les contrôles.
- **`SEF-V483-003` → 4♦** : 4♥ ignorerait la courte Carreau, véritable contrôle ; 4♠ conclurait trop tôt ; 4SA omettrait la recherche du contrôle de Carreau.
- **`SEF-V483-004` → 4♦** : 4♥ sauterait la chicane Carreau, contrôle de premier tour ; 4♠ freinerait sans raison ; 4SA contournerait la marche économique.
- **`SEF-V483-005` → 4♥** : 4♦ ferait croire à un contrôle Carreau, que la Dame seule ne procure pas ; 4♠ nierait l'information utile du contrôle Cœur ; 4SA n'est pas le moment de vérifier les clés.
- **`SEF-V483-006` → 4♥** : 4♦ attribuerait à tort un contrôle au Valet Carreau ; 4♠ cacherait le Roi Cœur ; 4SA ignorerait une information de contrôle non encore annoncée.
- **`SEF-V483-007` → 4♥** : 4♦ prétendrait contrôler les Carreaux avec Dame-Valet ; 4♠ tairait le singleton Cœur ; 4SA viendrait avant la vérification des contrôles.
- **`SEF-V483-008` → 4♠** : 4♦ ferait croire à un contrôle Carreau avec Dame seule ; 4♥ ferait croire à un contrôle Cœur avec Dame-Valet ; 4SA demanderait les clés sans protection contre deux perdantes rapides.
- **`SEF-V483-009` → 4♠** : 4♦ inventerait un contrôle Carreau, la Dame seule étant insuffisante ; 4♥ inventerait un contrôle Cœur ; 4SA serait hasardeux malgré l'As de Trèfle déjà redondant.
- **`SEF-V483-010` → 4♦** : 4♥ cacherait le contrôle Carreau exprimable à plus bas palier ; 4♠ renoncerait inutilement ; 4SA sauterait toute la phase des contrôles.
- **`SEF-V483-011` → 4♥** : 4♠ conclurait trop tôt malgré l'As de Cœur ; 4SA demanderait les clés avant la réponse sur Cœur ; 5♣ dépasserait la manche en annonçant une couleur qui n'est pas le problème.
- **`SEF-V483-012` → 4♥** : 4♠ cacherait le contrôle Cœur de second tour ; 4SA court-circuiterait l'information au partenaire ; 5♣ dépenserait un palier inutile pour une autre couleur.
- **`SEF-V483-013` → 4♥** : 4♠ tairait le singleton Cœur ; 4SA ignorerait le contrôle demandé ; 5♣ chercherait un autre contrôle au-dessus de 4♠ sans annoncer le singleton.
- **`SEF-V483-014` → 4♠** : 4♥ ferait croire à un contrôle Cœur absent malgré Dame-Valet ; 4SA lancerait les clés sans contrôle Cœur ; 5♣ dépasserait la manche pour annoncer un Trèfle sans résoudre la lacune Cœur.
- **`SEF-V483-015` → 4♥** : 4♠ arrêterait sans montrer la chicane Cœur ; 4SA brûlerait la nomination du contrôle Cœur ; 5♣ éviterait le contrôle réellement demandé.
- **`SEF-V483-016` → 4♠** : 4♥ inventerait un contrôle Cœur (la Dame est insuffisante) ; 4SA poserait le Blackwood sans ce contrôle ; 5♣ dépasserait la manche en ignorant le trou Cœur.

Ces raisons figurent uniquement dans le **rapport de contrôle**. Le corrigé visible dans le Quiz n'explique que la bonne enchère.

## Contrôles automatiques bloquants

1. **1 145 historiques intacts**, même ordre et mêmes objets, empreinte `tests/quizz-baseline-1145-gitsha.json`, SHA Git Blob : `5852784b3d62d761b9f1dd62e57cb97c9a371437`.
2. Chacune des 16 mains : 13 cartes, rangs valides, points H exacts et concordance `shape`/distribution ; fit ♠ de quatre cartes.
3. Quatre choix de contrats licites, distincts et ordonnés par cherté, **au-dessus** de la dernière enchère de contrôle. Aucune proposition d'une couleur déjà dépassée.
4. Validation de la réponse recalculée d'après les cartes : Carreau prioritaire après 4♣ ; sinon Cœur ou arrêt à 4♠ ; après 4♦, Cœur ou arrêt à 4♠.
5. Relecture des **48 distracteurs** ci-dessus. Explication pédagogique affichée **uniquement de la bonne enchère**. Nouvelles difficultés limitées à 3–4.
6. **22 rubriques et tous les 1 145 QCM préexistants préservés**, ainsi que les 677 exercices d'Entraînement, les PBN, la navigation et les archives.
7. À vérifier sur la SHA finale de PR : **Audit et tests de régression, Chromium, WebKit**, puis validation sur `main` et GitHub Pages **avant de déclarer V4.83 publiée**.

## Limites de la contre-expertise

Une carte descriptive n'est pas une révision manuelle de 1 145 réponses : le verrou protège techniquement l'historique, non sa perfection théorique. Les 16 mains nouvelles sont contrôlées selon le cadre SEF pédagogique exposé ici. **Ne pas fusionner la PR si la CI signale un échec ou si une variante de contrôle contradictoire avec ce cadre apparaît.**
