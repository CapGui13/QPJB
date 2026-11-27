# Bilan #508 — reprise 6 B
Base figée 13966e475cf986c6f76e7faf870377fdf4ef99aa. PR principale brouillon #518, technique #517 (ne jamais fusionner). Verdict HOLD, aucun raccordement.

## Décisions pédagogiques
Les 15 items de première enchère Texas (9 mains faibles, 6 fortes) demandent une même décision de transfert. La force détermine la continuation, pas ce premier transfert. Une différence de main ne suffit donc pas à justifier un prérequis. Les 6 substitutions historiques S5 ne doivent pas être réintroduites (les 5 substitutions M6 effectivement observées sont consignées dans historique-505-regressions.json).
Le graphe graphe-decisions.json examine 141 QCM Texas/Stayman 1SA/2SA et 35 arêtes historiques. Seules 8 continuations (6 Texas, 2 Stayman) ont été requalifiées dans le code isolé ; aucune édition du catalogue. SX exige une exposition directe et protège le rappel exact, les notions fragiles et la session active. E accepte aussi un contraste explicitement enseigné dans le corrigé, et ne bloque que si une continuation décodée, déjà éligible, de même concept et difficulté existe. Une exposition, même explicite, ne devient jamais une preuve d'autonomie.
Contre-exemple concret : SEF-037-1 donne le Texas Cœur, mais son corrigé dit explicitement « 2♥ direct serait un Texas Pique ». SX ne reconnaissait pas cet enseignement ; E le reconnaît. Les simples mentions dans une séquence ne sont pas créditées.

## Recettes réelles
155 assertions unitaires exécutées sur le catalogue figé 1915 QCM/99 notions. Catalogue intégré identique octet pour octet et blob metadata identique à la base historique #419. SX intermédiaire/47 S180 : 62 sets M6 changés, avertissements difficulté S65/153/180 et inversion S11 déplacée S59 (HOLD). E intermédiaire/47 S180 : aucun changement ni alerte pédagogique sur les deux modèles.
Recette Node CI complète [46018012459](https://github.com/CapGui13/QPJB/actions/runs/46018012459), SHA bbb9a2d23d1d7a32ffeb1f32410fcfe8e233a6fe : 18/18 jobs success, six profils × trois graines × deux modèles appariés, S180 (129600 présentations). Horizons S5,20,65,153,180. Aucun changement de comparateur, seuil, quota, score, ordre final, rappel ni preuve. Résumés bruts E-ci-1/2/3.json, traces complètes dans les artifacts du run. E-gate.json applique le comparateur D original à la matrice entière et contient le rapprochement individuel des anciennes alertes.
 
| Indicateur E | Référence intégrée | Candidat |
|---|---:|---:|
| Inversions spécifiques M6 | 4 | 0 |
| Inversions spécifiques D | 5 | 0 |
| Sets changés M6 | 0 | 457 |
| Sets changés D | 0 | 578 |
| Alertes strictes M6 | 0 | 145 |
| Alertes review M6 | 0 | 2 |
| Alertes agrégées D | 0 | 44 |
| Régressions D hors observations latence | 0 | 188 |
| Anomalies structurelles D | 0 | 0 |
| Dette fondamentale D S180 | 228622 | 230875 |
| Preuves D S180 | 1520 | 1495 |
| Indépendance D S180 | 19247 | 19219 |

Les neuf inversions spécifiques ne sont pas comparables aux 15 inversions de la métrique historique plus large, car elles portent sur les vraies décisions de continuation. Stayman ciblé : aucune inversion. Les neuf inversions spécifiques concernent exclusivement le Texas Pique.
Comparateur D : HOLD, earlyGain=false, debtGain=true (au moins un gain individuel, non une baisse agrégée), 44 violations. M6 strict et review non conformes. 17/122 anciennes lignes individuelles et 5/53 agrégées réapparaissent sur les mêmes clés profil/graine/horizon/métrique/concept ; 171 nouvelles régressions individuelles. Les autres anciennes lignes ne sont pas reproduites par E, ce qui ne prouve pas une résolution pédagogique. Aucune compensation entre élèves.

## Origine observable des divergences
| Modèle | Profil/graine | Première substitution | Première exposition de la cible après | Alertes individuelles/strictes |
|---|---|---|---|---:|
| M6 | intermédiaire/11 | S11 020-1 → V44-028 | S20 | 33 |
| M6 | aide/103 | S13 020-1 → V44-028 | S48 | 31 |
| M6 | aide/11 | S10 019-3 → 017-1 | S148 pour 019-3, S47 pour 020-1 | 81 |
| D | intermédiaire/103 | S14 020-1 → V44-028 | S35 | 29 |
| D | faible/47 | S15 020-1 → V44-028 | S32 | 57 |
| D | faible/103 | S15 020-1 → V44-028 | S31 | 47 |
| D | aide/47 | S13 020-1 → V44-028 | S55 | 55 |
| D | aide/11 | S19 020-1 → V44-028 | S25 | 0 |

IDs abrégés : SEF-V3-020-1, SEF-V3-019-3, SEF-V3-017-1 et SEF-V44-028. Les huit trajectoires divergentes sont identifiées ; la substitution entraîne une autre histoire de réponses et de sélection. Les pertes tardives de preuve/dette dans des concepts non Texas sont observées après cette bifurcation, pas imputées causalement à chaque item sans expérience contrefactuelle supplémentaire. Le filtre local n'est pas sûr pour l'adaptation longitudinale. Les 155 assertions et les jobs verts valident l'exécution, pas la décision pédagogique.

## Décision de reprise
Ne pas activer SX ni E. Conserver intégralement le parcours intégré. Pour une nouvelle expérimentation, tester séparément la seule trajectoire D aide/11 dont deux sets changent sans régression D, mais ne jamais en dériver une règle de profil/graine : chercher une condition stable sur état pédagogique réel, puis revalider la matrice entière. Examiner en priorité la réactivation/protection des preuves à partir du premier changement et les alternatives de continuation explicitement décodées ; ne pas créer de crédit par simple exposition. Pas de modification de score, quota ou ordre hors contrat.
Limites : pas de clone local (DNS), pas de recette navigateur ni de nouvelle exécution intégrale de la référence historique #419 ; le run Node compare référence intégrée et E, contrôle la structure et les gardes du banc, et les vérifications d'identité du catalogue/métadonnées sont réelles. Pas de relecture individuelle des 1915 questions ; ciblage documenté sur les 141 concernées. Les 53/122 lignes historiques sont conservées et rapprochées, mais leur causalité individuelle n'est pas démontrée. Pas de fusion, pas de publication, pas de changement production.
**MISSION DÉFINITIVEMENT TERMINÉE : NON — bénéfice local démontré, non-régression non satisfaite.**
