# M3 — PASSE 10 : navigation clavier de bout en bout
Branche `wave2/experience-eleve-20261121`, parent `fdf07b5ff9f12adde45f4fdca3f9d669a6358766`.

## Risque mesurable restant
Le scénario M3 testait surtout les clics et les interactions tactiles ; les utilisateurs clavier devaient aussi être couverts de l'ouverture à la question suivante. Ce n'est pas un changement de moteur mais un trou de recette.

## Nouvelle recette
1. **Test navigateur `keyboardScenario`** dans `tests/wave2-ux-browser.cjs`, pour **Chromium et WebKit** : démarrage via Enter, focus au titre de la question, Enter sur « Voir les 4 propositions », première réponse focalisée, Enter pour répondre, focus au corrigé, Enter sur « Question suivante », focus revenu sur le titre.
2. **Test comportemental sans navigateur** dans `tests/wave2-ux-focus.cjs` : fonction réelle `renderChoicesWithFocus` extraite du HTML ; ordre exact `render → announce → focus sur première proposition avec preventScroll`.

## Vérification réellement effectuée
La vraie fonction `renderChoicesWithFocus` du HEAD a été exécutée en isolation dans l'outil d'analyse : **3 étapes sur 3 dans le bon ordre**, avec bon texte et `preventScroll`. Source JavaScript des deux scripts de test compilée sans erreur. Aucune modification de `quizz.html` ni du catalogue : **1 523 QCM / 22 rubriques**, verrou SHA-256 et 30 garde-fous existants maintenus.

La suite historique GitHub Training smoke de **P5 a réussi** ; le scénario clavier M3 ajouté reste **non exécuté** tant que le workflow ne le lance pas.

**PASSE 10 FINIE (tests et preuve isolée). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P11 — valider les checks achevés et traiter tout échec sans élargir le périmètre.**