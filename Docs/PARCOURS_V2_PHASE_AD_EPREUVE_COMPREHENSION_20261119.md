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

**Statut initial : `AD_SIX_REFORMULATIONS_DOCUMENTAIRES / ZERO_QCM_AJOUTE / SANS_NOTE / VALIDATION_ENSEIGNANTE_REQUISE / AUCUN_DEPLOIEMENT`.**
