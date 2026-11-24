# QPJB Training — audit pédagogique des exercices de jeu de la carte
**Date : 29 octobre 2026 — passe 1 (contrôle exhaustif de structure, relecture ciblée avec originaux).**

## Périmètre et méthode
- Point de départ : **114 exercices conservés**, dont **112 proposés** et 2 précédemment mis en quarantaine.
- Audit structurel de **tous les 112 exercices initialement accessibles**, en contrôlant les statuts et les champs nécessaires.
- Parmi ces 112 : **82 QCM**, dont 47 exercices avec deux mains complètes et 35 avec des mains partielles / situations de couleur ; **30 exercices à énoncé et corrigé libre** (23 Bridge & Moi et 7 Bridge Hebdo).
- Contrôles des 82 QCM : existence de l'énoncé et du corrigé, validité de l'index de bonne réponse, absence de propositions strictement dupliquées, cohérence générale entre thème et type, absence de drapeau de quarantaine ancien non traité. Contrôles des 47 mains complètes : 13 cartes par main, aucune répétition de carte dans une main ni entre les deux mains. Contrôle des 24 réponses d'entame : carte choisie présente dans la main du défenseur.
- Résultat des contrôles structuraux : **aucune anomalie nouvelle** dans ces catégories.
- Confrontation directe à des solutions PDF de l'archive intacte `/QPJB Training/Archives/BridgeHebdo_originaux_2026-10-23.zip` pour les dossiers **BH-007, 014, 017, 020, 021, 022, 023, 024, 028, 031, 034, 036, 040 et 041**, couvrant 60 QCM actifs après la quarantaine (dont BH-014 Q02-04). Autres solutions consultées en lecture exploratoire : BH-001, 004, 005, 006, 008, 009, 010, 011, 012, 015, 018, 026, 030, 032, 033, 035, 037, 039, 042 et 043. L'extraction de texte d'un PDF ne vaut pas validation intégrale de ses schémas ni des solutions.
- **Important :** cette passe n'est pas une preuve de validité pédagogique des 111 exercices restants. Le contrôle source détaillé reste à poursuivre pour les 30 exercices libres et les QCM dont l'analyse dépend d'un déroulement exact des levées.

## Anomalie confirmée par comparaison avec le PDF — JC-BH-014-Q01

**Source :** Bridge Hebdo 14, « Jeu à trois couleurs », exercice et solution du 25 février 2022.

- Mort Nord : ♥R ; ♦A743 ; ♣D. Sud : ♥A3 ; ♦R ; ♣AR5.
- Ancienne proposition correcte : « 3♥ vers R♥, puis D♣ et petit ♦ vers R♦ ». Le PDF donne le même ordre et promet de faire toutes les levées.
- **Problème :** après ♥3→♥R puis ♣D (Sud fournit ♣5), le petit ♦ vers le Roi en Sud laisse l'As de ♦ au mort **sans rentrée indiquée**. Si le mort encaisse l'As de ♦ avant le transfert, Sud est obligé de fournir son Roi de ♦ singleton sur cet As. Le dispositif tel que présenté ne décrit pas une ligne faisant séparément les deux honneurs ♦, tout en encaissant ♥R, ♣D et les autres cartes maîtresses. Le contexte ne précise aucune rentrée extérieure.
- **Décision conservatoire :** marquer uniquement l'exercice `a_verifier`, et enregistrer l'objection dans `quarantineReason` ; ne pas corriger arbitrairement la source, ni modifier énoncé/options/corrigé/ID/progression.
- Commit données : `8c070fc7b24335a97dcd359778b74e0ba8f86419` ; nouveau nombre d'exercices disponibles : **111 sur 114**.
- **Réintégration :** reconstruire un plan de jeu intégral tenant compte des rentrées réelles (ou poser une hypothèse supplémentaire explicitement), puis corriger le QCM avec validation pédagogique. Le PDF original ne doit pas être retouché.

## Perte de contexte réparée — JC-BH-042-Q01

**Source :** Bridge Hebdo 42, « Plan de jeu et réponses au contre d'appel », solution du 16 décembre 2022.
- La situation d'origine précise l'ouverture de **1♠ par Est**, suivie de **1SA par Sud**, puis **3SA par Nord**, avant l'entame du 2♠.
- La version QCM posait seulement « Où chercher les deux levées manquantes ? », sans ce renseignement. Or, dans la source, l'ouverture d'Est justifie l'hypothèse que **l'As de Cœur est en Est**, utile pour privilégier les impasses à Cœur.
- **Correction apportée :** restitution de la séquence d'enchères dans `prompt`, et annotation `pedagogicalRevision`. Mains, quatre options, `answerIndex`, explication, identifiant et progression inchangés.
- Commit données : `e4ae9f08deff567e5a9fad63966423202aff3590`.

## Vérifications négatives utiles

- **JC-BH-031-Q01–Q04 :** les décisions « couvrir / ne pas couvrir » et la promotion possible du 9 du partenaire sont explicitement présentes dans la solution originale BH-031. Les quatre mains complètes du QCM correspondent à la source ; **aucune modification**.
- **JC-BH-024-Q01–Q04 :** les traitements de l'As ou du Roi courts à Trèfle, en circulant librement entre les deux mains, recoupent la source BH-024 ; **aucune modification**.
- **BH-007, 017, 020, 021, 022, 023, 028, 034, 036, 040, 041 :** les choix de principe contrôlés recoupent les réponses des originaux. Il ne faut pas confondre une règle de cours et une démonstration mathématique de toutes les répartitions possibles.
- Deux autres QCM déjà en quarantaine conservent leur statut : `JC-BH-028-Q04` (carte du mort non spécifiée) et `JC-BH-036-Q02` (deux réponses compatibles). Voir `QPJB_QCM_AMBIGUS_AUDIT_2026-10-29.md`.
- **JC-023** possède une note de vérification indépendante en attente, mais **aucune erreur n'a été démontrée** ; son statut initial est conservé. Ne pas assimiler toute note de suivi à une preuve de faute.

## État final et non-régression

- **114 exercices préservés : 111 disponibles, 3 en quarantaine.**
- **81 QCM disponibles + 30 exercices à réponse libre.**
- Les fichiers PDF originaux, tous les identifiants et les données de progression `localStorage` sont inchangés ; seuls les champs de validation de BH-014 Q01, le contexte d'enchères BH-042 Q01, les tests et les versions anti-cache ont été modifiés.
- Le test statique et le parcours simulé Chromium + WebKit vérifient le filtrage et la navigation ; dernier résultat de CI à inscrire au point de reprise EXPRESS après confirmation.
- Les fichiers source de données et l'application restent sur la branche `main` du dépôt `CapGui13/QPJB`.

## Suite de l'audit

1. Vérifier en priorité, **PDF en main**, les 30 exercices libres (en commençant par les 22 `a_relire`) ; confirmer les places du mort/déclarant/défense et les plans complets avant de modifier leur contenu.
2. Pour les autres QCM, rechercher les **séquences d'enchères, cartes jouées par le mort et hypothèses de communication perdues à la transcription** ; ne pas modifier un corrigé simplement parce que la stratégie paraît contre-intuitive.
3. Ne réintégrer les trois QCM exclus qu'après une solution unique démontrable ; à chaque correction, tester la cohérence des cartes, les distracteurs, la navigation, le cache et la sauvegarde des progrès.

**Principe :** conserver la traçabilité, séparer les incertitudes des erreurs établies et ne pas réécrire massivement les sources.
