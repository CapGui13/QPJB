# Reprise M4-A — composition S1–20, U/V/W/Y

Base immuable 49298ada3f96e347833d8717c7e205518ea02fce. Contrats #445/#446. Contre-expertise C reçue via #446 (a27a23dde904f1f588769ee13b4edcbd1beeea81), en lecture seule : ne pas confondre seuils et doublons. Aucun changement de production, de catalogue, d'ordre final, d'éligibilité ni de politique de rappel.

## Hypothèses et résultats exécutés
- U : même concept et autre décision, troisième cas strictement proche seulement ; V : proposition de nouvel objectif déjà éligible sans hausse de stage. Score natif à moins de 48 points, même difficulté et rôle découverte, historique des deux dernières séances complet et autonome, aucun rappel ou slot prioritaire déplacé. U/V : 18 trajectoires chacun S20 en V8, mêmes trois substitutions de S3 dans la famille 1SA, zéro intervention S6–20, zéro violation métrique mesurée. SHA des sources de cet essai 717032a6b3d4a6106ed799d9f23100c1be3c5b37 (les résultats restent historiques après évolution de l'adaptateur). Non retenus.
- W : réaffecter le troisième exemplaire à un contraste de décision d'un objectif *déjà présent* dans le deck, sans faire découvrir un nouveau concept ni dépasser le stage déjà sélectionné. Conserve deux cas du concept retiré. Y : même mécanisme, force H exactement identique au cas de comparaison, pour isoler la distribution. Reprise T à S3. W et Y sont des **propositions de composition M1**, non des changements autorisés de production.
- W : S20 V8, 6 substitutions, aucune violation métrique ; S180 natif [45986038096](https://github.com/CapGui13/QPJB/actions/runs/45986038096), SHA 424aa841c7a3df85ab75adcde11d556194d85892. Y : S180 natif [45986335175](https://github.com/CapGui13/QPJB/actions/runs/45986335175), SHA 1661aabd738a858553323c8bd8cd7db35cf73412. 18/18 campagnes natives chacune, 19 puis 21 assertions dédiées par job, tests historiques ciblés et reprise exécutés. 129 600 présentations appariées natives en plus des essais précédents. Gate strict inchangé, **HOLD W et Y** : 15 violations métriques (5 types × 3 graines autonomes). Aucun seuil retouché. Les 15 autres trajectoires sont intégralement inchangées.

| Horizon | Paires proches avant→W/Y | Décisions proches | Dette fondamentaux | Preuves |
|---|---:|---:|---:|---:|
| S5 | 40→37 | 262→262 | 0→0 | 93→93 |
| S20 | 96→87 | 449→443 | 1→1 | 356→356 |
| S65 | 97→88 | 509→503 | 1114→1147 | 1202→1202 |
| S153 | 111→99 | 589→595 | 162013→161434 | 1443→1440 |
| S180 | 128→113 | 649→646 | 228622→227740 | 1520→1520 |

## Contre-exemples et réservoir
S3 : SEF-005-2 (21 H) → SEF-005-1 (20 H), deux forces dans la même zone 2SA. S9 : SEF-V4-015-3 → SEF-V3-011-1 (W, 15 H) ou SEF-V3-011-3 (Y, 17 H). Les deux nouveaux IDs ont la famille cas-211. La question SEF-V3-016-2, 17 H et quatre Piques, reste présente ; Y oppose 17 H sans majeure quatrième à 17 H avec majeure quatrième. Deux Passe après fit demeurent. S9 autonome : 3→1 paires proches et 3→1 paires de décision.

L'instrumentation read-only du troisième slot S9 a extrait 185 alternatives fraîches de même difficulté, rôle et filtres natifs. Parmi les 9 à distance de score <=48 : le Passe miroir conserve la répétition ; 2♥ sur Stayman est un miroir de 2♠, non le contraste absence/présence de majeure ; les cinq Stayman 2SA répondent déjà à une décision présente ; les deux 2♦ même famille ont été testés W/Y. Le gain de W/Y est donc explicable, pas un hasard de permutation. Pour S6–20, 23 créneaux avaient un contraste strict recensé ; seuls 4 avaient une alternative de même famille, tous en faiblesse. Aucun contraste strict même famille hors faiblesse. Ces résultats bornent les options étudiées ; ne pas prétendre avoir prouvé l'impossibilité universelle de tout algorithme.

## Effet en cascade vérifié par lecture de tous les ZIP natifs
W et Y : exactement les mêmes 18 références ordonnées, mêmes 15 trajectoires neutres ; sur chacune des trois graines autonomes, 152 séances diffèrent de la référence, dont 149 après S20. W et Y ne diffèrent entre eux qu'en S9. S13 : SEF-V4-003-3 (cas-311) devient SEF-V4-015-3 (cas-324). S24 : première divergence post-S20, SEF-V4-019-1 (cas-328) devient SEF-V4-003-3 (cas-311), accompagnée de changements contre.base et red.competitif. La dette de ouv.passe à S65 passe de 8 à 19 sur chaque autonome ; le nombre N4/5 149→154. À S65, deux concepts perdent leur preuve multi-famille/multi-séance (sa1.texas_mineur.reponse et competitif.truscott) et deux en gagnent (chelem.quantitatif et chelem.splinter) ; le total identique masque ce déplacement. À S153, sa1.stayman.contre perd la preuve (5 familles → 1), retrouvée à S180 ; décisions 37→39, récences 15→17. Les changements directs cessent après S20, mais l'historique produit des divergences durables.

Traces complètes récupérées, CRC et 18 couples distincts contrôlés, 180 séances × 10 lignes par bras, comparaison de tous les enregistrements. Archives consolidées remises séparément à l'utilisateur :
- QPJB-M4-A-W-recette-native-S180.zip, 8 043 990 octets, SHA256 1b5312224c31b53eda02ef5092289f6767340605342baef7a7fe97787aabdd25.
- QPJB-M4-A-Y-recette-native-S180.zip, 8 044 068 octets, SHA256 b52c1358856e7fcb8a1f383338f29e7bfafa9ee040ee3c9b51224e299e4c955c.
Checkpoints, verdicts et index d'artefacts natifs permanents dans ce dossier Git ; les ZIP intégraux ne sont pas committés dans Git.

## Transmission et décision
La meilleure proposition de composition pédagogique est Y, mais elle reste **HOLD**. M1/M6 doivent arbitrer le troisième cas répétitif dès sa première apparition et suivre le réinvestissement des familles au-delà de S20, avec B pour la dette fondamentale. Tester la réallocation avec un objectif de couverture par concept ET identité des preuves, pas seulement total. Ne pas supprimer la reprise d'un élève fragile. Ne pas modifier artificiellement les preuves ni réserver une intervention sur la base de la graine. Les deux variantes W/Y montrent qu'un simple changement de force d'un même candidat ne traite pas la cascade de familles. Pas d'activation, pas de fusion. Pas de recette navigateurs ni de certification exhaustive des commentaires historiques.

SOUS-MISSION DÉFINITIVEMENT TERMINÉE : NON — gain concret précoce démontré mais aucun candidat ne satisfait tous les critères ; arbitrage de composition intégrée requis.
