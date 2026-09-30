import asyncio
from playwright.async_api import async_playwright
from playwright.async_api import expect

BASE_URL = 'http://localhost:4200/diseases/home'
TO = 2000

def main():
    asyncio.run(test_navigate_to_genes_page())


async def test_navigate_to_genes_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        browser_name = browser.browser_type.name
        page = await browser.new_page()
        await page.goto(BASE_URL)
        await expect(page).to_have_title('DiseaseWeb')
        #await page.locator('[href*="genes/"]').click() # works!
        await page.get_by_role('link', name='Gene').click(timeout=TO)
        await expect(page.get_by_text('Genes', exact=True)).to_be_visible(timeout=TO)
        await page.screenshot(path=f'genes_page_screenshot_{browser_name}.png')
        await page.pause()
        #await browser.close()



