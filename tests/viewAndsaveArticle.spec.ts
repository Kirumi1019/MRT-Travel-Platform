import { test, expect } from '@playwright/test';

test('view and save article', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click({force: true});

    //View articles
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Travel Articles' }).click({force: true});
    await page.getByRole('row', { name: '公館中正 a Detail' }).getByRole('button').click({force: true});
    await expect(page.getByRole('heading', { name: 'Title: 公館中正' })).toBeVisible();
    await expect(page.getByText('Content:test')).toBeVisible();

    //View saved articles
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Save' }).click(({force: true}));
    await page.getByRole('button', { name: 'Favorites' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Detail' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Title: 公館中正' })).toBeVisible();
    await expect(page.getByText('Content:test')).toBeVisible();

    //Remove saved articles
    await page.getByRole('button', { name: 'Favorites' }).click({force: true});
    await page.getByRole('button', { name: 'Remove' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('cell', { name: '公館中正' })).toBeHidden();
    await expect(page.getByRole('cell', { name: 'a', exact: true })).toBeHidden();
    await page.getByRole('button', { name: 'Log Out' }).click({force: true});
});