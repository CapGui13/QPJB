# QPJB Entraînement — Lot P1 BH-103 (10 novembre 2026)

## Preuves documentaires
Vérification visuelle page 1 des PDF **Votre Bridge Hebdo débutant n°103 du 16 février 2024**.

- Sujet : SHA-256 `9eb947aca36b88a61846df0d8934209ff00f29bc7decc7cdd710f981393c3ed0`.
- Corrigé : SHA-256 `34e9db60d02c6bf823f5509060448f7b33b9d00f93e5770c2fc4d7658bb61148`.
- Archive originale : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.
- Le fascicule donne la **vulnérabilité pour chaque question** ; elle était absente des cinq énoncés du catalogue.

| Question | Vulnérabilité source | Bonne réponse conservée | Changement |
|---|---|---|---|
| EN-BH-103-01 | Personne vulnérable | Passe | Contexte explicite |
| EN-BH-103-02 | Tous vulnérables | 1♠ | Contexte explicite |
| EN-BH-103-03 | Est–Ouest vulnérables | 2SA | Contexte explicite |
| EN-BH-103-04 | Personne vulnérable | 4♠ | Contexte, explication et commentaires Passe/4SA/5♠ |
| EN-BH-103-05 | Est–Ouest vulnérables | 3♠ | Contexte et explication |

## Points pédagogiques particuliers
- **BH-103-04 :** après (1♥) – 1♠ – (4♥), l'intervention de Nord à 1♠ ne prouve **aucun singleton ou doubleton Cœur**. Le corrigé envisage 4♠ avec cinq atouts et un singleton Carreau chez Sud, mais **Passe peut rester défendable** suivant le potentiel des deux camps. Pas de promesse de réussite à 4♠.
- **BH-103-05 :** le « neuf atouts = neuf levées » du fascicule est une simplification incorrecte si prise au pied de la lettre. La loi des levées totales porte statistiquement sur **la somme des levées des deux camps** et non sur le contrat garanti d'un seul. La version QPJB conserve 3♠ comme barrage avec quatre atouts à vulnérabilité favorable, mais retire la garantie fictive de neuf levées et l'attribution hypothétique d'un fit à Cœur chez l'adversaire.
- La source publique FFB décrit explicitement cette loi comme **purement statistique**, sans garantie pour une donne isolée : `https://cdn.ffbridge.fr/cms/default/0001/08/e59ea4330e7ca327d0a950ee3adaa3528f173607.pdf`.
- Le fascicule contient une 6e question, `BH-103:EN-06` (cue-bid 2♣), **non publiée** dans le catalogue de 638 QCM. Elle n'est pas ajoutée ici ; sa différence de cartes sujet/corrigé demande un audit séparé. Ne pas la présenter comme une erreur d'un QCM existant.

## Invariants
- Les **5** ID de ce lot sont les seuls objets modifiés ; **633** autres enchères et **188** exercices de carte sont intacts.
- Aucune main, enchère de séquence, choix, réponse, ID, sourceRef, statut de relecture, progrès historisé n'est modifié.
- `training-data.js` et `training-data-bidding.js` synchronisés (638 + 188 = 826).
- Tests ciblés ajoutés à `tests/training-smoke.cjs`. La CI sur le commit exact est obligatoire.
- Relecture documentaire informée, **pas** une contre-expertise indépendante qui certifierait l'unicité universelle de 4♠/3♠.
