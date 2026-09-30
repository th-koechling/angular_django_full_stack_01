import { test, expect } from '@playwright/test';

const BASE_URL: string = 'http://localhost:4200/diseases/home';
const TO: number = 2000;

test('test', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Gene' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Grid' }).click();
});



