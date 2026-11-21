# LONG M3 — PASSE 13 : recette multi-navigateurs non interrompue au premier échec

Base : `7acda9c57029166f57a62a43569a4ab2e971285b`, branche `wave2/experience-eleve-20261121`.

## Défaillance réelle d'observabilité (avant)
Le scénario `tests/wave2-ux-browser.cjs` enchaînait sept chemins fonctionnels dans un seul bloc `try`. Le moindre échec (par exemple une assertion au premier écran 320px) arrêtait tout le processus et empêchait d'observer le reste des parcours **et WebKit**. Un résultat partiel était alors insuffisant pour guider les corrections.

## Correction
- Nouveau `tests/wave2-ux-plan.cjs` : orchestre les scénarios indépendants, capture résultat, message d'erreur et durée de chaque cas, **poursuit les suivants en cas d'échec**, puis calcule un bilan non ambigu.
- `tests/wave2-ux-browser.cjs` : sept scénarios nommés par moteur (320px, 390px, tactile, sélection vide, clavier, reflow et paysage). Le démarrage d'un navigateur qui échoue n'empêche pas les autres moteurs de démarrer. Le résultat agrégé reste **en échec** dès qu'un seul scénario ou lancement échoue.
- Fichier `artifacts/wave2-ux/rapport-m3-*.json` produit à l'exécution, avec les résultats détaillés et les durées. Les captures existantes sont conservées ; aucune capture n'est inventée ici.
- `tests/wave2-ux-plan-test.cjs` ajouté au runner avant Playwright, pour garantir « succès → échec simulé → succès ».
- Le runner exécute dorénavant **5 étapes** : contrats, focus, orchestrateur, Chromium, WebKit.

## Contre-épreuve réellement exécutée
La fonction du module d'orchestration exact a été exécutée dans le runtime JavaScript : 3 cas (succès, échec injecté, succès) ont produit **2 réussites, 1 échec correctement enregistré, et la troisième épreuve n'a pas été omise**. Syntaxe des quatre scripts vérifiée. Aucun fichier de production, sauvegarde ou QCM modifié par cette passe.

Les cinq workflows GitHub du commit P11 étaient tous verts, dont Chromium/WebKit historiques. Le runner M3 et ses nouveaux parcours ne sont toujours **pas exécutés** dans une CI autorisée : cette mesure locale vérifie l'orchestration, pas la compatibilité navigateur.

**PASSE 13 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P14 — préparer preuves comparatives et diagnostic de recette, puis exécution en Playwright dès qu'un checkout du HEAD est disponible.**
