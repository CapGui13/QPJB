# Mission UX V2 — passes 1 à 3 : audit ciblé et première correction

**Base commune :** `2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a`.
**Branche :** `wave2/experience-eleve-20261121`.
**Statut :** passes 1 à 3 réalisées partiellement ; passe 5 commencée ; **MISSION DÉFINITIVEMENT TERMINÉE : NON**.

## P1 — Audit statique de six parcours (terminé pour le code, recette navigateur non réalisée)

| Parcours | Points constatés dans le code | Risque / suite |
|---|---|---|
| Débutant / question | titre `#question-heading` focalisable, main et enchères, formulaire libre | accès direct depuis la navigation absent |
| Aide | bascule vers quatre propositions, focus sur premier bouton | région entière `#body` en `aria-live` trop bavarde |
| Erreur libre | texte `role=alert`, champ `aria-invalid` | absence d'association explicite via `aria-describedby` |
| Reprise | statut et message `parcours-resume-help` ; sauvegarde gérée par le moteur | vérifier réellement la reprise dans les deux navigateurs |
| Longue explication | `role=region` et focus du corrigé, saut de défilement conditionnel | couper mots longs et réduire les annonces parasites |
| Bilan | titres focalisables, trois comptes sans aide / avec propositions / erreurs | vérifier lecteur d'écran et petits écrans |

Ce tableau décrit **la structure et les fonctions inspectées**, pas six tests E2E exécutés.

## P2 — Priorités (terminé pour le tri, preuves visuelles à réaliser)

1. **P0** : le conteneur de tout l'exercice `aria-live=polite` pouvait provoquer la lecture complète de la main, des enchères, de la question et des réponses à chaque rerender.
2. **P1** : pas de lien clavier direct vers la question ; l'utilisateur devait traverser la navigation et les contrôles.
3. **P1** : erreur libre visible mais non reliée explicitement au champ.
4. **P2** : boutons et champs serrés sur 320–390 px ; explications longues potentiellement difficiles à lire.

## P3 — Première livraison fonctionnelle

Commit `82988c8b9e1ecf3ec9ed8674aa27ecec7034ab32` : `quizz.html` uniquement.
- Lien d'évitement clavier vers le titre de la question, visible au focus.
- Suppression de `aria-live` sur la totalité de `#body` ; création d'une annonce indépendante et concise de la question, des propositions et du corrigé.
- Association du message d'erreur libre au champ par `aria-describedby`.
- Titre de l'explication lié au paragraphe et retours focus visibles.
- Styles mobiles ciblés à 390/345 px, hyphénation du corrigé et respect du mouvement réduit.

**Mesure d'intégrité effectuée dans l'outil d'édition :** JSON `training-data` comparé **strictement à l'identique** avant/après ; **1 523 QCM**, **22 rubriques**, IDs non modifiés. Région des fonctions de sauvegarde en amont du nouveau code contrôlée inchangée. Aucune modification d'algorithme ou de résultat.

## Tests ajoutés

`tests/wave2-ux-contract.cjs` : 13 garde-fous de structure UI, plus 1 523 QCM, 22 thèmes, IDs uniques et comparaison stricte du JSON au commit de base par `git show` lorsque disponible.

Commits : `824be9af0b14fa576476e14f114bb347413c271d`, puis correction d'échappement `f17f2712d75e3a5ac181accc42c2e3b84bc7ad17`.

**Exécution Node / Chromium / WebKit : non réalisée à ce stade.** L'inspection des fichiers GitHub et les assertions d'intégrité à l'édition ne remplacent pas une exécution réelle de la suite. Il serait trompeur de déclarer les 13 tests « verts ».

## Passes restantes

- **P3** : vérifier l'ergonomie réelle de saisie, la séquence et le corrigé ; affiner après captures.
- **P4** : vérifier reprise / sauvegarde interrompue / transition, clavier et mobile.
- **P5** : recette à 320/345/390 px, paysage, 200 % de zoom, lecteur d'écran, contraste et reduced-motion.
- **P6** : tests Chromium + WebKit réels, captures comparatives, non-régression catalogue, CI et conservation des données.

**HOLD :** ne pas fusionner ni publier ; ne pas interpréter cette livraison comme une recette complète.
