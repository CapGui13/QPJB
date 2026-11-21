# QPJB M1 — Passe 20 : dossier d'arbitrage directement exploitable

**PASSE 20 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Nouvelle livraison
`DECISIONS_P20_HOLD.json` regroupe, sans refaire les audits, les **17 décisions humaines** : **6 clarifications** avec texte source exact et texte proposé du champ ciblé, **11 accords** avec source, niveau de preuve, réserve et question de validation propre à l'ID. L'inventaire reste aligné sur P8/P10/P13/P14/P15/P16/P17 : 36 anciennes propositions non appliquées, 1 523 QCM/22 thèmes inchangés, 92 QCM progressifs, 47 remplacements contre-lus.

Le dossier n'est PAS une validation : chacun des 17 champs `decision` reste `PENDING`, les six `approvedByHuman` et onze `confirmedByHuman` restent `false`. Chaque question permet au référent de statuer en connaissance de cause.

**Priorité : `SEF-L25-004`**, Texas Cœur 2♦ contré. Main ♠A963 ♥R8 ♦AD84 ♣R107, deux Cœurs et arrêt Carreau. Les deux traitements de Passe documentés en P17 ne donnent pas la même conclusion. Ne pas qualifier Passe de faux, et ne pas transformer un accord local en règle SEF avant décision.

## Contrôles nouveaux
`tests/wave2-pedagogie-decisions-p20.cjs` vérifie, sur les fichiers sources, les **6 avant/après**, la préservation des réponses et choix, le rattachement exact des **11 preuves**, l'absence de décision implicite, ainsi que trois mutations simulées (explication Blackwood, faux visa Texas, fausse qualité de source). **PASS en JavaScript isolé sur les vrais documents GitHub** ; pas de PASS natif Node/CI revendiqué. Lanceur maintenant à **15 scripts**, l'inventaire conserve le checkpoint historique P18.

## Limites et suite
Le conteneur a Node v22.16.0 mais la résolution DNS de github.com empêche un clone natif du dépôt ; ni cette passe ni P19 ne démontrent l'exécution complète de la suite. Une exécution Node native et, séparément, les décisions réelles du référent restent nécessaires.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P21 — contre-contrôle du dossier par rapport au catalogue et traitement des éventuelles divergences, ou réception des arbitrages humains ; aucune réécriture des QCM.** Aucune fusion ni publication.
