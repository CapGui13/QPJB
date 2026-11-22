# LONG M4 — Passe 28 : résultats finaux corrects et autonomie partielle

**PASSE 28 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Défaut démontré sur 625 profils

Simulation de toutes les séquences ordonnées de quatre séances pour les cinq issues V1 : autonome (A), réussite aidée (H), première erreur libre corrigée (F), saut (S) et réponse finale fausse (W). Avec les vrais `record/finish`, **108 des 625 séquences** affichaient encore « Difficulté persistante » alors que le journal conservait **zéro réponse finale fausse**. Un cas concret : `AHHH` (une réussite autonome, trois aidées) donne `score=-2`, mais aucune réponse finale incorrecte.

## Correction

Lorsque *toutes les tentatives* d'une notion sont présentes dans un journal cohérent, que le résultat agrégé V1 conduirait à une difficulté mais que chaque réponse finale est correcte ou sautée et qu'au moins une est autonome :

- conserver le `type`, la priorité et les scores historiques sans ajouter de seuil de maîtrise ;
- reformuler le titre « Autonomie à consolider » et le texte sans prétendre que des réponses finales fausses ont été observées ;
- ajouter les décomptes `evidence.noFinalWrong`, `autonomousCount`, `helpedCount`, `skippedCount` calculés depuis le journal, et une réserve explicite dans `explanation` ;
- ne pas inventer de preuve lorsque le journal est partiel ou contradictoire ; les vrais échecs conservent leur diagnostic.

Six tests nouveaux dans `tests/wave2-recos-no-final-wrong.test.js`, dont une **matrice exhaustive de 625 trajectoires** vérifiant le libellé, les décomptes, la distinction des erreurs réellement constatées et la compatibilité des réussites répétées.

Les 108 profils étaient un défaut d'interprétation du titre, pas un défaut du score V1. Le moteur, les sauvegardes, l'UI et les QCM ne sont pas modifiés.

**PROCHAINE PASSE :** exécuter la suite M4 complète, vérifier les cas limites du contrat d'intégration et les effets collatéraux avant un bilan de prêt-à-intégrer. Raccordement Node22 durable toujours réservé à M5. PR DRAFT/HOLD, ne pas fusionner/publier.