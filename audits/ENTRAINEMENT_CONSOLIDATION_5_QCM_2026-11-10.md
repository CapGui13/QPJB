# Entraînement QPJB — consolidation des cinq reprises P0/P1 (10 novembre 2026)

## Traçabilité
- **Branche de consolidation :** `audit/entrainement-p1-bh055-bh061-20261110` (PR #121).
- **PR incorporées :** #119 (EN-1sa-011, EN-BH-115-06), #120 (EN-BH-049-04), #121 (EN-BH-055-06, EN-BH-061-05).
- **Base :** catalogue publié de 638 enchères + 188 jeux de la carte, soit 826 IDs.
- **Résultat :** 5 IDs modifiés uniquement par des champs éditoriaux (question, sourceContext, justification, commentaires des distracteurs, indices, marqueurs de révision). **Tous les 821 autres exercices restent identiques au catalogue d'origine**.
- **Champs protégés par les audits :** id, main (13 cartes), séquence, proposition(s), réponse correcte, sourceRef et statuts de relecture : inchangés pour les 5 QCM.
- **Source de vérité :** `entrainement/training-data.js`. Son tableau `bidding` est identique objet pour objet à `entrainement/training-data-bidding.js`.
- Tests de non-régression réunis dans `tests/training-smoke.cjs`; les trois nouveaux blocs couvrent les cinq fiches.

## Relecture éditoriale informée, exercice par exercice
| ID | Décision pédagogique et limites | Réponse inchangée |
|---|---|---|
| `EN-1sa-011` | Après Stayman négatif, le QCM **annonce préalablement le chassé-croisé**. Le 3♠ naturel du fascicule reste une possibilité dans des accords différents, explicitement reconnue et non traitée comme faute universelle. | 3♥ |
| `EN-BH-115-06` | Annonce préalable du chassé-croisé ; 4♠ avec fit 5–3 dans ces accords. Le 4♥ naturel du fascicule « sans convention particulière » reste une variante de système. | 4♠ |
| `EN-BH-049-04` | Troisième position **non vulnérable**, 6 H et sept ♦. Le barrage à 3♦ est privilégié par le corrigé ; Passe n'est pas intrinsèquement illégal. Les trois distracteurs portent bien sur 1♦, Passe et 2♦. | 3♦ |
| `EN-BH-055-06` | L'exercice ne choisit plus entre sacrifier et passer : il demande **dans quelle couleur sacrifier si la décision a été prise**. L'affirmation « 11 atouts = 11 levées » ne doit pas être enseignée. | 5♦ |
| `EN-BH-061-05` | Sujet original : Est 1♣ ; corrigé : Est 1♥. Conserver 1♣ du sujet et 1♠ comme intervention privilégiée, tout en exposant le caractère défendable de 1SA selon les accords. | 1♠ |

**Qualification de cet audit :** relecture contradictoire *des arguments* à partir des sources déjà recueillies, non contre-expertise aveugle indépendante de nouvelles instances. Les situations délicates d'unicité sont résolues par **cadrage de la question**, et non par déclaration artificielle qu'une enchère licite serait toujours fausse. Les statuts pédagogiques historiques restent conservés et aucune « certification exhaustive » des 826 exercices n'est revendiquée.

## Contenu conservé
- Rapports sources, sujets et corrigés déjà confrontés :
  - `audits/ENTRAINEMENT_P0_CHASSE_CROISE_2026-11-09.md`
  - `audits/ENTRAINEMENT_P1_BH049_2026-11-10.md`
  - `audits/ENTRAINEMENT_P1_BH055_BH061_2026-11-10.md`
- Pas de changement Quiz SEF, pas de nouveau QCM, pas de nouvelles cartes ni de séquences reconstituées.
- Les PR #119 et #120 doivent être **fermées comme supplantées seulement après réussite de la CI de consolidation**, pas fusionnées séparément. Une fusion de leur branche ensuite écraserait des modifications du fichier maître.

## Dernier verrou de publication
- Revalider CI sur le dernier commit (audit + Chromium + WebKit).
- Une fois réussie, conserver **uniquement PR #121** comme PR finale, notifier les PR #119 et #120 qu'elles sont supplantées, puis les fermer sans fusion.
- Demander accord explicite pour fusionner #121 ; éviter toute fusion automatique si cette décision n'a pas été donnée.
