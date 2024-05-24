import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click();

    //View articles
    await page.getByRole('button', { name: 'View All Articles' }).click();
    await page.getByRole('row', { name: 'asd a More' }).getByRole('button').click();
    await page.getByRole('row', { name: '公館中正 a More' }).getByRole('button').click();
    await expect(page.locator('h3')).toContainText('公館中正');
    await expect(page.getByRole('main')).toContainText('test');

    //Save articles
    await page.getByRole('button', { name: 'Save this article' }).click();
    await page.getByRole('button', { name: 'Saved Articles' }).click();
    await expect(page.getByRole('cell', { name: '公館中正' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'a', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'More' }).click();
    await page.getByRole('button', { name: 'Saved Articles' }).click();
    await page.getByRole('button', { name: 'Remove' }).click();

    await page.getByRole('button', { name: 'Log out' }).click();
});