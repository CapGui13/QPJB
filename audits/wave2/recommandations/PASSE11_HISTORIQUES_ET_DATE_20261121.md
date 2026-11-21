# LONG M4 — Passe 11 : datation des preuves et historiques incomplets

**PASSE 11 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Anomalies concrètes

1. Une ancienne sauvegarde conservant 65 séances terminées mais aucun détail peut recevoir « Aucune notion encore évaluée », affirmant à tort une absence d'activité. Le nouvel intitulé est neutre : « Historique sans évaluation de notion exploitable » ; il ne prétend rien sur l'effort passé.
2. Avec 9 séances et entries historiques mais aucune micro-compétence/axe/journal, le module ne renvoyait aucun conseil : l'état passe désormais par not_evaluated au sens **absence de preuve de notion**, pas absence de travail.
3. Une difficulté à score négatif très ancienne avait une explication identique à une difficulté tout juste constatée. Le champ observed cite désormais le **numéro réel de la dernière séance enregistrée**, en tenant compte du compteur indexé à zéro dans record().
4. Un historique sans journal détaillé était mentionné globalement dans limitations, mais pouvait disparaître de la carte affichée seule. Chaque carte ajoute désormais la limite : X séance(s) sans journal ; aucune reconstruction.

Aucun seuil temporel ou critère pédagogique supplémentaire n'est introduit. La priorité et les scores sont conservés ; c'est uniquement la transparence de l'évidence historique.

## Validation

5 nouveaux tests tests/wave2-recos-freshness.test.js sur les cas 65 séances, 9 séances + entries, preuve ancienne, limites par carte et preuve fraîche. La sonde éphémère de P10 appelle temporairement cette suite en plus des 52 scénarios existants, pour validation sous Node 22 avant retrait.

Commandes cibles : node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js.
**PROCHAINE PASSE :** lecture des 57 résultats Node22, retrait impératif de la sonde M4 et recette d'intégrité finale.
