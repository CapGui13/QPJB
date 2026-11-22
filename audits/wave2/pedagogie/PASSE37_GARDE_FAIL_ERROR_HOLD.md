# QPJB — M1 / PASSE 37 : rejeter FAIL/ERROR avant le marqueur final PASS

**PASSE 37 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON — PR #261 DRAFT / HOLD.**

## Problème démontré sur le véritable code de M1

En reprenant les résultats sur GitHub, le workflow habituel **QPJB Training smoke** [run #45023845205](https://github.com/CapGui13/QPJB/actions/runs/45023845205), sur le commit M1 `df0a89276e12a47d180a39de13e7df6af608cd10`, est désormais **terminé avec conclusion success**. Attention : ses jobs historiques **n'invoquent pas** `node tests/wave2-pedagogie-suite.cjs` ; il ne prouve donc pas la suite pédagogique M1 en GitHub Actions.

L'analyse du véritable fichier `tests/wave2-pedagogie-runner-p24.cjs` a montré un défaut **reproduit sous Node v22.23.5** : `hasPassMarker` acceptait `FAIL ...\nPASS wave2-pedagogie-progressions : OK` et `ERROR ...\nPASS ...` dès lors que la **dernière ligne** était le PASS du test. Le lanceur ne lui transmettait pas `stderr`, permettant aussi le faux succès quand la sortie d'erreur signalait un `FAIL` / `ERROR` mais que le script revenait avec `exitCode=0`.

Ce cas n'était pas couvert par P28, qui avait correctement bloqué **PASS suivi de FAIL**, mais pas **FAIL avant PASS**, ni **FAIL/ERROR dans stderr**. Il s'agit d'une faille observable du garde-fou du lanceur, **pas d'une erreur pédagogique constatée dans un QCM**.

## Correction — trois fichiers M1 existants, zéro nouveau script

1. `tests/wave2-pedagogie-runner-p24.cjs` : `hasPassMarker(file,stdout,stderr='')` examine désormais les deux sorties. Une ligne commençant par `FAIL` ou `ERROR` (mot autonome, insensible à la casse) à n'importe quelle position **invalide la réussite**, même si une ligne PASS valide arrive après. Les mentions ordinaires de FAIL dans une phrase ne sont pas rejetées. Le PASS final exact du script reste obligatoire ; les alias historiques sont conservés.
2. `tests/wave2-pedagogie-suite.cjs` : le lanceur passe désormais aussi `res.stderr` à la validation, et précise le diagnostic si le marqueur est absent/invalide ou si FAIL/ERROR est détecté.
3. `tests/wave2-pedagogie-runner-integration-p25.cjs` : quatre nouveaux scénarios contradictoires `beforeFail`, `beforeError`, `stderrFail`, `stderrError`, ajoutés aux huit précédents. Une erreur doit arrêter immédiatement le lanceur et empêcher tout PASS final.

**Empreintes Git exactes vérifiées entre les fichiers réellement testés dans la VM et les blobs GitHub préparés :**
- P24 : `570787012dc8bb8e4cec1eb89c2d0e4dc1642ce3` (3 160 octets).
- P25 : `c8fc6331b96a96529c04764811319c7340990aab` (4 965 octets).
- Lanceur : `18a4d5bbd281764b96446d6f66b7cb3705789544` (1 693 octets).

## Test → contre-test → retest natifs

Sur le **clone complet** de M1 `df0a89276e12a47d180a39de13e7df6af608cd10` et le **vrai Node v22.23.5** :

- **Avant correction**, appels réels à `hasPassMarker` : deux exemples stdout (`FAIL` puis `PASS`, `ERROR` puis `PASS`) et un cas `ERROR` de démonstration ont été acceptés à tort.
- Les scénarios d'échec ont été **ajoutés d'abord** aux tests P24/P25 sans modifier la logique du lanceur : **P24 FAIL et P25 FAIL**, comme attendu. Messages : `Fausse acceptation ... FAIL ...` et `Échec beforeFail non propagé`.
- **Après correction** : `node --check` **3/3 PASS** ; P24 : **6 marqueurs corrects acceptés / 13 faux marqueurs rejetés** ; P25 : **20 sous-processus simulés / 12 modes d'échec propagés et arrêt immédiat** ; P26 (inventaire) : **PASS**.
- **Vraie suite** `node tests/wave2-pedagogie-suite.cjs` avec les **20 scripts réels et tous les documents originaux** : **exit 0, 20/20 PASS** (21 marqueurs PASS avec le lanceur).
- **Contre-épreuves avec vrais processus Node (pas une simulation)** : dans la VM, remplacement provisoire du deuxième script `wave2-pedagogie-progressions.cjs` par `FAIL ... ; PASS ...` avec `exitCode=0` : **lanceur exit 1** et arrêt immédiat. Deuxième injection : `ERROR` dans `stderr` puis `PASS` dans `stdout` avec `exitCode=0` : **lanceur exit 1**. Script authentique ensuite restauré : **suite complète 20/20 PASS**, et `git status --porcelain` ne montre que les trois modifications M1 autorisées.
- **Contre-recette d'intégration réelle** : remplacement provisoire du HTML du clone par le `quizz.html` **exact de M3 livré** (`35ebb3c928d4b3f4a1e1c2cf8dab00e9c6d32020`, blob `94360d58fc45d0516437d158a61f6d306e3bc986`) : **20/20 PASS sous Node**, puis restauration exacte du HTML M1 (blob `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`), sans changement de catalogue ni de branche M3.

## Préconditions non levées et protection du périmètre

- **CI GitHub Actions M1 spécifique : non attestée**. Le workflow historique vert n'appelle pas la suite M1, et M1 ne doit pas modifier `.github/workflows/**`, réservé à M5 / coordinateur.
- **M4–M3 :** correctif P36 documenté, testé à 107/107 en VM, **pas encore committé sur M4**. Ce constat demeure distinct du périmètre de M1.
- **Pédagogie :** les **6 clarifications et 11 accords** restent **PENDING**, bulletin P29 disponible ; **36 propositions historiques restent non appliquées**. Aucun QCM, correction, bonne réponse ou convention n'a été approuvé artificiellement.
- **Aucun fichier applicatif, workflow, QCM, autre branche ni main modifié** par cette passe ; aucune fusion ni publication. PR brouillon/HOLD.

**PASSE 37 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P38 seulement après raccordement réel de la CI M1 par M5/coordinateur, correction M4 effectivement committée, réponse pédagogique humaine ou nouveau défaut prouvé.** Ne pas créer d'autres passes de simple suivi.
