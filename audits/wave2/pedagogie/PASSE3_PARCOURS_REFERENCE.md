# QPJB — M1 / Passe 3 : trois parcours pédagogiques de référence (propositions hors production)

**PASSE 3 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

## Règles de construction reproductibles
- Entrées : catalogue figé 1 523 QCM, ROADMAP de `quizz-parcours.js` (lecture seule), exclusion stricte des 36 IDs en attente de validation.
- Trois **parcours d'étude proposés**, distincts du tirage adaptatif de production ; aucune modification de l'ordre ou du moteur V1.
- Par thème : filtrage par difficulté, ordre croissant difficulté puis ID lexicographique, une seule occurrence par `caseFamily` et par signature `(auction entière, answer)` ; maximum 5 cas pour découverte et 4 pour les autres.
- Les parcours sont des **supports de vérification et de progression**, non des validations de maîtrise ni des recommandations personnalisées.
- Contrôle d'unicité : 92 IDs sélectionnés, 92 IDs distincts, 0 des 36 propositions historiques ; 22 thèmes couverts.

## Vue synthétique
| Parcours | Thèmes | Cible | QCM retenus | Rubriques sous-remplies |
|---|---:|---|---:|---|
| Découverte (sans conventions avancées) | 4 | N1–N2 | 20 | Aucune |
| Consolidation des enchères naturelles | 10 | N2–N3 | 40 | Aucune |
| Joueur à l'aise — conventions et enchères complexes | 8 | N3–N5 | 32 | Aucune |

## Séquences de travail, par rubrique (ordre pédagogique existant)
### 1. Découverte (sans conventions avancées)
- `ouv` (introduction V1 séance index 0) : `SEF-001-1` (N1, 1SA) ; `SEF-004-1` (N1, 2SA) ; `SEF-006-1` (N1, 1♠) ; `SEF-007-2` (N1, 1♥) ; `SEF-009-2` (N1, 1♦). Réservoir N1–N2 hors 36 : 72.
- `majeur` (introduction V1 séance index 1) : `SEF-026-1` (N1, 2♥) ; `SEF-027-1` (N1, 2♠) ; `SEF-029-1` (N1, Passe) ; `SEF-030-1` (N1, Passe) ; `SEF-V410-022` (N1, 1♠). Réservoir N1–N2 hors 36 : 71.
- `mineur` (introduction V1 séance index 1) : `SEF-015-1` (N1, 1♥) ; `SEF-016-1` (N1, 1♠) ; `SEF-019-1` (N1, 1♠) ; `SEF-022-1` (N1, 1SA) ; `SEF-023-1` (N1, 1SA). Réservoir N1–N2 hors 36 : 62.
- `sa` (introduction V1 séance index 3) : `SEF-031-1` (N1, Passe) ; `SEF-032-1` (N1, 2SA) ; `SEF-033-1` (N1, 3SA) ; `SEF-041-1` (N1, 3SA) ; `SEF-N097-1` (N1, Passe). Réservoir N1–N2 hors 36 : 64.

### 2. Consolidation des enchères naturelles
- `red` (introduction V1 séance index 4) : `SEF-042-2` (N2, 1♠) ; `SEF-043-1` (N2, 1♠) ; `SEF-044-1` (N2, 1SA) ; `SEF-047-1` (N2, 1♥). Réservoir N2–N3 hors 36 : 95.
- `second` (introduction V1 séance index 6) : `SEF-052-1` (N2, 2♥) ; `SEF-053-2` (N2, 2♠) ; `SEF-054-1` (N2, Passe) ; `SEF-055-2` (N2, Passe). Réservoir N2–N3 hors 36 : 100.
- `stayman` (introduction V1 séance index 7) : `SEF-V3-002-1` (N2, 4♥) ; `SEF-V3-004-1` (N2, 4♠) ; `SEF-V3-006-3` (N2, 3SA) ; `SEF-V3-011-1` (N2, 2♦). Réservoir N2–N3 hors 36 : 55.
- `apres_fit` (introduction V1 séance index 8) : `SEF-V4-001-1` (N2, Passe) ; `SEF-V4-013-3` (N2, Passe) ; `SEF-V416-006` (N2, 3♠) ; `SEF-V421-012` (N2, 3♥). Réservoir N2–N3 hors 36 : 32.
- `intervenir` (introduction V1 séance index 10) : `SEF-V3-027-2` (N2, 1♥) ; `SEF-V3-029-1` (N2, 1♥) ; `SEF-V3-031-1` (N2, 1♠) ; `SEF-V3-033-1` (N2, 1♠). Réservoir N2–N3 hors 36 : 62.
- `contre` (introduction V1 séance index 12) : `SEF-C-010` (N2, 1♠) ; `SEF-V3-057-1` (N2, 1♥) ; `SEF-V3-058-1` (N2, 1♠) ; `SEF-V3-059-1` (N2, 1♥). Réservoir N2–N3 hors 36 : 40.
- `reponse_inter` (introduction V1 séance index 13) : `SEF-V4-025-1` (N2, 2♥) ; `SEF-V4-027-1` (N2, Passe) ; `SEF-V4-028-1` (N2, 1SA) ; `SEF-V4-029-1` (N2, 2♥). Réservoir N2–N3 hors 36 : 47.
- `apres_inter` (introduction V1 séance index 14) : `SEF-V3-074-2` (N2, 2♥) ; `SEF-V3-075-3` (N2, 2SA) ; `SEF-V3-076-2` (N2, 2♥) ; `SEF-V3-077-2` (N2, 2♥). Réservoir N2–N3 hors 36 : 83.
- `barrage` (introduction V1 séance index 17) : `SEF-V3-091-1` (N2, 2♥) ; `SEF-V3-092-3` (N2, 1♥) ; `SEF-V3-095-1` (N2, 2♠) ; `SEF-V3-096-1` (N2, 1♠). Réservoir N2–N3 hors 36 : 43.
- `reveil` (introduction V1 séance index 19) : `SEF-V4-048-1` (N2, 1♥) ; `SEF-V4-049-1` (N2, 1♥) ; `SEF-V4-050-1` (N2, 1♠) ; `SEF-V4-051-3` (N2, 1♠). Réservoir N2–N3 hors 36 : 27.

