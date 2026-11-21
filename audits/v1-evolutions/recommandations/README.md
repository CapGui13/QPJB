# Mission 4 — recommandations pédagogiques V1

**Base figée :** `1736c99561dd83b0d9e279747066f32274ec8771`.

## API

Le nouveau fichier racine `parcours-recommandations.js` expose, en CommonJS et sur
`window.QPJBParcoursRecommandations` :

```js
const recommendations = require('./parcours-recommandations.js');
const parcours = require('./quizz-parcours.js');
const rapport = recommendations.buildReport(parcours.load(rawJSON), {
  parcours,                       // facultatif en Node et si QPJBParcours est chargé au navigateur
  exercises: catalogueQCM,       // facultatif : nécessaire pour confirmer une séance de révision
  maxRecommendations: 6          // 1 à 10, valeur par défaut 6
});
```

`buildReport(rawState, options)` accepte l'objet V1 ou sa chaîne JSON, et retourne
`{schemaVersion,status,completedSessions,currentSession,observations,revision,recommendations,limitations}`.
Chaque recommandation a `{id,type,priority,title,message,evidence}`. `status='unavailable'`
indique une sauvegarde absente, illisible ou incompatible, sans recommandations inventées.
`outcome(answer)` expose le classement `autonomous`, `helped`, `wrong`, `skipped`.

Aucune sauvegarde, aucune écriture dans le DOM, aucune mutation de l'état ni du catalogue.
La disponibilité d'une séance complémentaire est **inconnue** si le catalogue n'est
pas fourni, et **vérifiée** par `QPJBParcours.consolidationPlan` sinon. Le module ne
lance jamais la séance.

## Règles de preuve

- Le résultat `correct` n'est autonome que sans `assisted` **et** sans `hadFreeError`.
- Les résultats `wrong`, `skipped` et `helped` restent séparés.
- Les compteurs `micros`/`axes` existants (seuls libellés homologués) fournissent
  les recommandations « difficulté persistante » (`score <= -2`, `attempts >= 2`),
  « à consolider » et « réussites autonomes répétées » (`score == 3`,
  `independent >= 3`, dernière preuve antérieure à `completed`).
- Les seuils de « difficulté persistante » et « réussites répétées » reprennent
  le tableau V1 ; ils n'altèrent **aucune** notation et n'affirment pas une
  maîtrise générale.
- Le journal ne compte que les séances réellement consignées ; une réponse
  en consolidation est comptée à part, jamais comme preuve de maîtrise ordinaire.
- `entries.seen`, `entries.streak`, `skills.level`, ou la présence d'un sujet
  débloqué ne sont **pas** une preuve de maîtrise réinventée.
- Pour les sauvegardes anciennes, le nombre de séances sans journal est indiqué.
  Leurs réponses détaillées ne sont ni inventées ni extrapolées.
- Une classification inconnue dans `micros`/`axes` n'est jamais activée.

## Profils et vérification

Exécuter depuis la racine :

```bash
node --test tests/parcours-recommandations-v1.test.js
```

Les fixtures utilisent les fonctions réelles `record` et `finish` du moteur V1 :
élève sans évaluation, aides répétées, échecs persistants, progression autonome,
profil mixte, consolidation seule, séance interrompue, ancienne sauvegarde,
taxonomie inconnue et séance de révision disponible ou non. Un contrôle garantit
que l'analyse ne change pas l'état sauvegardé.

Le raccordement futur à `quizz.html` appartient exclusivement au coordinateur.
Aucune modification de `quizz.html`, `quizz-parcours.js`, des QCM, du stockage,
des scores ou des autres missions ; aucune fusion ni publication.
