#!/usr/bin/env python3
"""Inventaire reproductible des dépendances par nom de fichier, sans mutation."""
import collections, json, re, subprocess
from pathlib import Path
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
def tracked():
    return subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode('utf-8').rstrip('\0').split('\0')
paths=tracked()
def candidate(p):
    q=Path(p)
    return (p.startswith('Docs/') and q.suffix.lower() not in {'.jpg','.jpeg','.png','.gif','.webp','.svg'}) or (q.parent==Path('.') and (q.suffix in {'.md','.lnk','.png','.svg'} or p=='index A.html')) or (p.startswith('entrainement/') and (q.suffix=='.md' or p in {'entrainement/training-data-v743-corrige.js','entrainement/training-data.js'})) or (p.startswith('audits/') and q.parent==Path('audits') and q.suffix=='.md') or p=='preview/v2-eleve/parcours-sef-65-r1.html' or p=='.github/workflows/CI-MISSION5.md'
candidates=[p for p in paths if candidate(p)]
variants=collections.defaultdict(set)
for p in candidates:
    name=Path(p).name
    for v in {name,quote(name,safe=''),quote(name,safe='').lower(),name.replace(' ','%20')}:
        variants[v.casefold()].add(p)
pattern=re.compile('|'.join(re.escape(s) for s in sorted(variants,key=len,reverse=True)),re.I)
refs=collections.defaultdict(set)
scanned=0
for p in paths:
    if Path(p).suffix.lower() not in {'.md','.txt','.html','.json','.csv','.js','.cjs','.py','.css','.yml','.yaml','.svg','.patch'}:
        continue
    s=(ROOT/p).read_text(encoding='utf-8',errors='replace')
    scanned+=1
    for m in pattern.finditer(s):
        for q in variants[m.group().casefold()]:
            if q!=p:
                refs[q].add(p)
def technical(p):
    return Path(p).suffix.lower() in {'.js','.cjs','.py','.css','.yml','.yaml','.html','.json'} and not p.startswith('audits/') and not p.startswith('Docs/Archives/') and p not in {'scripts/audit_repository_layout.py','.github/workflows/qpjb-repository-layout.yml'}
for p in candidates:
    t=sorted(x for x in refs[p] if technical(x))
    d=sorted(x for x in refs[p] if not technical(x))
    print('LAYOUT '+json.dumps({'path':p,'technical':t,'documentary':d},ensure_ascii=False))
print('LAYOUT_SUMMARY '+json.dumps({'tracked':len(paths),'scannedText':scanned,'candidates':len(candidates),'technicalDependencies':sum(bool([x for x in refs[p] if technical(x)]) for p in candidates)},ensure_ascii=False))
