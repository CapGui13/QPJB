#!/usr/bin/env python3
"""Read-only QUICK/UI structural gate; failures are blocking, never a fallback PASS."""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path, PurePosixPath
from urllib.parse import urlsplit
from PIL import Image

RASTER = {".png": "PNG", ".jpg": "JPEG", ".jpeg": "JPEG", ".gif": "GIF", ".webp": "WEBP"}
CSS = {"qpjb-bridge-ui.css", "qpjb-design-tokens.css"}
SESSION = re.compile(r"(?:Séance [0-9]+-[0-9]{2} (?:Aix|Mumu)|SDE (?:Jan|Feb|Fév|Mar|Apr|Avr|May|Mai|Jun|Juin|Jul|Juil|Aug|Aoû|Sep|Sept|Oct|Nov|Dec|Déc) [0-9]{2})")
SHA = re.compile(r"[0-9a-f]{40}")
RANKS = "AKQJT98765432"

def require(ok, message):
    if not ok:
        raise ValueError(message)

def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args])

def kind(path):
    p = PurePosixPath(path)
    require(str(p) == path and not p.is_absolute() and "\\" not in path
            and not any(x in {".", ".."} for x in p.parts)
            and not any(ord(c) < 32 or ord(c) == 127 for c in path), f"unsafe path: {path!r}")
    if path in CSS:
        return "css"
    if path == "index.html":
        return "home"
    if path == "config.json":
        return "config"
    if len(p.parts) == 2 and p.parts[0] == "Docs" and not p.name.startswith(".") and p.suffix.lower() in RASTER:
        return "image"
    if len(p.parts) == 2 and SESSION.fullmatch(p.parts[0]):
        if p.name == ".seance-vide":
            return "marker"
        if not p.name.startswith(".") and p.suffix.lower() == ".pbn":
            return "pbn"
    raise ValueError(f"outside QUICK/UI scope: {path}")

def changes(root, base, head):
    # Disable similarity heuristics: renames/copies are safely evaluated as
    # independent removals/additions, including both paths and both modes.
    raw = git(root, "diff", "--raw", "--no-abbrev", "--no-renames", "-z", base, head, "--")
    if not raw:
        return []
    fields = raw.decode("utf-8", errors="strict").split("\0")
    require(fields.pop() == "" and len(fields) % 2 == 0, "invalid raw diff")
    result = []
    for meta, path in zip(fields[::2], fields[1::2]):
        old, new, oldsha, newsha, status = meta.removeprefix(":").split()
        require(meta.startswith(":") and status in {"A", "M", "D"}, f"unsupported change: {meta}")
        require((old, new) == {"A": ("000000", "100644"), "M": ("100644", "100644"),
                               "D": ("100644", "000000")}[status], f"unsafe file mode: {path}")
        category = kind(path)
        require(category not in {"css", "home", "config"} or status == "M", f"required file removed/added: {path}")
        result.append((status, path, category))
    return result

def decode_pbn(data):
    require(data and not any(c < 32 and c not in (9, 10, 13) for c in data), "empty/binary PBN")
    declared = re.search(rb"charset\s*=\s*([A-Za-z0-9_-]+)", data[:4096], re.I)
    encoding = declared.group(1).decode("ascii").lower() if declared else None
    if encoding in {"iso-8859-1", "latin1", "latin-1"}:
        return data.decode("iso-8859-1")
    if encoding in {"windows-1252", "cp1252"}:
        return data.decode("cp1252")
    require(encoding in {None, "utf-8", "utf8"}, f"unsupported PBN charset: {encoding}")
    try:
        return data.decode("utf-8-sig")
    except UnicodeDecodeError:
        if encoding:
            raise
        return data.decode("cp1252")

def check_pbn(path):
    text = decode_pbn(path.read_bytes()).replace("\r\n", "\n").replace("\r", "\n")
    # Escape lines and PBN comments may themselves contain tag-like text.
    text = re.sub(r"(?m)^[ \t]*%[^\r\n]*", "", text)
    text = re.sub(r'\{[^}]*\}|;[^\r\n]*', "", text)
    tags = re.findall(r'(?m)^[ \t]*\[([A-Za-z][A-Za-z0-9_]*)[ \t]+"((?:\\.|[^"\\])*)"[ \t]*\][ \t]*$', text)
    deals = [v for k, v in tags if k.lower() == "deal"]
    require(deals and len(deals) == len(re.findall(r"(?mi)^[ \t]*\[Deal\b", text)), "missing/malformed Deal tag")
    for deal in deals:
        m = re.fullmatch(r"([NESW]):\s*(.+)", deal)
        require(m, f"bad Deal direction: {deal}")
        hands = m.group(2).split()
        require(len(hands) == 4, "expected four hands")
        seen = set()
        for hand in hands:
            suits = hand.split(".")
            require(len(suits) == 4, f"expected four suits: {hand}")
            cards = [(i, rank) for i, ranks in enumerate(suits) for rank in ranks]
            require(len(cards) == 13, f"expected 13 cards: {hand}")
            for card in cards:
                require(card[1] in RANKS and card not in seen, f"invalid/duplicate card: {card}")
                seen.add(card)
        require(len(seen) == 52, "incomplete deal")
    return len(deals)

def check_image(path):
    expected = RASTER[path.suffix.lower()]
    # Pillow's decompression-bomb warning is elevated to an error.
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("error", Image.DecompressionBombWarning)
        with Image.open(path) as image:
            require(image.format == expected, f"image format mismatch: {image.format} != {expected}")
            image.verify()
        with Image.open(path) as image:
            for i in range(getattr(image, "n_frames", 1)):
                image.seek(i)
                image.load()
                require(image.width > 0 and image.height > 0, "invalid image dimensions")

