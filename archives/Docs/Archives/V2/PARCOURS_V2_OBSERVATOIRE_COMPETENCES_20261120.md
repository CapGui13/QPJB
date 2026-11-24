# QPJB — Parcours V2 / premier lot d'observatoire des compétences

**Source :** page élève publiée \`preview/v2-eleve/parcours-sef-65-r1.html\`, catalogue strictement inchangé de **1 523 QCM / 22 rubriques / 1 315 familles**.

## Constats de couverture auditables

| Catégorie de provenance | QCM | Portée |
| --- | ---: | --- |
| Contexte par règle déterministe V1 (\`P.microKey\`) | **903** | Repère de contexte, **pas** de validation pédagogique exercice par exercice |
| 14 étiquettes SA et 65 étiquettes Stayman/Texas candidates | **79** | Préclassifications documentées, **à valider** ; pas de maîtrise certifiée |
| Sans classification fine | **541** | Suivi possible au niveau de la rubrique seulement |
| **Total** | **1 523** | Aucune question absente ni ajoutée |

La classification candidate de \`SEF-L06-029\` est présentée sous **Ouvertures conventionnelles / barrages** dans le parcours V2, sans modifier son thème d'origine dans le catalogue.

## Changement élève

Le tableau repliable **« Mes notions travaillées »**, sur les écrans de suivi et de bilan, montre uniquement les notions réellement **observées dans la sauvegarde V2** : dernier résultat, nombre de séances où la notion a été rencontrée, erreurs consignées et provenance du repère. Les domaines « rubrique:* » non classifiés restent signalés séparément, sans leur inventer une micro-compétence.

**Choix délibéré** : aucun indicateur n'affirme la maîtrise d'une notion. Les 79 catégories SA/Stayman restent « classification candidate ». Les QCM historiques sans réponses détaillées ne sont pas reconstitués. Le tableau est en lecture seule.

Le calendrier automatique des 65 séances, l'éligibilité Rubensohl à partir de la 35e séance, les 10 QCM/séance, les rappels, la difficulté, les choix, les corrigés et les 19 décisions pédagogiques sont inchangés. Aucun cours, seuil bloquant ou confirmation manuelle n'est ajouté. Le schéma et la clé de sauvegarde \`qpjb-v2-eleve-65-pedago-r1\` restent identiques.

## Vérifications

- \`node scripts/v2-competences-audit.cjs\` : recensement de chaque ID et contrôle 903 + 79 + 541 = 1 523.
- \`node tests/v2-competences-observatoire.cjs\` : assertions de provenance, syntaxe des scripts, absence de prétention de maîtrise, invariants d'interface et de sauvegarde.
- \`node tests/v2-competences-observatoire-browser.cjs\` : deux navigateurs, état synthétique de 13 séances, repères réels/provisoires et rubrique non classifiée, affichage sur l'accueil/bilan, lecture sans écriture dans la sauvegarde.
- Tests existants \`v2-ergonomie-65\` et intégration du bouton Quizz, avec audit global QPJB.

## Ce qui reste à faire — non inclus dans ce premier lot

1. **Revue SEF individuelle des 79 préclassifications** et poursuite des **541 questions** sans micro-compétence, en donnant la priorité aux conventions et aux réponses après fit.
2. Étudier l'utilisation de ces catégories vérifiées pour mieux **adapter la découverte** sans imposer de seuil de déblocage ; protocole comparatif V2-F, pas de substitution sans bénéfice démontré.
3. Différencier **réponses libres, propositions QCM et questions passées** dans la V2 de 65 séances pour enrichir les preuves, sans toucher au Quiz libre.
4. Revoir les formulations « aperçu privé / hors production » dans le HTML élève avec recette UX spécifique.
5. Décider de l'après-séance 65 sans transformer implicitement 650 QCM en couverture totale du catalogue.

**Cet observatoire est une première livraison contrôlée, pas la clôture du projet pédagogique complet.**
