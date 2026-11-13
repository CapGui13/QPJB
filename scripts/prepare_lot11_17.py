#!/usr/bin/env python3
"""One-shot LOT11 publication builder; isolates the 1274 historical QCM unchanged.

Reads source from the frozen PR #122 Git commit. The resulting publication is
NOT the 20-question blind V4 kit: it is a separate, editorial 17-question cut.
"""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "quizz.html"
SOURCE_BRANCH = "refs/heads/audit/quiz-sef-lot11-20-prelecture-20261110"
SOURCE_SHA = "81509961c7eaa27e203206bdb34ff6480ab0d24a"
EXCLUDED = {"SEF-L04-019", "SEF-L05-010", "SEF-L07-026"}
SUITS = ["♠", "♥", "♦", "♣"]
RANKS = ("A", "R", "D", "V", "10", "9", "8", "7", "6", "5", "4", "3", "2")
RANK_ORDER = {value: rank for rank, value in enumerate(RANKS)}
HONORS = {"A": 4, "R": 3, "D": 2, "V": 1}
EXTRACT = re.compile(r'<script\b(?=[^>]*\bid=["\']training-data["\'])[^>]*>(.*?)</script\s*>', re.I | re.S)


def extract(html: str) -> tuple[re.Match[str], dict]:
    match = EXTRACT.search(html)
    if match is None:
        raise ValueError("training-data JSON absent")
    data = json.loads(match.group(1))
    if not isinstance(data.get("exercises"), list):
        raise ValueError("Tableau des exercices introuvable")
    return match, data


def exercise_array_end(raw: str) -> int:
    """Locate closing ] of the *top-level* exercises array without reserializing QCM."""
    pattern = '"exercises":['
    start = raw.find(pattern)
    if start == -1 or raw.find(pattern, start + 1) != -1:
        raise ValueError("Impossible d'isoler exercises")
    depth = 1
    in_string = escaped = False
    for i in range(start + len(pattern), len(raw)):
        c = raw[i]
        if in_string:
            if escaped:
                escaped = False
            elif c == "\\":
                escaped = True
            elif c == '"':
                in_string = False
        elif c == '"':
            in_string = True
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("Tableau exercises non fermé")


def render(original_html: str, source_html: str) -> tuple[str, list[str]]:
    main_match, main = extract(original_html)
    _, source = extract(source_html)
    if len(main["exercises"]) != 1274 or len(source["exercises"]) != 1294:
        raise ValueError("Taille inattendue : refus de toucher au catalogue")
    current_ids = {x["id"] for x in main["exercises"]}
    new = [q for q in source["exercises"] if q["id"] not in current_ids]
    if len(new) != 20 or not EXCLUDED.issubset({q["id"] for q in new}):
        raise ValueError("20 candidats LOT11 introuvables ou exclus manquants")

    selected = []
    card_corrected = []
    for question in new:
        if question["id"] in EXCLUDED:
            continue
        q = json.loads(json.dumps(question, ensure_ascii=False))
        original_hand = q["hand"]
        q["hand"] = [sorted(suit, key=lambda c: RANK_ORDER[c]) for suit in original_hand]
        if q["hand"] != original_hand:
            card_corrected.append(q["id"])
        if q["id"] == "SEF-L03-005":
            q["context"] = ("Vous êtes donneur avec la main affichée, notamment une très longue "
                            "couleur à Carreau. Après avoir calculé vous-même les points H et "
                            "les points de longueur HL, quelle ouverture choisissez-vous "
                            "dans le SEF 2024 ?")
            q["difficulty"] = 4
        if q["id"] == "SEF-L09-023":
            q["context"] = ("Nord ouvre de 2♥ faible (six cartes à Cœur, 6–10 H) et Est "
                            "passe. Avec la main affichée, à vulnérabilité N/S vulnérables "
                            "et E/O non vulnérables, quelle est votre réponse ?")
        if len(q["hand"]) != 4 or sum(map(len, q["hand"])) != 13:
            raise ValueError(f"Main incohérente {q['id']}")
        if q["shape"] != [len(s) for s in q["hand"]]:
            raise ValueError(f"Distribution incohérente {q['id']}")
        if q["h"] != sum(HONORS.get(c, 0) for suit in q["hand"] for c in suit):
            raise ValueError(f"Points H incohérents {q['id']}")
        if len(q["choices"]) != 4 or q["choices"].count(q["answer"]) != 1:
            raise ValueError(f"Propositions incohérentes {q['id']}")
        selected.append(q)
    if len(selected) != 17 or set(q["id"] for q in selected) & current_ids:
        raise ValueError("La sélection n'est pas de 17 nouveaux QCM")

    raw = main_match.group(1)
    end = exercise_array_end(raw)
    additions = ",".join(json.dumps(q, ensure_ascii=False, separators=(",", ":")) for q in selected)
    new_raw = raw[:end] + "," + additions + raw[end:]
    old_desc = json.dumps(main["description"], ensure_ascii=False)
    new_desc = json.dumps("QPJB — 1291 QCM : 1274 exercices précédemment publiés conservés et "
                          "17 exercices du LOT 11 sélectionnés.", ensure_ascii=False)
    if new_raw.count(old_desc) != 1:
        raise ValueError("Métadonnées de description ambiguës")
    new_raw = new_raw.replace(old_desc, new_desc, 1)
    after = json.loads(new_raw)
    if len(after["exercises"]) != 1291 or after["exercises"][:1274] != main["exercises"]:
        raise ValueError("Le catalogue historique a été modifié ou le total est incorrect")
    all_ids = [q["id"] for q in after["exercises"]]
    if len(all_ids) != len(set(all_ids)):
        raise ValueError("Collision d'IDs")
    if after["exercises"][1274:] != selected:
        raise ValueError("QCM ajoutés ne correspondent pas à la sélection")
    output = original_html[:main_match.start(1)] + new_raw + original_html[main_match.end(1):]
    print(f"LOT11 prêt : 1274 historiques inchangés + 17 nouveaux = 1291 ; "
          f"cartes corrigées : {card_corrected}; exclus : {sorted(EXCLUDED)}")
    return output, [q["id"] for q in selected]


def main() -> None:
    if not HTML.exists():
        raise SystemExit(f"Fichier absent : {HTML}")
    subprocess.run(["git", "fetch", "--no-tags", "--depth=1", "origin", SOURCE_BRANCH],
                   cwd=ROOT, check=True)
    sha = subprocess.check_output(["git", "rev-parse", "FETCH_HEAD"], cwd=ROOT, text=True).strip()
    if sha != SOURCE_SHA:
        raise ValueError("La source LOT11 V4 a été modifiée : stop")
    old_html = subprocess.check_output(["git", "show", "FETCH_HEAD:quizz.html"], cwd=ROOT)
    output, ids = render(HTML.read_text(encoding="utf-8"), old_html.decode("utf-8"))
    HTML.write_text(output, encoding="utf-8")
    print("IDs sélectionnés : " + ", ".join(ids))


if __name__ == "__main__":
    main()