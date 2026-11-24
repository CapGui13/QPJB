# QPJB — méthode de travail
Adoptée le 24 novembre 2026.

**Par défaut : demande → modification directe sur main → publication → essai utilisateur.**
Pas de PR ni de GO supplémentaire pour les petites interventions autorisées.
Regrouper les corrections liées dans un commit et conserver le retour arrière Git.

## Voie rapide
- Texte, couleurs, dimensions, ergonomie et code de présentation local : commit `routine(ui): description`.
- Correction ponctuelle (1 à 20 QCM existants) : `routine(qcm): description`. Vérifier le fond SEF et les choix avant le commit ; seuls contexte, explication, réponse et choix sont admissibles. Ne pas modifier les IDs, mains, ordre, thèmes, difficulté ou prérequis.
- Documents et séances : conserver la validation QUICK existante pour les chemins reconnus.
- La voie routine contrôle le périmètre du diff et la syntaxe, puis régénère le catalogue et vérifie l'archive publique. Pas de simulations longues ni de navigateur automatique systématique. Tester le comportement ciblé si nécessaire avant de publier ; l'essai réel utilisateur reste important.
- Le marqueur est une déclaration de portée, pas une preuve de sécurité sémantique. Ne jamais l'utiliser pour un changement de stockage, moteur, données structurelles, sécurité, cache, infrastructure, ou une modification dont on ne comprend pas les conséquences. En cas de doute : FULL. Une anomalie doit être corrigée, pas contournée par un marqueur.

## Gros changements
Moteur pédagogique, sauvegardes, cache, refonte, développement parallèle, sécurité et CI : une branche/PR si utile, une recette finale pertinente. Les modifications hors périmètre routine restent couvertes par la CI historique. Le lancement manuel de QPJB Training smoke force FULL.
Les recettes historiques sont conservées en déclenchement manuel ; elles ne doivent plus ralentir les corrections locales.
Aucun changement des QCM ou de l'interface dans ce chantier de CI.

## Publication
Le déploiement reste lié au SHA validé et à l'archive publique isolée. Le mécanisme de publication et de retour arrière existant est conservé. Ne pas déclarer publié avant le succès du déploiement Pages.
