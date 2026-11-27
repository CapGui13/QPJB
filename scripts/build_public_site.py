#!/usr/bin/env python3
"""Build a Pages directory from an explicit set of public resources.
The input must be the verified checkout, with its generated catalogue.
Do not copy the source repository or development directories wholesale.
"""
import argparse
import json
import shutil
import subprocess
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit

ROOT=Path(__file__).resolve().parents[1]
LEGACY={
    "Docs/QPJB_V2_REVUE_PEDAGOGIQUE_INTERACTIVE_19_CAS_HOLD_20261120.html":
        "archives/Docs/QPJB_V2_REVUE_PEDAGOGIQUE_INTERACTIVE_19_CAS_HOLD_20261120.html",
    "index A.html": "archives/site/index A.html",
    "apple-touch-icon.png": "archives/visuels/apple-touch-icon.png",
    "favicon-32.png": "archives/visuels/favicon-32.png",
    "favicon.svg": "archives/visuels/favicon.svg",
    "icon-192.png": "archives/visuels/icon-192.png",
    "icon-512.png": "archives/visuels/icon-512.png",
}
CORE={
    "index.html","quizz.html","quizz-parcours.js","quizz-prerequis.js","quizz-session-plan.js","quizz-pedagogie-initiation.js","quizz-pedagogie-intermediaire.js","quizz-pedagogie-avancee.js","parcours-recommandations.js","quizz-apprentissage-concepts.js","quizz-diagnostic-erreurs.js","quizz-remediation.js","quizz-professeur.js",
    "quizz-durable-m1-adaptation.js","quizz-durable-m1-guard.js","quizz-durable-m2-data.js","quizz-durable-m2-remediation.js","quizz-durable-m3-maitrise.js","quizz-durable-m4-transfert.js","quizz-durable-m5-lecons.js","quizz-durable-integration.js","quizz-coherence-m3-prerequis.js","quizz-coherence-m2-ordre.js","quizz-coherence-m5-study.js","quizz-coherence-study-ui.js",
    "service-worker.js","site-update.js","qpjb-design-tokens.css","qpjb-bridge-ui.css",
    "manifest.json","catalogue.json","config.json","site-version.json",
    "QPJB App.png","apple-touch-icon-qpjb.png","qpjb-logo-fixed.svg",
    "preview/v2-eleve/parcours-sef-65-r1.html",
}
TRAINING={
    "entrainement/index.html","entrainement/qp-training-corrige.html","entrainement/originaux.html",
    "entrainement/training-core.css","entrainement/training-integrated.css",
    "entrainement/training-originals.css","entrainement/training-app.js",
    "entrainement/training-originals.js","entrainement/training-originals-data.js",
    "entrainement/training-data-bootstrap.js","entrainement/training-data-bidding.js",
    "entrainement/training-data-play.js",
    # Keep this public URL for older clients; it is also the generator's source.
    "entrainement/training-data.js",
}
IMAGE_EXT={".png",".jpg",".jpeg",".gif",".webp",".svg",".ico"}
def safe_path(p):
    q=PurePosixPath(p)
    if not p or q.is_absolute() or '..' in q.parts or '\\' in p or str(q)!=p:
        raise ValueError("Unsafe path: "+p)
    return q
def local_url(url):
    u=urlsplit(url)
    if u.scheme or u.netloc or u.query or u.fragment:
        raise ValueError("Not a local catalogue URL: "+url)
    return str(safe_path(unquote(u.path.removeprefix('./'))))
def tracked(root):
    return set(subprocess.check_output(["git","ls-files","-z"],cwd=root)
               .decode("utf-8").rstrip("\0").split("\0"))
def mapping(root):
    paths=tracked(root)
    result={p:p for p in CORE|TRAINING}
    catalogue=json.loads((root/"catalogue.json").read_text(encoding="utf-8"))
    expected_pbn=set()
    for folder in catalogue["seances"]:
        for f in folder["fichiers"]:
            p=local_url(f["download_url"])
            if PurePosixPath(p).suffix.lower()!=".pbn" or PurePosixPath(p).parent.as_posix()!=folder["folder"]:
                raise ValueError("Unexpected PBN path: "+p)
            expected_pbn.add(p)
    actual_pbn={p for p in paths if PurePosixPath(p).suffix.lower()==".pbn"}
    if expected_pbn!=actual_pbn:
        raise ValueError("Catalogue PBN mismatch: "+str(expected_pbn^actual_pbn))
    expected_docs={local_url(f["url"]) for f in catalogue["images"]}
    actual_docs={p for p in paths if PurePosixPath(p).parent==PurePosixPath("Docs")
                 and PurePosixPath(p).suffix.lower() in IMAGE_EXT}
    if expected_docs!=actual_docs:
        raise ValueError("Catalogue images mismatch: "+str(expected_docs^actual_docs))
    for p in expected_pbn|expected_docs:
        result[p]=p
    for p in paths:
        q=PurePosixPath(p)
        if q.suffix.lower() in IMAGE_EXT and (q.parent==PurePosixPath("launch")
                or q.parent==PurePosixPath("entrainement/assets")):
            result[p]=p
    for dst,src in LEGACY.items():
        if dst in result:
            raise ValueError("Alias conflicts with public source: "+dst)
        result[dst]=src
    for dst,src in result.items():
        safe_path(dst);safe_path(src)
        if src not in paths or not (root/src).is_file() or (root/src).is_symlink():
            raise ValueError("Missing or unsafe public source: "+src)
        if any(part.startswith('.') for part in PurePosixPath(dst).parts):
            raise ValueError("Hidden public source: "+dst)
    return result
def build(root,out):
    root=root.resolve();out=out.resolve()
    if out==root or out in root.parents or out.exists():
        raise ValueError("Output must be a new directory outside the source root or a new subdirectory")
    files=mapping(root)
    out.mkdir(parents=True)
    for dst,src in sorted(files.items()):
        target=out/dst
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(root/src,target)
    (out/".nojekyll").touch()
    count=len(files)+1
    size=sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(f"PUBLIC_SITE: {count} files, {size} bytes; {len(LEGACY)} historical URL aliases")
    return files
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",type=Path,required=True)
    args=parser.parse_args()
    build(ROOT,args.output)
