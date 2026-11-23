# M2 — PASSE 8 : priorité aux rappels les plus anciens, quota constant

**PASSE 8 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Protocole

Candidat isolé `--variant overdue` ajouté dans `tests/wave2-adaptatif-candidates.cjs` : bonus limité à +240 au score d'un QCM déjà dû, faible (erreur ou aide), selon son ancienneté de retard ; aucune augmentation du quota de **deux** rappels/séance et aucun changement de catalogue ou schéma. Le moteur dans `quizz-parcours.js` n'a **pas** subi la modification.

Graine 11, cinq profils × 65/153 séances = **10 trajectoires candidates réellement exécutées**, 10 900 réponses simulées. Les 10 trajectoires de référence P7 sont appariées aux mêmes profils/graine. La validation préliminaire a été arrêtée après un contre-exemple pédagogique net : les deux autres graines ne sont **pas** revendiquées pour P8.

## Mesures appariées

| Profil | Séances | QCM dus distincts rappelés | QCM faibles en retard ≥20 séances à la fin | Familles distinctes | QCM difficulté 4–5 (%) | Part rappels (%) |
|---|---:|---:|---:|---:|---:|---:|
| autonome | 65 | 0 → 0 | 0 → 0 | 638 → 638 | 40.00 → 40.00 | 9.08 → 9.08 |
| autonome | 153 | 0 → 0 | 0 → 0 | 1315 → 1315 | 28.89 → 28.89 | 10.00 → 10.00 |
| echecs | 65 | 58 → 91 | 306 → 294 | 504 → 487 | 0.00 → 0.00 | 19.54 → 19.54 |
| echecs | 153 | 109 → 191 | 951 → 936 | 1029 → 1028 | 9.35 → 9.35 | 19.80 → 19.80 |
| modere | 65 | 95 → 99 | 35 → 23 | 475 → 467 | 14.15 → 8.77 | 19.69 → 19.69 |
| modere | 153 | 227 → 232 | 119 → 113 | 1108 → 1109 | 27.84 → 30.72 | 19.87 → 19.87 |
| aides | 65 | 71 → 89 | 224 → 212 | 491 → 483 | 0.31 → 0.15 | 19.54 → 19.54 |
| aides | 153 | 151 → 212 | 719 → 706 | 1037 → 1038 | 9.87 → 9.93 | 19.80 → 19.80 |
| progression | 65 | 74 → 94 | 207 → 201 | 480 → 484 | 1.69 → 0.46 | 19.54 → 19.54 |
| progression | 153 | 209 → 226 | 282 → 278 | 1097 → 1090 | 28.24 → 23.59 | 19.80 → 19.80 |

Toutes les séquences gardent 22 rubriques, 10 QCM distincts/séance, et les contrôles de reprise JSON/export/import du banc P5. L'amélioration en ancienneté ne vaut **pas** preuve de meilleure mémorisation : un QCM encore faux mais rejoué repart avec une échéance récente et ne figure plus dans le stock « en retard de 20 » sans nécessairement avoir été acquis.

## Décision

**Rejeter ce candidat généraliste en l'état.** Le profil « erreurs modérées » / 153 séances voit sa part de questions difficiles grimper de **27,84 % à 30,72 %** (≈ +2,88 points). Le profil « échecs persistants » / 65 perd 17 familles distinctes (504 → 487) pour gagner 33 QCM distincts rappelés. La priorité aux plus vieux retours réduit certains retards, mais ne démontre pas une domination sur variété **et** difficulté. Une seule graine suffit à prouver l'absence de domination universelle ; les graines manquantes ne sauraient être considérées comme validées.

## Tests et réserve technique

Le JS CommonJS des moteurs et bancs a été exécuté dans V8 avec adaptateurs de lecture/assertions Node ; **pas de Node CLI complet** sur le dépôt. Le conteneur possède Node 22, mais `git ls-remote` vers GitHub échoue par indisponibilité DNS, donc impossible d'y exécuter le banc sur le vrai catalogue sans copie de l'intégralité du dépôt. Les workflows de la PR peuvent valider le code existant, sans garantie d'exécuter les nouveaux tests `wave2-adaptatif-*` (workflow hors périmètre).

**PROCHAINE PASSE : P9** chercher d'abord à lever la réserve des tests Node via les contrôles GitHub disponibles ou une preuve de reproductibilité plus forte ; vérifier l'invariant de non-mutation du moteur, réévaluer honnêtement l'état CI. Si aucune exécution Node ciblée n'est possible, déposer une procédure de reprise claire plutôt que proclamer la mission terminée.

**HOLD** : ne fusionner, publier ni toucher aux QCM/22 rubriques/36 propositions.
