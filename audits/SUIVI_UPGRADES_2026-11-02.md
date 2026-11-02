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
- Tests après `ba32da4e` : **QPJB Training smoke** [réussi](https://github.com/CapGui13/QPJB/actions/runs/41436874771) ; **Actualiser le catalogue** [réussi](https://github.com/CapGui13/QPJB/actions/runs/41436874589). Le commit automatique [`61fb905e`](https://github.com/CapGui13/QPJB/commit/61fb905e019522f185be76452bc4c9addff4a1a6) a modifié `site-version.json` ; **Pages run 122** [était en cours lors du contrôle](https://github.com/CapGui13/QPJB/actions/runs/41437333743). **Ne pas déclarer cette publication réussie avant confirmation.**

### File de route active — par priorité

1. **P0 — Publication / non-régression** : vérifier le résultat final du run Pages 122 ; vérifier que l'interface, la navigation sans rechargement, la progression et les données locales sont préservées.
2. **P1 — Arbitrages SEF indépendants** : reprendre individuellement les **12 soutiens mineurs** discutables (ne pas réécrire en bloc), puis les **14 soutiens compétitifs** signalés, les cas de vulnérabilité/doublons et les ambiguïtés des barrages, Drury et ouverture forte. Ne changer une réponse que si l'analyse de la main, de la séquence et de la convention le justifie fermement.
3. **P1 — Couverture unique** : constituer un registre des **993 IDs** avec statut `vérifié` / `à revoir` / `non documenté` par lot et source de preuve ; rapprocher les rapports pour ne pas confondre passages et fiches uniques.
4. **P2 — Qualité pédagogique** : auditer les distracteurs relevés (dont les **17** candidats de l'audit SA/conventions), éliminer les choix trop flagrants ou doublement défendables ; enrichir la justification de **la seule bonne enchère** et recalibrer la difficulté de 1 à 5 selon le raisonnement, sans édition mécanique.
5. **P2 — Entraînement** : traiter séparément les **11 anomalies EN** avec preuves individuelles, sans toucher aux PDF originaux ; conserver la séparation pédagogique/technique et les exercices utilisateur.
6. **P2 — Ergonomie Quizz et Entraînement** : reprendre les tests de navigation / clavier bridge sur iPhone (repli, correction, scroll, fondu), Chromium et WebKit, sans altérer les exercices ni les données de progression.
7. **P3 — Traçabilité et publication** : regrouper seulement les corrections certaines ; à chaque lot, consigner les IDs, ancienne/nouvelle réponse, motif SEF, SHA de commit, tests, état réel de publication et points ouverts dans **ce fichier**. Ne pas envoyer de notification avant CI + Pages confirmés.

**Règle de mise à jour** : après chaque intervention, actualiser l'état de l'étape concernée, conserver les points encore ouverts, et dater la dernière vérification. Ne jamais confondre *soumis*, *tests réussis*, *publié* et *vérifié visuellement sur iPhone*. Éviter les duplications de feuilles de route : cette section prolonge les précédentes sans les effacer.
