# Entraînement QPJB — arbitrage ciblé BH-090-03 (10 novembre 2026)

## Verdict
**Comparaison de conventions, sans changement de bonne réponse documentaire ni notation automatique.**

### Source primaire — Bridge Hebdo n°90, 17 novembre 2023, page 1
- Sujet : Nord ouvre **1♣**, Sud répond **1♥**, Nord soutient à **2♥** ; Sud possède **♠A5 ♥R642 ♦9532 ♣A94**.
- Corrigé publié : **3♥**, qualifié d'invitation à la manche avec **12 HLD**. Le fascicule qualifie cette enchère de palier « inutile ».
- Empreinte SHA-256 du sujet : `aa5bcba8c27fc4275e931aea49c90416f943da9f17c7a9bc44535bf0fdeaaa0f`.
- Empreinte SHA-256 du corrigé : `97a7eab671032d8e22761f4ef897138a486fc821d13ca0b64ca7b822d7ad19fa`.
- Archive propriétaire : `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip`.

### Méthode retenue et différenciation
L'avis déjà inscrit au projet QPJB distingue l'ancien sens de **3♥ invitation** et la méthode contemporaine d'**enchère d'essai généralisée à 2SA**, après 1♣–1♥–2♥. Dans cette seconde méthode, 3♥ est compétitif, pas l'invitation. Les deux séquences ne doivent pas être enseignées sans préciser les accords.

Référence pédagogique de corroboration, après ouverture mineure et soutien de la majeure du répondant : https://abc-du-bridge.scenari-community.org/003-01/co/003-01-04-1-1_1.html (section « Redemande du répondant sur 2♥/♠ »). Cette référence n'est pas la reproduction de l'intégralité du SEF 2024 ; la rédaction doit rester précise quant aux accords.

### Correction proposée — sans altérer le source
- Prévenir **avant les choix** que le QCM interroge le traitement du fascicule de 2023, et qu'à QPJB l'invitation serait 2SA (non proposée dans les options de la source).
- Conserver à l'identique **ID, main, séquence, quatre choix, correct=3♥, sourceRef, statuts**, et les indices.
- Expliquer **après réponse** les deux conventions, sans escamoter l'avertissement.
- Retirer du code la condition historique `sourceExplanation` qui supprimait précisément un rappel de divergence pour cet ID ; laisser le rendu de correction normal.
- Maintenir `reviewStatus=transcrit_source` et l'**auto-évaluation non notée**. La fiche reste documentaire : **pas de certification d'une unique réponse SEF 2024**.
- Tests de non-régression ajoutés ; **638 enchères + 188 cartes conservés**.

### Étapes de publication
- CI intégrité / Chromium / WebKit sur le HEAD de cette PR.
- Revue pédagogique informée : **pas de contre-expertise aveugle indépendante** revendiquée.
- Fusion seulement après décision éditoriale expresse.
