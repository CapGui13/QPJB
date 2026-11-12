#!/usr/bin/env python3
"""Validation mécanique du Quiz SEF QPJB (bibliothèque standard uniquement).

Usage:
  python scripts/verify_quiz_sef.py --html quizz.html
  python scripts/verify_quiz_sef.py --html quizz.html --staging lot11.json --staging lot12.json

Les doublons de compétence et la justesse des enchères ne se valident pas
mécaniquement : les alertes pédagogiques n'équivalent jamais à des avis CE.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

HONORS = {"A": 4, "R": 3, "D": 2, "V": 1}
RANKS = ("A", "R", "D", "V", "10", "9", "8", "7", "6", "5", "4", "3", "2")
RANK_INDEX = {rank: i for i, rank in enumerate(RANKS)}
SUITS = "♠♥♦♣"
# Choix canoniques pris en charge par le Quiz SEF et son clavier d’enchères.
BID_RE = re.compile(r"(?:[1-7](?:SA|♣|♦|♥|♠)|Passe|Contre|Surcontre)\Z")
SCRIPT_RE = re.compile(
    r'<script\b(?=[^>]*\bid=["\']training-data["\'])([^>]*)>(.*?)</script\s*>',
    re.IGNORECASE | re.DOTALL,
)


def load_catalogue(html_path: Path) -> tuple[list[dict], set[str], str]:
    html = html_path.read_text(encoding="utf-8")
    match = SCRIPT_RE.search(html)
    if not match:
        raise ValueError("Aucun script JSON id='training-data' dans le HTML")
    payload = json.loads(match.group(2))
    if not isinstance(payload, dict) or not isinstance(payload.get("exercises"), list):
        raise ValueError("Le JSON training-data ne contient pas d'array exercises")
    themes = {t.get("id") for t in payload.get("themes", []) if isinstance(t, dict)}
    return payload["exercises"], themes, str(payload.get("version", ""))


def auction_signature(auction: object) -> str:
    """Signature heuristique : conserve rôles et enchères; ignore les Passe.

    Ne pas comparer une ouverture adverse à une ouverture partenaire comme un
    doublon. Ce signal n'est pas une preuve d'équivalence pédagogique.
    """
    if not isinstance(auction, list):
        return ""
    sig = []
    for call in auction:
        if not isinstance(call, str):
            continue
        role, sep, rest = call.partition(":")
        bid = re.search(r"Surcontre|Contre|Passe|[1-7](?:SA|♣|♦|♥|♠)", rest or role)
        if bid and bid.group() != "Passe":
            sig.append(f"{role.strip() if sep else '?'}:{bid.group()}")
    return "|".join(sig)


def inspect(exercises: list, *, source: str, known_themes: set[str],
            taken_ids: set[str] | None = None,
            published: dict[tuple[str, str], list[dict]] | None = None) -> dict:
    errors: list[str] = []
    warnings: list[str] = []
    seen: set[str] = set()
    duplicates: list[dict] = []
    wrong_order = 0
    for index, item in enumerate(exercises):
        if not isinstance(item, dict):
            errors.append(f"{source}[{index}] : objet JSON attendu")
            continue
        qid = item.get("id")
        if not isinstance(qid, str) or not qid:
            errors.append(f"{source}[{index}] : ID absent ou invalide")
            continue
        if qid in seen:
            errors.append(f"{qid} : ID répété dans {source}")
        seen.add(qid)
        if taken_ids is not None and qid in taken_ids:
            errors.append(f"{qid} : ID déjà présent dans le catalogue/lot précédent")
        if known_themes and item.get("theme") not in known_themes:
            errors.append(f"{qid} : thème inconnu {item.get('theme')!r}")
        hand = item.get("hand")
        if not isinstance(hand, list) or len(hand) != 4 or any(not isinstance(s, list) for s in hand):
            errors.append(f"{qid} : main non composée de quatre couleurs")
            continue
        cards = [(suit, str(card)) for suit, ranks in enumerate(hand) for card in ranks]
        if any(not isinstance(card, str) for ranks in hand for card in ranks):
            errors.append(f"{qid} : les cartes doivent être des chaînes de caractères")
        if len(cards) != 13:
            errors.append(f"{qid} : {len(cards)} cartes au lieu de 13")
        if len(set(cards)) != len(cards):
            errors.append(f"{qid} : doublon de carte dans la main")
        if any(card not in RANK_INDEX for _, card in cards):
            errors.append(f"{qid} : rang de carte inconnu")
        actual_h = sum(HONORS.get(card, 0) for _, card in cards)
        if type(item.get("h")) is not int or item["h"] != actual_h:
            errors.append(f"{qid} : H déclarés {item.get('h')!r} ≠ {actual_h}")
        actual_shape = [len(ranks) for ranks in hand]
        if item.get("shape") != actual_shape:
            errors.append(f"{qid} : forme {item.get('shape')!r} ≠ {actual_shape}")
        for suit_index, ranks in enumerate(hand):
            vals = [RANK_INDEX.get(str(rank), 99) for rank in ranks]
            if vals != sorted(vals):
                wrong_order += 1
                warnings.append(f"{qid} : ordre des cartes {SUITS[suit_index]} incorrect")
        choices = item.get("choices")
        if (not isinstance(choices, list) or len(choices) != 4
                or not all(isinstance(c, str) and c.strip() for c in choices)
                or len(set(choices)) != 4):
            errors.append(f"{qid} : quatre choix non vides, textuels et distincts attendus")
        else:
            if any(BID_RE.fullmatch(c) is None for c in choices):
                errors.append(f"{qid} : proposition qui n'est pas une enchère SEF reconnue")
            if choices.count(item.get("answer")) != 1:
                errors.append(f"{qid} : la clé n'apparaît pas exactement une fois dans les choix")
        if (not isinstance(item.get("auction"), list)
                or not all(isinstance(call, str) for call in item["auction"])):
            errors.append(f"{qid} : liste auction de chaînes attendue")
        if not isinstance(item.get("context"), str) or not item["context"].strip():
            errors.append(f"{qid} : énoncé vide")
        if not isinstance(item.get("explain"), str) or not item["explain"].strip():
            errors.append(f"{qid} : explication vide")
        if type(item.get("difficulty")) is not int or item["difficulty"] not in (1, 2, 3, 4, 5):
            errors.append(f"{qid} : difficulté invalide")
        if published is not None:
            key = (auction_signature(item.get("auction")), str(item.get("answer")))
            matches = published.get(key, [])
            if matches:
                duplicates.append({"id": qid, "published_ids": [x["id"] for x in matches],
                                   "status": "À_EXAMINER_MANUELLEMENT"})
    return {"source": source, "count": len(exercises), "ids": seen,
            "errors": errors, "warnings": warnings, "wrong_card_order": wrong_order,
            "pedagogical_overlap_signals": duplicates}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html", type=Path, required=True, help="quizz.html publié")
    parser.add_argument("--staging", type=Path, action="append", default=[], help="lot JSON (répétable)")
    parser.add_argument("--json-out", type=Path, help="rapport JSON reproductible")
    args = parser.parse_args()
    try:
        exercises, themes, version = load_catalogue(args.html)
        baseline = inspect(exercises, source="main", known_themes=themes)
        # Les cartes sont affichées dans l'ordre du JSON : contrairement aux choix,
        # l'interface ne les retrie pas. Erreur bloquante en catalogue et en staging.
        if baseline["wrong_card_order"]:
            baseline["errors"].append(
                f"main : {baseline['wrong_card_order']} couleur(s) aux cartes mal classées"
            )
        index = defaultdict(list)
        for ex in exercises:
            if isinstance(ex, dict) and isinstance(ex.get("id"), str):
                index[(auction_signature(ex.get("auction")), str(ex.get("answer")))].append(ex)
        known_ids = set(baseline["ids"])
        staged = []
        for path in args.staging:
            candidates = json.loads(path.read_text(encoding="utf-8"))
            if not isinstance(candidates, list):
                raise ValueError(f"{path} : tableau d'objets QCM attendu")
            result = inspect(candidates, source=path.name, known_themes=themes,
                             taken_ids=known_ids, published=index)
            if result["wrong_card_order"]:
                result["errors"].append(
                    f"{path.name} : {result['wrong_card_order']} couleur(s) aux cartes mal classées"
                )
            staged.append(result)
            known_ids.update(result["ids"])
        summary = {
            "catalogue": {"count": baseline["count"], "version": version,
                          "errors": baseline["errors"], "warnings": baseline["warnings"]},
            "staging": [{k: v for k, v in x.items() if k != "ids"} for x in staged],
            "important": "Les chevauchements de séquence et de clé ne prouvent PAS un doublon pédagogique ; vérifier les rôles, siège, distribution, seuil, conventions, et faire une CE réellement indépendante.",
        }
        if args.json_out:
            args.json_out.parent.mkdir(parents=True, exist_ok=True)
            args.json_out.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        total_errors = len(baseline["errors"]) + sum(len(x["errors"]) for x in staged)
        total_warnings = len(baseline["warnings"]) + sum(len(x["warnings"]) for x in staged)
        print(f"Quiz SEF : catalogue={baseline['count']}, lots={len(staged)}, "
              f"erreurs={total_errors}, avertissements={total_warnings}")
        for entry in [baseline, *staged]:
            for error in entry["errors"][:30]:
                print("ERREUR :", error, file=sys.stderr)
            if len(entry["errors"]) > 30:
                print(f"... +{len(entry['errors'])-30} autres erreurs", file=sys.stderr)
            if entry["pedagogical_overlap_signals"]:
                print(f"{entry['source']} : {len(entry['pedagogical_overlap_signals'])} "
                      "signalements de chevauchement à examiner (non bloquants)")
        return 1 if total_errors else 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"ERREUR : {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())