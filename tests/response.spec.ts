import { test, expect } from '@playwright/test';

test('response', async ({ page }) => {
  //login
  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
  await page.locator('input[type="password"]').fill('test');
  await page.getByRole('button', { name: 'Sign In' }).click({force: true});
  await page.waitForLoadState('networkidle');

  //click into article
  await page.getByRole('button', { name: 'Travel Articles' }).click({force: true});
  await page.getByRole('row', { name: '公館中正 a Detail' }).getByRole('button').click({force: true});

  //leave comment and check
  await page.getByPlaceholder('Your comment').fill('i love sad!');
  await page.getByRole('button', { name: 'Post' }).click();
  
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: '@ autouat' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'i love sad!' }).nth(2)).toBeVisible();
});