# QPJB V2 — Phase BD : décision d'intégration des huit compléments authentiques

**19 novembre 2026 — PR #214 Draft — aucune publication.**

## Ce que dit réellement la source

Cette revue confronte l'inventaire documentaire `Docs/PARCOURS_V2_PHASE_AV_ORIGINAUX_OUVERTURES_20261119.json`, la sélection AX et les **cinq QCM existants** dans `entrainement/training-data-bidding.js`. Le script AY préserve les **trois réponses libres BH-035** sans inventer de distracteurs. Les fichiers PDF originaux ne sont pas relus à nouveau lors de cette phase : la correspondance des sujets/corrigés et leurs SHA-256 provient de l'audit AV.

Le parcours d'élève demandé est **65 séances de 10 QCM SEF**. Il n'est donc pas pertinent d'assimiler les trois réponses libres BH-035 à des QCM existants.

## Classement ciblé (sans suppression des sources)

| Exercice | Origine | Réponse d'origine | Situation | Décision de pré-intégration |
| --- | --- | --- | --- | --- |
| `EN-BH-067-06` | QCM Entraînement | **1♣** | 19 H, 3–4–3–3, mineures 3–3 | `CANDIDAT_SOUS_RELECTURE` |
| `EN-BH-114-04` | QCM Entraînement | **1♣** | 19 H, 4–3–3–3, mineures 3–3 | `VARIANTE_REDONDANTE` |
| `EN-BH-114-05` | QCM Entraînement | **1♦** | 20 H, 5♦–5♣, singleton ♠ | `CANDIDAT_SOUS_RELECTURE` |
| `EN-BH-096-06` | QCM Entraînement | **1♦** | 20 H, 6♦–4♥, singleton ♠ | `CANDIDAT_SOUS_RELECTURE` |
| `EN-BH-114-06` | QCM Entraînement | **2SA** | 19 H, 21 HL source, 6♣–3♦–2♥–2♠ | `CONDITIONNEL_NON_AUTOMATIQUE` |
| `BH-035-S02-01` | Réponse libre Bridge Hebdo | **1♥** | 20 H, 5♥–4♣ | `ATELIER_LIBRE_SEPARE` |
| `BH-035-S02-02` | Réponse libre Bridge Hebdo | **2♣** | 19 H, belle couleur sixième ♠ | `ATELIER_LIBRE_SEPARE` |
| `BH-035-S02-03` | Réponse libre Bridge Hebdo | **1♥** | 17 H, 6♥–5♦ et chicane ♣ | `ATELIER_LIBRE_SEPARE` |
 
## Observations individualisées

- **`EN-BH-067-06`** : Notion d'ouverture 1♣ avec deux mineures troisièmes ; source QPJB, distracteurs signalés comme provisoires. Même objectif que l'autre main 19 H.
- **`EN-BH-114-04`** : Même décision et même compétence que EN-BH-067-06 ; seule la majeure quatrième change. Conserver éventuellement en rappel, pas comme nouvelle compétence.
- **`EN-BH-114-05`** : Ouverture 1♦ d'un bicolore mineur fort pour garder de l'espace. Les distracteurs demeurent éditorialement provisoires.
- **`EN-BH-096-06`** : Ouverture de la longue mineure avec bicolore fort ; autre compétence que 5–5 mineures. Distracteurs à relire.
- **`EN-BH-114-06`** : Assimilation d'une mineure sixième semi-régulière à 2SA : accord avancé à confirmer, pas un exemple générique d'ouverture 2SA 20–21 H. Reste réservé au mode 8 opt-in.
- **`BH-035-S02-01`** : Correction source 1♥ ; la question n'a pas de distracteurs d'origine. Ne pas lui fabriquer un QCM.
- **`BH-035-S02-02`** : Correction source 2♣ fort indéterminé : dépend de la force en levées et des accords. Pas de QCM artificiel ni de maîtrise déclarée.
- **`BH-035-S02-03`** : Correction source 1♥ ; main très distribuée, réponse libre à maintenir en atelier optionnel.

## Ce qui est décidé pour l'essai

1. **Le mode `core` reste le mode sélectionné par défaut** : il utilise le catalogue SEF de **1 523 QCM** et n'insère aucun de ces huit exercices. La sauvegarde AZ possède sa propre clé locale.
2. Les modes **7 ajouts** et **8 ajouts** sont clairement désignés comme **expérimentaux et opt-in**, sans effet sur la sauvegarde V1/V2-F. Le cas `EN-BH-114-06` n'est présent que dans le mode 8.
3. **Trois BH-035 restent à réponse libre** : s'ils sont utilisés, ils doivent être dans un atelier complémentaire facultatif, **pas** présentés comme une séance entièrement composée de QCM. Aucun distracteur inventé.
4. Les deux mains régulières à 19 H ont **une seule compétence pédagogique** (mineures 3–3), malgré deux QCM distincts. On conserve l'intégrité et les IDs mais on n'invente pas deux notions acquises.
5. **Aucune activation automatique** des compléments avant validation éditoriale et décision sur les exercices à réponse libre. Les `teacherApproval` des sources restent à `PENDING`. Les corrections sont celles du corpus, pas des assertions de conformité officielle SEF.

## Prochaine décision enseignante

Valider **la politique du parcours standard** (QCM SEF uniquement) et, séparément, décider si un atelier d'ouvertures libres est souhaité pour les élèves avancés. Le cas à 2SA avec 19 H et mineure sixième mérite une décision d'accord spécifique.

**Bilan BD : 5 QCM existants (dont 1 variante de compétence déjà représentée), 3 réponses libres non transformées, 1 cas 2SA réservé à l'option 8, 0 nouvelle question, 0 QCM d'origine modifié, 0 déploiement.**
