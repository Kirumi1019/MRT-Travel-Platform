import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click({force: true});
    await page.waitForLoadState('networkidle');

    //check station
    await page.getByRole('button', { name: 'MRT Stations' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await page.getByText('動物園Line: 文湖線BR01').click({force: true});
    await expect(page.getByText('動物園')).toBeVisible();
    await expect(page.getByText('文湖線')).toBeVisible();

    //switch line
    await page.getByRole('button', { name: 'MRT Stations' }).click({force: true});
    await page.getByLabel('松山新店線').click({force: true});
    await page.getByLabel('板南線').click({force: true});
    await page.getByLabel('中和新蘆線').click({force: true});
    await page.getByLabel('環狀線').click({force: true});
    await page.getByLabel('文湖線').click({force: true});
    await page.getByLabel('淡水信義線').click({force: true});
});