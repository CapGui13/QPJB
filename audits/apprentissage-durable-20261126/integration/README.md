# Cycle apprentissage durable — candidat intégré #396

## État
Six livraisons figées (110 blobs, sans conflit) ; voir manifest.json. Branche d'intégration indépendante, pas de fusion sur main ni publication. Le catalogue training-data est strictement identique au SHA de référence d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7 : 1915 QCM / 99 concepts / 22 rubriques. Les 5 propositions M4 et leurs métadonnées restent en réserve, aucun ajout éditorial non visé.

## Raccordements
- M1 : signaux locaux forts, uniquement après S20, catégories faibles/transfert, hors priorité, hors rappel explicite, départage à score historique et strate pédagogique identiques (thème, concept, stade, difficulté, contexte, réponse, catégorie, nouveauté et état de rappel). Force et fit en HOLD par prudence. Aucun nouveau filtre.
- M2 : après réponse du parcours guidé uniquement. Corrigé canonique et remédiation ciblée historique prioritaires ; nouveau feedback si hypothèse signée et valide. Aucune modification du Quiz libre.
- M3 : bilan descriptif hors séance, révision calendaire seulement en départage de maintenance. Horloge injectée. Pas de crédit automatique ni de maîtrise certaine.
- M4 : 77 paires intercontextuelles revues d'IDs historiques, vérifiées par le module de liens et fournies à M3 ; preuve autonome requise, pas d'ajout de QCM ou de bonus spécifique.
- M5 : espace facultatif en accueil, découverte, relecture, rappel, exemples et mini-vérifications non notés, indisponible dès qu'une séance est active (même reprise). Aucun stockage ou score de leçon.
- M6 : laboratoire et recette CI, jamais chargé dans le build public.
- Journal : champ facultatif firstGuess si une première enchère réellement erronée a été saisie et au format reconnu. Aucune invention sur anciennes sauvegardes. Aucun changement de version de stockage ; test de chargement, export/import et rejet des valeurs invalides.
- Cache v103 et version moteur 19 ; 7 scripts ajoutés à la liste publique et au warmup, aucun fichier de laboratoire/audit public.

## Contrôles effectués
- V8, sources réelles récupérées par SHA, contrat de façade puis contrat après raccordement : 5964 assertions PASS, 2794 options ciblées en tout dont 2654 nouvelles par rapport au professeur historique, 77 paires retenues, 4 leçons initiales. Le code de la recette est tests/durable-integration-contract.cjs.
- V8, tests/durable-integration-evidence.cjs : 21 assertions PASS, reprise et export/import du champ optionnel.
- Contrôle statique M6 : 20 ressources locales, 0 échec d'alignement HTML/cache/build, aucune exposition du laboratoire. Le payload du catalogue est identique octet pour octet en texte UTF-8.
- Le DNS du conteneur ne résout pas github.com ; checkout natif complet local et navigateurs non attestés dans cette reprise. Les contrôles Node/Chromium/WebKit doivent être exécutés sur le candidat exact via la CI. Ne pas confondre script écrit, résultat archivé par une mission antérieure et exécution vérifiée du candidat.

## Recette bloquante
Workflow durable-learning.yml : contrats natifs, garde-fous du laboratoire, ancien export, inventaire de tailles et paire rapide ; 6 profils × 3 graines S180, sensibilité, scénarios sémantiques ; Chromium/WebKit, mobile et bureau, progression hors ligne et reprise, performance. Pas de publication. Les seuils de comparaison et invariants restent ceux de M6, sans les assouplir. Toute alerte de régression est à analyser et à corriger avant validation.

## HOLD restants
M1 : force/fit non activés, validation comparative des ciblages. M2 : abstentions et options HOLD restent sans nouvelle remédiation ; 4 contrastes à arbitrer. M3 : calibration calendrier et limites des horodatages. M4 : 5 ajouts non activés ; revue éditoriale exhaustive non établie. M5 : revue historique externe exhaustive non attestée ; pas de garantie pédagogique humaine. M6 : campagnes natives et navigateur à vérifier, pas de résultat humain revendiqué. Aucun déploiement.

## Contre-épreuve native du premier candidat
Run 45890521468, tête ed6bddbe7774f86585e642e85a4563d1a3b7d512 : quick, Chromium, WebKit, sensibilité, 3 scénarios sémantiques et 17/18 trajectoires S180 réussis. L'unique alerte, cible/11, concerne la dette fondamentale à S153 (297 → 372) et S180 (353 → 445). Aucune violation structurelle. Première différence d'ordre S48 ; premier changement du jeu de QCM S54. Le seuil M6 n'est pas modifié. Le second candidat conserve le gagnant historique hors de sa strate et teste uniquement les égalités strictement équivalentes. Toute la recette est rejouée. Pas de preuve de gain humain.


## Synchronisation finale — 26 novembre
Six têtes finales : m1 22b752ef5715ab135a7a05dfca04a0defe9d937c; m2 d94b4741c95e29d2b86c33f1d489dd8d3a4c5e99; m3 2f1cfd5b97ae4710093c01f9bfb5c428c46f548a; m4 33dced838f5dca94e855c27b2314e937af649a51; m5 c2ded86b57bd9eda6006f3c085d298d6a86451a3; m6 b0f325255a3a8e3c8d9a2655287306c21200e2eb. 269 blobs sources inventoriés ; adaptation de l'inventaire M6 maintenue. M1 : garde de consolidation ajouté avant tout signal, conservation du départage strict et HOLD force/fit. M2/M5 : modules finaux exacts. M4 : seules les 22 sondes historiques strictes sur 34 concepts du registre final sont transmises à M3, sans crédit automatique ; les 28 propositions et 11 paires supplémentaires restent en visa séparé. M3 : modèle inchangé, classement large non activé. Catalogue strictement identique ; cache v104 et scripts durables v2. Les preuves natives autonomes sont synchronisées mais la recette intégrée finale doit être rejouée. Aucune fusion main.
