"""Optional axe-core check. The supplied axe script is test-only, never part of the site.
Example: python3 tests/check_accessibility.py --axe /tmp/surf-axe/axe.min.js
"""
import argparse
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--axe', required=True, type=Path)
parser.add_argument('--output', type=Path, default=Path('/tmp/surf-accessibility.json'))
args=parser.parse_args()
base=os.environ.get('SURF_POINT_BASE_URL','http://127.0.0.1:8000').rstrip('/')
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
    for width in [390,1440]:
        page=browser.new_page(viewport={'width':width,'height':1000})
        page.goto(base+'/',wait_until='networkidle')
        page.add_script_tag(path=str(args.axe))
        for route in ['inicio','loja','produto/atlantic-midlength','alugueres','ponto']:
            page.evaluate('(route)=>location.hash=route',route)
            page.wait_for_timeout(100)
            page.evaluate('document.fonts.ready')
            result=page.evaluate('''async()=>{
                const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
                return {version:axe.version,passes:r.passes.length,incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.length,targets:x.nodes.map(n=>n.target)})),violations:r.violations.map(x=>({id:x.id,impact:x.impact,help:x.help,helpUrl:x.helpUrl,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};
            }''')
            result.update({'width':width,'route':route})
            results.append(result)
            print(f'{width}px {route}: {len(result["violations"])} violations; {len(result["incomplete"])} rules needing review', flush=True)
        page.close()
    browser.close()
args.output.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
raise SystemExit(1 if any(r['violations'] for r in results) else 0)
