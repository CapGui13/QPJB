# LONG M4 — Passe 8 : contre-épreuve de recouvrement renforcée

**PASSE 8 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Anomalie dans la qualité de la preuve de test

Le contre-test P3 « mêmes scores mais cas différents » utilisait deux erreurs d'axe puis deux erreurs supplémentaires de micro. Le score micro atteignait -3 tandis que l'axe restait à -2 ; le scénario n'éprouvait donc **pas** l'égalité des scores annoncée.

Correction ciblée du test : deux échecs axe fit/micro majeur:1♠ et deux échecs sans lien sur micro ouv:passe. Les trois enregistrements portent désormais exactement score -2, attempts 2 et independent 0, mais les ensembles de réponses journalisées sont différents. Résultat attendu :
- le micro majeur:1♠ et l'axe fit fusionnent comme deux classifications des mêmes réponses ;
- le micro ouv:passe conserve sa carte, sans nouvelle preuve fictive ;
- deux recommandations persistent au lieu de trois, mais il ne s'agit pas de deux savoir-faire maîtrisés.

Cette contre-épreuve renforce la sécurité du dédoublonnage : l'égalité des compteurs n'est **jamais** une autorisation de fusionner. Le test reste purement technique et ne change aucun QCM.

**PROCHAINE PASSE :** récupérer les résultats CI et des tests ciblés ; analyser toute régression et ne clore qu'après recette exécutée. HOLD maintenu.
