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
