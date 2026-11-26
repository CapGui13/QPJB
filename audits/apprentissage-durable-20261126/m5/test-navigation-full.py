#!/usr/bin/env python3
"""Exhaustive real-browser test of the autonomous M5 demo.

Run from the repo: python audits/apprentissage-durable-20261126/m5/test-navigation-full.py
Requires Playwright and installed Chromium and WebKit browsers. --browser chromium
or --browser webkit isolates an engine. --chromium-path /usr/bin/chromium allows a
system browser. No network, publication, storage or quiz production writes.
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
assert len(corpus) == 99, "test requires the complete corpus"
expected_extensions = sum(len(l.get("extensions", [])) for l in corpus.values())
expected_examples = len({e["id"] for l in corpus.values() for e in l["examples"] + [q for x in l.get("extensions", []) for q in x["examples"]]})
assert expected_extensions >= 73 and expected_examples >= 289, "incomplete corpus"
source = module.read_text(encoding="utf-8")
html = demo.read_text(encoding="utf-8")
tag = '<script src="../../../quizz-durable-m5-lecons.js"></script>'
assert html.count(tag) == 1
# Exact runtime as a JS string, embedded locally (no request to a server).
html = html.replace(tag, "<script>" + source.replace("</script", r"<\/script") + "</script>", 1)
sha = {x.name: hashlib.sha256(x.read_bytes()).hexdigest() for x in [module, demo, corpus_file]}
results = []

def exercise_page(browser, engine, viewport):
    page = browser.new_page(viewport=viewport)
    errors = []
    requests = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("request", lambda request: requests.append(request.url))
    checks = 0
    studied = recalled = extensions = examples = 0
    def check(value, label):
        nonlocal checks
        checks += 1
        assert value, f"{engine} {viewport['width']} {label}"
    def choose(selector, value):
        page.select_option(selector, value)
    def close():
        page.locator("#close").click()
        check(page.locator("#lesson").is_hidden(), "close hides lesson")
        check(page.evaluate("document.activeElement.id === 'open'"), "close restores focus")
    def open_lesson(concept):
        choose("#concept", concept)
        # Real keyboard activation of the control, not synthetic DOM event.
        page.locator("#open").focus()
        page.keyboard.press("Enter")
        check(page.locator("#lesson").is_visible(), concept + " lesson visible")
        check(page.evaluate("document.activeElement.id === 'heading'"), concept + " heading focus")
        check(page.locator("#heading").inner_text() == corpus[concept]["title"], concept + " title")
        check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), concept + " collapsed width")
    try:
        # about:blank storage access is normally blocked; force any accidental access to fail.
        page.evaluate("""() => {window.storageAccesses=0; for(const key of ['localStorage','sessionStorage']) Object.defineProperty(window,key,{get(){window.storageAccesses++;throw Error('unexpected storage')}})}""")
        page.set_content(html, wait_until="load")
        check(page.locator("#lesson").is_hidden(), "no automatic lesson")
        check(page.locator("#concept option").count() == 4, "four initial notions")
        check(page.locator("#profile").is_enabled(), "profile keyboard control")
        for concept in page.locator("#concept option").evaluate_all("(xs)=>xs.map(x=>x.value)"):
            open_lesson(concept)
            check(page.locator("#lesson").inner_text().find("Objectif : " + corpus[concept]["objective"]) >= 0, concept + " objective")
            check(page.locator("#lesson details[open]").count() == 0, concept + " collapsed discovery")
            check(page.locator("#lesson > details > summary").filter(has_text="Approfondir :").count() == 0, concept + " no premature variants")
            close()
        choose("#mode", "reminder")
        check(page.locator("#open").is_disabled(), "no reminder without exposure")
        choose("#profile", "advanced")
        reminder_ids = page.locator("#concept option").evaluate_all("(xs)=>xs.map(x=>x.value)")
        check(set(reminder_ids) == set(corpus), "99 recalls")
        for concept in reminder_ids:
            open_lesson(concept)
            check(page.locator("#lesson").inner_text() == corpus[concept]["title"] + "\n\n" + corpus[concept]["reminder"] or page.locator("#lesson p").all_text_contents() == [corpus[concept]["reminder"]], concept + " short recall")
            check(page.locator("#lesson details").count() == 0, concept + " recall without examples")
            close()
            recalled += 1
        choose("#mode", "study")
        study_ids = page.locator("#concept option").evaluate_all("(xs)=>xs.map(x=>x.value)")
        check(set(study_ids) == set(corpus), "99 studies")
        for concept in study_ids:
            open_lesson(concept)
            lesson = corpus[concept]
            check(page.locator("#lesson").inner_text().find("Objectif : " + lesson["objective"]) >= 0, concept + " study objective")
            check(page.locator("#lesson details[open]").count() == 0, concept + " initial collapsed")
            # Validate every real rendered detail, including nested worked examples and checks.
            # Opening via keyboard is tested on each outer detail and every nested detail.
            data = page.evaluate("""() => {
              const area=document.querySelector('#lesson');
              const sections=[...area.querySelectorAll(':scope > details')];
              return sections.map(d=>({summary:d.querySelector(':scope > summary').textContent,
                  children:[...d.querySelectorAll(':scope > details')].length}));
            }""")
            ext_list = lesson.get("extensions", [])
            check(sum(x["summary"].startswith("Approfondir : ") for x in data) == len(ext_list), concept + " extensions")
            # Every example ID is represented once in the exact runtime's rendered result.
            # The DOM does not expose IDs. Verify text from every example against the DOM,
            # without relying on unique answer strings (several examples can answer 3SA).
            expected = []
            ext_ids = {e["id"] for x in ext_list for e in x["examples"]}
            expected.extend(e for i,e in enumerate(lesson["examples"]) if i == 0 or e["id"] not in ext_ids)
            expected.extend(e for x in ext_list for e in x["examples"])
            worked = page.locator("#lesson details").filter(has=page.locator(":scope > pre"))
            # Evaluate exact direct children to avoid matching an ancestor of nested examples.
            actual = page.evaluate("""() => [...document.querySelectorAll('#lesson details')]
              .filter(d=>d.querySelector(':scope > pre'))
              .map(d=>({hand:d.querySelector(':scope > pre').textContent,
                 lines:[...d.querySelectorAll(':scope > p')].map(p=>p.textContent)}))""")
            check(len(actual) == len(expected), concept + " examples count")
            for got, e in zip(actual, expected):
                hand = "\n".join(suit + " " + " ".join(cards) for suit,cards in zip("♠♥♦♣",e["hand"]))
                check(got["hand"] == hand and got["lines"] == [e["context"], " — ".join(e["auction"]) or "Aucune enchère préalable", "Décision : " + e["answer"], e["comment"]], concept + " canonical text " + e["id"])
            examples += len(actual)
            top = page.locator("#lesson > details")
            for index in range(top.count()):
                detail = top.nth(index)
                summary = detail.locator(":scope > summary")
                check(summary.is_visible(), concept + " summary reachable")
                summary.focus()
                page.keyboard.press("Enter")
                check(detail.evaluate("d=>d.open"), concept + " keyboard expands detail")
                for k in range(detail.locator(":scope > details").count()):
                    nested = detail.locator(":scope > details").nth(k)
                    ns = nested.locator(":scope > summary")
                    check(ns.is_visible(), concept + " nested summary reachable")
                    ns.focus()
                    page.keyboard.press("Enter")
                    check(nested.evaluate("d=>d.open"), concept + " nested keyboard expansion")
                    check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), concept + " nested expanded width")
                    ns.focus()
                    page.keyboard.press("Enter")
                    check(not nested.evaluate("d=>d.open"), concept + " nested close")
                check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), concept + " expanded width")
                summary.focus()
                page.keyboard.press("Enter")
                check(not detail.evaluate("d=>d.open"), concept + " keyboard collapse")
            check(page.locator("#lesson").get_by_text("Aide pédagogique, non notée.", exact=True).count() == len(lesson["checks"]) + len(ext_list), concept + " checks remain non scoring")
            extensions += len(ext_list)
            studied += 1
            close()
        check(studied == recalled == 99, "complete concepts")
        check(extensions == expected_extensions and examples == expected_examples, "complete extensions/examples")
        choose("#mode", "discovery")
        check(page.locator("#open").is_disabled(), "no forced rediscovery")
        choose("#profile", "start")
        check(page.locator("#open").is_enabled() and page.locator("#lesson").is_hidden(), "restart")
        check(page.evaluate("window.storageAccesses === 0"), "no storage")
        check(not errors, "page errors " + repr(errors))
        check(not requests, "unexpected requests " + repr(requests))
        return {"engine":engine,"version":browser.version,"viewport":viewport,"assertions":checks,"studied":studied,"recalled":recalled,"extensions":extensions,"examples":examples}
    finally:
        page.close()

with sync_playwright() as pw:
    engines = ["chromium","webkit"] if args.browser == "all" else [args.browser]
    for engine in engines:
        browser_type = getattr(pw, engine)
        options = {"executable_path": args.chromium_path} if engine == "chromium" and args.chromium_path else {}
        if engine == "chromium":
            options["args"] = ["--no-sandbox"]
        browser = browser_type.launch(**options)
        try:
            for width,height in [(1280,800),(360,740),(320,640)]:
                result = exercise_page(browser,engine,{"width":width,"height":height})
                results.append(result)
                print(json.dumps(result,ensure_ascii=False),flush=True)
        finally:
            browser.close()
print(json.dumps({"sha256":sha,"results":results,"totalAssertions":sum(x["assertions"] for x in results)},ensure_ascii=False))
