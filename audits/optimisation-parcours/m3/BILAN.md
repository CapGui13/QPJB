# Bilan M3 — construction pédagogique des séances (#369)

## Périmètre et audit initial

Contrat commun #366, mission #369, référence historique #293, #255, #256 et
PR #365. Base dc5ecced63716672813905472bf32c4505253665.
Blobs Git lus directement :
- quizz.html : 5307457d7ad6c57af890a3e17acc36174213090b (1879 QCM, 22 rubriques).
- quizz-prerequis.js : d1d8ad465461df20eb26eb2e5a10746ad6b7b48a (99 concepts).
- quizz-parcours.js : e32bccd3cae340b6cf8d7c3d385b101de2c927fe.

La cartographie initiale à S20 (graine 11, cinq profils) a montré SA S4,
redemande S5, rubrique Stayman S8, 14 rubriques et 42 à 48 concepts,
162 à 200 familles, zéro bonne enchère identique adjacente et zéro triple de
rubrique hors S1. Aucun N4/5 pour les profils faible et aidé. Les protections
historiques sont donc utiles et ne doivent pas être réécrites.

Sur le profil modéré, graine 11, à S153, distance maximale d'intervention
30 séances, ouvertures fortes 26, Multi-Landy 20. Cause algorithmique :
le bloc de priorité dure protège les sept fondamentaux, pas les autres rubriques ;
le choix favorisant les nouvelles familles peut différer longtemps les rubriques
déjà épuisées. Pas de preuve d'une erreur éditoriale ou de prérequis à corriger.

Cibles retenues pour la production : conserver la structure S1–S20 et ses
protections ; respecter le seuil contractuel de 95% de familles uniques
par trajectoire/horizon ; distance <=6 sur fondamentaux, cible <=10 sur les
autres rubriques éligibles ; zéro violation ; couverture des concepts et rubriques
non régressive ; comparer aussi les difficultés, erreurs et temps de calcul.

## Production

Module UMD autonome quizz-session-plan.js ; calcul pur de priorités
thématiques. Le banc raccorde le candidat au véritable sélecteur par substitution
unique contrôlée en mémoire. Aucun moteur de production, catalogue,
métadonnée, stockage, script de chargement, workflow ou UI modifié.
Le moteur conserve sa construction personnalisée, sa sélection des cas,
son ordre, ses contraintes Passe et ses motifs. Seul l'entretien thématique
à long terme est renforcé. Contrat séparé : CONTRAT-INTEGRATION.md.

## Recette comparative exécutée

