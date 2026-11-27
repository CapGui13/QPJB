# M4 — bilan des séances réellement générées

Statut : **HOLD — ne pas activer C2**. Contrats #419 et #423, base `2d336054bc91fbd6ac762c093ecb5ec6da9f97e8`. PR de livraison #427. SHA de code/recette native : `62666e9c12a77c1b4e0a8ee15bebdd9b5770e9f6`. Le moteur de production et le catalogue ne sont pas modifiés.

## Cartographie et raccordement

1915 QCM et 99 concepts du catalogue réel : registre structurel `register.json`, signatures de décision et de proximité à partir de concept, enchère, contexte, force, distribution. Miroirs de couleurs naturelles uniquement ; ne pas assimiler conventions, égalités 3–3/4–4 en meilleure mineure et contrastes utiles de Passe. Une signature est un proxy, non un visa éditorial ni une preuve que les questions sont substituables pédagogiquement. Les traces S5/S20 et celles de la recette native couvrent les unités effectivement sélectionnées ; les autres décisions individuelles ne sont pas réputées examinées manuellement.

Banc `tests/coherence-concrete-m4-adapter.cjs` : injection après le gagnant de choose(), après filtres et classements historiques, avant insertion dans selected. Aucun changement de prérequis, quota, rappel explicite, stockage, ordre final, QCM ou correction. M1 représenté par une fixture d'objectif (pas l'intégration réelle M1) ; M2 ordre historique. Les autres missions et le coordinateur restent indépendants. Pas de réactivation automatique des HOLD #409.

- A : pénalité de proximité, score historique dans une fenêtre bornée ; S5 18 paires + cible/11 S180. Rejet : davantage de proches à S180 sur cible/11.
- B : discrimination de décisions, fenêtre 36 points ; S5 et S20 18 paires chacune. Rejet : pertes de couverture sur plusieurs profils.
- C puis C2 : égalité de score pour la diversité, seuil d'autonomie récente, neutralité S1 et faiblesse, garde Passe S1–5, rappels fondamentaux dans un slot maintenance sur objectif autorisé, même thème et contraintes conservées, bonus limité. 31 assertions unitaires distinctes ; C2 testé en V8 puis Node 22 natif.
- Les paires suivent des probabilités fixes déterministes par profil/graine/ID/séance (autonome tout juste ; intermédiaire 67 %, faible 22 %, cible 22 % sur red/second/intervenir/contre et 77 % ailleurs ; aide 65 % + aide 70 % ; Passe 6 % pour Passe et 85 % ailleurs). Ce modèle est une décision de simulation M4, pas une reproduction du modèle apprenant M6 ni une preuve d'apprentissage humain.

## Résultats natifs

