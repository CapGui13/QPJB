# QPJB — unification du parcours élève autour de la V1 (20 novembre 2026)

## Décision de produit

La V1 intégrée à la rubrique **Quizz** est le seul parcours proposé dans la navigation publique. Le bouton de la page d'accueil reste identique. On retire seulement l'encart `qpjb-v2-quizz-entry` et sa règle CSS ; on ne change ni `quizz.html` ni `quizz-parcours.js`.

Le fichier autonome V2 `preview/v2-eleve/parcours-sef-65-r1.html` est **conservé sans modification**. Son URL directe peut encore s'ouvrir pour reprendre ou exporter une progression existante ; il n'est plus promu depuis l'accueil. Aucun localStorage n'est effacé : `qpjb-sef-parcours-01` (V1) et `qpjb-v2-eleve-65-pedago-r1` (V2) restent distincts. Ne pas migrer silencieusement entre les deux systèmes.

## Apports V2 déjà transférés à la V1

La PR #224 a livré la diversité des cinq ouvertures et Passe en séance 1, les rappels alternatifs d'une même notion après succès autonome, et l'import validé d'un export JSON avec sauvegarde de sécurité. PR #218 et #219 ont livré le suivi/export, la préférence de difficulté et l'espacement adaptatif. Pas de second moteur élève à construire.

## Inventaire des 19 arbitrages validés

Source de vérité : `Docs/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json`.

- **15 décisions** : conserver strictement la réponse/correction originale. Aucune retouche de catalogue autorisée.
- **SEF-V416-008 et SEF-V416-009** : double transfert 4♣ et 4♦ validé pour un **nouvel énoncé explicitant l'objectif du transfert**. La validation est circonscrite à la proposition de reformulation V2, et n'autorise pas à remplacer la réponse seule dans le Quiz public.
- **SEF-L25-007** : 2SA confirmé comme modulation positive du Texas Trèfle, avec complément à Trèfle et main non minimum, pas obligatoirement maximum. La décision prévoit la réécriture de l'explication dans le prototype V2 ; aucun changement de corrigé.
- **SEF-L06-029** : classification pédagogique V2 « Ouvertures conventionnelles / barrages » ; préserver ID, réponse 4♦ et thème original `sa` dans le catalogue public.

**Conséquence** : harmoniser veut dire respecter le fond des décisions **sans importer aveuglément des mutations de la V2**. Un éventuel changement éditorial V1 devra comparer la question source et la proposition complète, puis obtenir une validation propre à la V1.

## Classification fine : travail à reprendre sur V1, pas à publier à l'aveugle

L'audit V2 #221 couvre **903** repères contextuels déterministes, **79** classifications candidates SA/Stayman/Texas à confirmer exercice par exercice et **541** QCM sans classification fine : 1 523 QCM au total. Ce ne sont pas 903 compétences pédagogiquement homologuées. L'observatoire V2 est en lecture seule ; ne pas en déduire des seuils de maîtrise bloquants.

Suite du chantier V1 : vérifier les 79 candidats, classifier progressivement les 541 cas restants sur sources SEF, distinguer réussite autonome/aide/passe et valider sur simulations avant tout changement d'algorithme. Les acquis V1 et le Quiz libre restent intacts pendant cet audit.

## Tests et retour arrière

- `node scripts/v2-integration-guard.cjs` protège l'archive V2 (SHA canonique, 1 523 QCM, 0 supplément) et le point d'entrée V1 historique.
- `node tests/v2-integration-entry-browser.cjs` vérifie sous Chromium et WebKit qu'aucun lien V2 n'est proposé, que la V1 démarre dans Quizz et que l'ancienne URL V2 reste lisible directement.
- Aucun exercice, corrigé, identifiant, clé de sauvegarde ou code de moteur pédagogique modifié par cette PR.

La PR #223 (HOLD, doublon des améliorations déjà livrées par #224) a été fermée sans fusion.
