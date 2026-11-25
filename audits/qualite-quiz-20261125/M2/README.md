# M2 — Qualité Quiz sans-atout

Base 4bb2df19929f921aff81468be22830445d4f87b0, catalogue 55633e60ad6e8583616ad11b1da3acf1da013844, prérequis 9071d5ab03115c9967fb3c54ee819f91a1cec84e. Contrat #306, mission #308. Périmètre exclusif sa (86), stayman (65), multilandy (31), rubensohl (49). 31 concepts.

## Bilan
- 231/231 examinés ; 167 conservés sans réserve, 63 corrigés (69 champs), 1 en arbitrage seul. Deux points d’arbitrage groupés, dont certains déjà corrigés rédactionnellement. 2 réponses modifiées, avec choix et contexte associés ; aucune main ni ancien ID supprimé.
- 23 QCM nouveaux, 23 situations du plan couvertes. IDs provisoires M2-QUAL-001…023, familles distinctes, prérequis à intégrer par le pilote. Ne pas introduire de nouvelle convention : les développements particuliers sont indiqués comme accords. Les notions cross-lot chelem.quantitatif et chelem.quantitatif.suite sont utilisées uniquement dans la rubrique sa, avec concepts existants.
- Priorités : trois suites Rubensohl, choix Multi-Landy, Texas mineurs, réponses et poursuites 2SA, bicolore 5–5, gambling, quantitatif, relais Stayman, choix de manche après Texas. Les cas contrés existants couvrent déjà les trois branches Stayman et Texas ; conserver les textes et accords validés plutôt que produire des variantes redondantes.

## Cohérence et sources
Le dernier commentaire de #271 atteste le visa et la fusion de #279 : 53/53 dossiers arbitrés, 9/9 CI historiques. Ne pas rouvrir les décisions. Les sources des corrections sont données ID par ID : catalogue figé et références historiques, plus consultation directe du support BridgeSEF « Les choix après l'ouverture de 1SA », p.1 (relais et transferts après 2SA au Stayman). Le manuel SEF 2024 intégral n'a pas été consulté : ne pas attribuer au SEF les conventions locales Multi-Landy/Rubensohl ou les variantes 2SA non attestées par une source normative complète. Les nouveaux cas de 2SA Texas mineur et 5–5 sont explicitement conditionnés aux accords du cas source. Le cas V44-031 est maintenu en arbitrage de valorisation qualitative, et la frontière quantitative 16/17 H est signalée ; pas de changement d'une convention non résolue.

## Application pilote
patch.json : patches {id, old, new, reason, source}; additions {id,qcm,prerequis,reason,source,anchorId}. Vérifier tous les old contre le blob gelé, remapper les IDs provisoires et leurs prérequis. Préserver les métadonnées non modifiées, les anciens IDs et les difficultyReason historiques des QCM existants (notamment les 105 preuves), sauf deux motifs erronés SEF-V481-013 et SEF-V481-014 dont les IDs ne sont pas référencés dans quizz-parcours.js. Les deux changements de réponse V416-008 et V416-009 remplacent la manche directe par le transfert explicite et ajustent les choix ; recette FULL à l'intégration.

## Validation ciblée exécutée
JS V8 sur le blob réel : 231 anciens après simulation du patch et 23 nouveaux : 13 cartes, honneurs recalculés, distributions, aucune répétition de rang dans une couleur, quatre choix uniques, réponse présente, champs de difficulté, ID et famille nouveaux, absence de doublon exact main+séquence, prérequis valides et concepts existants ; old exacts ; review 231 IDs uniques. 0 erreur. Aucune CI globale ni exécution navigateur par l'instance : recette intégrée réservée au pilote. Aucun fichier hors M2 modifié.
