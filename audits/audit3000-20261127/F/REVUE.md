# AUDIT3000-F — revue partielle, passes 1–2

Base ccd8f20811b9531bbfccb8352ec60953dd7d07cb, contrat #556, mission #562. 436 IDs du lot, 3000 catalogue. 80/436 relus individuellement, verdicts provisoires {"VALIDE":20,"ARBITRAGE":4,"RECLASSER_REFORMULER":56}, 56 corrections complètes, 3 ajouts proposés aux groupes. Aucun fichier commun modifié.

## Anomalies et décisions
- Passe 1 : relais donné dans l'énoncé ; préciser troisième couleur forcing un tour, neutraliser Splinters ; correction de vigilance V45-015 (As de Trèfle détenu). Quatrième 1♠ économique V45-017 : arbitrage sur la lecture SEF 2024 p.53 vs traitement catalogue.
- Passe 2 : 40 énoncés révèlent des renseignements discriminants ou même l'enchère. Corrections contextuelles pour exiger l'analyse de la main. V480-015 explicite priorité du bicolore dix cartes. Réponses aux As 2♦ et exception deux Rois vérifiées avec iBridge/Bridge Saint-Cloud. Conserver les contrastes Dame oui/non, espace, deux As rouge/noir vs rang, priorité soutien/10 cartes/arrêt/repli, contrôles par A/R/singleton/chicane. Aucun changement de réponses ou de mains dans les deux passes.
- 136 IDs sans groupe direct ; pas de réintégration de masse. Signatures proches dans les 80 : [["SEF-V45-011",["SEF-Q400-D-030"]],["SEF-C2-010",["SEF-Q400-D-092"]],["SEF-V475-002",["V2-M6-015"]]] ; candidats de redondance, non arbitrage sémantique exhaustif.

## Tests réellement exécutés
JS sur les 436 de la base : 13 cartes, H, forme, rangs uniques par couleur, quatre choix distincts et réponse incluse, minSession des groupes directs ; zéro anomalie. 3000 IDs catalogue uniques, correspondance périmètre. Après passe 2 : 80 verdicts uniques exactement préfixe du périmètre ; corrections rattachées. Groupes proposés existants. Pas de tests Node du dépôt exécutés ni de certification SEF exhaustive ; contrôle de légalité complet et comparaison sémantique globale à finir. Sources dans verdicts. PR brouillon #565.

INCOMPLET : 356 IDs sans verdict. Ne pas intégrer les patches avant revue coordinateur. Aucune fusion.
