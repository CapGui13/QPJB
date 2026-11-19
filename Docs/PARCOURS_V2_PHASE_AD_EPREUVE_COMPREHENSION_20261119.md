# QPJB — Phase AD : épreuve de compréhension ouverte, hors Quiz SEF

**19 novembre 2026 · PR #214 · Prototype expérimental de discussion pédagogique, non déployé.**

## Décision de conception

Après les mini-leçons AB/AC, un apprenant peut avoir lu les définitions sans réellement savoir **expliquer** ce qu'elles signifient. Pour examiner ce point sans confondre mémorisation d'un QCM et compréhension, la phase AD crée **six questions ouvertes de reformulation**, **trois par convention**, sur une **feuille de discussion entièrement distincte du Quiz SEF**.

Ce support **n'est pas un nouveau lot de QCM**, n'ajoute **aucun exercice au catalogue de 1 523 questions**, et ne modifie pas le moteur V2-F. Il ne choisit pas de nouvelles mains, ne crée pas de cas d'enchères évalués et n'utilise pas de réponses fictives pour annoncer un taux de réussite. Il s'agit d'un **prototype d'entretien pédagogique** destiné à une enseignante, encore non validé auprès d'élèves.

## Déroulement proposé pour un essai humain

1. L'élève lit la mini-leçon AB/AC consacrée à la convention, en ayant les prérequis indiqués.
2. Il masque ou ferme la mini-leçon, puis répond **avec ses propres mots**, sans quatre choix ni indices calculés.
3. L'enseignante laisse d'abord la réponse se développer. **Ensuite seulement**, elle peut ouvrir les « repères de discussion » sous la question.
4. L'enseignante repère le **vocabulaire incompris**, les **confusions**, et les **points de formulation à améliorer dans la leçon**. Elle peut utiliser trois appréciations qualitatives sur sa propre feuille : *expliqué clairement*, *à reformuler*, *non abordé*. **Aucun score numérique ni niveau d'élève n'est calculé par l'application**.
5. Les observations sont des retours humains **à obtenir** ; elles ne figurent dans aucun résultat de simulation et ne sont pas persistées par le prototype.

## Rubensohl — trois questions de reformulation

| ID | Demande à l'élève | Ce qu'une explication complète devrait couvrir | Traçabilité |
|---|---|---|---|
| **AD-R01** | Pourquoi 3♣ peut-il avoir deux sens après 1SA ? | Après **2♣ Landy adverse**, le 3♣ du répondant est **Texas Carreau** dans l'accord étudié ; après **2♦ naturel adverse**, 3♣ est **Stayman forcing de manche** dans la seconde séquence. Le sens dépend du contexte et de l'accord | `SEF-V486-022`, `SEF-V481-009` |
| **AD-R02** | Que signifie l'intervention adverse à 2♣ Landy ? | Elle annonce **les deux majeures**, pas une longueur naturelle à Trèfle | `SEF-V486-022` |
| **AD-R03** | Que regarder avant de décoder une enchère artificielle ? | Qui a ouvert, **nature de l'intervention**, identité des joueurs, **accord convenu** | Les deux sources Rubensohl |

**Confusions à détecter :** croire que toute enchère de 3♣ montre des Trèfles, ou que 3♣ signifie toujours la même chose indépendamment de l'intervention adverse. **Attention :** les questions ne prétendent pas mesurer la maîtrise de toutes les défenses sur 1SA.

## Michaels précisés — trois questions de reformulation

| ID | Demande à l'élève | Ce qu'une explication complète devrait couvrir | Traçabilité |
|---|---|---|---|
| **AD-M01** | Que signifie **au moins 5–5** ? | **Cinq cartes minimum dans chacune** des deux couleurs promises, donc **au moins dix cartes cumulées** | `SEF-C2-007`, `SEF-V45-044` |
| **AD-M02** | Comparer les cue-bids 1♦–2♦ et 1♠–2♠. | Après 1♦, 2♦ décrit **Piques + Cœurs** ; après 1♠, 2♠ décrit **Cœurs + Trèfles**, chacune au moins cinquième | Les deux mêmes sources |
| **AD-M03** | Pourquoi le Michaels ne suffit-il pas, à lui seul, à surenchérir ensuite ? | Il faut distinguer **couleurs promises** et **fit effectivement garanti**, examiner les longueurs, le palier et la vulnérabilité | `SEF-L04-029` |

