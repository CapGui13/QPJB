# QPJB V2 — corrections éditoriales proposées sur quatre QCM

**20 novembre 2026 · PR #215 (préparation uniquement) · `editorialApproval=PENDING` · `releaseDecision=HOLD`**

Ce document contient des **propositions prêtes à relire**, construites à partir des quatre exercices *exacts* du `quizz.html` de `main` (`a0ffaed6`), en cohérence avec la revue éditoriale de la PR #214. **Il ne modifie ni les QCM source, ni leurs IDs, ni les sauvegardes, ni le site public.** Les accords doivent être validés avant application.

## 1. SEF-V416-008 — Réponse après Stayman, quatre Cœurs

**Main originale (10 H)** : ♠95, ♥AV83, ♦R104, ♣D962.

**Séquence source** : Partenaire 1SA ; Vous 2♣ ; Partenaire 2SA (deux majeures quatrièmes).

| Élément | Version actuellement publiée | Proposition à valider |
| --- | --- | --- |
| Question | « Votre partenaire a ouvert 1SA (15–17 H), vous avez demandé 2♣ Stayman et il a répondu SA. Quelle est votre deuxième enchère dans le SEF à quatre réponses ? » | « Après 1SA–2♣–2SA (les deux majeures quatrièmes), avec ♥AV83 et 10 H, vous souhaitez jouer **4♥ en faisant déclarer l'ouvreur de 1SA**. Quelle enchère de **double transfert** utilisez-vous ? » |
| Choix | `3SA / 4♥ / 4SA / 3♥` | `3SA / 4♥ / 4♣ / 3♥` |
| Réponse | **4♥** | **4♣** |
| Justification | Conclusion directe à 4♥ | « Avec quatre Cœurs, vous avez un fit 4–4 et de quoi jouer la manche. **4♣ transfère l'ouvreur à 4♥** ; c'est lui qui devient déclarant. L'annonce directe de 4♥ par le répondant ne répond pas à l'objectif de faire jouer l'ouvreur. » |

**Réserve :** le QCM actuellement publié n'est pas « faux » dans ses choix simplifiés. La proposition change l'**objectif pédagogique** de la question et ajoute explicitement le transfert ; elle ne doit donc **pas** être appliquée comme une simple substitution silencieuse de réponse.

## 2. SEF-V416-009 — Réponse après Stayman, quatre Piques

**Main originale (10 H)** : ♠AD83, ♥94, ♦V72, ♣R962.

**Séquence source** : Partenaire 1SA ; Vous 2♣ ; Partenaire 2SA (deux majeures quatrièmes).

| Élément | Version actuellement publiée | Proposition à valider |
| --- | --- | --- |
| Question | Même consigne générale « deuxième enchère dans le SEF à quatre réponses » | « Après 1SA–2♣–2SA (les deux majeures quatrièmes), avec ♠AD83 et 10 H, vous souhaitez jouer **4♠ en faisant déclarer l'ouvreur de 1SA**. Quelle enchère de **double transfert** utilisez-vous ? » |
| Choix | `3SA / 4♥ / 4♠ / 3♠` | `3SA / 4♦ / 4♠ / 3♠` |
| Réponse | **4♠** | **4♦** |
| Justification | Conclusion directe à 4♠ | « Avec quatre Piques, vous avez un fit 4–4 et les valeurs pour la manche. **4♦ transfère l'ouvreur à 4♠** ; c'est lui qui devient déclarant. L'annonce directe de 4♠ par le répondant ne remplit pas cet objectif. » |

**Cohérence interne :** `SEF-L18-007` enseigne déjà `4♣→4♥` après la même réponse `2SA` au Stayman. Les deux propositions V416 l'harmonisent avec ce traitement, sous réserve de confirmer que le double transfert est bien l'accord à enseigner dans QPJB.

## 3. SEF-L25-007 — Texas Trèfle modulé, 16 H et ♣R103

