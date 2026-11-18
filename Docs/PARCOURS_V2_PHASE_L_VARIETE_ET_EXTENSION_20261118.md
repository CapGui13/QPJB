# QPJB V2 — phase L : élargissement et comparaison du mélange

**18 novembre 2026 · PR #214 · banc d'essai hors production.**

## 1. Cartographie élargie

L'inventaire K reliait **47 QCM distincts** à quinze fondations (50 associations). Le complément L apporte **72 associations** sur onze fondations, incluant **67 QCM nouveaux par rapport à K**. Le total K + L représente donc **110 QCM distincts et 122 associations**.

- Source unique : les mains, séquences, corrections, justifications et `caseFamily` existants de `quizz.html`, inventoriés dans `Docs/PARCOURS_V2_PHASE_L_EXTENSION_FONDATIONS_20261118.json`.
- Statut : `CANDIDAT_DOCUMENTAIRE_NON_ACTIVE`. Les exemples correspondent à des **situations pédagogiques candidates**, pas à une nouvelle certification SEF ou à des seuils acquis.
- Le 3SA gambling et le Texas mineur après 2SA restent chacun avec **une seule famille** dans la cartographie de fondations ; le Texas mineur sur 1SA attend une revue conventionnelle ; compter H à partir de décisions d'ouverture reste une **preuve indirecte**.
- Les 110 QCM ne remplacent **jamais** le catalogue Quiz SEF de **1 523 exercices**. L'ID, la famille et la réponse originale de chaque association sont testés.

## 2. Comparaison de la variété : V2-F contre V2-L

Le fichier `scripts/parcours-v2-variete-l.cjs` compare deux algorithmes **en lecture seule** pour neuf scénarios fictifs : **trois profils de réponses** × **trois graines**, sur **45 séances de 10 QCM** chacun.

**V2-F** : moteur existant de la PR, avec rotation des ouvertures, réponses et rappels espacés de concepts.

**V2-L** : même moteur, mais, à partir de la troisième séance seulement, un **maximum d'un QCM candidat par séance** peut remplacer un QCM de pratique situé dans les quatre dernières positions, sous ces contraintes :
- La première séance reste identique et les six premiers créneaux de chaque séance sont conservés.
- Les créneaux explicitement programmés comme rappels ne sont **jamais remplacés**.
- Aucune même famille répétée dans la séance ; pas de recyclage d'une famille rencontrée au cours des quatre séances précédentes.
- L'injection respecte `Pilot.available()` et une borne conservatrice de difficulté ; une notion trop avancée n'est pas forcée.
- Seules les fondations documentées `CANDIDATE` sont éligibles. Les fondations `INDIRECTE`, `INSUFFISANTE` ou `CONVENTION_A_ARBITRER` sont exclues.

L'essai ne modifie pas le moteur V2-F, le prototype HTML autonome ni le parcours public : le mélange L n'existe que dans le script de simulation.

## 3. Mesures à regarder

Le script publie pour chaque scénario et chacune des deux approches :
- Nombre de **familles différentes sur 450 QCM**.
- Nombre moyen de **rubriques différentes par séance**.
- Nombre de séances avec **au moins quatre ou cinq réponses identiques**.
- Nombre de **rappels ciblés** conservés.
- Nombre de **QCM injectés**, de fondations représentées et de QCM injectés distincts dans l'essai L.

Ces mesures ne prouvent ni la qualité du séquençage, ni la conformité de chaque QCM, ni une meilleure mémorisation. Plus de variété n'est pas forcément mieux si les apprentissages ne sont pas consolidés ; **les rappels ne doivent pas être sacrifiés** à la diversité.

Exécuter les validations :
```bash
node tests/quizz-v2-fondations.cjs
node tests/quizz-v2-mix-l.cjs
node scripts/parcours-v2-variete-l.cjs
```

## 4. Décisions à prendre après les mesures

1. Si le mélange diminue excessivement les rappels ou laisse trop de compétences sans familles indépendantes, **ne pas retenir** le moteur L.
2. Relire les **72 associations nouvelles** question par question, en particulier les variantes qui semblent appartenir à la même famille et les réponses hors contexte.
3. Définir de vrais objectifs de progression à partir des compétences effectivement enseignées, pas de seuils arbitraires de « séances terminées ».
4. Avant une expérimentation publique, confronter la progression à des retours d'élèves **volontaires** ; aucune collecte de réponses d'élèves n'a lieu actuellement.

**Statut : `BENCHMARK_HORS_PRODUCTION / AUCUNE_MAITRISE_INFEREE / AUCUN_DEPLOIEMENT`.**
