# QPJB — Phase AY : vrai prototype de séances intercalées (sans publication)

**19 novembre 2026 · PR #214 (Draft) · chantier de prévisualisation uniquement.**

## Livrable et statut

La phase AY crée une comparaison de **65 séances complètes** entre le moteur **V2-F d’origine** et une variante expérimentale enrichie de situations d'ouverture authentiques. Il ne s'agit **pas** d'un déploiement du parcours V2.

- **AY-7 (par défaut)** : 7 situations complémentaires prévues aux séances 18, 21, 29, 32, 36, 39 et 43. Le cas de l'ouverture 2SA avec 19 H et mineure sixième n'est **pas** proposé d'office.
- **AY-8 (option d’inspection)** : les mêmes 7 situations, plus `EN-BH-114-06` à la séance 46, **marquée conditionnelle** à une décision sur les accords.
- **V2-F** : témoin sans ajout ; les 1 523 QCM SEF originaux restent inchangés.
- Pour chaque séance avec ajout : **9 QCM SEF originaux + 1 situation authentique** = 10 questions. Pour les autres : 10 QCM SEF originaux.
- **Entraînement** : 5 QCM existants, mêmes mains, choix, réponses et explications. **Bridge Hebdo 35** : 3 cas à **réponse libre**, aucun distracteur inventé.
- **Sept notions pédagogiques provisoires pour huit problèmes** : les deux mains de 19 H réguliers restent dans une seule famille.
- **Sauvegarde** : aucune lecture ou écriture de la progression historique. Les exercices complémentaires sont enregistrés dans un journal **en mémoire du simulateur uniquement**, sans crédits de maîtrise du moteur V2-F. Dans le HTML, les réponses de l’utilisateur ne sont pas persistées ; elles ne modifient pas le parcours.

## Périmètre des vérifications

Le script `scripts/parcours-v2-extension-ay.cjs` reconstruit les exercices additionnels **à partir des fichiers sources** `entrainement/training-data-bidding.js` et `Docs/PARCOURS_V2_PHASE_AV_ORIGINAUX_OUVERTURES_20261119.json`, contrôlés contre `Docs/PARCOURS_V2_PHASE_AX_CANDIDATS_OUVERTURES_20261119.json`. Il vérifie : mains de 13 cartes, réponses correspondantes, une famille par séance, aucun ID collisionnant avec le SEF, 10 questions par séance et **17 premières séances strictement identiques** au parcours de référence. Les profils restent **fictifs** (trois graines : 13/29/47).

Le script `scripts/parcours-v2-extension-ay-pack.cjs` produit un **HTML autonome**, intégrant les 65 séances et offrant choix profil, parcours témoin/AY-7/AY-8, accès direct aux huit séances candidates, réponses QCM et libres, et affichage des explications originales. Les résultats ne sont pas persistés.

Le workflow `.github/workflows/qpjb-v2-ay-extension.yml` est entièrement **hors production**. Il conserve ses rapports et le HTML en artefact GitHub Actions ; il ne déclenche aucune publication GitHub Pages.

## Points à ne pas confondre

1. Une **simulation** du moteur ne prouve pas qu'un élève apprend effectivement. Ses réponses sont déterministes, pas des observations réelles.
2. Une **question authentique** n'est pas automatiquement un exercice validé pour l'enseignement QPJB. **Toutes les validations éditoriales demeurent PENDING.**
3. **AY-7/AY-8 ne corrigent pas à eux seuls le manque structurel d'ouvertures avancées : trois à quatre nouvelles familles seulement parmi les cas forts, plus une variante et des rappels.** L'expérience est destinée à juger l'intégration et les conséquences sur les rappels.
4. Une séance AY avec réponse libre n'est plus constituée de dix QCM ; elle contient **dix questions dont une à réponse libre**.
5. Avant toute publication, choisir explicitement si une réponse libre peut entrer dans la formule pédagogique visée (ou rester en atelier séparé) ; valider les cas douteux et refaire une recette sur vrais élèves.

**Décision : `PR_DRAFT / RELEASE_HOLD / 0_VALIDATION_EDITORIALE / 0_QCM_SEF_MODIFIE / 0_DEPLOIEMENT`.**
