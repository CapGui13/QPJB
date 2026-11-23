# QPJB M1 — Passe 6 : contre-expertise, contrat d'intégration et clôture conditionnelle

**PASSE 6 FINIE (synthèse et contrat). MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Classement des résultats
| Livrable | Classement | Raison |
|---|---|---|
| P1 cartographie 1 523 QCM / 22 rubriques | VALIDABLE documentaire | Comptages factuels, aucun changement applicatif |
| P2 ROADMAP, contextes et niveaux | VALIDABLE documentaire | Indices de séances et proxies explicités ; ne démontre pas une faiblesse réelle d'élève |
| P3 trois parcours, 92 IDs uniques | À DISCUTER | Sélection déterministe mais tri par difficulté trop simpliste |
| P4 contre-épreuve des trois parcours | VALIDABLE comme diagnostic, PAS comme pédagogie | Les 92 cas sont tous au niveau minimum autorisé de leur profil : **20 N1, 40 N2, 32 N3**, donc pas de montée progressive réelle |
| P5 audit de huit QCM | À DISCUTER | 5 cas sans anomalie démontrée et 3 cas à instruire ; aucune nouvelle correction complète établie |
| 36 propositions historiques | BLOQUÉ pour intégration | Validation pédagogique indépendante non accordée |
| Test statique `tests/wave2-pedagogie-parcours.cjs` | À VALIDER en CI | Code committé ; exécution Node/CI non observée dans ce travail |

## Contre-expertise des parcours
**Défaut réel du prototype documentaire P3 :** la règle « trier par difficulté croissante puis prendre les premiers QCM » conduit à 20/20 N1 en découverte, 40/40 N2 en consolidation et 32/32 N3 en approfondissement. Le corpus de chaque parcours couvre des thèmes différents, mais **pas une progression de difficulté à l'intérieur du profil**. Il serait donc trompeur de les intégrer tels quels comme progression adaptative.

**Correction à préparer, sans changer le moteur :** construire pour chaque thème des paliers successifs et vérifier la diversité des situations dans chaque palier. Si un thème ne fournit pas assez de cas à un palier, documenter l'absence plutôt que promouvoir artificiellement des cas trop difficiles. Cette étape nécessite des tests d'ordonnancement et un arbitrage pédagogique.

## Contrat d'intégration (coordination #260)
1. **Données de référence** : les 1 523 QCM et 22 rubriques restent inchangés ; toute sélection doit référencer uniquement des IDs existants.
2. **Frontière** : cette branche ne modifie que `audits/wave2/pedagogie/**` et `tests/wave2-pedagogie-*`. Le moteur `quizz-parcours.js`, l'UI `quizz.html` et le module de recommandations appartiennent aux missions #256, #257 et #258.
3. **Exclusions** : les 36 propositions de la vague 1 ne sont pas appliquées, et leur absence dans un prototype ne doit pas être confondue avec une suppression du catalogue.
4. **Interface éventuelle** : proposer au coordinateur un manifeste externe `{profile,theme,level,ids[]}`, où chaque ID est unique, existe dans le catalogue et est traçable. Aucun nouveau schéma de sauvegarde, aucune nouvelle preuve de maîtrise.
5. **Critères d'acceptation** : vérification des niveaux croissants, diversité des familles et séquences, conformité SEF des cas, test Node exécuté, comparaison avec les sélections de la mission adaptative #256, validation humaine avant publication.
6. **HOLD** : conserver PR #261 en brouillon. Ne pas fusionner, ne pas publier, ne pas retoucher les 36 dossiers.

## Bilan des six passes
- **P1** : couverture et familles, terminée.
- **P2** : ROADMAP et proxies de diversité, terminée.
- **P3** : prototype de trois parcours sur 92 IDs, terminé comme expérimentation **non intégrable en l'état**.
- **P4** : contre-épreuve, terminée ; biais de difficulté démontré.
- **P5** : huit contre-lectures, mais **paquet de corrections complètes non produit** faute d'erreurs démontrées et de validation SEF.
- **P6** : contre-expertise et contrat produits, mais **gate de clôture non satisfaite** : test CI non exécuté, progression à revoir, audit P5 insuffisant pour des corrections validables.

**MISSION DÉFINITIVEMENT TERMINÉE : NON.** Une prochaine itération devra tester le garde-fou Node, corriger le biais du prototype de parcours et examiner complètement les trois cas « à discuter » (choix, corrigé, SEF) avant toute proposition de correction. Aucun changement de production n'est justifié à ce stade.
