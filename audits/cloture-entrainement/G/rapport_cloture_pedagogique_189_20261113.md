# Mission G — clôture du classement et de la relecture pédagogique (13 novembre 2026)

## Décision et périmètre

Projet **CapGui13/QPJB**, application **Entraînement exclusivement**. Référentiels : A (inventaire des originaux Bridge Hebdo), B (Bridge & Mois), C (826 exercices publiés), E (189 manquants), F (trois arbitrages de paires déjà clos), D (anomalies historiques résolues à ne pas rouvrir). Révision menée sur les **PDF source et corrigé** de l'archive historique `BridgeHebdo_originaux_2026-10-23.zip`, sans créer de cartes, d'enchères ni de donnes.

### Bilan définitif des 189 identifiants initialement manquants

| Décision | Effectif | Conséquence |
|---|---:|---|
| **Intégrables** | **137** | Décision distincte, raisonnement du corrigé relu et recevable au système retenu ; préserver les notes éditoriales cas par cas |
| **Bloqués** | **46** | Ne pas importer tant que la source absente, l'incohérence ou l'argument de jeu/enchère n'est pas arbitré |
| **Redondances** | **6** | Déjà représentées dans les 826 ; conserver la provenance, ne pas importer le doublon |
| **Total** | **189** | Aucun exercice publié par G |

Les **46 bloqués** résultent des **30 blocages documentaires/conventionnels** de la précédente version G (9 sans corrigé BH-041 Avancé, 10 donnes incohérentes, 5 divergences pouvant modifier la réponse, 6 Texas incompatibles) et de **16 blocages complémentaires** après relecture pédagogique. Les 153 candidats de la précédente étape ne sont **plus** le nombre d'intégrables : ils donnent 137 intégrables et 16 bloqués.

