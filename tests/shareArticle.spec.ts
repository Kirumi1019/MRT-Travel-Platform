import { test, expect } from '@playwright/test';

test('share article', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    //Create article
    await page.getByRole('button', { name: 'Create Article' }).click();
    await page.getByPlaceholder('Article Title').fill('autouattest');
    await page.getByPlaceholder('Article Content').fill('i love sad!');
    await page.getByLabel('台北車站').check();
    await page.getByRole('button', { name: 'Share' }).click();

    //Check article has been created
    await page.getByRole('button', { name: 'View All Articles' }).click();
    await page.getByRole('row', { name: 'autouattest autouat More' }).getByRole('cell').nth(2).click();
    await page.getByRole('row', { name: 'autouattest autouat More' }).getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'autouattest' })).toBeVisible();
    await expect(page.getByText('i love sad!')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^台北車站$/ })).toBeVisible();
    await page.getByRole('button', { name: 'Log out' }).click();
});