#!/usr/bin/env python3
"""Recette native D, depuis le dépôt Git sur la branche audit; n'écrit aucun fichier commun."""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip())
BASE = "ccd8f20811b9531bbfccb8352ec60953dd7d07cb"
HERE = ROOT / "audits/audit3000-20261127/D"
def git_show(path):
    return subprocess.check_output(["git", "show", f"{BASE}:{path}"], cwd=ROOT, text=True, encoding="utf-8")
def run(args):
    print("+", " ".join(map(str, args)), flush=True)
    subprocess.run([str(x) for x in args], cwd=ROOT, check=True)
def load(name):
    return json.loads((HERE / name).read_text(encoding="utf-8"))

original = git_show("quizz.html")
pattern = re.compile(r'(<script id="training-data"[^>]*>)(.*?)(</script>)', re.S)
match = pattern.search(original)
assert match is not None, "training-data absent"
data = json.loads(match[2])
patches = load("corrections.json")
byid = {q["id"]: q for q in patches}
assert len(byid) == len(patches) == 274
assert set(byid) <= {q["id"] for q in data["exercises"]}
data["exercises"] = [byid.get(q["id"], q) for q in data["exercises"]]
assert len(data["exercises"]) == 3000
delta = load("prerequis.json")["byId"]
assert (ROOT / "quizz.html").read_bytes() == original.encode("utf-8"), "base HTML modifiée : exécuter sur branche D"
assert (ROOT / "quizz-prerequis.js").read_bytes() == git_show("quizz-prerequis.js").encode("utf-8"), "table partagée modifiée"
with tempfile.TemporaryDirectory(prefix="qpjb-audit-d-") as tmp:
    path = Path(tmp)
    base_html, corrected_html = path / "base.html", path / "corrige.html"
    base_html.write_text(original, encoding="utf-8")
    corrected_html.write_text(original[:match.start(2)] + json.dumps(data, ensure_ascii=False) + original[match.end(2):], encoding="utf-8")
    for html in (base_html, corrected_html):
        run([sys.executable, "scripts/verify_quiz_sef.py", "--html", html, "--min-count", "3000"])
        run([sys.executable, "scripts/audit_quiz_auction_legality.py", "--html", html, "--strict"])
    run(["node", "tests/quizz-prerequis.cjs"])
    run(["node", "tests/qcm685-integration.cjs"])
    js = """
const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync('tests/quizz-prerequis.cjs','utf8');
const start=src.indexOf('const verify='),end=src.indexOf('const stats=verify');
if(start<0||end<=start)throw Error('fonction verify introuvable');
const verify=new Function(src.slice(start,end)+';return verify;')();
const table=require(path.resolve('quizz-prerequis.js'));
const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8').match(/<script id="training-data"[^>]*>([\\s\\S]*?)<\\/script>/)[1]);
Object.assign(table.byId,JSON.parse(process.argv[2]));
console.log('Candidate verify',JSON.stringify(verify(data,table)));
"""
    run(["node", "-e", js, corrected_html, json.dumps(delta, ensure_ascii=False)])
    names = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
    for name in sorted(p for p in names if Path(p).name.startswith("test_") and p.endswith(".py") and any(k in Path(p).name.lower() for k in ("quiz", "auction", "sef"))):
        run([sys.executable, "-m", "unittest", "discover", "-s", str(Path(name).parent), "-p", Path(name).name])
print("RECETTE_NATIVE_D_OK")
