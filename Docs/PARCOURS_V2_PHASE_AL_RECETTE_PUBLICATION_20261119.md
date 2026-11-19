# QPJB — Phase AL : porte de publication et recette V1/V2

**19 novembre 2026 — PR #214 — préparation uniquement, aucune publication.**

## Situation technique

- V2 reste **100 % QCM du catalogue original (1 523)**. Il n'existe ni cours écrit ni vérification d'enseignante dans l'expérience élève ; Rubensohl est éligible automatiquement à partir de la séance 35.
- L'entrée « Tester le parcours V2 » est **masquée par défaut** dans `quizz.html` et activée, sur la branche de test, seulement avec `?v2preview=1` transmis depuis `index.html`.
- V2 utilise la clé `qpjb-sef-parcours-v2-01`. Les clés historiques `qpjb-sef-parcours-01` et `qpjb-sef-entrainement-01` sont **en lecture seule** pour V2, sans migration ni réinitialisation implicite.
- La page et les fichiers du site classique ont été modifiés **dans la PR uniquement**. Aucun déploiement sur `main` ni sur GitHub Pages n'est réalisé ici.

## Vérification de la revue des 19 alertes

`Docs/PARCOURS_V2_PHASE_AL_MANIFESTE_ARBITRAGE_20261119.json` contient exactement les 19 IDs détectés dans `preview/parcours-v2-autonome.html`, chacun avec son motif source, priorité, observation et référence documentaire éventuelle. Ce document est **une proposition de classement, pas une décision pédagogique prise par l'enseignante**.

Les tests `scripts/parcours-v2-audit-sensibles-ak.cjs` et `scripts/parcours-v2-publication-gate-al.cjs` assurent notamment :

- identité exacte des 19 signalements et des 1 523 QCM actifs ;
- présence de la bonne réponse dans les choix, mains de 13 cartes et comptes de points H dans l'extracteur AK ;
- conformité du manifeste avec les notes des 19 signalements, présence d'une justification et statut d'approbation explicite ;
- refus logique d'une décision `GO` si un seul statut éditorial reste `PENDING` ou `REJECTED`, ou si `teacherApproval` est faux.

**La CI n'autorise pas actuellement une mise en ligne.** La commande d'audit standard réussit si les données sont cohérentes, même avec `releaseDecision=HOLD` ; c'est volontaire. La commande `node scripts/parcours-v2-publication-gate-al.cjs --require-ready` doit **échouer** tant que les points bloquants restent ouverts. Le script ne contrôle pas à lui seul le bouton Fusionner de GitHub : il fournit une preuve de recette, pas une règle de protection de branche.

### Décisions encore ouvertes

- **P1 — 4 cas** : `SEF-V416-008`, `SEF-V416-009`, `SEF-L18-007` (cohérence 4♥/4♠ directs vs double transfert après Stayman 2SA) ; `SEF-L25-004` (Passe sur Texas ♥ contré avec **♦AD84**, non-fit mais arrêt Carreau).
- **P2 — 15 cas** : précisions de modulation Texas ♣, accords de Stayman/Texas contrés, autres développements du Stayman, Texas mineur SEF 2024 et classement de 3SA gambling. Les cas compatibles avec les sources secondaires restent `PENDING` jusqu'à validation de leurs accords.
- **Attention aux versions du SEF** : des fiches de Texas mineur présentent encore les anciennes annonces inversées des courtes. Les **synthèses SEF 2024** donnent 3♥ = courte ♥, 3♠ = courte ♠, 3SA = courte dans l'autre mineure. Vérifier la date et la référence avant toute correction. Cela n'implique pas que les deux exercices signalés soient erronés.
- Les 19 flags sont un **sous-ensemble** des cas évoqués dans les audits : un examen du catalogue complet pourra être séparé de la publication V2.

## Protocole de recette, avant toute fusion

1. **Source et comportement** : aucune question inventée ; pas de réécriture silencieuse des réponses ou familles ; simulation V2-F et rappels comparés aux attentes ; pas de déblocage manuel ; vérifier la cohérence des 10 questions par séance.
2. **Navigateurs** : navigation `index.html?v2preview=1` → Quiz classique → lien V2 → retour V1, avec réouverture, interruption avant/après réponse, redémarrage, 10 réponses et réinitialisation ; exécuter en **Chromium et WebKit**, formats ordinateur et mobile.
3. **Stockage** : vérifier que V1 / historique Quiz restent inchangés **octet pour octet** après toute manipulation V2 ; sur `file://`, ne pas prétendre lire la sauvegarde du vrai domaine ; aucune copie entre navigateurs n'est prévue.
4. **Édition** : arbitrer les 19 cas **un par un**, documenter l'accord système adopté et effectuer si nécessaire des corrections dans un chantier séparé, avec leurs propres tests.
5. **CI** : vérifier le dernier SHA de la PR, **tous les jobs requis**, notamment `QPJB Training smoke`, `Quiz SEF - integrite du catalogue`, `QPJB V2-AI`, `QPJB V2-AJ` et les contrôles AK/AL.
6. **Approbation humaine** : décision explicite de l'enseignante sur les cas / libellés et sur le mode de mise à disposition. Aucun statut ne doit être passé en `APPROVED` automatiquement à cause d'une simulation ou d'une source secondaire.

## Proposition de publication réversible (NON EXÉCUTÉE)

**Étape 1 recommandée : prévisualisation facultative** — conserver le Quiz classique comme expérience par défaut, présenter V2 via une entrée explicitement expérimentale après validation, et mesurer uniquement les retours volontaires (pas de suivi d'élèves sans consentement). Ne pas déclarer le parcours V2 équivalent au V1 historique.

**Étape 2 éventuelle : intégration normale** — choisir la place de V2 dans la navigation et la politique de progression, puis publier seulement après nouvelle recette. La mise en ligne n'est **pas** déclenchée par l'existence du fichier V2 dans la branche.

**Repli** : rétablir l'ancien lien/page V1 et retirer l'entrée publique V2 (revert des changements de navigation concernés), sans effacer les clés historiques V1. Ne pas effacer non plus la sauvegarde V2 des navigateurs sans décision distincte ; masquer un lien n'est pas une suppression de données.

**Statut actuel : `HOLD / 4_P1 / 15_P2 / 0_APPROBATION / AUCUNE_FUSION / AUCUN_DEPLOIEMENT`.**
