# QPJB — M1 / Passe 26 : contrôle des scripts oubliés dans la suite

**PASSE 26 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Défaut démontré et correction
Le garde-fou `tests/wave2-pedagogie-couverture-suite.cjs` vérifiait l'inventaire déclaré (19 scripts) et l'existence de chacun, mais **ne comparait pas l'inventaire aux fichiers réellement présents** dans `tests/`. Ajouter un `tests/wave2-pedagogie-non-reference-p26.cjs` hors du lanceur serait passé inaperçu. Le contrôle a été durci par `fs.readdirSync` et comparaison exacte, triée, à la liste des scripts attendus, à l'exception volontaire du lanceur `wave2-pedagogie-suite.cjs` lui-même. Les fichiers ne correspondant pas au préfixe `wave2-pedagogie-*.cjs` ne sont pas concernés.

Le nouveau `tests/wave2-pedagogie-inventaire-p26.cjs` crée un **faux dépôt isolé** et y exécute réellement sous **Node 22.16.0** le script de couverture (copié du code exact qui a été committé). Il vérifie :
- inventaire conforme : **PASS** ;
- **contre-épreuve de l'ancien garde-fou** : la suppression en mémoire de la vérification `readdirSync` laisse effectivement passer un test supplémentaire non déclaré ;
- nouveau garde-fou : le test supplémentaire déclenche **FAIL**, au lieu d'un faux succès ;
- fichier `README.txt` supplémentaire : **PASS**, sans faux rejet ;
- script déclaré absent du répertoire : **FAIL** ;
- restauration du script : **PASS**.

Les **trois fichiers techniques effectivement éprouvés** ont des blobs Git identiques entre le conteneur Node et GitHub :
`suite.cjs` : `b04107031b08f1ace583527e5d9740f7e645a11e` ;
`couverture-suite.cjs` : `adf926145bd29d2ff8e1c8db9c9ca9cb291c9630` ;
`inventaire-p26.cjs` : `dd8dd44333aaccd48e990da87592930a318e8512`.
Les **trois `node --check` : PASS** ; le test P26 natif : **PASS**.

## Confrontation GitHub
La consultation directe de l'arbre Git de l'état P25 montrait **20 fichiers** `tests/wave2-pedagogie-*.cjs`, dont **19 scripts dans le lanceur** et le lanceur lui-même : **0 oublié à la source**. P26 ajoute un test au lanceur et fait passer cet ensemble à **21 fichiers**, dont **20 tests référencés**.

## Limites et blocages
Le clone du dépôt demeure impossible depuis ce conteneur (résolution DNS `github.com` indisponible). **Ce PASS natif est celui du test d'inventaire P26 sur fixture**, et non une exécution des **20 véritables scripts pédagogiques sur l'ensemble du dépôt**. La suite complète sous Node et le raccordement GitHub Actions (qui relève de M5 sur branche d'intégration) ne sont pas attestés.

Les **6 clarifications et 11 accords** continuent à exiger une décision pédagogique humaine ; aucune réponse ni QCM n'a été modifié ni approuvé artificiellement. Aucun moteur, UI, workflow, autre branche, fusion ou publication touché.

**PASSE 26 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P27 uniquement si preuve Node/CI de la suite complète, arbitrage humain écrit, ou dérive réelle constatée.** Éviter d'ajouter des passes pour augmenter artificiellement le nombre de fichiers.
