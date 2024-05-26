import { test, expect } from '@playwright/test';

test('share article', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click({force: true});
    
    //Create article
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Create Article' }).waitFor();
    await page.getByRole('button', { name: 'Create Article' }).click({force: true});
    await page.getByPlaceholder('Article Title').fill('autouattest');
    await page.getByPlaceholder('Article Content').fill('i love sad!');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '松山新店線' }).click({force: true});
    await page.locator('#a50fc524-aa81-4b45-a5bf-4a0ded3ff730').check();
    await page.getByRole('button', { name: '松山新店線' }).click({force: true});
    await page.getByRole('button', { name: 'Share' }).click({force: true});

    //Check article has been created
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Travel Articles' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole('row', { name: 'autouattest autouat Detail' }).getByRole('button').click();
    await expect(page.getByRole('heading', { name: 'autouattest' })).toBeVisible();
    await expect(page.getByText('i love sad!')).toBeVisible();
    await expect(page.getByRole('button', { name: '新店' })).toBeVisible();
});