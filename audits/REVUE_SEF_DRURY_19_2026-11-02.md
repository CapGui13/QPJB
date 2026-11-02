# QPJB — audit individuel SEF 2024 des 19 exercices Drury

**Date : 2 novembre 2026.** Dépôt : `CapGui13/QPJB`, branche `main`. Référence : `quizz.html` (993 exercices distincts). Périmètre : **19/19 IDs de la rubrique `drury`**, y compris les deux fiches `SEF-V44-067` et `SEF-V44-068` dont les objets JSON commencent par `theme` plutôt que par `id`. Relecture de chaque main, H, distribution, enchères, quatre choix, corrigé, difficulté et contexte.

## Bilan et statut

- **19 fiches réelles, 19 IDs uniques, 19 lectures individuelles.** Le compteur ne comprend ni doublon de code ni nouvelle fiche supposée.
- **17 bonnes réponses défendables/conformes** (dont une fiche avec fuite de solution dans l'énoncé) et **2 réponses pédagogiquement non conformes au seuil SEF** : `SEF-V4-099-2` et `SEF-V4-105-2`.
- **Une fuite certaine de réponse** : `SEF-C2-011`. Deux fiches `2SA` justes mais à expliquer davantage face aux enchères de rencontre : `SEF-V44-067`, `SEF-V44-068`.
- Recalibrages **proposés seulement** : aucune difficulté, réponse, main, choix, ID, corrigé ou sauvegarde modifiés à ce stade. Les problèmes restent **ouverts**, pas « corrigés ».
- Ce lot ne remplace pas les audits antérieurs : `SEF-V4-101-2` et `SEF-V4-107-3` avaient déjà été modifiés pour leur ouverture tactique de troisième position. Leurs corrections ont été prises en compte.

## Matrice des 19 décisions

| Identifiant | Main, force utile | Réponse actuelle | Verdict | Justification et qualité du QCM | Difficulté actuelle → proposée |
|---|---|---|---|---|---|
| `SEF-V4-097-1` | 10 HLD, ♥×3 | 2♥ | Conforme | 10 HLD, pas de courte : 2♣ Drury interdit (<11 HLD); soutien simple. | 3 → 2–3 |
| `SEF-V4-098-1` | 9 H + quatrième ♥ = 11 HLD | 2♣ | Conforme | Quatre atouts, aucun singleton et 11 HLD : Drury fitté. | 3 → 3 |
| `SEF-V4-099-2` | 5 HLD, ♥×3 | 2♥ | **ERREUR SEF** | Le 2♥ direct après passe suppose 6–10 HLD et trois atouts ; avec 5 HLD, Passe est attendu et absent des choix. | 2 → 2 |
| `SEF-V4-099-1` | 7 HLD, ♥×3 | 2♥ | Conforme | Soutien direct correct à 7 HLD, en deçà du Drury. | 2 → 2 |
| `SEF-V4-100-2` | 6 H, ♥×2 | 1SA | Conforme | Pas de fit, ni couleur longue annonçable; 1SA après passe avec 6–11 H environ. | 2 → 2 |
| `SEF-V4-100-3` | 9 H, ♥×2 | 1SA | Conforme | 1SA misfitté; quatre ♦/♣ ne justifient pas un changement au palier de deux. | 2 → 2 |
| `SEF-V4-101-2` | 8 H, ♥×5 | 2♥ | Conforme | Ouverture tactique 3e position favorable, Drury adverse du partenaire : répétition majeure = ouverture faible. | 4 → 3 |
| `SEF-V4-102-1` | 13 H, 14 HL, ♥×5 | 2♦ | Conforme | Véritable ouverture; 2♦ est attente positive après Drury, sans conclusion automatique à la manche. | 4 → 3 |
| `SEF-V4-103-1` | 10 HLD, ♠×3 | 2♠ | Conforme | À 10 HLD, soutien direct et non Drury. | 3 → 2–3 |
| `SEF-V4-104-1` | 9 H + quatrième ♠ = 11 HLD | 2♣ | Conforme | Quatre atouts, jeu régulier et 11 HLD : Drury. | 3 → 3 |
| `SEF-V4-105-2` | 5 HLD, ♠×3 | 2♠ | **ERREUR SEF** | Le soutien simple réclame 6–10 HLD; Passe devrait figurer dans les choix et être la solution, sauf remaniement de la main. | 2 → 2 |
| `SEF-V4-105-1` | 7 HLD, ♠×3 | 2♠ | Conforme | Soutien direct normal avec trois atouts et 7 HLD. | 2 → 2 |
| `SEF-V4-106-1` | 7 H, ♠×2 | 1SA | Conforme | Pas de fit; 1SA misfitté non forcing après passe. | 2 → 2 |
| `SEF-V4-106-2` | 9 H, ♠×2 | 1SA | Conforme | Pas de fit; aucun sixième annonçable, 1SA adéquat. | 2 → 2 |
| `SEF-V4-107-3` | 8 H, ♠×5 | 2♠ | Conforme | Ouverture de troisième position faible autorisée à vulnérabilité favorable; répétition faible après Drury. | 4 → 3 |
| `SEF-V4-108-1` | 13 H, 14 HL, ♠×5 | 2♦ | Conforme | Ouverture normale avec espoir de manche : 2♦ attente. | 4 → 3 |
| `SEF-V44-067` | 10 H, ♥×4, singleton ♣ | 2SA | Conforme, nuance | Après passe, 2SA avec 4 atouts et singleton; ♦AV976 cinquième n'est pas assez solide pour imposer une rencontre à 3♦, mais expliciter le critère. | 5 → 4 |
| `SEF-V44-068` | 10 H, ♠×4, singleton ♣ | 2SA | Conforme, nuance | 2SA montre quatre atouts et singleton; ♦AV1083 peut évoquer 3♦ rencontre, mais cette couleur n'a pas deux gros honneurs. Écarter explicitement cette alternative. | 5 → 4 |
| `SEF-C2-011` | 10 H + doubleton ♣ = 11 HLD, ♥×3 | 2♣ | **ÉNONCÉ À CORRIGER** | La question donne dans le contexte la règle « pour dire 2♣ » et le calcul exact 11 HLD : la réponse est divulguée, malgré la bonne enchère conforme. | 4 → 3 après réécriture; 1–2 en l'état |

## Corrections à arbitrer avant publication

1. **`SEF-V4-099-2`** : main ♠852 ♥A95 ♦9732 ♣V85, **5 HLD**, réponse actuelle **2♥**. La règle de soutien simple après passe exige 6 à 10 HLD et trois atouts ; **Passe** n'est même pas proposé. Solution de fond : corriger la réponse en **Passe**, insérer `Passe` dans les quatre choix et réécrire le corrigé, **ou** augmenter la main à 6 H minimum si le but est d'enseigner le soutien. Préserver l'ID et appliquer la migration ciblée de progression appropriée à toute modification de fond.
2. **`SEF-V4-105-2`** : main ♠RD6 ♥854 ♦9432 ♣743, **5 HLD**, réponse actuelle **2♠**. Même défaut (seuil 6 HLD, absence de `Passe` parmi les distracteurs). Même alternative : réponse `Passe` ou main à 6 H minimum.
3. **`SEF-C2-011`** : la phrase de contexte nomme explicitement `2♣` et calcule `11 HLD`. Déplacer cette règle dans le corrigé ou dans l'aide conventionnelle consultable ; garder un énoncé neutre qui demande le choix à partir de la main et de la séquence. Conserver `2♣` comme bonne réponse. Difficulté 4 non justifiée en l'état.
4. **`SEF-V44-067` et `SEF-V44-068`** : `2SA` conforme pour quatre atouts et singleton après passe. Ajouter au corrigé pourquoi la cinquième à ♦ ne constitue pas clairement une *belle* couleur justifiant une rencontre à 3♦. Ne pas qualifier 3♦ d'erreur universelle sans tenir compte de la qualité de la couleur.
5. **Difficultés** : les quatre redemandes binaires après 2♣ Drury (`SEF-V4-101-2`, `-102-1`, `-107-3`, `-108-1`) sont plutôt de niveau 3 que 4 ; les deux reconnaissances de 2SA singleton paraissent de niveau 4 plutôt que 5. Décisions à valider individuellement.

## Distracteurs et diversité

- `2♣` vs soutien direct à 2M, et `2♦` vs répétition de la majeure après Drury, sont des distracteurs crédibles dans les fiches conformes.
- `1SA` est un choix plausible seulement pour une main réellement misfittée ; sur des soutiens avec trois/quatre atouts, il peut être très facile à éliminer. Ne pas substituer mécaniquement les 19 distracteurs.
- Les variantes de 5 et 7 H d'une même famille servent les limites de la zone, mais **les exemples à 5 H sont incorrects dans le modèle débutant actuel**. Préserver les contrastes 6/7/10/11 HLD après correction.
- Les explications d'origine « Avec trois atouts mais une main faible… » sont insuffisantes dans les cas à 5 H : elles omettent le seuil minimal.

## Sources de règle

- [Cours Drury mis à jour SEF 2024 : soutiens directs 6–10 HLD, Drury 11+ HLD, 2SA singleton et rencontre](https://www.bridge-chailley.fr/wp-content/uploads/2024/10/E2048-Drury-inferences-corr-2.pdf).
- [iBridge — 2♣ Drury fitté (au moins 11 HLD)](https://www.ibridge.fr/public/fichedetails/113).
- [iBridge — 2SA après ouverture en troisième position](https://www.ibridge.fr/public/fichedetails/700).
- [FFB, *L'As de Trèfle* n° 52, septembre 2024, p. 28–29 : évolutions du Drury](https://res.cloudinary.com/ffbridge/image/upload/v1725446344/production/cms/ADTN_52_BD_2_6a558ea8dd.pdf).

## Contrôles et suite

Analyse en **lecture seule du catalogue**, donc **aucune CI ou publication Pages nouvelle induite par une modification des exercices**. Si les deux anomalies SEF sont corrigées, tester les 993 mains, les propositions uniques, la bonne réponse et la migration ciblée de progression, puis attendre **smoke Chromium/WebKit et Pages réussis**. Mettre à jour la feuille de route unique `audits/SUIVI_UPGRADES_2026-11-02.md` et le registre nominatif `audits/REGISTRE_993_REVUES_2026-11-02.csv` ; ne pas rouvrir comme non lus les 19 ID après ce lot.
