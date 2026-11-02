# QPJB — suivi des upgrades (2 novembre 2026)

Référence : `QUIZZ_REFERENCE_SEF.md`. Ne jamais changer une bonne réponse, un ID, le stockage local ou supprimer un exercice sans validation pédagogique.

## État vérifié au début de cette session
- 993 exercices, 413 corrigés `whyNot` (recomptage du JSON embarqué dans `quizz.html`).
- CI précédente : `23e3ab0` réussie ; publication Pages du catalogue `94674c9` réussie.
- Rubriques compétitives repérées (sans certification individuelle) : intervenir 56, contre 41, après intervention 65, répondre à intervention 44, réveil 43. Total 249 exemples dans ces cinq rubriques. Le volume ne prouve pas la qualité des cas.
- Aucun résultat anonyme agrégé de réussite n'a été utilisé pour attribuer les difficultés.

## Lots de cette session
- **Upgrade 9 — soumis, validation en attente** : `19b902d` espace jusqu'à trois positions les variantes d'une même famille, après la sélection aléatoire/adaptative. Conserve toutes les questions retenues, leurs IDs, l'ordre de priorité dans la mesure du possible, les modes et le stockage existant.
- **Tests de l'upgrade 9 — soumis, validation en attente** : `5617d08` ajoute des assertions déterministes : même entrée/même sortie, aucun ID perdu ou dupliqué, séparation des familles lorsqu'une alternative existe.
- **Upgrades 2/3** : 413 contrastes existants conservés ; aucun distracteur modifié sans audit individuel.
- **Upgrade 7** : à traiter par lots audités ; échelle proposée : 1 reconnaissance directe d'une règle, 2 choix entre deux règles usuelles, 3 prise en compte d'une contrainte contextuelle, 4 combinaison de plusieurs inférences, 5 arbitrage entre enchères plausibles avec exceptions. Le nombre de points H et la longueur de séquence ne suffisent pas. Cas ambigus à isoler.
- **Upgrade 8** : priorité au contre d'appel, interventions, réveils, soutiens compétitifs ; audit de la couverture et de la conformité SEF requis avant toute modification.
- **Upgrade 11** : les derniers tests du clavier iPhone sont passés ; les sauts de scroll au repli/feedback restent à mesurer en WebKit et Chromium avant d'affirmer la correction.

## File de reprise
1. Lire le dernier état main/CI/Pages et résoudre toute CI rouge avant de déployer.
2. Tester la séparation des familles sur WebKit/Chromium et les modes progressif, intelligent, révision.
3. Mesurer la stabilité de scroll sur iPhone pendant ouverture, fermeture, validation et retour arrière ; corriger par petit lot avec tests.
4. Auditer individuellement un groupe d'exercices compétitifs et les distracteurs avec preuves SEF ; conserver les cas litigieux pour validation.
5. Étalonner la difficulté pédagogique sur un échantillon de chaque rubrique, sans réécrire mécaniquement les 993 niveaux.

## Notifications
Aucun e-mail de validation envoyé dans cette session : ne notifier qu'après CI **et** Pages confirmés réussis pour le nouveau lot. Ne pas marquer de commit comme notifié avant envoi Gmail effectif.

## Session suivante — navigation mobile (upgrade 11)
- CI précédente vérifiée : smoke `7a6dcf0` réussie, Pages `de92a304` réussie. Le lot d'espacement (upgrade 9) est donc publié.
- Correction soumise : `a3a7039` évite de faire défiler le corrigé jusqu'à 14 % de la hauteur de l'écran ; ne défile plus que si le début du corrigé est sous le bord visible, avec marge de 24 px. Ne change ni les exercices ni les données locales.
- À valider : CI WebKit et Chromium, puis publication Pages ; vérifier sur iPhone le défilement à la validation avec clavier ouvert et fermé, ainsi que les retours arrière. Ce correctif est ciblé et ne garantit pas encore la résolution de tous les sauts de scroll.
- Upgrades 2, 3, 7 et 8 : pas de modification pédagogique sans contrôle SEF individuel.


