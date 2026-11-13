#!/usr/bin/env python3
"""Préparateur ponctuel LOT13 — ajoute 20 QCM SEF sans toucher aux 1309 publiés."""
from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
HTML=ROOT/'quizz.html'
SOURCE=ROOT/'audits/quiz-sef-lot13-20-candidats.json'
EXPECTED_SHA='53be28e2c6b9aea1ab034280046980f5a3e295220b2de8f5d4876500d2f4af60'
BASE_COUNT=1309
NEW_COUNT=20
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
    if len(old)!=BASE_COUNT or len(candidates)!=NEW_COUNT:
        raise ValueError(f'Catalogue inattendu : {len(old)} publiés et {len(candidates)} candidats')
    old_ids={q['id'] for q in old};new_ids=[q['id'] for q in candidates]
    if len(old_ids)!=BASE_COUNT or len(set(new_ids))!=NEW_COUNT or (old_ids & set(new_ids)):
        raise ValueError('Identifiants dupliqués')
    if new_ids!=[f'SEF-L13-{i:03d}' for i in range(1,21)]:
        raise ValueError('Ordre et liste exacts du LOT13 inattendus')
    selected=[]
    for q in candidates:
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
        if q['id']=='SEF-L13-013':
            # Présentation cohérente : Passe / Contre / contrats croissants.
            q['choices']=['Passe','Contre','1♥','1SA']
        selected.append(q)
    i=array_end(raw)
    extended=raw[:i]+','+','.join(json.dumps(x,ensure_ascii=False,separators=(',',':')) for x in selected)+raw[i:]
    before=json.dumps(data['description'],ensure_ascii=False)
    after=json.dumps('QPJB — 1329 QCM : 1309 précédemment publiés inchangés et 20 exercices supplémentaires du LOT 13.',ensure_ascii=False)
    if extended.count(before)!=1:raise ValueError('Métadonnée description non unique')
    extended=extended.replace(before,after,1)
    result=json.loads(extended)
    if len(result['exercises'])!=BASE_COUNT+NEW_COUNT or result['exercises'][:BASE_COUNT]!=old:
        raise ValueError('Catalogue historique modifié ou compte incorrect')
    if result['exercises'][BASE_COUNT:]!=selected:
        raise ValueError('Lot13 modifié à la réinsertion')
    print('LOT13 : 1309 anciens QCM inchangés + 20 nouveaux = 1329, 20 IDs uniques et mains validées.')
    return html[:m.start(1)]+extended+html[m.end(1):]

def main():
    src=json.loads(SOURCE.read_text(encoding='utf-8'))
    canonical=json.dumps(src,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')
    actual=hashlib.sha256(canonical).hexdigest()
    if actual!=EXPECTED_SHA:raise ValueError('Empreinte du LOT13 non conforme : '+actual)
    html=HTML.read_text(encoding='utf-8')
    HTML.write_text(render(html,src),encoding='utf-8')

if __name__=='__main__':main()