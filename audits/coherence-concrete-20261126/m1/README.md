# M1 — progression pédagogique concrète (#419, #420)

Base figée : 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Candidat exécutable et tests : f32e82f2be7265da42ddaf45dac9b3bb57050f36. Aucune modification du moteur de production, du catalogue, des prérequis, de l'ordre ou du stockage. Le coordinateur seul peut intégrer. **HOLD activation** : les critères longitudinaux ne sont pas tous satisfaits.

## Livrables
- quizz-coherence-m1-curriculum.js : 65 séances, intentions, objectifs et concepts, fenêtres souples, choix de composition sur candidats déjà admissibles, score borné, repli historique. Rappels explicites et choix prioritaires préservés.
- tests/coherence-concrete-m1-unit.cjs : contrat, garde-fous et pureté.
- tests/coherence-concrete-m1-bench.cjs : véritable moteur figé et injection expérimentale en mémoire, comparaison appariée, mêmes profils et graines, 10 questions distinctes, famille, admissibilité, reprise, preuves et dette.
- tests/coherence-concrete-m1-browser.cjs : UMD et moteur réel injecté hors ligne (pas l'interface de production).
- registre-s1-s65.json : 65 intentions, dispositions et mesures disponibles ; pas de validation éditoriale manuelle universelle.
- s1-s5-paired.json : 1 800 réponses simulées, avec dictionnaire des questions réelles, six profils et trois graines.
- fiches-s1-s5.md : 150 positions comparées avant/après, trois profils, graine 47.
- s1-s20-summary.json : 7 200 réponses simulées appariées, comparatifs détaillés.

## Résultat initial S1–20
S1/S2 exactement identiques. S3 cible 53→61/180, soutien majeur 25→34 ; S4 seuils SA 58→66 ; S5 redemande 63→66 et Stayman/Texas 38→35. À S20, 18/18 paires ont le même nombre de familles et de rappels explicites, dette nulle et 14 thèmes. Score d'alignement plafonné amélioré dans 17/18, égal dans une. Quelques baisses de preuves et de couverture conceptuelle subsistent : ne pas confondre alignement avec apprentissage prouvé. Les gains sont mesurés sur trajectoires simulées, pas sur élèves réels.

## Recette native
Run https://github.com/CapGui13/QPJB/actions/runs/45902446308 sur le SHA exact du candidat. PR technique #429 vers la branche M1, workflow isolé, jamais à fusionner. Contournement de l'impossibilité de cloner localement (DNS GitHub).
Node v22.23.5 : job quick réussi (unit, bench autonome/47 S5, quizz-prerequis et quizz-catalogue-live).
Chromium 156.0.8078.4 et WebKit 27.2 : 30 séances appariées par navigateur, hors ligne, reprise, PASS (artefacts 15156597487 et 15156413108). Interface de production non testée.
Les premières trajectoires natives S180 ont produit leurs traces complètes ; faible/11 : S65 preuves 46→40 (échec du seuil) ; cible/103 : S65 concepts 99→96 (échec du seuil) ; cible/47 : PASS. Pas d'assouplissement des seuils. Les 18 jobs du run sont la recette longue de référence. Les artefacts restent sur GitHub Actions ; tous n'ont pas encore été inspectés à cette rédaction.

## Reproduction
```sh
node tests/coherence-concrete-m1-unit.cjs
node tests/coherence-concrete-m1-bench.cjs all all 180 trace.json
node tests/quizz-prerequis.cjs
node tests/quizz-catalogue-live.cjs
```
Le banc retourne 2 en présence de revues bloquantes, après écriture de trace.json. Ne pas traiter une telle sortie comme PASS. Les suites historiques complètes et la publication restent à valider par le coordinateur après correction.

## Décision
Candidat de composition réel livré, non intégré. Garder les seuils, corriger la dégradation longitudinale, répéter sur les 18 trajectoires et examiner les 65 séances avant tout visa. Les objectifs S6–65 restent candidats ; les gains S3–5 ne valident pas l'ensemble. Les références historiques ont été consultées, mais la lecture exhaustive de toutes les archives n'est pas attestée.

MISSION DÉFINITIVEMENT TERMINÉE : NON.