---

## Actualisation de la feuille de route — consolidation des audits (2 novembre 2026)

**Référence de consolidation** : `QPJB_consolidation_finale_2026-11-02.md` (rapport conservé dans la bibliothèque de travail ChatGPT). **Source de vérité opérationnelle** : ce fichier de suivi dans `audits/`, à actualiser après chaque lot vérifié. Le document `QPJB_TRAINING_REPRISE.md` reste dédié à l'ergonomie et aux données Entraînement, et ne remplace pas cette feuille de route globale.

### Bilan confirmé et limites de couverture

- Quizz `quizz.html` : **993 exercices** présents, vérification structurelle du catalogue effectuée (13 cartes, compte des points H, distribution, quatre réponses distinctes et présence de la réponse correcte dans les choix).
- Quatre audits indépendants : enchères à deux étendu **586/586**, second contrôle enchères à deux **481/481**, sans-atout/conventions/chelems **245/245**, enchères compétitives **249/249** (56 intervenir, 41 contre, 65 après intervention, 44 réponse à intervention, 43 réveils). Les **9 derniers réveils** ont été inspectés dans la dernière reprise. Les bilans antérieurs restent fondés sur leurs rapports respectifs.
- **1 561 passages** annoncés ou réalisés, avec chevauchements importants ; au moins **873 identifiants distincts** attestés par les ensembles disjoints récapitulés dans la consolidation. **Ne pas écrire « 993/993 individuellement audités »** : aucune liste complète des IDs effectivement lus par toutes les instances n'a été réconciliée.
- Audit Entraînement distinct : **563/563 exercices `EN-*`** contrôlés dans `entrainement/training-data-bidding.js`, **11 anomalies certaines signalées** ; ne pas les confondre avec les 993 du Quizz ni les modifier sans analyse dédiée.

### Corrections validées et enregistrées dans main

