#!/usr/bin/env python3
"""Run the actual Python blocks from verified-pages.yml against adversarial archives.
No deployment, token, network, or repository mutation.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
import zipfile

workflow = (Path(__file__).resolve().parents[1] / ".github/workflows/verified-pages.yml").read_text()
blocks = re.findall(r"python3 - <<'PY'\n((?: {10}.*\n)+?) {10}PY\n", workflow)
assert len(blocks) == 2, len(blocks)
metadata, archive = ("\n".join(line[10:] for line in block.splitlines()) for block in blocks)
sha = "a" * 40
aliases = {"Docs/QPJB_V2_REVUE_PEDAGOGIQUE_INTERACTIVE_19_CAS_HOLD_20261120.html",
           "index A.html", "apple-touch-icon.png", "favicon-32.png", "favicon.svg", "icon-192.png", "icon-512.png"}
count = 0
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    (root/"pages-runtime").mkdir()
    output = root/"output"
    env = dict(os.environ, RUNNER_TEMP=str(root), GITHUB_OUTPUT=str(output),
               ARCHIVE_NAME="github-pages-123-2", GITHUB_RUN_ID="123", VERIFIED_SHA=sha)
    def run(code, expected, **overrides):
        global count
        p = subprocess.run(["python3", "-c", code], env=dict(env, **overrides), capture_output=True, text=True)
        assert (p.returncode == 0) == expected, (p.returncode, p.stdout, p.stderr)
        count += 1
    def meta(**overrides):
        a = dict(name=env["ARCHIVE_NAME"], expired=False, size_in_bytes=10,
                 workflow_run={"id":123,"head_sha":sha}, digest="sha256:"+"f"*64, id=42)
        a.update(overrides)
        return a
    def metadata_case(entries, expected, count_override=None):
        (root/"pages-artifacts.json").write_text(json.dumps({"artifacts":entries,"total_count":len(entries) if count_override is None else count_override}))
        run(metadata,expected)
    metadata_case([meta()], True)
    metadata_case([], False)
    metadata_case([meta(),meta()],False)
    metadata_case([meta(expired=True)],False)
    metadata_case([meta(workflow_run={"id":124,"head_sha":sha})],False)
    metadata_case([meta(workflow_run={"id":123,"head_sha":"b"*40})],False)
    metadata_case([meta(digest="bad")],False)
    metadata_case([meta(size_in_bytes=0)],False)
    metadata_case([meta()],False,2)

    def tar_bytes(*, revision=sha, omit=None, extra=None):
        data = io.BytesIO()
        with tarfile.open(fileobj=data, mode="w") as tf:
            files = {name:b"fixture" for name in aliases|{".nojekyll"}}
            files["site-version.json"] = json.dumps({"revision":revision}).encode()
            if omit: files.pop(omit)
            for name, content in files.items():
                m=tarfile.TarInfo("./"+name);m.size=len(content)
                tf.addfile(m,io.BytesIO(content))
            if extra:
                m=tarfile.TarInfo(extra)
                if extra=="link":
                    m.type=tarfile.SYMTYPE;m.linkname="site-version.json"
                tf.addfile(m)
        return data.getvalue()
    def archive_case(data, expected, *, runtime=None, zip_extra=False, digest=None):
        with zipfile.ZipFile(root/"pages-rest.zip","w") as z:
            z.writestr("artifact.tar",data)
            if zip_extra: z.writestr("extra","bad")
        (root/"pages-runtime"/"artifact.tar").write_bytes(data if runtime is None else runtime)
        actual="sha256:"+hashlib.sha256((root/"pages-rest.zip").read_bytes()).hexdigest()
        run(archive, expected, DIGEST=digest or actual)
    good=tar_bytes()
    archive_case(good,True)
    archive_case(good,False,runtime=b"corrupt")
    archive_case(good,False,digest="sha256:"+"0"*64)
    archive_case(good,False,zip_extra=True)
    archive_case(tar_bytes(revision="b"*40),False)
    archive_case(tar_bytes(omit="icon-192.png"),False)
    archive_case(tar_bytes(extra="../bad"),False)
    archive_case(tar_bytes(extra="/bad"),False)
    archive_case(tar_bytes(extra="link"),False)
    archive_case(tar_bytes(extra="site-version.json"),False)
print(f"M3 ARCHIVE NEGATIVE PASS: {count} actual YAML Python block cases")
