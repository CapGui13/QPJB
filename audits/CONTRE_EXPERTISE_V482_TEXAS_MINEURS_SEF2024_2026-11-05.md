# QPJB V4.82 — Contre-expertise des Texas mineurs (SEF 2024)

**Date : 5 novembre 2026.** Dépôt `CapGui13/QPJB`, branche `quiz-v482-texas-mineurs-sef2024`. Périmètre : **le Quiz SEF `quizz.html` exclusivement**, pas `/entrainement/`.

## Lacune pédagogique réellement repérée

La base V4.81 contenait 1 135 QCM et 22 rubriques, mais aucun scénario enseigné sur les Texas mineurs **sans intervention adverse** après l'ouverture de 1SA. Les questions de transfert en Rubensohl ne remplissaient pas cette fonction : elles supposent une intervention et obéissent à une séquence différente.

Cette passe crée **10 QCM** complémentaires, et non un quota arbitraire :

- 2 choix initiaux : **2♠ Texas Trèfle** et **3♣ Texas Carreau** sur 1SA sans intervention ;
- 2 fins de séquence : **Passe** après rectification du Texas avec main faible ;
- 6 décisions de manche avec mineure sixième : **3♥ courte à Cœur, 3♠ courte à Pique, 3SA courte dans l'autre mineure**, dans chacune des deux longues mineures.

Les six derniers cas sont choisis pour distinguer la couleur de la courte, **et non pour faire simplement reconnaître la longueur de la mineure**. Le cas 004 prouve qu'un singleton ne suffit pas à parler de manche si la force manque.

## Références utilisées

