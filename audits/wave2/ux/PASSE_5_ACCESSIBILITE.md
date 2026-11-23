# M3 — PASSE 5 : accessibilité des mains et focus

Branche `wave2/experience-eleve-20261121` ; base précédente `8ac554ba48dc19f7d6c7a0ecd7ad281dd1c514c0`.

## Problèmes constatés sur les règles CSS (avant)
- La main était fixée sur **une ligne non repliable** (`flex-wrap:nowrap`) ; sous 340 px la police se réduisait à **11 px** et, au zoom, les valeurs pouvaient déborder.
- Les titres de question/corrigé recevaient un focus programmatique mais `outline:none` supprimait tout repère visuel.
- Les cellules de séquence vides utilisaient une teinte #9c8caa avec une opacité de 0,75 sur #352c40 : contraste calculé de l'ordre de 4,25:1 **avant application de l'opacité**.

## Corrections dans le seul bloc de style UX
- À 390 px et moins : main en **grille 2 × 2** à **19 px**, retours éventuels dans les longues tenues ; à 270 px et moins (zoom important), main **sur une colonne** et saisie/boutons clavier bridge réorganisés.
- Focus perceptible sur le titre de question, le corrigé, le titre du bilan et les boutons de retour à la préparation.
- Cellules vides de séquence en #c0b2ce sans opacité (contraste théorique ~6,62:1 sur #352c40).
- Le mouvement réduit existant (transitions et animations annulées) est préservé ; aucun symbole décoratif ajouté.

## Preuves, mesures et limites
- Garde-fous statiques ajoutés pour les trois paliers responsive, le focus et le contraste ; test navigateur `tests/wave2-ux-browser.cjs` préparé pour Chromium et WebKit, largeur 320/390, reprise et bilan ; il reste **à exécuter**.
- JSON `training-data` comparé strictement avant/après ; **1 523 QCM, 22 rubriques, IDs intacts**.
- Le contraste théorique et l'inspection CSS ne constituent **pas** des captures visuelles ni une validation lecteur d'écran : résultat à confirmer en P6.

**PASSE 5 FINIE (correctifs et scénarios). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P6 — recette CI Chromium/WebKit et évaluation visuelle avec limites explicites.**