Les **six redondances** prouvées avec références QPJB sont inchangées : `BH-037-S02-01`, `BH-061-S01-01`, `BH-064-S01-03`, `BH-064-S01-04`, `BH-082-S01-04`, `BH-134-S01-06` (voir registre avec l'ID correspondant). Les trois arbitrages distincts réalisés par F ne sont **pas** recomptés dans ces six cas et ne sont **pas** réexaminés.

## 16 nouveaux cas bloqués à la relecture

| ID de source | Problème | Justification vérifiée |
|---|---|---|
| `BH-016-S01-05` | CHELEM_NON_GARANTI | 1SA–6♥ direct avec six Cœurs et 19 HLD évalués : 1SA ne garantit ni trois atouts Cœur ni l’absence de deux perdantes immédiates. Explorer fit et contrôles ; ne pas enseigner un chelem automatique. |
| `BH-027-S01-06` | CHELEM_SANS_CLES | Après 1♣–1♠–4♠, le répondant saute à 6♠ sur seule addition de HLD ; le soutien fort n’exclut pas deux As manquants. Contrôle des clés/contrôles requis avant de certifier 6♠. |
| `BH-029-S01-05` | CHELEM_SANS_CLES | Après 2SA–3♣–3♦–3♠–4♠, le fit est connu mais le saut à 6♠ se fonde sur 33–34 HL sans vérifier les clés. Chelem envisageable, pas conclusion incontestable. |
| `BH-033-S02-03` | NON_CONFORME_SEF_2024 | Après 1♥, le corrigé conseille 3SA avec ♥92, sans fit. Dans le SEF 2024 de QPJB, la réponse directe de 3SA sur 1M est fittée quatre atouts : réponse et signification incompatibles. |
| `BH-033-S02-05` | NON_CONFORME_SEF_2024 | Après 1♠–3SA, le corrigé suppose que le partenaire n’a que deux Piques, puis conclut 4♠. Dans le SEF 2024, 3SA montre quatre atouts : les hypothèses d’origine sont fausses. |
| `BH-033-S02-06` | NON_CONFORME_SEF_2024 | Après 1♥–3SA, le corrigé compte une main régulière non fittée et en déduit 6SA. Dans le SEF 2024 la réponse 3SA est fittée quatre Cœurs, donc le raisonnement est incompatible. |
| `BH-035-S02-06` | GRAND_CHELEM_NON_JUSTIFIE | Après 2♣–2♦–2♠, le corrigé recommande 7♠ « juste pour voir ». L’ouverture forte ne garantit ni 13 plis ni tous les contrôles : réponse non validable sans exploration des clés et sans main exacte de l’ouvreur. |
| `BH-050-S01-06` | CHELEM_SANS_CLES | Après 1♦–1♥–4♥, le répondant annonce directement 6♥ par addition de 20–23 et 14 HLD. Deux perdantes de premier tour ne sont pas exclues ; absence de contrôle des clés. |
| `BH-071-S01-06` | CHELEM_NON_GARANTI | Après 1♣–1♥–1♠, l’enchère 6♠ repose sur 20 HLD plus un ouvreur possiblement minimum ; 12+20=32 HLD avant la recherche de contrôle. Conclusion catégorique non justifiée. |
| `BH-089-S01-04` | CHELEM_SANS_CLES | Après 1♣–1♥–4♥, le répondant bondit à 6♥ avec ♠8 et sans contrôle de premier tour annoncé à Pique. La force HLD ne garantit pas l’absence de deux perdantes dans la couleur. |
| `BH-109-S01-05` | CHELEM_SANS_CLES | Après 1♦–1♥–3♥, annonce immédiate de 6♥ sans vérification des As ni des contrôles. Fit et total HLD suggèrent d’explorer le chelem, non d’affirmer automatiquement 6♥. |
| `BH-118-S01-06` | TENUES_SA_NON_GARANTIES | Après 1♦–Contre d’appel–passe, le corrigé impose 3SA avec ♠42 et ♥63, en prétendant que le contreur fournit automatiquement les arrêts majeurs. Un contre d’appel ne garantit pas ces arrêts ; risque de chute à SA. |
| `BH-128-S02-01` | PLAN_ATOUT_INEXACT | Au contrat de 4♥, E possède ♥1084 et O ♥3 : trois tours d’atout au minimum pour les retirer. Le corrigé recommande d’« éliminer les atouts en deux tours ». Plan à rectifier avant diffusion. |
| `BH-129-S01-06` | VULNERABILITE_ABSENTE | Le choix de 4♠ en sacrifice contre 4♥ est justifié par le corrigé en reconnaissant que la vulnérabilité est déterminante, mais elle n’est pas indiquée. Impossible de certifier la bonne décision ou le résultat comparatif. |
| `BH-130-S02-01` | PLAN_CARTE_INCOHERENT | Au contrat 4♥, le corrigé fait gagner la Dame de Trèfle à Ouest sur un Trèfle vers le 10 du mort ; or le mort détient ♣AV104 et peut capturer la Dame, et l’enchaînement de deux impasses décrit ne correspond pas à la disposition des honneurs. Ligne de jeu non certifiée. |
| `BH-137-S02-01` | CORRIGE_CARTES_ET_ATOUT_ERRONES | Contrat de 4♠ avec atout Pique ; corrigé utilise un 8♥ et un 10♥ comme atouts et change plusieurs petites cartes entre sujet et corrigé. Plan impossible dans la donne donnée. |

**Important :** la catégorie `CHELEM_SANS_CLES`/`CHELEM_NON_GARANTI` signifie que l'enchère donnée *peut réussir* dans une donne favorable, mais qu'elle n'est **pas garantie par la séquence imprimée**. Ce n'est pas une accusation de faute certaine dans tous les cas : c'est un blocage de la **réponse catégorique** destinée à un QCM pédagogique. À l'inverse, le texte de `BH-128`, `BH-130`, `BH-137` contient des erreurs de plan vérifiables sur le diagramme, et `BH-033` est conventionnellement incompatible avec le **SEF 2024** (3SA direct sur 1M = fitté à quatre).

## Notes éditoriales pour des exercices conservés

Les cas suivants ont une décision **recevable** mais un détail de sujet, de typage, de corrigé ou une méthode alternative à préserver. Le texte des corrections originales reste conservé par référence précise au PDF.

| ID | Traitement |
|---|---|
| `BH-004-1-S01-02` | Le type 'jeu_carte' de l'inventaire A est erroné ici : la deuxième décision est l'enchère 4♠, différente de la première intervention 2♠. Reclasser ENCHERES sans changer la source. |
| `BH-016-S01-03` | La conclusion directe à 4♥ sur 1SA avec six atouts et une force de manche est un choix naturel recevable ; un Texas suivi de conclusion peut être enseigné comme méthode alternative. |
| `BH-025-S01-04` | Le PDF écrit par erreur 24–25 HL pour 2SA (20–21) plus 14 HL ; le bon total est 34–35 HL. 6SA peut être retenu, mais l'arithmétique du commentaire doit être corrigée. |
| `BH-029-S01-04` | Bicolore majeur 5-5 après 2SA : Texas Pique puis annonce des Cœurs pour proposer le meilleur atout, séquence explicitable dans la fiche. |
| `BH-050-S01-03` | Le sujet annonce 1♦, le corrigé substitue 1♣. Le fit à Cœur et la décision 4♥ sont maintenus dans la situation du sujet ; transcrire l'enchère réelle 1♦ et signaler la coquille. |
| `BH-053-S01-06` | Après vérification de la page source : 1♥–1♠–2♣–? ; l'enchère de 3♣ est légale et constitue un soutien différé à Trèfle. Le signalement antérieur « 3♣ sur 3♣ » est annulé. |
| `BH-061-S02-01` | Même donne que BH-064-S02-01 mais question initiale de plan sur entame Dame de Cœur : conserver indépendamment de la décision après deux tours de Cœur et retour atout. |
| `BH-064-S02-01` | Même donne mais décision posée *après* deux tours de Cœur et un retour Pique ; progression de la défense spécifiée, valeur pédagogique distincte du plan initial BH-061. |
| `BH-072-S02-01` | Le corrigé attribue par erreur l'ouverture à Est alors qu'Ouest a ouvert. La double impasse à Trèfle via deux rentrées à Pique demeure intelligible ; rectifier le siège, pas les cartes. |
| `BH-128-S01-04` | Enchère 1SA poubelle/faible : faire attention au contexte exact après ouverture de 1♦ et réponse majeure impossible, sans imposer une réponse de palier 2 à 11HL. |
| `BH-133-S02-01` | Contrôle visuel du PDF p.2 : quatre mains à treize cartes, ♣A987532 au mort, ♦KDV109 en Sud, ♦A singleton au mort ; déblocage de l'As de Carreau sous l'As de Pique cohérent pour préserver l'accès aux Carreaux. |
| `BH-004-2-C02-01` | Exercice autonome inclus dans le corrigé p.2 : en troisième position après l'entame 4♦ d'Ouest, Est avec ♦RV3 doit jouer le Roi de Carreau, non le récit ultérieur du déclarant (laisser-passer). |
| `BH-096-S02-01` | Préserver le Roi de Carreau comme rentrée au mort après capture des atouts et avant la manœuvre Trèfle, pour éviter une promotion des atouts adverses. |
| `BH-097-S02-01` | Coquille dans le texte : « Si Est couvre le 10 [de Cœur] du 10 » doit signifier la Dame de Cœur ; conserver le maniement 10 vers l'As/Valet avec annotation. |
| `BH-138-S02-01` | Contrôle visuel du PDF p.2 : quatre mains à treize cartes, ♦KDV2 au mort, ♦853 en Sud et As de Carreau en Ouest ; impasses répétées du petit Carreau vers DV sont cohérentes. |

**Correction explicite du signalement antérieur :** `BH-053-S01-06` montre `1♥–1♠–2♣–?`, et **3♣ est parfaitement légal**. Il est dans les **137 intégrables**, et ne doit **pas** être bloqué au motif erroné « 3♣ après 3♣ ».

## Mode de validation, réserves et traçabilité

- Toutes les **189 lignes** ont un statut final **sans « à examiner »**, dans `QPJB_G_REGISTRE_DEFINITIF_189_20261113.csv`. La vérification individuelle des **153** anciens candidats, avec lecture d'énoncé/corrigé, principe SEF ou de jeu, et motif des 16 refus, se trouve dans `QPJB_G_VALIDATION_STRATEGIQUE_153_20261113.csv`.
- Les **137** décisions intégrables ne sont pas nécessairement les *seules* décisions recevables : selon les mains, d'autres contrats/entames ou manœuvres peuvent être valables. **Recevable** signifie cohérence pédagogique contrôlée à partir des données originales, **pas** preuve d'optimalité en double-mort, et **pas** autorisation de publier automatiquement.
- Pour les **14 variantes mineures entre cartes du sujet et du corrigé**, ne jamais remplacer silencieusement la main originale : le registre et les PDF identifient la divergence. L'exercice n'est recevable que sous la main et la situation source, avec réserve éditoriale explicite.
- Pour `BH-133-S02-01` et `BH-138-S02-01`, les diagrammes du PDF ont été relus visuellement et les quatre mains sont cohérentes malgré une extraction automatique incomplète.
- Pour `BH-004-1-S01-02`, la catégorie initiale « jeu de la carte » de l'inventaire est une erreur : il s'agit de la **deuxième enchère**, 4♠, sur la même séquence que `BH-004-1-S01-01` (intervention 2♠). Les deux décisions sont distinctes.
- `BH-041-AVANCE-S01-01` à `-08` et `BH-041-AVANCE-S02-01` restent **bloqués sans corrigé source**. Aucune réponse supposée n'a été créée.
- Conformité conventionnelle prise dans le cadre **SEF 2024 et conventions QPJB**, notamment Texas et 3SA fitté sur l'ouverture d'une majeure. Les corrections historiques utilisant une autre convention sont préservées dans le registre, **non réécrites comme si elles étaient SEF**.

## Livrables finaux

1. `QPJB_G_REGISTRE_DEFINITIF_189_20261113.csv` — **189 lignes**, verdict pour chacune, référence au PDF et justification.
2. `QPJB_G_INTEGRABLES_137_20261113.csv` — liste nominative définitive des intégrables avec remarques matérielles.
3. `QPJB_G_BLOQUES_46_20261113.csv` — liste nominative définitive des bloqués avec explication.
4. `QPJB_G_REDONDANCES_6_DEFINITIF_20261113.csv` — six redondances motivées avec ID QPJB déjà publié.
5. `QPJB_G_VALIDATION_STRATEGIQUE_153_20261113.csv` — revue de chaque ancienne candidature, résultat individuel et extrait de preuve du PDF.

**Mission G de classement / vérification clôturée.** Aucun fichier métier ni code de l'application n'est modifié ; aucune publication ni fusion dans `main` n'est réalisée. La **correction éditoriale des 46 bloqués** ou l'intégration ultérieure des **137** relèvent d'une décision de publication distincte, non autorisée dans cette mission.