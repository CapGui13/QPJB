# Entraînement QPJB — intégrité des anciens commentaires de distracteurs (10 novembre 2026)

## Diagnostic vérifié sur `main`
- Analyse des **638 QCM d'enchères** de `entrainement/training-data-bidding.js` (catalogue global 638 enchères + 188 exercices de carte = **826**).
- **86 QCM** possédaient un objet ancien `distractorNotes` dont les clés ne correspondaient pas à toutes les propositions effectivement affichées, ou comprenaient au moins une clé hors choix.
- Important : **les 86 disposent de `pretryHints` complets et bien alignés** avec les choix. Le moteur actuel utilise `pretryHints` en priorité pour les retours à l'écran : ce diagnostic ne démontre **aucune erreur actuellement visible pour ces 86 fiches**. Il s'agit d'une dette de données à corriger préventivement, et non d'une panne de la correction en ligne.
- La CI existante ne vérifiait pas systématiquement l'alignement de tous les anciens `distractorNotes`.

## Première reprise ciblée — les 6 QCM BH-086
- `EN-BH-086-01` : conserver `2SA`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.
- `EN-BH-086-02` : conserver `1♠`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.
- `EN-BH-086-03` : conserver `1♠`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.
- `EN-BH-086-04` : conserver `1♥`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.
- `EN-BH-086-05` : conserver `1♣`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.
- `EN-BH-086-06` : conserver `1♦`, main, séquence, choix, source, indices, statuts, et réécrire uniquement `distractorNotes` sur les trois mauvais choix réels.

## Tests et invariants
- **6 objets de QCM modifiés, 632 autres QCM d'enchères inchangés**, aucune modification aux 188 exercices de carte.
- `entrainement/training-data.js` et `training-data-bidding.js` synchronisés sur les 638 objets.
- Tests dédiés sur les six IDs : clés des commentaires = exactement trois mauvaises propositions ; réponses et quatre choix conservés ; anciens `pretryHints` conservés.
- Le contenu des commentaires découle de la main, de la règle SEF retenue et des anciens indices alignés. Il s'agit d'une **revue éditoriale informée**, pas d'une contre-expertise aveugle des PDF.
- PR à **laisser en brouillon**, sans fusion automatique avant CI et revue.

## Reliquat documentaire
**80 dossiers** avec anomalies de clés `distractorNotes` héritées demeurent à corriger par groupes ciblés. Leur affichage n'est pas réputé erroné tant que leurs `pretryHints` complets sont prioritaires.

IDs des 86 dossiers recensés au départ :

- `EN-1m-005` — à examiner
- `EN-1m-006` — à examiner
- `EN-1m-008` — à examiner
- `EN-1m-012` — à examiner
- `EN-1m-013` — à examiner
- `EN-1m-014` — à examiner
- `EN-1m-015` — à examiner
- `EN-1m-017` — à examiner
- `EN-1m-018` — à examiner
- `EN-1m-022` — à examiner
- `EN-1m-023` — à examiner
- `EN-1m-024` — à examiner
- `EN-1m-025` — à examiner
- `EN-1m-026` — à examiner
- `EN-1m-027` — à examiner
- `EN-1m-028` — à examiner
- `EN-redemande-036` — à examiner
- `EN-barrage-001` — à examiner
- `EN-barrage-002` — à examiner
- `EN-BH-003-01` — à examiner
- `EN-BH-003-02` — à examiner
- `EN-BH-093-02` — à examiner
- `EN-BH-106-02` — à examiner
- `EN-BH-106-03` — à examiner
- `EN-BH-106-06` — à examiner
- `EN-BH-049-02` — à examiner
- `EN-BH-049-03` — à examiner
- `EN-BH-056-01` — à examiner
- `EN-BH-056-02` — à examiner
- `EN-BH-056-03` — à examiner
- `EN-BH-056-04` — à examiner
- `EN-BH-058-02` — à examiner
- `EN-BH-058-04` — à examiner
- `EN-BH-058-05` — à examiner
- `EN-BH-058-06` — à examiner
- `EN-BH-059-06` — à examiner
- `EN-BH-067-01` — à examiner
- `EN-BH-067-02` — à examiner
- `EN-BH-067-03` — à examiner
- `EN-BH-067-04` — à examiner
- `EN-BH-067-05` — à examiner
- `EN-BH-067-06` — à examiner
- `EN-BH-073-04` — à examiner
- `EN-BH-074-01` — à examiner
- `EN-BH-074-02` — à examiner
- `EN-BH-074-03` — à examiner
- `EN-BH-078-01` — à examiner
- `EN-BH-078-02` — à examiner
- `EN-BH-078-03` — à examiner
- `EN-BH-086-01` — corrigé dans cette PR
- `EN-BH-086-02` — corrigé dans cette PR
- `EN-BH-086-03` — corrigé dans cette PR
- `EN-BH-086-04` — corrigé dans cette PR
- `EN-BH-086-05` — corrigé dans cette PR
- `EN-BH-086-06` — corrigé dans cette PR
- `EN-BH-087-04` — à examiner
- `EN-BH-090-03` — à examiner
- `EN-BH-092-05` — à examiner
- `EN-BH-096-01` — à examiner
- `EN-BH-096-02` — à examiner
- `EN-BH-096-03` — à examiner
- `EN-BH-096-04` — à examiner
- `EN-BH-096-05` — à examiner
- `EN-BH-096-06` — à examiner
- `EN-BH-098-01` — à examiner
- `EN-BH-098-02` — à examiner
- `EN-BH-098-03` — à examiner
- `EN-BH-098-05` — à examiner
- `EN-BH-101-01` — à examiner
- `EN-BH-102-02` — à examiner
- `EN-BH-113-06` — à examiner
- `EN-BH-114-01` — à examiner
- `EN-BH-114-02` — à examiner
- `EN-BH-114-03` — à examiner
- `EN-BH-114-04` — à examiner
- `EN-BH-114-05` — à examiner
- `EN-BH-114-06` — à examiner
- `EN-BH-115-02` — à examiner
- `EN-BH-115-05` — à examiner
- `EN-BH-117-01` — à examiner
- `EN-BH-117-05` — à examiner
- `EN-BH-118-03` — à examiner
- `EN-BH-118-04` — à examiner
- `EN-BH-068-03` — à examiner
- `EN-BH-019-04` — à examiner
- `EN-BH-138-RECO` — à examiner
