# Cycle apprentissage durable — candidat intégré #396

## État
Six livraisons figées (110 blobs, sans conflit) ; voir manifest.json. Branche d'intégration indépendante, pas de fusion sur main ni publication. Le catalogue training-data est strictement identique au SHA de référence d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7 : 1915 QCM / 99 concepts / 22 rubriques. Les 5 propositions M4 et leurs métadonnées restent en réserve, aucun ajout éditorial non visé.

## Raccordements
- M1 : signaux locaux forts, uniquement après S20, catégories faibles/transfert, hors priorité, hors rappel explicite, départage à score historique égal. Force et fit en HOLD par prudence. Aucun nouveau filtre.
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
