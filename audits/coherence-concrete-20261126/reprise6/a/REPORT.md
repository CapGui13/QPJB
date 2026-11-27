# Recette longitudinale — décision HOLD
Base figée 13966e475cf986c6f76e7faf870377fdf4ef99aa. Candidat saturation, blob d0ce5278788fdea0c7b36d390c09300023a9cc8f.
[CI 46016879994](https://github.com/CapGui13/QPJB/actions/runs/46016879994), SHA technique 3452811df40bc3f1155d909bce809e332a1b6001 : 18/18 jobs réussis, 18 artefacts téléchargés et dépouillés. 6 profils × 3 graines × 180 séances × 5 bras (3 M6, 2 D), soit 16 200 decks simulés. Les traces et fiches détaillées sont dans les artefacts CI; leur conservation dépend de GitHub. Les résultats courts sont versionnés dans ce dossier.

## Comparaisons candidat/natif
Colonnes : decks M6 modifiés, alertes strictes M6, review M6, decks D modifiés, régressions D hors latence, violations de seuils D (recalcul sur les checkpoints des 18 summaries avec les directions et seuils originaux).

| Profil | Graine | M6 decks | M6 strict | Review | D decks | D régressions | D seuils |
|---|---:|---:|---:|---:|---:|---:|---:|
| aide | 11 |0|0|0|0|0|0|
| aide |47|0|0|0|0|0|0|
| aide |103|0|0|0|0|0|0|
| autonome |11|60|8|0|60|6|4|
| autonome |47|60|8|0|60|6|4|
| autonome |103|60|8|0|60|6|4|
| cible |11|0|0|0|0|0|0|
| cible |47|0|0|0|144|27|10|
| cible |103|94|24|1|0|0|0|
| faible |11|0|0|0|0|0|0|
| faible |47|0|0|0|0|0|0|
| faible |103|0|0|0|0|0|0|
| intermediaire |11|0|0|0|0|0|0|
| intermediaire |47|0|0|0|0|0|0|
| intermediaire |103|178|45|0|0|0|0|
| passe |11|0|0|0|0|0|0|
| passe |47|0|0|0|175|33|20|
| passe |103|122|22|2|174|32|12|
| Total | |574|115|3|673|110|54|

360 reprises testées et 71 sondes de consolidation sur état cloné dans le bras candidat M6. Zéro review historique M6; cela ne neutralise pas les régressions contre le natif actuel. D : aucun gain précoce selon les trois critères originaux à S5; au moins une amélioration individuelle de dette à S180, mais dette totale S180 228622 → 233861, familles 25806 → 25796. D gate HOLD. Les 54 alertes ne sont pas un nombre de trajectoires distinctes. Les alertes M6 et D ne doivent pas être additionnées comme des anomalies indépendantes.

## Gain réel et contre-exemples
- Autonome 11/47/103 : en S3 les deux modèles passent de zéro à un Passe avec fit, conservent le soutien, les six concepts et le nombre d'ouvertures 2SA. Exemple autonome 11 : SEF-N081-1 remplacé par SEF-030-1, soutien SEF-V49-010 conservé dans la recette courte. Mais dette majeur.soutien S153 384 → 429, dette ouv.passe S180 4991 → 5466 (D).
- Intermediaire 103 : M6 ajoute le Passe avec fit, conserve les cinq concepts, mais S5 perd la preuve majeur.base et l'écart terminal augmente de 0 à 2. D inchangé.
- Passe 103 : les deux modèles ajoutent le Passe avec fit et conservent les six concepts; M6 dette ouv.passe S153 14 → 16, D écart terminal ouv.mineure S20 1 → 5.
- Cible 103 (M6) et cible 47 / passe 47 (D) gagnent aussi le contraste. Au total six trajectoires M6 et six D gagnent ce contraste à S3. Aucun de ces résultats ne constitue une validation globale.
- S4 et S5 : diagnostic natif livré; pas de substitution structurelle validée. S1–2 : pas d'intervention directe. Les changements ultérieurs sont une conséquence de l'état pédagogique et non une intervention de la politique après S3.

## Raccordement expérimental, interdit en production tant que HOLD
Le coordinateur peut injecter le résultat de make("saturation") de quizz-coherence-reprise6-a-composition.js dans le hook coherenceM1, en conservant le plan historique pour les sessions que le plan expérimental ne couvre pas. Aucun changement de prérequis, de correction, de rappel ni d'ordre explicite. Le classement reste borné aux candidats natifs et n'impose aucun quota. Ne pas activer automatiquement et ne pas fusionner ce candidat comme amélioration. Une future solution doit découpler le gain S3 de la propagation des changements sur la dette et les preuves, puis refaire le même protocole sans relâcher les seuils.

## Limites / reproductibilité
Test de contrat exécuté en V8 : PASS. Campagne Node22 exécutée réellement sur GitHub Actions (branche technique isolée, pas de fusion). Le gate D a été recalculé localement à partir des 18 résumés selon les directions originales; le script d'agrégation versionné n'a pas été exécuté directement dans cette recette. Les consolidations sont des sondes sur clones, pas une campagne intercalée complète. Les suites historiques navigateur/UI/cache/quiz libre ne sont pas réexécutées par cette CI spécialisée. Aucun GO pédagogique, aucune activation, aucune publication. Les analyses de S4–5 restent sans gain validé. Mission non définitivement terminée au sens d'une progression validée de bout en bout.
