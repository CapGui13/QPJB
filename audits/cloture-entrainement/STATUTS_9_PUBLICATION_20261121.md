# Entraînement — disposition nominative des 9 drapeaux de publication (21 novembre 2026)

**Périmètre fermé :** les neuf fiches historiquement repérées dans [C, PR #150](https://github.com/CapGui13/QPJB/pull/150). Complément à [la clôture A–G déjà archivée sur `main`](CLOTURE_DEFINITIVE_20261121.md) ; n'ouvre ni audit général, ni mission d'intégration. Aucun changement de données ni de code.

## Constat contrôlé sur `main`

- Les fichiers `entrainement/training-data-bidding.js` et `entrainement/training-data-play.js` contiennent bien les **neuf IDs** listés ci-dessous : **six enchères**, **trois cartes**.
- Les neuf fiches portent **`reviewStatus: "a_relire"`** et **`sourceAudit.publication_autorisee: false`** ; le jeu de la carte porte en plus `playEditorialStatus: "plan_libre_pret_a_relire"`.
- Les neuf sont dans la collection historique chargée par l'application, et **non parmi les 139 originaux de H**. Le rapprochement [H, registre des 1 020](H/registre_tracabilite_1020.csv) les classe `PUBLIE_EXISTANT` et `PREEXISTANT_SUR_MAIN` ; leur origine est établie par source, numéro de cas et SHA-256 du PDF.
- D'après [C](https://github.com/CapGui13/QPJB/blob/82138bf4fcc30e84d10fccf554461466053cc598/audits/cloture-entrainement/C/rapport-anomalies.md), la sélection active exclut `reviewStatus=a_verifier`, **pas** `sourceAudit.publication_autorisee=false`. Les neuf ne sont donc pas automatiquement masquées : **leur visibilité ne prouve pas qu'un responsable éditorial a changé ce champ en `true`**.

### Décisions **par fiche** (état actuel et disposition documentaire)

| ID QPJB | Source originale | Réponse actuellement publiée / orientation | Réserve explicitement conservée | Disposition |
| --- | --- | --- | --- | --- |
| `EN-BH-134-03` | `BH-134-S01-03` | `3♣` après 1SA–2♣–2♦ : décrire cinq Trèfles et singleton Cœur | Métadonnées encore `false` / `a_relire` ; note de pilotage : conservation déjà favorablement arbitrée | **Conserver l'ID et la réponse ; pas de nouveau QCM** |
| `EN-BH-136-05` | `BH-136-S01-05` | `2♣` sur 1♦–(1♠), avec cinq beaux Trèfles et quatre Cœurs | Suite d'enchères conventionnelle à contextualiser ; note de pilotage : `2♣` puis Cœurs selon redemande | **Conserver l'ID et la réponse ; pas de nouveau QCM** |
| `EN-BH-139-06` | `BH-139-S01-06` | `4SA` quantitatif après 1♣–1♥–1SA | Invitation au chelem (pas Blackwood) documentée, mais `false` non levé | **Conserver l'ID et la réponse ; pas de nouveau QCM** |
| `EN-BH-140-01` | `BH-140-S01-01` | `2♥` à saut sur 1♦, barrage avec six Cœurs | Dépend de la vulnérabilité et du style de la paire, non spécifiés ; réponse déjà présentée comme pédagogique et non absolue | **Conserver avec cette réserve ; pas d'affirmation universelle** |
| `EN-BH-140-02` | `BH-140-S01-02` | `2♥` sans saut sur 1♠, intervention constructive | A distinguer explicitement du barrage `EN-BH-140-01` | **Conserver les deux situations distinctes** |
| `EN-BH-140-05` | `BH-140-S01-05` | `2♣` naturel sur 1♥, sept Trèfles et 12 H | Différencier intervention positive et barrage, sans déduire le traitement de la seule longueur | **Conserver l'ID et la nuance** |
| `JC-BH-136-01` | `BH-136-S02-01` | Cumul de chances : Dame de Carreau courte puis impasse Trèfle | `plan_libre_pret_a_relire` ; efficacité dépend de répartitions inconnues et non d'une certification double-mort | **Conserver comme plan conditionnel, non comme garantie** |
| `JC-BH-139-01` | `BH-139-S02-01` | À 6♥, essai d'impasse ♦ avant de jouer atout | Petit chelem conditionnel à la position de ♦R ; contrat non garanti dans toutes les distributions | **Conserver l'incertitude, sans certifier 12 levées** |
| `JC-BH-140-01` | `BH-140-S02-01` | À 4♠, exploiter l'entame ♥ et les reprises | ♥R en Est est une hypothèse, pas un fait démontré ; différents flancs sont possibles | **Conserver cette ligne comme tentative conditionnelle** |

## Décision transversale sur la contradiction

**Trois états doivent rester distincts :**

1. **Présence en catalogue : OUI**, constatée sur `main` et déjà incluse dans les 826 historiques de H.
2. **Validation pédagogique sans réserve : NON ÉTABLIE.** `reviewStatus=a_relire` demeure fidèle au traitement prudent des situations. Les six décisions d'enchères sont documentées par leurs notes de pilotage ; les trois plans de carte ont des hypothèses de distribution et de flanc explicites.
3. **Drapeau d'autorisation de publication : toujours `false`**, ce qui est contraire à la présence effective, mais n'autorise pas à conclure qu'il a été validé entre-temps. **Ce document ne change pas `false` en `true`**, ne retire ni ne republie aucune fiche.

**Résolution administrative :** les neuf contradictions sont classées et qualifiées **`PUBLICATION_EFFECTIVE_AVEC_RESERVE_EDITORIALE`** dans ce rapport seulement ; ce libellé est **documentaire et non un nouveau statut applicatif**. On ne prétend ni corriger le drapeau, ni conférer une validation pédagogique inconditionnelle. Il reste **9 métadonnées applicatives divergentes à régulariser si et seulement si une intervention sur les données est explicitement autorisée**, sous une mission distincte. Une telle intervention devra être ciblée, sans changer de mains, de réponses, de progression, ni de moteur.

## Preuves et limites

- [Inventaire C des 826 historiques et signalement nominatif des neuf](https://github.com/CapGui13/QPJB/blob/82138bf4fcc30e84d10fccf554461466053cc598/audits/cloture-entrainement/C/rapport-anomalies.md).
- [Registre H de traçabilité des 1 020 sources](H/registre_tracabilite_1020.csv) : les neuf IDs correspondent à neuf originaux distincts **déjà intégrés**, avec référence PDF et SHA-256.
- Les fichiers applicatifs `entrainement/training-data-bidding.js` et `entrainement/training-data-play.js` ont été lus en l'état sur `main` pour récupérer les neuf enregistrements, leurs réponses, notes de pilotage, statuts et réserves.
- Les PDF n'ont **pas** été réexpertisés à cette étape ; il ne s'agit pas d'une réouverture des 75 cas résolus de D, ni d'un nouvel audit de validité des 826 exercices.
- **Diff autorisé : documentation uniquement.** Quiz SEF, moteur V1, catalogue, sauvegardes, 139 originaux de H et interface inchangés.
