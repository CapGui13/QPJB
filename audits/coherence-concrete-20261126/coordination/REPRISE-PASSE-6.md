# Coordination — reprise 6
Base figée 13966e475cf986c6f76e7faf870377fdf4ef99aa. #506, #483. Branche candidate coherence-concrete/reprise6-coordination-t, aucun merge ni publication.
## Livraisons et arbitrage
- A #516 HOLD : PASS-3-S55.md démontre par ablation que deux entrées individuelles et la préférence de familles inédites suffisent à inverser la sélection en S55. Ne pas modifier le journal, les preuves ou le modèle de réponses. 15 familles S3 pertinentes, aucune ouverture 2SA/Passe-fit mixte ; 25 familles S5 red.base, aucune paire de rôles distincts au sein d'une même famille. Pas de nouvelle tentative de simple substitution locale.
- B #518 HOLD SX/E : 9 inversions spécifiques supprimées mais 145 alertes strictes M6 et 188 régressions individuelles D. Le BILAN.md de la branche décrit en outre une variante d'enseignement à la source T (distincte de la diversité D/T) : 12 corrigés Texas et 2 contextes Stayman, aucune substitution, 9/9 sources pertinentes disponibles avant continuation, inversions chronologiques brutes toujours 9. Vérifier SHA exact, patch et CI avant toute intégration séparée; ne pas assimiler exposition et autonomie.
- C #511 HOLD C1/C2 : C1 zéro intervention; C2 dette M6 241051→236701 et D 228622→221129, 275/155 alertes. CONTRE-EXEMPLES.md montre perte de contrastes et réponses 3SA gambling/passe-corrige, Truscott, bicolore cher, etc. Ne pas remplacer un transfert unique sous prétexte d'une preuve récente. Un rappel additionnel, distinct de la séance normale, est une piste à explorer sans altérer la preuve, mais ne compter que les rappels réellement effectués et ne pas changer les gates.
- D #512, T diversité : candidat étroit pour revue, pas une résolution globale M4. 18 trajectoires appariées par modèle, zéro alerte des comparateurs utilisés, S5/S20 paires proches M6 38→35/100→97, D 40→37/96→93, dette inchangée. Chromium/WebKit et gardes historiques attestées par D (voir PR).
## Changements réellement commis sur branche isolée
- 3e7562a : moteur réel avec trois ancres exactes du patch D; bootstrap navigateur limité à window, aucune nouvelle URL de module; syntaxe parsée.
- b3bb2d7 : raccordement coherenceOptions dans quizz.html ; bloc JSON 1915 QCM identique octet pour octet.
- 7854776 / 20163ab : cache v108, moteur v22 cohérents.
- 3076104 : mise à jour de la seule assertion de cardinal historique 1879→1915, conforme au contrat; ne change aucune garde pédagogique.
- a4720a8 / 0f5e77d / f52b3c2 : les trois bancs D lisent directement le moteur candidat plutôt que lui appliquer une seconde fois le patch expérimental.
- a1c00c9 : workflow pull_request isolé, sans publication, 18 matrices, Chromium/WebKit sur build réel, 13 gardes et gate M6/D. Résultats à vérifier. 
## Reprise minimale
1. Ouvrir la PR candidate et vérifier runs/jogs, puis gate et vrais tests du navigateur. Corriger défauts de raccordement sans relancer de matrices inutilement. Ne pas fusionner avant décision de coordination.
2. Examiner séparément le code B enseignement à la source (nouveaux résultats dans BILAN), vérifier le SHA et les protections et préparer sa composition avec D sans toucher aux IDs.
3. A/C : explorer les mécanismes de contenu et de réactivation sans remplacement de contraste unique, via une nouvelle expérience structurée et un comparatif historique intact. Pas de neutralisation d'erreur, pas de filtrage par graine, aucun seuil assoupli.
Local clone toujours impossible (DNS github.com); accès connecteur et Actions. Aucun nouveau résultat CI attesté au moment de ce commit. 
COORDINATION DÉFINITIVEMENT TERMINÉE : NON.
