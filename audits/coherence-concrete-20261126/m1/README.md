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
Les 18 trajectoires natives S180 ont produit leurs traces complètes (64 800 réponses simulées appariées). Les 18 archives ont été téléchargées et inspectées. 11 PASS, 7 revues bloquantes, aucune violation structurelle. À S65, score plafonné 1758→1859, preuves 1254→1243, dette 202→266. À S180, preuves 1562→1536, dette 8885→9112 ; 99 concepts et 22 thèmes par trajectoire dans les deux variantes. Les seuils restent inchangés. Bilan détaillé, 65 séances et liste des artefacts : `native-s1-s180-summary.json`.

## Reproduction
```sh
node tests/coherence-concrete-m1-unit.cjs
node tests/coherence-concrete-m1-bench.cjs all all 180 trace.json
node tests/quizz-prerequis.cjs
node tests/quizz-catalogue-live.cjs
```
Le banc retourne 2 en présence de revues bloquantes, après écriture de trace.json. Ne pas traiter une telle sortie comme PASS. Les suites historiques complètes et la publication restent à valider par le coordinateur après correction.

## Décision et seconde variante
Candidat V1 non intégrable en l'état. Une seconde variante `quizz-coherence-m1-guarded.js` conserve la carte et les règles de composition, mais ne permet leur intervention que si les deux dernières séances guidées complètes attestent une autonomie intégrale et si au moins 90 % des réponses guidées enregistrées sont autonomes. C'est une politique prudente d'activation du changement, pas un nouveau prérequis pédagogique ; absence de preuves ou erreurs/aide = repli historique sans bloquer la progression. Ce seuil est une hypothèse après les contre-exemples V1, non une preuve d'efficacité humaine. Banc identique avec `QPJB_M1_POLICY=guarded`, contrat dédié et navigateur avec trace native fraîche. SHA de code/tests V2 : 4434a11535332a1ef176347ebacd0891fcd5a88e. Les résultats V2 ne sont pas encore attestés à cette rédaction. V1 reste archivé et le HOLD global reste en vigueur. Les objectifs S6–65 restent candidats ; les gains S3–5 ne valident pas l'ensemble. Les références historiques ont été consultées, mais la lecture exhaustive de toutes les archives n'est pas attestée.

MISSION DÉFINITIVEMENT TERMINÉE : NON.
