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


## Dernière passe de production — V5 ciblée / V6 fenêtres, 26 novembre 2026

**V5 (HOLD)** — `quizz-coherence-m1-targeted.js`, SHA de recette d08eea9999484e9267e9cc705ed4883df61bf003, [run 45905880301](https://github.com/CapGui13/QPJB/actions/runs/45905880301), 11/11 jobs, 18/18 paires S180, 23 assertions de contrat supplémentaires, 50 séances appariées par navigateur Chromium et WebKit hors ligne. Faible/11 S3 : SEF-016-1 (9 H, 1♦–1♠, quatre Piques) → SEF-030-1 (3 H, 1♠–Passe, trois Piques), avec soutien 5–3 conservé (SEF-V49-010, 1♥–2♥, 7 H). Deux autres réponses sur mineure restent. S3 total objectifs 53→57; vrais soutiens 18→18, Passe avec fit 7→14. Cependant faible/11 dette S180 369→410 et alignement S65 89→85, preuve S180 67→67. Une seule trajectoire change au-delà de V4. Ne pas activer ce réglage faible, malgré la recette verte. Les preuves et 18 traces appariées S1–5 sont dans `native-targeted-s1-s180-summary.json`, `s1-s5-targeted-paired.json`, `fiches-s1-s5-targeted.md`. `revue-s1-s5-cas-et-positions.json` examine les 82 IDs distincts réellement rencontrés dans ces trajectoires, leurs mains/enchères/corrigés, 1 800 positions et raisons observables, contrôle des 13 cartes, H et distribution ; revue IA, non visa éditorial humain. V6 S1–5 est exactement V4, dont les fiches et données restent disponibles ; les QCM V4 sont inclus dans la revue V5, les raisons de position V5 restent propres aux traces V5.

**V6 (candidat au visa)** — `quizz-coherence-m1-window.js`, SHA testé 2468aa691d7c6f9e64980091de501180844cc27f, [run 45906296059](https://github.com/CapGui13/QPJB/actions/runs/45906296059). V4 conservée au début; V5 exclue. Quatre fenêtres complémentaires, non déblocantes, sans renommage des objectifs d'origine. Une substitution au plus dans un créneau libre de même catégorie, même difficulté, étape non supérieure, coût borné ≤65; preuve locale, protection des rappels dus et des premières expositions, du socle et du thème non représenté. Pour découvrir une notion avancée : preuves autonomes multi-familles et multi-séances pour chaque prérequis, en plus de l'admissibilité historique. Aucun seuil du banc abaissé.

Recette V6 : 9/9 jobs, 18/18 paires, 64 800 réponses synthétiques appariées; 30 assertions V6 et suites rapides, Chromium/WebKit 30 séances appariées chacun jusqu'à S5 hors ligne avec reprise. 18 témoins exactement identiques à V4 sur S1–180; 18/18 decks V6/V4 identiques S1–5. Aucun signal bloquant de revue. Les deux navigateurs n'ont pas couvert la substitution S56; cette dernière est effectivement exécutée en Node sur les trois graines, pas dans l'UI de production.

| Mesure | Témoin | V4 | V6 |
|---|---:|---:|---:|
| Alignement plafonné S65 | 1758 | 1788 | 1788 |
| Preuves S65 | 1254 | 1252 | 1252 |
| Preuves S153 | 1482 | 1482 | 1479 |
| Preuves S180 | 1562 | 1562 | 1562 |
| Familles S180 | 25703 | 25688 | 25688 |
| Dette fondamentale S180 | 8885 | 9001 | 8974 |
| Dette concepts S180 | 90817 | 90904 | 90970 |

Latence médiane par séance V6 : 30,31→32,47 ms (runner, pas appareils élèves). 9 trajectoires différentes du témoin, 3 de V4, 15 identiques à V4. Pas de gain direct pour les trois profils faibles. Les écarts négatifs sont conservés au registre, notamment la dette et la baisse locale d'alignement; il n'existe pas de domination globale sur V2 ni sur le témoin.

### Effet tardif réel
À S56 sur autonome/11, /47 et /103, V2-M2-036 (1SA–3♣ Texas Carreau, 16 H, rectification 3♦) est remplacé par SEF-L40-001 (2SA–3♣ Stayman, 20 H, aucune majeure quatrième, 3♦). Même catégorie maintenance, niveau 3, coût 48. Les deux décisions sont différentes malgré la même enchère; ce n'est pas une variation artificielle d'ID. L'objectif complémentaire S55–60 est réellement réinvesti dans 3 trajectoires au lieu de 0. Le score de l'objectif principal S56 ne change pas. Par trajectoire autonome, à S180 dette V4→V6 567→558, preuves 99→99, familles 1556→1556. 109 séances par trajectoire diffèrent de V4 (S56 puis à partir de S73). Réactivation conditionnelle et effet longitudinal, pas preuve humaine.

Fenêtres (nombre de trajectoires avec au moins une question / nombre de questions), témoin→V6 : S48–65 Blackwood suites 12/67→12/52, S54–59 contre sur SA 0/0→0/0, S55–60 réponses 2SA 0/0→3/3, S59–64 exceptions 4/5→1/2. Les fenêtres S44, S54 et S59 restent **HOLD** pour toute activation supplémentaire, les gains n'étant pas établis. S44 impossible au calendrier réel, S54 aucun créneau libre après filtres, S59 pas de remplacement satisfaisant. Ne pas forcer de quota. Carte et sorties historiques sont inchangées; `native-window-s1-s180-summary.json` conserve les 65 mesures, artefacts complets, preuve de substitution et limitations.

### Suites historiques et transmission
Les deux suites incompatibles avec la base moderne ont été exécutées sur leurs références historiques exactes dans le run V5 : M2 policy SHA a50c28eb2ecac1305d56e1ce03ce791f4022d171 (artefact 15158017859) PASS; M3 boundary SHA 567b01fde7d42c474fa117271ad4c7ad4d48ac87 (15157723327) PASS. Les dix autres suites passent sur la base moderne non injectée (run V3). Il ne s'agit pas de 12 PASS sur la même base. Le coordinateur doit adapter les anciens chargeurs/attentes de catalogue pour la recette commune, sans diminuer les invariants. Les corps des contrats et références #293/#365/#375–409 ont été consultés au fil des passes; pas de prétention à une relecture exhaustive de tous les commentaires ou archives annexes.

Raccordement proposé : charger la chaîne UMD curriculum → guarded → conditional → fit → window avant le moteur, ou CommonJS `require('./quizz-coherence-m1-window.js')`. Utiliser `plan(ctx)` (objectif historique et windowObjectives complémentaires) et le point d'injection réel `sourceFor` du banc; fournir uniquement candidats déjà éligibles, catégorie, sélection, contexte prioritaire/forcé, flags historiques et score d'origine. Préserver le classement historique, la reprise et tous les invariants si aucune substitution. Le coordinateur arbitre V6 face à V2, les écarts et l'interaction M2–M5, valide cache/build/quiz libre/ancien export et l'UI intégrée, puis publie s'il valide. V1/V3/V5 non activables; V2 alternative conservatrice, V4 intermédiaire, V6 candidate justifiée. Aucune fusion, aucune publication, aucun changement de fichier de production.

Reproduction : `QPJB_M1_POLICY=window node tests/coherence-concrete-m1-bench.cjs all all 180 trace.json`; `node tests/coherence-concrete-m1-window.cjs`; navigateur avec `QPJB_M1_POLICY=window QPJB_M1_REFERENCE=trace-s5.json PW_BROWSER=chromium node tests/coherence-concrete-m1-browser.cjs` (trace-s5.json produite par le banc même politique, horizon 5; webkit analogue). Les 18 traces longues sont téléchargeables depuis les artefacts du run natif; la synthèse versionnée ne remplace pas leur contenu complet.

**MISSION DÉFINITIVEMENT TERMINÉE : OUI — périmètre autonome M1, production et recette native livrées, gains limités et HOLD documentés conformément à #419. Intégration/activation : NON, réservée au coordinateur.** Aucune preuve d'apprentissage humain, aucun visa humain ni publication revendiqués.
