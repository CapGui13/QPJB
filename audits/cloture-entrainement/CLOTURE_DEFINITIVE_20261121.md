# Clôture définitive — Entraînement QPJB (21 novembre 2026)

**Périmètre exclusif :** missions A–G, PR #154, #153, #150, #151, #156, #158, #160, et rapprochement à la livraison H [PR #167](https://github.com/CapGui13/QPJB/pull/167), **fusionnée le 13/11/2026**. Cette note archive des décisions, elle ne modifie ni exercice, ni moteur V1, ni Quiz SEF. Aucun nouvel audit général, aucune réimportation.

## Référence faisant foi : PR H fusionnée

- **1 020 situations individualisées** des archives disponibles : **859 Bridge Hebdo (A)** + **161 Bridge & Mois (B)**. Cette exhaustivité est limitée au corpus disponible.
- **826 historiques conservés**, IDs inchangés : 638 enchères + 188 carte. Dans le registre H, ils se divisent en **820 rapprochés sans contradiction** et **6 sources Bridge & Mois ambiguës maintenues**.
- **139 originaux supplémentaires publiés par H** : 137 provenant des décisions G + 2 provenant des décisions F. Répartition : 92 enchères, 27 jeux de la carte, 17 entames, 3 flancs.
- **965 situations distinctes intégrées** = 826 + 139. **55 exclusions attestées** = 46 bloquées + 9 redondantes. Équation de contrôle : 820 + 6 + 139 + 46 + 9 = **1 020**.
- **154 métadonnées de provenance Bridge & Mois corrigées** : 132 enchères et 22 cartes, sans changer réponses ni IDs des historiques.
- Dans les CSV de H, des expressions telles que `INTEGRE_DANS_H_BROUILLON` et `NON_PUBLIE_SUR_MAIN` décrivent **l'état au moment de leur rédaction**. Depuis la fusion de #167, le statut de publication effectif de ces 139 lignes est **publié** : ne jamais les réintégrer.

