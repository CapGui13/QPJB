# QPJB — méthode de travail
Adoptée le 24 novembre 2026.

**Par défaut : demande → modification directe sur main → publication → essai utilisateur.**
Pas de PR ni de GO supplémentaire pour les petites interventions autorisées.
Regrouper les corrections liées dans un commit et conserver le retour arrière Git.

## Voie rapide
- Texte, couleurs, dimensions, ergonomie et code de présentation local : commit `routine(ui): description`.
- Correction ponctuelle de 1 à 20 QCM : commit `routine(qcm): description`, avec IDs, champs corrigés et justification SEF dans le message. Voie rapide pour énoncé, explication et distracteurs si la bonne réponse reste identique. Les mains, enchères, IDs, ordre, difficulté et prérequis restent intacts. Relire pédagogiquement les corrections : les contrôles mécaniques ne prouvent pas le SEF. Si la bonne réponse change, vérifier et adapter la progression et les anciennes réussites (migration ciblée si nécessaire), puis validation ciblée (recette complète manuelle si nécessaire). Aucun QCM ne doit être modifié juste pour tester une CI.
- Documents et séances : conserver la validation QUICK existante pour les chemins reconnus.
- La voie routine contrôle le périmètre du diff et la syntaxe, puis régénère le catalogue et vérifie l'archive publique. Pour les QCM, elle ajoute le contrôle mécanique des cartes/points/enchères/choix, des IDs et prérequis du catalogue vivant, sans navigateur ni simulation longue. Pas de simulations longues ni de navigateur automatique systématique. Tester le comportement ciblé si nécessaire avant de publier ; l'essai réel utilisateur reste important.
- Le marqueur est une déclaration de portée, pas une preuve de sécurité sémantique. Ne jamais l'utiliser pour un changement de stockage, moteur, données structurelles, sécurité, cache, infrastructure, ou une modification dont on ne comprend pas les conséquences. En cas de doute : TARGETED, puis recette complète manuelle si nécessaire. Une anomalie doit être corrigée, pas contournée par un marqueur.

## Gros changements
Moteur pédagogique, sauvegardes, cache, refonte, développement parallèle, sécurité et CI : une branche/PR si utile, une recette ciblée sur les fichiers concernés. Les changements hors routine passent par TARGETED : syntaxe des modules modifiés, données et comportement du module concerné, ressources publiques, protections de publication si elles changent. Pas de Chromium, WebKit ni simulations longitudinales globales imposés à la publication. La recette FULL est uniquement manuelle via QPJB Training smoke. Toute modification du stockage exige une validation explicite de la reprise des données.
Les recettes historiques sont conservées en déclenchement manuel ; elles ne doivent plus ralentir les corrections locales. Les anciennes assertions sur le texte et les empreintes exactes des QCM se rejouent sur l'édition historique du 24 novembre 2026 via « Quiz SEF - integrite du catalogue ». FULL (manuel) valide les données actuelles, l'interface et le moteur ; les comparaisons longitudinales historiques emploient leur jeu de données immuable, distinct du catalogue vivant.
Aucun changement des QCM ou de l'interface dans ce chantier de CI.

## Publication
Le déploiement reste lié au SHA validé et à l'archive publique isolée. Le mécanisme de publication et de retour arrière existant est conservé. Ne pas déclarer publié avant le succès du déploiement Pages.
