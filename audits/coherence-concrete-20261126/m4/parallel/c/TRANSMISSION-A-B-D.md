# Transmission A/B/D — M4-C, revue S1–20 complète (pas visa catalogue entier)
Base 49298ada3f96e347833d8717c7e205518ea02fce. 380 ID uniques observés sur 18 trajectoires de référence, 360 séances et 3600 occurrences. Les archives de B sont relues, pas rejouées. 424 ID revus individuellement par IA, dont tous les 380 observés; 1491 seulement automatiques. Ne pas traiter les groupes comme une équivalence transitive. Les paires explicites seules sont annotées bilatéralement; aucune substitution autorisée par le module.
 
## Fiches S1–5 : recommandations à tester
- S1 — SEF-N022-1/SEF-N024-1 : 5 H réguliers, même seuil Passe, espacer après réussite. Conserver SEF-N023-1 (6 H, majeure 5e, faible) et SEF-Q26-M1-003 (11 H, limite). Meilleure mineure : SEF-PN26-M1-001/004, 3–3 → 1♣, 4–4 → 1♦; V2-M1-005 (14 H et 15 HL) 1♣ vs V2-M1-006 (15 H et mineure cinquième régulière) 1SA. Pas de suppression du contraste.
- S2 — SEF-PN26-M1-005/006 : 7 H quatre Piques, trois contre deux Cœurs, soutien vs 1♠ après 1♥. SEF-V410-022 est proche du second. SEF-V49-005/V2-M1-021 : priorité majeure après 1♣ à distinguer du cas au-delà du seuil de 12 HL QPJB. SEF-N041-2/SEF-N045-1 : 1SA ou 2♣ selon force.
- S3 — SEF-004-1/SEF-005-2 : 21 H réguliers, 2SA, proximité réelle; espacer si réussis. SEF-016-1/SEF-N035-2 : 9 H vs 6 H, même enchère mais borne pédagogique différente.
- S4 — SEF-N088-1 (5 H Passe), SEF-N091-3 (8 H 2SA), SEF-033-1 (10 H 3SA) sur 1SA : conserver les seuils.
- S5 — SEF-N122-1/SEF-050-2 : 13 H, six cartes majeures, répétition 2M après 1SA non forcing, miroir. SEF-037-1/SEF-N084-1 : Texas même code à 4 H partielle vs 11 H manche, préserver intention différente.
Les fiches détaillées (mains, réponse canonique, rôle, motif, occurrence) sont dans baseline/*.json, et les preuves individuelles dans les quatre overlays + preuves.json.

## B : rappels fondamentaux
Rappels à espacer après réussite autonome et jamais supprimer sur simple proximité si erreur, aide ou dette de rappel. Contrastes limites 11 H+2 L=13 HL vs 11 H+1 L=12 HL; 14 H+1 L ne vaut pas 15 H pour 1SA; distinguer seuil de manche 1SA vs 2SA, 7/8/9/10 H, fit 5–3 vs 5–2, 6/10/11 HLD. Rappel doit rester dans la séquence réelle (Passe d'ouverture vs compétitif, soutien simple vs Truscott). Aucun changement de score ou de preuve autorisé par C.

## D : conventions à protéger
SEF-PN26-M1-016 vs SEF-Q26-M2-009 : rectification Texas après 1SA obligatoire même doubleton, après 2SA 3SA nie fit troisième; SEF-L25-004 exception Contre d'entame. SEF-PN26-M1-033 : 2SA Stayman = deux majeures, pas maximum; V2-M3-021 : 2SA modérateur bicolore cher, pas naturel. SEF-V470-005/006 : Truscott quatre vs trois atouts. SEF-V472-001/003 : 9 vs 8 H Truscott mineur. SEF-V3-063-1 vs SEF-V3-052-1 : 2 H réponse obligatoire sur Contre d'appel contre Passe en intervention directe. SEF-V4-006-2 vs SEF-V4-002-1 : 3M préventif vs 2SA essai.

## Tests et limites
Registre statuts.json = index de référence des niveaux de revue; overlays individuels et ancien registre ne doivent pas être confondus. 7748 assertions V8 sur index et relations, en plus de 9824 assertions des cinq passes précédentes. Test Node fourni, non exécuté dans cet environnement. Pas de validation humaine, pas de modification catalogue/moteur, pas de recette native S65–180 ni revue complète historique. 1491 ID restent à examiner individuellement (priorité S21–65). Les recommandations ne sont pas un résultat avant/après moteur : A/B devront tester.
