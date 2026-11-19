# QPJB — Phase AG : reprise locale du prototype V2, préparation à l'intégration

**19 novembre 2026 · PR #214 · validation technique réussie · non déployé.**

## Objectif demandé

La progression pédagogique doit rester **entièrement automatique**, avec **10 QCM originaux par séance**, sans leçon écrite, bouton d'autorisation de l'enseignante ni exercice fabriqué. Le Rubensohl est introduit au plus tôt à la **35e séance**, conformément à la feuille de route existante.

L'ancien prototype autonome V2 conservait les résultats uniquement pendant la session de page : une actualisation du navigateur réinitialisait l'état. Avant de raccorder quoi que ce soit aux sauvegardes réelles des élèves, la phase AG prépare un **aperçu autonome distinct, capable de reprendre localement l'exercice en cours**.

## Livrable vérifié

**`parcours-v2-reprise.html`** est un fichier HTML autonome d'environ **1,2 Mo** construit par `scripts/parcours-v2-build-reprise-ag.cjs` et archivé dans l'artefact GitHub **`qpjb-v2-ag-autonomous-resume`**.

Le document d'origine **`preview/parcours-v2-autonome.html` reste inchangé**. Le générateur recopie ses données JSON, ses moteurs et ses **1 523 QCM** à l'identique ; il intervient **uniquement dans le script d'interface de la copie générée** pour y ajouter la sauvegarde/reprise. Aucune mise à jour des QCM, corrections, fichiers publics ou sauvegardes historiques.

### Ce qui est conservé localement

- Numéro de séance déjà terminée et état du moteur V2 (historique, familles, concepts, file de rappels, sélection précédente).
- Identifiants des dix questions actuellement sélectionnées, dans l'ordre exact du tirage.
- Réponses données pendant la séance, curseur de la question affichée, présence éventuelle d'une séance interrompue.
- Bilan de la dernière séance pour le restituer après rechargement.

Les données sont enregistrées uniquement dans le **`localStorage` du navigateur**, sous la clé séparée **`qpjb-preview-v2-ag-local-resume-v1`**. Cette clé est **différente de celle du site QPJB** ; il n'existe aucun import/export automatique avec les comptes élèves, et aucune requête réseau ajoutée. L'état sauvegardé n'est pas protégé par un mot de passe : **ne pas utiliser cette page sur un ordinateur partagé pour enregistrer des informations privées**.

### Protections

- La sauvegarde comporte un **identifiant de version** et une **empreinte du catalogue**, calculée à partir des identifiants, bonnes réponses et familles d'origine.
- Une reprise n'est acceptée que si la sauvegarde correspond à ce catalogue, si les dix identifiants existent et forment des familles distinctes, et si les choix retrouvés appartiennent aux choix d'origine.
- Un état périmé, corrompu, inconnu ou surdimensionné est refusé, puis ignoré ; **aucun résultat n'est inventé à partir d'une sauvegarde invalide**.
- Le bouton de **réinitialisation** efface également la sauvegarde expérimentale.
- Si le navigateur interdit le `localStorage`, l'aperçu conserve le comportement sans sauvegarde et affiche **« Sauvegarde locale indisponible »**. Il ne simule pas une reprise qui n'a pas eu lieu.
- Tout demeure hors ligne : **aucun transfert au site public, aucun compte utilisateur, aucun stockage sur serveur**.

## Essais automatiques et résultats

**GitHub Actions [#44512981377](https://github.com/CapGui13/QPJB/actions/runs/44512981377) : tous les jobs réussis.**

| Vérification | Résultat |
|---|---|
| Conservation des 1 523 QCM, des 79 annotations et des 19 cas signalés | **Conforme : données d'origine recopiées sans modification** |
| Algorithme / règle Rubensohl | **Automatique, sans approbation manuelle** |
| Reprise après réponse à la question 1 | **Réussie** |
| Reprise à la question 2, encore sans réponse | **Réussie** |
| Bilan de la séance 1 conservé | **Réussie** |
| Séance 2 conservée après rechargement | **Réussie** |
| Réinitialisation effaçant l'état local | **Réussie** |
| Refus d'une sauvegarde corrompue ou obsolète | **Réussi** |
| Navigateur sans stockage | **Fonctionnement de repli vérifié** |
| Chromium ordinateur / mobile | **Sauvegarde active, reprise réussie** |
| WebKit ordinateur / mobile | **Sauvegarde active, reprise réussie** |
| Requêtes HTTP externes / erreurs JavaScript / débordement horizontal | **Aucune** |

Les navigateurs ont été testés en **mode hors ligne** avec le document HTML local, et sur les deux formats d'écran. Les résultats ne prouvent ni une amélioration d'apprentissage, ni le fonctionnement de futures sauvegardes QPJB en production.

Les scripts correspondants sont :

- `scripts/parcours-v2-build-reprise-ag.cjs` : génération séparée sans écraser l'ancienne prévisualisation.
- `tests/quizz-v2-reprise-ag.cjs` : intégrité et reprise dans un navigateur simulé.
- `tests/quizz-v2-reprise-ag-browser.cjs` : essais réels Chromium et WebKit, ordinateur et iPhone simulé.
- `.github/workflows/qpjb-v2-ag-reprise.yml` : compilation, tests et archivage de l'HTML.
- `.github/workflows/training-smoke.yml` : test AG ajouté à la batterie générale de non-régression.

## Mode d'emploi du fichier de test

1. Télécharger l'HTML AG depuis l'artefact, puis l'ouvrir localement dans Chrome, Edge ou Safari.
2. Vérifier la mention **« Sauvegarde locale active sur cet appareil »** sur l'accueil ; sinon, le navigateur ne permet pas ici de garantir la reprise.
3. Démarrer une séance et répondre à une ou plusieurs questions.
4. Fermer/réouvrir **le même fichier depuis le même navigateur** ou actualiser la page : elle doit rouvrir la question en cours. Les réponses déjà données sont affichées sans nouvelle notation.
5. Terminer les dix questions ; le bilan puis la séance suivante doivent également reprendre.
6. Utiliser **« Tout réinitialiser »** pour repartir de zéro et effacer la sauvegarde de test.

La reprise fonctionne **localement**, pas entre plusieurs appareils ou navigateurs, et elle ne récupère pas le parcours V1.10 du site QPJB.

## Ce qu'il reste avant publication

La réussite technique AG **n'est pas l'intégration au site**. Il faut encore :

1. Déterminer et mettre en œuvre un mécanisme de sauvegarde **compatible avec l'état réel du compte QPJB**, sans écraser les données existantes ni faire passer une simulation pour une compétence acquise.
2. Raccorder l'interface V2 au site sous un mécanisme **réversible**, sans changer l'actuel parcours élève tant que la recette et les arbitrages des cas sensibles ne sont pas faits.
3. Tester la migration des anciennes sauvegardes, les reprises interrompues, les révisions et la navigation sur Windows/iPhone avant déploiement.
4. Examiner les **19 cas SEF signalés** : l'audit est une liste de précautions éditoriales, pas un changement ou une condamnation des corrigés.

**Décision : `AG_CI_OK / V2_AUTOMATIQUE / REPRISE_LOCALE_FONCTIONNELLE / 0_LECON / 0_QCM_MODIFIE / 0_DEPLOIEMENT / INTEGRATION_SITE_A_FAIRE`.**
