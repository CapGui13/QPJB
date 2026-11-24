#!/usr/bin/env python3
"""Verify the published tree and the byte-preserving maintenance move."""
import hashlib
import importlib.util
import json
import re
import subprocess
import tempfile
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("public_builder", ROOT/"scripts/build_public_site.py")
builder=importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
def git_blob(p):
    b=p.read_bytes()
    return hashlib.sha1(f"blob {len(b)}\0".encode()+b).hexdigest()
class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True);self.links=[]
    def handle_starttag(self,tag,attrs):
        for name,value in attrs:
            if name in {"href","src","poster"} and value:
                self.links.append(value)
def resolve_link(p,link):
    u=urlsplit(link)
    if u.scheme or u.netloc or not u.path or '${' in u.path or u.path.startswith("//"):
        return None
    if u.path.startswith("/QPJB/"):
        return Path(unquote(u.path[len("/QPJB/"):]))
    if u.path.startswith("/"):
        return None
    return p.parent/Path(unquote(u.path))
def validate_layout():
    plan=json.loads((ROOT/"audits/references/repository-layout-20261124.json").read_text(encoding="utf-8"))
    for m in plan["moves"]:
        assert not (ROOT/m["from"]).exists(),m["from"]
        assert git_blob(ROOT/m["to"])==m["sha"],m["to"]
    # On this maintenance branch, require every protected blob unchanged.
    # Later unrelated development is not constrained by the historical snapshot.
    for group in plan["protected"].values():
        for f in group:
            assert git_blob(ROOT/f["path"])==f["sha"],f["path"]
    assert len(plan["moves"])==150
    assert len(plan["protected"]["courseImages"])==7
    assert len(plan["protected"]["pbn"])==93
    print("LAYOUT_PASS: 150 original blobs preserved; 7 course images, 93 PBN and 42 application files unchanged")
def validate_site():
    with tempfile.TemporaryDirectory(prefix="qpjb-public-test-") as tmp:
        output=Path(tmp)/"site"
        files=builder.build(ROOT,output)
        actual={p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}
        assert actual==set(files)|{".nojekyll"}
        assert len(builder.LEGACY)==7
        assert all(not p.startswith(("audits/","archives/","tests/","scripts/",".github/")) for p in actual)
        assert not any(p.endswith((".md",".lnk",".py",".cjs",".patch",".yml")) for p in actual)
        for dst,src in files.items():
            assert (output/dst).read_bytes()==(ROOT/src).read_bytes(),dst
        for p in actual:
            if p.endswith(".html"):
                parser=Links();parser.feed((output/p).read_text(encoding="utf-8"))
                for link in parser.links:
                    resolved=resolve_link(Path(p),link)
                    if resolved is None:
                        continue
                    candidate=(output/resolved).resolve()
                    assert candidate.is_relative_to(output.resolve()),(p,link)
                    assert candidate.is_file() or (candidate/"index.html").is_file(),(p,link)
            elif p.endswith(".css"):
                for link in re.findall(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)",(output/p).read_text(encoding="utf-8")):
                    resolved=resolve_link(Path(p),link.strip())
                    if resolved is not None:
                        assert (output/resolved).is_file(),(p,link)
        sw=(output/"service-worker.js").read_text(encoding="utf-8")
        for match in re.finditer(r"BASE\s*\+\s*'([^']+)'",sw):
            value=match.group(1).split("?")[0]
            if not value or value.endswith("JC-"):
                continue
            if value.endswith("/"):
                assert (output/value/"index.html").is_file(),value
            else:
                assert (output/value).is_file(),value
        manifest=json.loads((output/"manifest.json").read_text(encoding="utf-8"))
        for icon in manifest["icons"]:
            assert (output/resolve_link(Path("manifest.json"),icon["src"])).is_file(),icon
        print(f"PUBLIC_SITE_PASS: {len(actual)} files, direct HTML/CSS links, offline cache and aliases checked")
if __name__=="__main__":
    import sys
    if "--verify-relocation" in sys.argv:
        validate_layout()
    validate_site()
