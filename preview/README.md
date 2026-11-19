# Prévisualisation du parcours QPJB V2 — hors production

Le fichier **[parcours-v2-autonome.html](./parcours-v2-autonome.html)** est une page web **entièrement autonome** : aucun serveur, aucune API, aucune installation et aucun fichier annexe.

## Comment la tester sous Windows

1. Ouvrir `preview/parcours-v2-autonome.html` dans la branche GitHub de la [PR #214](https://github.com/CapGui13/QPJB/pull/214).
2. Cliquer sur **Raw / Télécharger le fichier brut**, puis enregistrer le document localement avec son extension **.html** (pas .txt).
3. Double-cliquer sur le document enregistré pour l'ouvrir dans Chrome, Edge ou Firefox.
4. Choisir **Parcours de 10 QCM** pour jouer plusieurs séances avec les vraies mains et réponses du catalogue; ou **Cas à arbitrer** pour parcourir 19 situations sensibles.

Les séances suivantes dépendent des réponses entrées **durant cette ouverture du navigateur**, et le simulateur utilise les règles candidates de rappels espacés. Les questions de **révision programmée** sont signalées pendant la séance et leur nombre apparaît dans le bilan. Tu peux ouvrir **Cas à arbitrer** puis revenir au parcours sans perdre la réponse ou la question en cours, y compris après avoir répondu à la dixième question avant validation du bilan. La page n'est pas le site QPJB, ne charge aucune ressource réseau et n'écrit pas de données persistantes. Fermer ou actualiser la page réinitialise la progression expérimentale.

## Contenu et limites

- 1 523 exercices Quiz SEF copiés **sans modification du contenu** (énoncé, séquence, main, réponse, explication).
- 79 annotations candidates (14 Sans-Atout + 65 Stayman/Texas).
- 19 alertes éditoriales **à vérifier** ; aucune alerte n'est une condamnation automatique d'un corrigé.
- Moteur V1.10 intégral utilisé pour les fonctions de référence + sélection V2-G expérimentale, embarqués dans la page.
- **Pas d'intégration** avec le compte de l'élève, la notation officielle, le site public, le module Entraînement ou les sauvegardes existantes.
- Les 25 micro-objectifs Stayman/Texas ne sont pas validés par la seule génération de cette page. Les notions couvertes par un seul exercice ne donnent pas de maîtrise.

## Tests de non-régression

Le test automatisé `tests/quizz-v2-preview.cjs` vérifie l'identité des 1 523 QCM avec la source, les 79 propositions, les 19 alertes, la reprise d'une question interrompue et une séance complète en navigateur simulé. Le test `tests/quizz-v2-preview-browser.cjs` vérifie aussi le rendu réel et la navigation hors-ligne avec Chromium et WebKit, en formats ordinateur et iPhone. Le simulateur dispose de tests distincts pour les rappels et la diversité des séances.

**Ne pas fusionner cette prévisualisation vers le site élève sans arbitrage pédagogique.**


## Nouvelle version de test AG : reprise après fermeture ou actualisation

Une **variante autonome et distincte** est désormais générée par `scripts/parcours-v2-build-reprise-ag.cjs` : **`parcours-v2-reprise.html`**, disponible dans l'artefact GitHub Actions **`qpjb-v2-ag-autonomous-resume`** ([validation navigateur #44512981377](https://github.com/CapGui13/QPJB/actions/runs/44512981377)).

**Contrairement au fichier de prévisualisation initial**, la variante AG conserve la progression dans le stockage **local du navigateur**. Les tests ont confirmé la reprise après rechargement en question 1, question 2, après le bilan et au début de la séance suivante, sur Chromium/WebKit ordinateur et mobile.

Pour l'utiliser : télécharger l'HTML AG, l'ouvrir **dans le même navigateur et depuis le même emplacement**, vérifier la mention « Sauvegarde locale active », puis commencer une séance. Si le navigateur interdit ce stockage, un avertissement indique que la reprise peut être indisponible. **Réinitialiser** efface la sauvegarde expérimentale. Aucune sauvegarde du site QPJB n'est lue ou modifiée.

**Important :** les explications précédentes sur la perte de progression à la fermeture concernent uniquement le **fichier historique `parcours-v2-autonome.html`**, laissé inchangé. La variante AG reste un outil d'essai, hors production, avec les 1 523 QCM originaux, sans leçon, sans intervention de l'enseignante et sans déploiement.

Voir `Docs/PARCOURS_V2_PHASE_AG_REPRISE_LOCALE_20261119.md`.

## Coexistence avec le vrai Quiz SEF : phase AI

Le candidat d'intégration de la phase AI est **un troisième fichier HTML distinct**, généré par `scripts/parcours-v2-build-cohabitation-ai.cjs` dans `artifacts/v2-ai/parcours-v2-cohabitation.html`, archivé par GitHub Actions sous **`qpjb-v2-ai-cohabitation`**. Il ne remplace pas `quizz.html` et n'est pas publié sur le site.

Lorsqu'il est servi depuis **le même domaine web que QPJB**, il affiche à titre d'information le nombre de séances du parcours classique (clé `qpjb-sef-parcours-01`, **lecture seule**) et propose un lien **Retour au parcours classique**. La progression V2 est stockée sous sa propre clé `qpjb-sef-parcours-v2-01`. **Réinitialiser V2 n'efface ni la progression V1, ni l'historique des réponses au Quiz SEF** (clé `qpjb-sef-entrainement-01`). Aucune note ou réussite V1 n'est convertie en compétence V2.

**Attention :** téléchargé directement en `file://`, ce fichier ne partage pas l'espace local du navigateur avec le site QPJB. Il affiche donc un message d'avertissement et masque le lien de retour relatif. La cohabitation réelle se teste sur une même origine web (comme dans les tests automatisés).

La validation [GitHub Actions #44516601579](https://github.com/CapGui13/QPJB/actions/runs/44516601579) a réussi les tests d'intégrité et de navigation V1 ↔ V2 sous Chromium et WebKit en formats ordinateur et iPhone. L'implémentation et ses limites sont détaillées dans `Docs/PARCOURS_V2_PHASE_AI_COHABITATION_20261119.md`.

**Aucune modification des 1 523 QCM, de la progression du Quiz SEF public ou des sauvegardes réelles des élèves.** La recette d'intégration finale et une publication réversible restent à préparer.
