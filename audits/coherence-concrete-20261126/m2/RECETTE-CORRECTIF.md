# Recette native corrective — campagne 45903425019 (version intermédiaire)

SHA code : ac33ebff7fcf473cb9194b4840385ce0a29857c6. Base : 2d336054bc91fbd6ac762c093ecb5ec6da9f97e8. Cette campagne ne certifie pas le dernier SHA 6bd6a8b66f97abbc9429988259eefb8d8f42fbea, dont le run 45904459078 est en file.

21/21 jobs GitHub réussis. Les 18 ZIP natifs ont été téléchargés et extraits, puis contrôlés par tests/coherence-concrete-m2-state-audit.cjs sous Node : 175141 assertions PASS. Les 3240 séances par bras, les motifs de sélection, les ensembles et les indicateurs de composition aux 90 checkpoints ont été vérifiés. Aucune régression cumulée par profil/graine aux 5 horizons. Le contrôle distinct de l'ordre final par rapport à la trajectoire indépendante recense 87 hausses ponctuelles (pas de régression de la permutation par rapport à son propre deck historique) : 25 inversions de prérequis, 5 inversions de difficulté, 56 sauts de difficulté, 1 contraste manqué. 6 de ces événements sont S1–20 ; ils ont disparu dans les 18 paires V8 sur le nouveau candidat (voir PASSE4-S20.md).

| Horizon | Ordres différents | Gains locaux | Sets modifiés |
|---|---:|---:|---:|
| S5 | 85 | 84 | 0 |
| S20 | 346 | 301 | 0 |
| S65 | 1129 | 984 | 0 |
| S153 | 2672 | 2386 | 0 |
| S180 | 3152 | 2833 | 0 |

| Indicateur S180 | Avant | Après |
|---|---:|---:|
| Prérequis inversés | 3268 | 376 |
| Stades inversés | 128 | 2 |
| Difficultés inversées | 87 | 12 |
| Sauts >=2 | 5998 | 2168 |
| Contrastes manqués | 266 | 129 |
| ABAB réponse | 38 | 0 |
| ABAB thème | 4 | 1 |
| Exact adjacent | 48 | 48 |
| Miroirs, miroirs proches, triples, familles adjacentes | 0 | 0 |

Évaluation historique : entries/micros/axes identiques sur les 18 paires ; 59 enregistrements skills différents, dont 19 niveaux (11 hausses, 8 baisses), sur 5 paires. Le HOLD d'intégration est confirmé, ne pas masquer les changements de niveau : arbitrage coordinateur nécessaire. Aucun gain humain déduit.

## Index des 18 artefacts natifs

| Profil/graine | ID | SHA256 |
|---|---:|---|
| autonome/103 | 15158145188 | 6c116688134a5ac428c86dd15eb19f8d25aa1aea2a16fcfc2c12676280243f93 |
| aide/47 | 15158025345 | 4f989e4a7b47e2abd83fd071095b374d022aafe41dc19e1c998f58ec974c6eb2 |
| passe/47 | 15156991844 | 802e72bc644a3d0a4978ce5fc4349cdf33a4b7b48f3391c2db859cb818a132e3 |
| autonome/11 | 15156916900 | b000660f0a8e78e96942c9e0ce388b6b970f2870bda3f582c1a8b897d11ec508 |
| passe/103 | 15157730579 | 9f495c6bf02b88cd8fb0ad68d6bdb6751dee7a6db3593c7f9ea6709ce69e419c |
| aide/103 | 15157920341 | 93b2c168a06ad10786c11cc4dbc1e2a01d57c24e9c72abce54a367642bb47ebd |
| faible/11 | 15157566378 | 436a1d9d76570cad5ae8afa9d9dcc9e5ff2f8fcaafbd0290acf23777aeff82ca |
| aide/11 | 15156748471 | 4e7ab78c35b83174d47b5aeabd445631cafdc5df3d2feea4472468dd738c5c8b |
| modere/47 | 15156843121 | 50d2ab5ec960e85bf6ddec78972132c0a57ce532c52204cdbd3a8e4280318583 |
| autonome/47 | 15158105275 | 9710b9e7cd2ccba7f3c128e6883b31f744aff9edcae34ec62e76beec737dd811 |
| faible/103 | 15156917065 | 59b7f7a4ee332f8429c856d024223e968b3efa83269eab6cfbb0ccd63e1ed612 |
| cible/47 | 15157895422 | 07124628d137e08f81428edbd772415276e95edbda9d13b0526295457c18494f |
| faible/47 | 15157900560 | 034726a8c04cc4f7b7a592aff7b037409b81cf4f421bfeba9d00adf1546da1cf |
| cible/11 | 15157171482 | 49215a5c7ad4df7b70152b04240c5c88f1d967d75847ce59f1645c6b020258cd |
| passe/11 | 15156897217 | 83072ec8c5776313907209b484d015a9a9e8af7b890669898c4383abf96a2c73 |
| modere/11 | 15156956844 | 15a64ddd82b7ad10abc3ee8320a42b40ce70b37a51b8f7d1382704666bf07869 |
| cible/103 | 15157187095 | dcff2ba813a8a51804c8c0f04ccbf819c832d4ec72391ca704132487718f1dbf |
| modere/103 | 15157935218 | ced308ce2af7b2bdeb2f60f6b4b131ff32168ab0074d70da203fe56fdc9fe0d7 |

Le banc d'audit produit le registre exhaustif régénérable : node tests/coherence-concrete-m2-state-audit.cjs <dossier des 18 archives extraites> registre.json. Une copie complète du registre et des 18 ZIP est fournie à l'utilisateur. Aucun changement de production.

Contrôle supplémentaire sur le dernier SHA exact : 3986 assertions V8 PASS, dont parité des 1915 motifs historiques et les six cas de régression. Le module durable non sollicité est remplacé par un Proxy qui lève à tout accès. Cela ne remplace pas la recette native complète.
