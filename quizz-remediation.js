/* QPJB M4 — remédiation locale, pure, post-réponse. Contrat #386/#390. */
(function(root,factory){
  const api=factory({
  "SEF-001-1": {
    "signature": "[\"SEF-001-1\",\"ouv\",15,[3,3,4,3],[[\"R\",\"D\",\"6\"],[\"A\",\"R\",\"V\"],[\"V\",\"9\",\"8\",\"4\"],[\"V\",\"6\",\"2\"]],[],\"Vous êtes donneur. Personne n’a encore enchéri. Quelle est votre décision ?\",\"1SA\",[\"1♣\",\"2SA\",\"1♦\",\"1SA\"],\"Avec 15 H et une main régulière, vous êtes dans la zone d’ouverture de 1SA (15–17 H). Ouvrez de 1SA, qui décrit immédiatement votre force et votre répartition.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "2SA annoncerait 20–21 H, davantage que les 15 H de cette main.",
        "checkNext": "Sur une autre main régulière, dans quelle zone se trouvent les points H ?"
      },
      "1♦": {
        "category": "priorite",
        "feedback": "La longueur à Carreau ne suffit pas à justifier une ouverture à la couleur quand la main remplit les conditions de 1SA.",
        "checkNext": "Vérifie d'abord la zone de force et la régularité, avant de chercher une mineure."
      }
    }
  },
  "SEF-013-1": {
    "signature": "[\"SEF-013-1\",\"ouv\",7,[4,3,3,3],[[\"V\",\"9\",\"8\",\"3\"],[\"R\",\"10\",\"4\"],[\"R\",\"8\",\"4\"],[\"8\",\"5\",\"2\"]],[],\"Vous êtes donneur. Personne n’a encore enchéri. Quelle est votre décision ?\",\"Passe\",[\"1♠\",\"1SA\",\"1♣\",\"Passe\"],\"Avec 7 H et une main régulière, vous n’atteignez pas le seuil d’ouverture de 12 H ou 13 HL. Passez.\"]",
    "options": {
      "1♠": {
        "category": "distribution",
        "feedback": "Quatre Piques ne constituent pas une majeure cinquième. La force est également insuffisante pour ouvrir.",
        "checkNext": "Sur une autre main, vérifie d'abord la force d'ouverture puis compte les cartes de la majeure."
      }
    }
  },
  "SEF-015-1": {
    "signature": "[\"SEF-015-1\",\"mineur\",8,[3,4,3,3],[[\"9\",\"5\",\"2\"],[\"R\",\"10\",\"9\",\"3\"],[\"R\",\"D\",\"10\"],[\"8\",\"4\",\"2\"]],[\"Partenaire : 1♣\"],\"Votre partenaire ouvre de 1♣ et les adversaires passent. Quelle est votre réponse selon le SEF ?\",\"1♥\",[\"1♥\",\"2♣\",\"1SA\",\"Passe\"],\"Vos 8 H suffisent pour répondre et vos quatre Cœurs permettent 1♥, même sans cinquième carte. Cette réponse naturelle est forcing un tour pour un répondant non passé, sans plafond de force ; 1SA masquerait une possibilité de fit majeur. Rappel : la réponse de 1♥ promet au moins quatre cartes.\"]",
    "options": {
      "Passe": {
        "category": "force",
        "feedback": "Passer avec cette main empêcherait de rechercher un contrat alors que les 8 H permettent de répondre.",
        "checkNext": "Sur une autre main, vérifie si tu peux répondre avant de choisir la couleur."
      },
      "1SA": {
        "category": "priorite",
        "feedback": "Une réponse à Sans-Atout ne montre pas les quatre Cœurs disponibles.",
        "checkNext": "Sur une autre main, cherche une majeure quatrième avant de choisir 1SA."
      },
      "2♣": {
        "category": "fit",
        "feedback": "Les trois Trèfles ne sont pas un motif pour renoncer à montrer les quatre Cœurs.",
        "checkNext": "Compare la possibilité de découvrir un fit majeur avec le soutien de la mineure."
      }
    }
  },
  "SEF-026-3": {
    "signature": "[\"SEF-026-3\",\"majeur\",6,[3,4,3,3],[[\"10\",\"8\",\"6\"],[\"D\",\"9\",\"6\",\"5\"],[\"V\",\"10\",\"7\"],[\"R\",\"5\",\"4\"]],[\"Partenaire : 1♥\"],\"Votre partenaire ouvre de 1♥ et les adversaires passent. Quelle est votre réponse ?\",\"2♥\",[\"2♥\",\"1♠\",\"1SA\",\"Passe\"],\"Quatre Cœurs en face des cinq promis par 1♥ garantissent neuf atouts. 6 H + 2 points D pour le neuvième atout = 8 HLD, dans la zone de soutien simple 6–10 HLD. 2♥ montre immédiatement ce fit ; 1SA le masquerait.\"]",
    "options": {
      "1♠": {
        "category": "distribution",
        "feedback": "Les trois Piques sont insuffisants pour répondre naturellement 1♠ ; le fit à Cœur est déjà connu.",
        "checkNext": "Compte les atouts promis par le partenaire et ceux de ta main."
      },
      "Passe": {
        "category": "force",
        "feedback": "Le fit modifie l'évaluation : les 6 H ne sont pas toute la valeur de cette main.",
        "checkNext": "Une fois le fit trouvé, réévalue la main avant de choisir le palier."
      }
    }
  },
  "SEF-031-2": {
    "signature": "[\"SEF-031-2\",\"sa\",3,[3,3,4,3],[[\"D\",\"10\",\"6\"],[\"6\",\"4\",\"3\"],[\"10\",\"5\",\"4\",\"2\"],[\"V\",\"6\",\"4\"]],[\"Partenaire : 1SA\"],\"Votre partenaire ouvre de 1SA (15–17 H) et les adversaires passent. Quelle est votre réponse selon le SEF ?\",\"Passe\",[\"2♦\",\"2♣\",\"2SA\",\"Passe\"],\"Avec 3 H et une main régulière, vous n’avez aucun espoir de manche face à 1SA (15–17 H). Passez.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "2SA inviterait le partenaire à la manche ; même un ouvreur maximum à 17 H ne donne ici que 20 H au total.",
        "checkNext": "Additionne les points de ta main au maximum annoncé par le partenaire."
      }
    }
  },
  "SEF-042-2": {
    "signature": "[\"SEF-042-2\",\"red\",13,[4,3,3,3],[[\"R\",\"10\",\"9\",\"6\"],[\"R\",\"10\",\"4\"],[\"A\",\"D\",\"V\"],[\"9\",\"8\",\"5\"]],[\"Vous : 1♣\",\"Partenaire : 1♥\"],\"Vous avez ouvert de 1♣ et votre partenaire a répondu 1♥. Quelle est votre redemande ?\",\"1♠\",[\"2SA\",\"2♣\",\"1♠\",\"1SA\"],\"Après 1♣–1♥, avec 13 H, seulement trois Cœurs et quatre Piques, l’ouvreur décrit d’abord sa majeure quatrième par 1♠. Une redemande à 1SA risquerait de perdre un fit à Pique.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "Une redemande à 2SA ferait croire à une main régulière de 18–19 H, alors que tu n'en as que 13.",
        "checkNext": "Sépare la zone de force de l'ouvreur et le choix de montrer une majeure."
      },
      "1SA": {
        "category": "priorite",
        "feedback": "1SA ne renseignerait pas le partenaire sur les quatre Piques.",
        "checkNext": "Avant Sans-Atout, vérifie si une majeure encore non annoncée peut être montrée."
      }
    }
  },
  "SEF-052-3": {
    "signature": "[\"SEF-052-3\",\"second\",6,[3,5,3,2],[[\"V\",\"6\",\"3\"],[\"R\",\"9\",\"8\",\"6\",\"2\"],[\"9\",\"8\",\"4\"],[\"D\",\"7\"]],[\"Partenaire : 1♣\",\"Vous : 1♥\",\"Partenaire : 1SA\"],\"Après 1♣ – 1♥ – 1SA, c'est à vous de reparler. Quelle est votre enchère selon le SEF ?\",\"2♥\",[\"2♥\",\"2♣\",\"2SA\",\"Passe\"],\"Le 1SA de l'ouvreur montre 12–14 H : avec vos 6 H, la manche n'est pas en vue. Vos cinq Cœurs peuvent trouver une partielle à la couleur ; 2♥ est naturel et non forcing. Avec seulement quatre Cœurs, on conserverait plutôt 1SA.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "Une invitation à Sans-Atout suppose davantage de force : même 14 H chez le partenaire ne donnent ici que 20 H.",
        "checkNext": "Évalue d'abord la force cumulée, puis compare les partielles possibles."
      },
      "Passe": {
        "category": "distribution",
        "feedback": "Passer conserve 1SA sans donner au partenaire le choix de jouer la longue à Cœur.",
        "checkNext": "Sur une main semblable avec quatre puis cinq Cœurs, quelle différence fait la cinquième carte ?"
      }
    }
  },
  "SEF-V3-001-1": {
    "signature": "[\"SEF-V3-001-1\",\"stayman\",8,[3,4,3,3],[[\"A\",\"9\",\"4\"],[\"V\",\"9\",\"4\",\"2\"],[\"D\",\"7\",\"6\"],[\"V\",\"8\",\"3\"]],[\"Partenaire : 1SA\",\"Vous : 2♣\",\"Partenaire : 2♥\"],\"Votre partenaire a ouvert 1SA (15–17 H), vous avez demandé 2♣ Stayman et il a répondu 2♥. Quelle est votre deuxième enchère dans le SEF à quatre réponses ?\",\"3♥\",[\"3♥\",\"2SA\",\"4♥\",\"3SA\"],\"Vous avez 8 H et quatre Cœurs (♥V942), en face de l'ouverture de 1SA (15–17 H). La réponse 2♥ au Stayman garantit quatre cartes dans cette majeure : le fit 4–4 est trouvé. 3♥ est une invitation à la manche, laissant l'ouvreur minimum s'arrêter et l'ouvreur maximum conclure à quatre.\"]",
    "options": {
      "4♥": {
        "category": "niveau",
        "feedback": "Conclure directement à 4♥ ne laisse plus au partenaire la possibilité de s'arrêter s'il est minimum.",
        "checkNext": "Distingue une invitation à la manche d'une décision de manche."
      },
      "2SA": {
        "category": "fit",
        "feedback": "Le fit majeur est connu ; 2SA n'exprime pas ce fit.",
        "checkNext": "Après la réponse au Stayman, compte d'abord les atouts communs."
      }
    }
  },
  "SEF-V3-027-2": {
    "signature": "[\"SEF-V3-027-2\",\"intervenir\",12,[3,5,3,2],[[\"R\",\"6\",\"3\"],[\"R\",\"V\",\"10\",\"6\",\"2\"],[\"A\",\"V\",\"10\"],[\"8\",\"6\"]],[\"Adversaire : 1♣\"],\"Votre adversaire de droite ouvre de 1♣. Vous êtes en deuxième position. Quelle est votre enchère selon le SEF ?\",\"1♥\",[\"Passe\",\"1♥\",\"1SA\",\"Contre\"],\"Sur 1♣, 12 H et 5 cartes à Cœur (♥RV1062), soit 13 HL, justifient 1♥ naturel. Le Contre d’appel rechercherait plusieurs couleurs, alors que votre cinquième est déjà identifiable.\"]",
    "options": {
      "1SA": {
        "category": "force",
        "feedback": "Les 12 H ne correspondent pas à la zone d'une intervention naturelle de 1SA.",
        "checkNext": "Ne transpose pas automatiquement les conditions d'une ouverture de 1SA à une intervention."
      },
      "Contre": {
        "category": "priorite",
        "feedback": "Un contre d'appel ne décrit pas directement cette couleur cinquième.",
        "checkNext": "Compare ce que le partenaire apprend avec une intervention à la couleur et avec un contre."
      }
    }
  },
  "SEF-V3-057-1": {
    "signature": "[\"SEF-V3-057-1\",\"contre\",3,[3,4,4,2],[[\"V\",\"10\",\"3\"],[\"D\",\"7\",\"4\",\"3\"],[\"10\",\"8\",\"7\",\"6\"],[\"9\",\"6\"]],[\"Adversaire : 1♣\",\"Partenaire : Contre\",\"Adversaire : Passe\"],\"Le partenaire a contré d’appel, et l’adversaire suivant a passé. Tu dois choisir une enchère.\",\"1♥\",[\"2♥\",\"1♥\",\"1SA\",\"Passe\"],\"Après 1♣ – Contre – Passe, la réponse est normalement obligatoire, même avec 3 H. Les quatre Cœurs permettent d'annoncer 1♥ au plus bas palier disponible (la majeure étant privilégiée sur une mineure de même longueur). Passe convertirait le Contre d'appel en pénalité, alors que ♣96 ne constitue pas une tenue d'atout adverse suffisante pour une transformation punitive.\"]",
    "options": {
      "2♥": {
        "category": "niveau",
        "feedback": "Le saut à 2♥ montrerait une réponse plus forte que cette main de 3 H.",
        "checkNext": "Après un contre d'appel, distingue obligation de répondre et force nécessaire pour sauter."
      },
      "Passe": {
        "category": "forcing",
        "feedback": "Passer laisserait jouer 1♣ contré : ce choix exige une justification défensive que la main ne fournit pas.",
        "checkNext": "Demande-toi si tu souhaites réellement défendre le contrat adverse contré."
      }
    }
  },
  "SEF-V3-074-3": {
    "signature": "[\"SEF-V3-074-3\",\"apres_inter\",6,[2,3,4,4],[[\"7\",\"6\"],[\"V\",\"10\",\"6\"],[\"D\",\"V\",\"9\",\"3\"],[\"D\",\"6\",\"4\",\"2\"]],[\"Partenaire : 1♥\",\"Adversaire : 1♠\"],\"Votre partenaire ouvre de 1♥, puis l'adversaire de droite intervient par 1♠. Quelle est votre réponse selon le SEF ?\",\"2♥\",[\"2♣\",\"Passe\",\"2♥\",\"2SA\"],\"Après 1♥ du partenaire et 1♠ adverse, vous détenez 6 H, trois atouts ♥V106 et la forme 2-3-4-4. L'évaluation au fit donne 7 HLD (6 H + 1 point de courte). Le soutien simple de 2♥ montre environ 6–10 HLD après intervention naturelle, tandis que 2SA fitté annoncerait 11–15 HLD.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "Le soutien à 2SA surévalue la main : elle ne vaut que 7 HLD.",
        "checkNext": "En compétition aussi, évalue ta main au fit avant de choisir le niveau du soutien."
      }
    }
  },
  "SEF-V3-091-1": {
    "signature": "[\"SEF-V3-091-1\",\"barrage\",8,[2,6,3,2],[[\"9\",\"2\"],[\"A\",\"D\",\"V\",\"7\",\"6\",\"3\"],[\"V\",\"5\",\"2\"],[\"6\",\"4\"]],[],\"Tu es donneur, en première position. Quelle est ton ouverture ?\",\"2♥\",[\"Passe\",\"3♥\",\"1♥\",\"2♥\"],\"Vos 8 H et six Cœurs commandés par A–D satisfont la zone de 6 à 10 H du deux faible en première position. Vous n’avez ni une autre majeure quatrième ni deux gros honneurs extérieurs. 2♥ gêne les adversaires sans annoncer la force d’une ouverture au palier de 1 ; le barrage à 3 demanderait normalement une septième carte.\"]",
    "options": {
      "3♥": {
        "category": "distribution",
        "feedback": "Avec six Cœurs, monter directement au palier de trois annoncerait normalement une longueur supérieure.",
        "checkNext": "Pour un barrage, distingue force faible et nombre de cartes requis au palier choisi."
      },
      "1♥": {
        "category": "force",
        "feedback": "Les 8 H et la longueur ne suffisent pas à une ouverture naturelle au palier de 1.",
        "checkNext": "Compare le seuil d'ouverture naturelle à la zone du barrage."
      }
    }
  },
  "SEF-V4-001-1": {
    "signature": "[\"SEF-V4-001-1\",\"apres_fit\",12,[3,5,3,2],[[\"A\",\"V\",\"9\"],[\"A\",\"D\",\"8\",\"6\",\"2\"],[\"V\",\"6\",\"3\"],[\"10\",\"7\"]],[\"Vous : 1♥\",\"Partenaire : 2♥\"],\"Vous avez ouvert 1♥ et votre partenaire vous a soutenu à 2♥ (soutien simple : environ 6–10 HLD). Avec 12 H et une main 3-5-3-2, quelle est votre redemande ?\",\"Passe\",[\"2SA\",\"Passe\",\"3♥\",\"4♥\"],\"Vous avez 12 H, cinq Cœurs (♥AD862) et une distribution 3-5-3-2. Après 1♥–2♥, le soutien simple du partenaire ne garantit pas assez de force pour la manche face à cette ouverture minimale. Passe conserve la partielle au bon palier.\"]",
    "options": {
      "4♥": {
        "category": "niveau",
        "feedback": "Le soutien simple ne garantit pas que les deux mains réunies suffisent à la manche.",
        "checkNext": "Compare la force annoncée par les deux partenaires avant de dépasser la partielle."
      }
    }
  },
  "SEF-V4-025-2": {
    "signature": "[\"SEF-V4-025-2\",\"reponse_inter\",6,[3,3,4,3],[[\"V\",\"7\",\"5\"],[\"D\",\"8\",\"3\"],[\"R\",\"8\",\"6\",\"3\"],[\"6\",\"4\",\"2\"]],[\"Adversaire : 1♣\",\"Partenaire : 1♥ (intervention)\",\"Adversaire : Passe\"],\"L'adversaire ouvre de 1♣, votre partenaire intervient à 1♥, puis l'adversaire suivant passe. Quelle est votre réponse selon le SEF ?\",\"2♥\",[\"Passe\",\"3♥\",\"2♥\",\"1SA\"],\"Après l'ouverture de 1♣, votre partenaire est intervenu à 1♥ et le troisième joueur a passé. Avec 6 H et trois atouts ♥D83, vous avez au moins huit atouts dans le camp face à sa majeure cinquième. 2♥ est un soutien simple non forcing, qui signale le fit sans inviter à la manche. Un saut au palier de trois ne convient pas à ce fit de seulement trois cartes ; il ne s'agit pas non plus d'une invitation.\"]",
    "options": {
      "3♥": {
        "category": "fit",
        "feedback": "Trois atouts suffisent au soutien simple, pas au saut de barrage décrit dans cette situation.",
        "checkNext": "En réponse à une intervention, compte les atouts avant de choisir le palier."
      }
    }
  },
  "SEF-V4-048-1": {
    "signature": "[\"SEF-V4-048-1\",\"reveil\",10,[3,5,3,2],[[\"9\",\"8\",\"4\"],[\"A\",\"D\",\"9\",\"3\",\"2\"],[\"9\",\"3\",\"2\"],[\"A\",\"5\"]],[\"Adversaire : 1♣\",\"Partenaire : Passe\",\"Adversaire : Passe\"],\"Votre adversaire de gauche ouvre de 1♣. Votre partenaire passe, puis l'autre adversaire passe. Vous êtes en position de réveil : quelle est votre enchère ?\",\"1♥\",[\"1SA\",\"Passe\",\"1♥\",\"Contre\"],\"Après l'ouverture adverse de 1♣ et deux Passe, vous avez 10 H et cinq Cœurs (♥AD932), soit 11 HL. Le réveil naturel de 1♥ annonce cette cinquième dans la zone habituelle 8–13 HL. L'As-Dame de Cœur donne de bonnes levées potentielles. Contrairement à l'intervention directe, le réveil tient compte du fait que le partenaire peut posséder des valeurs sans avoir pu parler ; la couleur cinquième rend le réveil naturel plus descriptif qu'un Contre.\"]",
    "options": {
      "Passe": {
        "category": "competition",
        "feedback": "Passer terminerait les enchères alors que les conditions du réveil naturel sont remplies.",
        "checkNext": "Repère les deux Passe : es-tu en intervention directe ou en réveil ?"
      }
    }
  },
  "SEF-V4-073-1": {
    "signature": "[\"SEF-V4-073-1\",\"roudi\",12,[3,5,3,2],[[\"A\",\"R\",\"2\"],[\"V\",\"10\",\"9\",\"8\",\"3\"],[\"10\",\"5\",\"2\"],[\"R\",\"V\"]],[\"Partenaire : 1♣\",\"Vous : 1♥\",\"Partenaire : 1SA\"],\"Le partenaire ouvre de 1♣, vous répondez 1♥ et il redemande 1SA (12–14 H). Vous possédez cinq Cœurs et 12 H : quelle enchère permet de vérifier un éventuel fit 5–3 avant de choisir la manche ?\",\"2♣\",[\"3SA\",\"2SA\",\"2♣\",\"2♥\"],\"Après 1♣–1♥–1SA, l'ouvreur peut détenir trois Cœurs malgré sa redemande à Sans-Atout. Avec cinq Cœurs (♥V10983) et 12 H, vous avez assez de force pour envisager la manche. Le Roudi à 2♣ interroge l'ouvreur sur son éventuel soutien troisième pour découvrir un fit 5–3.\"]",
    "options": {
      "3SA": {
        "category": "fit",
        "feedback": "3SA fixerait le contrat avant d'avoir vérifié si le partenaire possède trois Cœurs.",
        "checkNext": "Avant de conclure à Sans-Atout, cherche si un fit majeur reste possible."
      },
      "2♥": {
        "category": "forcing",
        "feedback": "La répétition naturelle de 2♥ ne pose pas la question du soutien troisième.",
        "checkNext": "Distingue une enchère qui propose un contrat d'une enchère qui demande une information."
      }
    }
  },
  "SEF-V4-097-1": {
    "signature": "[\"SEF-V4-097-1\",\"drury\",10,[3,3,4,3],[[\"A\",\"4\",\"2\"],[\"9\",\"6\",\"2\"],[\"R\",\"D\",\"V\",\"6\"],[\"8\",\"3\",\"2\"]],[\"Vous : Passe\",\"Adversaire : Passe\",\"Partenaire : 1♥ (3e position)\",\"Adversaire : Passe\"],\"Après ton Passe d'entrée, le partenaire ouvre de 1♥ en troisième position. Avec trois atouts et 10 HLD, quelle réponse du SEF 2024 est juste ?\",\"2♥\",[\"3♥\",\"2♥\",\"1SA\",\"2♣\"],\"Le Drury à 2♣ exige au moins 11 HLD avec trois atouts. Cette main 3–3–4–3 compte 10 H sans courte : elle vaut 10 HLD et justifie le soutien simple à 2♥.\"]",
    "options": {
      "2♣": {
        "category": "force",
        "feedback": "Le fait d'avoir passé et d'avoir trois atouts ne suffit pas : la main reste à 10 HLD.",
        "checkNext": "Compare deux mains avec trois atouts, juste en dessous et au seuil du Drury."
      }
    }
  },
  "SEF-V45-001": {
    "signature": "[\"SEF-V45-001\",\"fortes\",22,[3,3,4,3],[[\"A\",\"10\",\"6\"],[\"A\",\"V\",\"3\"],[\"A\",\"D\",\"4\",\"3\"],[\"A\",\"R\",\"9\"]],[],\"Système d'ouvertures fortes : une ouverture artificielle forte indéterminée et une ouverture artificielle forcing de manche sont prévues.\",\"2♣\",[\"1♣\",\"2♣\",\"2♦\",\"2SA\"],\"Vos 22 H et la distribution régulière 3-3-4-3 dépassent la zone de l'ouverture de 2SA (20–21 H). Ouvrez de 2♣ fort indéterminé, puis redemandez 2SA après le relais 2♦ pour décrire 22–23 H réguliers. 2♦ forcing de manche correspond à une autre zone.\"]",
    "options": {
      "2SA": {
        "category": "force",
        "feedback": "L'ouverture de 2SA sous-évaluerait les 22 H de cette main.",
        "checkNext": "Sur une main régulière, distingue 20–21 H de 22–23 H avant de choisir l'ouverture."
      }
    }
  },
  "SEF-V45-013": {
    "signature": "[\"SEF-V45-013\",\"forcing\",12,[3,5,3,2],[[\"R\",\"V\",\"10\"],[\"A\",\"D\",\"9\",\"7\",\"6\"],[\"10\",\"5\",\"3\"],[\"D\",\"7\"]],[\"Partenaire : 1♣\",\"Vous : 1♥\",\"Partenaire : 2♣\"],\"À la deuxième enchère du répondant : une main encourageante sans enchère naturelle satisfaisante.\",\"2♦\",[\"2♥\",\"2♦\",\"2SA\",\"3♥\"],\"Vos cinq Cœurs ♥AD976 et 12 H justifient une recherche de manche. Après 1♣–1♥–2♣, 2♦ est la troisième couleur artificielle forcing : elle demande notamment trois Cœurs ou des précisions pour Sans-Atout. 2♥ serait une répétition naturelle moins engageante ; vous n'avez pas d'arrêt Carreau.\"]",
    "options": {
      "2SA": {
        "category": "distribution",
        "feedback": "Sans arrêt à Carreau, annoncer naturellement Sans-Atout ne résout pas la difficulté.",
        "checkNext": "Avant une enchère naturelle à Sans-Atout, vérifie les informations encore manquantes."
      },
      "2♥": {
        "category": "forcing",
        "feedback": "Répéter la majeure ne donne pas la même garantie de poursuite que la troisième couleur.",
        "checkNext": "Distingue une enchère naturelle et une demande artificielle d'information."
      }
    }
  },
  "SEF-V45-023": {
    "signature": "[\"SEF-V45-023\",\"multilandy\",15,[5,4,2,2],[[\"R\",\"D\",\"6\",\"4\",\"2\"],[\"A\",\"V\",\"10\",\"8\"],[\"A\",\"5\"],[\"V\",\"4\"]],[\"Adversaire : 1SA (15-17 H)\"],\"Rappel : Multi-Landy contre 1SA adverse, situation non vulnérable.\",\"2♣\",[\"2♣\",\"2♦\",\"2♥\",\"2SA\"],\"Vos cinq Piques et quatre Cœurs, avec 15 H, offrent les deux majeures à jouer. Dans le Multi-Landy retenu, 2♣ montre ce bicolore au moins 5–4. 2♦ montrerait une seule majeure sixième, ce que votre main ne possède pas.\"]",
    "options": {
      "2♦": {
        "category": "convention",
        "feedback": "La main présente deux majeures longues, pas une majeure sixième unique.",
        "checkNext": "Dans ce Multi-Landy, compare les distributions annoncées par 2♣ et 2♦."
      }
    }
  },
  "SEF-V45-031": {
    "signature": "[\"SEF-V45-031\",\"rubensohl\",5,[5,2,3,3],[[\"A\",\"8\",\"6\",\"4\",\"3\"],[\"V\",\"9\"],[\"9\",\"5\",\"3\"],[\"7\",\"4\",\"2\"]],[\"Partenaire : 1SA\",\"Adversaire : 2♥ (naturel)\"],\"Rappel : Rubensohl après une intervention naturelle sur l’ouverture de 1SA.\",\"2♠\",[\"2♠\",\"3♥\",\"Contre\",\"3SA\"],\"Après 1SA–(2♥ naturel), vos cinq Piques et 5 H permettent de jouer au palier de deux. 2♠ est naturel et non forcing, contrairement aux transferts Rubensohl du palier de trois. 3♥, Texas Pique, serait ici une montée inutile.\"]",
    "options": {
      "3♥": {
        "category": "niveau",
        "feedback": "Le transfert au palier de trois ferait dépasser la partielle disponible à 2♠.",
        "checkNext": "Avant le transfert, vérifie si la couleur peut être jouée naturellement au palier de deux."
      }
    }
  },
  "SEF-V45-041": {
    "signature": "[\"SEF-V45-041\",\"michaels\",12,[5,5,2,1],[[\"R\",\"D\",\"10\",\"6\",\"2\"],[\"A\",\"10\",\"6\",\"3\",\"2\"],[\"R\",\"5\"],[\"10\"]],[\"Adversaire : 1♣\"],\"Rappel : Michaels précisés, avec bicolore au moins 5-5. Vulnérabilité favorable.\",\"2♦\",[\"1♥\",\"2♦\",\"2SA\",\"Contre\"],\"Sur 1♣ adverse, vos cinq Piques RD1062 et cinq Cœurs A10632 justifient 2♦ Michaël précisé. Cette enchère est artificielle : elle montre les deux majeures, pas les Carreaux. 1♥ ne révélerait qu’une des deux longues.\"]",
    "options": {
      "1♥": {
        "category": "convention",
        "feedback": "Une intervention naturelle à Cœur ne montre pas simultanément les cinq Piques.",
        "checkNext": "Repère d'abord si les deux longues répondent aux conditions du bicolore précisé."
      }
    }
  },
  "SEF-V45-050": {
    "signature": "[\"SEF-V45-050\",\"chelem\",8,[3,4,3,3],[[\"D\",\"9\",\"8\"],[\"R\",\"V\",\"7\",\"3\"],[\"D\",\"6\",\"4\"],[\"8\",\"5\",\"3\"]],[\"Partenaire : 4SA (Blackwood 5 clés)\"],\"Atout Pique agréé. Partenaire interroge à 4SA : Blackwood cinq clés, réponses 30-41.\",\"5♣\",[\"5♣\",\"5♦\",\"5♥\",\"5♠\"],\"À l'atout Pique, comptez exclusivement les quatre As et le Roi de Pique. Vous n'avez aucun As ni ♠R : zéro clé, malgré vos 8 H et la Dame d'atout. 5♣ code zéro ou trois clés en 30–41 ; la Dame n'est jamais une sixième clé et n'est pas indiquée par cette réponse.\"]",
    "options": {
      "5♦": {
        "category": "convention",
        "feedback": "5♦ annoncerait une ou quatre clés dans les réponses 30–41 ; ni le Roi de Cœur ni la Dame de Pique ne sont des clés.",
        "checkNext": "Nomme l'atout agréé, puis compte les quatre As et seulement le Roi de cet atout."
      },
      "5♥": {
        "category": "convention",
        "feedback": "5♥ correspond à deux clés sans la Dame d'atout ; cette main ne possède aucune clé.",
        "checkNext": "Sépare le nombre de clés et la présence éventuelle de la Dame d'atout."
      }
    }
  }
});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJBRemediation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function factory(rules){
  'use strict';
  const schema='QPJB_REMEDIATION_V1';
  const categories=new Set(['force','distribution','fit','priorite','niveau','forcing','convention','competition','contexte','autre','inconnu']);
  const suits=['♠','♥','♦','♣'];
  const names=['Piques','Cœurs','Carreaux','Trèfles'];
  function fingerprint(q){return JSON.stringify([q.id,q.theme,q.h,q.shape,q.hand,q.auction,q.context,q.answer,q.choices,q.explain]);}
  const own=(o,k)=>o!=null&&Object.prototype.hasOwnProperty.call(o,k);
  function cleanBid(s){return typeof s==='string'&&/^(?:[1-7](?:♠|♥|♦|♣|SA)|Passe|Contre|Surcontre)$/.test(s)?s:null;}
  function handValid(q){return Array.isArray(q.hand)&&q.hand.length===4&&Array.isArray(q.shape)&&q.shape.length===4&&Number.isInteger(q.h)&&q.h>=0&&q.h<=37&&q.hand.every((s,i)=>Array.isArray(s)&&s.length===q.shape[i]&&new Set(s).size===s.length&&s.every(c=>/^(?:A|R|D|V|10|[2-9])$/.test(c)))&&q.shape.reduce((a,b)=>a+b,0)===13&&q.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0)===q.h;}
  function rule(category,feedback,checkNext){return {category,feedback,checkNext};}
  function findRule(q,choice){
    if(own(rules,q.id)&&rules[q.id].signature===fingerprint(q)&&own(rules[q.id].options,choice))return rules[q.id].options[choice];
    if(!handValid(q)||!Array.isArray(q.auction)||typeof q.explain!=='string')return null;
    const c=q.explain, h=q.h, shape=q.shape, sorted=[...shape].sort((a,b)=>b-a).join(',');
    const regular=['4,3,3,3','4,4,3,2','5,3,3,2'].includes(sorted);
    // Only natural opening contexts explicitly justified by the canonical explanation.
    if(q.theme==='ouv'&&q.auction.length===0&&regular&&shape[0]<5&&shape[1]<5){
      if(q.answer==='1SA'&&h>=15&&h<=17&&/15\s*[–-]\s*17\s*H/.test(c)&&/régulièr/i.test(c)){
        if(choice==='2SA')return rule('force',`2SA annoncerait 20–21 H, contre ${h} H ici.`,'Sur une autre main régulière, commence par situer les points H.');
        if(/^1[♣♦]$/.test(choice))return rule('priorite','Une ouverture mineure ne précise pas aussi directement la zone de force et la régularité.','Vérifie d’abord les conditions d’une ouverture à Sans-Atout.');
        if(/^1[♥♠]$/.test(choice))return rule('distribution',`Tu n’as que ${shape[suits.indexOf(choice[1])]} ${names[suits.indexOf(choice[1])]}. Une ouverture majeure naturelle en promet cinq.`,'Distingue les quatre cartes nécessaires pour répondre des cinq nécessaires pour ouvrir.');
      }
      if(q.answer==='2SA'&&h>=20&&h<=21&&/20\s*[–-]\s*21\s*H/.test(c)&&/régulièr/i.test(c)&&choice==='1SA')
        return rule('force',`1SA annoncerait 15–17 H : cette main de ${h} H est trop forte.`,'Sur une autre main régulière, compare les deux zones d’ouverture.');
      if(q.answer==='Passe'&&h<12&&Math.max(...shape)<=4&&/12\s*H|13\s*HL/.test(c)&&/^1(?:[♣♦♥♠]|SA)$/.test(choice))
        return rule('force',`Avec ${h} H et aucune cinquième carte, la longueur ne fournit pas de point supplémentaire pour ouvrir.`,'Sur une autre main, compte les points avant de choisir une couleur.');
    }
    // Natural first response, no intervention, exact one-bid auction and a canonical mention of four cards.
    if(q.theme==='mineur'&&q.auction.length===1&&/^Partenaire : 1[♣♦]$/.test(q.auction[0])&&/^1[♥♠]$/.test(q.answer)&&shape[suits.indexOf(q.answer[1])]===4&&/quatre|4 cartes/i.test(c)&&/majeure|Cœurs|Piques/i.test(c)){
      if(choice==='1SA')return rule('priorite','Cette réponse à Sans-Atout ne montrerait pas la majeure quatrième disponible.','Avant de choisir 1SA, vérifie si tu peux annoncer une majeure.');
      if(choice==='Passe'&&h>=6&&/répondre|réponse/.test(c))return rule('force',`Avec ${h} H, la question est de choisir une réponse, et non de rester silencieux.`,'Vérifie d’abord si tu as assez de force pour répondre.');
    }
    // Explicit simple fit, first response: no inference about HLD from shape alone.
    if(q.theme==='majeur'&&q.auction.length===1&&/^Partenaire : 1[♥♠]$/.test(q.auction[0])&&q.answer==='2'+q.auction[0].slice(-1)&&shape[suits.indexOf(q.answer[1])]>=3&&/fit|atouts/.test(c)&&choice==='1SA')
      return rule('fit','1SA ne transmettrait pas le soutien déjà disponible.','Sur une autre main, compte tes atouts et ceux promis par l’ouverture avant de chercher une autre enchère.');
    return null;
  }
  function repeated(history,q,choice){
    if(!history||typeof history!=='object')return false;
    const live=Array.isArray(history.journal)&&history.active&&Number.isInteger(history.completed);
    const exported=history.format==='QPJB_PROGRESS_EXPORT_1'&&Array.isArray(history.sessions)&&history.currentSession&&Number.isInteger(history.summary?.completedSessions);
    if(!live&&!exported)return false;
    const events=live?history.journal:history.sessions, completed=live?history.completed:history.summary.completedSessions;
    if(completed<0)return false;
    return events.slice(-6).some(e=>e&&e.mode==='parcours'&&Number.isInteger(e.session)&&e.session>=1&&e.session<=completed&&e.session>=completed-5&&Array.isArray(e.answers)&&e.answers.some(a=>a&&a.id===q.id&&a.result==='wrong'&&a.choice===choice));
  }
  function explain(input){
    const a=input&&typeof input==='object'?input:{},q=a.exercise;
    const canonical=q&&typeof q.explain==='string'?q.explain:'';
    const out={canonical,feedback:null,reminder:null,checkNext:null,kind:'unknown'};
    if(!q||!canonical||!cleanBid(q.answer))return out;
    const choice=cleanBid(a.choice);
    if(!choice)return {...out,kind:'unknown'};
    if(choice===q.answer){
      if(a.hadFreeError===true)return {...out,kind:'corrected',checkNext:'Sur une autre main, essaie de justifier ton enchère avant de regarder les propositions.'};
      if(a.assisted===true)return {...out,kind:'assisted',checkNext:'Sur une autre main, essaie de formuler ton enchère avant de voir les propositions.'};
      return {...out,kind:a.assisted===false&&a.hadFreeError===false?'correct':'correct-unverified'};
    }
    const d=a.diagnostic;
    if(!d||d.status!=='hypothesis'||!categories.has(d.category)||!['high','medium'].includes(d.confidence))return {...out,kind:'wrong-unknown'};
    // A valid but unlisted free bid is not necessarily a diagnosed distractor.
    if(!Array.isArray(q.choices)||!q.choices.includes(choice))return {...out,kind:'wrong-unknown'};
    const r=findRule(q,choice);
    if(!r||r.category!==d.category)return {...out,kind:'wrong-unknown'};
    // When the canonical already names the rejected bid, prefer a transfer prompt rather than repeat it.
    const feedback=canonical.includes(choice)?null:r.feedback;
    const prior=repeated(a.history,q,choice);
    return {...out,kind:'targeted',feedback,
      reminder:prior?'Tu avais déjà choisi cette même enchère lors d’une séance précédente. Reprends le critère de décision.':null,
      checkNext:r.checkNext};
  }
  return Object.freeze({schema,explain});
});
