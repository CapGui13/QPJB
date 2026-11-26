#!/usr/bin/env python3
"""M5 full-corpus real-browser test (Chromium/WebKit, local only).

Run from checkout: python audits/apprentissage-durable-20261126/m5/test-navigation-full.py
Use --browser chromium --chromium-path /usr/bin/chromium for system Chromium.
Full DOM checks are batched in the real browser; trusted keyboard events are tested
separately on representative controls. No network or production state writes.
"""
import argparse
import hashlib
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[3])
parser.add_argument("--browser", choices=["all", "chromium", "webkit"], default="all")
parser.add_argument("--chromium-path")
args = parser.parse_args()
root = args.root
folder = root / "audits/apprentissage-durable-20261126/m5"
module = root / "quizz-durable-m5-lecons.js"
demo = folder / "demo.html"
corpus_file = folder / "corpus-verification.json"
corpus = json.loads(corpus_file.read_text(encoding="utf-8"))["corpus"]
assert len(corpus) == 99, "requires complete corpus"
expected_extensions = sum(len(l.get("extensions", [])) for l in corpus.values())
expected_examples = len({e["id"] for l in corpus.values() for e in l["examples"] + [q for x in l.get("extensions", []) for q in x["examples"]]})
assert expected_extensions >= 73 and expected_examples >= 289, "incomplete corpus"
source = module.read_text(encoding="utf-8")
html = demo.read_text(encoding="utf-8")
tag = '<script src="../../../quizz-durable-m5-lecons.js"></script>'
assert html.count(tag) == 1
html = html.replace(tag, "<script>" + source.replace("</script", r"<\/script") + "</script>", 1)
sha = {x.name: hashlib.sha256(x.read_bytes()).hexdigest() for x in [module, demo, corpus_file]}

# This executes inside a real browser, not a DOM double. Clicks in this sweep are
# programmatic DOM activations, not trusted keyboard events; those follow below.
SWEEP = r"""({corpus,expected_extensions,expected_examples}) => {
 let assertions=0,studied=0,recalled=0,extensions=0,examples=0;
 function ok(x,m){assertions++;if(!x)throw Error(m)}
 const $=id=>document.getElementById(id), area=$('lesson');
 const opts=()=>[...$('concept').options].map(x=>x.value);
 const choose=(id,value)=>{const x=$(id);x.value=value;x.dispatchEvent(new Event('change',{bubbles:true}))};
 const visible=x=>!!x&&x.getClientRects().length>0;
 const width=m=>ok(document.documentElement.scrollWidth<=innerWidth+1,m+' width');
 const text=x=>x.textContent;
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const close=()=>{$('close').click();ok(area.hidden,'close hidden');ok(document.activeElement===$('open'),'close focus')};
 const open=c=>{choose('concept',c);$('open').click();ok(!area.hidden&&visible(area),c+' open');ok(document.activeElement.id==='heading',c+' focus');ok(text($('heading'))===corpus[c].title,c+' title');width(c)};
 const detail=(d,m)=>{const s=d.querySelector(':scope > summary');ok(visible(s),m+' summary visible');ok(!d.open,m+' initially closed');s.focus();s.click();ok(d.open,m+' expanded');width(m);return s};
 const collapse=(d,s,m)=>{s.click();ok(!d.open,m+' collapsed')};
 ok(area.hidden,'no automatic lesson');ok(opts().length===4,'four initial concepts');
 for(const c of opts()){open(c);ok([...area.querySelectorAll('p')].some(x=>text(x)==='Objectif : '+corpus[c].objective),c+' objective');ok(!area.querySelector('details[open]'),c+' collapsed');ok(![...area.querySelectorAll(':scope > details > summary')].some(x=>text(x).startsWith('Approfondir : ')),c+' no advanced material');close()}
 choose('mode','reminder');ok($('open').disabled,'no reminder before exposure');choose('profile','advanced');
 const all=Object.keys(corpus);ok(opts().length===99&&opts().every(c=>all.includes(c)),'99 recalls');
 for(const c of opts()){open(c);ok(same([...area.querySelectorAll('p')].map(text),[corpus[c].reminder]),c+' short reminder');ok(!area.querySelector('details'),c+' no examples');close();recalled++}
 choose('mode','study');ok(opts().length===99&&opts().every(c=>all.includes(c)),'99 studies');
 for(const c of opts()){
  open(c);const l=corpus[c],ext=l.extensions||[],top=[...area.querySelectorAll(':scope > details')];
  ok([...area.querySelectorAll(':scope > p')].some(x=>text(x)==='Objectif : '+l.objective),c+' objective');
  ok([...area.querySelectorAll(':scope > p')].some(x=>text(x)===l.rule),c+' rule');
  ok(!area.querySelector('details[open]'),c+' initially closed');
  ok(top.filter(d=>text(d.querySelector(':scope > summary')).startsWith('Approfondir : ')).length===ext.length,c+' extension count');
  const extIds=new Set(ext.flatMap(e=>e.examples.map(x=>x.id)));
  const expected=[...l.examples.filter((e,i)=>i===0||!extIds.has(e.id)),...ext.flatMap(e=>e.examples)];
  const actual=[...area.querySelectorAll('details')].filter(d=>d.querySelector(':scope > pre'));
  ok(actual.length===expected.length,c+' example count');
  for(const [i,d] of actual.entries()){
   const e=expected[i],hand=e.hand.map((cards,j)=>['♠','♥','♦','♣'][j]+' '+cards.join(' ')).join('\n');
   ok(text(d.querySelector(':scope > pre'))===hand,c+' hand '+e.id);
   ok(same([...d.querySelectorAll(':scope > p')].map(text),[e.context,e.auction.join(' — ')||'Aucune enchère préalable','Décision : '+e.answer,e.comment]),c+' canonical '+e.id);
  }
  for(const d of top){const s=detail(d,c);for(const n of d.querySelectorAll(':scope > details')){const ns=detail(n,c+' nested');collapse(n,ns,c+' nested')}collapse(d,s,c)}
  ok([...area.querySelectorAll('p')].filter(x=>text(x)==='Aide pédagogique, non notée.').length===l.checks.length+ext.length,c+' non scoring');
  examples+=actual.length;extensions+=ext.length;studied++;close();
 }
 ok(recalled===99&&studied===99,'all concepts');ok(extensions===expected_extensions&&examples===expected_examples,'all content');
 choose('mode','discovery');ok($('open').disabled,'no forced rediscovery');choose('profile','start');ok(!$('open').disabled&&area.hidden,'restart');
 return {assertions,studied,recalled,extensions,examples};
}"""