### 3. Joueur à l'aise — conventions et enchères complexes
- `roudi` (introduction V1 séance index 22) : `SEF-C2-012` (N3, 2♣) ; `SEF-L10-030` (N3, 2♣) ; `SEF-V4-076-3` (N3, 2♦) ; `SEF-V4-078-1` (N3, 2♠). Réservoir N3–N5 hors 36 : 21.
- `drury` (introduction V1 séance index 24) : `SEF-C2-011` (N3, 2♣) ; `SEF-L01-F-01` (N3, 2♥) ; `SEF-L01-F-02` (N3, 4♥) ; `SEF-L01-F-05` (N3, 2♥). Réservoir N3–N5 hors 36 : 30.
- `fortes` (introduction V1 séance index 26) : `SEF-V45-001` (N3, 2♣) ; `SEF-V45-002` (N3, 2♦) ; `SEF-V45-007` (N3, 2SA) ; `SEF-V45-009` (N3, 2♥). Réservoir N3–N5 hors 36 : 39.
- `forcing` (introduction V1 séance index 28) : `SEF-L17-001` (N3, 2♠) ; `SEF-L17-004` (N3, 2♥) ; `SEF-V480-001` (N3, 2♠) ; `SEF-V480-003` (N3, 2SA). Réservoir N3–N5 hors 36 : 53.
- `multilandy` (introduction V1 séance index 32) : `SEF-C2-001` (N3, 2♦) ; `SEF-C2-002` (N3, 2♠) ; `SEF-C2-003` (N3, Passe) ; `SEF-L14-001` (N3, 3♣). Réservoir N3–N5 hors 36 : 26.
- `rubensohl` (introduction V1 séance index 34) : `SEF-C2-004` (N3, 2SA) ; `SEF-C2-006` (N3, 3♣) ; `SEF-L01-C-02` (N3, 2SA) ; `SEF-L01-C-03` (N3, 3♦). Réservoir N3–N5 hors 36 : 40.
- `michaels` (introduction V1 séance index 36) : `SEF-C2-008` (N3, 1♠) ; `SEF-V45-041` (N3, 2♦) ; `SEF-V45-042` (N3, 2♦) ; `SEF-V45-047` (N3, 2SA). Réservoir N3–N5 hors 36 : 31.
- `chelem` (introduction V1 séance index 39) : `SEF-L01-A-01` (N3, 4SA) ; `SEF-L01-A-03` (N3, 4SA) ; `SEF-L01-A-05` (N3, 4SA) ; `SEF-L32-004` (N3, 6SA). Réservoir N3–N5 hors 36 : 65.

## Contrat de déploiement éventuel
- Cette sélection n'est **pas** une nouvelle règle de tirage ; elle peut servir de banque de séances guidées seulement après examen de chaque transition, de la correction et de l'accord SEF.
- Ne pas confondre l'indice de séance d'introduction avec un prérequis pédagogique formel. Respecter les conventions locales et l'exclusion des cas non validés.
- Toute intégration future dans `quizz-parcours.js` ou `quizz.html` doit être portée par le coordinateur après confrontation aux missions #256 et #257.

**PROCHAINE PASSE : P4** — stress-test des parcours, variété, trous et scénarios d'apprentissage, sans inférer de maîtrise.
