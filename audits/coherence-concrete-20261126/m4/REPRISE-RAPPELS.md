# Reprise M4 — réactivation des fondamentaux et contrastes naturels

## Statut : HOLD global ; D seul candidat prudent à revoir

Contrats #419/#423, base 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Aucun fichier de production modifié. D : [gate natif PASS](https://github.com/CapGui13/QPJB/actions/runs/45904633487/job/140202123923), trois substitutions, zéro violation du gate sur 18 trajectoires et cinq horizons, #438 fermée sans fusion. Gain très faible et aucune réduction de la dette.

## Cause vérifiée sur le parcours réel

Trace de référence cible/11 S180 (blob e9083afc1cbbdcd6b4fd2c4169764d22274bf3ad, archive variant-c2-s180/cible-11.json ; bras before). Catalogue réel 1915 QCM et table de prérequis. Les données par concept suivantes ont été recomptées depuis les lignes ordonnées. Les familles inédites à S65 ne constituent pas une preuve d'éligibilité.

| Concept | Familles au catalogue | Familles encore inédites à S65 | Dernière apparition | Absence finale S180 | Dette |
|---|---:|---:|---:|---:|---:|
| ouv.passe | 9 | 0 | 72 | 108 | 5288 |
| ouv.mineure | 29 | 12 | 180 | 0 | 325 |
| ouv.majeure | 11 | 1 | 175 | 5 | 1338 |
| ouv.sa1 | 9 | 0 | 142 | 38 | 3253 |
| mineur.base | 64 | 33 | 178 | 2 | 45 |
| majeur.base | 42 | 25 | 176 | 4 | 226 |
| majeur.soutien | 24 | 5 | 176 | 4 | 371 |
| sa1.seuil | 17 | 2 | 65 | 115 | 6002 |
| red.base | 65 | 44 | 179 | 1 | 112 |

La priorité de choix des familles inédites, le budget de répétition 0/1/2 et la disparition de la réservation explicite de fondamentaux à S66 sont trois contraintes du moteur réel. Les deux premières peuvent exclure des familles pourtant éligibles ; la troisième réduit les occasions de rappel. Ceci ne prouve pas qu'elles sont l'unique cause de chaque lacune.

## Variantes produites et exécutées

- F : départage après sélection complète, maintenance native seulement, score à 31 points, même thème/niveau, cible connue et absente >=12 séances, ancien concept récemment prouvé. G : même règle avec autorisation expérimentale de neutraliser le seul bonus de nouveauté de 250 points dans le budget de répétition non prioritaire. L'exception G n'est pas le contrat rank() standard. Sur cible/11 jusqu'à S180, F et G sont exactement neutres (0 changement).
- H : proposition d'un créneau de maintenance non utilisé après toutes les priorités natives, S66+, un seul rappel par séance, cible exposée absente >=18 séances, famille absente >=8, niveau <=3, stage <=1, native choose() inchangé. Le plan fictif autorise explicitement la priorité de rappel et l'exception au budget de répétition comme pour le créneau historique S21–65. Ce changement de politique exige le visa du coordinateur et le vrai plan M1, pas une activation par M4.
- I : même H avec deux fenêtres consécutives de cinq séances complètes, >=30 réponses autonomes sur 50 dans chacune, <=10 réponses assistées/corrigées dans chacune ; abstention si historique incomplet. Seuil fixé avant recette I, hypothèse prudente non calibrée sur des élèves humains.
- J : variante de réponse naturelle différente sur le même contexte et concept S3–5, deux familles locales réussies sans aide, substitution atomique du seul slot, score au plus 24 points inférieur, pas d'effet sur la sélection des autres neuf questions. Matrice V8 S20 complète (18 paires, 7200 présentations), 0 changement, toutes trajectoires identiques : ne pas activer.

### Résultats S180 V8 effectivement exécutés sur moteur/catalogue et dépendances de sélection exacts (graine 11)

Modules hors sélection non utilisés remplacés par des proxies levant une exception à l'accès ; zéro accès constaté. Le tableau est un relevé de sortie V8, pas la recette native complète. Le bras témoin reproduit les checkpoints natifs D/C2. Les preuves sont un proxy multi-famille/multi-séance, les réponses simulées ne sont pas un apprentissage humain.

