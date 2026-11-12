#!/usr/bin/env python3
"""Diagnostic FORMEL (non pédagogique) des enchères des QCM QPJB.

Conçu pour compléter verify_quiz_sef.py sans modifier les sujets.
Par défaut les anomalies sont informatives (exit 0) ; --strict les rend bloquantes.
Le modèle des rôles « Adversaire » vérifie une rotation N/E/S/O compatible,
mais ne prétend pas déterminer Est et Ouest à partir du texte.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

DENOMS = {"♣": 0, "♦": 1, "♥": 2, "♠": 3, "SA": 4}
CONTRAT = re.compile(r"([1-7])(♣|♦|♥|♠|SA)")
COMMENTAIRE = re.compile(r"\s*\([^()]*\)\s*$")
ROLES = {"Vous": 0, "Partenaire": 2, "Adversaire": None}


def parse_bid(value: object) -> tuple[str, int | None]:
    """Retourne (nature, valeur croissante), ou (INCONNU, None).

    Seules les annonces canoniques et une annotation finale entre parenthèses
    sont reconnues. Aucune déduction de légalité sur du texte non compris.
    """
    if not isinstance(value, str):
        return "INCONNU", None
    bid = COMMENTAIRE.sub("", value.strip()).strip()
    if bid in ("Passe", "Contre", "Surcontre"):
        return bid, None
    m = CONTRAT.fullmatch(bid)
    if m:
        return "CONTRAT", int(m[1]) * 5 + DENOMS[m[2]]
    return "INCONNU", None


def compatible_next_you(roles: list[str]) -> bool:
    """Existe-t-il une place initiale telle que Sud soit le prochain à parler ?"""
    for start in range(4):
        if (start + len(roles)) % 4 != 0:  # prochain joueur : Vous = Sud
            continue
        if all((start + i) % 4 == ROLES[role] if ROLES[role] is not None
               else (start + i) % 4 in (1, 3)
               for i, role in enumerate(roles)):
            return True
    return False


def inspect_question(q: dict) -> dict:
    """Analyse séquence + quatre choix ; le corrigé n'est jamais utilisé pour décider.

    `NON_ANALYSABLE` est explicitement distingué de « aucune anomalie ».
    """
    qid = q.get("id", "ID_ABSENT")
    auction = q.get("auction")
    choices = q.get("choices")
    if not isinstance(auction, list) or not isinstance(choices, list):
        return {"id": qid, "status": "NON_ANALYSABLE", "anomalies": [],
                "limitations": ["Séquence ou propositions absentes / non structurées"],
                "checked_choices": 0}
    roles: list[str] = []
    actions: list[tuple[str, int | None]] = []
    limitations: list[str] = []
    for i, entry in enumerate(auction, 1):
        if not isinstance(entry, str) or ":" not in entry:
            limitations.append(f"Annonce {i} sans rôle exploitable")
            continue
        role, raw = (part.strip() for part in entry.split(":", 1))
        kind, value = parse_bid(raw)
        if role not in ROLES or kind == "INCONNU":
            limitations.append(f"Annonce {i} non reconnue")
        roles.append(role)
        actions.append((kind, value))
    parsed_choices = [parse_bid(c) for c in choices]
    if any(k == "INCONNU" for k, _ in parsed_choices):
        limitations.append("Une proposition n'est pas une annonce canonique")
    if len(choices) != 4:
        limitations.append("Nombre de propositions différent de quatre")
    if limitations:
        return {"id": qid, "status": "NON_ANALYSABLE", "anomalies": [],
                "limitations": limitations, "checked_choices": 0}
    anomalies: list[str] = []
    if not compatible_next_you(roles):
        anomalies.append("Rotation incompatible avec le prochain tour de Vous")
    contract_value: int | None = None
    contract_side: str | None = None
    double_state: str | None = None
    passes = 0
    ended = False
    for i, (role, (kind, value)) in enumerate(zip(roles, actions), 1):
        if ended:
            anomalies.append(f"Annonce {i} après clôture des enchères")
            continue
        side = "NS" if role in ("Vous", "Partenaire") else "EO"
        if kind == "CONTRAT":
            if contract_value is not None and value <= contract_value:
                anomalies.append(f"Annonce {i} : contrat non supérieur au précédent")
            contract_value, contract_side, double_state, passes = value, side, None, 0
        elif kind == "Contre":
            if contract_value is None or side == contract_side or double_state is not None:
                anomalies.append(f"Annonce {i} : Contre interdit")
            double_state, passes = "Contre", 0
        elif kind == "Surcontre":
            if contract_value is None or side != contract_side or double_state != "Contre":
                anomalies.append(f"Annonce {i} : Surcontre interdit")
            double_state, passes = "Surcontre", 0
        elif kind == "Passe":
            passes += 1
            if passes >= (3 if contract_value is not None else 4):
                ended = True
    if ended:
        anomalies.append("La séquence est déjà terminée avant le choix demandé")
    illegal_choices: list[str] = []
    for choice, (kind, value) in zip(choices, parsed_choices):
        illegal = ended
        if kind == "CONTRAT":
            illegal |= contract_value is not None and value <= contract_value
        elif kind == "Contre":
            illegal |= (contract_value is None or contract_side == "NS"
                        or double_state is not None)
        elif kind == "Surcontre":
            illegal |= (contract_value is None or contract_side != "NS"
                        or double_state != "Contre")
        if illegal:
            illegal_choices.append(choice)
    if illegal_choices:
        anomalies.append("Propositions illégales : " + ", ".join(illegal_choices))
    return {"id": qid, "status": "ANOMALIE" if anomalies else "CONFORME",
            "anomalies": anomalies, "limitations": [], "checked_choices": len(choices)}


def load_html(path: Path) -> list[dict]:
    html = path.read_text(encoding="utf-8")
    match = re.search(r'<script\b(?=[^>]*\bid=["\']training-data["\'])[^>]*>(.*?)</script\s*>',
                      html, re.IGNORECASE | re.DOTALL)
    if not match:
        raise ValueError("training-data absent du HTML")
    data = json.loads(match[1])
    if not isinstance(data, dict) or not isinstance(data.get("exercises"), list):
        raise ValueError("training-data.exercises n'est pas une liste")
    return data["exercises"]


def audit(items: list, source: str) -> dict:
    rows = [inspect_question(q) if isinstance(q, dict) else
            {"id": "NON_OBJET", "status": "NON_ANALYSABLE", "anomalies": [],
             "limitations": ["Entrée non objet"], "checked_choices": 0}
            for q in items]
    return {"source": source, "count": len(rows),
            "conformes": sum(r["status"] == "CONFORME" for r in rows),
            "anomalies": sum(r["status"] == "ANOMALIE" for r in rows),
            "non_analysables": sum(r["status"] == "NON_ANALYSABLE" for r in rows),
            "choices_checked": sum(r["checked_choices"] for r in rows),
            "details": [r for r in rows if r["status"] != "CONFORME"]}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html", type=Path)
    parser.add_argument("--staging", action="append", type=Path, default=[])
    parser.add_argument("--json-out", type=Path)
    parser.add_argument("--strict", action="store_true", help="Échec de sortie si anomalie ou non-analysable")
    args = parser.parse_args(argv)
    if args.html is None and not args.staging:
        parser.error("Indiquer --html et/ou --staging")
    try:
        reports = []
        if args.html:
            reports.append(audit(load_html(args.html), args.html.name))
        for path in args.staging:
            stage = json.loads(path.read_text(encoding="utf-8"))
            if not isinstance(stage, list):
                raise ValueError(f"{path} : liste de candidats attendue")
            reports.append(audit(stage, path.name))
        if args.json_out:
            args.json_out.parent.mkdir(parents=True, exist_ok=True)
            args.json_out.write_text(json.dumps(reports, ensure_ascii=False, indent=2) + "\n",
                                     encoding="utf-8")
        for r in reports:
            print(f"{r['source']}: {r['count']} QCM ; {r['conformes']} conformes, "
                  f"{r['anomalies']} anomalies, {r['non_analysables']} non analysables ; "
                  f"{r['choices_checked']} propositions analysées")
            for d in r["details"][:15]:
                print(f"  {d['id']}: {d['status']} ; "
                      + "; ".join(d["anomalies"] + d["limitations"]))
        print("Diagnostic formel uniquement : ni contrôle SEF ni verdict pédagogique.")
        if args.strict and any(r["anomalies"] or r["non_analysables"] for r in reports):
            return 1
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"ERREUR : {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())