**Main originale (16 H)** : ♠AD82, ♥A94, ♦R76, ♣R103.

**Séquence source** : Vous 1SA (15–17 H) ; adversaire Passe ; partenaire 2♠ (Texas Trèfle) ; adversaire Passe.

**Question publiée :** elle mentionne déjà explicitement le **Roi de Trèfle troisième** et demande quelle rectification modulée indique ce soutien. **Elle peut être conservée telle quelle.**

| Élément | Version actuellement publiée | Proposition à valider |
| --- | --- | --- |
| Choix | `2SA / 3♣ / 3♦ / 3SA` | **Inchangés** |
| Réponse | **2SA** | **2SA, inchangée** |
| Explication | « une modulation prévue au SEF permet à l'ouvreur **maximum** avec un gros honneur troisième [...] de dire 2SA » | « Dans l'accord de modulation retenu pour le Texas Trèfle, **2SA indique une acceptation positive avec un gros honneur troisième à Trèfle**, comme ♣R103. Ici, avec 16 H, c'est la présence de ce gros honneur troisième qui justifie la modulation ; il ne faut pas déduire qu'un seuil automatique de 17 H est nécessaire. En l'absence des conditions de modulation prévues par l'accord, l'ouvreur rectifie à 3♣. » |
| Difficulté | « gros honneur troisième et main maximum » | « Texas Trèfle : distinguer rectification à 3♣ et modulation positive à 2SA avec gros honneur troisième, selon l'accord retenu. » |

**Réserve :** vérifier l'accord de Texas mineur de QPJB avant de figer cette formulation. Sources déjà exploitées dans la revue BE : <https://bridgesaintcloud.fr/quesaquo49.html> et <https://bridgesarzeau.club.ffbridge.fr/actualites-du-club/texas-mineur-sur-1sa-1123738>.

## 4. SEF-L06-029 — Classement du 3SA gambling

**Main originale (10 H)** : ♠85, ♥63, ♦ARDV1098, ♣42.

**Séquence source** : Vous 3SA gambling ; adversaire Passe ; partenaire 4♣ (passe ou corrige) ; adversaire Passe.

La réponse **4♦** et sa justification source **ne sont pas à changer** : l'ouvreur rectifie la mineure longue maîtresse (Carreau).

| Champ | Actuel | Proposition de classement (sans modifier le catalogue) |
| --- | --- | --- |
| `theme` du QCM source | `sa` | **Conserver `sa` dans les données d'origine** |
| Rubrique pédagogique de V2 | Associé au groupe SA par son thème source | **Ouvertures conventionnelles / barrages : 3SA gambling**, puis 4♣ passe/corrige |
| Réponse et choix | `4♦` ; `Passe / 4♦ / 4♥ / 4SA` | **Inchangés** |

La rubrique de V2 peut être définie dans une **table de classification pédagogique propre au parcours**, sans réécriture du QCM d'origine et sans déplacer artificiellement la progression d'élèves déjà enregistrée. Faire valider la destination et son impact sur le séquencement avant tout changement du moteur.

## Conditions d'application après décision

1. Faire confirmer les **deux transferts**, l'**accord Texas Trèfle 2SA** et la **rubrique gambling** par la personne responsable de l'édition QPJB.
2. Créer ensuite une **PR éditoriale distincte**, limitée aux champs approuvés, avec conservation des IDs et contrôle des conséquences sur les sauvegardes/progressions.
3. Comparer les QCM modifiés au corpus de référence en distinguant explicitement les changements autorisés, puis reconstruire le fichier autonome des 65 séances. L'actuelle identité stricte des **1 523 QCM** n'est valable que tant qu'aucune correction source n'a été approuvée.
4. Rejouer seulement les tests ciblés nécessaires. Ne **jamais** mettre `APPROVED`, `teacherApproval=true` ou `releaseDecision=GO` automatiquement.

**État actuel : zéro correction appliquée, zéro QCM original remplacé, zéro autorisation éditoriale présumée, aucune publication.**
