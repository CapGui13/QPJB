# LONG M4 — Passe 27 : deux consolidations sur le même compteur V1

**PASSE 27 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Défaut réel reproduit dans le moteur

`QPJBParcours.finish` produit un événement `mode='consolidation', session=state.completed+1` puis **ne fait pas avancer `completed`**. Deux séances complémentaires réelles peuvent ainsi avoir le même numéro de séance, le même ID de question et des réponses différentes. Le module M4 dédoublonnait jusqu'ici les observations par `(mode,session,id)` : une des deux séances réelles disparaissait.

Reproduction avant correction : 1 séance ordinaire, puis deux consolidations du même exercice à 14 h et 16 h, l'une réussie sans aide, l'autre avec aide ; le journal contient deux événements de révision distincts, mais le rapport affiche `consolidation.autonomous=1, helped=0` au lieu de `1 et 1`.

## Correction et règle de preuve

Le dédoublonnage des observations de consolidation emploie l'horodatage `recordedAt` **déjà conservé par le moteur V1** en plus de `(session,id)`. Deux événements à dates distinctes sont donc deux observations ; une copie avec le même horodatage ne double pas les preuves. Pour les événements historiques dont l'horodatage est absent, la méthode reste conservatrice et ne crée pas de séance distincte imaginaire. Les séances `parcours` gardent strictement leur ancienne clé fondée sur `session`.

Aucun état, score, schéma de sauvegarde, éligibilité de révision, preuve de maîtrise ordinaire, QCM ou moteur V1 n'est modifié. Les résultats de consolidation restent séparés de la maîtrise ordinaire.

Quatre tests ciblés dans `tests/wave2-recos-consolidation-sessions.test.js` : deux séances réelles, copie exacte, absence d'horodatage et parcours ordinaire répété. Tous utilisent les fonctions V1 `record/finish` réelles.

**PROCHAINE PASSE :** recette de régression sur l'ensemble des suites M4, audit des doublons avec horodatages égaux et évaluation de la prudence des formulations ; validation native sous Node22 à coordonner avec M5, sans toucher aux workflows. PR #262 DRAFT/HOLD, aucune fusion ni publication.