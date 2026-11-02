# QPJB Entraînement — rapprochement nominatif des 11 fiches de revue V6.10 et correctifs B10

**Date : 2 novembre 2026.** Référence : `CapGui13/QPJB`, branche `main`, banque canonique `entrainement/training-data.js`, module actif `entrainement/training-data-bidding.js`. **Ne pas confondre ces 563 questions EN avec les 993 du Quizz SEF.**

## Limites du rapprochement

La feuille de route antérieure mentionnait **11 « anomalies certaines » sur 563 EN**, mais ne donne **aucune liste nominative complète** de ces onze anomalies ni un rapport indépendant permettant de les relier une par une à un verdict. Le fichier source contient **11 annotations nominatives `pedagogicalReview_v610`** : exactement 3 décisions `quarantaine` et 8 `mise_au_point_des_choix`. **L'égalité numérique ne prouve pas qu'il s'agit des mêmes 11 anomalies.** La liste ci-dessous est bien celle des 11 fiches **documentées dans la banque**, et non une reconstruction inventée de l'autre audit.

| Identifiant | Décision et statut actuel | Réponse source conservée | Motif/documentation |
|---|---|---|---|
| `EN-BH-075-04` | **Quarantaine appliquée** | 3♠ | La réponse directe 1♠–3♠ est décrite comme une invitation à 11–12 HLD dans ce corrigé. Sa signification doit être confirmée dans les accords QPJB avant une notation automatique. |
| `EN-BH-056-05` | Propositions revues, réponse conservée | 6SA | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-056-06` | Propositions revues, réponse conservée | 4SA | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-085-02` | Propositions revues, réponse conservée | Passe | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-090-06` | **Quarantaine appliquée** | 6♠ | Après 1♦–1♥–1♠–4♠, le choix de 6♠ directement ne saurait rendre 4SA ou une exploration des contrôles automatiquement faux sans accords explicites. |
| `EN-BH-092-04` | Propositions revues, réponse conservée | 3♥ | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-094-06` | Propositions revues, réponse conservée | 3♠ | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-095-04` | Propositions revues, réponse conservée | 1SA | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-102-01` | **Quarantaine appliquée** | 3♠ | Même traitement du saut direct 1♠–3♠, présenté comme soutien limite à quatre atouts. Conventions et critères de soutien à confirmer pour QPJB. |
| `EN-BH-117-06` | Propositions revues, réponse conservée | 3♥ | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |
| `EN-BH-124-05` | Propositions revues, réponse conservée | 2♥ | Propositions alternatives revues ; validation indépendante de toutes les conventions non achevée. |

## Décisions appliquées et preuves

### Deux ambiguïtés certaines du cours B10 — résolues

Le [rapport source de Passe 01](https://github.com/CapGui13/QPJBTraining/blob/main/docs/audits/RAPPORT_AUDIT_PASSE01.md) précisait que :
- **`EN-1m-009` (B10-4)** : le corrigé admet le soutien **2♣** tout en préférant **1SA** ; 2♣ ne peut donc pas figurer comme réponse strictement fausse. Il a été remplacé par **1♦** (seulement deux ♦ dans la main), tandis que **1SA** et les autres propositions restent identiques ; explication, aide préalable et motif du distracteur mis à jour.
- **`EN-1m-011` (B10-6)** : le corrigé envisage **1♠** tout en privilégiant **1♦** avec six beaux Carreaux. Le distracteur 1♠ a été remplacé par **2♦** à saut, trop fort pour les **7 H** de la main. Bonne réponse **1♦** conservée.

Le cas `EN-1m-020`, troisième alternative mentionnée dans Passe 01, était **déjà traité** : `1♦` reste reconnu comme acceptable dans le corrigé et ne figure plus parmi les quatre choix pénalisés. Il n'a **pas** été modifié pendant ce lot.

Commits : [correctif actif `e1a5a938`](https://github.com/CapGui13/QPJB/commit/e1a5a9383f2d18ce71ce4c40a55c9ab41a958ba4) ; [source canonique `2720cb0d`](https://github.com/CapGui13/QPJB/commit/2720cb0da48442dbbccc61d19667cb62fea998b2). Les identifiants, mains, séquences, réponses correctes et enregistrements `localStorage` ont été conservés.

### Trois décisions « quarantaine » de la revue V6.10 — rendues effectives

`EN-BH-075-04`, `EN-BH-090-06`, `EN-BH-102-01` avaient chacun `pedagogicalReview_v610.decision === "quarantaine"`, **sans arbitrage ultérieur enregistré**, mais `reviewStatus: "transcrit_source"`. Le filtre de l'application masque exclusivement les fiches dont `reviewStatus === "a_verifier"`. Il en résultait que ces trois fiches **pouvaient encore être proposées et évaluées**, contrairement à leur décision de revue enregistrée.

Les trois statuts ont été corrigés en `a_verifier` dans la banque maîtresse et le module actif ; aucune proposition, aucun corrigé, aucune main et aucun ID supprimé. Leurs raisons de quarantaine restent présentes. Les huit autres fiches de la revue V6.10 ne changent pas de statut.

**Bilan de disponibilité :** **563 EN stockés**, **560 actuellement proposés**, **3 masqués provisoirement** en attendant une solution pédagogique documentée. Le filtre d'accès protège aussi les liens directs vers ces trois fiches. Les données locales déjà enregistrées ne sont **pas effacées** et redeviennent disponibles si une correction ultérieure autorise la réintégration. La baisse temporaire du nombre de fiches visibles est intentionnelle, non une disparition de données.

### Chargement, versionnement, non-régression

- Sources synchronisées : `training-data.js`, `training-data-bidding.js`, `training-data-bootstrap.js` et générateur `scripts/split_training_data.cjs`. Catégories concernées : `rep1M` 20→18, `suite-ouvreur` 16→15 ; compteur d'enchères disponibles 563→560 (données conservées 563).
- Assets versionnés `20261102b` dans `entrainement/index.html`, bootstrap, générateur, `service-worker.js` ; cache PWA `qpjb-v41`. Le jeu de la carte reste inchangé (**114 fiches, 111 disponibles**).
- Tests ciblés : `tests/training-smoke.cjs` vérifie les deux ambiguïtés B10, la synchronisation canonique/module, les trois statuts en quarantaine, les réponses source conservées et les compteurs. `tests/training-offline.cjs` vérifie les nouvelles URLs PWA.
- Les tests CI Chromium/WebKit et la publication Pages doivent être **confirmés sur le dernier commit**, sans confondre `pending`/`cancelled`/`skipped` avec `success`. Aucun test physique iPhone/Safari n'est revendiqué.

## Suite du chantier des onze anomalies annoncées

**À rapprocher avant toute autre correction :** retrouver, dans les preuves des autres audits, les **11 identifiants exacts** annoncés mais non transcrits dans la feuille de route. Les 11 fiches V6.10 ci-dessus constituent un groupe distinct vérifiable ; seules les trois décisions explicites de quarantaine ont été exécutées. Les huit autres décisions « mise au point des choix » ne constituent pas par elles-mêmes huit fautes pédagogiques certaines.

Reprendre ensuite les situations signalées par les rapports Passe 02/Passe 03 (vulnérabilité et conventions Stayman/Texas) **individuellement**, avec les PDF originaux avant de changer une bonne réponse. Conserver les PDF, les IDs, les historiques de progression et un rapport de décision par exercice.
