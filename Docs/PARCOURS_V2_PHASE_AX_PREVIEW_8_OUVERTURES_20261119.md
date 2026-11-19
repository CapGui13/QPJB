# QPJB V2 — Phase AX : pré-sélection réelle des ouvertures avancées

**19 novembre 2026 · PR #214 (Draft) · exercice de prévisualisation local, sans publication.**

## Avancement concret

La phase AX ne se contente pas d'inventorier des PDF : elle fournit un **atelier interactif autonome de huit questions**, reprenant intégralement les mains et les réponses publiées d'origine, pour juger leur pertinence pédagogique en situation. Le fichier `QPJB_V2_AX_Atelier_8_Ouvertures.html` est remis dans la conversation, pas déployé sur GitHub Pages.

- **5 QCM existants** d'Entraînement : les choix et la réponse du catalogue sont repris **sans aucun distracteur inventé**.
- **3 problèmes BH-035** (fascicule du 4 novembre 2022, page 2) : présentés à **réponse libre**, comme le sujet original ; les réponses correspondent au corrigé PDF.
- **8 mains complètes**, **7 familles d'apprentissage provisoires** : EN-BH-067-06 et EN-BH-114-04 relèvent tous deux de l'ouverture à la meilleure mineure d'un jeu régulier de 19 H.
- La progression simulée est **locale à la page**. Aucun stockage, aucune récupération d'identité, aucun changement du Quiz SEF ou de son catalogue.
- Vérification Chromium **desktop 1440×900 et mobile 390×844** : navigation entre huit cas, sélection des enchères d'origine, affichage de la réponse du support, remise à zéro, absence d'erreur JavaScript et de débordement horizontal. **WebKit non testé à cette étape**.

Le manifeste de décisions éditoriales est `Docs/PARCOURS_V2_PHASE_AX_CANDIDATS_OUVERTURES_20261119.json`. Il conserve `releaseDecision: HOLD`, `editorialApproved: 0` et `integratedToQuizSEF: 0`.

## Décision pédagogique proposée, main par main

| ID | Réponse d'origine | Concept réellement travaillé | Emplacement **proposé**, pas effectif | Position |
| --- | --- | --- | --- | --- |
| `EN-BH-067-06` | **1♣** | 19 H réguliers, ne pas ouvrir de 2SA | S15–22 | Rappel / initiation au 18–19 H |
| `EN-BH-114-04` | **1♣** | Même compétence avec un jeu 4-3-3-3 | S15–22 | Variante contrastive **de la même famille** |
| `EN-BH-114-05` | **1♦** | Bicolore mineur fort 5–5 à 20 H : préserver la description au deuxième tour | S28–38 | Candidat avancé |
| `EN-BH-096-06` | **1♦** | Bicolore 6♦–4♥ à 20 H, ouverture dans la longue | S28–38 | Candidat avancé |
| `EN-BH-114-06` | **2SA** | Exception de traitement d'une main 6-3-2-2, 19 H / 21 HL, avec six ♣ et les deux majeures gardées | S40–50 | **Conditionnel** à l'accord système |
| `BH-035-S02-01` | **1♥** | Bicolore fort 5♥–4♣ à 21 HL : préférer l'ouverture de 1 à la couleur | S30–40 | Candidat avancé |
| `BH-035-S02-02` | **2♣** | Belle majeure sixième et 21 HL : 2♣ fort indéterminé | S35–45 | Candidat avancé |
| `BH-035-S02-03` | **1♥** | Bicolore fort 6♥–5♦ à 20 HL : anticiper la redemande | S35–45 | Candidat avancé |

Les fenêtres de séances sont **des propositions** : le moteur V2-F ne sélectionne encore aucune de ces huit nouvelles pistes au titre de ce projet.

## Expertise des règles, séparée de la fidélité documentaire

Les trois réponses BH-035 sont conformes au **corrigé original**, dont les pages ont été contrôlées visuellement et dont les fichiers PDF concordent avec les empreintes SHA-256 de l'inventaire A. Leurs choix sont **compatibles** avec les présentations pédagogiques du 2♣ fort indéterminé et des bicolores naturels ; ce n'est pas une certification de toutes les redemandes possibles sous SEF 2024.

Les références complémentaires consultées :
- [iBridge — ouverture de 2♣ dans le SEF 2024](https://www.ibridge.fr/public/fichedetails/778) : mains régulières très fortes, unicolores solides, 20 HL et belle majeure sixième, certains bicolores majeurs.
- [iBridge — ouverture de 2SA confirmés](https://dev.ibridge-club.fr/public/fichedetails/401) : les mains 6322 à mineure sixième peuvent être assimilées à une main régulière **si les deux majeures sont gardées** ; quelques mains de 19 H peuvent être réévaluées. La main EN-BH-114-06 **ne généralise pas** l'ouverture de 2SA à toutes les mains de 19 H.
- [Bridge Chailley — SEF 2024](https://www.bridge-chailley.fr/le-sef-2024-1/) : les critères de levées de défense et la prudence avec les ouvertures fortes sont rappelés. L'adoption de cet accord avancé dans QPJB reste à confirmer.

**Réserve spécifique BH-035** : les corrigés mentionnent des sauts au second tour (`3♣` ou `3♦`) sans préciser la réponse exacte du partenaire à chaque fois. Il faut conserver ces indications comme **exemples de redemande à contextualiser**, pas comme automatisme universel.

**Réserve spécifique BH-114 2SA** : le support original du 3 mai 2024 recommande 2SA avec 19 H / 21 HL, distribution 2-2-3-6 et deux doubletons majeurs protégés. Cette main est **une nuance pédagogique avancée** et doit être signalée comme telle ; toute explication disant « 2SA = 19–21 H » serait trompeuse.

## Critères de promotion future dans le parcours guidé

1. Recueillir le verdict éditorial sur chacune des **7 compétences** et le statut de la variante 19 H (garder un cas ou les deux comme contraste).
2. Si validées, **lier les situations authentiques comme une banque complémentaire distincte**, sans modifier ou renuméroter les 1 523 QCM SEF ni altérer Entraînement. Les trois problèmes BH-035 resteraient à réponse libre sauf autorisation d'une adaptation spécifique.
3. Comparer, à sources constantes, leur contribution à la présence d'ouvertures fortes dans les séances 25–50, au maintien des rappels et à la diversité des réponses. Une simulation ne vaut pas une preuve d'apprentissage réel.
4. Seulement ensuite décider du mécanisme d'intégration dans une nouvelle itération testable V2, avec retour à V1, recette et publication distincte.

**État : `8_CAS_AUTHENTIQUES_JOUABLES_HORS_LIGNE / 7_FAMILLES_CANDIDATES / 0_QCM_MODIFIE / 0_PUBLICATION / PR_DRAFT`.**
