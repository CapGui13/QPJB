# Reprise 6 A — M1

Branche : `coherence-concrete/reprise6-a-m1` ; base figée `13966e475cf986c6f76e7faf870377fdf4ef99aa`.
Contrat #506, mission #507. État : démarrage, HOLD tant que les gains ne sont pas prouvés.
Périmètre exclusif : nouveaux fichiers A ; aucun changement de production existant.
Tests : aucun exécuté à ce stade. PR : à ouvrir vers coordination-generale.
Prochain geste : lire REPRISE-PASSE-5, #419 et portions M1, identifier le point de sélection et le banc apparié.

## Jalon 1 — 90 séances natives, 270 séances appariées
- SHA mesure native `f4a0d87160247a700008da795ec64f5487ca9c9e`, résultats `native-s1-s5.json` : 1915 QCM, 18 trajectoires M6, 90 séances. S3 : 34 ouvertures 2SA, 25 soutiens majeurs (concept, pas décision effective) ; S4 : 58 seuils 1SA, 32 soutiens mineurs ; S5 : 63 redemande, 38 Stayman/Texas.
- SHA variantes `4a60b94c0ff67bb5a378843fe7896a744b4b1181`, traces `early-paired.json` au commit `a5b8a8eb88592c61af329965bf58f1ce5fcf7a08`. Exécution réelle V8 des sources figées avec catalogue extrait du blob, modèle M6 natif, durable inactif avant S21 (module omis), 18 × 3 bras × 5 séances. 270 reprises après première réponse, zéro violation structurelle M6 ; zéro substitution dans chaque variante. Rejet de ces deux variantes neutres. Pas de CI, pas de test D, pas de S6–180 ni navigateur à ce stade.
- Cause possible : ordre d'arrivée des créneaux libres, classification et contraintes du rang. Prochain geste : instrumenter les créneaux natifs, mesurer les candidats réellement disponibles et tester une politique de composition au niveau du choix de catégories sans lever aucune garde.

## Jalon 2 — décisions natives et effet de compensation
- `native-slot-diagnostics.json` (commit aee2d629147b55a6c2a9c0c9508c3da68af394f9) : S3, 71 créneaux découverte, 47 alternatives de même niveau pour 60 choix hors cible, 24 sortants déjà représentés. S4 3 alternatives de même niveau, aucune redondance du sortant ; S5 18, aucune redondance. Rappels et transferts protégés.
- Variante anticipée (cc4216c) : journal de confirmation `early-window-confirmation.json` (e70d553), trois substitutions internes SEF-004-1 → SEF-V49-010, mais les IDs sortants reviennent ensuite : zéro gain de composition, ordre seulement. Rejet ; `early-window-m6-s20.json` est une exécution antérieure dont les événements internes n'ont pas été retrouvés ; la confirmation prévaut pour l'observation du hook. Les deux concordent sur zéro deck modifié.
- `balance-m6-s20.json` (8601a5e), blob candidat 8209abbce3500b0be96f53595486e9744206d544, 1080 séances réelles V8 M6 S1–20 (durable inactif), 0 violation structurelle, 0 revue M6. Balance : 3/18 S3 changées, 36 decks changés au total ; aucune amélioration conceptuelle dans l'exemple autonome (même concept 2SA). Contrast-balance : 6/18 S3 changées, 72 decks jusqu'à S20, mais exemple autonome : ajout d'un Passe avec fit contre une troisième ouverture 2SA et perte d'autres notions. Ne pas activer. Les seuils de M6 seuls ne suffisent pas.
- Nouveau candidat `saturation` au SHA 88722ddca54488e9ec98bbaa15bddefc98d65e77 : coût souple croissant, même créneau découverte et garde native ; résultat non mesuré à ce stade.
- Banc complet `tests/coherence-reprise6-a-campaign.cjs` au commit 09e137d311f1c03dcb8606f55b9a6ec5d4d3c6a0 : M6 et D d'origine, référence historique, full-order intégré, contrôles et reprise. Pas encore exécuté. Impossible de joindre GitHub par git dans le conteneur local (DNS). Tentative CI dans branche technique strictement isolée sans fusion, conformément au contrat. Prochain geste : lancer le banc, vérifier les jobs et agréger les 18 résultats, puis décider HOLD/GO.
