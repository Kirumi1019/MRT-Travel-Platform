import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  //Go to 
  await page.goto('http://localhost:3000');

  //Login
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
  await page.locator('input[type="password"]').fill('test');
  await page.getByRole('button', { name: 'Sign In' }).click({force: true});

  //check info
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'autouat \'s Profile' }).click({force: true});
  await page.locator('[id="emailautouat\\@test\\.com"]').isVisible();
  await page.locator('#userNameautouat').isVisible();

  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Log Out' }).click({force: true});
});
