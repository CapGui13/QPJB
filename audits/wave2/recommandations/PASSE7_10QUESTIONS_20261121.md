# LONG M4 — Passe 7 : contre-épreuve multiquestions 65 / 153

**PASSE 7 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

La passe 4 testait 65/153 séances avec un exercice par séance pour isoler les causalités. Cette passe corrige une faiblesse de **représentativité** : le fichier tests/wave2-recos-10questions.test.js reproduit des séances complètes de **10 réponses**, toujours exclusivement via les fonctions V1 record/finish.

Quatre scénarios :
1. 65 séances × 10 réponses aidées = 650 résultats de type helped, 0 autonomous.
2. 153 séances × 10 réponses aidées = 1 530 helped, 0 autonomous.
3. 65 séances autonomes (650 réussites), puis 9/10 réponses dans une séance interrompue : priorité resume, 65 séances terminées, 9 réponses non converties en journal, révision non proposée.
4. 153 séances autonomes (1 530 réponses) : réussites répétées possibles sans affirmer une maîtrise générale.

Le même QCM d'axe (audité dans le moteur) et neuf fixtures d'ouverture techniques sont utilisés plusieurs fois ; aucune nouvelle donne n'est ajoutée au catalogue. Les compteurs et recommandations sont mesurés par les vrais modules lors de l'exécution du script. L'attente décrit les invariants, **pas un compte-rendu d'exécution tant que le test n'a pas été lancé**.

Commande : node --test tests/wave2-recos-10questions.test.js

Cette passe ne touche pas aux autres branches, à l'adaptatif, au catalogue, aux QCM ou au HTML. Les autres tests M4 et l'ancien smoke doivent toujours être vérifiés.

**PROCHAINE PASSE :** recette CI et revue du diff, recherche de régressions concrètes sur 10 questions ; si exécution ciblée impossible, conserver le blocage et un plan de reprise détaillé. PR DRAFT/HOLD.
