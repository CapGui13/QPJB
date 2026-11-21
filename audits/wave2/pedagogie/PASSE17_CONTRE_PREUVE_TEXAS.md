# QPJB — M1 / Passe 17 : contre-preuve sur Texas contré et accord d'enseignement

**PASSE 17 FINIE (recherche contradictoire). MISSION DÉFINITIVEMENT TERMINÉE : NON. PR #261 BROUILLON / HOLD.**

## Pourquoi une contre-épreuve supplémentaire ?
La passe 15 avait trouvé une source iBridge dans laquelle **Passe = non fitté et sans arrêt Carreau**. La main réelle de `SEF-L25-004` est **♠A963 ♥R8 ♦AD84 ♣R107** : deux atouts Cœur et **un arrêt solide Carreau**. La règle iBridge ne certifie donc pas, seule, la réponse **Passe** affichée. Il était essentiel de rechercher **d'autres formulations précises de la même séquence**, plutôt que de laisser penser à une erreur QCM avérée.

## Contradiction documentée, non nivelée
1. [iBridge — L'ouvreur de 1SA après le contre du Texas](https://dev.ibridge-club.fr/public/fichedetails/622) : `Passe` = pas de fit **et pas d'arrêt de la couleur contrée**. Cette définition n'est pas satisfaite par ♦AD84.
2. [Bridge Saint-Cloud — La couleur utilisée pour le Texas est contrée](https://www.bridgesaintcloud.fr/espoir1_5.html) : sur **1SA–2♦(Texas Cœur)–X**, le cours dit qu'avec tenue ♦ et fit ♥ on annonce 2♥, **sans fit il faudrait passer**. La phrase ne soumet pas Passe à l'absence d'arrêt ♦ ; elle rend donc **Passe cohérent sous cet accord** avec deux Cœurs et ♦AD84.
3. [Club affilié FFB, compilation Bessis/Lévy](https://bridgesarzeau.club.ffbridge.fr/document-download/6a15fbf3174f1_contrestayman.pdf) : sur la même séquence, 2♥ libre promet **trois Cœurs ET arrêt Carreau**, 3♥ promet quatre Cœurs et arrêt, et Surcontre promet **trois Cœurs sans arrêt**. Avec deux Cœurs, le QCM n'a ni rectification libre ni surcontre. **Ce document ne donne pas de définition explicite de Passe sur 2♦ contré : ne pas lui faire dire davantage.**

## Deux politiques conventionnelles simulées
| Politique | Conditions pour Passe | Cette main | Conclusion |
|---|---|---|---|
| Absence de fit prioritaire | Moins de trois Cœurs, quel que soit l'arrêt ♦ | 2 ♥, arrêt ♦ | **Passe cohérent** |
| Absence de fit et d'arrêt exigée | Moins de trois Cœurs **et** aucun arrêt ♦ | 2 ♥, arrêt ♦ | **Cas non défini par cette seule règle** ; accord complémentaire nécessaire |

**Décision de M1 :** le fait de disposer d'un arrêt ♦ ne rend pas le corrigé **Passe** automatiquement faux. La réponse est justifiable sous la règle « pas de fit → Passe », mais un système plus exigeant peut nécessiter un autre traitement. **Ne pas modifier la bonne réponse, ne pas publier.** Inviter le référent pédagogique à préciser dans l'énoncé quel accord est enseigné.

## Livrables et garde-fous
`TEXAS_CONTRADICTOIRE_P17_HOLD.json` garde les trois références, leurs conditions exactes et l'évaluation du cas. `tests/wave2-pedagogie-texas-accords.cjs` recalcule la main, vérifie les conditions d'accord, refuse la conversion d'un cas non défini en une « faute » et vérifie le maintien HOLD. La suite `tests/wave2-pedagogie-suite.cjs` inclut maintenant **12 tests**.

**PROCHAINE PASSE : P18 — vérifier les tests en environnement Node réellement disponible / recueillir les décisions sur les six textes et les onze accords ; si elles manquent, établir un nouveau checkpoint vérifié sans affirmer mission terminée.**
