# Entraînement QPJB — contextualisation de deux QCM P0 (9 novembre 2026)

**Périmètre :** `EN-1sa-011` et `EN-BH-115-06`. Cette PR est destinée à la revue : aucun changement de réponse, de main, d'enchères, de proposition, de points de progression, ni de statut officiel de validation.

## Sources vérifiées

- Bridge & Moi n°18, sujet et corrigé du 1er mai 2026, question 5, p. 1 : le document répond **3♠ naturel** avec cinq Piques et quatre Cœurs après `1SA–2♣–2♦`.
- Bridge Hebdo n°115, sujet et corrigé du 10 mai 2024, question 6, p. 1 : le document précise **« sans convention particulière »** et recommande **4♥** avec un traitement naturel de `3♥`.
- Le chassé-croisé de l'enseignement FFB/SEF après Stayman négatif définit **3♥ = 4♥ et 5♠**, **3♠ = 4♠ et 5♥**, forcing de manche. Référence : https://cdn.ffbridge.fr/cms/articles/0001/04/874ab98deb6d80df72b62c4bfd5639e88f3018d1.pdf

## Retouches contrôlées

- Affichage du **système choisi avant le choix de réponse**, dans la question et dans `sourceContext`, y compris en accès direct/aléatoire puisque l'application affiche les deux avant les propositions.
- Explications après réponse rappelant explicitement la solution du fascicule comme **variante licite selon la méthode**, et non comme erreur universelle.
- Mise en cohérence des commentaires de distracteurs et des conseils de pré-essai.
- Préservation des champs `id`, `hand`, `auction`, `correct`, `choices`, `reviewStatus`, `choiceStatus` et `sourceRef`.
- Fichier maître et module enchères synchronisés ; **638 enchères + 188 cartes = 826**.

## Réserve et contrôle de sortie

L'audit source ci-dessus est une **relecture informée** (pas une nouvelle contre-expertise aveugle). Les statuts de relecture existants sont volontairement conservés. **PR à laisser en brouillon** tant qu'une relecture éditoriale et les trois jobs CI (données, Chromium, WebKit) n'ont pas confirmé le bon affichage et l'absence de régression.
