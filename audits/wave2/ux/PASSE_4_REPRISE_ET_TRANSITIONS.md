# M3 — PASSE 4 : reprise, transitions et progression
Branche `wave2/experience-eleve-20261121` ; état précédent `415797a934f0cd389d7473d40928364e2f0bb19d`.

## Constats avant correction
Le retour depuis une séance ou un bilan masquait le bouton qui détenait le focus sans rediriger le clavier vers un contrôle visible. La progression affichait le nombre de réponses traitées mais pas la position courante sur cet indicateur. La reprise existante conserve déjà les réponses et la position dans `QPJBParcours.start` ; elle ne doit pas être réécrite.

## Livraison
- Après suspension ou retour du bilan, remettre le focus sur **Reprendre ma séance** dans le parcours, ou **Nouvelle séance** dans le quiz libre, après le repositionnement de la page.
- Annoncer « Séance reprise. Question N sur M. » exclusivement si une séance guidée existait déjà.
- Indiquer « Question N / M · X réponses enregistrées » sans inférence pédagogique ni changement de score.
- Aucun changement aux fonctions de sauvegarde, à la structure des états, aux réponses ou au moteur.

## Mesures / limites
Quatre remplacements de code univoques, quatre garde-fous statiques complémentaires dans `tests/wave2-ux-contract.cjs` (**23** au total). Comparaison avant/après du script `training-data` strictement identique : **1 523 QCM, 22 rubriques, IDs inchangés**. Les tests Node et la reprise réelle en Chromium/WebKit requièrent une exécution dans le checkout/CI : résultat non présumé.

**PASSE 4 FINIE (implémentation). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P5 accessibilité 320–390 px, zoom, clavier, mouvement réduit et scénario navigateur.**