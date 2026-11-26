# M6 — Laboratoire d'apprentissage et qualité durable

Contrat #396, mission #402. Base immuable : `d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7`.
Branche exclusive : `apprentissage-durable/m6-validation`. Aucun module de production, catalogue, prérequis, sauvegarde existante, workflow actif ou autre branche modifié. Aucun déploiement.

## 1. Cartographie initiale et décisions

Sources : contrats #396/#402 ; recettes et historique #385/#395, #377–#395, #293, #366–#369, #365, #375/#376, #255/#256, #271/#364 ; référentiel pédagogique SEF. Lecture du moteur réel, des politiques de séance, du catalogue embarqué, des métadonnées, du diagnostic, des recettes et des mécanismes de build/cache/export pertinents. Les accords locaux et dossiers HOLD historiques ne sont pas réinterprétés : les exercices de la base sont une référence immuable, pas une nouvelle validation pédagogique.

La base comporte **1 915 exercices, 99 concepts, 22 rubriques**. Les recettes à probabilités de réussite fixes sont utiles pour la stabilité du moteur et la couverture, mais ne peuvent pas représenter l'apprentissage, l'oubli calendaire ou le transfert. Une réussite répétée n'est pas nécessairement autonome ; le nombre de concepts vus n'est pas le nombre de concepts durablement appris.

Objectifs retenus : 6 profils × 3 graines × S180, mêmes graines et univers de sondage pour référence et candidat ; aucun doublon de famille, aucune inéligibilité, dix QCM par séance normale ; préservation S1–S3 et Passe ; sauvegarde/reprise exacte ; métriques par trajectoire et distribution, pas seulement moyenne ; scénarios de sensibilité, interruption et confusion. Aucun seuil cognitif n'est présenté comme validé scientifiquement.

## 2. Code opérationnel

- `quizz-durable-m6-lab.js` : UMD CommonJS/navigateur, modèle synthétique indépendant, profils et graines déterministes, évolution conceptuelle, oubli temporel, familiarité de famille, difficultés persistantes, aide, correction, abandon, reprise, sondes sans familiarité, compteurs de preuves autonomes et de transfert. Les paramètres (force initiale, apprentissage, demi-vie, difficulté, aide, etc.) sont des hypothèses.
- `tests/durable-m6-campaign.cjs` : extrait le catalogue réel, charge les vrais modules du moteur #395 au SHA figé ; injecte l'horloge en mémoire. Seul un point d'instrumentation non persistant expose l'éligibilité en lot. API de comparaison appariée, base/candidat, contrôle des exercices historiques et métadonnées, reprise interversion, ancien export, mesures. Les écarts déclenchent une revue individuelle, ils ne sont pas un visa automatique.
- `tests/durable-m6-unit.cjs` : assertions déterministes et fixtures des contrats M1–M5, indépendantes de leurs branches. Elles ne constituent pas une recette des implémentations M1–M5.
- `tests/durable-m6-register.cjs` : contrôle exhaustif de la matrice, événements, comptabilité des réponses, checkpoints et statut des scénarios ; produit le registre JSON et les distributions min/médiane/max/moyenne.
- `tests/durable-m6-assets.cjs` : contrôle des liens locaux et versions, cache et build ; le laboratoire ne doit jamais être publié comme dépendance du quiz.
- `tests/durable-m6-browser.cjs` : recette native Chromium/WebKit, contextes froids, 2 largeurs × 3 répétitions, chargement, parsing, sélection, tailles et mesures mémoire/CPU navigateur quand exposées.
- `workflow-proposal.yml` : proposition CI inactive, contrôles rapides, matrice lourde, sensibilité appariée, sémantique, navigateurs et offline ; déclencheurs par chemins, manuel et périodique. Seul le coordinateur peut l'activer.

## 3. Campagne de référence réellement exécutée

