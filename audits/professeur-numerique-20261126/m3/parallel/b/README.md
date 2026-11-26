# M3-B — Livraison au coordinateur M3 (#386, #389, PR #392)

Base immuable : `71b0823235db1400eaf57c2552df35c18094f30a`. Branche : `professeur-numerique/m3-b`. Attribution exclusive par préfixe du concept dans cartographie.json, jamais par thème HTML. 364 QCM, 17 concepts, 1 092 options incorrectes, dont 635 déjà diagnostiquées et 457 à revoir. Les 457 options, sur 256 QCM, ont été examinées par main, séquence, contexte, bonne réponse et corrigé réel, en quatre lots committés puis consolidés. Le but est de proposer des causes possibles, pas d'inférer le raisonnement, ni une maîtrise.

## Résultat

| Disposition | Options |
|---|---:|
| Hypothèse nouvelle | 397 |
| Unknown ordinaire | 37 |
| HOLD historique conservé | 14 |
| HOLD éditorial | 9 |
| Total | 457 |

Les 60 options non attribuées restent unknown. Les HOLD historiques de #271 et #356 ont été traités conservatoirement sans prétendre qu'une réserve rédactionnelle invalide la bonne réponse. Le HOLD M3 V2-M1-031/1♦ est recopié sans changement. Les choix déjà diagnostiqués restent intacts. Couverture proposée du périmètre : 635/1092 à 1032/1092, sous réserve d'intégration et de validation pédagogique. Ce taux est un résultat, non un objectif. Aucun patch appliqué.

## Fichiers et integration

- revue-*.json : quatre revues exhaustives, clé (id, choice), état initial, disposition, justification contextualisée, signature et extrait canonique exact. Les formulations peuvent partager un mécanisme pédagogique entre exercices analogues.
- diagnostics.json : 397 hypothèses explicites ; ne prendre que les lignes dont le moteur retourne encore unknown (ambiguous ou canonical-ambiguous-contrast), la signature canonique correspond et le choix est effectivement proposé. Ne pas écraser un diagnostic antérieur, un HOLD, ni inventer un diagnostic pour une réponse libre hors choix. Confiance au plus medium.
- hold.json : 23 couples à préserver ou arbitrer ; en particulier les jugements de barrage, les alternatives de contrat, les contres punitifs et les réserves historiques. Plusieurs options d'un même QCM peuvent être réservées.
- weak-distractors.json : 7 options faibles / de signification insuffisamment documentée ; ne pas forcer de remplacement.
- patches.json : 1 proposition, SEF-V484-001, 2SA remplacé par Passe pour tester la confusion entre enchère d'attente et contrat naturel ; oldChoices/newChoices et diagnostics complets, accord de poursuite à valider avant application. Le corrigé reste identique.
- overlay.cjs : adaptateur de validation isolé, non destiné à être importé automatiquement dans la production.
- test-m3-b.cjs : test reproductible ; commande depuis le dépôt `node audits/professeur-numerique-20261126/m3/parallel/b/test-m3-b.cjs` sur la base de travail correspondant à la cartographie.
- mesures.json : bilan par concept et catégorie, résultats réels de recette.

## Recette réellement exécutée

Le module test-m3-b.cjs et le moteur figé ont été évalués en JavaScript V8 avec le catalogue réel (blob 99049d0d5790767ba991414240aa7d837c1b188e) et la cartographie réelle récupérés depuis GitHub. 5637 options erronées reproduisent exactement la cartographie ; 1879 réponses correctes inchangées ; 5240 diagnostics/unknown préservés, 397 ajouts ; 1191 contrôles de signature périmée, choix non proposé et drapeaux d'assistance ; 1 proposition structurellement contrôlée. Aucun écart détecté.

Limites : environnement local sans accès DNS au dépôt GitHub ; le lancement natif Node sur un clone, les tests navigateur et CI ne sont pas exécutés. La validation structurelle ne prouve pas la justesse pédagogique universelle de chaque hypothèse ; l'accord précis de paire et les réserves éditoriales priment. Les références historiques utilisées incluent #271, #293, #306, #319, #320, #327, #334, #341, #342, #349, #356 et les travaux M3 figés. Pas de nouvelle règle déduite d'un texte externe non consulté. Aucune modification du moteur partagé, du catalogue, de la cartographie ni des tests communs. Aucune PR concurrente, fusion ou publication.

Le coordinateur est invité à traiter le registre HOLD avant toute modification des choix, puis à exécuter sa recette intégrée. Livraison terminée pour le périmètre B, intégration et arbitrages non réalisés.
