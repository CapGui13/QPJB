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
Candidat V1 non intégrable en l'état. Une seconde variante `quizz-coherence-m1-guarded.js` conserve la carte et les règles de composition, mais ne permet leur intervention que si les deux dernières séances guidées complètes attestent une autonomie intégrale et si au moins 90 % des réponses guidées enregistrées sont autonomes. C'est une politique prudente d'activation du changement, pas un nouveau prérequis pédagogique ; absence de preuves ou erreurs/aide = repli historique sans bloquer la progression. Ce seuil est une hypothèse après les contre-exemples V1, non une preuve d'efficacité humaine. Banc identique avec `QPJB_M1_POLICY=guarded`, contrat dédié et navigateur avec trace native fraîche. SHA de code/tests V2 : 4434a11535332a1ef176347ebacd0891fcd5a88e. **Recette V2 terminée : 21/21 jobs réussis, dont 18/18 trajectoires S180, Chromium et WebKit** ([run 45903045999](https://github.com/CapGui13/QPJB/actions/runs/45903045999)). Les 18 traces natives ont été inspectées ; les témoins V1 et V2 sont identiques item par item. Synthèse `native-guarded-s1-s180-summary.json`, traces S1–5 `s1-s5-guarded-paired.json`, fiches `fiches-s1-s5-guarded.md`.

V2 : S3 53→56/180, S4 58→61, S5 63→63 (IDs modifiés sur les trois autonomes). Score plafonné S65 1758→1791 ; preuves 1254→1254, familles 10227→10227, dette 202→217. S180 : 99 concepts/22 thèmes chacun, preuves 1562→1562, familles 25703→25703, dette 8885→8909. Aucune alerte selon les seuils inchangés. Treize trajectoires entièrement identiques, cinq modifiées ; les profils faibles, aidés et intermédiaires ne bénéficient d'aucune amélioration directe démontrée. Les quatre objectifs S44/S54/S55/S59 restent absents des decks observés. Le registre signale chaque résultat local ; ses dispositions HOLD/visa sont des recommandations, pas un filtrage supplémentaire mis en oeuvre par V2. V1 reste HOLD, V2 est un candidat limité soumis au coordinateur, non activé.

Restent une amélioration démontrée pour les élèves nécessitant de la consolidation, la révision des objectifs tardifs non représentés et les revues pédagogiques individuelles et suites historiques non encore exécutées. Les navigateurs testés concernent le raccordement isolé réel, non le site publié. Les références historiques ont été consultées, mais la lecture exhaustive de toutes les archives n'est pas attestée.

MISSION DÉFINITIVEMENT TERMINÉE : NON.


## Reprise autonome — variantes V3/V4 (26/11)
La V2 demeure la référence de sécurité. V3 ajoute une substitution de composition au plus par séance dans un créneau libre, score historique borné, même difficulté, protection de la première exposition, des rappels dus et des fondamentaux. Pour la faiblesse, deux familles fragiles distinctes sont exigées ; pour un objectif avancé indisponible, le plan présente un concept lié déjà rencontré sans le compter comme objectif principal. Le point d'injection est partagé par Node et navigateur; les décisions et pools tardifs sont tracés sans stockage de production.

V3 : SHA `aca8623a2ef4cbea292b5b98237227213128d1d5`, run [45904248782](https://github.com/CapGui13/QPJB/actions/runs/45904248782), 18/18 trajectoires S180, deux navigateurs, 64 800 réponses appariées. Cependant le profil Passe/47 perd son seul vrai soutien 5–3 à S3 : 0 soutien et 2 Passe avec fit. Un tag majeur.soutien n'est pas une enchère de soutien. **V3 HOLD**, malgré les seuils longitudinaux satisfaits. Les substitutions de même concept ne sont pas un gain de curriculum.

V4 : SHA `c44fa8231814340f8a4f4a36a170f1af0d659083`, run [45904764450](https://github.com/CapGui13/QPJB/actions/runs/45904764450). Distinction explicite entre un soutien 5–3 (2 de la majeure ouverte avec trois atouts) et Passe avec fit. Si le premier n'est pas sélectionné, aucun Passe supplémentaire ne peut le remplacer. Une substitution ne peut plus être entre deux IDs du même concept. **18/18 paires S1–5 en Node natif et V8**, 18 vrais soutiens conservés et 7→13 Passe avec fit sur S3, quatre substitutions supplémentaires dans quatre profils non entièrement autonomes; S3 objectif brut 53→56, S4 58→61, S5 63→63. Trois profils faibles restent identiques sur S1–5. Fiches et traces : `s1-s5-fit-paired.json`, `fiches-s1-s5-fit.md`. Les fiches s'appuient sur V8, la recette native rapide confirme les mêmes agrégats. Les 14 assertions V4 ont été exécutées en V8 et dans le job quick natif. Chromium et WebKit ont réussi sur les trois profils de référence/graine 47 ; ce choix ne couvre pas les quatre substitutions propres V4 observées en S3. Ne pas étendre cette preuve à l'UI de production.

Les pools V3 ont été inspectés pour les 18 trajectoires : S44 aucun candidat primaire admissible; S54 18 pools admissibles mais 0 créneau libre après filtres; S55 et S59 18 pools et 18 créneaux libres, aucun objectif primaire finalement sélectionné. Ne pas lever les filtres ni imposer un quota. S44 première découverte constatée des suites Blackwood S48–75, S54 premières découvertes S16–43, S55 S11–18, S59 S20–46. Ce sont respectivement une fenêtre de découverte à déplacer et des objectifs de réactivation, à coordonner avec M3/M4. Les résultats restent distincts des objectifs initiaux pour ne pas gonfler les métriques par renommage.

Douze suites historiques réellement exécutées sur la base de production inchangée : 10 PASS; `coherence-progression-m2-policy` échoue car le banc impose 1879 QCM; `coherence-progression-m3-boundary` échoue sur `unexpected require` de son ancien chargeur. Voir artefact 15157188051 et `conditional-v3-fit-v4.json`. Ces échecs existent sans injection du candidat. Aucun test historique ni fichier de production modifié. Recalage sur références figées réservé au coordinateur.

Le registre S1–65 conserve les chiffres de référence et les dispositions V1/V2/V3/V4; la recette longitudinale V4 est séparée. Les réserves demeurent : pas de gain direct démontré pour l'élève très faible, objectifs tardifs non représentés, revue exhaustive historique et validation intégrée. Ne pas fusionner isolément.

### Clôture de la recette V4
9/9 jobs natifs réussis, 18/18 paires S180, 64 800 réponses simulées, deux navigateurs hors ligne. Les 18 témoins V2/V4 sont identiques item par item. À S65, alignement 1758→1788, preuves 1254→1252, familles 10227→10226, dette 202→220 ; à S180 preuves 1562→1562, familles 25703→25688, dette 8885→9001, 99 concepts et 22 rubriques par trajectoire. 9 trajectoires modifiées et 9 identiques au témoin. 5 substitutions directes propres à V4 (4 S3, 1 S44) ; les trois profils faibles restent identiques. La V2 a une dette moindre (8909) et un alignement S65 légèrement supérieur (1791) ; V4 améliore les contrastes réels S3. Aucun gain humain établi. V4 satisfait les seuils du banc, mais les quatre objectifs tardifs restent absents et les deux suites historiques restent incompatibles avec la base. V1/V3 HOLD ; V2/V4 candidats soumis au coordinateur, ne pas activer automatiquement. Les deux navigateurs ont validé 30 séances appariées chacun (trois profils graine 47), non les quatre substitutions propres V4 de S3. SHA source/test exact c44fa8231814340f8a4f4a36a170f1af0d659083 ; preuves dans conditional-v3-fit-v4.json. **MISSION DÉFINITIVEMENT TERMINÉE : NON — gain pédagogique universel non démontré, objectifs tardifs, suites historiques et visa intégration restent ouverts.**
