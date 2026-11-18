# Prévisualisation du parcours QPJB V2 — hors production

Le fichier **[parcours-v2-autonome.html](./parcours-v2-autonome.html)** est une page web **entièrement autonome** : aucun serveur, aucune API, aucune installation et aucun fichier annexe.

## Comment la tester sous Windows

1. Ouvrir `preview/parcours-v2-autonome.html` dans la branche GitHub de la [PR #214](https://github.com/CapGui13/QPJB/pull/214).
2. Cliquer sur **Raw / Télécharger le fichier brut**, puis enregistrer le document localement avec son extension **.html** (pas .txt).
3. Double-cliquer sur le document enregistré pour l'ouvrir dans Chrome, Edge ou Firefox.
4. Choisir **Parcours de 10 QCM** pour jouer plusieurs séances avec les vraies mains et réponses du catalogue; ou **Cas à arbitrer** pour parcourir 19 situations sensibles.

Les séances suivantes dépendent des réponses entrées **durant cette ouverture du navigateur**, et le simulateur utilise les règles candidates de rappels espacés. La page n'est pas le site QPJB, ne charge aucune ressource réseau et n'écrit pas de données persistantes. Fermer ou actualiser la page réinitialise la progression expérimentale.

## Contenu et limites

- 1 523 exercices Quiz SEF copiés **sans modification du contenu** (énoncé, séquence, main, réponse, explication).
- 79 annotations candidates (14 Sans-Atout + 65 Stayman/Texas).
- 19 alertes éditoriales **à vérifier** ; aucune alerte n'est une condamnation automatique d'un corrigé.
- Moteur V1.10 intégral utilisé pour les fonctions de référence + sélection V2-G expérimentale, embarqués dans la page.
- **Pas d'intégration** avec le compte de l'élève, la notation officielle, le site public, le module Entraînement ou les sauvegardes existantes.
- Les 25 micro-objectifs Stayman/Texas ne sont pas validés par la seule génération de cette page. Les notions couvertes par un seul exercice ne donnent pas de maîtrise.

## Tests de non-régression

Le test automatisé `tests/quizz-v2-preview.cjs` vérifie l'identité des 1 523 QCM avec la source, les 79 propositions, les 19 alertes et un parcours complet de dix QCM en navigateur simulé. Le simulateur dispose de tests distincts pour les rappels et la diversité des séances.

**Ne pas fusionner cette prévisualisation vers le site élève sans arbitrage pédagogique.**
