# QPJB — V4.72 — Six décisions compétitives, sans quota
4 novembre 2026 · Branche isolée · Version de référence main : 1010 QCM

## Méthode et résultat
La lecture du JSON embarqué des 1010 fiches montre une seule situation après ouverture mineure contrée (SEF-V424-007, Surcontre), et les cinq redemandes libres V4.71 couvrent Passe, 1SA, 2♥ à quatre cartes, 2♦, 2SA, mais pas le Contre de soutien avec trois cartes à ♥. Aucune des 1010 fiches n'illustre le Surcontre de soutien de l'ouvreur après une réponse à 1♠ et un Contre adverse.

Priorité à la distinction de **six décisions**, pas à un nombre cible d'exercices :
1. 1♦–(Contre)–2SA : Truscott mineur, cinq Carreaux et force constructive (9 H).
2. 1♦–(Contre)–3♦ : soutien à saut de barrage, six Carreaux et seulement 4 H.
3. 1♣–(Contre)–2♣ : soutien simple (8 H, cinq Trèfles) plutôt qu'un Truscott constructif.
4. 1♣–(Contre)–Surcontre : 12 H sans majeure quatrième et sans les cinq atouts nécessaires au Truscott.
5. 1♦–Passe–1♥–(1♠)–Contre : l'ouvreur révèle exactement trois Cœurs, par contraste avec les quatre nécessaires au soutien direct à 2♥ (V4.71-003).
6. 1♥–Passe–1♠–(Contre)–Surcontre : **surcontre de soutien par l'ouvreur** avec trois Piques, distinct du surcontre du répondant après 1♥–(Contre) (V4.70-006).

## Six mains, vérification et distracteurs
| ID | Main ♠ / ♥ / ♦ / ♣ | H | Réponse | Autres réponses évaluées | Difficulté |
|---|---|---:|---|---|---:|
| V472-001 | A7 / R84 / D10863 / 954 | 9 | 2SA | 2♦, 3♦, Surcontre | 3 |
| V472-002 | 873 / V65 / R109864 / 2 | 4 | 3♦ | Passe, 2♦, 4♦ | 3 |
| V472-003 | V86 / D75 / V4 / A9763 | 8 | 2♣ | Passe, 2SA, 3♣ | 3 |
| V472-004 | A85 / R73 / DV4 / D962 | 12 | Surcontre | 1SA, 2♣, 2SA | 3 |
| V472-005 | 86 / AD8 / AR1043 / 852 | 13 | Contre | Passe, 1SA, 2♥ | 4 |
| V472-006 | AD5 / AR1084 / 92 / 753 | 13 | Surcontre | Passe, 2♥, 2♠ | 4 |

### Contrôle individuel des 18 distracteurs
- **001 — 2♦** décrit un simple soutien sans annoncer l'initiative constructive ; **3♦** est un barrage inadapté à 9 H ; **Surcontre** ne décrit pas les cinq atouts et manque le Truscott.
- **002 — Passe** masque six cartes de soutien ; **2♦** est trop peu gênant avec le sixième Carreau et un singleton ; **4♦** élève au-delà des neuf atouts normalement escomptés à ce stade.
- **003 — Passe** ignore cinq atouts et 8 H ; **2SA** exige ici une force constructive supérieure (9 H ou plus) ; **3♣** déforme le soutien faible en barrage.
- **004 — 1SA** sous-décrit les 12 H ; **2♣** ne montre pas la force ; **2SA** exige cinq Trèfles, absents.
- **005 — Passe** dissimule trois Cœurs utiles ; **1SA** promet normalement l'arrêt Pique en redemande libre, inexistant ; **2♥** montrerait quatre Cœurs, pas trois.
- **006 — Passe** dissimule trois Piques et une bonne ouverture ; **2♥** répéterait une couleur cinquième, sans la précision du fit ; **2♠** ne distingue pas les trois cartes de soutien aussi clairement que le Surcontre de soutien.

## Références pédagogiques / points de vigilance
- **SEF 2024, ouverture mineure après Contre :** [Bridge Club du Haut Poitou](https://scjc-bridge.fr/sef-2024) mentionne 2SA Truscott à partir de 9 H et cinq atouts, ainsi que le soutien à saut devenu barrage.
- **Après Contre, choix de force / 2SA :** [iBridge fiche 102](https://www.ibridge.fr/public/fichedetails/102) distingue Surcontre, Truscott, soutien et changement de couleur.
- **Contre / surcontre de soutien de l'ouvreur :** [iBridge fiche 418](https://dev.ibridge-club.fr/public/fichedetails/418) fournit les deux séquences de référence ; [iBridge fiche 188](https://dev.ibridge-club.fr/public/fichedetails/188) détaille la notion de trois atouts.

**Réserve de méthode :** la convention de soutien doit rester cohérente avec la référence pédagogique SEF adoptée. La contre-expertise et les tests CI ne remplacent pas une homologation fédérale. Une vulnérabilité particulière n'est pas nécessaire pour fixer la règle mise à l'épreuve dans ces mains ; aucun raisonnement de sacrifice limite n'est demandé.

## Sécurité
- Empreinte SHA-1 Git blob des 1010 objets antérieurs : `2a50b519fa1f0be0345aa66bbbcd00a8ca7f2f90`.
- Les 1010 premiers objets doivent rester **strictement inchangés**, dans leur ordre historique.
- Aucun fichier Entraînement, aucun contenu PBN, aucun choix de navigation n'est à modifier.
- Mise en brouillon, sans fusion ni publication tant que **audit + Chromium + WebKit** sur le dernier commit ne sont pas tous verts et que les mains ne passent pas les revues.