Exécution JavaScript V8 des sources récupérées par le connecteur GitHub au SHA exact, sans mocks du moteur. Horloge simulée ; chronométrage réel distinct. Les six fichiers baseline contiennent les événements de séance et checkpoints S20/S65/S153/S180. `register.json` fournit les distributions intégrales et les 37 unités recensées (33 initiales, 4 complémentaires).

**18 trajectoires, 3 240 séances, 32 400 réponses simulées, 294 reprises, 72 exports vérifiés.** 0 inéligibilité, 0 doublon de famille, 0 séance courte. Toutes les trajectoires couvrent 99 concepts et 22 rubriques à S180.

| Profil | Concepts avec preuves autonomes (S180, min–max) | Familles distinctes | Sonde synthétique J+30 | Dette (concept-séances) |
|---|---:|---:|---:|---:|
| Autonome | 83–88 | 1 450–1 486 | 45,99–46,73 % | 4 480–4 917 |
| Intermédiaire | 58–61 | 1 246–1 256 | 13,88–15,05 % | 4 591–4 925 |
| Faible | 20–26 | 1 160–1 204 | 4,61–4,90 % | 5 321–5 417 |
| Ciblé | 44–50 | 1 220–1 230 | 11,20–11,67 % | 4 714–5 110 |
| Aide | 43–48 | 1 220–1 225 | 12,70–13,40 % | 4 851–5 040 |
| Passe | 60–68 | 1 220–1 264 | 17,50–18,11 % | 4 378–4 700 |

Preuve : au moins deux familles et deux séances de réussite autonome ; la sonde J+30 est une espérance interne du modèle sur l'univers fixe, et non un taux constaté chez des élèves. Les chiffres très bas du profil faible sont dépendants des hypothèses de départ. La dette est cumulée, non un stock de révisions à prescrire. Les valeurs de transfert ne confondent pas famille connue et famille nouvelle ; les sondes sans opportunité sont nulles au sens « non mesurable », jamais converties en zéro.

## 4. Avant/après méthodologique et sensibilité

Même moteur, même profil intermédiaire, graine 47, S65. Les cinq variantes supplémentaires ont été réellement rejouées, sans aucune violation.

| Hypothèse | Concepts avec preuves | Réussites autonomes | Sonde J+30 |
|---|---:|---:|---:|
| Référence (demi-vie 40 j, apprentissage 0,20) | 40 | 212 | 15,46 % |
| Demi-vie 20 j | 30 | 174 | 10,53 % |
| Demi-vie 80 j | 39 | 243 | 22,41 % |
| Apprentissage 0,10 | 38 | 184 | 12,15 % |
| Apprentissage 0,40 | 49 | 270 | 21,15 % |
| Contrôle à probabilité fixe | 40 | 178 | non interprétable |

Le contrôle fixe est celui du laboratoire, pas la reproduction exacte des anciennes probabilités #395. Sa sonde est un a priori sans apprentissage et reste identique à J+7/J+30 (16,29 %). Il ne mesure pas la rétention. Les changements de paramètres influencent fortement les résultats : ne pas optimiser le moteur sur une seule hypothèse. Les comparaisons de candidats devront conserver les paramètres, graines, identifiants historiques et sondes communes, présenter les pertes individuelles et les arbitrages.

Contre-épreuve technique avant/après : deux replays de la base exacte, profil intermédiaire 47 S20, mêmes événements et sélections, tous les deltas pédagogiques à zéro, restauration interversion du deck exact. Rejouée après l'extension sémantique. Il n'y a **aucun gain de production** revendiqué : le moteur candidat M1–M5 n'est pas intégré sur cette branche.

## 5. Confusions de règle et interruptions

L'extension optionnelle prend les catégories du diagnostic figé #395, pas celles du candidat. Recensement des 5 745 mauvaises options : 5 416 hypothèses, 329 inconnues, dont 195 hypothèses de confiance faible exclues ; 5 221 options utilisables, sur neuf catégories. Une catégorie est une hypothèse de diagnostic, pas la preuve du raisonnement de l'élève. Le scénario peut reproduire la même catégorie sur plusieurs familles/séances sans connaître les décisions d'un moteur candidat.

