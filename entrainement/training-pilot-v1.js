/* QPJB : lot pilote 9 fiches, branche isolée uniquement.
 * Activé UNIQUEMENT sur /entrainement/?pilot=1.
 * Aucun impact sur main ou les sessions sans le paramètre.
 */
(()=>{
  if(new URLSearchParams(location.search).get('pilot')!=='1')return;
  const PILOT_9={
  "bidding": [
    {
      "theme": "suite-1sa",
      "level": 3,
      "topic": "Décrire une mineure longue après Stayman négatif",
      "hand": [
        "D 10 8 5",
        "2",
        "D 7 4",
        "R D V 4 2"
      ],
      "auction": [
        [
          "",
          "",
          "1SA",
          "Passe"
        ],
        [
          "2♣",
          "Passe",
          "2♦",
          "Passe"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "2SA",
        "3♣",
        "3SA",
        "3♠"
      ],
      "correct": "3♣",
      "explanation": "Après la réponse négative de 2♦ au Stayman, Nord n'a pas de majeure quatrième. Avec un singleton Cœur et cinq bons Trèfles, 3♣ naturel et forcing décrit la main et laisse à Nord la possibilité de préciser ses tenues avant de choisir le contrat. 3SA directement ne vérifie pas la faiblesse à Cœur.",
      "id": "EN-BH-134-03",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-134-03",
      "sourceRef": "BH-134:EN-03",
      "tags": [
        "suite-1sa"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "134. Exercice Votre Bridge Hebdo Débutant 20 09 2024.pdf",
        "corrige_pdf": "134. Solution Votre Bridge Hebdo Débutant 20 09 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "APPRENTISSAGE",
      "pilotNote": "Notion proche de EN-BH-092-05, mais singleton opposé ; arbitrage utilisateur favorable à sa conservation."
    },
    {
      "theme": "apres-ouverture-intervention",
      "level": 3,
      "topic": "Annoncer une longue mineure après intervention",
      "hand": [
        "8",
        "D V 9 4",
        "A 7 2",
        "A D 10 8 4"
      ],
      "auction": [
        [
          "",
          "",
          "1♦",
          "1♠"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "Contre",
        "2♣",
        "2♥",
        "3♣"
      ],
      "correct": "2♣",
      "explanation": "Avec 13 H et cinq beaux Trèfles, 2♣ naturel décrit la couleur longue. Cette réponse ne dénie pas quatre Cœurs. Après une éventuelle répétition à 2♦ de Nord, on pourra annoncer 2♥ en poursuivant la description, selon les accords du partenariat.",
      "id": "EN-BH-136-05",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-136-05",
      "sourceRef": "BH-136:EN-05",
      "tags": [
        "apres-ouverture-intervention"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "136. Exercice Votre Bridge Hebdo Débutant 04 10 2024.pdf",
        "corrige_pdf": "136.Solution Votre Bridge Hebdo Débutant 04 10 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "APPRENTISSAGE",
      "pilotNote": "Arbitrage utilisateur : 2♣, avec Cœurs au tour suivant si redemande à 2♦."
    },
    {
      "theme": "suite-repondant",
      "level": 3,
      "topic": "4SA quantitatif après redemande à 1SA",
      "hand": [
        "R 10 2",
        "A D 9 6",
        "A D V",
        "A 10 8"
      ],
      "auction": [
        [
          "",
          "",
          "1♣",
          "Passe"
        ],
        [
          "1♥",
          "Passe",
          "1SA",
          "Passe"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "3SA",
        "4♥",
        "4SA",
        "6SA"
      ],
      "correct": "4SA",
      "explanation": "Nord a décrit 12 à 14 H et une main régulière. Les 20 H de Sud portent la force de la ligne à 32–34 H : 4SA est une invitation quantitative au petit chelem, et non un Blackwood aux clés. L'ouvreur accepte avec une bonne main, refuse avec le minimum.",
      "id": "EN-BH-139-06",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-139-06",
      "sourceRef": "BH-139:EN-06",
      "tags": [
        "suite-repondant"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "139. Exercice Votre Bridge Hebdo Débutant 25 10 2024.pdf",
        "corrige_pdf": "139. Solution Votre Bridge Hebdo Débutant 25 10 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "APPRENTISSAGE",
      "pilotNote": "Arbitrage utilisateur : 4SA quantitatif."
    },
    {
      "theme": "intervention",
      "level": 2,
      "topic": "Intervention à saut : 2♥ de barrage sur 1♦",
      "hand": [
        "3",
        "R D V 9 8 6",
        "V 10 8",
        "7 5 3"
      ],
      "auction": [
        [
          "",
          "",
          "",
          "1♦"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "Passe",
        "2♥",
        "2♠",
        "3♥"
      ],
      "correct": "2♥",
      "explanation": "Sur l'ouverture adverse de 1♦, 2♥ est une intervention à saut : elle constitue un barrage. Avec six beaux Cœurs et 7 H, le palier de 2 peut gêner les adversaires. La vulnérabilité n'est pas précisée : c'est un choix de style, pas une garantie de succès.",
      "id": "EN-BH-140-01",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-140-01",
      "sourceRef": "BH-140:EN-01",
      "tags": [
        "intervention"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "140. Exercice Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "corrige_pdf": "140. Solution Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "CONTRASTE",
      "pilotNote": "Arbitrage utilisateur : 2♥ ; paire pédagogique avec EN-BH-140-02."
    },
    {
      "theme": "intervention",
      "level": 2,
      "topic": "Intervention sans saut : 2♥ constructif sur 1♠",
      "hand": [
        "3",
        "A D V 6 3 2",
        "A 9 2",
        "7 5 3"
      ],
      "auction": [
        [
          "",
          "",
          "",
          "1♠"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "Passe",
        "2♥",
        "3♥",
        "4♥"
      ],
      "correct": "2♥",
      "explanation": "Sur l'ouverture adverse de 1♠, 2♥ n'est pas un saut : c'est une intervention naturelle constructive. Six Cœurs et 11 H justifient ce choix. À comparer avec 2♥ après l'ouverture adverse de 1♦, qui est une intervention à saut et se traite ici comme un barrage.",
      "id": "EN-BH-140-02",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-140-02",
      "sourceRef": "BH-140:EN-02",
      "tags": [
        "intervention"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "140. Exercice Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "corrige_pdf": "140. Solution Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "CONTRASTE",
      "pilotNote": "Nouvelle variante intéressante, proche de EN-BH-059-01 ; garder groupée avec 140-01."
    },
    {
      "theme": "intervention",
      "level": 2,
      "topic": "Intervention naturelle positive avec sept Trèfles",
      "hand": [
        "V 3",
        "6",
        "A V 2",
        "R D V 9 8 4 2"
      ],
      "auction": [
        [
          "",
          "",
          "",
          "1♥"
        ],
        [
          "?",
          "",
          "",
          ""
        ]
      ],
      "choices": [
        "Passe",
        "2♣",
        "3♣",
        "4♣"
      ],
      "correct": "2♣",
      "explanation": "Avec sept beaux Trèfles et 12 H, la main est trop forte pour un simple barrage. Sur 1♥ adverse, on intervient naturellement à 2♣ pour montrer une longue solide et une force constructive. La hauteur du barrage ne dépend pas de la seule longueur.",
      "id": "EN-BH-140-05",
      "index": 0,
      "question": "Quelle est votre enchère ?",
      "points": "EN-BH-140-05",
      "sourceRef": "BH-140:EN-05",
      "tags": [
        "intervention"
      ],
      "reviewStatus": "a_relire",
      "choiceStatus": "controle_prepublication",
      "explanationOrigin": "adaptation_pedagogique_corrige_BH_et_arbitrages_QPJB",
      "sourceAudit": {
        "sujet_pdf": "140. Exercice Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "corrige_pdf": "140. Solution Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "page": 1,
        "version": "2026-11-05",
        "publication_autorisee": false
      },
      "pilotPriority": "APPRENTISSAGE",
      "pilotNote": "Analogue EN-intervention-016, mais sept cartes et différenciation barrage / naturel."
    }
  ],
  "play": [
    {
      "id": "JC-BH-136-01",
      "index": 0,
      "level": 2,
      "type": "declarant",
      "title": "Jeu de la carte",
      "lessonTitle": "Plan de jeu à 4♥ — cumuler deux chances",
      "prompt": "Les adversaires encaissent les trois premiers Piques et Est rejoue atout. Comment réagissez-vous ?",
      "questionText": "Jeu de la carte\n\n♠ 10 6 3\n♥ 6 5 2   Contrat : 4♥\n♦ A V 5 3   Entame : ♠R (Ouest)\n♣ R 8 2\n\n♠ V 8 5\n♥ A R D V 3\n♦ R 6\n♣ A V 5\n\nLes adversaires encaissent les trois premiers Piques et Est rejoue atout. Comment réagissez-vous ?",
      "answerText": "Prendre le retour atout et purger les atouts adverses. Jouer ♦R, puis ♦A, puis un troisième Carreau du mort à couper en Sud : si ♦D était troisième, elle tombe, et ♦V du mort est affranchi. Si la Dame ne tombe pas, tenter ensuite l’impasse à ♣D du mort vers ♣AV en Sud.\n\nL’ordre des opérations permet de cumuler une Dame de Carreau troisième et, si ce plan échoue, une impasse à la Dame de Trèfle. Bien conserver ♦V au mort pendant la coupe du troisième Carreau.",
      "keyPoint": "Cumul de chances et préservation d’un honneur dans une couleur longue du mort.",
      "sourceRef": "BH-136:JC-01",
      "reviewStatus": "a_relire",
      "playEditorialStatus": "plan_libre_pret_a_relire",
      "contract": "4♥",
      "lead": "♠R (Ouest)",
      "north": [
        "10 6 3",
        "6 5 2",
        "A V 5 3",
        "R 8 2"
      ],
      "south": [
        "V 8 5",
        "A R D V 3",
        "R 6",
        "A V 5"
      ],
      "sourceAudit": {
        "sujet_pdf": "136. Exercice Votre Bridge Hebdo Débutant 04 10 2024.pdf",
        "corrige_pdf": "136.Solution Votre Bridge Hebdo Débutant 04 10 2024.pdf",
        "page": 2,
        "publication_autorisee": false
      },
      "pilotNote": "Le plan dépend des répartitions inconnues. La source illustre la ligne dans une donne reconstituée, sans certification sur tous les flancs."
    },
    {
      "id": "JC-BH-139-01",
      "index": 0,
      "level": 3,
      "type": "declarant",
      "title": "Jeu de la carte",
      "lessonTitle": "Plan de jeu à 6♥ — impasse avant atout",
      "prompt": "Vous fournissez la Dame de Trèfle du mort sur l’entame du Valet, mais Est la couvre du Roi. Comment poursuivez-vous ?",
      "questionText": "Jeu de la carte\n\n♠ R D V\n♥ V 7 3   Contrat : 6♥\n♦ A D 7 6   Entame : ♣V (Ouest)\n♣ D 5 2\n\n♠ A 10 9 4\n♥ R D 10 9 8 2\n♦ 8\n♣ A 6\n\nVous fournissez la Dame de Trèfle du mort sur l’entame du Valet, mais Est la couvre du Roi. Comment poursuivez-vous ?",
      "answerText": "Prendre ♣A en Sud. Avant de jouer atout, partir du ♦8 sec de Sud vers ♦D du mort pour tenter l’impasse à ♦R. Si elle réussit, encaisser ♦A en défaussant ♣6 de Sud ; on peut ensuite couper un Carreau pour revenir en Sud et traiter les atouts.\n\nAprès l’As de Trèfle, jouer immédiatement atout exposerait au retour Trèfle après l’As d’atout adverse. Il faut d’abord essayer d’éliminer le dernier Trèfle perdant de Sud. L’impasse à ♦R doit réussir pour ce plan.",
      "keyPoint": "Ordre d’un plan : supprimer une perdante avant de faire tomber un atout maître adverse.",
      "sourceRef": "BH-139:JC-01",
      "reviewStatus": "a_relire",
      "playEditorialStatus": "plan_libre_pret_a_relire",
      "contract": "6♥",
      "lead": "♣V (Ouest)",
      "north": [
        "R D V",
        "V 7 3",
        "A D 7 6",
        "D 5 2"
      ],
      "south": [
        "A 10 9 4",
        "R D 10 9 8 2",
        "8",
        "A 6"
      ],
      "sourceAudit": {
        "sujet_pdf": "139. Exercice Votre Bridge Hebdo Débutant 25 10 2024.pdf",
        "corrige_pdf": "139. Solution Votre Bridge Hebdo Débutant 25 10 2024.pdf",
        "page": 2,
        "publication_autorisee": false
      },
      "pilotNote": "Contrat de 6♥ à haut risque et gain conditionnel à la position de ♦R ; conserver les incertitudes dans l’explication."
    },
    {
      "id": "JC-BH-140-01",
      "index": 0,
      "level": 2,
      "type": "declarant",
      "title": "Jeu de la carte",
      "lessonTitle": "Plan de jeu à 4♠ — profiter de l’entame",
      "prompt": "L’entame dans une mineure ne vous aurait laissé aucun espoir. Saurez-vous profiter de l’entame à Cœur ?",
      "questionText": "Jeu de la carte\n\n♠ A 7\n♥ A D V   Contrat : 4♠\n♦ V 6 5   Entame : ♥2 (Ouest)\n♣ D 8 7 5 3\n\n♠ R D V 9 8 5 3 2\n♥ 5\n♦ 9 3 2\n♣ 2\n\nL’entame dans une mineure ne vous aurait laissé aucun espoir. Saurez-vous profiter de l’entame à Cœur ?",
      "answerText": "Prendre l’entame de ♥A au mort, puis rejouer immédiatement ♥D. Si Est couvre du ♥R, couper en Sud ; utiliser ensuite ♠A comme rentrée au mort pour encaisser ♥V et défausser ♣2 de Sud. Si Est ne couvre pas, défausser ♣2 immédiatement sur ♥D.\n\nL’entame adverse a offert une entrée et une possibilité de défausse. Il ne faut pas purger les atouts avant d’exploiter ♥D/♥V, car la défausse du singleton Trèfle est le moyen d’éviter une perdante.",
      "keyPoint": "Exploiter une entame favorable et respecter le bon timing avant les atouts.",
      "sourceRef": "BH-140:JC-01",
      "reviewStatus": "a_relire",
      "playEditorialStatus": "plan_libre_pret_a_relire",
      "contract": "4♠",
      "lead": "♥2 (Ouest)",
      "north": [
        "A 7",
        "A D V",
        "V 6 5",
        "D 8 7 5 3"
      ],
      "south": [
        "R D V 9 8 5 3 2",
        "5",
        "9 3 2",
        "2"
      ],
      "sourceAudit": {
        "sujet_pdf": "140. Exercice Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "corrige_pdf": "140. Solution Votre Bridge Hebdo Débutant 01 11 2024.pdf",
        "page": 2,
        "publication_autorisee": false
      },
      "pilotNote": "L’auteur suppose ♥R en Est à partir des enchères et de l’entame ; distinguer l’hypothèse du fait certain."
    }
  ]
};
  const originalEnsureTrainingData=ensureTrainingData;
  const installed={bidding:false,play:false};
  function appendPilot(mode){
    const kind=mode==='play'?'play':'bidding';
    if(installed[kind])return;
    const existing=new Set(D[kind].map(x=>x.id));
    let seq=D[kind].reduce((m,x)=>Math.max(m,Number(x.index)||0),0);
    for(const record of PILOT_9[kind]){
      if(existing.has(record.id))throw Error('Collision identifiant pilote : '+record.id);
      const item={...record,index:++seq};
      D[kind].push(item);
      existing.add(item.id);
      if(kind==='bidding'){
        const category=D.categories.find(c=>c.id===item.theme);
        if(category)category.count+=1;
      }
    }
    D.counts[kind]=D[kind].length;
    installed[kind]=true;
  }
  ensureTrainingData=function(mode){
    return originalEnsureTrainingData(mode).then(()=>appendPilot(mode));
  };
})();
