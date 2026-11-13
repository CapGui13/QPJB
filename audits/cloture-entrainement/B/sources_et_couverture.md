# Mission B — Inventaire documentaire Bridge & Moi / Bridge & Mois

**Constat :** 13 novembre 2026. **Périmètre exclusif :** Entraînement. Le Quiz SEF et le catalogue public ne sont pas modifiés.

## Sources originales

- Bibliothèque QPJB : `/QPJB Training/Archives/BM_originaux_2026-10-23.zip` (9 171 710 octets).
- SHA-256 recalculé sur l'archive : `ad69d85e45492a3a3266ed98b0cb12add07f690d63ac9395bbe15f7d850b127d`.
- Archive alternative : `/QPJB Training/Archives/QPJB_Projet_Maintenance_2026-10-23.zip`, contenant `sources/BM_original_2026-10-23.zip` ; l'archive intérieure est **strictement identique** (même SHA-256).
- Les sources sont 46 PDF natifs : 23 sujets et 23 corrigés, numéro **1 à 23**, un couple par numéro. Aucun n° absent dans cette plage.
- 23 sujets à deux pages : **six enchères en page 1 et un cas de carte en page 2** ; 22 corrigés à deux pages et le **corrigé n°18 à trois pages**. Total **93 pages** sources.
- Extraction systématique de chacune des 93 pages pour le relevé ; la troisième page du corrigé 18 n'est pas omise.
- Les SHA-256 PDF sont répertoriés individuellement dans `manifest_pdf_sha256.csv`.

## Décompte des questions explicitement posées dans les sujets

| Nature | Situations |
| --- | ---: |
| Enchères (23 × 6) | 138 |
| Jeu de la carte (déclarant) | 21 |
| Flanc (n°2 et n°5, p.2) | 2 |
| Entame autonome | 0 |
| Maniement autonome hors plan de jeu | 0 |
| **Total** | **161** |

Les maniements de couleur et d'atout apparaissent aussi **au sein** de certains plans de jeu, sans constituer automatiquement une nouvelle question indépendante. Les corrections présentent des branches de solution et variantes, pas 161 nouvelles questions.

**Contrôle croisé :** l'archive de maintenance du 23 octobre contient `rapports/audit_initial_161.csv`, document historique de 161 situations. Ce concordat numérique ne remplace pas la lecture des originaux.

## Couverture et réserves honnêtes

- **Couverture documentaire : 23/23 fascicules accessibles, 46/46 PDF, 93/93 pages.**
- **Couverture explicite : 161/161 questions directement individualisées dans les sujets.**
- Les sous-décisions qui apparaissent seulement dans les commentaires de correction demandent un arbitrage de granularité avant d'être élevées au rang d'exercice autonome : voir `fascicules_manquants_et_ambiguities.md`. Le **100 % des sous-exercices implicites** n'est donc pas certifié.
- Le n°24 n'est ni présent dans l'archive datée du 23 octobre 2026 ni prouvé publié : son statut est **inconnu**, pas « manquant ».
- Les éléments du dépôt `entrainement/training-data-*.js` sont des **données publiées**, non des PDF sources ; ils ne servent pas de preuve primaire. Des écarts source/corrigé sont connus pour certaines mains, la transcription conserve celle du sujet.
- Aucune ressemblance de thème n'a entraîné une suppression ; aucun doublon n'est considéré confirmé sans comparaison exacte.
- Aucun nouvel exercice ou corrigé fabriqué, aucune modification du catalogue.

## Fichiers

- `inventaire_bridge_et_mois.csv` — situations documentées, références sujet/corrigé et SHA-256.
- `manifest_pdf_sha256.csv` — 46 empreintes sources et paginations.
- `fascicules_manquants_et_ambiguities.md` — couverture et réserves sur les variantes.

**Statut :** inventaire des questions **explicites** terminé ; autonomisation éventuelle de variantes uniquement présentes dans les corrigés laissée ouverte.