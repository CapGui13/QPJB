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


---

## Lot P2 — Difficultés et registre nominatif des 993 exercices (2 novembre 2026)

### Recalibrage individuel des difficultés — terminé

- **22 exercices** étudiés individuellement ; **21 notes changées** et **une maintenue** (`SEF-008-2`) avec justification reformulée. Le rapport fournit les **22 identifiants**, anciennes/nouvelles notes et raisons : [`RECALIBRAGE_DIFFICULTES_22_2026-11-02.md`](RECALIBRAGE_DIFFICULTES_22_2026-11-02.md).
- Commit [`7d889c5`](https://github.com/CapGui13/QPJB/commit/7d889c5494a296fa2d677c23371ff5ac60bc3764). Aucune main, réponse, proposition, séquence, sauvegarde ni ID modifié : seulement `difficulty` et `difficultyReason`.
- Grille retenue : niveau 1 = rappel direct ; 2 = règle courante avec contrainte ; 3 = choix entre règles ou convention ; 4 = combiner plusieurs inférences ; 5 = arbitrage vraiment délicat. Éviter de classer 5 un exercice pour sa seule longueur de séquence.

### Registre de preuve par identifiant — créé

**Document de référence** : [`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv) ; **993 lignes, 993 IDs uniques**. Chaque ligne porte la rubrique, la difficulté actuelle, le contrôle structurel, le niveau de preuve pédagogique, ses sources et sa bonne réponse **au jour du relevé**.

**Bilan vérifiable à partir des pièces nominatives accessibles :**

| Niveau de preuve par ID | Nombre | Portée exacte |
|---|---:|---|
| Revue ciblée récente, avec IDs documentés | **76** | 26 soutiens + 11 conditions/Drury/fortes + 17 distracteurs + 22 difficultés |
| Corrections antérieures nominatives, sans nouvelle lecture dans ce lot | **18** | Commits `196e3946` (13) et `ba32da4e` (6), avec 1 ID en doublon d'une revue récente |
| Revue thématique historique seule, sans contrôle ciblé récent nominatif | **184** | Sous-ensemble des 199 lignes du rapport `quizz-revue-199-2026-11-01.csv`, dont 15 déjà classées ci-dessus |
| **Sans pièce nominative exploitable dans les documents rapprochés** | **715** | **Ne veut PAS dire « 715 non audités »** : des audits antérieurs peuvent les avoir lus, mais leurs listes d'IDs manquent |
| **Total des IDs** | **993** | Chaque ID compte une fois, sans addition artificielle des audits superposés |

Les rapports collectifs annoncent également la couverture intégrale de **586 fiches d'enchères à deux** (8 rubriques) et **249 fiches compétitives** (5 rubriques) : **835 IDs couverts au niveau des rubriques déclarées**, mais cela **ne vaut pas une traçabilité nominative de la méthode et du verdict de chaque fiche**. Le CSV possède une colonne séparée `couverture_collective_declaree` pour conserver cette distinction. Les **36 barrages** et **2 chelems** déclarés vus dans les bilans antérieurs n'ont pas de liste nominative exhaustive ; on ne peut les attribuer arbitrairement.

**Ne pas confondre :**
- Structure validée sur 993 ≠ justesse SEF individuellement certifiée sur 993.
- 1 561 passages annoncés et effectués ≠ 1 561 IDs uniques.
- 278 IDs rapprochés de pièces nominatives ou d'une revue thématique ≠ les seuls exercices jamais lus par un autre audit.
- Le registre constitue une **photographie datée**. Après des modifications ultérieures du catalogue, actualiser difficultés, réponses, décisions et sources.

### Prochaines priorités

1. **P0 — CI / Pages** : vérifier les workflows sur le dernier `main` après les commits de code et de documentation. Un run annulé par de nouveaux commits n'est ni un succès ni une régression du code. Ne marquer « publié » qu'après Pages réussi.
2. **P1 — Traçabilité manquante** : obtenir les listes exactes de chaque lot antérieur quand elles existent ; pour les fiches restantes, organiser de nouvelles revues ciblées **sans supposer qu'elles n'ont jamais été lues**. Prioriser les **38 barrages** et les **120 fiches de conventions/approfondissement** non intégralement attestées par une liste de rubriques.
3. **P2 — Pédagogie** : continuer par lots restreints les arbitrages des réponses contestables, les distracteurs et l'échelle 1–5, sans changements massifs ni seconde réponse défendable.
4. **P2 — Interface et Entraînement** : stabilité du clavier mobile et du défilement ; traiter séparément les 11 anomalies `EN-*` ; conserver données locales et PDF d'origine.

**Règle permanente :** après chaque lot, consigner IDs, verdict, changements, tests, publication et mettre à jour **ce fichier ainsi que le registre CSV**. Maintenir une distinction stricte entre une preuve nominative, un audit collectif déclaré et un simple contrôle automatique.


---

## Lot P1 — Audit nominatif des 38 barrages et 24 conventions avancées (2 novembre 2026)

### Barrages — 38/38 revus, corrigés ou validés

- **38 fiches réelles examinées individuellement** dans la rubrique `barrage` : main, compte H, longueur/qualité, vulnérabilité, séquence, réponse, distracteurs et corrigé. **32 exercices conservés et 6 corrigés**, aucun cas demeuré litigieux dans ce lot. Rapport complet : [`REVUE_SEF_BARRAGES_38_2026-11-02.md`](REVUE_SEF_BARRAGES_38_2026-11-02.md).
- **3 bonnes réponses rectifiées** : `SEF-V3-104-4` (3♥ → 4♥), `SEF-V3-107-1` et `SEF-V3-107-2` (3♠ → 4♠), car quatre atouts face à six du partenaire appellent un prolongement de barrage au palier de quatre, vulnérabilité favorable précisée.
- **3 mains remaniées** : `SEF-V3-093-3`, `SEF-V3-095-2` (supprimer deux gros honneurs extérieurs dans l'ouverture de 2 faible en première position), `SEF-V3-100-2` (concentrer les huit H dans sept Piques solides et préciser la vulnérabilité favorable).
- Commits de données : [`f66c997`](https://github.com/CapGui13/QPJB/commit/f66c997cc8e0e02d3fd631c05abac96b266e9322) et [`d0b7efe`](https://github.com/CapGui13/QPJB/commit/d0b7efe1fb1f21599c3b7ef6a29c6f5a673e1b2f). **Six migrations ciblées de progression** prévues dans `quizz.html` ; aucun effacement global.
- **18/38 fiches** proposent encore `1SA` comme mauvaise réponse : souvent pédagogiquement trop manifeste. Sujet prioritaire du prochain lot de distracteurs, sans modification non examinée des choix.
- Références : [iBridge : 2 majeur faible](https://www.ibridge.fr/public/fichedetails/16), [iBridge : ouverture de barrage à 3](https://dev.ibridge-club.fr/public/fichedetails/150), [Réponses au deux faible](https://www.bridge-chailley.fr/wp-content/uploads/2013/02/E2024-2-faible-2-s.pdf). L'audit ne suppose aucun accord de paire externe aux règles annoncées.

### Conventions avancées — 24 exercices documentés

- **24/24 exercices lus individuellement** : six Multi-Landy, six Rubensohl, six Michaels précisés, six Blackwood 30–41. **24 bonnes réponses conservées**, aucune correction certaine de données. Rapport nominatif : [`REVUE_SEF_CONVENTIONS_24_2026-11-02.md`](REVUE_SEF_CONVENTIONS_24_2026-11-02.md).
- Conformité aux **conventions explicitement annoncées dans chaque exercice**, sans affirmer que toutes les variantes sont équivalentes ou que les 120 approfondissements ont été audités.
- **Vigilance pédagogique ouverte** : accessibilité du rappel complet des conventions dans la séance iPhone, niveau de difficulté 5 potentiellement excessif pour une reconnaissance de codage, crédibilité de certains distracteurs.

### Traçabilité des 993 exercices — actualisation

- Registre : [`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv) ; **993 lignes, IDs uniques**. **62 IDs** documentés par les deux nouveaux rapports, dont **7** possédaient déjà une trace nominative ou thématique ; **55** nouveaux IDs distincts ajoutés au périmètre nominativement raccordé.
- **138 fiches** disposent désormais d'une **revue ciblée récente** dans les lots suivis ; **18** ont une correction historique nominative uniquement, **177** une revue thématique nominative uniquement, et **660** aucune trace nominative retrouvée dans les pièces recoupées. Les 660 ne sont **pas** déclarées non auditées : le volume collectif déclaré pour les enchères à deux (586) et compétitives (249) demeure conservé dans une colonne distincte. Aucune double comptabilisation.
- Le registre inclut les colonnes `dernier_verdict_individuel`, `dernier_rapport_individuel` et `date_revue_individuelle`. Son état est une photographie des données du catalogue après les corrections de ce lot.

### Contrôle technique et publication

- L'ancien [smoke `41448418449`](https://github.com/CapGui13/QPJB/actions/runs/41448418449) **avait échoué** sur un test de Roudi fixant artificiellement la difficulté 5 alors que le recalibrage avait placé les cas au niveau 4. **Correctif du test** dans [`e3a8191`](https://github.com/CapGui13/QPJB/commit/e3a81919b221fbb688960cee68f0b980eecbf381), sans changer les règles ni les réponses.
- Les contrôles structurels locaux avant chaque commit de données ont confirmé **993 fiches, 13 cartes, points H exacts, quatre choix distincts contenant la réponse, absence de doublon strict**.
- La validation **CI Chromium/WebKit et publication Pages du dernier `main` ne sont pas encore déclarées acquises dans cette note** : vérifier les nouveaux runs après le commit présent, ne pas confondre `cancelled` / `skipped` et `success`. Aucun test sur iPhone physique n'est revendiqué.

### Priorités suivantes

1. **P0** : surveiller le dernier smoke `QPJB Training smoke` sur Chromium/WebKit et le workflow Pages ; réparer toute vraie régression avant nouveau chantier.
2. **P1** : traiter individuellement les **18 distracteurs `1SA`** de la famille barrage, en cherchant des alternatives crédibles qui restent clairement fausses ; éviter une substitution en bloc.
3. **P1** : poursuivre les conventions avancées non documentées (dont autres Multi-Landy, Rubensohl, Michaels, chelems, forcing et Drury) par lots diversifiés avec verdict par ID ; préserver la règle d'une seule bonne réponse.
4. **P2** : recalibrer les exercices de difficulté 5 dépendant d'un simple codage conventionnel, puis continuer l'amélioration des corrigés et les tests de clavier / défilement iPhone.
5. **P2 Entraînement** : traiter séparément les 11 anomalies `EN-*` après récupération des preuves de chaque exercice, sans modifier les documents PDF d'origine.

**Règle de synchronisation** : pour chaque nouveau lot, mettre à jour cette feuille et le registre, noter les commits et distinguer `contrôles statiques`, `tests navigateur`, `déploiement Pages` et `validation sur iPhone physique`.


---

## Lot P2 — 18 distracteurs d’ouverture de barrage (2 novembre 2026)

**Statut : revue terminée, publication du dernier commit à vérifier.** Les 18 exercices signalés dans la revue des 38 barrages ont été repris **un par un** ; bilan **14 distracteurs améliorés, 4 conservés**. Rapport : [`REVUE_DISTRACTEURS_BARRAGES_18_2026-11-02.md`](REVUE_DISTRACTEURS_BARRAGES_18_2026-11-02.md).

- **14 questions d’ouverture à majeure sixième** : `1SA`, distracteur presque caricatural dans une main manifestement unicolore, remplacé par `3♥` ou `3♠` selon la majeure. L'élève doit discriminer **1M** (ouverture constructive), **2M faible** (six cartes) et **3M barrage** (normalement sept cartes).
- **4 questions avec 1–3 H** : `SEF-V3-101-2`, `SEF-V3-101-1`, `SEF-V3-102-2`, `SEF-V3-102-3` : `1SA` conservé. Ajouter un 3M serait encore plus irréaliste et n'améliorerait pas le raisonnement `Passe` vs `1M` / `2M`.
- **Aucune réponse correcte modifiée**, aucune main, séquence, difficulté, aucun ID ou progrès local. Vérification structurelle des **993 exercices**, 13 cartes, points H exacts, 4 choix distincts et réponse incluse : **PASS** avant commit. Tests spécifiques de QCM ne doivent pas supposer d'anciennes mauvaises propositions.
- Commit [`2bf86bf`](https://github.com/CapGui13/QPJB/commit/2bf86bf8b9329327354e0cbcf849e8050972cd51). Audit des 38 barrages mis à jour et **registre nominatif de 993 IDs synchronisé** : 18 nouveaux verdicts, sans ajouter artificiellement 18 IDs uniques, puisqu'ils étaient déjà dans la revue récente des barrages.
- Référence pédagogique : ouverture **2M faible avec six cartes** / **3M barrage avec sept cartes** ([table SEF](https://www.bridge-chailley.fr/wp-content/uploads/2024/09/Ouvertures-corr-2.pdf)). Les nuances de vulnérabilité doivent rester dans l'énoncé lorsqu'elles affectent la décision.
- **CI / Pages** : dernier état antérieur vérifié : [smoke Chromium + WebKit réussi](https://github.com/CapGui13/QPJB/actions/runs/41450738452) et [Pages réussi](https://github.com/CapGui13/QPJB/actions/runs/41451331357). **Ces runs précèdent le commit `2bf86bf`** : attendre le succès de la CI puis Pages sur le nouveau `main` avant de considérer ce lot publié. Aucune validation iPhone physique déclarée.

### Suite de la feuille de route

1. **P0** : confirmer les workflows **smoke Chromium/WebKit** et **GitHub Pages** associés au dernier commit (les nouveaux commits de documentation peuvent annuler les runs précédents). Corriger toute vraie régression, ne pas masquer un échec.
2. **P1** : auditer par lots les **conventions avancées restantes** (Rubensohl, Multi-Landy, Michaels, chelems, Drury, forcing) non encore couvertes par les 24 fiches nominatives déjà documentées ; distinguer les accords de paire et le SEF standard.
3. **P2** : décider individuellement des niveaux de difficulté 5 sur reconnaissance de codage et de la valeur pédagogique des familles de variantes, sans suppression d'ID.
4. **P2** : revisiter la stabilité du clavier bridge et de la navigation mobile, puis les 11 anomalies distinctes `EN-*` dans l'Entraînement.


---

## Lot P1 — Clôture des 46 fiches Multi-Landy, Rubensohl, Michaels et chelems (2 novembre 2026)

### Bilan individuel des quatre familles

- Dernier lot : [`REVUE_SEF_CONVENTIONS_COMPLEMENT_22_2026-11-02.md`](REVUE_SEF_CONVENTIONS_COMPLEMENT_22_2026-11-02.md), **22 fiches réelles inspectées** (5 Multi-Landy, 7 Rubensohl, 5 Michaels précisés, 5 chelems). **22 bonnes réponses conservées** : la grille conventionnelle nécessaire est indiquée dans chaque exercice. Aucune nouvelle règle de paire inventée.
- Ce lot complète les [24 conventions déjà auditées](REVUE_SEF_CONVENTIONS_24_2026-11-02.md) ; ces deux rapports permettent désormais une traçabilité **46/46** sur les rubriques concernées : **11 Multi-Landy, 13 Rubensohl, 11 Michaels, 11 chelems**. Les autres conventions (Roudi, Drury, ouvertures fortes, forcing) sont des rubriques distinctes, non prétendues incluses dans ces 46.
- **Quatre niveaux recalibrés** par examen individuel : `SEF-V45-030` (3→2, Passe sans bicolore face au 1SA adverse), `SEF-V45-039` (5→4, Texas impossible / Stayman forcing après 2♦), `SEF-V45-047` et `SEF-V45-048` (5→3, reconnaître les deux mineures 5-5 et l'enchère 2SA Michaels). Un corrigé `SEF-C2-009` a été reformulé **sans tutoiement**, en conservant 5♥ avec deux clés et sans Dame d'atout. **17 autres fiches laissées intactes**.
- Commit de code [`481de6d`](https://github.com/CapGui13/QPJB/commit/481de6dd1860275aaefd380e80ff1af4280e77b1), **aucune bonne enchère, main, ID, séquence ou progression modifiée**. Contrôle de contenu précommit : 993 fiches, 13 cartes et points H exacts, distributions cohérentes, quatre propositions distinctes et la bonne réponse parmi elles.
- Références : [Rubensohl, avec Texas impossible et contre d'appel](https://www.ibridge.fr/public/fichedetails/24) ; [Michaels précisés, tableau de codage des bicolores](https://pfbridge.fr/posts/2019/08/comment-m%C3%A9moriser-les-interventions-bicolores/). Ne pas extrapoler cette cohérence à toutes les versions alternatives de ces conventions.

### Registre : état le plus récent

[`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv) mis à jour pour les **22 nouveaux ID** du rapport :

| Niveau nominatif justifié | IDs |
|---|---:|
| Revue ciblée récente avec identifiants explicites | **160** |
| Correction nominative historique seulement | **16** |
| Revue thématique nominative seulement | **175** |
| Aucune pièce nominative retrouvée parmi les rapports rapprochés | **642** |
| **Total** | **993** |

Sur ces 22, **18** n'avaient aucune pièce nominative dans le registre, **2** avaient une revue thématique seulement et **2** une correction historique seulement. Les quatre rubriques sont entièrement documentées individuellement dans les deux rapports, mais la présence de **642 sans pièce nominative** ne signifie **pas** qu'elles n'ont jamais fait l'objet d'un audit collectif. Les 586 enchères à deux et 249 compétitives annoncées auditées par rubrique restent séparées dans le CSV.

### Prochaines étapes après cette clôture

1. **P0 — CI et publication :** vérifier sur le dernier `main` le succès complet des jobs **audit des données**, **Chromium**, **WebKit** et la publication **GitHub Pages** après `481de6d` et les commits documentaires. Ne pas valider un run `skipped`, `cancelled` ou `in_progress`. Aucun test sur iPhone physique revendiqué.
2. **P1 — Familles encore à documenter** : audits individuels ciblés des rubriques **Roudi (33), Drury (19), ouvertures fortes (12) et forcing (10)**, en évitant les ID déjà revus, puis analyse des éventuelles réponses conventionnelles discutables.
3. **P2 — Pédagogie/UX** : vérifier le rappel des conventions accessibles en exercice sur iPhone, les distracteurs plausibles et les difficultés 4–5 ; maintenir la règle d'un corrigé impersonnel expliquant uniquement la bonne enchère.
4. **P2 — Entraînement distinct** : reprendre les onze anomalies `EN-*` et le clavier bridge / défilement, avec tests sur les écrans mobiles.


---

## Lot P1 — Audit SEF nominatif des 19 exercices Drury (2 novembre 2026)

**Rapport créé et enregistré sur `main` :** [`REVUE_SEF_DRURY_19_2026-11-02.md`](REVUE_SEF_DRURY_19_2026-11-02.md). **19 fiches réelles et 19 IDs uniques examinés individuellement** : mains, H/HLD, séquences, Drury, 2SA avec singleton, propositions, corrigés et difficultés. Ne pas réauditer ces mêmes IDs sans nouvelle preuve ou correction.

- **17 bonnes réponses jugées conformes/défendables** au SEF 2024 ; **2 erreurs certaines dans les réponses actuelles** : `SEF-V4-099-2` (main 5 HLD, bonne réponse actuelle 2♥), `SEF-V4-105-2` (main 5 HLD, bonne réponse actuelle 2♠). Le soutien simple après passe requiert **6–10 HLD** avec trois atouts. `Passe` n'est pas proposé. **Aucune correction dans `quizz.html` n'a été faite dans ce lot** : corriger la bonne réponse/les choix, ou rééquilibrer les mains pour atteindre 6 HLD ; dans les deux cas, vérifier l'impact sur la progression et ajouter la révision ciblée nécessaire.
- **1 anomalie pédagogique certaine :** `SEF-C2-011` donne dans le contexte **2♣** et calcule les **11 HLD**, ce qui fournit directement la réponse. Réécrire seulement l'énoncé (la bonne réponse 2♣ est valide) et revoir la difficulté 4.
- **2 nuances sans changement de réponse :** `SEF-V44-067` et `SEF-V44-068` : 2SA après passe avec quatre atouts et singleton ; expliquer pourquoi la couleur annexe cinquième à ♦ ne suffit pas clairement pour une rencontre. Une couleur cinquième *vraiment belle* modifierait la comparaison.
- **Recalibrage proposé, non appliqué** : les quatre redemandes de l'ouvreur après Drury actuellement en difficulté 4 semblent plutôt de niveau 3 ; les deux 2SA actuellement en niveau 5 semblent de niveau 4. Les autres remarques individuelles figurent dans le rapport.
- **Registre synchronisé** : [`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv), toujours **993 lignes / 993 IDs**. Nouvelle ventilation : **177 ciblées nominatives récentes**, **16 corrections historiques nominatives seules**, **162 revues thématiques nominatives seules**, **638 sans pièce nominative exploitable** parmi les rapports rapprochés. Sur les 19, **2 étaient déjà ciblées**, **13 n'avaient qu'une revue thématique**, **4 n'avaient pas de preuve nominative retrouvée**. La catégorie « sans pièce » ne signifie pas « jamais auditée ».
- **Conservation :** aucun exercice, aucune bonne enchère, aucun distracteur, aucune main, aucune difficulté, aucun ID et aucune sauvegarde locale modifiés. Commits documentaires uniquement, dont [rapport](https://github.com/CapGui13/QPJB/commit/dbc1fcfe0094a923272ba21e4e005aa9151fd124) et [registre](https://github.com/CapGui13/QPJB/commit/9b52cd2c87178204e86f008b4c3011fd7459fe2c).
- **CI / Pages :** avant ce lot, smoke Chromium/WebKit et catalogue réussis sur `5e14533`, Pages réussi sur `47a23f4` ([Pages 41489485142](https://github.com/CapGui13/QPJB/actions/runs/41489485142)). Les commits documentaires du présent lot doivent être recontrôlés ; un nouveau `skipped` n'est pas une réussite. **Aucun test iPhone physique** revendiqué.

### Priorité immédiatement suivante

1. **P0 :** vérifier la dernière CI, l'audit catalogue, Chromium et WebKit ainsi que l'état Pages après les commits de suivi ; ne pas déclarer un déploiement sans confirmation.
2. **P1 :** traiter les trois anomalies Drury ouvertes `SEF-V4-099-2`, `SEF-V4-105-2`, `SEF-C2-011` avec corrections ciblées et tests ; ne pas changer de bonne réponse sans validation pédagogique solide.
3. **P1 :** poursuivre la revue nominative **Roudi (33)**, puis **ouvertures fortes (12)** et **forcing (10)** par lots individuels, sans inventer de nouvelles règles de paire et sans compter deux fois les IDs déjà contrôlés.
4. **P2 :** maintenir les tests clavier bridge / défilement iPhone et le chantier séparé des 11 anomalies d'Entraînement `EN-*`.


---

## Lot P1 — Audit nominatif des 33 exercices Roudi (2 novembre 2026)

**Rapport :** [`REVUE_SEF_ROUDI_33_2026-11-02.md`](REVUE_SEF_ROUDI_33_2026-11-02.md). **33/33 IDs distincts réellement inspectés**, sans se baser sur une liste de rubriques seule. Les points H/13 cartes/propositions de chacun sont cohérents ; les **33 bonnes réponses** respectent le Roudi du SEF à **trois réponses** (2♦ pas de fit, 2♥ fit minimum, 2♠ fit maximum). Aucune donnée ni bonne réponse modifiée.

- **1 anomalie pédagogique ouverte :** `SEF-C2-012`, dont le contexte explique déjà que **2♣** est le relais du Roudi ; réponse correcte mais divulgation de la solution. Réécrire l'énoncé, conserver la correction et vérifier la difficulté 3.
- **12 exercices** de réponse codée de l'ouvreur actuellement notés **difficulté 4** : recommander un niveau **3** après arbitrage pédagogique, car le raisonnement se limite généralement au nombre d'atouts et à la force minimum/maximum. Aucun recalibrage encore appliqué.
- **Diversité / distracteurs :** les variantes ♥/♠ et 1♣/1♦ enseignent la généralisation du code, mais une partie des fausses propositions reste simple à éliminer ; améliorer au cas par cas, pas par remplacement automatique.
- **Registre nominatif actualisé**, toujours 993 IDs et aucune double comptabilisation : **205** revues ciblées récentes, **16** corrections historiques nominatives seules, **161** revues thématiques seules, **611** sans preuve nominative exploitable dans les pièces rapprochées. Parmi les 33 Roudi : **5** déjà ciblés, **1** déjà thématique, **27** sans pièce antérieure rapprochée. Les 611 ne sont pas déclarés jamais audités.
- **Commits documentaires** : [rapport](https://github.com/CapGui13/QPJB/commit/67718fe6f518165e2f2a89d7e9c3fed3afbf7e38), [registre](https://github.com/CapGui13/QPJB/commit/c766ba97c62c11cb6fb1b8d94440164f9b3ec7ab). Ces commits ne touchent ni `quizz.html`, ni le stockage local, ni les tests.
- **CI et Pages après ce lot :** recontrôler sur le dernier `main` les résultats `success` des jobs nécessaires ; les runs `cancelled`, `skipped` et `in_progress` ne valident rien. La publication Pages était confirmée **avant** les commits documentaires du lot Drury/Roudi.

**À poursuivre en priorité :** (1) arbitrer les **3 anomalies Drury** et la **fuite de solution Roudi**, avec migration ciblée si besoin ; (2) auditer les **12 ouvertures fortes**, puis les **10 forcing** ; (3) revue ciblée des niveaux 4–5 et de l'UX clavier iPhone. Conserver la feuille de route unique et l'inventaire des IDs.


---

## Lot P1 — Revue nominative des 12 ouvertures fortes et des 10 forcing (2 novembre 2026)

**Lot terminé — 22/22 fiches individuelles**. Rapport : [`REVUE_SEF_FORTES_FORCING_22_2026-11-02.md`](REVUE_SEF_FORTES_FORCING_22_2026-11-02.md). Contrôle de chaque main, compte H, séquence, réponse, distracteurs, corrigé et difficulté, sans modification de `quizz.html`.

- **22 bonnes réponses conservables** sous le référentiel SEF annoncé (2♣ fort indéterminé, 2♦ forcing de manche, relais et réponses aux As, 3e/4e couleur forcing). Les 22 fiches passent le contrôle 13 cartes, points H et quatre choix distincts contenant la bonne réponse. Les modifications antérieures sur `SEF-V45-004` sont déjà intégrées.
- **1 fuite certaine dans l'énoncé** : `SEF-V45-003` donne explicitement « 2♣ fort indéterminé » alors que c'est précisément la solution ; retirer cette mention sans changer la bonne réponse 2♣.
- **1 niveau de difficulté manifestement excessif** : `SEF-V45-022`, noté 5, appelle simplement 2♥ naturel faible avec six Cœurs et 6 H. Proposition 2 ou 3 à faire valider avant modification.
- **6 autres difficultés à examiner au cas par cas** : `SEF-V45-016` à `SEF-V45-021` actuellement notées 5 pour reconnaissance de la quatrième couleur forcing ou redemande après celle-ci ; propositions de niveau 4, non appliquées. Les exercices `SEF-V45-005` et `-006` présentent un rappel très direct du relais, à rendre éventuellement plus interactif.
- **Aucune donnée du Quizz modifiée :** toutes les suggestions restent ouvertes et les historiques de progression sont préservés. Rapport documentaire enregistré par [`1b1c580`](https://github.com/CapGui13/QPJB/commit/1b1c580766daf38eb050fe97ae502466c368de24).
- **Registre mis à jour** : [`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv), commit [`e20bf81`](https://github.com/CapGui13/QPJB/commit/e20bf81ca9b7188231114aa5c18e3047d7153d7e). Toujours **993 IDs uniques**, dont désormais **222 revues ciblées récentes**, **16 corrections historiques nominatives seules**, **152 revues thématiques nominatives seules**, **603 sans pièce nominative rapprochée**. Pour les 22 nouvelles fiches : 5 étaient déjà ciblées, 9 uniquement thématiques, 8 sans pièce nominative retrouvée.
- **Cumul des trois nouvelles revues** : **19 Drury + 33 Roudi + 12 fortes + 10 forcing = 74 fiches réelles**, 74 IDs distincts (rubriques disjointes). Ce total n'est pas un ajout mécanique de 74 aux fiches déjà suivies ; le registre prévient les doubles comptes. Les rubriques **Drury 19/19, Roudi 33/33, fortes 12/12, forcing 10/10** disposent maintenant chacune d'un rapport nominatif.

### Suite des priorités, sans prétendre que toutes les anomalies sont corrigées

1. **P0** — Sur le dernier `main`, confirmer la CI (intégrité du catalogue, Chromium, WebKit) puis Pages ; ne pas qualifier un run `skipped`, `cancelled` ou `pending` de réussite. Aucun test iPhone physique déclaré.
2. **P1** — Corriger les anomalies ouvertes après arbitrage : Drury `SEF-V4-099-2` et `SEF-V4-105-2` (5 HLD et soutien actuel malgré seuil 6), fuites de réponse `SEF-C2-011` (Drury), `SEF-C2-012` (Roudi), `SEF-V45-003` (ouvertures fortes) ; toute correction de fond exige un contrôle de progression ciblé.
3. **P2** — Après validation pédagogique, revoir les difficultés clairement surévaluées et les distracteurs insuffisamment crédibles, sans écraser les décisions précédentes et sans remplacer en masse.
4. **P2** — Garder distincts le chantier d'ergonomie clavier/scroll iPhone et les 11 anomalies `EN-*` de l'Entraînement. Les **603 sans pièce nominative rapprochée** ne doivent pas être décrites comme 603 fiches « jamais auditées » : les revues collectives antérieures demeurent conservées séparément.

**Maintenance :** actualiser conjointement ce fichier et le registre de 993 IDs après chaque nouvelle décision, correction et validation réelle. Toujours distinguer revue pédagogique, contrôles statiques, tests navigateurs, déploiement Pages et vérification matérielle iPhone.


---

## Lot P0/P1 — Corrections SEF après les 74 revues nominatives (2 novembre 2026)

**État : correctifs enregistrés dans `main`; vérification des workflows la plus récente à confirmer ci-dessous.** Le suivi antérieur Drury/Roudi/fortes/forcing reste une **photographie historique avant correction** : ne plus réouvrir les cinq anomalies comme « non corrigées » sans relire le catalogue actuel.

### Correctifs effectivement appliqués

- **Commit de données `5d55d0a`** : [voir le diff](https://github.com/CapGui13/QPJB/commit/5d55d0a0ca9997652e545d792445e386640ed6b3). **31 IDs distincts modifiés**, dont **2 mains Drury réparées**, **3 énoncés neutralisés** et **27 difficultés recalibrées** ; chevauchement entre les catégories. **993 IDs conservés**. Toutes les réponses correctes, choix, séquences, rubriques et familles restent identiques.
- **Deux erreurs SEF résolues par ajustement des mains** : `SEF-V4-099-2` (♦9→♦V, 5→6 H, donc 6 HLD, réponse 2♥) et `SEF-V4-105-2` (♦9→♦V, 5→6 H, donc 6 HLD, réponse 2♠). Après Passe, trois atouts et 6 HLD permettent le soutien simple : aucune bonne réponse n'a été changée.
- **Trois fuites pédagogiques résolues** : les énoncés `SEF-C2-011` (Drury), `SEF-C2-012` (Roudi) et `SEF-V45-003` (fortes) ne donnent plus explicitement **2♣** ni le calcul HLD qui révélait la solution. Réponses et distracteurs conservés.
- **27 difficultés ajustées, chacune avec nouveau `difficultyReason`** : 7 Drury (dont `SEF-C2-011`), 12 Roudi, 1 ouverture forte, 7 forcing. Pourcing `SEF-V45-022` passe de **5 à 2** (répétition simple faible des Cœurs). Les cinq conclusions Roudi conservées au niveau 4 restent des cas distincts des douze réponses codées passées à 3.
- **Conservation ciblée des progrès** : cinq nouveaux marqueurs `pedagogicalRevision` seulement, pour les deux mains et les trois contextes modifiés. Les anciennes fiches de résultat restent archivées dans `archivedPreRevision` et ces cinq questions peuvent être retravaillées ; **pas de réinitialisation générale**. Les seules modifications de difficulté ne touchent pas les progrès.
- **Test de non-régression** dans `tests/quizz-integrity.cjs` : [commit `7818594`](https://github.com/CapGui13/QPJB/commit/7818594651f0648a9df1a0452404e8d0a23cc8cd), vérification des deux mains à 6 HLD, des trois énoncés sans réponse révélée et des cinq marqueurs de révision, sans figer toutes les notes de difficulté.
- **Rapport exhaustif avant/après pour les 31 IDs** : [`CORRECTIFS_SEF_DRURY_ROUDI_FORTES_FORCING_2026-11-02.md`](CORRECTIFS_SEF_DRURY_ROUDI_FORTES_FORCING_2026-11-02.md), commit [`290c08d`](https://github.com/CapGui13/QPJB/commit/290c08d65e204e09faad2a8bdaa76de808f30d67).
- **Registre nominatif synchronisé** : [`REGISTRE_993_REVUES_2026-11-02.csv`](REGISTRE_993_REVUES_2026-11-02.csv), commit [`e771fc4`](https://github.com/CapGui13/QPJB/commit/e771fc4e419e3ebf5eae86d8da9e6bca8a7767b0). Les 31 niveaux/verdicts correspondent maintenant à `main`. **Répartition inchangée par niveau de preuve** : 222 revues ciblées récentes, 16 corrections historiques seules, 152 revues thématiques seules, 603 sans pièce nominative rapprochée (qui ne sont pas « non audités »). Les 31 corrections ne sont pas comptabilisées comme 31 nouveaux audits.

### Vérifications réalisées et statut de publication

- Avant commit et par lecture croisée après : **993 mains, 13 cartes chacune, comptes H exacts, distributions cohérentes, quatre réponses distinctes dont la bonne, absence de doublons stricts, zéro modification inattendue hors 31 IDs**.
- **CI sur le commit des correctifs, des tests et du dernier suivi : à confirmer en fin de session.** Un run `skipped`, `cancelled`, `pending`, `in_progress` ou `failure` n'est pas un succès. Le smoke antérieur `b3f8d2fb` avait échoué, **avant** le lot des nouvelles corrections ; diagnostiquer toute erreur persistante dans les nouveaux runs, ne pas l'attribuer automatiquement à ce lot.
- **Aucune vérification sur iPhone physique revendiquée**. Les tests Chromium/WebKit simulés et l'état Pages restent indépendants.

### Prochaines priorités

1. **P0** — Vérifier le dernier smoke Chromium/WebKit, les tests d'intégrité et la publication GitHub Pages ; si un test échoue, corriger uniquement la cause puis relancer.
2. **P1** — Revoir au cas par cas les distracteurs et les difficultés qui restent réellement ambigus, sans revenir automatiquement sur les 27 décisions documentées ni inventer des accords de paire.
3. **P2** — Reprendre les tests du clavier bridge et du défilement sur iPhone ; conserver les onze anomalies d'Entraînement `EN-*` dans leur chantier distinct.
4. **Maintenance permanente** — Après chaque nouvel arbitrage, actualiser ensemble cette feuille de route, les IDs affectés dans le registre et les contrôles CI/Pages réellement conclus.


### Validation finale du lot correctif — 2 novembre 2026

**Validation CI acquise pour le code et les tests corrigés** : [QPJB Training smoke #41494161871](https://github.com/CapGui13/QPJB/actions/runs/41494161871), commit `289e34af`, terminé avec **success** sur les **trois jobs** : audit des données, Chromium et WebKit. L'échec WebKit antérieur sur `b3f8d2fb` ne s'est pas reproduit dans ce nouveau test.

**Publication GitHub Pages confirmée** : [QPJB Pages #41494835153](https://github.com/CapGui13/QPJB/actions/runs/41494835153), terminée avec **success** après validation, sur le commit automatique de catalogue `259dc697`. Le correctif `quizz.html` est resté identique au blob `61a2a0ffbaad8c3a07388bbcfe23d92b153bd454` depuis le commit `5d55d0a`.

**Portée et limites** : les 31 correctifs de données, les 27 difficultés et les cinq révisions ciblées sont **testés et publiés**. La réussite WebKit est celle du navigateur automatisé simulant l'iPhone, **pas** un essai physique sur iPhone. La présente ligne de suivi, purement documentaire, ne constitue ni une nouvelle modification pédagogique ni une nouvelle condition de publication.


---

## Lot P2 — Repli du clavier Bridge et premières corrections EN (2 novembre 2026)

### Clavier Bridge / défilement du Quizz

- **Correction dans `quizz.html`** : [`43487c740`](https://github.com/CapGui13/QPJB/commit/43487c740d74698b62ceedd4c3f445618c320a89). La fermeture utilise une hauteur réelle mesurée et attend **`transitionend` du `max-height`** (ou une temporisation de secours si WebKit n'émet pas l'événement) avant de reconstruire les choix ou le corrigé. Plus de `setTimeout(render, 440)` / `setTimeout(finish, 440)`. Le bouton « Clavier bridge » doit plier comme il déplie ; les actions de réponse ne doivent plus couper l'animation.
- **Test navigateur à mouvements autorisés** : [`bde39cee`](https://github.com/CapGui13/QPJB/commit/bde39cee46d98f2dc3579c5a7cd3cbe2220d4266) dans `tests/quizz-browser.cjs`. Il mesure l'ouverture, une hauteur intermédiaire pendant le repli, la fermeture complète, l'absence de propositions indésirables, puis l'apparition du corrigé seulement après la fermeture. Tests prévus sur Chromium et WebKit simulant un iPhone 12.
- **Aucune main, réponse ou progression modifiée dans les 993 Quizz.** La validation sur **iPhone Safari physique** reste nécessaire ; un test WebKit simulé n'en tient pas lieu.

### Entraînement EN : deux erreurs de distracteurs et trois quarantaines

Rapport détaillé : [`RECONCILIATION_EN_11_V610_2026-11-02.md`](RECONCILIATION_EN_11_V610_2026-11-02.md).

- `EN-1m-009` (B10-4) : l'ancien distracteur **2♣**, jugé envisageable par le corrigé, a été remplacé par **1♦** avec seulement deux Carreaux. Bonne réponse **1SA** inchangée.
- `EN-1m-011` (B10-6) : l'ancien distracteur **1♠**, évoqué comme possible par la source, a été remplacé par **2♦** à saut excessif avec 7 H. Bonne réponse **1♦** inchangée.
- La troisième réserve B10 déjà documentée, `EN-1m-020`, ne proposait déjà plus `1♦` comme choix pénalisé ; **aucune intervention supplémentaire**.
- Trois identifiants portant une décision formelle `pedagogicalReview_v610.decision === "quarantaine"`, mais encore affichés faute de statut `a_verifier`, ont été **masqués provisoirement sans suppression** : `EN-BH-075-04`, `EN-BH-090-06`, `EN-BH-102-01`. Motifs documentés : signification du soutien direct à 3♠ et chelem direct sans exploration des contrôles.
- **563 IDs d'enchères conservés, 560 maintenant accessibles, 3 en quarantaine**. Les 114 fiches de jeu de la carte (111 accessibles) restent intactes. **Aucun historique localStorage effacé** ; les réponses correctes et les mains sont identiques.
- Banque maîtresse `training-data.js`, module `training-data-bidding.js`, bootstrap, générateur et compteurs synchronisés. PWA versionnée `20261102b`, cache `qpjb-v41` ; test hors ligne ajusté. Tests de non-régression dans `tests/training-smoke.cjs`.
- **Limite de preuve importante :** la feuille de route mentionnait auparavant « 11 anomalies certaines » sur 563 EN sans liste de leurs IDs. Les **11 annotations `pedagogicalReview_v610`** recensées dans la banque (3 quarantaines et 8 mises au point) ne sont **pas automatiquement** ces 11 erreurs. Cette ancienne annonce reste à rapprocher nominativement des audits. Ne pas la déclarer résolue par simple concordance numérique et ne pas modifier les huit autres cas sans preuve.
- Le rapport du présent lot ne remplace pas l'audit PDF des séquences Stayman/Texas, ni l'arbritrage des autres `a_verifier`. Le registre de **993 exercices Quizz** est indépendant des 563 exercices EN.

### Validation / prochaines priorités

1. **P0 :** contrôler le dernier `QPJB Training smoke` (audit, Chromium, WebKit, dont nouveau test de clavier avec mouvement), puis GitHub Pages. Réparer les vrais échecs, attendre les conclusions exactes. Les commits documentaires peuvent faire annuler les anciens runs.
2. **P1 :** vérifier le lot EN en conservant la distinction 563 stockés / 560 accessibles et la protection des anciens résultats. Rechercher la liste source des 11 anomalies annoncées ; ne pas inventer leurs IDs.
3. **P2 :** sur **Safari iPhone réel**, vérifier le repli au bouton, la validation avec clavier ouvert, l'arrivée du corrigé et le défilement. Si le problème persiste, utiliser une capture ou une vidéo de reproduction pour cibler la cause restante.
4. **P2 :** poursuivre la vérification des autres EN dans leurs PDF originaux, sans déduire du seul statut `transcrit_source` que toute proposition est pédagogiquement certaine.

**État au moment de cette mise à jour** : commits de code et de tests présents dans `main`, **pas de certification de la dernière publication ici avant lecture du résultat Pages**.
