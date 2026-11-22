# QPJB M1 — PASSE 33 : assemblage M1/M2/M3/M4 et régression inter-branches démontrée

**PASSE 33 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Objectif
Passer de la recette native M1 isolée (P31/P32) à l'intégration des **vraies branches des missions parallèles**, sans altérer une branche tierce ni relancer des audits pédagogiques déjà validés.

## Sources GitHub exactes

| Mission | Commit lu (HEAD au démarrage P33) | Éléments utilisés |
|---|---|---|
| M1 | `cd8b7b097e955a7639515a028ae377f5eea40fb4` | Clone complet et lanceur `tests/wave2-pedagogie-suite.cjs` |
| M2 | `9a1c3373f67eea7908c46c7ecf41a23c46d6d6bc` | `quizz-parcours.js`, 10 scripts `tests/wave2-adaptatif-*.cjs` |
| M3 | `c5e3ed8f150bb257e3aa20c1d7ba5793fa69aff1` | `quizz.html` |
| M4 | `8896fc149b14e203f9339d0c9382be99c1f9e1b3` | `parcours-recommandations.js`, 20 fichiers `tests/wave2-recos-*.test.js` |

**Empreintes contrôlées :** moteur M2 `d0f06f1c259f7a766f2d1c8c47289374a74138dc` (**strictement identique** au moteur M1), HTML M3 `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3`, recommandations M4 `cebe2b3060cf89926010fd981a0b31bcd5b0c292`.

Les fichiers M2/M3/M4 ont été juxtaposés dans un **checkout Linux temporaire de M1**, sous **Node v22.23.5**, sans créer de commit ni modifier les branches sources.

## Mesures réelles sur cet assemblage
- **Suite M1 : 20/20 scripts PASS**, `node tests/wave2-pedagogie-suite.cjs`, code de sortie 0, **21 lignes PASS** avec le lanceur.
- **M2 rapide : 7/7 étapes PASS**, `node tests/wave2-adaptatif-suite.cjs --quick`, 7,8 secondes déclarées par son lanceur. Cela inclut 5 profils × 12 séances / 600 sélections inchangées et les tests de reprise ; **ne vaut pas la recette de recherche M2 65/153 séances**.
- **M4 : 93/94 tests PASS, 1 FAIL** sur `node --test tests/wave2-recos-*.test.js` avec le HTML réel de M3. Le seul échec est le cas P9 de `tests/wave2-recos-integrity.test.js`.

Une tentative supplémentaire de `node tests/wave2-adaptatif-suite.cjs --full` a été **interrompue par l'expiration de la première machine temporaire** après ~97 secondes. **Aucun statut PASS/FAIL complet n'est revendiqué pour la recette longue M2.**

## Origine précise de l'échec M4

Le cas P9 compare `gitBlob(read('quizz.html'))` au SHA Git complet `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`. Or M3 a réellement changé le contenant HTML (nouveau blob `354234e94c7b59d2409ecfdeda2e5c7d0b6bfed3`) **sans changer la charge brute du script `training-data`**, soit **1 523 QCM / 22 thèmes**, SHA-256 JSON `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`.

**Contre-contrôle natif effectué dans un deuxième clone M4 propre, SHA source `8896fc149b14e203f9339d0c9382be99c1f9e1b3` :**
1. HTML M4 original : **94 tests / 94 PASS / 0 FAIL**.
2. Substitution provisoire du HTML exact M3 : **94 tests / 93 PASS / 1 FAIL**, identique à la première recette mixte.
3. **Correctif candidate appliqué uniquement en mémoire de la machine temporaire** : remplacer le contrôle du Git SHA du **HTML entier** par le **SHA-256 du JSON brut extrait de `training-data`**. Sur le vrai HTML M3 : **94 tests / 94 PASS / 0 FAIL**.
4. Mutation volontaire `SEF-L25-004` → `SEF-L25-0X4` dans la charge JSON avec ce correctif candidate : **test d'intégrité FAIL, code 1**, **4/5 cas d'intégrité PASS** ; le garde-fou reste sensible aux QCM.
5. Restauration des fichiers M4 et HTML : **`git status --short` = 0 fichier modifié**. Aucune modification distante M4 ou M3.

La correction appartient au **propriétaire M4 / coordinateur** et **ne doit pas être committée sur la branche M1**. Diagnostic et solution testée transmis à **l'issue M4 #258** et à **la PR M4 #262**. Le contrôle indépendant du blob `quizz-parcours.js` est préservé.

## État des blocages et suite
- **M1 native Node : VALIDÉE 20/20**, y compris dans le rapprochement M2/M3/M4.
- **Compatibilité M4–M3 : blocage d'intégration reproduit et correctif proposé/testé localement**, sans écrire sur M4.
- **GitHub Actions CI M1 : PAS encore raccordée** ; la commande `node tests/wave2-pedagogie-suite.cjs` doit être ajoutée par M5/coordinateur dans une branche de recette contenant M1. Ne pas modifier `.github/workflows/**` depuis M1.
- **Arbitrages humains : 6 textes + 11 conventions toujours HOLD**, bulletin `BULLETIN_17_ARBITRAGES_P29_HOLD.md`; aucun accord inventé.
- **Aucun QCM, moteur, HTML, module de recommandations, CI, branche tierce ni main modifié par cette passe.** Aucune fusion, publication ou force push.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P34 déclenchée par le correctif effectif M4–M3, le raccordement M5 à une véritable CI GitHub ou la réponse du référent sur les 17 décisions. Ne pas créer de passe artificielle en l'absence de ces changements.**
