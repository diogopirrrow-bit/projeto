#!/usr/bin/env python3
"""Capture the real prototype with the optional development browser tooling."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'capturas'
BASE = os.environ.get('SURF_POINT_BASE_URL', 'http://127.0.0.1:8000').rstrip('/')


def main():
    OUTPUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
            headless=True, args=['--no-sandbox'],
        )
        page = browser.new_page(device_scale_factor=1)
        routes = [('inicio', 'inicio'), ('loja', 'loja'),
                  ('produto', 'produto/atlantic-midlength'),
                  ('alugueres', 'alugueres')]
        for name, route in routes:
            for device, width, height in [('desktop', 1440, 1000), ('mobile', 390, 844)]:
                page.set_viewport_size({'width': width, 'height': height})
                page.goto(f'{BASE}/#{route}', wait_until='networkidle')
                page.evaluate('document.fonts.ready')
                page.screenshot(path=str(OUTPUT / f'{name}-{device}.png'), full_page=True)
                if name == 'inicio':
                    page.screenshot(path=str(OUTPUT / f'primeiro-ecra-{device}.png'))
        browser.close()
    print('Captured 8 complete pages and 2 first screens in capturas/.')


if __name__ == '__main__':
    main()
