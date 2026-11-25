# Réserve V1 — M5 forcing

Contrats [#320](https://github.com/CapGui13/QPJB/issues/320) et [#325](https://github.com/CapGui13/QPJB/issues/325). Base `e910307511f8a98dba6876df9d6677f9fc74e2b2`. Aucun changement de production.

## Bilan

5/5 concepts traités. Déficit brut 8 : objectif de travail 6 ajouts N3 et 2 exceptions, réalisé 6/6 et 2/2. Projection : Roudi 0→2, fortes 1→3, troisième forcing 2→2, quatrième suite 2→3, checkback 2→3. Aucun patch historique. Les deux exceptions sont détaillées dans patch.json et review.json. Le niveau 3 est local à la décision ; les stages et dépendances avancées restent intacts. La projection des familles devra être confirmée à la collecte, notamment pour les décisions voisines de la quatrième couleur et de la redemande forte.

## Cartographie et contrôles réellement effectués

- Contrats lus, base et tête de branche vérifiées. Table quizz-prerequis.js, préclassifications Roudi/fortes/forcing, audits antérieurs, patch M6 et manifeste #319 consultés. Les deux ajouts checkback de #319 sont inclus dans la cartographie.
- Contrôle unique des six fiches : 13 cartes, rangs distincts par couleur, H et distributions calculés, 4 choix distincts contenant la réponse, IDs/familles et couples main/séquence uniques dans le lot ; revue des décisions au regard des cas historiques retrouvés. Aucune exécution de CI globale.
- Limite : accès au HTML complet refusé par taille (blob exact connu) ; SEF-V411-007 identifié par prérequis mais fiche non récupérée. Dédoublonnage exhaustif face aux 1595 fiches non attesté. Vérification à la collecte sur les sources complètes. Aucun visa historique ni accord local nouveau revendiqué. Les sources pédagogiques sont des cours et audits, non des citations prétendument littérales du SEF.
- Signalement : l'ancienne fiche SEF-L17-012 parle d'arrêt Cœur alors que 2♥ est la couleur artificielle ; vérifier le détail de l'exigence d'arrêts lors de V3 sans modifier ici. Les anciennes conclusions Roudi N4 sont conservées.

Livrables : plan.json, patch.json, review.json, README.md. SHA indiqué en commentaire de l'issue après commit. Ni PR vers main, ni merge, ni consolidation, ni publication.
