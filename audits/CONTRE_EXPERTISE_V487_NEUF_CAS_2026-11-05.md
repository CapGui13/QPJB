# QPJB — Contre-expertise des 9 cas en attente (V4.87)

**5 novembre 2026** · **Périmètre exclusif :** Quiz SEF, `quizz.html` · **Source :** V4.86 (1 216 QCM).

## Décision

Sur les neuf candidats différés, **sept sont retenus** avec correction éditoriale des énoncés et justifications ; **deux sont écartés** pour défaut de réponse unique dans la main proposée. Il ne s'agit pas de créer un QCM de simple reconnaissance des conventions : chaque main doit conduire à une enchère raisonnablement unique dans le SEF 2024.

| ID initial | Décision | QCM | Motif essentiel |
|---|---|---|---|
| `INSTANCE-B-05` | **Écarté** | `—` | 1♠–2SA fitté : 3♦ ? |
| `INST-C-004` | **Retenu** | `SEF-V487-001` | Cue-bid à saut après nouvelle couleur du n°3 |
| `INST-C-005` | **Retenu** | `SEF-V487-002` | Cue-bid simple de l’ouverture |
| `INSTANCE-D-03` | **Écarté** | `—` | Surcontre après contre bicolore de 1SA |
| `INST-E-04` | **Retenu** | `SEF-V487-003` | 4SA quantitatif après 2♣–2♦–2SA |
| `INST-E-05` | **Retenu** | `SEF-V487-004` | Soutien économique 3♠, intérêt pour chelem |
| `INST-E-06` | **Retenu** | `SEF-V487-005` | Passe après unicolore mineur très fort |
| `INSTANCE-F-03` | **Retenu** | `SEF-V487-006` | Répétition artificielle de la quatrième couleur |
| `INSTANCE-F-04` | **Retenu** | `SEF-V487-007` | Soutien différé forcing, recherche chelem |

### Analyses ciblées

**INSTANCE-B-05 — Écarté.** Main de 12 H, 5♠-4♦, singleton ♥ : la source Chailley cite une main très voisine pour laquelle 4♠ prime sur 3♦ ; 3♠ (min), 3♦ (recherche d’un complément), ou 4♠ (distribution) sont trop dépendants du jugement pour imposer 3♦.

**INST-C-004 — Retenu.** Le SEF 2024 montre expressément 3♣ sur 1♣-(1♥)-1♠-? comme soutien fort de quatre Cœurs ; main de 12 H, au-dessus du mixed raise de 7–9 H.

**INST-C-005 — Retenu.** L’exemple du SEF 2024 conserve 2♣ avec trois cartes de Cœur. Notre main (14 H, 3♥) entre dans ce cas et se distingue du 2SA à quatre atouts et 7–9 H.

**INSTANCE-D-03 — Écarté.** Le sens conventionnel du surcontre est établi (volonté punitive), mais avec 10 H et 25–27 H dans la ligne, la recherche de 3SA est raisonnable. La question ne propose même pas 3SA : elle vérifie un mot-clé, pas la meilleure décision.

**INST-E-04 — Retenu.** La source Sarzeau indique explicitement 4SA quantitatif avec 10 HL réguliers. Ici 10 H, forme 3-3-4-3, donc 10 HL et 32–33 H dans la ligne.

**INST-E-05 — Retenu.** La source Sarzeau précise que le soutien sous le palier de la manche après 2♣–2♦–2♠ indique un espoir de chelem. Trois atouts et 11 H riches en contrôles permettent 3♠.

**INST-E-06 — Retenu.** Une redemande 3♣ signale une mineure très solide et environ neuf levées de jeu, pas nécessairement onze. Avec 0 H et aucun complément, rester à 3♣ est rationnel. Question fondée sur la portée non forcing de la séquence.

**INSTANCE-F-03 — Retenu.** Votre Bridge Hebdo du 10 mai 2024 fournit littéralement l’instruction de répéter les Trèfles après 2♥ avec quatre Cœurs et sans tenue Trèfle, pour demander l’arrêt.

**INSTANCE-F-04 — Retenu.** Votre Bridge Hebdo du 17 mai 2024 précise que, lorsque le soutien direct serait limitatif, une quatrième couleur forcing puis un soutien au palier de 3 expriment un fort jeu. Ici cinq Cœurs et 17 H avec un singleton rendent 3♥ descriptif.

## Sources documentaires vérifiées

- Vincent Romiguière, *Les nouveautés du SEF 2024*, pp. 8-9 : réponses à l'intervention quand le n°3 parle, distinctions cue-bid simple, cue-bid à saut et mixed raise : https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf
- Jean-Paul Chailley, *Après le 2SA fitté* (révisé SEF 2024), p. 1 : 3♦ descriptif parfois, mais décision immédiate 4♠ majoritaire si la force et le fit suffisent : https://www.bridge-chailley.fr/wp-content/uploads/2025/01/E2043-Apres-2SA-fitte-corr-1.pdf
- Présentation Comité de l’Adour, SEF 2024, ch. 4 et 10 : surcontre de volonté punitive et mixed raise : https://as-de-luz.club.ffbridge.fr/documents/sef-2024-changements-383870
- Sarzeau, *2♣ fort indéterminé*, p. 3-6 : 4SA quantitatif avec 10 HL, soutien majeur au palier de 3, mineure 7e forte : https://bridgesarzeau.club.ffbridge.fr/document-download/63754288dc0d0_2Tfortindetermine.pdf
- *Votre Bridge Hebdo* (FFB), 10 et 17 mai 2024 : 4CF répétée et soutien différé forcing : https://bridgesarzeau.club.ffbridge.fr/document-download/664f842f41e98_4ForcingBridgeHebdo.pdf
- Alain Lévy, cours quatrième couleur forcing : https://www.clairebridge.com/doc_pedagogiques/4cf.pdf

La vérification porte sur les supports SEF 2024 et pédagogiques concordants ; elle ne prétend pas à une lecture littérale de tous les paragraphes du manuel imprimé.

## Précautions techniques

- Publier seulement les sept QCM `SEF-V487-001` à `SEF-V487-007`.
- Protéger les **1 216 objets historiques** par l'empreinte Git blob du JSON sérialisé, et conserver les 22 rubriques intactes.
- Contrôler 13 cartes, les points H et la distribution dans chaque main, quatre enchères distinctes et ordonnées économiquement, explication uniquement de la bonne réponse.
- Corriger l'ancien test V4.86 pour qu'il accepte les extensions append-only, comme réalisé pour V4.85.
- Intégration sur branche spécifique, tests Audit / Chromium / WebKit, PR et publication GitHub Pages seulement si ces validations réussissent.
- Ne pas toucher au module `/entrainement/`, aux exercices PBN ni aux autres chantiers QPJB.