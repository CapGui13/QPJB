# Parcours guidé V1.6 — moteur de consolidation ciblée (étape 1)

## Objectif
Ajouter une **séance complémentaire facultative** de consolidation sur des difficultés constatées, sans interrompre ni accélérer le parcours pédagogique normal. Le classement est entièrement algorithmique, sans IA et sans analyse sémantique des QCM.

## Conditions de proposition
- L'historique doit contenir au moins **deux essais** dans une micro-compétence ou un axe transversal audité et un **score au plus égal à -2**.
- Seuls les QCM dont la rubrique est déjà débloquée peuvent être sélectionnés.
- Chaque cible dispose d'au moins six familles distinctes et le tirage final doit réunir **exactement dix familles distinctes**. Sinon, aucune consolidation n'est proposée.
- Au maximum deux cibles sont retenues, en privilégiant les plus fragiles.

## Tirage et progression
- Objectif : **10 questions** de familles distinctes ; jamais de doublon de QCM, et diversité des réponses et situations lorsqu'elle est disponible.
- Privilégier les QCM encore inconnus, pénaliser les cas revus récemment et conserver le niveau de difficulté de chaque rubrique.
- Les réponses sont comptabilisées dans les mêmes mécanismes de suivi et de révision que les séances ordinaires.
- Une consolidation achevée est mémorisée par `lastConsolidatedAt` et n'est **pas reproposée avant l'achèvement d'une séance normale**, pour éviter des preuves répétées sur le même palier.
- **Le nombre de séances ordinaires terminées n'augmente pas** après une consolidation. Une séance ciblée seule ne débloque donc ni rubrique ni nouveau palier de l'itinéraire.
- Le numéro de séance reste le même pour les preuves pédagogiques : dix bonnes réponses dans une consolidation ne constituent pas dix séances autonomes.
- La sauvegarde `qpjb-sef-parcours-01` conserve le format V1, et le champ `active.mode='consolidation'` n'existe que pendant une séance complémentaire. Toute séance interrompue est reprise avant un nouveau tirage.

## API ajoutée
- `consolidationPlan(state, exercises, 10)` : proposition **en lecture seule**, détails des cibles et des dix IDs sélectionnés.
- `startConsolidation(state, exercises)` : démarre la séance ciblée si aucun parcours n'est en cours, ou reprend la séance active.
- `start`, `record` et `finish` continuent de servir à l'exécution ; `finish` ne fait pas progresser le compteur des séances normales lorsque `active.mode==='consolidation'`.

## Périmètre et publication
Cette PR contient le **moteur, le bouton utilisateur dans `quizz.html`, les tests Node et les tests navigateur**. Elle n'est pas encore une fonctionnalité publiquement accessible tant que la CI complète n'est pas verte, que la revue n'est pas terminée et que la PR n'est pas fusionnée. Le moteur n'ajoute aucun exercice.

Aucun QCM, distracteur, réponse, correction ou explication n'est modifié. Les contenus du Quiz SEF et de l'Entraînement restent inchangés. Pas de migration forcée, pas de réseau supplémentaire.

## Validation
- Tests : absence de faux diagnostic, priorité aux micro-compétences réellement faibles, dix familles distinctes, plan pur, sauvegarde/reprise, réponses enregistrées, compteur principal inchangé, retour au mode normal, absence de suggestion après une erreur isolée.
- Avant fusion : tests Node complets, vérification du catalogue de 1 523 QCM, tests Chromium et WebKit avec proposition/démarrage/reprise/fin de consolidation, et absence de régression sur les séances ordinaires. Cache PWA `v90`, module `v=8`.
