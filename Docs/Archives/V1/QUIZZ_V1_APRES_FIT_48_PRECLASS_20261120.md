# QPJB V1 — Préclassification de 48 QCM « Après un fit majeur »
**20 novembre 2026 — chantier #226.** Cet audit est **non actif** : ni réponse ni sauvegarde ni algorithme publiés ne sont modifiés.

## Sources et objectifs
- Source exacte des 48 exercices : `audits/QPJB_V1_COMPETENCES_541_BACKLOG_20261120.json` (base V1 de 1 523 QCM déjà contrôlée).
- Résultat : `audits/QPJB_V1_APRES_FIT_48_PRECLASSIFICATION_20261120.json` — 48 enregistrements contenant main, enchères, choix, réponse V1, explication et catégorie proposée, tous vérifiés par `scripts/verify-v1-apres-fit-48.cjs`.
- Répartition : **12 groupes candidats**, **48 exercices / 48 familles source distinctes**. Aucune inférence de maîtrise ; **0 catégorie homologuée** au terme de cette extraction.

## Taxonomie provisoire : ne pas confondre deux enchères de 2SA

| Notion candidate | Cas | Contexte |
| --- | ---: | --- |
| Ouvreur minimum : Passe après 1M–2M | 4 | Ne pas inventer un essai |
| Ouvreur non minimum : 2SA essai généralisé après 1M–2M | 4 | Enchère d’essai, **pas un soutien** |
| Ouvreur : 3M compétitif avec six atouts | 4 | Distinguer barrage/protection et invitation |
| Ouvreur : manche directe à 4M | 7 | Force et distribution |
| Répondant : refus de 2SA essai | 4 | Revenir à 3M |
| Répondant : acceptation de 2SA essai | 4 | Conclure à 4M |
| Ouvreur : essai à la couleur | 6 | Couleur secondaire et force utile |
| Répondant : refus d’essai à la couleur | 4 | Faible / valeurs inutiles |
| Répondant : acceptation d’essai à la couleur | 3 | Valeurs utiles |
| **2SA fitté directement en réponse à 1M** | 4 | 3 atouts et tranche HLD, autre séquence |
| **2SA fitté après intervention adverse** | 3 | Zone HLD et enchères après intervention |
| Cue-bid sur Michaël avec fit majeur | 1 | Convention compétitive spécifique |
| **Total** | **48** | Pas d’activation des étiquettes |

**Différence essentielle :** `1♥–2♥–2SA` = essai de manche **de l’ouvreur** ; `1♥–2SA` = soutien fitté **du répondant**, lorsque cette convention s’applique. Ne pas fusionner les deux dans une même compétence, un même seuil de force ou une règle de répétition.

## Réserves découvertes à l'examen de la source

### Sept soutiens simples à 5 H, sans courte
`SEF-V4-009-1`, `SEF-V4-011-1`, `SEF-V4-021-1`, `SEF-V4-023-3`, `SEF-V416-006`, `SEF-V418-006`, `SEF-V421-012`.

Dans chaque question, le joueur a déjà soutenu à 2M avec **3 atouts, 5 H et une distribution sans singleton ni doubleton**. Le cours du Quiz donne normalement le soutien simple autour de **6–10 HLD**. Il faut **contre-expertiser la légitimité de l'enchère initiale à 2M** avant de déclarer correcte toute la situation pédagogique ; les réponses ultérieures (refus de l'essai) ne sont **pas modifiées** par cet audit. Ce sont des cas à expertiser, non des fautes automatiquement démontrées.

### Huit énoncés génériques
`SEF-V4-009-1`, `011-1`, `010-1`, `012-1`, `021-1`, `022-3`, `023-3`, `024-2` emploient une consigne courte sur l’essai 2SA. Une reformulation explicitant l'ouvreur, le répondant et le caractère invitant améliorerait la pédagogie, sans retoucher les bonnes réponses.

### Un cas d'intervention à isoler
`SEF-L09-029` est un cue-bid contre Michaël et comporte un fit majeur forcing de manche. Une éventuelle classification multiple « enchères compétitives / fit » ne doit pas être attribuée sans validation de la convention, ni écraser la rubrique d’origine.

## Plan de vérification
1. Revoir selon le SEF les **7 enchères de soutien simple à 5 H** ; vérifier l'accord de fit et le calcul HLD, puis examiner la conséquence sur la décision suivante.
2. Revoir les réponses aux essais, notamment les cas jumelés 5 H vs 9 H, en examinant la qualité des honneurs utiles et la présence de courtes.
3. Vérifier les couleurs d'essai `3♣/3♦/3♥`, dont l'emploi et le retour dépendent de la séquence exacte. Ne pas transformer les 12 groupes en prérequis bloquants.
4. Confronter les développements de 2SA fitté aux versions avec et sans intervention ; ne pas imposer une définition uniforme de zone HLD là où elle diffère.
5. Si une correction est justifiée, préparer une **PR éditoriale distincte** portant l'énoncé complet, les choix et la justification, avec accord préalable. **Ne pas corriger mécaniquement la réponse originale**.
6. Après validation, comparer par simulation la V1 avant/après classification. Conserver `qpjb-sef-parcours-01`, le Quiz SEF libre et ses 1 523 corrigés.

## Périmètre préservé
Cette livraison se limite au registre de métadonnées de travail, aux tests et à la documentation. `quizz.html`, `quizz-parcours.js`, `index.html`, les sauvegardes V1/V2 et l'entraînement restent strictement inchangés.
