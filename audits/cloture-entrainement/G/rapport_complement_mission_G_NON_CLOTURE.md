# Mission G — complément impératif à la clôture Entraînement

**État au 13 novembre 2026 : ANTIDOUBLONS DOCUMENTÉS, JUSTESSE NON ENTIÈREMENT CERTIFIÉE.**  
**Périmètre exclusif : Entraînement. Aucune publication, création ou suppression d'exercice ; aucun changement au Quiz SEF.**

## Sources effectivement réexaminées, et sans réaudit historique

- **E :** les **189** lignes classées `MANQUANT`, lues une à une (PR #156, branche `audit/entrainement-cloture-E-20261113`).
- **A :** inventaire de 859 situations Bridge Hebdo, dont **665** déjà représentées dans les 826 fiches QPJB (PR #154). Les 189 manquants ont été comparés aux 665 sujets de référence par type, cartes, données d'enchères et rapprochements textuels ; les similitudes à haut risque ont été analysées.
- **B :** 161 situations Bridge & Mois, toutes déjà représentées dans QPJB (PR #153), dont la main/source a été comparée aux manquants BH. Le seul rapprochement de main à distance ≤4 cartes est `BH-052-S01-03` ↔ `B15-3`, **distinct** sur la distribution 5♦/3♣ versus 4♦/4♣. C : catalogue des **826** IDs publié contrôlé sur sa branche PR #150. Chaque source BH/B publiée identifiée par E est reliée à ce catalogue.
- **F :** ses **3 arbitrages de redondances** BH-001/BH-002 sont **repris tels quels, sans les refaire** (PR correspondante). Ses deux situations distinctes `BH-001-S01-01` et `BH-001-C02-01` restent candidates en dehors des 189.
- **D :** 102 entrées historiques consolidées, **non réauditées**. Les quatre anomalies encore ouvertes restent signalées uniquement lorsqu'elles touchent ces manquants.

### Nouvelle pièce fondamentale : les PDF originaux authentifiés

L'archive persistante `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip` a été retrouvée et copiée **en lecture seule** dans l'espace de travail. Elle contient **280 PDF**, dont **140 corrigés**.

**Résultat : pour les 180/189 exercices avec corrigé, les sujets ET les corrigés exacts existent dans ce ZIP, et les 360 empreintes SHA-256 correspondent à celles consignées dans A.** Les fichiers ont été ouverts et leur texte exploitable extrait pour les contrôles. Les 9 BH-041 AVANCÉ sont absents de l'archive, mais le sujet avancé est conservé ailleurs dans la bibliothèque ; **aucun corrigé avancé accessible**. Le BH-041 Débutant ne peut pas servir de remplacement.

**Attention : présence, empreinte conforme et extraction du corrigé ne constituent pas une seconde validation systématique de justesse pédagogique.** La rubrique `statut_pedagogique_complement` du CSV joint indique précisément ce qui reste à décider.

## Cinq redondances pédagogiques confirmées supplémentaires aux décisions F

| Source E à ne pas intégrer une seconde fois | ID QPJB publié à conserver | Motif précis |
|---|---|---|
| `BH-061-S01-01` | `EN-BH-064-01` | La main du sujet BH-061 diffère d'une petite carte à Pique (♠ARV75 contre ♠ARV105), mais le corrigé BH-061 reproduit ♠ARV105 ; le BH-064 publié pose la même intervention de 1♠ sur 1♣, non vulnérable. Pas de décision nouvelle |
| `BH-064-S01-03` | `EN-BH-061-03` | Main et ouverture 1♥ identiques ; le corrigé BH-064 confirme même vulnérabilité favorable E/O que BH-061 malgré son omission dans le sujet |
| `BH-064-S01-04` | `EN-BH-061-04` | Main forte et ouverture 1♣ identiques, Contre avant de nommer les Piques ; même vulnérabilité dans les corrigés |
| `BH-082-S01-04` | `EN-BH-133-04` | Même main, même 1♣–1SA–?, même redemande de 3SA |
| `BH-134-S01-06` | `EN-BH-092-06` | Même main, 1SA–2♣–2♥–4SA–?, même refus du quantitatif par Passe |

Il s'agit de **sources originales à conserver pour la traçabilité, mais pas de nouveaux exercices à créer**, et non d'un retrait de fiches QPJB. Aucun groupe de F n'est réarbitré ici.

## Situations ressemblantes mais pédagogiquement distinctes

- `BH-004-2-S01-01` ↔ `JC-BH-004-2-Q01` : enchères contre plan du déclarant sur la même donne.
- `BH-005-S01-01` ↔ `JC-BH-005-Q01` : enchères contre choix de reprise en jeu de la carte sur la même donne.
- `BH-061-S02-01` ↔ `BH-064-S02-01` : même donne et entame, mais plan initial contre nouvelle décision après deux tours de Cœur et retour à l'atout.
- `BH-047-S01-01` ↔ `EN-BH-125-01` : 4-4 majeur / contre d'appel, contre 5♠-4♥ / intervention naturelle à 1♠.
- `BH-052-S01-03` ↔ `EN-1m-019` (`B15-3`) : réponse 1♦ commune sur 1♣, mais cinq Carreaux dans le BH contre quatre dans le BM : nuance utile de distribution et de jugement.

Une question sur le même thème n'est pas une copie. Ces cas sont **distincts au plan de la décision ou des informations pédagogiques**, sans garantie générale sur les autres aspects de leurs corrigés.

## Réserves précises de justesse découvertes dans les originaux

**Convention non SEF :**
- `BH-025-S01-02` : correction historique `3♠` naturel directement sur 2SA pour exprimer les Piques, incompatible avec les Texas du SEF usuel.
- `BH-025-S01-03` : correction historique `3♥` naturel directement sur 2SA pour exprimer les Cœurs, alors que 3♦ est Texas Cœur. **Ne pas publier ces réponses comme des réponses SEF.**
- Six cas `BH-016-S01-01` à `BH-016-S01-06` sont issus d'un fascicule qui donne des réponses directes naturelles sur 1SA, notamment `2♥` et `2♠` au sens naturel : contrôle conventionnel **par cas** indispensable avant intégration sous les accords Texas actuels.

**Incohérences matérielles/éditoriales :**
- `BH-085-S01-06` : la source porte ♥R82 ; le corrigé imprime ♥RV2 et justifie `3SA` par **le Roi et le Valet de Cœur**. La réponse du corrigé ne doit pas être appliquée comme s'il décrivait la main du sujet. **Bloqué tant que la lecture et l'arbitrage documentaires ne sont pas tranchés.**
- `BH-055-S01-05` : sujet ♠R5 ♥V1082 ♦A642 ♣D93, corrigé ♠R103 ♥V108 ♦A642 ♣D93. Les deux mains ont 10H et sont régulières ; la divergence est réelle, mais elle ne suffit **pas à elle seule** à déclarer 2SA erroné. Contrôle contextuel restant.
- `BH-025-S01-04` : le corrigé propose `6SA` avec 14HL face à 20–21HL, mais additionne fautivement `24–25HL` au lieu de `34–35HL`. Réponse et justification doivent être dissociées.
- Les extraits sources/corrigés font apparaître plusieurs autres cartes divergentes ; un rapprochement textuel automatisé ne suffit pas pour affirmer qu'elles changent effectivement la décision. Aucune main, aucun honneur ni argument n'a été inventé.

## Compte documentaire auditable (189 lignes)

Le fichier `registre_189_controle_preliminaire.csv` a été mis à jour avec **une ligne par exercice**, le résultat d'accès et d'empreinte PDF, les références QPJB connues, et le statut de contrôle réel.

- **5 REDONDANCE_CONFIRMEE**.
- **9 BLOQUE_CORRIGE_ABSENT**, tous BH-041 AVANCÉ.
- **2 BLOQUE_NON_SEF_2024** (BH-025 cas 2 et 3).
- **6 CONTROLE_CONVENTION_SEF_REQUIS** (BH-016).
- **1 BLOQUE_SOURCE_CORRIGE_INCOMPATIBLE** (BH-085 cas 6).
- **1 DIVERGENCE_SOURCE_CORRIGE_A_CONFIRMERMATERIELLEMENT** (BH-055 cas 5).
- **1 CORRIGE_INCOHERENCE_ARITHMETIQUE** (BH-025 cas 4).
- **6 cas explicitement jugés distincts** des rapprochements les plus proches (2 décisions jeu/enchères ; 2 versions de jeu de carte à instants différents ; BH047/BH125 ; BH052/B15).
- **158 autres** munis de sujet et corrigé authentiques, mais pour lesquels la justesse et la non-redondance sémantique ne sont pas *certifiées individuellement par un examen pédagogique complet*.

Les sommes de ces classes sont 189. Les statuts d'examen ne sont **pas** des autorisations d'intégration.

## Conclusion et verrou

**Le travail documentaire a fortement progressé ; la mission G n'est cependant pas clôturée au sens strict de l'utilisateur.** Une comparaison automatisée de 189 sources avec les 826 fiches, des lectures ciblées des PDF et la confirmation des cinq copies ne suffisent pas à prouver individuellement la justesse de tous les autres exercices. Le seuil d'exigence est de **ne pas inventer**, et surtout de ne pas confondre `PDF corrigé retrouvé` et `bonne réponse démontrée`.

**Nombre définitif d'exercices intégrables : non certifié.** Ne jamais présenter les **158** comme validés automatiquement.  
**Aucun fichier de l'application ni aucun exercice ne sont modifiés.** Le Quiz SEF n'a pas été touché. Cette PR reste **en brouillon**, sans fusion.
