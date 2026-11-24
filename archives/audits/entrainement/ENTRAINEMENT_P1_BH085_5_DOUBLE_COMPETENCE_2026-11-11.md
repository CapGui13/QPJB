# QPJB Entraînement — BH-085 : double compétence (11 novembre 2026)

## Sources documentaires
- *Votre Bridge Hebdo débutant* n°85 du 13 octobre 2023, sujet et corrigé originaux, page 1 inspectée.
- Sujet : `85 Exercice Votre Bridge Hebdo débutant 13-10-2023.pdf`, SHA-256 `d47144a9228f5498826cee692570f18ad6ac8a6422aa41a0afc7a3b2d57bbe63`.
- Corrigé : `85 Solution Votre Bridge Hebdo débutant 13-10-2023.pdf`, SHA-256 `58910408d99da2a45b9d8e619c762fd02d97531029688279dd312ebdf3031a41`.
- Archive : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.
- Écart documenté : la consigne demande de qualifier le caractère forcing/non forcing de l'enchère du partenaire, puis de choisir sa propre enchère ; l'application ne testait que le second point.

| Fiche | Classification source | Réponse inchangée |
|---|---|---|
| EN-BH-085-01 | Non forcing, invitation à la manche | Passe |
| EN-BH-085-02 | Non forcing, soutien au palier de 3 dans le système du document | Passe |
| EN-BH-085-03 | Non forcing, 4SA quantitatif | 6SA |
| EN-BH-085-04 | Forcing un tour et auto-forcing, bicolore cher | 3SA |
| EN-BH-085-05 | Non forcing, répétition à saut | Passe |

## Portée exacte
- Cinq fiches BH-085 existantes ; aucune nouvelle fiche, aucune modification de main, séquence, choix d'enchère, bonne réponse, ID, provenance, explication ni statut historique.
- Le catalogue garde 638 enchères et 188 exercices de carte.
- Deux étapes : classification forcing / non forcing requise avant l'affichage du QCM d'enchère ; seule la justesse des deux décisions valide l'exercice.
- L'enregistrement de la tentative `forcingPick` est ajouté au même ID, sans remise à zéro de la progression historique ; la première tentative demeure fausse si une correction intervient après coup.
- État de classification conservé lors de la navigation interne ; cache PWA versionné pour remplacer les actifs hors ligne.
- La question n°6 du fascicule n'est pas publiée : elle n'est pas ajoutée.
- Relecture documentaire informée, non contre-expertise indépendante de l'unicité universelle de toutes les enchères.

## Tests avant fusion
- Intégrité des deux modules (`split_training_data --check`), assertions spécifiques BH-085.
- Test de bout en bout (Chromium, WebKit) : classification préalable, sélection des quatre enchères, bonne réponse, cas bonne enchère avec classification erronée, progression du premier essai.
- Ne pas fusionner avant CI verte et revue.
