import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  //Go to 
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle('Create Next App');

  //Login
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
  await page.locator('input[type="password"]').fill('test');
  await page.getByRole('button', { name: 'Sign In' }).click();

  //check info
  await page.getByRole('button', { name: 'My Info' }).click();
  await page.locator('[id="emailautouat\\@test\\.com"]').click();
  await page.locator('#userNameautouat').click();
  await page.getByRole('button', { name: 'Log out' }).click();
});
