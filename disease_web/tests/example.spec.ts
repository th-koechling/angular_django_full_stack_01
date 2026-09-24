import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Diseases overview page opens with title', async ({ page }) => {
  await page.goto('http://localhost:4200/diseases/home');

  // Expect the title of the page to be (or include?) "Disease Home".
  await expect(page).toHaveTitle(/DiseaseWeb/);
});

test('Genes landing page opens', async ({ page }) => {
  await page.goto('http://localhost:4200/genes/home');

  // Expect some shit.
  await expect(page.getByRole('button', { name: 'Panels' })).toBeVisible();
});