| Profil / graine, S65 | Erreurs ciblées sémantiques | Concepts avec confusion répétée | Jours d'interruption intra-séance |
|---|---:|---:|---:|
| ciblé / 47 | 48 | 8 | 44 |
| faible / 103 | 30 | 5 | 17 |
| aide / 11 | 24 | 4 | 15 |

195 séances / 1 950 réponses supplémentaires, zéro violation. Les trois trajectoires et les catégories sont dans `semantic-results.json`. Le modèle par défaut n'est pas modifié dans ses paramètres ni son comportement ; les interruptions temporelles et la sélection sémantique sont optionnelles.

## 6. Tests et coûts effectivement mesurés

- 4 367 assertions unitaires PASS, y compris les cinq interfaces par fixtures, preuve autonome, oubli, transfert, régression et déterminisme ; re-exécutées après extension sémantique.
- 18 trajectoires principales + 5 sensibilité S65 + 3 sémantiques S65 + deux replays S20 (hors sondes et anciens exports) = 38 000 réponses synthétiques dans ces campagnes archivées. Aucune donnée élève réelle.
- Reprise exacte et ancien export synthétique : l'ancien historique détaillé absent n'est pas inventé.
- Inventaire de 13 ressources référencées du quiz réel : 0 anomalie statique ; 5 641 088 octets bruts d'après les blobs Git (dont HTML 2 359 489, concepts 1 921 757, diagnostic 802 981 et prérequis 323 436). Ni taille gzip ni mesure de trafic complet.
- Temps réel V8 cumulé des 18 trajectoires : 428 354 ms ; P95 de sélection par trajectoire 155–199 ms. Ce n'est pas un benchmark navigateur ni une mesure de CPU.
- À S180 : états sérialisés environ 716–770 k caractères, exports environ 1,62–1,76 M caractères. Ce ne sont ni des octets ni de la mémoire résidente.

### Reproduction native (commandes livrées, non exécutées dans cet environnement)

```sh
node tests/durable-m6-unit.cjs
node tests/durable-m6-guards.cjs
node tests/durable-m6-assets.cjs
node tests/durable-m6-register.cjs
node tests/durable-m6-campaign.cjs legacy
node tests/durable-m6-campaign.cjs size
node tests/durable-m6-campaign.cjs baseline intermediaire 47 180
node tests/durable-m6-campaign.cjs pair intermediaire 47 180
node tests/durable-m6-campaign.cjs sensitivity intermediaire 47 65
node tests/durable-m6-campaign.cjs sensitivity-pair intermediaire 47 65
node tests/durable-m6-campaign.cjs semantic cible 47 65
node tests/durable-m6-campaign.cjs semantic-pair cible 47 65
python3 scripts/build_catalogue.py
python3 scripts/build_public_site.py --output _public_site
PW_BROWSER=chromium node tests/durable-m6-browser.cjs _public_site
PW_BROWSER=webkit node tests/durable-m6-browser.cjs _public_site
PW_BROWSER=chromium node tests/progression-guidee-offline.cjs _public_site
PW_BROWSER=webkit node tests/progression-guidee-offline.cjs _public_site
```

La recette proposée requiert un checkout complet avec historique du SHA figé, Node 22, Python et Playwright avec Chromium/WebKit installés. Les scripts Node incluent mesures process CPU et mémoire et tailles gzip. Les sorties de benchmark ne sont pas déterministes pour le temps réel ; les sélections et décisions doivent l'être.

## 7. Durcissement de la comparaison et contre-épreuves supplémentaires

