# QPJB — Phase U : diversité des décisions, audit prudent

**18 novembre 2026 · PR #214 · banc d'essai V2-F uniquement · aucun déploiement.**

## Pourquoi cette phase ?

Les phases S et T ont montré qu'imposer des exercices concurrentiels plus tôt n'améliorait pas de façon robuste V2-F. Le problème utile à étudier maintenant est différent : **la variété des décisions effectivement proposées**, et non le seul nombre de rubriques ou d'ouvertures.

Une même réponse écrite (par exemple « 1SA ») peut représenter des décisions de nature différente selon la séquence. Une même décision apparente peut aussi constituer une révision légitime sur une nouvelle famille de mains. **Ne jamais qualifier automatiquement une répétition de « mauvaise » ni déclarer une compétence maîtrisée.**

## Source et méthode

Le script [parcours-v2-decisions-u.cjs](../scripts/parcours-v2-decisions-u.cjs) réutilise les **1 523 QCM originaux** et le simulateur **V2-F inchangé**. Il mesure **9 scénarios déterministes** : trois profils fictifs × graines 13, 29, 47 × 45 séances × 10 QCM.

Pour chaque question réellement tirée, il conserve l'ID, la famille originale et la réponse telle qu'elle apparaît dans le catalogue. Il classe séparément :

- **Le contexte vérifiable** : choix d'ouverture, réponse à une ouverture précise (dont 1♣ et 1♦), notre intervention sur ouverture adverse, réponse après Contre adverse, réponse au Contre du partenaire, ou rubrique d'origine quand la séquence ne suffit pas.
- **La réponse exacte**, sans imposer une équivalence pédagogique entre deux mains.
- **La famille visible de l'action** : majeure, mineure, sans-atout, Passe, Contre, Surcontre, ou réponse non normalisée.
- **La décision observable** : couple contexte + réponse exacte, à ne pas confondre avec une compétence.
- **Les expositions** des réponses sur 1♣ et sur 1♦, avec détails des réponses exactes par périodes.

Les fenêtres sont les séances **1–5, 6–15, 16–30 et 31–45**. Les compteurs de répétitions portent sur les couples contexte/réponse répétés dans une séance et présents dans deux séances consécutives. Ils sont uniquement des **signaux de revue**, et non des défauts automatiquement diagnostiqués. Les réponses identiques dans deux contextes différents sont suivies séparément.

## Garanties

- Aucun nouvel exercice, aucune réponse ou justification modifiée.
- Aucune intervention sur le classement, les tirages, les rappels V2-F, les déblocages ou les sauvegardes.
- Test [quizz-v2-decisions-u.cjs](../tests/quizz-v2-decisions-u.cjs) : identités de catalogue, déterminisme de l'audit, décomptes complets, refus des QCM copiés ou des familles répétées, non-mutation des séances et états.
- Exécution dans la CI de la PR, en **lecture seule**.
- Échantillons fictifs uniquement : aucune donnée d'élève et aucune preuve de mémoire ou de maîtrise.

## Décision préalable aux résultats

**V2-F reste la référence.** La phase U doit permettre de choisir des séquences représentatives à relire pédagogiquement (notamment les réponses sur les mineures et les réponses répétées dans un contexte similaire). Aucune substitution et aucun réglage des fréquences ne sont autorisés sur la seule base d'une statistique de répétition.

**Statut :** PHASE_U_OBSERVATOIRE / V2_F_INCHANGE / VALIDATION_CI_REQUISE / NON_DEPLOYE.