- Commit [`196e3946`](https://github.com/CapGui13/QPJB/commit/196e3946f341b8125b7bc3d25f1863dab4e1b224) : **13 exercices** corrigés ou explications harmonisées. Déjà traité, ne pas réouvrir les mêmes anomalies comme « non corrigées » sans preuve nouvelle.
- Commit [`ba32da4e`](https://github.com/CapGui13/QPJB/commit/ba32da4e3f60dba6de03e8967e0db9f005178d85) : **6 exercices** ajustés. `SEF-V49-032` (2♥ à la place de 1SA après intervention à 1♥), `SEF-V44-009` et `SEF-V44-010` (mains rééquilibrées pour une zone propositionnelle de 12 HLD), `SEF-V49-023` (4♥ après recalcul à 14 HLD), `SEF-V4-054-2` et `SEF-V4-069-1` (corrigés de réveil clarifiés). Nouveau blob `quizz.html` vérifié `6e0c3af5e6f3eda08e2551bb72233cdd52a80dfa`.
- Tests après `ba32da4e` : **QPJB Training smoke** [réussi](https://github.com/CapGui13/QPJB/actions/runs/41436874771) ; **Actualiser le catalogue** [réussi](https://github.com/CapGui13/QPJB/actions/runs/41436874589). Le commit automatique [`61fb905e`](https://github.com/CapGui13/QPJB/commit/61fb905e019522f185be76452bc4c9addff4a1a6) a modifié `site-version.json` ; **Pages run 122** [réussi](https://github.com/CapGui13/QPJB/actions/runs/41437333743), terminé le 2 novembre 2026 à 11:31 UTC : le dernier lot SEF est publié. La validation visuelle sur iPhone reste distincte de cette réussite CI/Pages.

### File de route active — par priorité

1. **P0 — Non-régression** : CI et Pages du lot SEF confirmés réussis ; **à faire** : vérifier que l'interface, la navigation sans rechargement, la progression et les données locales sont préservées sur les appareils cibles.
2. **P1 — Arbitrages SEF indépendants** : reprendre individuellement les **12 soutiens mineurs** discutables (ne pas réécrire en bloc), puis les **14 soutiens compétitifs** signalés, les cas de vulnérabilité/doublons et les ambiguïtés des barrages, Drury et ouverture forte. Ne changer une réponse que si l'analyse de la main, de la séquence et de la convention le justifie fermement.
3. **P1 — Couverture unique** : constituer un registre des **993 IDs** avec statut `vérifié` / `à revoir` / `non documenté` par lot et source de preuve ; rapprocher les rapports pour ne pas confondre passages et fiches uniques.
4. **P2 — Qualité pédagogique** : auditer les distracteurs relevés (dont les **17** candidats de l'audit SA/conventions), éliminer les choix trop flagrants ou doublement défendables ; enrichir la justification de **la seule bonne enchère** et recalibrer la difficulté de 1 à 5 selon le raisonnement, sans édition mécanique.
5. **P2 — Entraînement** : traiter séparément les **11 anomalies EN** avec preuves individuelles, sans toucher aux PDF originaux ; conserver la séparation pédagogique/technique et les exercices utilisateur.
6. **P2 — Ergonomie Quizz et Entraînement** : reprendre les tests de navigation / clavier bridge sur iPhone (repli, correction, scroll, fondu), Chromium et WebKit, sans altérer les exercices ni les données de progression.
7. **P3 — Traçabilité et publication** : regrouper seulement les corrections certaines ; à chaque lot, consigner les IDs, ancienne/nouvelle réponse, motif SEF, SHA de commit, tests, état réel de publication et points ouverts dans **ce fichier**. Ne pas envoyer de notification avant CI + Pages confirmés.

**Règle de mise à jour** : après chaque intervention, actualiser l'état de l'étape concernée, conserver les points encore ouverts, et dater la dernière vérification. Ne jamais confondre *soumis*, *tests réussis*, *publié* et *vérifié visuellement sur iPhone*. Éviter les duplications de feuilles de route : cette section prolonge les précédentes sans les effacer.


---

## Lot P1 — 26 soutiens mineurs et compétitifs (2 novembre 2026)

**Compte rendu détaillé (source unique des 26 verdicts) :** [`REVUE_SEF_26_SOUTIENS_2026-11-02.md`](REVUE_SEF_26_SOUTIENS_2026-11-02.md). Référentiel : `QUIZZ_REFERENCE_SEF.md`, recoupé avec les enseignements SEF sur la priorité des SA et les soutiens de barrage après intervention.

- **26/26 fiches relues individuellement** : 12 réponses aux ouvertures mineures, 14 réponses à une intervention du partenaire. **21 fiches corrigées ou adaptées** au total : 17 dans [`c321fe6`](https://github.com/CapGui13/QPJB/commit/c321fe6112d930985f1d9bc4e431e7888a8b6eac) et quatre dans [`aaa092f`](https://github.com/CapGui13/QPJB/commit/aaa092f9e789aa62c7a2cf3bbbb6d5ab38f353e9) ; cinq soutiens simples inchangés.
- Parmi les 12 soutiens mineurs : **8 réponses 2m → 1SA**, du fait de mains régulières de 6 à 10 H sans majeure quatrième ; **4 mains complémentaires clarifiées** dans [`aaa092f`](https://github.com/CapGui13/QPJB/commit/aaa092f9e789aa62c7a2cf3bbbb6d5ab38f353e9) : `SEF-020-1`, `SEF-N031-2` (soutien à 2♣ avec singleton), `SEF-V412-014` et `SEF-V412-015` (soutien à 3m avec singleton, 10 H / 11 HL). Les quatre bonnes réponses existantes sont conservées ; aucune ambiguïté mineure ouverte dans ce lot.
- Parmi les 14 soutiens compétitifs : **5 soutiens simples à 2M conservés**, **4 soutiens à saut 3M → 2M avec 7 H et main plate 4-3-3-3**, **5 mains faibles modifiées en 4-4-4-1 avec singleton dans la couleur adverse pour justifier 3M de barrage**. Sur ces cinq, le contexte indique désormais une vulnérabilité favorable. Les 14 sont documentés individuellement dans le rapport.
- **Protection de la progression** : 12 réponses modifiées et 9 mains restructurées assorties de codes de révision dans `quizz.html` ; archivage historique et nouvelle tentative pour les seuls exercices effectivement remaniés. Pas de remise à zéro générale.
- **Validation précommit** : 993 identifiants distincts, 13 cartes, points H exacts, shapes cohérentes, 4 réponses distinctes et réponse présente : **aucune erreur structurelle**. Relu dans la branche `main` après commit.
- **CI / Pages :** sur `c321fe6`, le workflow [catalogue](https://github.com/CapGui13/QPJB/actions/runs/41438269784) est **réussi** ; son workflow [smoke](https://github.com/CapGui13/QPJB/actions/runs/41438269779) a été **annulé** lors de commits ultérieurs, **pas considéré comme réussi**. Attendre un **smoke complet réussi sur le dernier commit**, puis la publication Pages associée, avant de déclarer ce lot totalement validé. Aucune validation iPhone physique réalisée dans cette intervention.

### Prochaines priorités suite à ce lot

1. **P0 tests et déploiement :** smoke et tests Chromium/WebKit [réussis après correction du test historique](https://github.com/CapGui13/QPJB/actions/runs/41438693368) sur `9c345a4` ; vérifier le nouveau smoke et Pages après `aaa092f` et la présente mise à jour documentaire. Ne pas considérer un workflow annulé comme réussi.
2. **P1 clôturé sur ce lot :** les quatre fiches mineures ont été restructurées avec une courte ; **26/26 traités**, dont 21 remaniés et 5 conservés. Recontrôler les suites de tests sur le dernier commit.
3. **P1 autres cas litigieux :** trois interventions de barrage `SEF-V44-043`, `SEF-V44-044`, `SEF-V422-003` ; Drury `SEF-V4-101-2`, `SEF-V4-107-3` ; ouverture forte `SEF-V45-004` ; six conditions de séquence ; contrôle des distracteurs prioritaires et difficultés.
4. **P1 couverture :** ne pas recalculer « 993 exercices uniques audités » à partir de passages qui se chevauchent ; produire un registre d'IDs relié à une preuve de lecture individuelle.
5. **P2 UX :** reprendre la stabilité du clavier bridge, des réponses, du défilement et des transitions ; harmoniser les derniers énoncés encore formulés en tutoiement.

**Règle :** toute nouvelle correction doit être justifiée par l'exercice réel et par le SEF ; inscrire dans cette feuille de route les faits vérifiés (notamment le statut CI), ne pas convertir « lancé » en « réussi ».


---

## Lot P1 suivant — Barrages, Drury, ouverture forte et métadonnées SEF (2 novembre 2026)

**Périmètre contrôlé : 11 exercices réels du Quizz, branche `main`.** Réponses réévaluées individuellement et **toutes les 11 réponses conservées**. Aucun changement de convention de paire, d'ID ou de distracteurs. Commit de code : [`05db9ff`](https://github.com/CapGui13/QPJB/commit/05db9ff1f3621c69c195d16f4420e24a1cc15a81).

| ID vérifié | Verdict | Motif et modification |
|---|---|---|
| `SEF-V44-041` | 1♠ conservé | Préciser la séquence 1♣–(1♥) et corriger le motif de difficulté, auparavant hors sujet. |
| `SEF-V44-043` | 3♥ conservé | Après 1♥–(Contre) : 5 H, quatre atouts, doubleton ♣, environ 8 HLD ; préciser la vulnérabilité favorable et le caractère barrage. |
| `SEF-V44-044` | 3♠ conservé | Après 1♠–(Contre) : 5 H, quatre atouts, doubleton ♣, environ 8 HLD ; préciser la vulnérabilité favorable et le caractère barrage. |
| `SEF-V410-025` | 1♠ conservé | 1♦–(1♥), quatre ♠ et 8 H : 1♠ naturel ; rendre la question et le critère de difficulté conformes à ce raisonnement. |
| `SEF-V420-009` | 1♥ conservé | 1♣–(1♦), les deux majeures quatrièmes : 1♥ naturel ; rédaction neutre et explication du critère. |
| `SEF-V424-005` | 2♣ conservé | 1♦–(1♥), six ♣ et 13 H : nouvelle couleur au palier de deux, forcing ; l'énoncé ne doit pas donner la réponse et le corrigé justifie la bonne enchère seulement. |
| `SEF-V422-003` | 4♥ conservé | Après 1♥–(Contre), cinq atouts, 6 H, singleton ♣ : barrage avec vulnérabilité favorable explicitée. |
| `SEF-V4-101-2` | 2♥ conservé | Drury : main 8 H remplacée par ♠R84 ♥AV1093 ♦732 ♣103, ouverture tactique en 3e position vulnérabilité favorable ; répétition faible de 2♥. |
| `SEF-V4-107-3` | 2♠ conservé | Drury : main 8 H remplacée par ♠AV1093 ♥V85 ♦D73 ♣82, ouverture tactique en 3e position vulnérabilité favorable ; répétition faible de 2♠. |
| `SEF-V45-004` | 2♣ conservé | 19 H + une majeure sixième de qualité = 20 HL ; retirer l'énoncé qui annonçait déjà 2♣, préciser la règle 2♣ fort indéterminé. |
| `SEF-V3-069-1` | 2♠ conservé | Contre d'appel après 1♥ : améliorer les quatre Piques de la main à ♠RV104 ♥8 ♦D975 ♣DV87 (9 H), conserver le saut invitant à 2♠. |

**Portée des changements :** six cas de séquence/conditions (`SEF-V44-041`, `-043`, `-044`, `SEF-V410-025`, `SEF-V420-009`, `SEF-V424-005`), un barrage supplémentaire `SEF-V422-003`, deux redemandes Drury, l'ouverture forte `SEF-V45-004` et un saut au contre d’appel `SEF-V3-069-1`. **Trois mains ont été redistribuées**, à points H inchangés, et possèdent chacune un identifiant de révision ciblé dans la sauvegarde locale ; aucune remise à zéro générale.

**Contrôles effectués avant commit et relecture sur `main` :** 993 ID uniques, 13 cartes par main, comptes des points H exacts, distributions cohérentes, quatre choix distincts avec la réponse attendue incluse, absence de situations main+séquence strictement dupliquées. **Ne pas assimiler cette validation structurelle à un contrôle pédagogique indépendant des 993 fiches.**

**Références SEF vérifiées :** [Drury et réponses au Drury — SEF 2024](https://www.bridge-chailley.fr/le-sef-2024-suite-et-fin/) ; [ouverture de 2♣ fort indéterminé](https://dev.ibridge-club.fr/public/fichedetails/778) ; [soutiens après contre adverse / 2SA Truscott](https://bridgesarzeau.club.ffbridge.fr/saison-2025-2026/actualites-du-club/quand-la-reponse-de-2sa-est-elle-fittee-1227523). Ces références étayent la règle enseignée, sans constituer une approbation extérieure de chaque main.

**CI / Pages pour ce commit :** les workflows [smoke](https://github.com/CapGui13/QPJB/actions/runs/41444583076) et [catalogue](https://github.com/CapGui13/QPJB/actions/runs/41444583141) ont été lancés après le commit. Résultat **à recontrôler après le présent suivi**, puis publication GitHub Pages. Ne pas déclarer réussi un run simplement démarré ; la validation sur iPhone physique est distincte des tests simulés.

**Prochain chantier prioritaire après validation :** audit individuel des distracteurs et des difficultés sur les 17 cas signalés en SA/conventions, puis les cas de séquence/forces encore litigieux ; poursuivre le registre d'IDs réellement vérifiés. Maintenir le suivi de la progression, de la stabilité mobile et des 11 anomalies distinctes de l'Entraînement (`EN-*`).


---

## Lot P2 — Revue des 17 distracteurs SA, conventions et ouvertures — 2 novembre 2026

**Contrôle sur les 17 fiches réelles** du catalogue `quizz.html`, audit de la crédibilité des distracteurs et vérification que la bonne réponse reste une alternative sans ambiguïté.

- **9 exercices** ont reçu **un distracteur amélioré chacun**, remplaçant surtout « Passe », « 4SA » ou « 3SA » manifestement hors zone par une faute plus instructive de seuil, d'ouverture mineure ou de Texas. **Aucune bonne réponse, main, ID ni progression modifiée.** Commit [`10f4a05`](https://github.com/CapGui13/QPJB/commit/10f4a056f74aee2af65d6dbd4efa10029919a12d).
- **8 exercices** examinés et conservés : `SEF-N019-1`, `SEF-N019-2`, `SEF-N021-1`, `SEF-N021-2`, `SEF-N088-1`, `SEF-N088-3`, `SEF-N089-1`, `SEF-N089-2`. Les choix existants illustrent déjà les principales confusions de zone, distribution ou convention ; remplacement arbitraire non justifié.

| ID | Distracteur remplacé | Motif du nouveau piège, qui reste faux |
|---|---|---|
| `SEF-005-2` | Passe → 2♣ | 2♣ fort tentant avec 21 H, mais main régulière 20–21 H = 2SA. |
| `SEF-N017-1` | Passe → 1♣ | Tentative d’ouverture mineure à la place de 1SA avec 16 H réguliers. |
| `SEF-N017-2` | Passe → 1♣ | Même piège avec 15 H réguliers. |
| `SEF-N097-1` | 4SA → 3♦ | Après 2SA, 3♦ est Texas Cœur ; la main n'a que trois Cœurs. |
| `SEF-N097-3` | 4SA → 3♦ | Même confusion entre Carreaux naturels et Texas Cœur. |
| `SEF-N098-1` | 4SA → 3♠ | Après 2SA, 3♠ est Texas Trèfle, non adapté à quatre Trèfles et 2 H. |
| `SEF-N098-2` | 4SA → 3♠ | Même piège de transfert mineur inadapté à 3 H. |
| `SEF-V3-017-2` | 3SA → 3♥ | Sur rectification du Texas Cœur, 3♥ serait une invitation avec une longue majeure et des valeurs absentes. |
| `SEF-V3-019-3` | 3SA → 3♠ | Sur rectification du Texas Pique, 3♠ serait une invitation injustifiée avec 3 H. |

**Contrôles avant commit :** toujours 993 exercices à 13 cartes, points H cohérents, chaque QCM contient quatre choix distincts dont la bonne réponse. Les neuf modifications ne changent pas les bons contrats ; **aucune migration ni remise à zéro de progression nécessaire**.

**Références de convention :** [Texas Cœur à 3♦ sur 2SA — document pédagogique du Simultané des élèves](https://bridgesarzeau.club.ffbridge.fr/document-download/65ae4d36982af_SDEJan24.pdf) ; [Texas après 1SA, répétition au palier de 3 pour proposer la manche](https://abc-du-bridge.scenari-community.org/003-03/co/003-03-02.html). Les nouveaux distracteurs restent incorrects pour les mains concernées.

**CI / publication :** recontrôler sur le dernier `main` les jobs catalogue, intégrité, Chromium, WebKit et publication Pages ; aucune réussite non encore confirmée ne doit être anticipée.

**Prochaines étapes :** priorité au registre des IDs effectivement audités, puis aux autres distracteurs et notes de difficulté signalés, sans imposer un changement automatique aux 993 fiches. Les 11 anomalies de l'Entraînement `EN-*` restent distinctes.
