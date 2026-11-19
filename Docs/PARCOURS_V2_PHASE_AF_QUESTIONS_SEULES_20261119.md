# QPJB — Phase AF : questions seules et progression automatique

**19 novembre 2026 · PR #214 · consigne utilisateur actualisée.**

## Décision pédagogique

- **Aucune leçon écrite dans le parcours.** L'enseignante enseigne à l'oral. QPJB sert à s'entraîner avec les QCM existants.
- **Progression automatique, sans supervision imposée.** Aucun thème à valider manuellement par l'enseignante. Quand un élève rencontre une notion non encore étudiée à l'oral, il peut la demander à l'enseignante.
- **Rubensohl est avancé**, mais il est éligible à partir de la **séance 35** (index 34) selon la feuille de route existante. Les notions précédentes comprennent 1SA, Stayman, intervention et Multi-Landy. L'éligibilité n'oblige pas à faire apparaître une question dès cette séance dans tous les profils.
- **49 QCM Rubensohl** et les **1 523 QCM du catalogue** restent inchangés ; les séances comprennent toujours **10 questions**.
- Le verrou manuel proposé lors de la phase AF initiale est **annulé**. Aucune interface de confirmation n'est à construire.

## Implémentation dans la branche expérimentale

Le script de simulation AF ne filtre plus les questions Rubensohl et utilise le même catalogue que V2-F. Il délègue leur disponibilité à la règle d'introduction P.INTRO et aux étapes candidates existantes. L'option obsolète teacherConfirmedBeforeSession est refusée pour éviter le retour d'un verrou manuel. Le moteur V2-F de référence, les QCM et les corrigés ne sont pas modifiés.

Les essais documentaires AB–AE (mini-leçons, reformulations, fiches) restent archivés, **non activés** et ne sont pas requis pour poursuivre le parcours.

## Contrôles

- Le test AF vérifie 34 premières séances sans Rubensohl, puis disponibilité automatique à la 35e ; dix questions par séance, familles distinctes et absence de leçons.
- Les sélections et les rappels doivent être **identiques à V2-F**, sans filtre Rubensohl ajouté.
- Le workflow AF vérifie **9 simulations fictives × 45 séances × 10 QCM** et contrôle le catalogue original. Les réponses d'élèves ne sont pas collectées.

## Publication

**La PR #214 est une branche de travail, sans déploiement automatique de V2-F sur le site QPJB.** La validation du changement de code dépend du résultat de la CI ; la publication future de la nouvelle version complète est une étape distincte.

## Historique

La version précédente de ce rapport prévoyait un blocage manuel du Rubensohl. **Cette décision a été explicitement remplacée le 19 novembre 2026 par une progression automatique**. Les résultats antérieurs de l'ancien scénario bloqué ne sont plus les résultats attendus pour la version en cours.
