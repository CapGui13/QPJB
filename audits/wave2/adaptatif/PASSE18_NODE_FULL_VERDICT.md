# M2 — PASSE 18 : clôture technique après recette Node complète

**PASSE 18 FINIE. MISSION DÉFINITIVEMENT TERMINÉE : OUI (périmètre technique M2).**

> La PR #263 reste **DRAFT/HOLD** : la mission M2 est vérifiée, mais aucun merge ni déploiement n'est autorisé par cette clôture. L'intégration CI des scripts M2 et l'arbitrage des PR de la vague 2 appartiennent au coordinateur / chantier M5.

## 1. Provenance et reproductibilité vérifiées

Dépôt `CapGui13/QPJB`, branche unique `wave2/adaptatif-20261121`. Tête avant le présent rapport : `9a1c3373f67eea7908c46c7ecf41a23c46d6d6bc`. Base figée `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.

L'archive GitHub Pages `github-pages-1` de l'exécution **44956962335** (artefact **14728525177**) a fourni les octets complets des deux fichiers applicatifs. Ce n'est **pas** un clone Git de la branche, mais l'identité des fichiers pertinents est contrôlée par les **blobs Git** :

- `quizz.html` : `9d6c305fbeb130c17410a6fc5c36f3ba0bb116c7`, **1 523 QCM, 22 rubriques** ;
- `quizz-parcours.js` : `d0f06f1c259f7a766f2d1c8c47289374a74138dc`, **moteur historique exact** ;
- **10/10** fichiers `tests/wave2-adaptatif-{suite,suite-selftest,invariants,invariants-contract,selection-regression,resume,benchmark,candidates,golden,parallel}.cjs` ont été récupérés par le connecteur GitHub et leur `git hash-object` local correspond **à leur blob distant**, contrôlé de nouveau après la recette.

Version `node --version` : **v22.16.0**. Exécution native, sans remplacement de `fs/path/assert`, depuis le dossier contenant les vrais fichiers de référence.

## 2. Recette complète Node : réussite mesurée

Commande exacte :

```bash
node tests/wave2-adaptatif-suite.cjs --full
```

**Résultat du processus : `EXIT_CODE:0` ; `[M2] PASS 12/12 en 474.6 s` (7 min 54,6 s).** Fin constatée le 22 novembre 2026 à **07:50:18 UTC**. Les 12 commandes :

1. Autotest du contrat de suite : PASS ;
2. Invariants moteur et JSON : PASS ;
3. Coexistence UI M3 / catalogue immuable : PASS ;
4. Autotest golden de 30 lignes, mutations négatives : PASS ;
5. Autotest des cinq runners parallèles : PASS ;
6. Empreintes de **600 sélections**, 5 profils × 12 séances : PASS ;
7. **Cinq variantes** de sauvegarde/reprise/export/import : PASS ;
8. **30 trajectoires originales**, 5 profils × 65/153 séances × 3 graines : PASS ;
9. Candidat `foundation` `modere/153/g29` : PASS technique ;
10. Candidat `recall` `modere/153/g11` : PASS technique ;
11. Candidat `overdue` `modere/153/g11` : PASS technique ;
12. Candidat `score-cache` `modere/65/g11` : PASS technique.

Pour l'étape 8, `wave2-adaptatif-parallel.cjs` lance cinq **processus Node natifs et indépendants**, un par profil, qui parcourent chacun six trajectoires. Durées observées des lots : `echecs` **242,5 s**, `autonome` **279,9 s**, `modere` **318,6 s**, `progression` **350,0 s**, `aides` **356,7 s**. **30/30** projections strictement égales aux neuf JSON P2 sur **18 attributs**, dont les 22 fréquences de thèmes protégées par empreinte FNV. Total : **32 700 réponses simulées**, aucun QCM inventé. Les trois tests négatifs du golden (famille modifiée, duplicata, trajectoire absente) sont bien détectés.

Exécution supplémentaire **native** sur copie expérimentale `score-cache` : **30/30 trajectoires**, soit encore **32 700 réponses simulées**, identiques aux 30 références P2 sur les 18 attributs de contrôle. Sur quatre scénarios candidats, les **20 métriques communes** à leurs archives P2/P3/P4/P8 ont été revérifiées indépendamment par empreinte : **4/4 identiques**.

## 3. Bilan des 5 profils (moyennes de trois graines, moteur de référence)

| Profil synthétique | Horizon | Familles distinctes (moyenne) | Difficultés 4–5 (%) | Rappels faibles distincts réalisés (moyenne) | Faibles en retard ≥ 20 séances à la fin (moyenne) |
|---|---:|---:|---:|---:|---:|
| Tout juste | 65 | 638,0 | 40,00 | 0,0 | 0,0 |
| Tout juste | 153 | 1 315,0 | 28,89 | 0,0 | 0,0 |
| Échecs persistants | 65 | 499,3 | 0,00 | 59,7 | 308,7 |
| Échecs persistants | 153 | 1 027,7 | 9,28 | 107,0 | 959,7 |
| Erreurs modérées | 65 | 475,7 | 12,36 | 95,3 | 32,7 |
| Erreurs modérées | 153 | 1 097,7 | 26,86 | 225,7 | 146,0 |
| Aides fréquentes | 65 | 507,7 | 0,46 | 68,0 | 229,3 |
| Aides fréquentes | 153 | 1 035,7 | 9,80 | 150,0 | 724,3 |
| Progression graduelle | 65 | 486,0 | 1,23 | 73,7 | 202,0 |
| Progression graduelle | 153 | 1 091,7 | 25,40 | 206,7 | 291,0 |

Ce sont **des simulations**, jamais des résultats réels d'élèves. La dette de rappels demeure conséquente chez les profils fragiles ; elle est **mesurée**, pas résolue par un candidat universel démontré.

## 4. Décision sur les variantes

| Essai isolé | Profil / horizon / graine | Référence → variante | Décision |
|---|---|---|---|
| `foundation` | `modere/153/29` | Familles **1 097 → 1 087** ; difficiles **25,88 → 25,10 %** | **Rejeté** : perte de diversité |
| `recall` | `modere/153/11` | Familles **1 108 → 974** ; difficiles **27,84 → 31,31 %** | **Rejeté** : forte perte de diversité et difficulté accrue |
| `overdue` | `modere/153/11` | Familles **1 108 → 1 109** ; difficiles **27,84 → 30,72 %** | **Rejeté** : difficulté accrue |
| `score-cache` | 30 scénarios comparables | **30/30** projections identiques aux références, mêmes QCM sélectionnés selon métriques suivies | **Non déployé** : optimisation technique neutre, bloquée par contrat SHA du test LOT B |

Ces contre-exemples suffisent à réfuter une domination pédagogique universelle des trois politiques. **Aucune mutation pédagogique n'est justifiée dans `quizz-parcours.js`.** Aucun gain d'apprentissage réel n'est revendiqué.

## 5. CI externe, périmètre et statut

- La tête de P15 `d856f544` a été contrôlée par GitHub Actions `QPJB Training smoke` run **44997794775**, **completed/success**.
- Le run `QPJB Training smoke` associé au HEAD de P17 **44999595836** était encore **queued** au dernier contrôle ; **ne pas le déclarer vert** tant qu'il n'a pas fini. La CI historique ne lance pas `tests/wave2-adaptatif-suite.cjs` : son raccordement dans les workflows appartient exclusivement au chantier **M5**.
- Avant P18 : comparaison de la branche à sa base : **55/55 fichiers de diff autorisés**, uniquement `tests/wave2-adaptatif-*` et `audits/wave2/adaptatif/**`, **aucun changement de moteur, HTML, QCM, workflows ou autres branches**. Pas de force-push, pas de merge, pas de publication.
- La recette native complète sur fichiers identiques au dépôt, ses contre-exemples, l'instrumentation et l'interface de validation pour M5 sont **achevés**. La dépendance restante est **une action de coordination hors M2** : intégrer les scripts à la CI commune et arbitrer les PR selon la politique de la vague 2. Ce statut n'autorise pas leur fusion automatique.

**PASSE 18 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : OUI (chantier M2 technique et recherche).**

**PROCHAINE PASSE : AUCUNE dans le périmètre M2 sans nouvel échec mesuré.** Si la CI de nouvelle tête ou le raccordement M5 révèle une régression réelle, rouvrir une passe M2 dédiée et reproduire l'échec sans toucher au catalogue ou aux autres branches. La PR #263 reste **DRAFT/HOLD**, non fusionnée.
