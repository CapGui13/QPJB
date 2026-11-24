# QPJB — Parcours guidé V1.10 : préserver les preuves du tableau de progression

## Anomalie reproduite (moteur V1.9)

Le module de consolidation V1.9 ne modifie plus les scores des micro-compétences ni les niveaux, mais il remplace encore `state.entries[id]` avec le dernier résultat d'entraînement. Le tableau V1.5 se servait de ce même dernier résultat pour attribuer la mention **« Acquis confirmés »**.

Scénario vérifié : trois familles d'ouvertures réussies sans aide, chacune sur une séance normale différente, puis une erreur sur une quatrième famille en séance normale : l'état passe à « À consolider ». Une réponse correcte à cette quatrième famille **pendant une consolidation** efface alors l'erreur du tableau et peut faire repasser la rubrique en « Acquis confirmés », sans nouvelle évaluation normale. Inversement, une erreur d'entraînement pouvait écraser une ancienne preuve réussie.

## Règle V1.10

Pour chaque QCM dans `state.entries` :

- Le résultat de premier niveau (`result`, `assisted`, `lastSession`, `seen`, `streak`, `due`) conserve la **dernière pratique**, utilisée pour les révisions et les compteurs des QCM vus.
- Un champ facultatif `assessment` mémorise le **dernier résultat évalué en séance normale** : `{result, assisted, lastSession}`.
- Une réponse en consolidation met à jour la dernière pratique mais **conserve l'évaluation antérieure** ; si aucune évaluation antérieure n'existe, `assessment` vaut `null`.
- Une réponse dans le parcours normal actualise à la fois la pratique et `assessment`.
- La mention « Acquis confirmés » utilise **uniquement les dernières évaluations des familles** sur au moins trois séances normales distinctes, avec les seuils de maîtrise déjà en place.
- Les compteurs « QCM vus, sans aide, aidés, erreurs, passés » restent fondés sur la dernière pratique, **y compris les consolidations**. Le texte d'aide du tableau explicite cette différence.

## Anciennes sauvegardes et limites

- Les anciennes entrées n'ont pas de champ `assessment`. Leur dernier résultat est utilisé **uniquement pour conserver l'interprétation historique du tableau** ; il n'est pas possible de reconstruire de façon fiable le mode de chaque ancienne réponse ni de corriger rétroactivement les mentions acquises à tort avant V1.10.
- Dès qu'une réponse normale est enregistrée, sa preuve est explicite et distincte. Une consolidation ultérieure ne la remplace pas.
- Le champ `assessment` d'une sauvegarde récente est validé à la lecture : résultat connu, date de séance entière, non négative et pas dans le futur par rapport à `completed`. Une preuve invalide est ignorée.
- **Clé de sauvegarde `qpjb-sef-parcours-01` et `version=1` inchangées**. Aucune perte d'historique ni migration destructive.
- Les contenus des **1 523 QCM**, leurs réponses, les justifications SEF, l'Entraînement et le Quiz libre sont inchangés. La sélection des séances et les bilans V1.8/V1.9 restent inchangés.

## Tests

1. Acquis confirmé après trois séances normales, puis erreur normale : passage à « À consolider ». Une correction en consolidation ne doit pas rendre « Acquis confirmés ».
2. Une réussite évaluée antérieure ne doit pas être invalidée par une erreur en consolidation.
3. Une nouvelle question vue seulement en consolidation ne constitue pas une preuve évaluée.
4. Sauvegarde/rechargement, preuve explicite et borne de validation.
5. Anciennes sauvegardes sans le nouveau champ : maintien du statut historique et de la progression.
6. Tests navigateur Chromium et WebKit : lecture réelle du badge après reprise/rechargement, sans modification des QCM.
7. Non-régression sur les 1 523 QCM, les 22 rubriques, les 25 micro-compétences, les 3 axes audités, le service worker PWA.

**Cache PWA : `qpjb-v94` ; module `quizz-parcours.js?v=12`.** Fusion et publication uniquement si tous les tests CI passent.
