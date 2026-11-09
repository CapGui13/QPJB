# QPJB Entraînement — reprise ciblée P1 de EN-BH-049-04 (10 novembre 2026)

## Motif de correction
- Le PDF sujet BH-049 du **3 février 2023**, p.1, question 4, indique **« Non Vul. »**, puis Nord passe, Est passe, Sud doit choisir son ouverture.
- Le PDF corrigé p.1 conserve **3♦**, expliquant que les critères de barrage en troisième position sont plus souples.
- Dans l'application, la main ♠6 ♥85 ♦DV98632 ♣R75 a **6 H**. Le contexte non vulnérable n'était pas affiché ; une phrase déclarait le barrage faisable « sans condition particulière de vulnérabilité » ; les notes de distracteurs portaient sur 3♣, 3♥, 3♠ alors que les trois choix réellement distracteurs sont 1♦, Passe et 2♦ ; un ancien indice parlait de trois H.

## Correction proposée
1. Indiquer explicitement dans la question et le contexte préalable **non vulnérable**, Nord et Est ayant passé, en troisième position.
2. Conserver la réponse 3♦, la main, la séquence et les quatre choix à l'identique ; reformuler la justification sans prétendre que la vulnérabilité n'a aucune importance.
3. Aligner les trois notes et trois indices sur les propositions réellement affichées.
4. Signaler que **Passe reste licite** selon les accords et l'évaluation, même si le corrigé privilégie 3♦ dans ce contexte précis.
5. Préserver les champs de statut de relecture existants : la CI ne remplace pas une contre-expertise indépendante.

## Provenance documentaire
- Sujet : `49 Exercice Votre Bridge Hebdo débutant 03-02-2023.pdf`, page 1, SHA-256 `aa2e489fe1a237cb951dc59d1268210c55048db5370825a86dd598e5ceafd648`.
- Corrigé : `49 Solution Votre Bridge Hebdo débutant 03-02-2023.pdf`, page 1, SHA-256 `cf2fbcdf9f92a361b660659d3dad954e1e96b68e96df5fabcd176d647342d6de`.
- Rapport documentaire de triage : `/QPJB Training/Audits/Reprise-2026-11-06/Transversal-2026-11-09/QPJB_P1_TRIAGE_SOURCES_2026-11-09.md`.

## Contrôles et limites
- 1 objet QCM édité (aucun ajout ni suppression) ; collection préservée à **638 enchères + 188 cartes = 826 exercices**.
- Fichier maître et module d'enchères généré identiques pour les QCM ; contrôle dédié dans `tests/training-smoke.cjs`.
- L'interface affiche déjà `sourceContext` et `question` avant les choix ; service worker réseau-d'abord et revalidation sans cache pour les fichiers de l'Entraînement.
- Revue pédagogique informée et ciblée : aucune prétention de contre-expertise aveugle ou d'unicité universelle. **Brouillon, pas de fusion automatique.**
