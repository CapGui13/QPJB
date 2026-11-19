# QPJB — Phase AJ : navigation V1 ↔ V2 en prévisualisation, sans déploiement

**19 novembre 2026 · PR #214 · branche uniquement · validation technique ciblée réussie.**

## Décision produit

Le nouveau parcours doit rester **100 % questions**, avec la progression **automatique** du plus simple au plus complexe, **sans cours écrit** et **sans autorisation manuelle de l'enseignante**. Rubensohl reste éligible dans le simulateur au moment prévu par la progression, à partir de la séance **35**.

L'objectif AJ est de **raccorder réellement la navigation de QPJB** à une page V2 testable, tout en rendant la bascule totalement facultative, sans toucher aux résultats déjà enregistrés par V1 et sans déployer la branche.

**Les fichiers de la page publique ont été modifiés dans la branche de la PR, PAS sur la branche principale ni sur le site en ligne.** Il faut garder cette distinction jusqu'à la publication.

## Implémentation sur la branche de test

| Fichier modifié ou ajouté | Fonction |
|---|---|
| \`preview/v2-ai/parcours-v2-cohabitation.html\` **ajouté** | Vraie page HTML V2 servable depuis QPJB, calculée à partir du générateur AI. Les **1 523 QCM** et les moteurs sont conservés comme dans l'aperçu validé |
| \`quizz.html\` **modifié sur la branche** | Ajoute un lien « Tester le parcours V2 (prévisualisation) », **caché par défaut** ; seul \`?v2preview=1\` le révèle. Lien \`./preview/v2-ai/parcours-v2-cohabitation.html\`, dans un **nouvel onglet** \`rel="noopener noreferrer"\` |
| \`index.html\` **modifié sur la branche** | Quand l'accueil reçoit \`?v2preview=1\`, cette valeur est transmise à l'iframe Quiz SEF existante. Sans ce paramètre, le Quiz ne reçoit aucune option supplémentaire |
| \`tests/quizz-v2-switch-aj.cjs\` **ajouté** | Vérifie le comportement masqué par défaut, la présence réelle du fichier statique, la concordance **octet pour octet** avec \`AI.build\`, les **1 523 QCM originaux**, et l'absence de leçons ou verrou |
| \`tests/quizz-v2-switch-aj-browser.cjs\` **ajouté** | Vérifie la navigation **accueil → Quiz intégré → lien test → V2 → Quiz classique** et la reprise/réinitialisation des données sur des navigateurs réels |
| \`.github/workflows/qpjb-v2-aj-navigation.yml\` **ajouté** | Pipeline dédié de non-régression, tests Node + Chromium/WebKit sur ordinateur et iPhone |
| \`.github/workflows/training-smoke.yml\` **modifié** | Inclut le test AJ au contrôle général d'intégrité |

**L'accès à V2 n'est pas proposé automatiquement aux élèves.** Un joueur qui ouvre QPJB normalement continue à voir le Quiz existant. La page V2 est cependant présente sur la branche et peut être ouverte **directement par son adresse** lors de l'essai ; ce n'est pas un mécanisme d'autorisation sécurisé et il ne doit pas être présenté comme tel.

## Comment tester la navigation (pour une personne disposant de la branche)

1. Servir localement la branche \`audit/parcours-v2-sa-stayman-phase-c-20261118\` sous un chemin \`/QPJB/\`. Exemple : depuis le **dossier parent de QPJB**, lancer \`python -m http.server 8000\`.
2. Ouvrir **\`http://localhost:8000/QPJB/index.html?v2preview=1\`** dans un navigateur.
3. Cliquer sur **Quizz**, puis dans sa section *Mon parcours guidé* sur **Tester le parcours V2 (prévisualisation)**.
4. Un nouvel onglet ouvre la page V2, sur **le même domaine local** ; la sauvegarde V2 fonctionne indépendamment sous \`qpjb-sef-parcours-v2-01\`.
5. Répondre, actualiser, poursuivre, puis cliquer sur **Retour au parcours classique**. La progression classique \`qpjb-sef-parcours-01\` et les réponses historiques \`qpjb-sef-entrainement-01\` restent inchangées.
6. Revenir sur V2 et utiliser **Tout réinitialiser** : seule la sauvegarde V2 est effacée.
7. Ouvrir **\`http://localhost:8000/QPJB/index.html\` sans paramètre** : le lien V2 est invisible. C'est le fonctionnement par défaut.

**Attention :** un fichier HTML téléchargé et ouvert directement en \`file://\` ne partage **pas** le stockage du domaine QPJB et ne peut donc pas montrer les sauvegardes réelles de QPJB. Pour essayer la cohabitation il faut servir les pages ensemble, depuis une **même origine web**. Les tests automatisés utilisent un serveur local dédié.

## Contrôles et résultats

La [CI dédiée AJ #44525493613](https://github.com/CapGui13/QPJB/actions/runs/44525493613) a été exécutée **après correction de deux assertions de test** et les **trois jobs ont réussi** :

- **Intégrité Node :** page V2 statique **identique à la sortie du générateur AI**, 1 523 QCM originaux et leurs réponses inchangés, liens cachés sans \`?v2preview=1\`, JS syntaxiquement valide et données V1 intactes.
- **Chromium, ordinateur et mobile :** \`default-hidden index-flag=OK V1-unchanged V2-restart=OK\`.
- **WebKit, ordinateur et mobile :** \`default-hidden index-flag=OK V1-unchanged V2-restart=OK\`.

Les tests sont faits sur le **véritable \`index.html\` et \`quizz.html\` de la branche** avec un **serveur local**, pas sur une simulation purement visuelle. Le mode V2 est déclenché en ouvrant explicitement \`?v2preview=1\`. Les deux clés du Quiz SEF classique sont initialisées avec un historique fictif, puis leur valeur est vérifiée **strictement identique** après passage en V2, réponses, navigation, rechargement et remise à zéro de V2.

Le contrôle général *QPJB Training smoke* est distinct : une réussite de la CI AJ ne garantit pas à elle seule que **tous** les tests généraux du site sont verts.

## Limites restant à lever

- **Aucun déploiement** de la branche PR #214 n'a eu lieu. La page V2 n'est donc pas accessible par le lien normal du site QPJB actuellement en ligne.
- Ce raccordement **opt-in** n'est pas encore la bascule par défaut. Avant publication, il faudra décider quelle présentation adopter dans la navigation publique et conserver la possibilité de retour à V1.
- **Aucune migration automatique V1→V2** n'est implémentée : ne pas copier les preuves de maîtrise V1 dans des catégories V2 dont le sens diffère.
- Le fonctionnement des sauvegardes est **local au navigateur**, comme pour le Quiz existant. Aucune synchronisation entre appareils ni compte utilisateur n'a été créée.
- Les **19 cas éditoriaux signalés** restent à examiner ; ils ne changent pas les corrigés du catalogue.
- Les mini-leçons AB–AE restent **hors parcours**, ni exigées ni intégrées.

**Statut : \`AJ_NAVIGATION_OPT_IN_OK / 1523_QCM_IDENTIQUES / V1_READ_ONLY / V2_SAUVEGARDE_SEPAREE / 0_LECON / 0_VALIDATION_MANUELLE / 0_DEPLOIEMENT\`.**
