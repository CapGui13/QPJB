# M1 — Classification conservatrice (#282)

Base d'inventaire : cffac8d53ce5fc5bdb2d08f0b0b028253cb11ae3. Arbre Git récursif non tronqué : 900 entrées, 93 PBN directement dans 15 répertoires de séance, 7 images directement dans Docs ; deux CSS partagés autorisés. Sources lues : scripts/build_catalogue.py et scripts/build_public_site.py. Le constructeur public accepte les PBN suivis, images catalogue et alias explicites (7), ressources CORE/TRAINING, images launch et entrainement/assets ; ces dernières restent FULL. Les dossiers de séance observés sont Séance 0-01 Mumu, Séance 1-01 à 1-10 Aix, Séance 2-01 à 2-04 Aix. La convention stricte autorise de futures séances Aix/Mumu sans accepter des dossiers génériques. Aucun SVG, marqueur .seance-vide ou JSON généré en QUICK ; M2/M3 doivent prouver toute extension.

DOC_ONLY : trois rapports techniques historiques relus intégralement, audits/wave2/ux/PASSE_14_COMPARAISON_VISUELLE.md, audits/wave2/recommandations/PASSE25_RETRAIT_LANCEUR_NODE22_20261121.md, audits/wave2/ci/PASSE_9_PREUVES_HORODATEES.md ; modification uniquement, aucune référence textuelle suivie au radical du nom (sans extension, insensible à la casse, hors fichiers M1 exacts). Aucun n'est dans la liste publique ni un alias ; si une référence est trouvée, FULL avec les chemins en raisons. Le premier rapport pédagogique audits/REVUE_20_SOUTIENS_MAJEURS_2026-11-04.md a été écarté : la recette réelle P2 a révélé une référence, donc le niveau FULL était correct. Aucun registre, README, rapport nouveau ou renommage admis. UI : uniquement qpjb-bridge-ui.css et qpjb-design-tokens.css. QUICK : images raster et PBN directs, modes 100644 seulement, deux chemins en cas de renommage/copie. La lisibilité réelle du contenu est à vérifier par M2 ; le niveau n'est pas une autorisation de publication.

Commande : node scripts/ci-classify.cjs --base SHA --head SHA. JSON stdout, erreurs stderr + code non nul sans plan. Schéma QPJB_CI_PLAN_V1 (champ schema), baseSha/headSha complets, level, publish, changes (status Git brut, ex R100 avec path destination et oldPath source), reasons. Diff net exact, inspection supplémentaire des commits nouveaux pour ne pas sous-classer un changement sensible ensuite annulé. Base non ancêtre, dépôt shallow, collision casse/Unicode, diff vide ou plus de 256 commits : FULL. SHA absent, objet non commit, échec Git ou UTF-8 invalide : erreur bloquante. M3 reste responsable de l'attestation de la base et des jobs exacts.

Exemple de forme (SHA fictifs, pas une preuve) :
```json
{"schema":"QPJB_CI_PLAN_V1","baseSha":"1111111111111111111111111111111111111111","headSha":"2222222222222222222222222222222222222222","level":"QUICK","publish":true,"changes":[{"status":"A","path":"Docs/Nouveau cours.png"}],"reasons":["A Docs/Nouveau cours.png: allowed QUICK path"]}
```

Preuves à exécuter : node --test tests/ci-classify.test.cjs ; workflow isolé M1 sur la branche assignée (checkout complet, aucune publication). Le rapport final consignera les résultats observés et non des PASS supposés.

## Preuve initiale et seconde passe

Run réel [45359201644](https://github.com/CapGui13/QPJB/actions/runs/45359201644), job 138324609373, SHA 4ce1c63c5b009d1e5dd1253005a21f5d2d5a7900 : **81 tests / 81 passés, 0 échec, 0 ignoré**, durée native 4958,114541 ms ; run terminé success (08:47:28–08:47:47 UTC). Plan réel FULL sur les 4 fichiers M1, headSha exact. PR brouillon [#286](https://github.com/CapGui13/QPJB/pull/286).

Seconde passe : forcer --ignore-submodules=none (une configuration locale ne doit pas masquer un gitlink), bloquer le lazy fetch, tests supplémentaires sur références historiques préexistantes, mélange de niveaux, gitlink modifié avec ignore=all, absence de mutation du checkout/index, renommage et merge d'une branche ayant annulé un changement sensible. Vérifier en plus les 100 chemins de cours réels et six plans sur des commits synthétiques dans un clone jetable du dépôt réel, sans push ni modification des sources. Les résultats de cette passe seront consignés dans #282 à son SHA exact.

## Anomalie réelle P2 et correction

Run [45359399940](https://github.com/CapGui13/QPJB/actions/runs/45359399940), SHA b202dadd15fe13355849999b83cb29525e4af1eb : 94 tests, 93 réussis, 1 échec de l'hypothèse DOC_ONLY sur le rapport pédagogique. Le classificateur a correctement renvoyé FULL (rapport non isolé) ; les 100 chemins et cinq autres plans réels ainsi que les 87 tests natifs ont réussi. Rapport exclu, trois rapports techniques historiques explicitement relus, garde renforcée sur le radical et la casse ; aucune exception pour ignorer une référence réelle. Test réel de chaque candidat et contre-exemple du rapport exclu. La prochaine CI doit être verte avant clôture.
