# Mission G — complément impératif : état documenté (NON CLÔTURÉ)

**13 novembre 2026 — Entraînement QPJB uniquement.** Branche d'audit documentaire, sans exercice ajouté, supprimé ni publié. **Quiz SEF entièrement exclu.**

## Portée du contrôle réellement réalisé

Références lues, dans leurs branches :
- A : 859 sources Bridge Hebdo, `audits/cloture-entrainement/A/inventaire_exercices.csv`.
- C : 826 fiches Entraînement, `audits/cloture-entrainement/C/catalogue-entrainement-main.csv`.
- E : les 189 `MANQUANT`, `audits/cloture-entrainement/E/exercices_manquants.csv`.
- F : les **3 arbitrages déjà conclus**, non repris (`F/rapport_arbitrage_redondances.md`) ; 2 sources distinctes `BH-001-S01-01` (enchères) et `BH-001-C02-01` (flanc) restent candidates, sans publication.
- D : le rapport de clôture des anomalies historiques, consulté **sans relancer** les audits.

Le CSV joint comporte **une ligne pour chacun des 189 absents**, avec identifiant, nom exact du PDF, présence déclarée du corrigé, rapprochements de cartes, statut et justification. Cette liste est **exhaustive par rapport aux 189 identifiants E, mais ses verdicts ne sont PAS tous définitifs**.

## Comparaison transversale A ↔ C : ce qui a été prouvé

- 189/189 identifiants de E retrouvés dans A ; 826/826 fiches C chargées.
- 156/189 fiches E offrent au moins une **empreinte de main complète (13 cartes, quatre couleurs)** reconstructible automatiquement à partir de A. 33 n'en offrent pas par cette méthode (elles ne sont pas nécessairement sans données dans le PDF).
- 679/826 fiches C possèdent au moins une main structurée exploitable ; **701 empreintes distinctes** de mains Nord/Sud ou individuelles ont été indexées. Les 147 autres fiches C n'ont pas été exclues comme doublons possibles : leur contenu peut être textuel ou non structuré.
- **Six correspondances de main exacte** entre les 189 et les 826 ont été trouvées et examinées au niveau des énoncés et enchères retranscrits. Deux sont des **décisions différentes**, quatre sont des **redondances potentielles**.
- Aucune égalité de main n'a été utilisée seule pour écarter un exercice ; une ressemblance de thème n'est jamais une preuve de redondance.

### Cas à retenir

| Source E manquante | Déjà dans QPJB | Verdict documentaire G | Justification / limite |
|---|---|---|---|
| `BH-004-2-S01-01` | `JC-BH-004-2-Q01` | **DISTINCT_DECISION** | Enchères originales contre plan du déclarant / laisser-passer à Carreau publié |
| `BH-005-S01-01` | `JC-BH-005-Q01` | **DISTINCT_DECISION** | Enchères originales contre plan du déclarant / reprises à Trèfle publié |
| `BH-064-S01-03` | `EN-BH-061-03` | **REDONDANCE_A_CONFIRMER** | Même main et 1♥ adverse, mais la vulnérabilité favorable est précisée dans BH-061 et absente de la transcription BH-064 ; elle est pertinente pour cette main faible |
| `BH-064-S01-04` | `EN-BH-061-04` | **REDONDANCE_TRES_FORTE** | Même main puissante, ouverture adverse de 1♣ et choix de Contre plutôt que 1♠ ; vulnérabilité non explicitée dans extrait BH-064 |
| `BH-082-S01-04` | `EN-BH-133-04` | **REDONDANCE_TRES_FORTE** | Même main, même séquence 1♣ — 1SA — ?, même redemande de 3SA |
| `BH-134-S01-06` | `EN-BH-092-06` | **REDONDANCE_TRES_FORTE** | Même main, même séquence 1SA — 2♣ — 2♥ — 4SA — ?, même refus quantitatif par Passe |

**Trois redondances très fortement étayées ne valent pas une décision de suppression.** La décision finale exige encore la comparaison des deux corrigés originaux, en particulier les variantes éventuelles et les précisions de contexte. Le quatrième cas demande explicitement la vérification de la vulnérabilité.

### Comparaison au sein des 189

Une même main a été retrouvée pour `BH-061-S02-01` et `BH-064-S02-01`, mais les questions ne portent pas sur le même instant : première planification sur entame de la Dame de Cœur, puis suite après deux tours de Cœur et retour à l'atout. **Ne pas déclarer ces deux exercices redondants sur la seule identité des cartes.**

## Total sur les 189 absents

| Classe de contrôle G | Nombre | Portée |
|---|---:|---|
| `REDONDANCE_TRES_FORTE` | **3** | Décision/enchères et cartes concordantes ; confirmation éditoriale finale encore à faire |
| `REDONDANCE_A_CONFIRMER` | **1** | Nuance de vulnérabilité à examiner |
| `DISTINCT_DECISION` | **2** | Même main mais compétence effectivement différente |
| `BLOQUE_CORRIGE_ABSENT` | **9** | BH-041 AVANCÉ : réponse et justesse invérifiables |
| `CONTROLE_NON_CONCLUANT` | **174** | Pas d'équivalence certifiée ni de justesse independently démontrée |
| **Total** | **189** | Tous les IDs E tracés |

**Attention : les 180 corrigés déclarés `OUI` par E ne sont pas 180 corrections relues ici.** A fournit l'extrait du sujet et une référence de corrigé, **pas nécessairement son contenu exploitable ou son verdict de justesse**. Ni le dépôt `main` (aucun PDF original dans l'arbre), ni les seuls inventaires A/C/E ne permettent d'attester individuellement les solutions des 180. La présence d'un PDF référencé est une piste documentaire, pas une validation de réponse.

Les **9 cas BH-041 AVANCÉ** `BH-041-AVANCE-S01-01` à `BH-041-AVANCE-S01-08`, et `BH-041-AVANCE-S02-01`, restent **bloqués** faute de corrigé. Aucune réponse supposée n'a été produite. Ils ne doivent pas être confondus avec BH-041 Débutant.

## Points historiques D conservés sans réaudit

La mission D avait isolé quatre références sans ID autonome, qui nécessitent une décision ciblée plutôt qu'une reprise générale : `JC-BH-037-M01` (maniement), `EN-BH-061-01` (discordance de cartes), `EN-BH-085-06` (autonomie de la 6e question) et `EN-BH-103-06` (contradiction entre sujet/corrigé). Ces constats restent des alertes de G ; aucun ancien dossier résolu n'a été rouvert.

## Conclusion — ne pas annoncer la liste définitive à ce stade

La mission complémentaire est **partiellement accomplie, pas clôturée** : les rapprochements prouvés sont utiles et montrent au moins **quatre cas que la seule mission E avait laissés passer**. Mais le rapprochement sémantique complet des 189 avec **toutes** les 826 compétences/décisions et la vérification du fond des 180 corrigés ne sont **pas démontrés**. Il serait incorrect de déclarer les 174 `CONTROLE_NON_CONCLUANT` intégrables, ou d'annoncer un nombre définitif d'exercices à importer.

**Liste définitive des intégrables : non établie. Redondances établies définitivement après contrôles de corrigés : non attestées. Bloqués documentaires certains : 9.**

**Verrou absolu : ne pas intégrer, créer ni publier d'exercice à partir de ce registre.** Aucun fichier `entrainement/`, aucun Quiz SEF et aucune source originale n'ont été modifiés. La branche G ne contient que des documents d'audit ; ne pas fusionner une éventuelle PR avant clôture réelle.
