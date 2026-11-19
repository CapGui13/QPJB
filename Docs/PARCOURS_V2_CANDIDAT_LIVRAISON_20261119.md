# QPJB — candidat de livraison isolé du parcours SEF (19 novembre 2026)

## Objet et périmètre

Cette branche et sa PR **Draft** sont fondées sur `main`, et non sur la branche laboratoire de la PR #214. Elles préparent un **artefact téléchargeable pour examen**, pas une publication.

Le fichier de départ est `preview/v2-eleve/parcours-sef-65.html` au commit exact `88b548763bf271109f7916acbf1858865070f8ae` de la PR #214. Son blob Git attendu est `e2f0d4c96b7bab67d0a684e22d1845961f659a9b`. Toute modification de ces octets doit être revue et entraîner une mise à jour explicite des références ; aucun téléchargement de la branche flottante n'est accepté.

Le candidat conserve **1 523 QCM SEF d'origine**, **65 séances de 10 QCM**, le moteur et le tableau de progression du prototype, ainsi qu'une **sauvegarde locale indépendante** (`qpjb-preview-v2-eleve-01`). Il n'inclut **aucun** des huit exercices expérimentaux du laboratoire AZ et n'altère aucune réponse.

## Exécution et garanties

Le workflow `.github/workflows/qpjb-v2-release-candidate.yml` :

1. récupère la page et les preuves de provenance à un SHA de commit **immuable** ;
2. vérifie l'empreinte Git du HTML, l'identité des 1 523 QCM face au Quiz original de ce même commit, les 65 séances, les éléments de suivi, l'absence de suppléments, les 19 décisions en attente et l'état `HOLD` ;
3. produit une archive GitHub Actions `qpjb-v2-65-seances-apercu-prive` avec un **seul HTML autonome** et un manifeste comportant le SHA-256 calculé ;
4. n'a **aucun** droit `pages: write`, **aucune** commande `deploy-pages` et ne modifie ni `index.html`, ni `quizz.html`, ni GitHub Pages.

Un artefact Actions n'est **pas** un site internet déployé. Le HTML ouvert localement en `file://` utilise une origine de stockage différente du site public : il ne reprend pas automatiquement les anciens progrès V1.

## Verrou pédagogique et politique de publication

Le manifeste d'arbitrage de la PR #214 contient **19 cas avec approbation `PENDING`**, `teacherApproval=false` et `releaseDecision=HOLD`. Ce packaging **échoue volontairement** si ces états ne correspondent plus au snapshot figé : ce changement nécessitera une nouvelle préparation contrôlée. Les 8 suppléments restent hors du parcours standard.

**Ne pas fusionner cette PR pour « publier » le parcours.** Une fusion ne créerait que le générateur et son workflow, sans HTML de production. Pour mettre réellement V2 à disposition des élèves, créer une PR de déploiement *distincte* seulement après validation pédagogique, bilan technique vert, choix de la navigation et accord de publication explicite.

## Découpage recommandé de la future publication

- Conserver `quizz.html` et le parcours V1 comme solution par défaut. Aucun transfert artificiel de maîtrise V1 → V2.
- Publier *uniquement* le HTML approuvé dans un emplacement public dédié, puis ajouter un lien réversible dans la navigation **après** validation. Les autres pages `preview/`, scripts, audits, cas de revue et suppléments AZ ne font pas partie du paquet.
- Contrôler la livraison sur l'origine réelle de QPJB, en Chromium et WebKit, ordinateur et mobile ; vérifier la reprise, le bilan d'une séance, huit historiques, l'isolation des sauvegardes et le retour V1.
- Pour revenir au parcours classique, retirer le lien V2 et laisser le HTML V2 retiré du paquet public ; **ne pas effacer les sauvegardes V1/V2** sans décision séparée.

## Etat du présent chantier

**Candidat d'artefact prêt à être testé, pas de recette CI déclarée réussie à sa création, pas de validation éditoriale et aucune publication.** La PR #214 reste distincte et expérimentale.
