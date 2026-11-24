# Recette progression guidée — M3 (#296)
Référence immuable : 96c0f7962c14e74429fa12871d687efa0e8a94bd, deux blobs exacts copiés sans modification, hors site public.
- `node tests/progression-guidee-recette.cjs --selftest` : contre-épreuves du banc.
- `node tests/progression-guidee-recette.cjs --baseline` : 30 trajectoires historiques + une spécifique Passe ; vérification des 30 goldens originaux.
- Après intégration M1+M2 : `node tests/progression-guidee-recette.cjs --candidate`. Même catalogue, graines, profils. Code 1 pour écarts bloquants. `--profile autonome` etc. permet parallélisation ; `--out chemin.json` fixe le rapport.
- Exécuter aussi les suites historiques, Chromium/WebKit et contrôles FULL existants. Le workflow M3 ne publie rien. La recette globale appartient au pilote.
- Notes sur trous des fondamentaux, couverture dont prérequis non découverts, diversité contextes/décisions, délais d'erreur et taux de rappel : à examiner, pas à effacer. S1–S3, éligibilité indépendante et moteur, familles, difficulté avant fondamentaux, découverte SA, variété autonome et régression majeure de difficulté des faibles sont bloquantes.
- Une exposition = une question présentée dans une séance antérieure ; le compteur indépendant ne prétend pas établir la maîtrise. Les anciennes preuves sont vérifiées par les tests historiques et les tests de sauvegarde/consolidation.
- Les goldens historiques et leurs empreintes ne sont pas réécrits.
- L'archive reconstruit l'inventaire à la même révision, compare SHA-256 de chaque fichier, sept alias, ZIP REST et tar runtime. Aucun verrou production modifié.

- Recette hors ligne intégrée : construire `_public_site` par le builder puis lancer `PW_BROWSER=chromium node tests/progression-guidee-offline.cjs _public_site` et WebKit. La première visite du Quiz se fait hors ligne, après préchauffage depuis l'accueil ; aucune publication.
