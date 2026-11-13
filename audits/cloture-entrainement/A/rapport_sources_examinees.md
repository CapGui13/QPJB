# MISSION A — Inventaire documentaire Bridge Hebdo — 13 novembre 2026

**Projet** : `CapGui13/QPJB` — **périmètre exclusif** : application Entraînement.  **État** : inventaire des sources accessibles, avec réserves explicites de transcription partielle. Aucune donnée publiée / Quiz SEF n'est modifiée.

## Sources effectivement accessibles

- Archive originale : `Bibliothèque /QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip` (50,721,399 octets ; SHA-256 `1f24c365ad701b1ed2513df2750b89af7e91b94a8f382e40cbc5e846d395f07d`).
- Manifeste : `/QPJB Training/Archives/BridgeHebdo_Inventaire_2026-10-23.json`, contrôle SHA-256 des fichiers originaux effectué **sur chacun des 280 fichiers** : 280/280 concordants.
- Kit d’import : `/QPJB Training/Archives/BridgeHebdo_Kit_Import_2026-10-23.zip` (document d'appoint ; ne constitue pas un PDF original).
- Deux copies de `41. Exercice Votre Bridge Hebdo avancé 9-12-2022.pdf` (avec et sans suffixe `(1)`), dans la racine de la bibliothèque, de SHA-256 identiques : `e9e939511942f1d87c8565164368fa487bee08542822dac45bd1cdbdad4999f4`. Ces copies ne sont pas les mêmes que le BH-041 Débutant de l’archive. Leur corrigé n'a pas été trouvé.
- Dépôt GitHub `CapGui13/QPJB` branche `main` : fichiers publiés et audits, **aucun PDF original Bridge Hebdo** dans l'arborescence contrôlée (453 éléments observés). Les données d'Entraînement n'ont pas été modifiées.
- Archive `BM_originaux_2026-10-23.zip` : Bridge & Mois, **exclue** du périmètre de cette Mission A.

## Couverture et comptage

- **140** fascicules Débutant individualisés dans l'archive, correspondant à **280** PDF originaux : 140 sujets, 140 corrigés.
- **504 pages** PDF dans l'archive : chaque page a été ouverte et son texte natif extrait pour le repérage des exercices et du corrigé, et les dispositions atypiques ont été contrôlées par rendu visuel. Cela n'équivaudrait pas à affirmer que toutes les valeurs de cartes non extractibles ont été retranscrites.
- **1** fascicule Avancé supplémentaire distinct, dont le sujet PDF (2 pages) est accessible en double copie, sans corrigé.
- **859 entrées** documentées dans l'inventaire, dont **850** rattachées à l'archive Débutant et **9** au fascicule Avancé indépendant (8 séquences de Contre + 1 flanc).
- Parmi les 850 entrées Débutant, **3** sont des sous-questions complémentaires explicites du corrigé et **847** proviennent des sujets, y compris les cas autonomes d'une même page.
- Répartition : enchère : 629, entame : 48, flanc / défense : 27, jeu de la carte : 115, maniement de couleur : 40.
- 141 enregistrements au tableau `fascicules_disponibles.csv` (140 Débutant + 1 Avancé), 285 empreintes dans `empreintes_sha256.csv` (280 PDF Débutant, 2 copies Avancé, 3 fichiers supports).
- **Trou historique** : n° 38 absent ; le n° 4 apparaît deux fois sous des identifiants distincts `BH-004-1` et `BH-004-2`. L'archive est complète **par rapport à son manifeste**, pas démontrée exhaustive par rapport à tous les numéros historiquement parus.

## Méthode de séparation des vrais exercices

1. Un problème identifié sur une main/séquence distincte → une ligne, même si le libellé de l'exercice figure une seule fois au-dessus de 4, 5 ou 6 cas.
2. Pour les fascicules `BH-110`, `BH-121` et `BH-138`, quatre mains proposées pour **une seule question de sélection** → une seule ligne (pas quatre inventions).
3. `BH-007` : 5 maniements, avec des questions dépendantes pour chaque cas → 5 lignes (pas 20).
4. `BH-091` et `BH-132` : deux maniements autonomes sur la seconde page ; `BH-114` : quatre cas de signalisation en défense ; six séquences autonomes sur `BH-137`.
5. `BH-001`, `BH-002` et `BH-004-2` : une question explicite de **défense en troisième position** uniquement dans le corrigé, distinguée des questions principales du déclarant, avec source `corrigé`.
6. Les interrogations rhétoriques et étapes d'un plan déjà posé sont signalées dans `candidats_variantes_corriges_non_comptes.csv`, non transformées artificiellement en exercices.
7. Source exacte, SHA-256 PDF, page physique et numéro de cas sont attachés à chaque entrée. `cartes_ou_sequence_source` reprend le **texte extrait natif** et peut comporter des signes incomplets ; la source originale fait foi.

## Limites documentaires explicites

- Certains caractères de mains ou séquences (notamment plusieurs cartes des pages 1 de BH-126 à BH-140) sont dessinés avec des glyphes non récupérables textuellement. La présence des 6 cas y a été constatée ; le champ source contient seulement ce qui est récupérable. **Aucun rang ni symbole absent n'a été deviné.** Ces entrées portent l'état de lecture `transcription partielle`; elles exigent une recopie visuelle pour un catalogue 100 % fidèle.
- Pour des pages en tableaux/colonnes, le découpage par rectangles vise à attacher les fragments de texte aux cas. La référence de **la page originale** reste impérative pour reconstituer les couleurs / cartes dessinées.
- La collection hors de l'archive datée du 23 octobre 2026 n'est pas présumée exhaustive pour l'histoire de Bridge Hebdo. Le fascicule Avancé n° 41 montre précisément qu'une autre série existe ; son corrigé est manquant.
- Aucun arbitrage pédagogique, pas de déduplication ni d'import, aucun changement aux données publiées. Les ressemblances BH-001/BH-002 et les deux séries n° 41 sont signalées, jamais supprimées.

## Livrables

- `inventaire_exercices.csv` — une entrée par exercice autonome documenté (les champs incomplets sont signalés).
- `fascicules_disponibles.csv` — 140 couples de PDF originaux + fascicule avancé supplémentaire.
- `empreintes_sha256.csv` — SHA-256 de chaque fichier original et des supports.
- `sources_introuvables_ambigues.csv` — trous, inconnus, sources hors collection.
- `candidats_variantes_corriges_non_comptes.csv` — variantes en attente d'un verdict humain, sans décision de redondance.

**Cette Mission A fournit l’inventaire des fascicules disponibles et une localisation des exercices. Les réserves de transcription des cartes restent ouvertes : ne pas déclarer « fidélité intégrale des mains » avant leur levée.**