def run(browser, engine, viewport):
    page = browser.new_page(viewport=viewport)
    errors, requests = [], []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("request", lambda r: requests.append(r.url))
    page.evaluate("""() => {window.storageAccesses=0; for(const key of ['localStorage','sessionStorage']) Object.defineProperty(window,key,{get(){window.storageAccesses++;throw Error('unexpected storage')}})}""")
    page.set_content(html, wait_until="load")
    result = page.evaluate(SWEEP, {"corpus":corpus,"expected_extensions":expected_extensions,"expected_examples":expected_examples})
    n = 0
    def check(v, m):
        nonlocal n
        n += 1
        assert v, f"{engine} {viewport['width']} {m}"
    try:
        # Trusted keyboard events on entry controls, a foundation lesson, a check,
        # and a nested advanced example. The DOM sweep covers every other detail.
        page.locator("#profile").focus()
        for control in ["mode", "concept", "open"]:
            page.keyboard.press("Tab")
            check(page.evaluate("document.activeElement.id") == control, "tab " + control)
        page.keyboard.press("Enter")
        check(page.locator("#lesson").is_visible(), "keyboard opens lesson")
        check(page.evaluate("document.activeElement.id") == "heading", "heading focus")
        first = page.locator("#lesson > details").first
        summary = first.locator(":scope > summary")
        summary.focus(); page.keyboard.press("Enter")
        check(first.evaluate("d=>d.open"), "keyboard opens example")
        summary.focus(); page.keyboard.press("Enter")
        check(not first.evaluate("d=>d.open"), "keyboard closes example")
        last = page.locator("#lesson > details").last
        last.locator(":scope > summary").focus(); page.keyboard.press("Enter")
        check(last.evaluate("d=>d.open"), "keyboard opens mini-check")
        check(last.get_by_text("Aide pédagogique, non notée.",exact=True).is_visible(), "non scoring visible")
        page.locator("#close").focus(); page.keyboard.press("Enter")
        check(page.locator("#lesson").is_hidden() and page.evaluate("document.activeElement.id") == "open", "keyboard close and restore")
        page.select_option("#profile","advanced"); page.select_option("#mode","study")
        concept = next(c for c,l in corpus.items() if l.get("extensions"))
        page.select_option("#concept",concept); page.locator("#open").focus(); page.keyboard.press("Enter")
        outer = page.locator("#lesson > details").filter(has=page.get_by_text("Approfondir : " + corpus[concept]["extensions"][0]["title"],exact=True)).first
        outer.locator(":scope > summary").focus(); page.keyboard.press("Enter")
        check(outer.evaluate("d=>d.open"), "keyboard opens extension")
        nested = outer.locator(":scope > details").first
        nested.locator(":scope > summary").focus(); page.keyboard.press("Enter")
        check(nested.evaluate("d=>d.open"), "keyboard opens nested example")
        check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "keyboard expanded width")
        check(page.evaluate("window.storageAccesses === 0"), "no storage")
        check(not errors, "page errors " + repr(errors))
        check(not requests, "unexpected requests " + repr(requests))
        return {"engine":engine,"version":browser.version,"viewport":viewport,**result,"keyboardAssertions":n,"assertions":result["assertions"]+n}
    finally:
        page.close()

results=[]
with sync_playwright() as pw:
    for engine in (["chromium","webkit"] if args.browser=="all" else [args.browser]):
        options={"executable_path":args.chromium_path} if engine=="chromium" and args.chromium_path else {}
        if engine=="chromium": options["args"]=["--no-sandbox"]
        browser=getattr(pw,engine).launch(**options)
        try:
            for w,h in [(1280,800),(360,740),(320,640)]:
                result=run(browser,engine,{"width":w,"height":h});results.append(result)
                print(json.dumps(result,ensure_ascii=False),flush=True)
        finally: browser.close()
print(json.dumps({"sha256":sha,"results":results,"totalAssertions":sum(x["assertions"] for x in results)},ensure_ascii=False))
