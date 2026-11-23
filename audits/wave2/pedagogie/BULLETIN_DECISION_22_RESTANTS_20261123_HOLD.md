# QPJB — Bulletin de décision des 22 dossiers complémentaires (23/11/2026)

**Depuis le 24/11, les 26 autres QCM de la PR #276 ont été partiellement ou entièrement intégrés. Les 22 dossiers de ce bulletin demeurent tous en HOLD ; aucun n'est modifié par ce document.** Le manifeste avant/après est [PACK_VISA_22_RESTANTS_20261123_HOLD.json](./PACK_VISA_22_RESTANTS_20261123_HOLD.json).

## Ce qui est déjà prêt

La [PR #276](https://github.com/CapGui13/QPJB/pull/276) a été **fusionnée le 24/11/2026**, avec **71 champs de texte intégrés sur 26 QCM** et sept motifs historiques conservés. Les **7 workflows étaient verts**.

## A — une question de fond

**SEF-V44-005** : sur 1♣, la main ♠D54 ♥D53 ♦A72 ♣R865 vaut 11 H ; la réponse actuelle est **2SA**. Les deux Dames troisièmes sont des honneurs, mais ne garantissent pas deux arrêts solides. **Décider du critère exact d'arrêt enseigné** avant de conserver la rédaction ou de reconstruire la main ; aucun changement automatique.

## B — onze conventions et cadrages

| QCM | Question précise | Situation |
|---|---|---|
| `SEF-L13-012` | 3♥ cue-bid sur soutien adverse : ♠+♣ | Exemple exact dans le résumé SEF 2024, p. 8 (SEF p. 69) ; corriger le terme réveil |
| `SEF-L14-002` | Relais Multi-Landy 2SA : mineure et mini/maxi | Accord et domaine d'application à confirmer |
| `SEF-L20-002` | 3♠ Splinter après 2♣ FI–2♦–2♥ | Preuves nouvelles retrouvées, visa exact à obtenir |
| `SEF-L27-006` | Rubensohl 3♠ : demande de tenue | Accord et domaine d'application à confirmer |
| `SEF-L01-C-04` | Rubensohl Contre d'appel : seuil et emploi | Accord et domaine d'application à confirmer |
| `SEF-L13-017` | 3♣ après 2♣ FI : 5 cartes / 7 H | Seuil 7 H confirmé dans le résumé SEF 2024, p. 5 (SEF p. 32) |
| `SEF-L10-005` | 2SA naturel après intervention si n°3 passe | Distinction 13–14 HL / mixed raise confirmée dans le résumé SEF 2024, p. 9 |
| `SEF-L13-010` | 1♦–(Contre)–1♠ dès 7 HL | Preuves nouvelles retrouvées, visa exact à obtenir |
| `SEF-L25-004` | Texas contré sans fit : Passe déjà validé 20/11 | Réponse historiquement arbitrée, convention à préciser |
| `SEF-V479-004` | Landy 2SA positif déjà arbitré 05/11 | Réponse historiquement arbitrée, convention à préciser |
| `SEF-C-008` | SEF 1♠–1SA non forcing vs accord forcing | Accord et domaine d'application à confirmer |

## C — dix reformulations restantes

| Groupe | IDs | Ce qui manque |
|---|---|---|
| Seuil QPJB **12 HL sans Walsh** | `SEF-V49-006`, `SEF-V426-002` | Confirmer la règle enseignée avant de reprendre les trois textes |
| Roudi : rôle de l'ouvreur | `SEF-V4-082-1` | Rectification dans la proposition : « redemandé 1SA après la réponse de 1♠ » |
| Drury | `SEF-V4-098-1`, `SEF-V4-102-1`, `SEF-V4-106-1` | Confirmer traitement après Passe initial / ouverture en 3e position |
| Multi-Landy | `SEF-V45-025`, `SEF-V45-027` | Confirmer le Multi-Landy de la paire, sans attribution universelle au SEF |
| Rubensohl | `SEF-V45-032`, `SEF-V45-034` | Confirmer Texas Trèfle et Texas impossible / Stayman |

## L'ordre efficace des arbitrages

**Décider par familles reliées**, car plusieurs des 11 cas B et 10 cas C utilisent le même accord.

| Famille | Cas communs | Question collective |
|---|---|---|
| Drury | 3 cas du lot C | Quel Drury de troisième position, avec quelle réponse sur 2♣ ? |
| Multi-Landy | 2 cas C + `SEF-L14-002` | Quelles interventions et quelles réponses au relais 2SA sont enseignées ? |
| Rubensohl | 2 cas C + `SEF-L27-006` + `SEF-L01-C-04` | Quelle variante de transferts, de contre et de demande d'arrêt est choisie ? |
| Autres séquences SEF | `SEF-L13-012`, `SEF-L20-002`, `SEF-L13-017`, `SEF-L10-005`, `SEF-L13-010`, `SEF-C-008` | La formulation précise est-elle recevable dans sa séquence et son référentiel ? |
| Réponses déjà arbitrées | `SEF-L25-004`, `SEF-V479-004` | Ne pas rouvrir le corrigé déjà accepté, préciser uniquement le contexte conventionnel |

**Comptes : 1 + 11 + 10 = 22 dossiers distincts.** Ils restent tous en HOLD. Aucun changement de réponses, mains, choix, niveaux ou moteur ; pas de publication ni fusion sans validation des textes puis autorisation.

## Contre-expertise documentaire du 24/11 — complément avant visa

Les textes d'origine restent archivés sans modification dans les deux manifestes. Les propositions plus récentes sont isolées dans la [PR #278](https://github.com/CapGui13/QPJB/pull/278). Elles ne sont pas automatiquement approuvées.

- [Résumé SEF 2024, Vincent Romiguière](https://www.clairebridge.com/doc_pedagogiques/sef_2024_vincent.pdf) : p. 1, changement de couleur après intervention à partir de 7 HL ; p. 3, Drury fitté et réponse 2♦ ambiguë avec espoir de manche, 2M arrêt, 3M espoir de chelem ; p. 5, nouvelle couleur naturelle au palier de 3 dès 7 H après 2♣ FI et redemande majeure (la ligne Splinter du résumé vise le palier de 4, ne prouve pas seule 3♠) ; p. 8, exemple exact (1♥)–Passe–(2♥)–3♥ = ♠+♣ ; p. 9, 2SA naturel 13–14 HL si le n°3 passe. Les cas L13-010, L13-012, L10-005 et les principes de Drury ne sont donc pas de simples accords locaux non documentés.
- [iBridge, fiche 61UZ](https://dev.ibridge-club.fr/public/fichedetails/24) : version simple de Rubensohl combinant contre d'appel autour de 8 H, Texas de 2SA à 3♥, Texas impossible Stayman et 3♠ demande de tenue pour jouer 3SA. Cette version est compatible avec les quatre réponses actuelles L27-006, L01-C-04, V45-032, V45-034. Elle permet de recommander 8 H, sans imposer 6 H. [Alençon](https://alenconbridge.club.ffbridge.fr/en-savoir-plus/roudi-rubenshol-112038) enseigne une autre version à 6 H. [Haut Poitou](https://scjc-bridge.fr/le-jeu-du-bridge-comment-jouer/quelques-conventions/le-rubensohl) contient des indications divergentes entre son tableau général et son tableau après 2♥ ; ne pas le présenter comme une doctrine unifiée. Le choix 8 H + 3♠ demande d'arrêt est une recommandation, pas un visa.
- [ABC du bridge, synthèse mineures](https://abc-du-bridge.scenari-community.org/002-03/co/002-03-Synthese.html) : confirme le seuil 13 HL pour annoncer les Carreaux avant la majeure. D'autres présentations divergent ; conserver explicitement le référentiel QPJB sans Walsh plutôt que déclarer toute pratique universelle.
- [Cours ouvertures mineures](https://stph.scenari-community.org/bridge/A2-1/co/A2-1-2-Rep-1TK.html) distingue les honneurs en majeures, tandis que [ABC du bridge](https://abc-du-bridge.scenari-community.org/003-01/co/003-01-02_1.html) parle d'arrêts pour 2SA. D'où maintien du choix doctrinal V44-005, sans transformer Dxx en arrêt garanti.

Les preuves techniques de #278 et les sources ci-dessus ne valent ni autorisation de changer le catalogue, ni suppression d'un HOLD. Les anciens instantanés et leurs tests restent inchangés.