**Pièces pérennes sur `main` :**
- [Registre H des 1 020 décisions](https://github.com/CapGui13/QPJB/blob/main/audits/cloture-entrainement/H/registre_tracabilite_1020.csv) — statut, source exacte, PDF, SHA-256, justification, ID existant ou créé, témoins des redondances.
- [Matrice des 139 originaux](https://github.com/CapGui13/QPJB/blob/main/audits/cloture-entrainement/H/matrice_transcription_139.csv).
- [154 corrections de provenance](https://github.com/CapGui13/QPJB/blob/main/audits/cloture-entrainement/H/corrections_provenance_bm_154.csv).
- [Rapport H](https://github.com/CapGui13/QPJB/blob/main/audits/cloture-entrainement/H/rapport_etat_integration_20261113.md), document historique rédigé *avant* la fusion.

## Réserves historiques D (102 cas) : décision ciblée

Le registre D consigne **75 RÉSOLU**, **17 SOURCE_INCOHÉRENTE_DOCUMENTÉE**, **4 OUVERT** (au 13/11) et **6 INDÉTERMINABLE**. Ne pas reprendre les 75 déjà résolus.

| Ancienne anomalie ouverte | Situation source reconnue par H | Décision définitive sur le périmètre présent |
| --- | --- | --- |
| `JC-BH-037-M01` | `BH-037-S02-01` | **Redondance G** avec `JC-BH-024-Q01` (même maniement, changement de couleur), **sans nouvel exercice** |
| `EN-BH-061-01` | `BH-061-S01-01` | **Redondance G** avec `EN-BH-064-01` (intervention à 1♠), divergence de carte entre sujet/corrigé source signalée, **sans nouvel exercice** |
| `EN-BH-085-06` | `BH-085-S01-06` | **Bloqué G** : ♥R82 au sujet, ♥RV2 au corrigé ; le motif 3SA invoque un Valet absent du sujet. Aucune correction inventée |
| `EN-BH-103-06` | `BH-103-S01-06` | **Bloqué G** : ♦V7652 au sujet, ♦V9652 au corrigé ; cue-bid 2♣ à arbitrer uniquement si pièce authentique nouvelle |

Ainsi, **0/4 anomalies D sans disposition** : **2 résolues par équivalence**, **2 conservées explicitement dans les 46 blocages sources**. Ce dernier état ne signifie pas qu'une version pédagogique valide a été produite.

Les **6 INDÉTERMINABLES** demeurent des réserves documentaires anciennes : `EN-1sa-008`, `EN-BH-048-03`, `EN-BH-092-05`, `EN-BH-115-05`, `EN-BH-019-04`, `EN-BH-025-01`. Selon D, leurs décisions sont en `reviewStatus=transcrit_source`, en auto-évaluation non notée. **Pas de réouverture sans fait précis nouveau**.

## Neuf fiches historiques actives avec `sourceAudit.publication_autorisee=false`

**Enchères (6)** : `EN-BH-134-03`, `EN-BH-136-05`, `EN-BH-139-06`, `EN-BH-140-01`, `EN-BH-140-02`, `EN-BH-140-05`.

**Jeu de la carte (3)** : `JC-BH-136-01`, `JC-BH-139-01`, `JC-BH-140-01`.

**Décision de statut :** ces neuf IDs figurent déjà dans les historiques actifs ; l'inventaire C précise que le tirage de l'application n'utilise pas `sourceAudit.publication_autorisee`, mais le contrôle de `reviewStatus`. **Publication effective** et **validation éditoriale** ne doivent donc pas être confondues. La présence simultanée d'une fiche active et de ce champ `false` est une incohérence de métadonnées, **pas une preuve d'autorisation éditoriale ni un motif de suppression automatique**. Les trois fiches de carte vues sur `main` portent `reviewStatus=a_relire` et des notes de prudence sur les distributions/conditions ; ne pas les transformer en corrections certaines.

**Traitement de clôture :** documenter et conserver les neuf contradictions comme **réserves éditoriales non bloquantes pour la traçabilité** ; ne changer ni le drapeau ni les réponses en l'absence d'un arbitrage éditorial et de l'autorisation de publication d'une correction applicative. **Ne pas annoncer que leur champ a été corrigé**. Cela clôt l'analyse du statut, pas une future modification des métadonnées.

## Les 46 blocages et les 9 redondances

**46 bloqués (Mission G)** : **30 premiers blocages** (9 BH-041 Avancé sans corrigé, 10 donnes incohérentes, 5 divergences pouvant modifier la réponse, 6 conventions Texas incompatibles) + **16 cas supplémentaires** bloqués après relecture pédagogique, notamment chelems non démontrés, contrôle des clés absent et incompatibilités SEF. La nomenclature détaillée et l'argument pour **chacun des 46** sont dans [le registre G des bloqués](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/bloques_46_20261113.csv) et [les 46 lignes `BLOQUE_SOURCE` de H](https://github.com/CapGui13/QPJB/blob/main/audits/cloture-entrainement/H/registre_tracabilite_1020.csv). Tous possèdent une justification et la référence du PDF sujet avec SHA ; les neuf du fascicule BH-041 Avancé ont un **corrigé inaccessible**, non substitué par le BH-041 Débutant. **Zéro des 46 publié par H.**

**9 redondances (3 F + 6 G), toutes conservées comme sources mais non publiées de nouveau :**

| Original exclu | Témoin/source conservé |
| --- | --- |
| `BH-002-S01-01` | `BH-001-S01-01` (publié dans les 139 de H) |
| `BH-002-S01-02` | `JC-BH-001-Q01` |
| `BH-002-C02-01` | `BH-001-C02-01` (publié dans les 139 de H) |
| `BH-037-S02-01` | `JC-BH-024-Q01` |
| `BH-061-S01-01` | `EN-BH-064-01` |
| `BH-064-S01-03` | `EN-BH-061-03` |
| `BH-064-S01-04` | `EN-BH-061-04` |
| `BH-082-S01-04` | `EN-BH-133-04` |
| `BH-134-S01-06` | `EN-BH-092-06` |

Chaque paire porte une justification et ses sources PDF+SHA dans le registre H et dans les deux dossiers F/G. Ces redondances **n'impliquent aucune suppression** des 826 historiques.

## Limites de source maintenues, sans nouvelle mission générale

- **BH historique n°38** absent de l'archive accessible : sujet/corrigé et existence historique non certifiés.
- **BH-041 Avancé** : 9 situations du sujet attestées, corrigé introuvable, **9 blocages compris dans les 46**, pas neuf blocages en plus.
- **Six divergences sujet/corrigé Bridge & Mois** : `B03-3`, `B12-3`, `B16-3`, `B18-1`, `B21-4`, `B22-6` ; 6 historiques maintenus avec réserve, sans main recomposée.
- **Sept questions secondaires BH et deux BM** hors inventaire des 1 020 : autonomie non établie, **ne pas accroître le décompte**.
- Périmètre d'éventuels fascicules hors archives du 23/10/2026 **inconnu**. « Exhaustif » désigne uniquement les 1 020 situations consultables.
- Les anciens chiffres intermédiaires de G (`153/30`, etc.) sont historiques : **seuls 137/46/6 de G sont définitifs**. Les PDF restent la source primaire.

## Archive des livrables A à G — références figées avant fermeture des PR

Les liens ci-dessous visent **les SHA exacts des têtes des sept PR**, et non des branches susceptibles de changer. Conserver les PR fermées et leurs refs ; **ne pas supprimer leurs branches d'archives** sans garantie de conservation matérielle des rapports. La clôture administrative des PR n'est **pas** leur fusion et ne transforme pas les comptes rendus historiques en fichiers de `main`.

| Mission / PR | SHA d'archive | Rapports et registres indispensables |
| --- | --- | --- |
| [A — PR #154](https://github.com/CapGui13/QPJB/pull/154) | `785a4d5a3ac9455281806f738e6abaac48dac3fc` | [rapport_sources_examinees.md](https://github.com/CapGui13/QPJB/blob/785a4d5a3ac9455281806f738e6abaac48dac3fc/audits/cloture-entrainement/A/rapport_sources_examinees.md) · [inventaire_exercices.csv](https://github.com/CapGui13/QPJB/blob/785a4d5a3ac9455281806f738e6abaac48dac3fc/audits/cloture-entrainement/A/inventaire_exercices.csv) · [empreintes_sha256.csv](https://github.com/CapGui13/QPJB/blob/785a4d5a3ac9455281806f738e6abaac48dac3fc/audits/cloture-entrainement/A/empreintes_sha256.csv) · [sources_introuvables_ambigues.md](https://github.com/CapGui13/QPJB/blob/785a4d5a3ac9455281806f738e6abaac48dac3fc/audits/cloture-entrainement/A/sources_introuvables_ambigues.md) · [journal_controle_visuel_2026-11-13.csv](https://github.com/CapGui13/QPJB/blob/785a4d5a3ac9455281806f738e6abaac48dac3fc/audits/cloture-entrainement/A/journal_controle_visuel_2026-11-13.csv) |
| [B — PR #153](https://github.com/CapGui13/QPJB/pull/153) | `7049b4a42385daa1a526fb6bf527ffba582798c8` | [sources_et_couverture.md](https://github.com/CapGui13/QPJB/blob/7049b4a42385daa1a526fb6bf527ffba582798c8/audits/cloture-entrainement/B/sources_et_couverture.md) · [inventaire_bridge_et_mois.csv](https://github.com/CapGui13/QPJB/blob/7049b4a42385daa1a526fb6bf527ffba582798c8/audits/cloture-entrainement/B/inventaire_bridge_et_mois.csv) · [manifest_pdf_sha256.csv](https://github.com/CapGui13/QPJB/blob/7049b4a42385daa1a526fb6bf527ffba582798c8/audits/cloture-entrainement/B/manifest_pdf_sha256.csv) · [anomalies_verification.csv](https://github.com/CapGui13/QPJB/blob/7049b4a42385daa1a526fb6bf527ffba582798c8/audits/cloture-entrainement/B/anomalies_verification.csv) · [sous_questions_originales.csv](https://github.com/CapGui13/QPJB/blob/7049b4a42385daa1a526fb6bf527ffba582798c8/audits/cloture-entrainement/B/sous_questions_originales.csv) |
| [C — PR #150](https://github.com/CapGui13/QPJB/pull/150) | `82138bf4fcc30e84d10fccf554461466053cc598` | [rapport-anomalies.md](https://github.com/CapGui13/QPJB/blob/82138bf4fcc30e84d10fccf554461466053cc598/audits/cloture-entrainement/C/rapport-anomalies.md) · [catalogue-entrainement-main.csv](https://github.com/CapGui13/QPJB/blob/82138bf4fcc30e84d10fccf554461466053cc598/audits/cloture-entrainement/C/catalogue-entrainement-main.csv) · [anomalies-indexation.csv](https://github.com/CapGui13/QPJB/blob/82138bf4fcc30e84d10fccf554461466053cc598/audits/cloture-entrainement/C/anomalies-indexation.csv) |
| [D — PR #151](https://github.com/CapGui13/QPJB/pull/151) | `a67dded3fb210abc7ec90f5323a4ff7c79223bbf` | [rapport_synthetique_20261113.md](https://github.com/CapGui13/QPJB/blob/a67dded3fb210abc7ec90f5323a4ff7c79223bbf/audits/cloture-entrainement/D/rapport_synthetique_20261113.md) · [registre_anomalies_20261113.csv](https://github.com/CapGui13/QPJB/blob/a67dded3fb210abc7ec90f5323a4ff7c79223bbf/audits/cloture-entrainement/D/registre_anomalies_20261113.csv) |
| [E — PR #156](https://github.com/CapGui13/QPJB/pull/156) | `a6774a8f646f2f6842a120f2f3e6da031004f17d` | [rapport_mission_E.md](https://github.com/CapGui13/QPJB/blob/a6774a8f646f2f6842a120f2f3e6da031004f17d/audits/cloture-entrainement/E/rapport_mission_E.md) · [rapprochement_sources_qpjb.csv](https://github.com/CapGui13/QPJB/blob/a6774a8f646f2f6842a120f2f3e6da031004f17d/audits/cloture-entrainement/E/rapprochement_sources_qpjb.csv) · [exercices_manquants.csv](https://github.com/CapGui13/QPJB/blob/a6774a8f646f2f6842a120f2f3e6da031004f17d/audits/cloture-entrainement/E/exercices_manquants.csv) · [ecarts_referencement_bridge_mois.csv](https://github.com/CapGui13/QPJB/blob/a6774a8f646f2f6842a120f2f3e6da031004f17d/audits/cloture-entrainement/E/ecarts_referencement_bridge_mois.csv) · [sources_inaccessibles_et_lacunes.csv](https://github.com/CapGui13/QPJB/blob/a6774a8f646f2f6842a120f2f3e6da031004f17d/audits/cloture-entrainement/E/sources_inaccessibles_et_lacunes.csv) |
| [F — PR #158](https://github.com/CapGui13/QPJB/pull/158) | `255432d035799372bf545df24e56a0775078564e` | [rapport_arbitrage_redondances.md](https://github.com/CapGui13/QPJB/blob/255432d035799372bf545df24e56a0775078564e/audits/cloture-entrainement/F/rapport_arbitrage_redondances.md) · [comparaisons_redondances.csv](https://github.com/CapGui13/QPJB/blob/255432d035799372bf545df24e56a0775078564e/audits/cloture-entrainement/F/comparaisons_redondances.csv) |
| [G — PR #160](https://github.com/CapGui13/QPJB/pull/160) | `b1d78a5d068d725166e18dae9c99cacc23e907bc` | [rapport_cloture_pedagogique_189_20261113.md](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/rapport_cloture_pedagogique_189_20261113.md) · [registre_definitif_189_20261113.csv](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/registre_definitif_189_20261113.csv) · [validation_strategique_153_20261113.csv](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/validation_strategique_153_20261113.csv) · [integrables_137_20261113.csv](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/integrables_137_20261113.csv) · [bloques_46_20261113.csv](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/bloques_46_20261113.csv) · [redondances_6_definitif_20261113.csv](https://github.com/CapGui13/QPJB/blob/b1d78a5d068d725166e18dae9c99cacc23e907bc/audits/cloture-entrainement/G/redondances_6_definitif_20261113.csv) |

## Décision de clôture

- Les sept PR A–G sont **documentaires**, déjà exploitées par H : elles peuvent être fermées **sans fusion**, avec renvoi à cette note et à la version figée de leurs preuves.
- Aucune correction des 46 blocages, des six cas indéterminables et des neuf champs historiques `false` n'est inventée ni appliquée.
- Ne modifier ni `quizz` / Quiz SEF, ni moteur V1, ni fichiers applicatifs d'Entraînement, ni les 139 originaux déjà intégrés. **Aucune correction applicative publiée ou fusionnée.**
