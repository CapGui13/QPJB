# LONG M4 — Passe 21 : réponses aidées et précision du diagnostic

**PASSE 21 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Trois réponses correctes aidées produisent, avec le vrai moteur record/finish, parcours.helped=3, wrong=0, autonomous=0 ; les compteurs micro majeur:1♠ et axe fit atteignent score=-3. Avant correction, le titre prétendait une difficulté persistante malgré l'absence de réponse finale fausse.

Lorsqu'un journal complet et non contradictoire démontre que toutes les tentatives sont des réussites avec aide ou après première erreur libre, le conseil conserve ses champs type, id et priorité, ainsi que son score V1, mais son titre devient « Autonomie à consolider ». Le champ de preuve additif assistedOnly=true décrit strictement cette situation et la réserve appelle à répondre sans aide.

Six nouveaux tests dans tests/wave2-recos-helped.test.js : aide seule, erreur libre corrigée, aide + erreur, erreurs seules, historique sans journal et sauts seuls.

Aucune modification du moteur, de l'interface, des QCM ou des sauvegardes. Aucun changement de seuil ni de catégorie de recommandation.

**PROCHAINE PASSE :** exécuter et inspecter l'ensemble des tests, lever les régressions éventuelles, mesurer les autres cas mal interprétés et vérifier l'intégrité. La PR #262 demeure en DRAFT/HOLD, sans fusion ni publication.