[Run 45903282935](https://github.com/CapGui13/QPJB/actions/runs/45903282935) : 18/18 jobs success ; 6 profils × 3 graines × deux bras × 180 séances × 10 questions = 64 800 présentations, 6 480 séances. Logs réellement lus, checkpoints intégraux dans `native-checkpoints-1.json` et `native-checkpoints-2.json`. Les artefacts de ce run contiennent les traces complètes avant/après, conservation configurée 14 jours. Les traces S5 et S20 sont aussi committées dans cette branche. Les traces S180 complètes de la matrice ne sont pas toutes archivées dans Git ; cible/11 V8 compactée est committée. La branche technique #434 a été ouverte séparément pour exécuter le checkout exact : aucun workflow ajouté à la PR #427.

Les totaux ci-dessous sont des sommes par trajectoire, pas des nombres de concepts ou familles globalement uniques. Les paires de décision/proximité sont des proxys explicites ; nearRecent = même signature vue dans les deux séances précédentes ; proof = concept avec réponses autonomes sur au moins deux familles et deux séances ; coreDebt = somme à chaque séance de max(0, écart depuis dernière exposition – 6) pour 9 concepts fondamentaux déjà exposés ; themeDebt idem pour 7 thèmes. Ce sont les règles M4, pas la définition historique exacte de #409. Aucune moyenne ne neutralise les régressions individuelles.

| Horizon | Paires proches | Paires décision | Proches récentes | Dette concepts | Familles | Concepts | Preuves | N4/5 |
|---|---|---|---|---|---|---|---|---|
| S5 | 40 → 34 | 262 → 240 | 74 → 65 | 0 → 0 | 823 → 823 | 234 → 234 | 93 → 92 | 0 → 0 |
| S20 | 96 → 87 | 449 → 423 | 131 → 122 | 1 → 4 | 3208 → 3208 | 854 → 851 | 356 → 347 | 1 → 2 |
| S65 | 97 → 87 | 509 → 481 | 181 → 161 | 1114 → 1104 | 10230 → 10226 | 1754 → 1757 | 1202 → 1191 | 913 → 901 |
| S153 | 111 → 100 | 589 → 542 | 331 → 261 | 162013 → 166500 | 23821 → 23800 | 1782 → 1782 | 1443 → 1444 | 5415 → 5482 |
| S180 | 128 → 109 | 649 → 591 | 408 → 332 | 228622 → 234376 | 25806 → 25802 | 1782 → 1782 | 1520 → 1515 | 6813 → 6825 |

170 substitutions directes du classement, hors effets en cascade. Zéro inéligible, doublon d'ID/famille intra-séance, séance courte, violation des gardes S1–3 implémentées ; reprise vérifiée à S1/5/20/65/153/180. Dette thématique mesurée nulle selon le proxy M4. Les tests ne couvrent pas intégralement toutes les gardes historiques.

### S180 — détail par profil/graine

| Profil | Graine | Décisions | Proches récentes | Dette concepts | Familles | Preuves | N4/5 |
|---|---:|---|---|---|---|---|---|
| aide | 11 | 30 → 30 | 29 → 29 | 7453 → 7453 | 1238 → 1238 | 64 → 64 | 152 → 152 |
| aide | 47 | 31 → 31 | 23 → 23 | 7787 → 7787 | 1234 → 1234 | 57 → 57 | 148 → 148 |
| aide | 103 | 43 → 38 | 23 → 25 | 7753 → 7630 | 1228 → 1231 | 53 → 53 | 142 → 145 |
| autonome | 11 | 43 → 31 | 21 → 9 | 17603 → 15704 | 1556 → 1556 | 99 → 99 | 566 → 571 |
| autonome | 47 | 43 → 31 | 21 → 9 | 17603 → 15704 | 1556 → 1556 | 99 → 99 | 566 → 571 |
| autonome | 103 | 43 → 31 | 21 → 9 | 17603 → 15704 | 1556 → 1556 | 99 → 99 | 566 → 571 |
| cible | 11 | 34 → 33 | 18 → 11 | 16960 → 16251 | 1513 → 1512 | 93 → 94 | 440 → 439 |
| cible | 47 | 33 → 33 | 19 → 19 | 16513 → 19052 | 1523 → 1513 | 95 → 94 | 453 → 443 |
| cible | 103 | 38 → 29 | 20 → 22 | 8087 → 16958 | 1500 → 1514 | 93 → 94 | 443 → 446 |
| faible | 11 | 34 → 34 | 27 → 27 | 9806 → 9806 | 1231 → 1231 | 64 → 64 | 145 → 145 |
| faible | 47 | 34 → 34 | 22 → 22 | 4519 → 4519 | 1237 → 1237 | 58 → 58 | 151 → 151 |
| faible | 103 | 35 → 37 | 28 → 25 | 6305 → 7172 | 1237 → 1234 | 69 → 63 | 151 → 148 |
| intermediaire | 11 | 27 → 32 | 23 → 25 | 15015 → 25463 | 1525 → 1544 | 96 → 96 | 472 → 482 |
| intermediaire | 47 | 39 → 37 | 24 → 20 | 12481 → 7946 | 1526 → 1505 | 97 → 92 | 473 → 447 |
| intermediaire | 103 | 38 → 33 | 21 → 11 | 13437 → 16266 | 1517 → 1524 | 93 → 96 | 459 → 467 |
| passe | 11 | 37 → 35 | 26 → 22 | 14904 → 14337 | 1530 → 1535 | 96 → 96 | 493 → 499 |
| passe | 47 | 33 → 27 | 22 → 13 | 12378 → 12218 | 1552 → 1530 | 98 → 98 | 499 → 496 |
| passe | 103 | 34 → 35 | 20 → 11 | 22415 → 14406 | 1547 → 1552 | 97 → 99 | 494 → 504 |

## Modification réelle et contre-exemples

Autonome/11 à S5 : 20→13 paires de décision, 4→2 proches, 2→0 proches récentes, 50 familles / 13 concepts / 7 preuves inchangés. S3 substitution directe SEF-016-1 → SEF-N026-1 pour éviter une variante proche déjà réussie, à score historique 352 identique. Les fiches `fiches-s1-s5.md` et les traces détaillent les autres changements et les mains réelles. Faible/47 et Passe/47 à S5 restent identiques. Cible/11 S116 : SEF-N126-1 → SEF-V411-018, score 335 identique, bonus rappel fondamental +13 après 12 séances sans exposition, dans le slot maintenance.

**Régressions bloquantes :** cible/47 S20 24→16 preuves, 50→49 concepts, 6→9 paires proches ; intermédiaire/11 S180 dette 15015→25463 ; cible/103 S180 dette 8087→16958 ; faible/103 S180 69→63 preuves et dette 6305→7172. Passe/47 S180 familles 1552→1530. Même une substitution locale limitée peut modifier les futurs choix via l'historique. C2 n'est pas activable. Pas de seuil abaissé après échec.

## Limites / reste

- Les issues #419/#423 ont été lues, historique #293, #365, #375–409 consulté par lots et moteur effectif inspecté ; je n'atteste pas une lecture exhaustive de tous les commentaires, archives historiques et tests associés. Les références tronquées restent non visées.
- Le registre couvre structurellement le catalogue, les traces les occurrences simulées. Pas de qualification éditoriale manuelle de chaque question/contraste ni motif individuel de l'ordre final (M2).
- Les traces natives S6–65 contiennent les séances ordonnées mais une synthèse pédagogique narrative de chacune n'est pas achevée ; les artefacts sont temporaires. Pas de recette indépendante M6, ni intégration réelle M1–M5, ni toutes suites historiques #385/#395/#409, ni Chromium/WebKit. Aucun déploiement, publication ou merge.
- Le classement modifie effectivement les IDs dans les simulations, mais n'a pas démontré de gain robuste pour tous les profils. Garder la référence en production. La réduction des effets en cascade et le rappel des fondamentaux exigent une nouvelle proposition et une nouvelle recette, non un ajustement cosmétique.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.**
