# QPJB — M1 / PASSE 36 : qualification inter-branches livrée, M4 patch reproductible

**PASSE 36 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON — PR #261 DRAFT/HOLD.**

## 1. Changement objectif depuis P35 : M3 est désormais réellement vert en CI

La branche M3 a reçu ses corrections UX sur le commit **`35ebb3c928d4b3f4a1e1c2cf8dab00e9c6d32020`**, contrairement aux essais CSS uniquement locaux de P35. Le projet M3+M5 dispose maintenant de la branche de recette **`integration/qpjb-m3-m5-recette-20261122`**, commit **`9aac018359dfa0cca51475be47275b7f4507650f`**, PR brouillon #269, avec workflow réel `qpjb-m3-integration-recette.yml`.

**Vrai GitHub Actions** : [run #45003178089](https://github.com/CapGui13/QPJB/actions/runs/45003178089), **status completed / conclusion success**, recette **12/12 étapes, 14/14 scénarios Chromium et WebKit, 36 captures PNG vérifiées**. Une archive `m3-chromium-webkit-45003178089-1` de **3 929 950 octets** est disponible et non expirée. Ce run **ne contient pas** l'exécution M1.

Quatre fichiers essentiels de M3 livré ont été confrontés, blob par blob, aux fichiers du SHA d'intégration ayant passé la CI :

| Chemin | Blob identique dans M3 et la recette CI |
|---|---|
| `quizz.html` | `94360d58fc45d0516437d158a61f6d306e3bc986` |
| `tests/wave2-ux-browser.cjs` | `585a891175f7ad6a699a8aa47f93835695aa3927` |
| `tests/wave2-ux-visual.cjs` | `e020600aa239b8564760d1ba64623b51eb69a2be` |
| `tests/wave2-ux-reflow-check.cjs` | `c89900ed5a74785318b890f6344717d54e5e29e1` |

**Résultat : le blocage de recette M3 est levé dans sa branche/CI, mais la PR M3 reste brouillon jusqu'à la coordination.** Aucun script de test M3 n'a été réécrit sur M1.

## 2. Nouvelle recette native d'assemblage sur les vraies versions M1/M2/M3/M4

Une machine Linux isolée et connectée a cloné le vrai HEAD M1 **`49c3e27f2904f00c224ef42ccb5d1bea210733e2`**, puis a récupéré **en lecture seule** les trois HEAD :

- M2 `5197f04ef8b530e5a73c5e414f26d8d0ef4f2d15`, `quizz-parcours.js` blob `d0f06f1c259f7a766f2d1c8c47289374a74138dc` ;
- M3 `35ebb3c928d4b3f4a1e1c2cf8dab00e9c6d32020`, HTML blob `94360d58fc45d0516437d158a61f6d306e3bc986` ;
- M4 `8896fc149b14e203f9339d0c9382be99c1f9e1b3`, module blob `cebe2b3060cf89926010fd981a0b31bcd5b0c292`, 20 fichiers de tests M4 `wave2-recos-*` plus le test historique.

**Véritable Node v22.23.5, sans mocks ni changement de catalogue** :

| Commande | Résultat |
|---|---|
| `node tests/wave2-pedagogie-suite.cjs` | **20/20 PASS**, code 0, 21 lignes PASS avec le lanceur (confirmé sur l'assemblage après les autres essais) |
| `node tests/wave2-adaptatif-suite.cjs --quick` | **7/7 PASS en 7,4 secondes**, sélection 600 et cinq contrôles de reprise compris |
| `node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js` avec test M4 original | **106/107 PASS, 1 FAIL**, code 1 (test P9 HTML entier) |

Le payload JSON exact `training-data` de M3 livré contient **1 523 QCM / 22 thèmes**, **1 808 148 octets** et conserve le SHA-256 brut **`22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a`**. Le seul échec M4 est `P9 garde-fou : le gros HTML contenant les 1523 QCM est intact` : le code compare encore le blob **de la page HTML entière** à `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`, ce qui rejette à tort l'UI M3 modifiée. Le moteur et les QCM sont pourtant intacts.

## 3. Correction M4 effective en VM et contre-épreuves négatives

Le fichier `tests/wave2-recos-integrity.test.js` du vrai HEAD M4 (blob `dd2f62052d4f76d03b67cc6aa018acf52b61878b`) a été adapté **dans la VM uniquement**, sans toucher à la branche M4. Une assertion vérifiant l'ancien Git SHA de l'HTML entier a été remplacée par :

- extraction exacte de la chaîne brute du script `training-data` ;
- comparaison du SHA-256 brut à `22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a` ;
- vérification de `JSON.parse(raw).exercises.length === 1523` ;
- conservation intégrale de l'assertion indépendante sur le Git blob du **moteur V1**.

**Recette native : `node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js` → 107/107 PASS, code 0.**

**Contre-épreuves natives de la nouvelle protection, sur la véritable copie d'intégration :**

| Mutation de test temporaire | Résultat du garde-fou (5 tests M4) |
|---|---|
| Commentaire HTML purement visuel, sans changer le JSON | **5/5 PASS** |
| Modification d'un ID QCM dans le JSON | **4/5 PASS, 1 FAIL attendu, code 1** |
| Suppression totale du script `training-data` | **4/5 PASS, 1 FAIL attendu, code 1** |
| Modification de `quizz-parcours.js` | **4/5 PASS, 1 FAIL attendu, code 1** |
| Restauration des fichiers M3/M2 source | **5/5 PASS, code 0** |

Après restauration, les blobs des vrais HTML M3 et moteur M2 sont **identiques aux sources**. Tous les autres tests M4 historiques et recommandation restent couverts.

**Patch exact disponible** : `audits/wave2/pedagogie/P36_CORRECTIF_M4_INTEGRITE_NON_APPLIQUE.patch`. Il a été généré à partir des octets exacts de la source M4, vérifié avec `git apply --check`, **appliqué avec `git apply` dans la VM**, donnant le code **bit à bit identique à celui des tests 107/107** ; `node --test tests/wave2-recos-integrity.test.js` revient ensuite PASS. **Ne PAS appliquer depuis M1 à une branche tierce sans prise en charge M4/coordinateur**.

## 4. Raccordement CI et propriétaires

Un contrat de vérification a été communiqué à M5 issue #259 et à la PR d'intégration #269 :

```sh
node tests/wave2-pedagogie-suite.cjs
node tests/wave2-adaptatif-suite.cjs --quick
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js
```

À faire sous Node 22 **dans une branche d'intégration contenant toutes les sources M1/M2/M3/M4 et les fichiers M5**, avec logs et URL GitHub Actions reliés au SHA effectif. La suite M2 `--full` (12 étapes, déjà validée côté M2) n'est pas confondue avec les 7 contrôles rapides. La recette M3 Chromium/WebKit est actuellement vérifiée sur sa propre branche d'intégration et peut être réutilisée.

**Limites :**
- **Aucun run CI GitHub Actions ne prouve encore la suite M1 20/20** : toutes les exécutions M1 indiquées ici sont natives dans une VM temporaire. La réussite du run M3 ne peut pas être interprétée comme réussite CI M1.
- L'anomalie M4 actuelle est réellement bloquante sur les versions livrées **106/107**. Le patch correctif **107/107 est uniquement candidat**, transmis à M4 issue #258 et PR #262 ; M1 n'a pas écrit dans leurs branches.
- **17 décisions humaines M1 toujours PENDING** : 6 rédactions et 11 conventions ; bulletin `BULLETIN_17_ARBITRAGES_P29_HOLD.md`. Ni le 20/20 Node ni le 12/12 navigateur ne valident ces choix de pédagogie à la place du référent.
- Aucun QCM, code applicatif, workflow, main ni autre branche modifié ; PR M1 toujours brouillon. Aucune fusion, aucune publication.

**PASSE 36 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P37 uniquement si M4 intègre réellement ce correctif, si le raccordement CI M1 est exécuté sur GitHub Actions, ou si le référent répond aux 17 arbitrages — ne pas créer de nouveau cycle documentaire sans fait nouveau.**
