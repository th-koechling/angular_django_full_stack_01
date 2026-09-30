import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/diseases/home');
  await page.getByRole('link', { name: 'Grid' }).click();
  await page.locator('mat-card').filter({ hasText: 'KRANK2subtitledescription' }).getByRole('button').click();
  await page.getByRole('button', { description: 'Zur Panel-Auswahl', exact: true }).click();
  await page.getByRole('cell', { name: 'LMFAO', exact: true }).click();
});

