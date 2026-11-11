# QPJB Entraînement — BH-086 : reconnaître la distribution puis choisir l'ouverture

**Date :** 11 novembre 2026 · **Périmètre :** six exercices existants `EN-BH-086-01` à `-06`. Aucun ajout de QCM.

## Documents originaux

- Sujet : *Votre Bridge Hebdo débutant* n°86 du 20 octobre 2023, page 1, `86 Exercice Votre Bridge Hebdo débutant 20-10-2023.pdf`, SHA-256 `139116524330c64dd266ca347ce438429b0260992a99266302510ebe339fed6c`.
- Corrigé : même fascicule, page 1, `86 Solution Votre Bridge Hebdo débutant 20-10-2023.pdf`, SHA-256 `2265cbbf4fc271fea1c25225124cf223a11d08d676e113bde64560d44648b057`.
- Source : Bibliothèque `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip` ; les deux pages 1 ont été rendues et inspectées visuellement, et les SHA ci-dessus recalculés sur leurs octets.
- Consigne source : identifier **régulière / unicolore / bicolore / tricolore**, **puis** choisir l'ouverture. La version antérieure ne notait que l'ouverture et conservait la classification dans l'explication finale.

| ID | Type dans le corrigé | Distribution ♠/♥/♦/♣ | Ouverture conservée |
|---|---|---|---|
| `EN-BH-086-01` | Régulière | 2–3–3–5 | 2SA |
| `EN-BH-086-02` | Unicolore | 6–1–3–3 | 1♠ |
| `EN-BH-086-03` | Bicolore | 5–5–2–1 | 1♠ |
| `EN-BH-086-04` | Bicolore | 2–6–4–1 | 1♥ |
| `EN-BH-086-05` | Régulière | 4–3–3–3 | 1♣ |
| `EN-BH-086-06` | Tricolore | 1–4–4–4 | 1♦ |

## Correctif

- Ajouter `distributionClassification` sur **six** fiches existantes. Aucune main, enchère, option, clé, explication, provenance, ID ou statut de relecture n'est modifié.
- L'élève répond d'abord à la classification parmi quatre boutons ; les quatre choix de l'ouverture n'apparaissent qu'ensuite. Une tentative n'est réussie que si les deux choix sont corrects.
- L'application conserve l'état de classification pendant la navigation et mémorise `distributionPick` dans le même enregistrement de progression par ID. Une correction après le premier essai ne modifie pas son verdict historique.
- Les cinq BH-085 déjà traités conservent leur mode `forcing/non forcing` ; aucune généralisation aux autres enchères.
- Total catalogue : 638 enchères et 188 jeux de la carte, inchangé.

## Tests attendus

- Test `split_training_data --check`, intégrité de données, clés et décompte.
- Test navigateur sur les six cas : quatre classifications, séquence à deux étapes, les quatre enchères d'origine, verdict en fin de seconde étape, sauvegarde de l'ID et du premier essai.
- Tests Chromium, WebKit, hors ligne et régression BH-085 sur le SHA de la PR.
- Cette relecture documentaire des six classifications n'est pas une contre-expertise aveugle indépendante de toutes les alternatives de système.
