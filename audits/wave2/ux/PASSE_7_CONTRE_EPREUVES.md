# M3 — PASSE 7 : contre-épreuves des transitions et du test zoom
Branche `wave2/experience-eleve-20261121`, parent `3fe753987d4004f69bf529612937a3971faba8ac`.

## Anomalies reproductibles dans le code
1. Le test « 195 px / zoom » comptait les colonnes avec un séparateur de type `/\\\\s+/` au lieu de `/\\s+/` : deux erreurs de test, rectifiées.
2. Après suspension ou bilan, le focus sur le bouton visible pouvait réajuster le défilement que la vue venait de restaurer : correction vers `.focus({preventScroll:true})`.
3. Avec un filtre **À retravailler** et aucun historique, le tableau n'a aucune question : la navigation d'évitement indiquait le retour, sans donner effectivement le focus à ce bouton pourtant visible, tandis que le panneau de réglages est masqué. Ce cas reçoit maintenant un vrai focus de repli.

## Contre-épreuves
- Scénario navigateur ajouté à `tests/wave2-ux-browser.cjs` pour un ensemble vide (nouvel élève, filtre « review »), retour par clavier et bonne cible de saut.
- Deux garde-fous de structure supplémentaires : **30/30 vérifiés** dans l'outil d'analyse.
- Trois scripts JavaScript compilés sans erreur ; JSON strictement inchangé : **1 523 QCM, 22 thèmes, 1 523 IDs uniques**.
- Aucune écriture de score ni de schéma de sauvegarde. La nouvelle suite navigateur reste **non exécutée** tant que la CI ne la référence pas ; les scénarios existants Chromium/WebKit ont été validés sur P3.

**PASSE 7 FINIE (corrections ciblées). MISSION DÉFINITIVEMENT TERMINÉE : NON. PROCHAINE PASSE : P8 — examiner les checks P5–P7 terminés et les limitations de recette.**