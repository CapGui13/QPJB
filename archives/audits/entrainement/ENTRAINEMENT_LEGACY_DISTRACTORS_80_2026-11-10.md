# QPJB Entraînement — nettoyage des 80 derniers décalages historiques (10 novembre 2026)

## Contexte et source
Après la PR #123 (6 fiches BH-086), il reste **80** objets `distractorNotes` dont les trois clés ne coïncident pas exactement avec les trois mauvaises propositions visibles. Audit fondé sur `main` au commit `eafc1162acbf9bdb7a736a7672af3d45e72aca0e`. Il s'agit d'une incohérence **héritée** : dans tous les 80 cas, `pretryHints` comprend déjà exactement les trois mauvais choix, et est prioritaire dans le rendu courant de l'application.

## Correction déterministe sans réécriture de bridge
Pour chacun des 80 IDs :
- l'objet `distractorNotes` est remplacé par une **copie textuellement exacte** de `pretryHints` de la même fiche ;
- aucun champ `pretryHints`, aucun `correct`, aucune `choices`, aucune main, séquence, provenance, statut ou explication principale ne sont modifiés ;
- les 558 autres objets enchères restent intacts, ainsi que 188 exercices de carte ;
- `training-data.js` et `training-data-bidding.js` restent synchronisés sur les 638 QCM d'enchères.

La substitution ne prétend **pas** valider pédagogiquement les 80 réponses : elle rend seulement les anciennes données cohérentes avec les commentaires déjà affichés. Aucun nouveau sens d'enchère n'est inventé.

## Tests
- Ajout de deux assertions de non-régression globales sur les 638 QCM : correspondance exacte des clés de `distractorNotes` et, lorsqu'ils existent, de `pretryHints` avec les propositions erronées.
- Résultat attendu : **0 décalage**, au lieu de 86 avant PR #123, puis 80 après PR #123.
- CI complète audit/Chromium/WebKit à vérifier avant fusion ; PR à garder en brouillon jusque-là.

## Liste exhaustive des 80 fiches concernées

- `EN-1m-005`
- `EN-1m-006`
- `EN-1m-008`
- `EN-1m-012`
- `EN-1m-013`
- `EN-1m-014`
- `EN-1m-015`
- `EN-1m-017`
- `EN-1m-018`
- `EN-1m-022`
- `EN-1m-023`
- `EN-1m-024`
- `EN-1m-025`
- `EN-1m-026`
- `EN-1m-027`
- `EN-1m-028`
- `EN-redemande-036`
- `EN-barrage-001`
- `EN-barrage-002`
- `EN-BH-003-01`
- `EN-BH-003-02`
- `EN-BH-093-02`
- `EN-BH-106-02`
- `EN-BH-106-03`
- `EN-BH-106-06`
- `EN-BH-049-02`
- `EN-BH-049-03`
- `EN-BH-056-01`
- `EN-BH-056-02`
- `EN-BH-056-03`
- `EN-BH-056-04`
- `EN-BH-058-02`
- `EN-BH-058-04`
- `EN-BH-058-05`
- `EN-BH-058-06`
- `EN-BH-059-06`
- `EN-BH-067-01`
- `EN-BH-067-02`
- `EN-BH-067-03`
- `EN-BH-067-04`
- `EN-BH-067-05`
- `EN-BH-067-06`
- `EN-BH-073-04`
- `EN-BH-074-01`
- `EN-BH-074-02`
- `EN-BH-074-03`
- `EN-BH-078-01`
- `EN-BH-078-02`
- `EN-BH-078-03`
- `EN-BH-087-04`
- `EN-BH-090-03`
- `EN-BH-092-05`
- `EN-BH-096-01`
- `EN-BH-096-02`
- `EN-BH-096-03`
- `EN-BH-096-04`
- `EN-BH-096-05`
- `EN-BH-096-06`
- `EN-BH-098-01`
- `EN-BH-098-02`
- `EN-BH-098-03`
- `EN-BH-098-05`
- `EN-BH-101-01`
- `EN-BH-102-02`
- `EN-BH-113-06`
- `EN-BH-114-01`
- `EN-BH-114-02`
- `EN-BH-114-03`
- `EN-BH-114-04`
- `EN-BH-114-05`
- `EN-BH-114-06`
- `EN-BH-115-02`
- `EN-BH-115-05`
- `EN-BH-117-01`
- `EN-BH-117-05`
- `EN-BH-118-03`
- `EN-BH-118-04`
- `EN-BH-068-03`
- `EN-BH-019-04`
- `EN-BH-138-RECO`
