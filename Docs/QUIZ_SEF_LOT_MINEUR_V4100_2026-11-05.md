# QPJB — Quiz SEF V4.100 : 12 clarifications après audit V4.87

Date : 2026-11-05. Périmètre : uniquement `quizz.html` dans `CapGui13/QPJB`.

## Objet

Douze signalements mineurs ont été comparés aux QCM présents sur la branche principale. La solution de chacun a été conservée. Les seuls changements de contenu sont l'énoncé et le corrigé, personnalisés selon la force, la longueur, le fit et la séquence.

| Domaine | Exercices | Objectif |
|---|---|---|
| Stayman après 1SA/2SA | SEF-V3-002-1, SEF-V3-004-1, SEF-V3-021-2 | Réponses révélant un fit 4–4 ou refusant la majeure ; zone de manche |
| Roudi à trois réponses | SEF-V4-073-1, SEF-V4-076-3, SEF-V4-078-1 | Recherche du fit 5–3 ; 2♦ sans fit ; 2♠ avec fit et maximum |
| Faiblesse après intervention | SEF-V3-087-2, SEF-V3-087-3, SEF-V3-088-1, SEF-V3-088-2 | Justifier Passe malgré une mineure ou une majeure courte |
| Contre Spoutnik | SEF-V410-027 | Rechercher une majeure quatrième après 1♦ – (2♣) |
| Surcontre après contre d'appel | SEF-V44-045 | 11 H, sans fit Cœur, contre adverse : surcontre positif |

## Sécurité et traçabilité

- **12 bonnes réponses, 12 mains, 48 choix et leurs difficultés strictement inchangés**.
- Le fichier `tests/quizz-v4100-approved-revisions.json` conserve pour chaque QCM l'objet intégral `before` et `after`, avec les textes historiques.
- `tests/quizz-v4100-regression.cjs` contrôle ces douze modifications, les nombres de cartes, les points H et restaure les données historiques via `normalizedPrefix`.
- La CI appelle ce test après V4.99 ; **1 223 QCM et 22 rubriques** conservés.
- Aucun fichier sous `/entrainement/` ne doit être modifié.

## Étapes suivantes

Poursuivre les signalements `OUVERT_MINEUR` non traités, notamment distracteurs, redondances et niveaux de difficulté. Ne pas convertir automatiquement les cas `OUVERT_ARBITRAGE` ou `OUVERT_SOURCE` en corrections.
