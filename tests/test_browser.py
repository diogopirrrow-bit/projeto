"""Functional checks for the local Surf Point presentation prototype.

Run a local server first, then: python3 tests/test_browser.py
Optional: SURF_POINT_BASE_URL and CHROMIUM_PATH.
"""
import os
import unittest
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('SURF_POINT_BASE_URL', 'http://127.0.0.1:8000').rstrip('/')
CHROMIUM = os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium')


class PrototypeBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=CHROMIUM, headless=True,
                                           args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000})
        self.page = self.context.new_page()
        self.errors, self.external, self.failed = [], [], []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.on('console', lambda msg: self.errors.append(msg.text) if msg.type == 'error' else None)
        self.page.on('request', lambda req: self.external.append(req.url)
                     if not req.url.startswith(BASE + '/') and not req.url.startswith('data:') else None)
        self.page.on('requestfailed', lambda req: self.failed.append((req.url, req.failure)))
        self.page.goto(BASE + '/', wait_until='networkidle')
        self.page.evaluate('document.fonts.ready')

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Browser errors')
        self.assertEqual(self.external, [], 'Unexpected external resources or data submission')
        self.assertEqual(self.failed, [], 'Failed resource requests')

    def go(self, route):
        self.page.evaluate('(route) => location.hash = route', route)
        expect(self.page.locator('main h1')).to_have_count(1)
        self.page.wait_for_function('(route) => location.hash === "#" + route', arg=route)
        self.page.wait_for_timeout(80)

    def close_dialog(self):
        self.page.keyboard.press('Escape')
        expect(self.page.locator('dialog')).not_to_be_visible()

    def test_01_routes_and_product_pages(self):
        for route, title in [('inicio', 'O mar'), ('loja', 'Encontra a tua'),
                             ('alugueres', 'Leva só'), ('ponto', 'Uma loja')]:
            with self.subTest(route=route):
                self.go(route)
                expect(self.page.locator('main h1')).to_contain_text(title)
                expect(self.page.locator('.demo-bar')).to_be_visible()
                self.assertTrue(self.page.title().endswith('Surf Point'))
        for product in ['atlantic-midlength', 'ocean-fullsuit', 'everyday-wave-tee', 'sunset-twin']:
            with self.subTest(product=product):
                self.go('produto/' + product)
                expect(self.page.locator('.product-info h1')).to_be_visible()
                expect(self.page.locator('.variant-button')).not_to_have_count(0)
                expect(self.page.locator('.gallery-stage .art')).to_be_visible()
        self.go('produto/inexistente')
        expect(self.page.locator('main h1')).to_contain_text('não existe')

    def test_02_catalog_filter_search_sort_empty_reset(self):
        self.go('loja')
        cards = self.page.locator('#catalog-grid .product-card')
        expect(cards).to_have_count(4)
        self.page.locator('[data-category="Pranchas"]').click()
        expect(cards).to_have_count(2)
        self.page.locator('[data-category="Fatos"]').click()
        expect(cards).to_have_count(1)
        expect(cards.first).to_contain_text('Ocean Fullsuit')
        self.page.locator('[data-category="Tudo"]').click()
        self.page.locator('#catalog-search').fill('vestuario')
        expect(cards).to_have_count(1)
        expect(cards.first).to_contain_text('Everyday Wave Tee')
        self.page.locator('#catalog-search').fill('CARVAO')
        expect(cards).to_have_count(1)
        expect(cards.first).to_contain_text('Ocean Fullsuit')
        self.page.locator('#catalog-search').fill('não existe este equipamento')
        expect(cards).to_have_count(0)
        expect(self.page.locator('.empty-state')).to_be_visible()
        self.page.locator('.empty-state [data-action="reset"]').click()
        expect(cards).to_have_count(4)
        expect(self.page.locator('#catalog-search')).to_be_focused()
        self.page.locator('#catalog-sort').select_option('asc')
        self.assertEqual(cards.locator('h3').all_text_contents(), ['Everyday Wave Tee', 'Ocean Fullsuit 4/3', 'Sunset Twin', 'Atlantic Midlength'])
        self.page.locator('#catalog-sort').select_option('desc')
        expect(cards.first).to_contain_text('Atlantic Midlength')
        self.page.locator('#catalog-sort').select_option('name')
        self.assertEqual(cards.locator('h3').all_text_contents(), ['Atlantic Midlength', 'Everyday Wave Tee', 'Ocean Fullsuit 4/3', 'Sunset Twin'])
        self.page.locator('.catalog-status [data-action="reset"]').click()
        expect(self.page.locator('#catalog-sort')).to_have_value('featured')
        expect(cards.first).to_contain_text('Atlantic Midlength')
        self.page.locator('#catalog-search').fill('<img src=x onerror=alert(1)>')
        expect(cards).to_have_count(0)
        expect(self.page.locator('#catalog-grid img')).to_have_count(0)

    def test_03_product_gallery_help_cart_and_session_persistence(self):
        self.go('produto/atlantic-midlength')
        self.page.locator('[data-gallery="detail"]').click()
        expect(self.page.locator('#gallery-stage')).to_have_class('gallery-stage detail-view')
        self.page.locator('[data-gallery="full"]').click()
        expect(self.page.locator('#gallery-stage')).to_have_class('gallery-stage')
        help_button = self.page.locator('[data-action="help"]')
        help_button.click()
        expect(self.page.locator('dialog')).to_be_visible()
        expect(self.page.locator('#dialog-content')).to_contain_text('nível, peso')
        self.close_dialog()
        expect(help_button).to_be_focused()
        self.page.locator('[data-variant="1"]').click()
        expect(self.page.locator('[data-variant="1"]')).to_have_attribute('aria-pressed', 'true')
        self.page.locator('[data-action="add"]').click()
        expect(self.page.locator('.cart-item')).to_have_count(1)
        expect(self.page.locator('.cart-item')).to_contain_text('7′0″')
        expect(self.page.locator('.cart-count')).to_have_text('1')
        self.page.locator('[data-change="1"]').click()
        expect(self.page.locator('.quantity-control span')).to_have_text('2')
        expect(self.page.locator('.cart-count')).to_have_text('2')
        expect(self.page.locator('.cart-total')).to_contain_text('1180')
        self.page.locator('[data-change="-1"]').click()
        expect(self.page.locator('.quantity-control span')).to_have_text('1')
        self.close_dialog()
        expect(self.page.locator('[data-action="add"]')).to_be_focused()
        self.page.reload(wait_until='networkidle')
        expect(self.page.locator('.cart-count')).to_have_text('1')
        self.page.locator('[data-action="cart"]').click()
        expect(self.page.locator('.cart-item')).to_contain_text('7′0″')
        self.close_dialog()
        self.page.locator('[data-variant="2"]').click()
        self.page.locator('[data-action="add"]').click()
        expect(self.page.locator('.cart-item')).to_have_count(2)
        self.page.locator('[data-remove="0"]').click()
        expect(self.page.locator('.cart-item')).to_have_count(1)
        self.page.locator('[data-remove="0"]').click()
        expect(self.page.locator('.cart-empty')).to_be_visible()
        expect(self.page.locator('.cart-count')).to_have_text('0')
        self.assertEqual(self.page.evaluate('JSON.parse(sessionStorage.getItem("surf-point-selection"))'), [])

    def test_04_rentals_equipment_duration_and_summary(self):
        self.go('alugueres')
        for equipment in ['fato', 'conjunto', 'prancha']:
            self.page.locator(f'[data-equipment="{equipment}"]').click()
            expect(self.page.locator(f'[data-equipment="{equipment}"]')).to_have_attribute('aria-pressed', 'true')
        self.page.locator('[data-equipment="conjunto"]').click()
        expect(self.page.locator('#rental-label')).to_have_text('Prancha + fato')
        self.page.locator('#rental-duration').select_option('1 dia')
        summary = self.page.locator('[data-action="rental-summary"]')
        summary.click()
        expect(self.page.locator('dialog')).to_be_visible()
        expect(self.page.locator('dialog')).to_contain_text('Nenhuma reserva foi criada')
        expect(self.page.locator('dialog')).to_contain_text('Prancha + fato')
        expect(self.page.locator('dialog')).to_contain_text('1 dia')
        expect(self.page.locator('dialog')).to_contain_text('Não consultada')
        self.close_dialog()
        expect(summary).to_be_focused()
        self.page.locator('.rental-faq summary').first.click()
        expect(self.page.locator('.rental-faq details').first).to_have_attribute('open', '')

    def test_05_global_search_dialog_keyboard_focus_and_navigation(self):
        search = self.page.locator('[data-action="search"]')
        search.focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('#global-search')).to_be_focused()
        for _ in range(12):
            self.page.keyboard.press('Tab')
            self.assertTrue(self.page.evaluate('document.querySelector("dialog").contains(document.activeElement)'), 'Focus escaped modal dialog')
        self.page.locator('dialog .close-button').focus()
        self.page.keyboard.press('Shift+Tab')
        expect(self.page.locator('.search-suggestions a').last).to_be_focused()
        self.page.keyboard.press('Escape')
        expect(search).to_be_focused()
        search.click()
        self.page.locator('#global-search').fill('Twin')
        self.page.locator('#global-search').press('Enter')
        expect(self.page.locator('dialog')).not_to_be_visible()
        expect(self.page.locator('#catalog-grid .product-card')).to_have_count(1)
        expect(self.page.locator('#catalog-grid')).to_contain_text('Sunset Twin')
        expect(self.page.locator('main')).to_be_focused()
        self.page.locator('#catalog-grid .product-card').click()
        expect(self.page.locator('.product-info h1')).to_have_text('Sunset Twin')
        self.page.go_back()
        expect(self.page.locator('#catalog-grid .product-card')).to_have_count(1)
        self.page.go_forward()
        expect(self.page.locator('.product-info h1')).to_have_text('Sunset Twin')

    def test_06_mobile_menu_filters_and_keyboard(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        menu = self.page.locator('[data-action="menu"]')
        menu.click()
        expect(self.page.locator('dialog')).to_be_visible()
        self.close_dialog()
        expect(menu).to_be_focused()
        menu.click()
        self.page.locator('.mobile-nav-links a[href="#loja"]').click()
        expect(self.page.locator('dialog')).not_to_be_visible()
        expect(self.page.locator('.mobile-filter-toggle')).to_have_attribute('aria-expanded', 'false')
        self.page.locator('.mobile-filter-toggle').click()
        self.page.locator('[data-category="Pranchas"]').click()
        expect(self.page.locator('#catalog-grid .product-card')).to_have_count(2)
        self.page.locator('.mobile-filter-toggle').click()
        expect(self.page.locator('#categories')).not_to_be_visible()
        self.page.locator('[data-action="cart"]').focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('.cart-empty')).to_be_visible()
        self.close_dialog()
        expect(self.page.locator('[data-action="cart"]')).to_be_focused()

    def test_07_required_widths_no_horizontal_overflow_or_missing_images(self):
        routes=['inicio', 'loja', 'produto/atlantic-midlength', 'produto/ocean-fullsuit',
                'produto/everyday-wave-tee', 'produto/sunset-twin', 'alugueres', 'ponto']
        for width in [360, 390, 768, 1440]:
            self.page.set_viewport_size({'width': width, 'height': 900})
            for route in routes:
                with self.subTest(width=width, route=route):
                    self.go(route)
                    self.page.evaluate('document.fonts.ready')
                    metrics=self.page.evaluate('({viewport:innerWidth, page:document.documentElement.scrollWidth, body:document.body.scrollWidth, broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)})')
                    self.assertLessEqual(metrics['page'], width, metrics)
                    self.assertLessEqual(metrics['body'], width, metrics)
                    self.assertEqual(metrics['broken'], [])
            self.page.locator('[data-action="cart"]').click()
            box=self.page.locator('dialog').bounding_box()
            self.assertGreaterEqual(box['x'], 0)
            self.assertLessEqual(box['x']+box['width'], width)
            self.close_dialog()

    def test_08_reduced_motion_and_visible_keyboard_focus(self):
        self.context.grant_permissions([])
        self.page.emulate_media(reduced_motion='reduce')
        self.go('loja')
        self.page.locator('#catalog-search').focus()
        self.page.keyboard.press('Tab')
        expect(self.page.locator('#catalog-sort')).to_be_focused()
        self.assertTrue(self.page.locator('#catalog-sort').evaluate('(e)=>e.matches(":focus-visible")'))
        self.assertEqual(self.page.locator('html').evaluate('(e)=>getComputedStyle(e).scrollBehavior'), 'auto')
        self.page.keyboard.press('Shift+Tab')
        expect(self.page.locator('#catalog-search')).to_be_focused()

    def test_09_skip_link_keeps_current_route_and_moves_focus(self):
        self.go('produto/atlantic-midlength')
        self.page.locator('.skip-link').focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('.product-info h1')).to_have_text('Atlantic Midlength')
        expect(self.page.locator('main')).to_be_focused()
        self.assertEqual(self.page.evaluate('location.hash'), '#produto/atlantic-midlength')


if __name__ == '__main__':
    unittest.main(verbosity=2)
