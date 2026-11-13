# Mission H — clôture d'intégration contrôlée (13 novembre 2026)

**Dépôt** : `CapGui13/QPJB` · **Branche** : `integration/entrainement-cloture-H-20261113` · **PR #167 en brouillon** · **Entraînement exclusivement**. **Aucune fusion, aucune publication sur `main`, aucune modification du Quiz SEF**.

## Bilan définitif du corpus recensé

| Décision sur chaque exercice source | Nombre | Statut |
|---|---:|---|
| Déjà présent, rapprochement non contradictoire | 820 | Conservé |
| Déjà présent, divergence documentaire tracée | 6 | Conservé avec réserve |
| Original distinct validé par G | 137 | Ajouté au parcours complémentaire sur la branche H |
| Original distinct validé par F | 2 | Ajouté au même parcours |
| Exclu pour redondance confirmée (G 6 + F 3) | 9 | Non ajouté ; source/témoin et justification conservés |
| Bloqué (corrigé absent, incohérence ou justesse insuffisante) | 46 | Non ajouté ; dont 9 exercices BH-041 Avancé sans corrigé |
| **Total individualisé dans les fascicules accessibles** | **1 020** | **1 020 décisions renseignées** |

**Nombre d'exercices distincts représentés dans la proposition de publication H : 965 = 826 historiques + 139 nouveaux**. Le site actuellement publié sur `main` contient toujours **826** exercices, tant que cette PR n'est pas fusionnée.

Les réserves concernant un numéro BH historique 38 non conservé dans l'archive et de possibles fascicules extérieurs à celle-ci demeurent : cette clôture est exhaustive **pour les 1 020 situations des archives effectivement examinées**, pas pour tous les fascicules jamais parus.

## Modifications applicatives effectuées

1. `entrainement/training-originals-data.js` : 139 exercices supplémentaires issus des originaux F/G, indexés par leur identifiant source historique avec un ID QPJB stable préfixé `SRC-`. Répartition : **92 enchères, 27 jeux de la carte, 17 entames et 3 flancs**.
2. `entrainement/originaux.html`, `training-originals.js`, `training-originals.css` : véritable parcours interactif à **réponse libre**, avec recherche, catégories, navigation, révélation de la correction et auto-évaluation. Aucun distracteur de QCM ni jeu de cartes supposé n'a été inventé.
3. `entrainement/training-app.js` : lien d'accès au complément depuis l'accueil et depuis les deux espaces Enchères / Jeu de la carte. Les 826 anciens exercices restent dans leurs parcours et conservent leurs identifiants.
4. **154 corrections documentaires Bridge & Mois** issues de E : 132 fiches d'enchères et 22 cartes portent désormais l'origine correcte du PDF, son numéro de fascicule réel, sa référence et la valeur historique erronée. Les réponses, mains, énoncés et IDs de ces 826 fiches ne sont pas modifiés par ce traitement. Registre exact : `corrections_provenance_bm_154.csv`.
5. Synchronisation des modules `training-data.js`, `training-data-bidding.js`, `training-data-play.js` pour ces corrections de provenance. Le module des 139 originaux reste volontairement **séparé et chargé à la demande**, afin de préserver le chargement, les QCM existants et leurs tests historiques.
6. Progression : les nouvelles fiches utilisent le même stockage `QPJB_TRAINING_QCM_V1` mais de nouveaux IDs `SRC-...` non collisionnels. L'ajout ne remet à zéro aucune progression ancienne.

## Provenance, justesse et limites assumées

- Les **139 situations** ont des PDF sujets et corrigés originaux accessibles. Pour les **137 de G**, vérification des **137 sujets et 137 corrigés** contre les empreintes SHA-256 des registres ; de même pour les **deux de F**.
- Question/situation transcrites d'après l'inventaire documentaire A ; réponse pédagogique issue de la relecture G ou du verdict F ; pour cinq situations particulières, contexte ou réponse retranscrits du PDF original et signés dans la fiche. Les corrections et variantes signalées dans G ont été conservées en notes éditoriales. Notamment : `BH-004-1-S01-02` est une enchère (4♠), distincte de 2♠ ; `BH-053-S01-06` est bien 3♣ sur 1♥–1♠–2♣.
- **Attention au format** : les 139 fiches affichent les éléments pertinents du sujet et la **synthèse pédagogique F/G**, plus un extrait du corrigé lorsqu'il existe. Elles ne prétendent pas être une reproduction intégrale de chaque page PDF ni un QCM à quatre réponses ; une synthèse n'est pas le texte intégral du corrigé.
- Les **46 dossiers bloqués** n'ont été ni intégrés ni complétés par supposition. Les **9 sources redondantes** restent citées avec leur témoin. Les **6 ambiguïtés Bridge & Mois** déjà publiées restent annoncées : aucune main inventée ou « réparée » comme originale.
- Aucun ancien avis d'audit D déjà résolu n'a été rouvert ; les six cas indéterminables de D ne sont pas déclarés arbitrairement validés.

## Fichiers de décision vérifiables

- `registre_tracabilite_1020.csv` : décision par original, référence PDF, SHA et témoin QPJB.
- `matrice_transcription_139.csv` : identité et justification des 139 ajouts.
- `corrections_provenance_bm_154.csv` : 154 rectifications de provenance.
- Rapports sources : [A #154](https://github.com/CapGui13/QPJB/pull/154), [B #153](https://github.com/CapGui13/QPJB/pull/153), [C #150](https://github.com/CapGui13/QPJB/pull/150), [D #151](https://github.com/CapGui13/QPJB/pull/151), [E #156](https://github.com/CapGui13/QPJB/pull/156), [F #158](https://github.com/CapGui13/QPJB/pull/158), [G #160](https://github.com/CapGui13/QPJB/pull/160).

## Tests et publication

- `tests/training-cloture-h.cjs` : 1 020 décisions, 826 témoins publiés, 139 candidats, 46 bloqués, 9 redondances.
- `tests/training-originals.cjs` : 139 IDs et sources, contrôle du filtrage F/G, 154 corrections Bridge & Mois, conservation des 826 identifiants et absence de choix artificiels.
- `tests/training-originals-browser.cjs` : parcours mobile de révélation, sauvegarde commune, maintien de progression et accès via l'application intégrée ; exécuté séparément sous Chromium et WebKit.
- CI générale `QPJB Training smoke` : audit des données, contrôles de régression, tests Chromium et WebKit.

**Statut de publication : PR #167 en brouillon, non fusionnée. L'accord explicite du propriétaire du dépôt est obligatoire avant toute publication.**
