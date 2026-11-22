# M4 — PASSE 30 : validation exhaustive native des 107 tests sur le module propre

**PASSE 30 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON (sonde CI temporaire à retirer et nouvelle CI standard à confirmer).**

## Validation Node 22 réelle et sourcée

- Commit de recette éphémère : `984f349bf286632dea4ad8738bb51013eea3ccb7`.
- Workflow GitHub Actions : **44998295333**.
- Job **Audit des données et du code** : **137134022715**, `SUCCESS`, Node 22 (`actions/setup-node@v4`, `node-version: '22'`).
- Log de recette explicite : **`# tests 107`**, **`# pass 107`**, **`# fail 0`**. Le test historique lancé ensuite affiche séparément **13/13 pass**.
- Empreinte Git du code réellement testé en lecture par les 107 tests : **`cebe2b3060cf89926010fd981a0b31bcd5b0c292`** ; elle correspond bit à bit à l'empreinte du module **propre de P29**, et non au module de la sonde.
- Nombre de fichiers suite M4 chargés : 20 `tests/wave2-recos-*.test.js`, plus les 13 historiques.
- Contrôles d'intégrité P9/P13/P25 exécutés **sans désactivation ni changement de leurs assertions**, sur le module propre.
- Contrôle historique catalogue : **`Quizz integrity: PASS | 1523 exercises, 22 topics, 581 annotated situations`**.

## Protocole de recette contrôlable

Le workflow standard ne lance que `node tests/parcours-recommandations-v1.test.js` et la mission M4 ne peut modifier les workflows M5. Une annexe **temporaire** au module, active uniquement sur l'entrée historique du job GitHub Actions, a donc copié sur le disque du runner **le module exact de P29 sans cette annexe**, vérifié son blob Git et lancé dans un processus Node natif enfant :

```sh
node --test tests/parcours-recommandations-v1.test.js tests/wave2-recos-*.test.js
```

Le fichier a été restauré sur le runner après l'exécution par un bloc `finally`. Le code des cinq garde-fous d'intégrité n'a jamais été supprimé, modifié ou ignoré. La sonde n'est pas du code destiné à la branche finale ; elle doit être retirée immédiatement en P31. La validation directe **107/107 concerne bien le code de production propre ayant le blob `cebe2b30…`**, à l'exclusion des fichiers docs futurs.

### Deux premières répétitions et correctif de la sonde

- Le tout premier commit de sonde `958c25c3` s'est arrêté sur un marqueur de découpe erroné : job d'audit échoué ; pas de code de production modifié.
- Après correction `a41d6533`, le code fonctionnel a passé 107/107 mais comportait **un saut de ligne supplémentaire** (blob `23305a19…`) ; ce n'est pas la preuve bit à bit finale.
- Le commit `984f349b` a corrigé la découpe ; le job 137134022715 a confirmé **le blob exact `cebe2b30…`** et **107/107**.

**PROCHAINE PASSE :** retirer l'annexe de test du module sur la branche M4, garder le blob exact `cebe2b30…`, prouver l'absence de hook via les tests d'intégrité, contrôler le diff et la CI normale. PR #262 DRAFT/HOLD ; aucune fusion ou publication.