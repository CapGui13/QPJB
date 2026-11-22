# LONG M4 — Passe 20 : distinguer séance complémentaire et difficulté prouvée

**PASSE 20 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Défaut vérifié après la passe 18

Deux QCM d'ouverture « Passe » **uniquement sautés** produisent 0 erreur, 2 skipped, score micro -2. Avec un catalogue composé de 7 familles réellement admissibles, `QPJBParcours.consolidationPlan` retourne légitimement `available=true, count=7`. Le module M4 affichait bien la carte neutre « notion à réessayer », mais conservait aussi l'ancien titre de révision « **Séance de révision pertinente** » et affirmait que l'offre résultait de « difficultés effectivement suivies ». Ce langage excédait les preuves : aucune mauvaise réponse n'avait été constatée.

## Correction

Le module respecte **strictement** la disponibilité du plan calculée par le moteur, mais reformule la carte en « Séance complémentaire disponible », fondée sur les **scores V1**, dont les questions sautées peuvent faire partie. L'explication indique qu'une question sautée peut abaisser le score sans être une erreur. Le module n'active pas la séance, n'altère ni état, ni catalogue, ni score. Une reprise en cours continue de rendre `revision=null`.

Trois tests nouveaux `tests/wave2-recos-revision-language.test.js` : sauts seuls avec un plan disponible, erreurs réelles avec plan disponible, séance interrompue sans deuxième plan. Testé avec les vraies fonctions `record/finish/consolidationPlan`.

**Total ciblé : 83 scénarios** (80 précédents + 3). La recette Node22 exhaustive reste du ressort de la mission M5, dont les workflows sont exclus du périmètre M4.

**PROCHAINE PASSE :** dernier contrôle d'intégrité, de test et de CI. Ne considérer la mission comme définitivement terminée qu'après recette Node22 des nouveaux tests et validation de l'intégration ; ne pas fusionner/publier. PR DRAFT/HOLD.
