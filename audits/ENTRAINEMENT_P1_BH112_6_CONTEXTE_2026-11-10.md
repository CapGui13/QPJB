# QPJB Entraînement — lot P1 BH-112 (10 novembre 2026)

## Sources originales vérifiées
Sujet et corrigé de **Votre Bridge Hebdo Débutant n°112, 19 avril 2024**, page 1 ; contrôles textuel et visuel.

- Sujet SHA-256 : `986a34639f93662f506b01c84327fbeca70d086f4f03993907c0f6520b5e32b4`.
- Corrigé SHA-256 : `9bf3e4b6c7f5590de8155ef99d0dcab25e7c1c926e22495b19e4cb174d2011b5`.
- Archive : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.

Les 6 énoncés QPJB étaient dépourvus de l'indication **de vulnérabilité**, présente dans les documents sources. Le choix retenu par le fascicule est préservé.

| ID | Vulnérabilité originale | Réponse inchangée |
|---|---|---|
| EN-BH-112-01 | Personne vulnérable | Contre |
| EN-BH-112-02 | Nord–Sud vulnérables seulement | Passe |
| EN-BH-112-03 | Personne vulnérable | 1♠ |
| EN-BH-112-04 | Personne vulnérable | 2♠ |
| EN-BH-112-05 | Tous vulnérables | 2♥ |
| EN-BH-112-06 | Est–Ouest vulnérables seulement | Passe |

## Clarifications pédagogiques
**EN-BH-112-02 :** le texte original affirmait que les interventions en mineure au palier de 2 exigent 6 bonnes cartes. Une leçon **FFB** admet **6 belles cartes / 9 H ou 5 très belles cartes / 12 H** ; il ne faut donc pas exclure catégoriquement une intervention cinquième. La main réelle (♦RV863, 13 H) reste insuffisamment solide à vulnérabilité défavorable : **Passe** inchangé. Source pédagogique : `https://cdn.ffbridge.fr/cms/geds/0001/01/c7a84cba11443f52affe686302d5b09ac43b97f8.pdf`, séance 14.

**EN-BH-112-06 :** 17 H mais aucune tenue ♠, seulement deux ♥ et quatre ♦ : le choix documentaire reste Passe. Le corrigé ne garantit pas de pouvoir reparler plus tard ; formulation prudente ajoutée.

## Garantie d'intégrité
- Six QCM édités, **632** autres enchères et **188** jeux de la carte inchangés, total 826.
- Aucun changement de mains, séquences, propositions, réponses, ID, provenance ni statuts historiques.
- Tests dédiés intégrés à `tests/training-smoke.cjs` ; sources maître et module enchères synchronisées.
- **Relecture documentaire informée** et non contre-expertise indépendante des 6 décisions d'enchère. Toute remise en cause de la clé nécessiterait un audit supplémentaire.

## Fiabilité CI WebKit (correctif de test uniquement)

Pendant la CI de cette PR, le contrôle de l'affichage des entames du Lot 07 dans WebKit a dépassé le délai de **10 secondes** lors de l'attente du diagramme, alors que l'audit des données et Chromium réussissaient. Ce même sélecteur a occasionnellement échoué lors d'autres publications sans modification du lot 07. Le délai d'attente pour **le seul sélecteur du diagramme** passe à **30 secondes** dans `tests/training-lot07-publication-browser.cjs` ; aucune assertion, aucune donnée et aucun code de l'application ne sont affaiblis ou modifiés. Si le diagramme ne devient pas visible, le test continue d'échouer. Le nouveau commit doit repasser la CI complète.