def home_presentation(text):
    def style(match):
        require("<" not in match[1] and "\0" not in match[1], "unsafe inline style")
        return "<style>__QPJB_STYLE__</style>"
    text, styles = re.subn(r"<style>(.*?)</style>", style, text, flags=re.S)
    text, titles = re.subn(r"<title>[^<>&\r\n]+</title>", "<title>__QPJB_TITLE__</title>", text)
    require(styles == 2 and titles == 1, "unexpected home structure")
    return text


def check_config(path):
    import unicodedata
    def unique(pairs):
        result = {}
        for key, value in pairs:
            require(key not in result, "duplicate config key: " + key)
            result[key] = value
        return result
    cfg = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique)
    require(isinstance(cfg, dict) and set(cfg) == {"descriptions", "links"}, "unexpected config schema")
    require(all(isinstance(cfg[k], dict) for k in cfg), "invalid config maps")
    for key, value in cfg["descriptions"].items():
        require(SESSION.fullmatch(key) and isinstance(value, str) and len(value) <= 500
                and not any(c in "<>" or unicodedata.category(c) in {"Cc", "Cf"} for c in value), "invalid description: " + key)
    for key, value in cfg["links"].items():
        folder, sep, board = key.rpartition("/")
        require(sep and SESSION.fullmatch(folder) and re.fullmatch(r"B[0-9]+", board), "invalid link key: " + key)
        require(isinstance(value, str) and re.fullmatch(r"https://bridge-training\.com/player/index\.php\?dds=[A-Za-z0-9]+", value), "invalid Bridge Training link: " + key)


def verify_catalogue(root, head):
    catalogue = json.loads((root / "catalogue.json").read_text(encoding="utf-8"))
    require(json.loads((root / "site-version.json").read_text()) == {"revision": head}, "wrong generated revision")
    boards = set()
    for session in catalogue["seances"]:
        for entry in session["fichiers"]:
            prefix = Path(entry["name"]).stem.split(" - ", 1)[0]
            key = session["folder"] + "/" + prefix
            require(key not in boards, f"ambiguous board identifier: {key}")
            boards.add(key)
    for key, value in catalogue["playLinks"].items():
        require(key in boards, f"orphan play link: {key}")
        url = urlsplit(value)
        require(url.scheme == "https" and url.hostname and not url.username and not url.password,
                f"unsafe play link: {key}")
    # Existing descriptions may be maintained ahead of future sessions;
    # they are not download links. Existing public builder checks exact
    # tracked images/PBN, aliases, mandatory resources, and all local paths.

def run(root, base, head):
    require(SHA.fullmatch(base) and SHA.fullmatch(head), "full lowercase SHA required")
    for ref in (base, head):
        require(git(root, "rev-parse", "--verify", ref + "^{commit}").decode().strip() == ref, "not exact commit")
    require(git(root, "rev-parse", "HEAD").decode().strip() == head, "checkout must equal head")
    require(not git(root, "status", "--porcelain", "-z", "--untracked-files=no"), "dirty tracked checkout")
    subprocess.run(["git", "-C", str(root), "merge-base", "--is-ancestor", base, head], check=True)
    items = changes(root, base, head)
    with tempfile.TemporaryDirectory(prefix="qpjb-quick-") as tmp:
        work = Path(tmp) / "checkout"
        subprocess.run(["git", "clone", "--quiet", "--shared", "--no-checkout", str(root), str(work)], check=True)
        subprocess.run(["git", "-C", str(work), "checkout", "--quiet", "--detach", head], check=True)
        for status, name, category in items:
            if status == "D":
                continue
            path = work / name
            require(path.is_file() and not path.is_symlink(), f"not regular: {name}")
            try:
                if category == "pbn":
                    check_pbn(path)
                elif category == "image":
                    check_image(path)
                elif category == "marker":
                    require(path.stat().st_size == 0, "nonempty session marker")
                elif category == "css":
                    require(path.stat().st_size and "\0" not in path.read_text(encoding="utf-8"), "invalid CSS")
                elif category == "home":
                    old = git(root, "show", base + ":index.html").decode("utf-8")
                    new = path.read_bytes().decode("utf-8")
                    require(home_presentation(old) == home_presentation(new), "home structure or code changed")
                    subprocess.run(["node", "scripts/v2-integration-guard.cjs"], cwd=work, check=True)
                elif category == "config":
                    check_config(path)
            except Exception as exc:
                raise ValueError(f"{name}: {exc}") from exc
        subprocess.run([sys.executable, "scripts/build_catalogue.py"], cwd=work, check=True)
        verify_catalogue(work, head)
        # Reuse the historical archive/link/offline validation, not its
        # optional relocation-specific snapshot check.
        subprocess.run([sys.executable, "tests/repository-layout.py"], cwd=work, check=True)
        dirty = git(work, "diff", "--name-only", "-z").decode().split("\0")
        require(set(dirty) <= {"", "catalogue.json", "site-version.json"}, "builder mutated source files")
    print(f"QUICK_PASS base={base} head={head} changes={len(items)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", required=True)
    args = parser.parse_args()
    try:
        run(Path.cwd(), args.base, args.head)
    except Exception as exc:
        print(f"QUICK_FAIL: {exc}", file=sys.stderr)
        sys.exit(1)
