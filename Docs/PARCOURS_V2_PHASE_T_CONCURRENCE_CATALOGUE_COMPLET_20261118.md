# QPJB — Phase T : concurrence dans le catalogue entier, décision S

**18 novembre 2026 · PR #214, branche d'audit uniquement · V2-F référence.**

## 1. Constat : un sous-ensemble candidat ne représente pas tout le catalogue

Les rapports Q/P associaient à la concurrence seulement **13 QCM d'intervention** et **12 QCM de réponse après Contre adverse**. La première apparition de ces *sous-ensembles* variait avec la graine, mais **ne devait pas être confondue** avec celle de toutes les questions compétitives.

`scripts/parcours-v2-audit-competition-t.cjs` mesure désormais simultanément :
- Le **thème complet** de concurrence (les rubriques `intervenir`, `contre`, `reponse_inter`, `apres_inter`) parmi les **1 523** QCM d'origine.
- Notre intervention sur une ouverture adverse au palier de 1, reconnue dans l'enchère originale.
- La réponse du répondant à un Contre d'appel adverse sur l'ouverture de son partenaire.
- La réponse à un **Contre du partenaire** (rôle distinct).
- Les 13 et 12 QCM des deux axes candidats P, pour quantifier l'effet d'échantillonnage.

Les dénominations de rubrique viennent du catalogue et les contextes précis de ses enchères ; aucun classement manquant n'est inventé.

## 2. Résultats du simulateur V2-F sur neuf parcours

Même base déterministe que Q/R : **trois profils fictifs × trois graines × 45 séances × 10 QCM**. Les neuf trajectoires ont été recalculées à partir des fichiers de la PR #214 en **lecture seule**. Ce sont des parcours synthétiques, **pas des statistiques d'élèves**.

| Premier événement dans les 45 séances | Intervalle sur les 9 scénarios |
|---|---:|
| Une question de concurrence parmi les quatre rubriques complètes | **Séance 12 à 20** |
| Notre intervention après une ouverture adverse au palier de 1 | **Séance 12 à 29** |
| Réponse après un Contre d'appel adverse sur l'ouverture du partenaire | **Séance 19 à 29** |
| Sous-ensemble cartographié de notre intervention (13 QCM) | **Séance 15 à 31** |
| Sous-ensemble cartographié de la réponse au Contre (12 QCM) | **Séance 19 à 32** |

Sur les **25 premières séances**, la concurrence au sens des **quatre rubriques du catalogue** est représentée **2 à 19 fois** selon le scénario. Parmi ces questions, celles où **nous intervenons** apparaissent **0 à 9 fois**, et les réponses après **Contre adverse** **0 à 2 fois**.

Même lorsqu'un scénario ne rencontre aucune des 13 questions cartographiées de notre intervention durant les 25 premières séances, cela **ne prouve pas** qu'aucun exercice de la rubrique `intervenir` n'a été présenté.

### Exemple contrôlé : profil équilibré, graine 13

- Première question du groupe compétitif complet : **séance 13**, réponse au Contre de notre partenaire.
- Premier QCM de `apres_inter` : **séance 15**.
- Notre première intervention sur ouverture adverse : **séance 20**.
- Première réponse après Contre adverse : **séance 22**.
- Premier exemple des 13 QCM cartographiés de notre intervention : seulement **séance 28**.

Cela explique le diagnostic initial trop pessimiste. **Il existe toutefois une vraie variabilité** entre profils et graines : l'absence relative de certains rôles précis (en particulier après Contre adverse) durant les 25 premières séances mérite une attention pédagogique, sans qu'un calendrier imposé soit démontré utile.

## 3. Expérience S : rejet après neuf scénarios

L'audit GitHub Actions **#44406082709**, job d'intégrité **#135161548321**, a **réussi** avec `tests/quizz-v2-comparer-s.cjs` et `scripts/parcours-v2-comparer-s.cjs`. Il a confirmé la comparaison des neuf scénarios.

La variante S imposait, dans une **copie du simulateur**, une situation de concurrence aux séances 13, 17, 21 et 25. **Elle améliore le nombre de questions compétitives des 25 premières séances dans 7/9 scénarios**, mais **7/9 scénarios violent au moins un critère conservateur** :
- Écart sur les familles distinctes dans les 450 QCM : **−4 à +4** par rapport à V2-F.
- Écart sur les rappels ciblés : **−1 à +1**.
- Au moins une réponse à 1♣ ou 1♦ réduite dans plusieurs scénarios ; un cas perd également un thème.
- Un scénario montre même **deux QCM compétitifs de moins** durant les 25 premières séances malgré les quatre cibles.

Le script lui-même renvoie `overallDecision: NOT_RETAINED_UNDER_CONSERVATIVE_CRITERIA`. **Décision ferme : S n'est pas retenue ; V2-F reste la référence.**

## 4. Intérêt de T et contrôles

Le fichier `tests/quizz-v2-concurrence-t.cjs` vérifie que l'audit T ne change ni les tirages ni les rappels de V2-F. Il compare les comptes de sous-ensembles P aux comptes plus vastes du catalogue entier et valide la conservation des 1 523 QCM originaux.

Cet observatoire doit servir de **garde-fou de mesure** avant de créer d'autres politiques d'injection. L'objectif immédiat est de perfectionner la **description des rôles et des micro-situations**, pas d'introduire davantage de questions avant leur moment d'éligibilité.

Pour le concours, les thèmes et les IDs sources du référentiel, aucune compétence n'est déclarée maîtrisée sur la seule base d'une apparition dans la simulation. Les 22 rubriques restent couvertes sur les neuf parcours, et V2-F conserve **440 à 450 familles distinctes** et **69 à 77 rappels ciblés**.

**État : `PHASE_S_REJETEE / PHASE_T_AUDIT_LECTURE_SEULE / V2_F_REFERENCE / AUCUN_DEPLOIEMENT`.**