Après la première livraison, un défaut méthodologique a été corrigé : les moyennes de transfert sur des exercices non encore vus dans chaque bras peuvent reposer sur des populations différentes. Les opportunités propres à chaque bras restent rapportées, mais une comparaison supplémentaire porte désormais sur **le même exercice, d'une famille non vue dans les deux bras**, avec une graine commune. Une empreinte déterministe de l'univers de référence, un contrôle des horizons, jours, métriques finies et sondes empêchent les comparaisons incohérentes. Une absence d'opportunité reste non mesurable. Les métadonnées historiques sont comparées sans confondre ordre des clés JSON et changement de contenu. Les flags d'autonomie doivent être explicitement faux ; une information absente ne constitue pas une preuve. Un nouveau compteur interséance est fourni à côté de l'ancien compteur de transfert, conservé pour la reproductibilité.

- `quizz-durable-m6-guards.js`, `tests/durable-m6-guards.cjs` : 131 assertions adversariales réussies ; la suite historique de 4 367 assertions a également été rejouée avec succès (4 498 assertions distinctes).
- Trois paires supplémentaires sur le moteur immuable : intermédiaire 47 S65 (1 300 réponses), ciblé 47 S65 avec catégories figées et interruptions (1 300), intermédiaire 47 S180 (3 600). Les journaux sont identiques dans les deux bras, aucune alerte ni violation, reprise exacte.
- Sur la paire S180, 41 / 88 / 77 / 74 concepts disposent respectivement d'une sonde de transfert commune à S20 / S65 / S153 / S180. Tous les deltas sont nuls. Les 1 800 réponses de référence reproduisent exactement le journal archivé ; 17 métriques historiques contrôlées à chacun des quatre checkpoints restent identiques. Les trois nouvelles paires ne constituent pas une comparaison avec les missions M1–M5.
- Le scénario sémantique apparié utilise le diagnostic figé ; 48 erreurs ciblées et 44 jours d'interruption simulés par bras, sans modifier la référence.
- Résultats archivés : `guard-results.json`, `identity-paired-s65.json`, `identity-semantic-s65.json`, `identity-paired-s180.json`. Le registre est régénéré et vérifié par le script de recette ; **6 200 réponses supplémentaires, soit 44 200 réponses synthétiques archivées au total**.
- La proposition de workflow inactive exécute désormais les garde-fous et le scénario sémantique en comparaison appariée.

Contrôle GitHub de la première PR #408 : le workflow [QPJB Training smoke](https://github.com/CapGui13/QPJB/actions/runs/45887187594) a réussi en mode TARGETED (contrôle rapide), mais les recettes lourdes ont été ignorées par leurs conditions de déclenchement. Ce succès ne constitue pas une exécution native du laboratoire, des navigateurs ou du hors ligne. Le DNS du terminal a été vérifié de nouveau et ne permet toujours pas de cloner github.com. Aucun workflow actif n'a été changé pour contourner ce blocage.

## 8. Périmètre, limites et clôture

Les fichiers sont nouveaux dans les trois emplacements autorisés. La proposition CI est volontairement hors .github/workflows. Le laboratoire ne doit pas être ajouté au build du site.

HOLD : le terminal natif ne pouvait pas résoudre github.com et obtenir le checkout complet. Les tests V8 réels ne remplacent pas la recette native Node/Chromium/WebKit, le build et l'offline réel ni les mesures CPU/RSS/chargement. L'intégration M1–M5 est extérieure au périmètre M6 et ses 18 paires avant/après ne peuvent pas être évaluées sur la branche indépendante. Les fixtures d'interface ne garantissent pas la conformité réelle des autres missions. Les accords historiques ont été lus pour préserver les invariants, sans nouvelle expertise exhaustive du contenu pédagogique ni prétention à relire chaque ancien workflow archivé.

La production du laboratoire, la campagne principale, les extensions ciblées, le registre et les scripts de recette sont livrés. Les limitations et écarts restent visibles, sans fusion ni publication. Le coordinateur dispose du dossier pour la recette native et intégrée.

**MISSION DÉFINITIVEMENT TERMINÉE : NON — validations natives et intégrées non attestées.**
