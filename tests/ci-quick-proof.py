#!/usr/bin/env python3
"""Real Git/CLI integration checks, exclusively in a disposable clone."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CHECK = ROOT / "scripts/ci-quick-check.py"
spec = importlib.util.spec_from_file_location("quick", CHECK)
quick = importlib.util.module_from_spec(spec)
spec.loader.exec_module(quick)

def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()

def expect(ok, message):
    if not ok:
        raise AssertionError(message)

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)

def main():
    base = git(ROOT, "rev-parse", "HEAD")
    with tempfile.TemporaryDirectory(prefix="qpjb-quick-proof-") as tmp:
        root = Path(tmp) / "repo"
        subprocess.run(["git", "clone", "--quiet", "--shared", "--no-checkout", str(ROOT), str(root)], check=True)
        git(root, "checkout", "--detach", base)
        git(root, "config", "user.name", "M2 disposable fixture")
        git(root, "config", "user.email", "m2@example.invalid")
        cat = json.loads((root / "catalogue.json").read_text())
        entries = [(s["folder"], f["name"]) for s in cat["seances"] for f in s["fichiers"]]
        failures = []
        for folder, name in entries:
            try:
                quick.check_pbn(root / folder / name)
            except Exception as exc:
                failures.append((folder + "/" + name, str(exc)))
        print("HISTORICAL_PBN_AUDIT", len(entries), "checked", len(failures), "exceptions", json.dumps(failures, ensure_ascii=False), flush=True)
        mumu = next(s for s in cat["seances"] if s["folder"].endswith("Mumu"))
        original = root / mumu["folder"] / mumu["fichiers"][0]["name"]
        data = original.read_bytes()
        quick.check_pbn(original)
        folder = root / mumu["folder"]
        pbn = folder / "B901 - fixture.pbn"
        image = root / "Docs" / "M2 fixture.png"
        linked_key = next(iter(cat["playLinks"]))
        linked_folder, linked_board = linked_key.rsplit("/", 1)
        linked = next(root / f / n for f, n in entries if f == linked_folder and Path(n).stem.split(" - ",1)[0] == linked_board)
        def fresh():
            git(root, "reset", "--hard", base)
            git(root, "clean", "-fd")
        def scenario(label, mutate, accepted, diagnostic=None):
            fresh()
            mutate()
            git(root, "add", "-A")
            git(root, "commit", "-m", "fixture " + label)
            head = git(root, "rev-parse", "HEAD")
            start = time.monotonic()
            p = subprocess.run([sys.executable, str(CHECK), "--base", base, "--head", head], cwd=root, text=True,
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            print(f"CASE {label}: rc={p.returncode} seconds={time.monotonic()-start:.3f}\n{p.stdout}", flush=True)
            expect((p.returncode == 0) == accepted, label + " unexpected exit")
            expect(("QUICK_PASS" in p.stdout) == accepted, label + " incorrect verdict")
            if diagnostic:
                expect(diagnostic in p.stdout, label + " did not detect intended mutation")
            expect(not git(root, "status", "--porcelain"), label + " mutated caller")
        def valid():
            write(pbn, data)
            Image.new("RGB", (12, 12), "white").save(image)
            original.rename(folder / ("B902 - renamed " + original.name))
            marker = root / "Séance 9-99 Aix" / ".seance-vide"
            write(marker, b"")
        scenario("add-image-pbn-rename-empty-session", valid, True)
        def css():
            p = root / "qpjb-bridge-ui.css"
            with p.open("a") as f:
                f.write("\n/* M2 disposable CSS test */\n")
        scenario("valid-css-ui-structure", css, True)
        def replace_image():
            first = root / "Docs" / cat["images"][0]["name"]
            Image.new("RGB", (20,20), "white").save(first)
        scenario("replace-real-image", replace_image, True)
        scenario("remove-unlinked-pbn", lambda: original.unlink(), True)
        scenario("binary-pbn", lambda: write(pbn, b"\0BROKEN"), False, "binary PBN")
        scenario("duplicate-card", lambda: write(pbn, b'[Deal "N:AKQJT98765432... AKQJT98765432... ..AKQJT98765432. ...AKQJT98765432"]\n'), False, "duplicate card")
        scenario("malformed-deal", lambda: write(pbn, b'[Deal "broken"]\n'), False, "bad Deal direction")
        scenario("fake-image", lambda: write(image, b"not an image"), False, "M2 fixture.png")
        scenario("wrong-image-format", lambda: Image.new("RGB",(10,10)).save(image,format="JPEG"), False, "format mismatch")
        scenario("orphan-play-link", lambda: linked.unlink(), False, "orphan play link")
        scenario("unsafe-svg", lambda: write(root/"Docs"/"unsafe.svg", b"<svg/>"), False, "outside QUICK/UI scope")
        scenario("unexpected-file", lambda: write(root/"unknown.txt",b"not allowed"), False, "outside QUICK/UI scope")
        scenario("symlink", lambda: image.symlink_to(original), False, "unsafe file mode")
        scenario("nonempty-marker", lambda: write(root/"Séance 9-99 Aix"/".seance-vide",b"x"), False, "nonempty session marker")
        def config_change(value=None, orphan=False):
            p = root / "config.json"
            cfg = json.loads(p.read_text(encoding="utf-8"))
            if value is not None:
                cfg["links"][linked_key] = value
            elif orphan:
                cfg["links"]["SDE Nov 26/B999"] = "https://bridge-training.com/player/index.php?dds=abc"
            else:
                cfg["descriptions"][mumu["folder"]] = "Description modifiée"
            p.write_text(json.dumps(cfg, ensure_ascii=False), encoding="utf-8")
        scenario("valid-config-description", config_change, True)
        scenario("invalid-config-link", lambda: config_change("javascript:alert(1)"), False, "invalid Bridge Training link")
        scenario("config-orphan-link", lambda: config_change(orphan=True), False, "orphan play link")
        scenario("special-session-pbn", lambda: write(root / "SDE Nov 26" / "B901 - fixture.pbn", data), True)
        def home_change(unsafe=False):
            p = root / "index.html"
            text = p.read_text(encoding="utf-8")
            text = text.replace("<title>", '<title>Test ') if not unsafe else text.replace('<title>', '<script>alert(1)</script><title>')
            p.write_text(text, encoding="utf-8")
        scenario("valid-home-title", home_change, True)
        scenario("unsafe-home-script", lambda: home_change(True), False, "home structure or code changed")
        print("QUICK_PROOF_PASS 20 cases", flush=True)

if __name__ == "__main__":
    main()