| Politique / profil | Réservations | Dette | Preuves | Familles | N4/5 | Réponses autonomes |
|---|---:|---:|---:|---:|---:|---:|
| F cible | 0 | 16960→16960 | 93→93 | 1513→1513 | 440→440 | 1137→1137 |
| G cible | 0 | 16960→16960 | 93→93 | 1513→1513 | 440→440 | 1137→1137 |
| H cible | 25 | 16960→2386 | 93→95 | 1513→1510 | 440→444 | 1137→1179 |
| H faible | 17 | 9806→1482 | 64→57 | 1231→1230 | 145→144 | 408→390 |
| H autonome | 29 (+1 D) | 17603→2602 | 99→99 | 1556→1556 | 566→561 | 1800→1800 |
| I faible | 0 | 9806→9806 | 64→64 | 1231→1231 | 145→145 | 408→408 |
| I aide | 0 | 7453→7453 | 64→64 | 1238→1238 | 152→152 | 370→370 |
| I cible | 19 | 16960→3373 | 93→92 | 1513→1506 | 440→438 | 1137→1174 |
| I intermédiaire | 23 | 15015→2665 | 96→94 | 1525→1514 | 472→458 | 1183→1180 |
| I Passe | 27 | 14904→2260 | 96→96 | 1530→1533 | 493→488 | 1492→1504 |

Zéro inéligible, doublon ID/famille intra-séance, séance courte, violation des gardes précoces implémentées sur ces paires. H autonome S153 perd 11 familles et augmente les proches récentes de 15 à 17 ; I Passe S153 perd 13 familles et S180 gagne une paire proche. I cible et intermédiaire perdent des preuves. H et I restent HOLD selon les critères stricts inchangés ; pas de moyenne pour annuler une régression. L'effet sur la dette est néanmoins réel dans les simulations.

Exemple H cible/11 : S80 rappel SEF-N019-2 (ouv.sa1), absent 18 séances, famille vue 64 séances auparavant ; S84 V2-M2-029 (sa1.seuil), absent 19 séances, famille vue il y a 25 ; S90 SEF-V49-003 (ouv.passe), absent 18 séances. Dernière apparition de Passe : S72→S172 ; seuils 1SA : S65→S171 ; ouverture 1SA : S142→S166. L'exception au budget se manifeste explicitement (budget 1, total répété 2 dans ces slots). Le coordinateur doit arbitrer ce coût, aucun contournement silencieux.

## Tests et preuve indépendante

23 assertions F/G, 27 H/I, 22 J et 10 assertions du vérificateur de traces exécutées avec succès en V8 sur sources exactes, 82 assertions supplémentaires par rapport à la précédente reprise D/E. Le vérificateur `tests/coherence-concrete-m4-recall-audit.cjs` recalcule la dette et les preuves, vérifie les dates de rappel, l'absence terminale, les réservations, la garde I et les régressions par horizon. Rejoué sur l'archive C2 cible/11 S180 réelle (dette 16960→16251, quatre régressions signalées, HOLD). Les assertions de la fixture ne comptent pas deux fois une même famille comme preuve. Une réservation suivie d'un second cas du même concept est signalée comme régression, pas comme falsification de la trace.

Recettes natives déclenchées, à la dernière observation toujours en file :
- F/G, 36 paires : [run 45906411851](https://github.com/CapGui13/QPJB/actions/runs/45906411851), #441.
- H, 18 paires : [run 45906730290](https://github.com/CapGui13/QPJB/actions/runs/45906730290), #442.
- I, 18 paires : [run 45907248524](https://github.com/CapGui13/QPJB/actions/runs/45907248524), #443.
Ne pas assimiler jobs en attente à des tests réussis. Chaque recette checkout le SHA figé de sa variante. Les PR techniques ne doivent jamais être fusionnées.

## Arbitrage de raccordement

Une fonction rank bornée appelée après le filtre unseen ne peut pas ressusciter une famille éliminée en amont. Pour obtenir un rappel fondamental quand le réservoir est épuisé, le coordinateur doit autoriser explicitement un créneau de maintenance sur objectif M1, au plus une fois, après tous les rappels prioritaires et les priorités thématiques. H/I matérialisent ce point d'injection dans un banc isolé, sans toucher à la production ; les régressions empêchent de les recommander en l'état. Le banc M6 doit également éprouver les réponses avec oubli/maîtrise simulés et les interactions M1/M2/M3, pas seulement la réponse pseudo-aléatoire par ID. Il reste à comparer les résultats natifs, revoir la politique sur les profils fragiles et vérifier les gardes historiques et navigateurs. La revue éditoriale exhaustive et toutes les archives historiques ne sont pas attestées.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.** Aucun merge, aucune publication.