Six profils : autonome, modéré (33% d'erreurs), faible (94%),
faiblesse SA (90% SA, 12% ailleurs), aide (15% erreurs, 72% aide),
faiblesse Passe (échec sur Passe d'ouverture).
Graines 11, 47, 103 ; générateur LCG identique ; 153 séances par trajectoire,
instantanés S20/S65/S153 ; 18 paires / 36 trajectoires, 54 comparatifs,
55 080 présentations de QCM dans la matrice longue.
Les profils autonome et faiblesse Passe sont déterministes quelle que soit
la graine ; les trois exécutions ont néanmoins été faites.
Les données sont simulées, non des exports d'élèves.

Chaque fichier resultats-PROFIL-GRAINE.json contient les métriques avant/après.
resultats-s20.json archive en plus la recette courte indépendante.
Les valeurs ms incluent sélection, diagnostic et mesure ; elles ne sont pas
des mesures de latence navigateur. Les diagnostics d'éligibilité ont été
groupés en mémoire pour éviter de recalculer la même preuve dix fois ;
le premier essai modéré 11 a été réexécuté et toutes les anciennes métriques
hors durée sont strictement identiques.

### Résultats — étendues sur les 18 paires

| Horizon | Distance max. hors fondamentaux avant → après | Fondamentaux | Familles uniques avant → après | Concepts | Rubriques | Violations |
|---|---|---|---|---|---|---|
| 20 | 3–5 → 3–5 | 3–5 → 3–5 | 162–200 → 162–200 | 41–48 → 41–48 | 14 → 14 | 0 → 0 |
| 65 | 6–15 → 6–10 | 5 → 5 | 522–650 → 522–650 | 94–99 → 94–99 | 22 → 22 | 0 → 0 |
| 153 | 22–63 → 10 | 5–6 → 5–6 | 1118–1482 → 1119–1479 | 98–99 → 98–99 | 22 → 22 | 0 → 0 |

La rétention minimale des familles dans une même paire est 99,3469% (seuil 95%).
Aucun recul de couverture des concepts par paire. Les deux trajectoires faibles
à 98 concepts n'atteignent pas sa2.texas_mineur.reponse à S153, également
absent de la référence ; ne pas créer un accès artificiel.

### S153 par profil (min–max sur trois graines)

| Profil | Distance max. autres thèmes | Familles uniques | Concepts | N4/5 |
|---|---|---|---|---|
| Autonome | 51 → 10 | 1482 → 1479 | 99 → 99 | 453 → 470 |
| Modéré | 22–34 → 10 | 1376–1377 → 1371–1373 | 99 → 99 | 396–422 → 409–440 |
| Faible | 59–63 → 10 | 1118–1121 → 1119–1125 | 98–99 → 98–99 | 63–66 → 64–70 |
| Faiblesse SA | 25–39 → 10 | 1377–1379 → 1369–1376 | 98–99 → 99 | 443–449 → 451–466 |
| Aide | 33–40 → 10 | 1139–1140 → 1133–1141 | 99 → 99 | 84–85 → 78–86 |
| Faiblesse Passe | 25 → 10 | 1377 → 1377 | 99 → 99 | 426 → 433 |

SA découvert en S4 dans les 18 paires, seuils SA1 en S4, initiation
Stayman/Texas SA1 S5–6 ; redemande S5, rubrique Stayman S8. Seuils SA2 S7–10 ;
Stayman SA2 S9–15, Texas SA2 S11–20. S1 à S3 : quotas et bornes Passe de
la base #293 et dérogations intégrées conservés ; 10 IDs et familles distincts
dans chaque séance réelle. Aucun QCM avancé hors de ses prérequis.
Bonnes enchères identiques adjacentes : 0 sur tous les horizons.
Triples de rubrique hors S1 : 0 à S20/65 ; à S153 0–6 avant, 0–1 après.
Les fichiers détaillent également formes, points H, enchères et séquences distinctes,
premières expositions par concept et niveaux/stages. La variance de parcours
entre profils est conservée ; aucune séquence universelle imposée.

### Compromis à transmettre à M2 / M1

S153 : variation par paire des erreurs/ aides encore en attente de reprise
exacte d'ID : -2 à +17 ; délai médian des reprises effectivement observées :
-5 à +2 séances. Une hausse des en-attente n'est pas assimilée à un oubli
si la notion a été revue sur une autre main, mais reste un signal à surveiller.
Les motifs faiblesse diminuent jusqu'à 37 occurrences sur un profil modéré ;
ils augmentent jusqu'à 17 sur d'autres trajectoires. Découverte (-20 à +22),
entretien (-8 à +16) et transfert (-6 à +8) varient. Les motifs historiques
sont des proxys et non des preuves de maîtrise, ni des quotas absolus.
Certaines trajectoires comportent jusqu'à 23 questions N4/5 supplémentaires
à S153, toutes éligibles ; pour les faibles, la hausse maximale est 5.
Les preuves M1 et le plafond existant restent inchangés. Les questions avancées
restent absentes des 20 premières séances des profils faible et aidé.
Le temps total à S153 est de 18,2–27,7 s avant et 17,6–27,1 s après dans
l'environnement JavaScript de simulation (non un benchmark navigateur).
Ne pas conclure à une amélioration réelle de la mémorisation humaine.

## Tests et commandes

Sur un checkout exact de la branche :
```sh
node tests/optimisation-seances-unit.cjs
node tests/optimisation-seances-benchmark.cjs
node tests/optimisation-seances-benchmark.cjs modere 11 153
node tests/optimisation-seances-acceptance.cjs
```
Le banc vérifie les SHA des trois fichiers de base avant la simulation.
Exécutions réelles : module et tests unitaires Node v22.16.0 sur copies dont
git hash-object correspond aux deux blobs Git ; test UMD navigateur par
injection d'un objet window en V8 ; appels makeEngine/run du banc dans V8,
à partir des blobs Git réels ; matrice acceptRows : 18 paires, 54 points,
rétention minimale 0.9934687953555879, zéro violation ; smallPool sur 3 cas
réels (SEF-002-3, SEF-003-2, SEF-001-1), reprise interrompue, pool vide et
fail closed réussis. Reprise active également vérifiée à S1, S20, S65 dans
chaque trajectoire. Les commandes Node intégrales de simulation et
acceptance restent à lancer sur le checkout : le bac local ne résout pas
github.com. Le banc V8 a exécuté exactement les fonctions exportées ; il ne
remplace pas les suites CI/navigateur et la recette commune après intégration.

## Décision

Candidat retenu pour intégration isolée : gain de couverture temporelle
dans chacune des 18 paires, maintien des protections et de la diversité,
sans changer l'éditorial ni les responsabilités M1/M2. Les compromis précités
doivent être mesurés dans la recette commune ; aucun déploiement individuel.
MISSION DÉFINITIVEMENT TERMINÉE : OUI (périmètre autonome M3).
