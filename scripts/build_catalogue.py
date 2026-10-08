#!/usr/bin/env python3
"""Reconstruit le catalogue public de QPJB sans appel à l'API GitHub côté visiteurs."""
import json
from pathlib import Path
from urllib.parse import quote

root = Path(__file__).resolve().parents[1]
seances = []
for folder in sorted(root.iterdir(), key=lambda p: p.name.casefold()):
    if not folder.is_dir() or folder.name.startswith(".") or folder.name in {"Docs", "scripts"}:
        continue
    fichiers = [
        {"name": f.name, "download_url": "./" + quote(folder.name, safe="") + "/" + quote(f.name, safe="")}
        for f in sorted(folder.iterdir(), key=lambda p: p.name.casefold())
        if f.is_file() and f.suffix.lower() == ".pbn"
    ]
    if fichiers:
        seances.append({"folder": folder.name, "fichiers": fichiers})

docs = root / "Docs"
extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
images = [
    {"name": f.name, "url": "./Docs/" + quote(f.name, safe="")}
    for f in sorted(docs.iterdir(), key=lambda p: p.name.casefold())
    if f.is_file() and f.suffix.lower() in extensions
] if docs.is_dir() else []
cfg_path = root / "config.json"
cfg = json.loads(cfg_path.read_text(encoding="utf-8")) if cfg_path.exists() else {}
catalogue = {
    "version": 1,
    "seances": seances,
    "images": images,
    "playLinks": cfg.get("links", {}),
    "descMap": cfg.get("descriptions", {})
}
if not seances:
    raise SystemExit("Aucune séance PBN détectée : catalogue non remplacé")
(root / "catalogue.json").write_text(
    json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"Catalogue QPJB : {len(seances)} séances, {len(images)} documents")
