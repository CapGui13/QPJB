# M2 — PASSE 16 : premier Node CLI natif sur les octets GitHub authentifiés

**PASSE 16 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Blocage antérieur et contournement vérifié

Le conteneur n'a pas de DNS vers github.com ; les lectures de `quizz.html` volumineux avec GitHub Contents échouaient. Une archive de publication existante et **déjà réussie** a été récupérée en lecture seule depuis GitHub Actions :

- Workflow `QPJB Pages — publication après validation` run **44956962335** (main), artefact **14728525177**, `github-pages-1` ; archive ZIP contenant `artifact.tar`.
- Cette archive n'est **pas** un checkout Git M2 ; c'est la distribution du site. Son `quizz.html` et son `quizz-parcours.js` sont néanmoins octet pour octet les mêmes que les objets figés sur la branche M2 :
  - `git hash-object quizz.html` = `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7` ;
  - `git hash-object quizz-parcours.js` = `d0f06f1c259f7a766f2d1c8c47289374a74138dc`.

`quizz.html` contient 1 523 QCM, 22 rubriques et le JSON invariant de la base.

Les **huit** scripts M2 ont été récupérés depuis `wave2/adaptatif-20261121` ; chacun a été reconstitué dans le répertoire de tests local et sa valeur `git hash-object` a été comparée au blob réellement renvoyé par le connecteur GitHub : **8/8 identiques**. Aucun fichier de production GitHub n'a été modifié.

## Exécution réelle Node 22.16.0

Sur les fichiers locaux strictement identiques :

```bash
node tests/wave2-adaptatif-suite.cjs --quick
```

**PASS 5/5** :
1. Autotest du lanceur ;
2. Moteur historique et JSON (1 523 QCM, 22 rubriques) ;
3. Protection UX hors JSON / rejet mutation JSON ;
4. Régression déterministe : **600 sélections** (5 profils × 12 séances) ;
5. **5 variantes** de reprise, export/import, états hérités et invalides.

Temps observé sur cet environnement : **9,7 s**. Ce sont désormais des exécutions **Node CLI authentiques** avec `node:fs`, `node:path` et `node:assert/strict`, et non des adaptateurs V8.

La commande **`node tests/wave2-adaptatif-suite.cjs --full` a aussi été lancée** sur ce même assemblage contrôlé, mais son banc de 30 trajectoires est encore en cours au point de clôture de P16. **Aucun succès intégral n'est revendiqué avant le résultat final**. Le suivi et les corrections éventuelles sont la passe 17.

## CI et sécurité

La tête M2 d'entrée `d856f544acbf885f615328db2a364e04575338d2` possède `QPJB Training smoke` run **44997794775** : **completed/success**. Ce workflow historique ne remplace pas la nouvelle suite M2.

Périmètre des 51 fichiers avant P16 : **51/51 autorisés**, aucun moteur, QCM, HTML, autre branche, autre workflow modifié. PR #263 **brouillon/HOLD**, non fusionnée.

**MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P17** — attendre les résultats concrets de `--full`, mesurer les cinq profils sur 65/153 et trois graines, traiter chaque échec et renforcer la non-régression longitudinale si une faille de vérification réelle apparaît. Ne conserver aucune mutation de production sans gain démontré.
