# QPJB — Phase AE : protocole de petit essai pédagogique Rubensohl et Michaels

**19 novembre 2026 · PR #214 · Préparation d'une observation en situation réelle — aucune séance réalisée.**

## Objectif

Vérifier avec quelques personnes volontaires **la clarté des deux mini-leçons AB/AC**, en utilisant les **six questions ouvertes AD** comme invitations à reformuler, sans les transformer en nouveaux QCM ni leur attribuer des notes. On ne cherche **pas** à mesurer la maîtrise globale d'une convention ou l'efficacité du programme dans une population.

**État actuel : protocole et matériel uniquement.** Aucun participant n'a été contacté, observé ou enregistré. Toutes les feuilles et les champs de commentaire sont vierges. Le Quiz SEF, ses 1 523 questions, les sauvegardes et le moteur V2-F restent inchangés.

## Petit groupe et conditions

Proposition à adapter par l'enseignante : **quatre à six volontaires**, connaissant les enchères de base mais découvrant la convention examinée, avec si possible **deux à trois personnes par thème**. Cet effectif ne permet pas de conclusion statistique. Une séance par personne porte sur **une seule convention** (Rubensohl ou Michaels précisés) et dure **environ 15 à 20 minutes**, sans pression de temps.

Avant l'essai, dire explicitement : « Nous testons la clarté de deux fiches de cours, pas tes compétences. Tu peux refuser ou arrêter à tout moment. Aucune note ni identité n’est recueillie dans cet outil. » Ne pas recueillir de nom, coordonnées, numéro de licence, enregistrement audio/vidéo ou capture d'écran. **Ne pas verser de notes sur les participants dans GitHub**. Pour conserver des constats, l'enseignante peut choisir une **feuille imprimée sans identité**, sous son contrôle, avec l'accord des personnes.

## Déroulé proposé, une convention par personne

1. **Présenter l'objectif** et la participation volontaire ; aucune notation, aucune donnée transmise par le support.
2. **Vérifier oralement les prérequis**, notamment les ouvertures, le rôle du répondant et les longueurs. Reporter la séance si ces bases ne sont pas acquises, au lieu de considérer la leçon comme défaillante.
3. **Lire la mini-leçon AB/AC correspondante**, sans la fiche d'observation ni les repères enseignants sous les yeux.
4. **Masquer le cours**, puis demander les **trois reformulations AD** de la convention. Laisser parler le joueur sans lui proposer les réponses. L'enseignante ne consulte les repères qu'**après la tentative**.
5. **Observer qualitativement** des mots incompris, différences de contexte mal repérées, exemples manquants ou consignes ambiguës. Les catégories facultatives sont : *expliqué clairement*, *à reformuler*, *non abordé* ; elles ne constituent pas des notes ni des niveaux de maîtrise.
6. **Demander un retour libre**, puis réunir seulement les problèmes de rédaction et de compréhension des notions. L'enseignante arbitre ensuite les évolutions du cours, **sans modifier automatiquement les QCM**.

À la fin, poser par exemple : « Quel passage demanderait une explication différente ? », « Quel mot ou exemple manque ? » et « Qu'est-ce qui t'empêcherait de réexpliquer le principe à un partenaire ? ».

## Ce que contient la fiche HTML expérimentale

Le générateur `scripts/parcours-v2-apercu-pilote-ae.cjs` produit `fiche-essai-pilote.html`, un fichier autonome et imprimable :

- Deux onglets, Rubensohl et Michaels précisés. **Une seule convention à la fois**.
- Trois questions ouvertes **strictement identiques à celles de l'atelier AD**, avec la provenance des sources validée par `scripts/parcours-v2-pilote-ae.cjs`.
- Un champ d'observation libre et **trois étiquettes qualitatives facultatives** par question (pas de score, aucune moyenne).
- Un volet d'**indications pour l'enseignante**, masqué jusqu'à son ouverture volontaire.
- Un espace final pour noter uniquement un **passage du cours à clarifier**.
- Des boutons **Imprimer** et **Effacer les notes de la fiche** ; aucune sauvegarde, API, requête, statistique automatique ou collecte d'identité.

L'impression peut être utilisée **sur papier blanc avant la séance**, puis annotée hors ligne. Si des observations sont saisies pendant une séance, elles n'existent que dans la page actuellement ouverte et seront perdues à sa fermeture. **Effacer la fiche avant chaque nouveau volontaire**. Ne pas imprimer de notes contenant des informations identifiantes.

## Règles d'analyse et limites

Le rapport de ce prototype contient volontairement des listes `observations: []` et `qualitativeFindings: []`, ainsi que **0 participant observé**. Il n'existe **aucun taux de réussite** à présenter.

Une future synthèse, rédigée seulement après un essai réel sous contrôle de l'enseignante, devra distinguer :

- **Difficulté de vocabulaire** : terme non expliqué ou non compris ;
- **Difficulté de décodage** : enchère artificielle interprétée littéralement ;
- **Difficulté de contraste** : deux séquences différentes perçues comme identiques ;
- **Difficulté de transfert** : élève capable de répéter la leçon mais pas de l'appliquer hors de ses exemples ;
- **Difficulté d'ergonomie** : texte trop long, lexique mal placé, affichage mobile difficile.

Ne pas inférer la maîtrise d'un joueur, son niveau FFB ou une performance future à partir de ces éléments. **Aucune correction automatique du parcours ou du catalogue** ne découlera du rapport.

## Fichiers et vérifications

- `scripts/parcours-v2-pilote-ae.cjs` : protocole structuré, six questions AD fidèles, contrôles AB/AD, champs de résultats **vides**.
- `scripts/parcours-v2-apercu-pilote-ae.cjs` : fiche HTML autonome à imprimer et utiliser localement.
- `tests/quizz-v2-pilote-ae.cjs` : six questions, cinq sources et 1 523 QCM préservés, absence de persistance et de transmission, HTML syntaxiquement valide, aucune réponse d'élève inventée.
- `.github/workflows/qpjb-v2-ae-focused.yml` : vérifications GitHub Actions, génération de `phase-ae-protocole.json`, `phase-ae-summary.json` et `fiche-essai-pilote.html` dans l'artefact `qpjb-v2-ae-anonymous-pilot`.
- `.github/workflows/training-smoke.yml` : contrôle complémentaire AE ajouté à la batterie générale.

**Décision :** le matériel AE peut être proposé à une enseignante pour inspection ; il **ne déclenche aucun recrutement ni essai**. Une expérimentation avec des joueurs ne se fera qu'avec des participants effectivement volontaires, et les corrections pédagogiques seront décidées à partir de leurs retours réels.

**Statut au lancement : `AE_PROTOCOLE_PREPARE / 0_PARTICIPANT / 0_REPONSE / 0_DEPLOIEMENT`.**
