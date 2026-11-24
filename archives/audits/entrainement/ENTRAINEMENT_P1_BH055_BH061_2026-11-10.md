# QPJB Entraînement — audit et reprise P1 : BH-055 / BH-061 (10 novembre 2026)

## Méthode
Relecture visuelle et textuelle des PDF **sujets et corrigés originaux**, page 1, puis comparaison avec la version publique des deux fiches. Relecture informée, non aveugle. Les PDF demeurent inchangés et les fichiers de l'Entraînement sont seuls concernés ; Quiz SEF hors périmètre.

## EN-BH-055-06 — quel sacrifice après 4♥ ?
- **PDF sujet BH-055, question 6 :** E/O vulnérables, N/S non vulnérables ; Ouest 1♥, Nord 2♦, Est 4♥, Sud possède ♠7 ♥862 ♦V10632 ♣A1095 (5 H).
- **PDF corrigé :** choisit **5♦**, mais dit « 11 atouts = 11 levées », affirmation non justifiée et contraire au sens de la Loi des levées totales. Une intervention naturelle à 2♦ n'assure pas six atouts à Nord : avec cinq Carreaux en Sud et au moins cinq en Nord, le fit peut n'être que de dix.
- **Décision :** conserver 5♦ comme **couleur de sacrifice conditionnellement envisagé**, pas comme ordre de sacrifier ni comme certitude de rentabilité. La question elle-même porte désormais sur le *choix de la couleur si l'on surenchérit*. **Passe n'est ni testé ni réputé faux** ; la décision entre Passe et le sacrifice nécessite une étude distincte (coût selon les levées de chute, contrat adverse gagnant ou non, distribution inconnue).
- Trois distracteurs 5♣, 5♥ et 5♠ expliqués, sans inventer les mains adverses ni les cartes de Nord.

## EN-BH-061-05 — contradiction sujet/corrigé, 1SA discutable
- **PDF sujet BH-061, question 5 :** Est ouvre **1♣**, N/S vulnérables ; Sud possède ♠RD1097 ♥A8 ♦R102 ♣RV4 (16 H, 17 HL).
- **PDF corrigé, question 5 :** la séquence imprime au contraire Est **1♥** ; l'auteur recommande 1♠ et envisage 1SA, mais la remarque sur le seul arrêt de la couleur adverse est construite sur cette séquence différente.
- **Décision :** conserver **1♣** du sujet comme séquence publiée, **1♠** comme réponse naturelle privilégiée, et ajouter une note explicite de divergence documentaire. Sur une ouverture de 1♣ avec ♣RV4, 1SA peut être discuté selon les accords d'intervention avec majeure cinquième ; ne pas le condamner dogmatiquement. L'exercice est cadré comme choix préféré dans les accords annoncés.

## Contrôles de pré-publication
- 2 IDs modifiés, aucun ajout/suppression, **638 enchères + 188 cartes**.
- Champs identifiants, mains, séquences, réponses, propositions et statuts de relecture conservés.
- Fichier maître `training-data.js` et module différé `training-data-bidding.js` synchronisés.
- Tests supplémentaires sur vulnérabilité, condition du sacrifice, variantes de source, notes des distracteurs.
- Les PR #119 et #120 préexistent et portent sur les mêmes fichiers générés : **ne pas fusionner simultanément sans rebase/conciliation et nouveau passage CI**.
- **PR en brouillon : aucune fusion automatique et aucune certification pédagogique définitive revendiquée.**

## Empreintes SHA-256 des sources
- Sujet BH-055 : `002d7f67c93b9902663632fe1638107dc0c8a82ca57edfefcf18ba8920a30c26`
- Corrigé BH-055 : `dff8a40e35ef4e439a362d175690663dbc47fc49992ed7ae29800b68600a689c`
- Sujet BH-061 : `de39062702695d4f27045fea71af4ad8c8e9a78dad8a469abc8c026273a66eac`
- Corrigé BH-061 : `9fff243d9b82afc4bd4f127f50d65e63923495ce46f2168f0698ca4d5fd75a86`

## Ressource externe de contexte
O. Chailley, *Intervenez efficacement (1)* : https://www.bridge-chailley.fr/intervenez-efficacement/ ; points d'intervention à la couleur et importance de la majeure cinquième.
