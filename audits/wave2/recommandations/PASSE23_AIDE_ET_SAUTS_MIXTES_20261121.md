# LONG M4 — Passe 23 : aide et sauts mélangés

**PASSE 23 FINIE — MISSION DÉFINITIVEMENT TERMINÉE : NON.**

Le vrai moteur V1 fait baisser le score après une réponse aidée et une question sautée, mais les deux entrées ne démontrent aucune réponse finale incorrecte. M4 affichait encore « Difficulté persistante ». Cette situation diffère de deux erreurs constatées.

À preuve intégrale et non contradictoire du journal, si toutes les tentatives non sautées sont des réponses helped, le conseil conserve type/id/priority et le score V1, mais porte « Autonomie à consolider ». Un mélange aide+saut reçoit evidence.helpedAndSkipped=true, helpedCount et skippedCount, qui sont des décomptes du journal réellement observé. Les réponses seulement aidées continuent de porter assistedOnly=true et les sauts seuls skippedOnly=true. Mélanges contenant une erreur ou journal incomplet : pas de fausse déduction.

Six nouveaux tests reproduisent aide+saut, erreur libre+saut, toutes aidées, aide+erreur, tous sauts et journal tronqué.

**PROCHAINE PASSE :** récupérer et inspecter les logs Node22 des tests nouvellement ajoutés, retirer tout adaptateur temporaire d'exécution, vérifier le diff et les réponses d'intégrité ; maintenir la PR en DRAFT/HOLD sans fusion/publication.