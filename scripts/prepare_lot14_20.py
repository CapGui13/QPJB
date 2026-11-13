#!/usr/bin/env python3
"""Préparateur ponctuel LOT14 — ajoute 9 QCM distincts sans toucher aux 1329 publiés."""
from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'quizz.html'
SOURCE=ROOT/'audits/quiz-sef-lot14-20-candidats.json'
EXPECTED_SHA='01108ef9f1e7b8f50e57eeefb2e05ca1894aeb9b776bdd8e364547adda030834'
BASE_COUNT=1329
SOURCE_COUNT=20
SELECTED_IDS={"SEF-L14-001","SEF-L14-002","SEF-L14-003","SEF-L14-004","SEF-L14-006","SEF-L14-007","SEF-L14-013","SEF-L14-015","SEF-L14-016"}
NEW_COUNT=len(SELECTED_IDS)
RANK=['A','R','D','V','10','9','8','7','6','5','4','3','2']
HONORS={'A':4,'R':3,'D':2,'V':1}
EXTRACT=re.compile(r'<script\b(?=[^>]*\bid=["\']training-data["\'])[^>]*>(.*?)</script\s*>',re.I|re.S)

def array_end(raw):
    tag='"exercises":['
    idx=raw.find(tag)
    if idx<0 or raw.find(tag,idx+1)!=-1:raise ValueError('Tableau des QCM introuvable ou non unique')
    depth=1;quote=False;escaped=False
    for i in range(idx+len(tag),len(raw)):
        c=raw[i]
        if quote:
            if escaped:escaped=False
            elif c=='\\':escaped=True
            elif c=='"':quote=False
        elif c=='"':quote=True
        elif c=='[':depth+=1
        elif c==']':
            depth-=1
            if depth==0:return i
    raise ValueError('Tableau des QCM non fermé')

def render(html, candidates):
    m=EXTRACT.search(html)
    if not m:raise ValueError('training-data introuvable')
    raw=m.group(1);data=json.loads(raw)
    old=data['exercises']
    if len(old)!=BASE_COUNT or len(candidates)!=SOURCE_COUNT:
        raise ValueError(f'Catalogue inattendu : {len(old)} publiés et {len(candidates)} candidats')
    old_ids={q['id'] for q in old};new_ids=[q['id'] for q in candidates]
    if len(old_ids)!=BASE_COUNT or len(set(new_ids))!=SOURCE_COUNT or (old_ids & set(new_ids)):
        raise ValueError('Identifiants dupliqués')
    if new_ids!=[f'SEF-L14-{i:03d}' for i in range(1,SOURCE_COUNT+1)]:
        raise ValueError('Ordre et liste exacts du LOT14 inattendus')
    selected=[]
    for q in candidates:
        if q["id"] not in SELECTED_IDS:continue
        q=json.loads(json.dumps(q,ensure_ascii=False))
        if len(q['hand'])!=4 or sum(map(len,q['hand']))!=13:
            raise ValueError('Main non composée de 13 cartes '+q['id'])
        if any(len(set(s))!=len(s) for s in q['hand']):
            raise ValueError('Couleur avec carte répétée '+q['id'])
        for s in q['hand']:
            if not all(v in RANK for v in s) or s!=sorted(s,key=RANK.index):
                raise ValueError('Cartes non canoniques ou non triées '+q['id'])
        if q['shape']!=list(map(len,q['hand'])):
            raise ValueError('Distribution incohérente '+q['id'])
        if q['h']!=sum(HONORS.get(v,0) for s in q['hand'] for v in s):
            raise ValueError('Points H incohérents '+q['id'])
        if not isinstance(q['auction'],list) or len(q['choices'])!=4 or q['choices'].count(q['answer'])!=1:
            raise ValueError('Séquence ou réponse invalide '+q['id'])
        if not isinstance(q['difficulty'],int) or not 1<=q['difficulty']<=5:
            raise ValueError('Difficulté invalide '+q['id'])
        selected.append(q)
    if len(selected)!=NEW_COUNT or {q['id'] for q in selected}!=SELECTED_IDS:
        raise ValueError('Sélection finale LOT14 incohérente')
    i=array_end(raw)
    extended=raw[:i]+','+','.join(json.dumps(x,ensure_ascii=False,separators=(',',':')) for x in selected)+raw[i:]
    before=json.dumps(data['description'],ensure_ascii=False)
    after=json.dumps('QPJB — 1338 QCM : 1329 précédemment publiés inchangés et 9 exercices distincts du LOT 14.',ensure_ascii=False)
    if extended.count(before)!=1:raise ValueError('Métadonnée description non unique')
    extended=extended.replace(before,after,1)
    result=json.loads(extended)
    if len(result['exercises'])!=BASE_COUNT+NEW_COUNT or result['exercises'][:BASE_COUNT]!=old:
        raise ValueError('Catalogue historique modifié ou compte incorrect')
    if result['exercises'][BASE_COUNT:]!=selected:
        raise ValueError('Lot14 modifié à la réinsertion')
    print('LOT14 : 1329 anciens QCM inchangés + 9 nouveaux = 1338. Onze candidats redondants non publiés.')
    return html[:m.start(1)]+extended+html[m.end(1):]

def main():
    src=json.loads(SOURCE.read_text(encoding='utf-8'))
    canonical=json.dumps(src,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')
    actual=hashlib.sha256(canonical).hexdigest()
    if actual!=EXPECTED_SHA:raise ValueError('Empreinte du LOT14 non conforme : '+actual)
    html=HTML.read_text(encoding='utf-8')
    HTML.write_text(render(html,src),encoding='utf-8')

if __name__=='__main__':main()