**Confusions à détecter :** croire que le cue-bid promet la couleur adverse, que « 5–5 » désigne seulement cinq cartes au total, ou qu'un Michaels oblige toujours le partenaire à surenchérir.

## Garde-fous et traçabilité

- **Source de la grille :** `scripts/parcours-v2-comprehension-ad.cjs`. Chaque question possède des **fragments textuels exacts de la mini-leçon AB/AC** : si les affirmations qui fondent les repères pédagogiques ne se trouvent plus dans la leçon, la validation doit échouer.
- **Source du cours :** `scripts/parcours-v2-lecons-ab.cjs`, qui ancre les accords dans **cinq QCM originaux** et contrôle leur identité. Les repères d'AD ne sont ni des corrections automatiques ni des preuves de maîtrise.
- **Document de consultation :** `scripts/parcours-v2-apercu-comprehension-ad.cjs` produit `atelier-comprehension.html`. Il permet de choisir **Rubensohl** ou **Michaels précisés**, de **rédiger librement** dans un champ par question, d'effacer ce brouillon, puis d'ouvrir les **repères de discussion**. Les réponses ne sont **ni envoyées, ni évaluées, ni conservées** : fermer la page efface les brouillons. Aucune donnée personnelle n'est requise.
- **Tests :** `tests/quizz-v2-comprehension-ad.cjs` vérifie **six questions**, **deux leçons**, **cinq sources**, les repères textuellement justifiés, l'absence de QCM complet dans l'HTML, l'absence de stockage ou de requêtes, et la syntaxe JavaScript.
- **CI dédiée :** `.github/workflows/qpjb-v2-ad-focused.yml`, production du rapport JSON et de l'HTML dans l'artefact `qpjb-v2-ad-comprehension-workshop`.

## Critères de relecture humaine avant tout déploiement

La personne enseignante devra vérifier : (1) le niveau de langage, (2) le temps nécessaire sans limitation artificielle, (3) la distinction entre **reformuler la leçon** et **appliquer une convention dans une nouvelle séquence**, (4) le risque que les repères attendus suggèrent des conclusions trop rigides, et (5) l'absence de données d'élèves collectées involontairement.

**Portée de l'AD :** évaluer la **reformulation des deux leçons**, pas la capacité générale à jouer le Rubensohl/Michaels, ni une amélioration de performance mesurée. **Aucune réponse réelle d'élève n'a été recueillie ou notée.**

## Vérification technique et démonstration livrée

**Contrôle dédié : [GitHub Actions #44504318372](https://github.com/CapGui13/QPJB/actions/runs/44504318372), réussite.** Le premier essai de CI avait échoué sur une **assertion de casse textuelle** (majuscule attendue sur un libellé réellement écrit en minuscules), sans erreur établie dans le contenu des questions. L'assertion a été corrigée, puis les contrôles complets ont réussi.

Résultats certifiés par les tests de la version AD :

| Mesure | Résultat |
|---|---:|
| Mini-leçons sources | **2** |
| QCM originaux dont proviennent les accords | **5** |
| Questions ouvertes de reformulation | **6** |
| Ancrages exacts dans les deux leçons | **14** |
| Repères de discussion destinés à l'enseignante | **16** |
| Réponses d'élèves recueillies ou évaluées | **0** |
| Questions ajoutées au Quiz SEF | **0** |
| Modifications de V2-F ou du site public | **0** |

Le fichier `atelier-comprehension.html` a été généré (**10 960 octets**) et vérifié : six zones libres, six volets de repères, aucun formulaire soumis, aucune requête ni stockage. L'artefact GitHub `qpjb-v2-ad-comprehension-workshop` contient également `phase-ad-rubric.json` et `phase-ad-summary.json`.

**Interprétation :** la grille est *techniquement vérifiée et prête à une relecture humaine* ; elle n'a **pas** démontré la compréhension d'élèves, ni mesuré une efficacité pédagogique. Les formulations de la leçon et les repères attendus doivent rester révisables sur retour réel d'enseignant.

**Statut final : `AD_CI_SUCCESS / SIX_QUESTIONS_OUVERTES / 14_ANCRES / 16_REPERES / ZERO_ELEVE_OBSERVE / ZERO_NOTE / AUCUN_DEPLOIEMENT`.**

