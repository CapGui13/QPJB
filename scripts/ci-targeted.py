#!/usr/bin/env python3
"""Fast current-publication gate. Long historical recipes are manual."""
import argparse
import importlib.util
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT / file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

def run(*args):
    subprocess.run(args, cwd=ROOT, check=True)

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT).decode("utf-8")

def main(base, head):
    quick = load("quick", "scripts/ci-quick-check.py")
    builder = load("builder", "scripts/build_public_site.py")
    quick.require(quick.SHA.fullmatch(head) and git("rev-parse","HEAD").strip()==head, "exact checkout required")
    all_paths = set(git("ls-files","-z").split("\0")) - {""}
    if base == "none":
        changed = all_paths
    else:
        quick.require(quick.SHA.fullmatch(base), "invalid base")
        run("git","merge-base","--is-ancestor",base,head)
        changed = set(git("diff","--name-only","--no-renames","-z",base,head).split("\0")) - {""}
    # Always check the public archive, tracked sources, catalogue and links.
    run(sys.executable,"scripts/build_catalogue.py")
    quick.verify_catalogue(ROOT,head)
    public = builder.mapping(ROOT)
    folded = {}
    for p in public:
        for n in range(1,len(p.split("/"))+1):
            prefix = "/".join(p.split("/")[:n])
            key = prefix.casefold()
            quick.require(key not in folded or folded[key]==prefix,"public path collision: "+prefix)
            folded[key]=prefix
    for p in set(public.values()) & changed:
        source = ROOT / p
        if source.suffix.lower()==".pbn":
            quick.check_pbn(source)
        elif source.parent==ROOT/"Docs" and source.suffix.lower() in quick.RASTER:
            quick.check_image(source)
        elif p=="config.json":
            quick.check_config(source)
        elif source.suffix==".js":
            run("node","--check",p)
        elif p in builder.CORE|builder.TRAINING and source.suffix==".html" and not p.startswith("preview/"):
            run("node","-e","const fs=require('node:fs');const p=process.argv[1];require('./scripts/ci-routine.cjs').syntax(p,fs.readFileSync(p,'utf8'))",p)
    run(sys.executable,"tests/repository-layout.py")
    infrastructure = any(p.startswith((".github/workflows/","scripts/ci-","scripts/build_public_site","scripts/build_catalogue","tests/ci-")) for p in changed)
    quiz = infrastructure or any(p in {"quizz.html","quizz-parcours.js","quizz-prerequis.js","parcours-recommandations.js","service-worker.js"} for p in changed)
    training = any(p.startswith("entrainement/") for p in changed)
    if quiz:
        run(sys.executable,"scripts/verify_quiz_sef.py","--html","quizz.html","--min-count","1523")
        run("node","tests/quizz-catalogue-live.cjs","--early")
        run("node","tests/quizz-distractors.cjs")
        run("node","tests/quizz-free-input.cjs")
        # Cache must serve the same engine version as the actual HTML.
        import re
        version=re.search(r'quizz-parcours\.js\?v=[^"\']+', (ROOT/"quizz.html").read_text(encoding="utf-8"))
        quick.require(version and "BASE + '"+version[0]+"'" in (ROOT/"service-worker.js").read_text(encoding="utf-8"),"Quiz cache version mismatch")
    if training:
        run("node","tests/training-card-integrity.cjs")
        run("node","scripts/split_training_data.cjs","--check")
    if infrastructure:
        run("node","tests/ci-orchestration-core.cjs")
        run("node","tests/ci-publication-state.cjs")
        run("node","tests/ci-training-workflow-guard.cjs")
        run(sys.executable,"tests/ci-publication-archive.py")
    print("TARGETED_PASS exact "+head+"; quiz="+str(quiz)+" training="+str(training)+" infrastructure="+str(infrastructure))

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--base",required=True)
    p.add_argument("--head",required=True)
    a=p.parse_args()
    main(a.base,a.head)
