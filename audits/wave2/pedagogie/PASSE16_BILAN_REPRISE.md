# QPJB — M1 / Passe 16 : point de reprise exécutable, réserves et périmètre

**PASSE 16 FINIE (bilan de reprise). MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 : BROUILLON / HOLD.**

## État réel consolidé
- Catalogue de référence : **1 523 QCM / 22 rubriques** ; 36 propositions historiques **NON appliquées**.
- Prototype P7 : **92 IDs**, 22 rubriques, difficulté véritablement graduée ; ne prétend pas mesurer la maîtrise élève.
- P9 : **47 substitutions** vs P3. **P10 : 15 contre-lectures ; P13 : 32**, couvrant les 47 ID sans corriger les QCM.
- Proposition éditoriale : **6 textes nouveaux, tous non approuvés** (3 P8, 1 P10, 2 P13).
- Conventions : **11 dossiers à arbitrer** (6 sources explicites de cadrage, 2 sources partielles, 2 accords locaux, 1 discordance de variante).
- Cas prioritaire : **`SEF-L25-004` — Texas contré, absence de fit ♥ mais ♦AD84**. Une source consultée réserve Passe à l'absence d'arrêt Carreau ; ne pas citer cette source comme certification de la réponse avec cet arrêt.
- **Aucune validation humaine reçue** dans ce chantier long ; le statut documentaire ne remplace pas cette décision.

## Contrôle de périmètre vérifié sur la PR #261
Avant cette passe, **35 fichiers changés**, tous et uniquement sous `audits/wave2/pedagogie/**` ou `tests/wave2-pedagogie-*`, **zéro QCM, zéro moteur, zéro workflow CI**. Les trois fichiers P16 ajoutés restent dans ce périmètre. [Issue #255](https://github.com/CapGui13/QPJB/issues/255) ; [PR #261](https://github.com/CapGui13/QPJB/pull/261). PR vérifiée en **draft** sur le SHA parent `f829c940e0b3efb3e73d4890e9580b53bbf435ba`.

## Reprise sans refaire P1–P16
`MATRICE_REPRISE_P16_HOLD.json` conserve les **6 IDs éditoriaux et 11 ID de conventions**, leurs décisions ouvertes, les niveaux de preuve, les liens de coordination, les garanties et la suite. `tests/wave2-pedagogie-reprise.cjs` contrôle la concordance avec P12/P13/P14/P15 et l'unicité des décisions. `tests/wave2-pedagogie-suite.cjs` inclut désormais **11 tests** couvrant P5, P7–P16.

**Limite d'exécution** : syntaxe et assertions documentaires ont été exercées sur les sources Git réelles via sandbox JS, mais **le lancement effectif Node/CI du script de suite n'a pas été observé**. Ne jamais annoncer les onze tests comme « CI vert » sur cette base. L'utilisateur peut faire exécuter `node tests/wave2-pedagogie-suite.cjs` dans un clone Git à la branche indiquée ; toute erreur devra être corrigée dans le périmètre.

## Portes bloquantes
1. Valider ou rejeter explicitement les six clarifications, sans les appliquer au catalogue dans M1.
2. Arbitrer d'abord SEF-L25-004 (Texas contré : main avec ♦AD84) selon l'accord de paire retenu.
3. Valider les deux conventions locales et préciser les huit autres dossiers normatifs/conventionnels.
4. Exécuter effectivement sous Node le lanceur des onze tests puis demander l'intégration CI via une mission autorisée.
5. Tester l'impact d'enseignement réel des parcours, sans inférer de maîtrise à partir de la seule exposition.
6. Coordonner l'intégration uniquement après décisions écrites : ne pas fusionner ou publier la PR #261.

**PROCHAINE PASSE : P17 : arbitrages des écarts SEF à partir des sources et éventuels cas concrets de contre-exemples, pas de validation automatique.** Dans tous les cas, **mission NON définitivement terminée**, **ne pas lever HOLD** sans arbitrages et tests, ne pas fusionner, ne pas publier.
