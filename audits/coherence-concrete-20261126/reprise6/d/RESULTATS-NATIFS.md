# Recette native T seule — reprise 6 D

**Provenance.** Run [46016213848](https://github.com/CapGui13/QPJB/actions/runs/46016213848), SHA technique 4900c2a9b7dda62f2e3b2fb95d6fe0a9274726a6, source D aa88be3577048bd99ad342cba4c37d20266fb67a, base 13966e475cf986c6f76e7faf870377fdf4ef99aa. 18/18 jobs natifs PASS. Le run complet est rouge à cause du test navigateur (sélecteur de test .meta ambigu), pas des jobs natifs. Le gate agrégé a été exécuté séparément sur les 18 sorties réelles avec le comparateur D original ; voir ci-native-gate.json. Les artefacts de chaque job contiennent les traces exhaustives, les résumés permanents sont dans ci-native-summaries.json.

## Comparaison historique, mêmes profils et graines, sans consolidation

| Indicateur | Ordre complet | T seule |
|---|---:|---:|
| M6 paires proches S5 | 38 | 35 |
| M6 paires proches S20 | 100 | 97 |
| D paires proches S5 | 40 | 37 |
| D paires proches S20 | 96 | 93 |
| D dette fondamentale S180 | 228622 | 228622 |
| M6 inversions Texas | 15 | 15 |
| M6 inversions Stayman | 0 | 0 |
| Alertes strictes M6 / D individuelles / transitions | — | 0 / 0 / 0 |

Gate étroit T : CANDIDAT_A_REVOIR. Gate M4 complet : HOLD (pas d'amélioration de dette). Aucun relâchement des critères. Les deux modèles utilisent les règles de réponse et comparateurs d'origine, et la référence historique est contrôlée pour le catalogue et les métadonnées.

## Recette supplémentaire avec consolidations

36 paires (18 profils/graines × deux modèles), 180 séances guidées par bras, soit 12 960 séances guidées au total pour cette recette intercalée, plus 3582 consolidations effectivement terminées. 4158 reprises export/import réussies sur les deux bras ; 0 alerte supplémentaire selon les critères explicités dans -run.cjs. Les consolidations ont la même fréquence par profil/seed dans les deux bras. T n'est jamais appelée dans le mode consolidation, ni en reprise active. Les réponses autonomes seules sont preuves ; les consolidations ne modifient pas la maîtrise.

| Profil | Graine | M6 gain S5 | D gain S5 | Consol. D avant/après | Consol. M6 avant/après | Alertes suppl. |
|---|---:|---:|---:|---:|---:|---:|
| aide | 11 | 0 | 0 | 60/60 | 60/60 | 0 |
| aide | 47 | 0 | 0 | 60/60 | 60/60 | 0 |
| aide | 103 | 0 | 0 | 60/60 | 60/60 | 0 |
| autonome | 11 | 1 | 1 | 0/0 | 0/0 | 0 |
| autonome | 47 | 1 | 1 | 0/0 | 0/0 | 0 |
| autonome | 103 | 1 | 1 | 0/0 | 0/0 | 0 |
| cible | 11 | 0 | 0 | 60/60 | 57/57 | 0 |
| cible | 47 | 0 | 0 | 59/59 | 59/59 | 0 |
| cible | 103 | 0 | 0 | 59/59 | 57/57 | 0 |
| faible | 11 | 0 | 0 | 60/60 | 60/60 | 0 |
| faible | 47 | 0 | 0 | 60/60 | 60/60 | 0 |
| faible | 103 | 0 | 0 | 60/60 | 60/60 | 0 |
| intermediaire | 11 | 0 | 0 | 60/60 | 60/60 | 0 |
| intermediaire | 47 | 0 | 0 | 60/60 | 60/60 | 0 |
| intermediaire | 103 | 0 | 0 | 60/60 | 60/60 | 0 |
| passe | 11 | 0 | 0 | 60/60 | 60/60 | 0 |
| passe | 47 | 0 | 0 | 60/60 | 60/60 | 0 |
| passe | 103 | 0 | 0 | 60/60 | 60/60 | 0 |

## Registre des substitutions directes

Les trois événements sont S3/autonome (11, 47, 103), pour chaque modèle. Aucune autre substitution directe, aucune dans les profils non autonomes. Les résultats V8 natifs ciblés reproduisent les trois graines et les cas fragiles (voir native-smoke.json et native-targeted.json).

| QCM | Main P/C/K/T | H | Distribution | Réponse | Famille |
|---|---|---:|---|---|---|
| SEF-005-2 | R87 / A84 / AR74 / AR10 | 21 | 3-3-4-3 | 2SA | cas-005 |
| SEF-005-1 | RV8 / ARV / 10982 / ARV | 20 | 3-3-4-3 | 2SA | cas-005 |

Ancien doublon : SEF-004-1 et SEF-005-2, tous deux 21 H réguliers et ouverture 2SA (signature normalisée 4-3-3-3). SEF-004-1 reste présent. Nouveau contraste : limite basse 20 H et exemple 21 H, même enchère naturelle, même famille du QCM remplacé, même niveau 1, même contexte et prérequis, coût moteur nul. Ce n'est pas une nouvelle compétence, mais un contraste utile de force dans la plage 20–21 H. L'ancien exemple n'est pas supprimé du catalogue. Le garde des deux séances parfaitement autonomes est essentiel : les profils fragiles ne perdent pas d'exposition. L'ordre complet se recalcule après composition ; le QCM passe de la position 7 à 6.

| Position S3 | Avant | Après |
|---:|---|---|
| 1 | SEF-N012-1 | SEF-N012-1 |
| 2 | SEF-N046-3 | SEF-N046-3 |
| 3 | SEF-V49-013 | SEF-N081-1 |
| 4 | SEF-V49-010 | SEF-N017-2 |
| 5 | SEF-N017-2 | SEF-016-1 |
| 6 | SEF-016-1 | SEF-005-1 |
| 7 | SEF-005-2 | SEF-V49-013 |
| 8 | SEF-N081-1 | SEF-V49-010 |
| 9 | SEF-N026-1 | SEF-004-1 |
| 10 | SEF-004-1 | SEF-N026-1 |

**Contre-exemples rejetés.** Un Passe ou une meilleure mineure/fit 5–3 protégés, un candidat de famille différente ou de réponse/prérequis/difficulté différents, une substitution hors strate de score, une réponse récente aidée ou erronée, une répétition proche déplacée d'un horizon à l'autre, ou une consolidation : aucun n'est admissible par T. L'absence de substitution dans les 15 trajectoires non autonomes par modèle est un contrôle négatif réel. Une séance S3 simplement passée ne suffit pas à constituer une faiblesse attestée (native-targeted.json), d'où la correction du banc navigateur pour produire de vraies réponses erronées avant de demander une consolidation.

**Limites.** Tests simulés, pas preuve d'efficacité d'apprentissage humain ; aucune activation de T ni de HOLD. La recette navigateur reste un gate distinct à documenter après résultat. La dette M4 reste HOLD. Les traces complètes sont en artefacts CI temporaires, résumés et registre permanents versionnés.