- [Vincent Romiguière, *Les nouveautés du SEF 2024*, chapitre 4, p. 5](https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf) : depuis 2024, 3♥/3♠ annonce la courte dans la majeure nommée ; 3SA reste une courte dans l'autre mineure.
- [Bridge SEF, *Les choix après l'ouverture de 1SA*](https://bridgesef.fr/wp-content/uploads/2025/04/Ouverture-1SA.pdf) : Texas 2♠ pour ♣, 3♣ pour ♦ ; rectifications et courtes.
- [Bridge Club du Haut Poitou, *SEF 2024*](https://scjc-bridge.fr/sef-2024) : confirmation des courtes en majeure annoncées naturellement, de 3SA dans l'autre mineure.

Ces conventions sont présentées directement à l'élève dans le cadre du SEF de l'application, sans demander d'accord de paire ni introduire de variante concurrente.

## Vérification des mains et décisions

Ordre des mains : **♠ / ♥ / ♦ / ♣**. Chaque main a exactement 13 cartes, avec 0 doublon d'un même rang dans sa couleur ; les points d'honneurs ont été recalculés indépendamment de la valeur affichée.

| ID | Rubrique | Main | H | Forme | Bonne réponse | Trois autres propositions |
|---|---|---|---:|---|---|---|
| SEF-V482-001 | sa | ♠962 / ♥108 / ♦74 / ♣RV10985 | 4 | 3–2–2–6 | **2♠** | 2♣ ; 2♦ ; 3♣ |
| SEF-V482-002 | sa | ♠873 / ♥V94 / ♦D109876 / ♣4 | 3 | 3–3–6–1 | **3♣** | 2♣ ; 2♦ ; 2♠ |
| SEF-V482-003 | stayman | ♠V95 / ♥107 / ♦84 / ♣D109876 | 3 | 3–2–2–6 | **Passe** | 3♦ ; 3♥ ; 3SA |
| SEF-V482-004 | stayman | ♠1093 / ♥V85 / ♦R109764 / ♣8 | 4 | 3–3–6–1 | **Passe** | 3♥ ; 3♠ ; 3SA |
| SEF-V482-005 | stayman | ♠D107 / ♥6 / ♦R92 / ♣ADV1085 | 12 | 3–1–3–6 | **3♥** | 3♠ ; 3SA ; 4♣ |
| SEF-V482-006 | stayman | ♠8 / ♥R93 / ♦A105 / ♣RD10974 | 12 | 1–3–3–6 | **3♠** | 3♥ ; 3SA ; 4♣ |
| SEF-V482-007 | stayman | ♠R92 / ♥D108 / ♦5 / ♣AV10987 | 10 | 3–3–1–6 | **3SA** | 3♥ ; 3♠ ; 4♣ |
| SEF-V482-008 | stayman | ♠R106 / ♥3 / ♦ADV1085 / ♣962 | 10 | 3–1–6–3 | **3♥** | 3♠ ; 3SA ; 4♦ |
| SEF-V482-009 | stayman | ♠7 / ♥A94 / ♦RD10985 / ♣V62 | 10 | 1–3–6–3 | **3♠** | 3♥ ; 3SA ; 4♦ |
| SEF-V482-010 | stayman | ♠D108 / ♥R93 / ♦AV10985 / ♣2 | 10 | 3–3–6–1 | **3SA** | 3♥ ; 3♠ ; 4♦ |

## Analyse individuelle des 30 distracteurs

- **SEF-V482-001 → 2♠** : 2♣ serait le Stayman sans majeure quatrième ; 2♦ transférerait aux Cœurs alors qu'il n'y en a que deux ; 3♣ demanderait les Carreaux au lieu des Trèfles.
- **SEF-V482-002 → 3♣** : 2♣ chercherait une majeure quatrième absente ; 2♦ transférerait aux Cœurs avec seulement trois cartes ; 2♠ viserait les Trèfles alors que les six cartes sont à Carreau.
- **SEF-V482-003 → Passe** : 3♦ poursuivrait artificiellement sans objectif de manche ; 3♥ prétendrait montrer une courte à Cœur alors qu'il y en a deux ; 3SA annoncerait une courte dans l'autre mineure et une force de manche absentes.
- **SEF-V482-004 → Passe** : 3♥ décrirait un singleton Cœur inexistant ; 3♠ un singleton Pique inexistant ; 3SA décrirait certes le singleton Trèfle réel, mais exige la force de manche que quatre H ne procurent pas.
- **SEF-V482-005 → 3♥** : 3♠ désignerait à tort une courte Pique ; 3SA désignerait à tort une courte Carreau ; 4♣ ne donnerait pas le renseignement prioritaire du singleton Cœur.
- **SEF-V482-006 → 3♠** : 3♥ montrerait une courte Cœur inexistante ; 3SA annoncerait une courte Carreau inexistante ; 4♣ manquerait la description du singleton Pique.
- **SEF-V482-007 → 3SA** : 3♥ annoncerait une courte Cœur inexistante ; 3♠ annoncerait une courte Pique inexistante ; 4♣ masquerait la courte Carreau réellement détenue.
- **SEF-V482-008 → 3♥** : 3♠ décrirait une courte Pique inexistante ; 3SA décrirait une courte Trèfle inexistante ; 4♦ n'annoncerait pas directement la courte à Cœur.
- **SEF-V482-009 → 3♠** : 3♥ décrirait une courte Cœur inexistante ; 3SA décrirait une courte Trèfle inexistante ; 4♦ dissimulerait le singleton Pique.
- **SEF-V482-010 → 3SA** : 3♥ annoncerait un singleton Cœur inexistant ; 3♠ un singleton Pique inexistant ; 4♦ n'indiquerait pas la courte Trèfle.

Le Quiz ne montre à l'élève que la **justification de la bonne réponse**. Les motifs de rejet des distracteurs restent dans le présent document d'audit.

## Verrous de non-régression et validation

1. **1 135 QCM antérieurs intacts**, ordre et JSON des objets inchangés, contrôlés par SHA-1 Git Blob via `tests/quizz-baseline-1135-gitsha.json` et `tests/quizz-v482-regression.cjs`.
2. 13 cartes et H recomptés ; 4 propositions distinctes ; enchères licites et classées par cherté, Passe seulement quand le transfert a été rectifié.
3. Contrôle des six courtes réellement présentes : singleton ♥ (005,008), ♠ (006,009), ♦ (007), ♣ (010).
4. Protection de la logique faible : les cas 003 et 004 se terminent à Passe, **y compris quand le cas 004 possède un singleton dans l'autre mineure**.
5. 22 rubriques conservées. Aucune modification des 677 exercices d'Entraînement, des PDF, des PBN, ou de la navigation.
6. Publication conditionnée aux contrôles CI sur le dernier commit de la PR (**Audit, Chromium, WebKit**), puis à une validation de `main` et de GitHub Pages.

**Limite :** ce contrôle documente individuellement les 10 nouveaux scénarios et protège techniquement le passé ; il ne prétend pas certifier de nouveau les réponses des 1 135 QCM historiques. Les 10 nouveaux cas doivent rester isolés sur leur branche si une contre-expertise ou CI soulève une réserve.
