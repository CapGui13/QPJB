# Passe 3 — diagnostic causal S55, décision de transfert au coordinateur
Base 13966e475cf986c6f76e7faf870377fdf4ef99aa. Mission #507, contrat #506. PR #516. HOLD maintenu. Aucune activation.

## Test exécuté, pas une hypothèse
Banc tests/coherence-reprise6-a-s55-diagnostic.cjs (0fea4faf810c6543c587c6aa0b4e53e542dfe5ff). Il injecte un observateur de lecture seule dans la copie en mémoire du moteur figé, rejoue les deux trajectoires M6 intermediaire/103 avec les options intégrées originales, puis un témoin natif non instrumenté. L'identité des deux témoins est assertée. 3 × 57 = 171 séances ordinaires, 1710 réponses effectivement enregistrées, 9 sélections supplémentaires sur copies indépendantes. Les scénarios hybrides d'état sont UNIQUEMENT des expériences contrefactuelles, jamais des historiques valides à importer ou des états à utiliser en production.
[CI 46020917620](https://github.com/CapGui13/QPJB/actions/runs/46020917620) : 1/1 PASS, SHA technique isolé c5c9b97ff10e16e6a6cf690ff979f1cdbdb376de. Artefact 15207608547 : diagnostic.json (états, choix, strates), summary.json. Contrôle croisé des traces de la recette précédente [46019269199](https://github.com/CapGui13/QPJB/actions/runs/46019269199), artefact 15208101725.

## Ce qui déclenche la divergence
- S5 : natif SEF-V416-002 (1♣–1♦ → 2♦, 13 H, 2-2-4-5, famille v416-cas-002) ; candidat SEF-V49-037 (même séquence, 1SA, 13 H, 2-3-3-5, famille v49-037). Deux succès autonomes. Le gain de couverture du rôle régulier est réel.
- S6–54 : ensembles de QCM identiques, résultats des questions communes identiques (correct/faux, aide, première erreur). L'ordre des questions peut différer ; pas d'affirmation d'égalité des historiques complets.
- À l'entrée de S55 : seules deux entrées QCM diffèrent (SEF-V416-002 et SEF-V49-037) ; les champs skills, micros, journal diffèrent également. Cible locale red.base = 2 dans les deux bras.
- Dans le créneau de transfert natif S55, SEF-V416-002 a déjà été rencontré (lastFamily=4, index interne zéro-based) et est écarté par la préférence aux familles inédites. SEF-044-1 et SEF-V49-037 sont inédits, tous deux à 301 points. Le natif retient SEF-044-1, 1SA, correct sans aide.
- Dans le candidat, SEF-V416-002 est inédit et éligible, SEF-V49-037 est déjà rencontré. SEF-V416-002 vaut 325 points contre 301 pour SEF-044-1. Le moteur retient 2♦ ; le modèle de réponse M6 produit une erreur. La différence de 24 points est cohérente avec la pénalité native de réponse déjà présente ; la causalité du choix est démontrée par les ablations ci-dessous, pas déduite d'un score seul.
- S56 : même ensemble. S57 : changement de red.base et sa1.stayman.suite vers red.bicolore et fortes.ouverture. Le modèle M6 dépend de l'ID, de la séance et de la graine : la divergence de réponse est simulée, pas une preuve d'apprentissage humain.

## Ablations S55 (rejeu du sélecteur exact, sans toucher les deux vrais états)
| État de la sonde | Ensemble natif | Ensemble candidat | QCM divergent |
|---|---|---|---|
| Natif | oui | non | SEF-044-1 |
| Candidat | non | oui | SEF-V416-002 |
| Candidat + entrées natives | oui | non | SEF-044-1 |
| Candidat + journal natif | non | oui | SEF-V416-002 |
| Candidat + compétences natives | non | oui | SEF-V416-002 |
| Candidat + micros/axes natifs | non | oui | SEF-V416-002 |
| Candidat + entrées/journal natifs | oui | non | SEF-044-1 |
| Candidat + entrées/journal/compétences/micros/axes natifs | oui | non | SEF-044-1 |
| Natif + entrées candidat | non | oui | SEF-V416-002 |

Conclusion causale limitée à cette trajectoire et ce créneau : le journal des deux entrées individuelles suffit à inverser la sélection, indépendamment des autres champs. Le mécanisme est normal et protégé (filtrage des familles inédites puis score natif). A ne doit ni prétendre qu'une famille non vue a été vue, ni remplacer une réponse simulée, ni choisir en fonction de la graine ou du succès futur, ni modifier la règle de familles/rappels. Pas de « correction » en falsifiant l'historique.

## Alternative préservant les familles : vérification réelle du catalogue
Lecture du blob quizz.html a7a5989f85482f35cac16f1004b80c7c9b837c04 et des métadonnées figées, rôle sémantique du module A exécuté dans V8.
1915 QCM, 1556 familles. S3 : 15 familles pertinentes (ouv.sa2 ou majeur.soutien, difficulté ≤1, minSession ≤2), aucune ne contient simultanément ouverture 2SA et Passe avec fit. S5 : 25 familles red.base (difficulté ≤2, minSession ≤4), aucune ne contient deux rôles régulière/répétition/soutien distincts. La famille v416-cas-002 ne contient que SEF-V416-002 ; v49-037 ne contient que SEF-V49-037 ; cas-044 contient trois redemandes naturelles à 1SA. Une permutation interne à une famille ne peut donc pas produire le gain demandé dans ce périmètre. Ce recensement ne prétend pas exclure toute stratégie future multi-séances ou multi-critères.

## Handoff
Le diagnostic, les variantes et la validation structurelle de A sont livrables au coordinateur maintenant. Le gain global reste non démontré : HOLD strict, S3 non résolue, S4 complète dans les trajectoires M6 testées, S5 gain local 17/18 contre 16/18 M6, D neutre. Ne pas intégrer les candidats A dans le produit.
Proposition au coordinateur : examiner avec C/D la sensibilité du classement des familles et des rappels dans les trajectoires appariées, **sans abaisser les seuils ni modifier les modèles FNV contractuels**. Demander un arbitrage sur une fenêtre d'objectif M1 multi-séances si une solution peut être conçue sans modifier les règles réservées aux autres missions. Un replay S5→S55 constitue désormais un test de non-régression reproductible. Les divergences normales de réponse ne justifient pas de neutraliser une vraie erreur. Ne pas refaire les recherches rejetées.

## Contrôle historique
Le job historique 140574349213 de la CI 46019269199 a finalement échoué dans tests/quizz-progression-selection-real.cjs:8 : attendu 1879, réel 1915. Ce test existant est antérieur à l'extension du catalogue ; aucun fichier de production ni ce test n'a été changé par A. Les précédents tests du même job ont réussi (contrat A, parcours, prérequis, LOT B, assets). La suite a été interrompue ; une matrice indépendante des quatre contrôles restants et du gel du fichier a été déclenchée sur la branche technique. Ne pas prétendre que le job historique est vert.
MISSION DÉFINITIVEMENT TERMINÉE : NON (objectif pédagogique non validé, transfert au coordinateur recommandé).
