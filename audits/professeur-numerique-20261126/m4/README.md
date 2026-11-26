# M4 — Remédiation ciblée (#386 / #390)

Base immuable `f8ae2120eb893c68b4cac315b7901ece69806b87`, blob catalogue 99049d0d5790767ba991414240aa7d837c1b188e ; prérequis a0333a153c274ab49f8e355c4695f8116b50d967. Lecture des contrats #293, #366–369, #375, #377–381, #385, référentiel SEF et arbitrages du 5 novembre ; inspection du catalogue embedded, de quizz-parcours.js (record, finish, exportProgress, load), de finalizeAnswer, submitFreeAnswer, render dans l'UI et des tests de contenu/live. Aucun nouveau choix ou corrigé.

## Cartographie et objectifs
1879 QCM, 22 rubriques, 99 concepts, 5637 mauvaises options. Le corrigé actuel est identique quelle que soit l'erreur ; le journal réel contient id, result, choice, assisted, hadFreeError, family, micro, mais pas la première enchère libre dans le journal V1. L'UI la conserve pendant l'essai, pas nécessairement lors de la reprise. Les anciens exports ne permettent pas de reconstituer les décisions. Objectifs : 100 % de corrigés intacts ; 100 % de réussites autonomes sans supplément ; 100 % de diagnostics inconnus en repli ; au moins un scénario ciblé par rubrique, sans quota artificiel d'options ; maximum 45 mots additionnels hors rappel de répétition ; 20 000 appels ciblés <5 s ; pas d'usage des données réelles d'élèves.

## Production
- UMD `QPJBRemediation`, schema QPJB_REMEDIATION_V1. `explain({exercise,choice,diagnostic,history,assisted,hadFreeError})` retourne toujours {canonical,feedback,reminder,checkNext,kind}. Les champs facultatifs sont null ou chaînes. `canonical` est exactement exercise.explain. `kind` : correct, correct-unverified (anciens flags manquants), assisted, corrected, targeted, wrong-unknown, unknown (invalide/absent).
- 36 contrastes éditoriaux explicites sur 23 exercices réels, toutes les rubriques. Empreinte de la main, séquence, contexte, réponse, choix et corrigé : toute révision éditoriale invalide le contraste individuel. Règles structurelles bornées aux ouvertures régulières et réponses naturelles élémentaires lorsque main, séquence et corrigé concordent. Les autres cas restent en repli. Diagnostic M3 hypothèse high/medium de même catégorie requis ; reason/evidence libres jamais affichés. Pas d'affirmation concernant la pensée de l'élève.
- Si le corrigé cite déjà la mauvaise enchère, seule une question de transfert est proposée ; sinon explication de l'alternative et question courte. L'historique ne sert qu'à rappeler une même erreur effectivement enregistrée sur le même ID, dans les six dernières séances normales terminées ; pas de déduction de maîtrise ni d'interprétation d'un agrégat ancien. Aucun stockage ou appel distant.

## Comparaison exécutée en V8
| Indicateur | Avant (corrigé seul) | Après |
|---|---:|---:|
| Corrigés intacts | 1879 | 1879 |
| Succès autonome sans supplément | 1879 | 1879 |
| Options avec diagnostic inconnu, corrigé seul | 5637 | 5637 |
| Options avec complément possible (diagnostic compatible simulé) | 0 | 155 |
| dont feedback supplémentaire | 0 | 128 |
| dont question de transfert | 0 | 155 |
| Rubriques représentées par des cas éditoriaux | 0 | 22 |
| Succès assistés/corrigés avec piste de travail | 0 | 1879/1879 |

Le banc a parcouru les 1 879 QCM et les 5 637 options fausses, chaque catégorie simulée, puis les cas documentés (historique absent/ancien, réel simulé, export, diagnostic incohérent/low, entrée libre, pureté). Maximum 40 mots (hors rappel historique), 1379 ms pour la recette complète et 102 ms pour 20 000 appels (V8, valeur indicative). Voir metrics.json. Les fixtures ne sont pas des sorties réelles de M3 ; la couverture effective sera plus faible ou différente selon son diagnostic. Aucun résultat n'est une preuve d'apprentissage humain.

## Raccordement coordinateur
Appeler seulement après `answered`/finalizeAnswer ou en affichant un corrigé déjà acquis. Le retour canonique est volontairement disponible dès l'appel : ne jamais appeler ou afficher le module pendant la question. Ne pas traiter les saisies non reconnues comme des erreurs diagnostiquées. Passer la décision normalisée réelle (pas l'option survolée), assisted/hadFreeError issus de sessionResults. Pour une première erreur libre suivie d'une réponse correcte, appeler une fois pour la décision finale (kind corrected) et, si firstGuess réel encore disponible, une seconde fois avec ce choix et son diagnostic M3 ; privilégier ses champs de remédiation, garder canonical unique, ne rien ajouter si le diagnostic est inconnu hormis la courte piste autonome. Pour une mauvaise réponse finale, préférer cette dernière, sans empiler deux corrigés. Si reprise historique ne contient pas firstGuess, ne pas l'inventer. Récupérer l'historique du parcours (état avec active et completed) ou export avec currentSession ; aucun rappel si session terminée/ancienne ou non documentée. Ne pas utiliser history.entries ou mastery comme preuve d'erreur précise. Passer les chaînes par textContent/escapeHTML ; conserver le bloc canonique et le bouton suivant, focus actuel. Ne jamais modifier les scores, les sélections ou les sauvegardes. Le démonstrateur est volontairement autonome et sa navigation ne touche pas l'UI de production.

`node tests/professeur-numerique-m4-remediation.cjs` sur checkout pour la recette native et VM UMD. Ouvrir `audits/professeur-numerique-20261126/m4/demo.html` depuis le dépôt pour tester clavier, affichage étroit, choix libre, aide et autre main. Les tests de logique ont été exécutés directement en V8 sur les blobs réels ; le wrapper CommonJS et le wrapper navigateur global ont aussi été chargés en V8 et comparés sur les 36 fixtures, et le script du démonstrateur compilé. Le clone local est bloqué (DNS), Node/VM et navigateur réel ne sont pas exécutés ici. Ne pas présenter ces commandes comme déjà exécutées. Le démonstrateur est conçu pour clavier/mobile, mais recette visuelle Chromium/WebKit reste à faire.

## Limites / HOLD
Options non couvertes, diagnostic absent/ambigu, conventions non explicitement traitées, ancienne réponse libre non conservée : corrigé canonique seul. Pas de généralisation de conventions hors cas éditorial validé. Aucun changement de bonne réponse ou de texte canonique, aucune décision de système nouvelle. Il reste à faire relire les contrastes et valider le raccordement M3 réel ; les simulations ne démontrent ni compréhension ni mémorisation humaine. Aucun merge ni publication.
