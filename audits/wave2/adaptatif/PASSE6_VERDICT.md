# M2 — PASSE 6 : décision pédagogique et garde-fous de livraison

**PASSE 6 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Verdict des deux familles candidates

**AUCUNE MUTATION PÉDAGOGIQUE JUSTIFIÉE.**

- Famille P3, protection supplémentaire des fondamentaux : 30 comparaisons appariées à 65/153 séances sur 3 graines, toutes les 22 rubriques couvertes, mais perte de familles et résultats non monotones en difficulté 4–5. Voir `PASSE5_CONTRETESTS.json` / `.md`.
- Famille P4, trois rappels par séance : 10 trajectoires P4 comparées à P2, gain de rappels contre perte trop importante en découverte et familles ; candidat **rejeté**. Voir `PASSE4_RAPPELS.md`.
- **Aucune variante n'a été insérée dans `quizz-parcours.js`.** Il serait injustifié de proclamer un gain de maîtrise, car les cinq profils sont des simulations synthétiques et n'incluent aucun suivi longitudinal réel d'élèves.

## Seul changement conservé sur le moteur

Réutilisation du score d'un candidat au cours du tri d'une place, au lieu de recalculer le même score dans le comparateur. Avant/après observé en V8 sur 65 séances, profil « échecs », graine 11 : ~69,65 s contre ~9,58 s. C'est une optimisation algorithmique, non pédagogique. 5 profils × 12 séances = **600 sélections à l'identique**, contrôlées par des empreintes figées `tests/wave2-adaptatif-selection-regression.cjs`. La référence echec/65 graine11 est également strictement identique. Le gain peut différer en navigateur : ne pas promettre ×7 en production.

## Périmètre et sécurité vérifiés

- Branche `wave2/adaptatif-20261121` depuis `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a` ; divergence 0 commit derrière à l'instant du contrôle ; PR #263 **ouverte, DRAFT/HOLD**, non fusionnée.
- `quizz.html` non modifié, blob original `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`; 1 523 QCM / 22 rubriques intacts et aucune proposition pédagogique du stock de 36 appliquée.
- **100 % des 32 fichiers modifiés dans le périmètre autorisé.** Un seul fichier moteur modifié (7 lignes changées), plus tests `tests/wave2-adaptatif-*` et preuves `audits/wave2/adaptatif/**`.
- La sérialisation et la reprise ne changent pas de schéma. Test de cinq variantes de reprise, état actif, sauvegarde locale, export/import, historiques sans motif et motif invalide.

## Résultats des tests et réserve bloquante

- Référence : 30/30 trajectoires, 32 700 réponses simulées.
- Candidate P3 : 30/30 trajectoires, 32 700 réponses.
- Candidate P4 : 10/10 trajectoires, 10 900 réponses.
- Test d'équivalence 600 sélections ; reprise avec états interrompus et export/import contrôlée.
- **Ces tests ont exécuté le JS dans V8 avec adaptateurs Node** ; pas de CLI Node locale sur le dépôt complet. Les workflows existants, déclenchés par la PR, étaient encore `queued` lors du dernier contrôle, pas de conclusion verte.
- Aucun workflow ni fichier hors périmètre modifié pour ajouter un job ; les fichiers nouveaux nécessitent une vérification Node 22 dédiée, commande ci-dessous, pour lever la réserve. Ne pas fusionner sur cette base seule.

```bash
node --check quizz-parcours.js
node --check tests/wave2-adaptatif-benchmark.cjs
node --check tests/wave2-adaptatif-candidates.cjs
node --check tests/wave2-adaptatif-resume.cjs
node --check tests/wave2-adaptatif-selection-regression.cjs
node tests/wave2-adaptatif-selection-regression.cjs
node tests/wave2-adaptatif-resume.cjs
node tests/wave2-adaptatif-benchmark.cjs --json
node tests/wave2-adaptatif-candidates.cjs --variant foundation --json
node tests/wave2-adaptatif-candidates.cjs --variant recall --json
node tests/quizz-parcours.cjs
```

## Suite concrète, au-delà de la passe 6

Le compteur `weakDueRecallRate` actuel divise des rappels effectifs par la **somme répétée** du stock dû à chaque séance : un même QCM faible peut compter de nombreuses fois. C'est une mesure de capacité du moteur face au stock, **pas une probabilité de rappel d'un QCM faible**, et elle peut être mal comprise. **PASSE 7 :** enrichir l'instrumentation avec des compteurs d'ancienneté et de stock à un instant donné, comparer avec le ratio existant, vérifier les chiffres 65/153 et ne pas toucher au moteur sans preuve de problème réel.

**HOLD :** aucune fusion, aucun déploiement, aucune modification du catalogue ou d'autres branches.
