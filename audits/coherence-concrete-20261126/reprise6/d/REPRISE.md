# REPRISE D — T/UI

- Contrat #506, mission #510, base 13966e475cf986c6f76e7faf870377fdf4ef99aa.
- Branche coherence-concrete/reprise6-d-t-ui ; cible coherence-concrete/coordination-generale ; aucune fusion.
- État : initialisation. T seule, sans M3 ni activation HOLD. Lecture REPRISE-PASSE-5 effectuée.
- Référence publiée (non réexécutée) : M6 S5 38→35, S20 100→97 ; D 40→37 et 96→93, dette 228622 inchangée.
- Tests de cette mission : aucun encore. PR : à créer.
- Prochain geste : identifier variante T et banc réel #503/#505, isoler raccordement et recette Chromium/WebKit, puis vérifier CI et substitutions.
- Décision : HOLD provisoire, preuves UI manquantes.

## Jalon 1 — raccordement isolé
- Commits cef1a07c72dba7e0479c8a4f79f0ec9ec1efc524 (T seule), 7ef6a2e277a5b2713acce4386bc1c1d2a781b28d (patch), 392409bf14b4bb172507356d21e9d40539290f17 (bootstrap corrigé).
- Le patch moteur à trois ancres reproduit exactement le moteur de #505 à partir du SHA de base (comparaison intégrale de chaînes exécutée). Le raccordement UI cible coherenceOptions(), sans M3 atomique ni modification des sources existantes. Bundle navigateur isolé, sans nouvelle URL de cache. Test de syntaxe/chargement du bootstrap sur modules factices exécuté, PASS.
- Catalogue réel accessible par blob a7a5989f85482f35cac16f1004b80c7c9b837c04 ; le connecteur Contents retourne vide pour ce gros HTML. #505 confirme trois événements directs S3 (autonome 11/47/103), SEF-005-2→SEF-005-1, même famille et réponse 2SA (21→20 H). À vérifier sur le candidat raccordé.
- Clone local refusé (DNS github.com indisponible). Aucun test navigateur ni run de cette mission à ce stade. Prochain geste : banc natif et recette navigateur (copie privée du site), vérification de chaque substitution, consolider et relever CI.

## Jalon 2 — bancs et PR
- PR principale [#512](https://github.com/CapGui13/QPJB/pull/512), brouillon vers coordination-generale, aucune fusion.
- Native appariée (D/M6, avec/sans consolidations) : tests/coherence-reprise6-d-native.cjs et -run.cjs, commits 068957f9ca803b72556361b9f0d7b506c0cada54 / 70c197da42c94f832dba0634b4446e655c8a2bd4 / 6cab1e6ca142dee0471546568e020af8ddf00f71. Contrôles de deck réel, conservation famille/enchère/éligibilité, traces, reprise active et consolidation sans preuve inventée. Comparateurs historiques adaptés T seule : -m6.cjs, -fnv.cjs, -gate.cjs (13e03bbfe6af17ec60d3aa4a8627e5b866684bbf, 32c75a8c32a631a49c7fc4f956e3fbe7fdead2bf, 6d567d4e5c5a70553ffd28837fd82529d97682dc).
- Recette privée navigateur : -stage.cjs (653c8ade9d6b0c63267ad42d3fab20b3785b21ab) et -browser.cjs (3b38c56099e8fce0ee6cb85c0584e8f3fe5c5b5e). Vérifie main affichée de SEF-005-1, stockage, journal, reprise offline, consolidation, quiz libre, legacy.
- Exécution locale bloquée par DNS; tentative de chargement intégral via JS connecteur arrêtée à sa limite d'appels, aucune simulation complète comptabilisée. Syntaxe des scripts comparateurs vérifiée (parse JS uniquement). Tentative bundle de dépendances non aboutie (erreur transport).
- Prochain geste : PR technique CI isolée selon exception #506, exécuter Chromium/WebKit et matrice, relever résultats. Aucun changement de workflow sur la branche principale D ni autre branche existante. HOLD.

## Jalon 3 — preuve native et première CI
- Test réel V8 : 26 modules CommonJS du dépôt chargés (code moteur patché exact, catalogue et prérequis réels, horloge fixée). Profil autonome/11, S5, D et M6, avec/sans demande de consolidation : 8 bras, 40 séances, 400 QCM, 32 reprises export/import ; aucun contrôle échoué. Les consolidations ne se déclenchent pas pour ce profil parfait (0), ne pas considérer ce test comme preuve de consolidation. Artefact permanent [native-smoke.json](native-smoke.json), commit 671115d6111fe5d0e702d4379ca8c6e8ce7c5563.
- Paires proches S5 : 4→3 pour chacun des deux modèles. Substitution S3 SEF-005-2 (21H)→SEF-005-1 (20H), même famille cas-005, réponse 2SA, difficulté 1, même distribution 3-3-4-3, même contexte et prérequis, coût moteur nul ; SEF-004-1 (21H, 4-3-3-3) reste au deck. Le doublon de force/distribution normalisée disparaît en S3, sans supprimer l'exemple 21H. T conserve 9 autres IDs, l'ordre complet est recalculé (positions de la question 7→6).
- PR technique séparée [#513](https://github.com/CapGui13/QPJB/pull/513), branche neuve coherence-concrete/reprise6-d-ci-isolee, workflow seul, jamais à fusionner. Run [46016213848](https://github.com/CapGui13/QPJB/actions/runs/46016213848) : 18 jobs natifs en cours, 2 navigateurs échoués au sélecteur .meta non unique (la main T affichée et la reprise jusqu'à cette étape ont passé). Correctif strict #body .meta sur D bd336efb275e330df2cb667b9a7b4c9d99b02969 et branche technique 8905bbd91d2fa0ae8b4c62eb4b9050d1f15fbd71. Run de reprise [46016521917](https://github.com/CapGui13/QPJB/actions/runs/46016521917) en file. Aucun PASS navigateur complet à ce stade.
- Prochain geste : contrôler les jobs de chaque run, corriger uniquement les erreurs de recette, vérifier consolidations réelles et conserver les résultats par profil. Décision HOLD jusqu'aux preuves complètes.
