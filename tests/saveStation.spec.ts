import { test, expect } from '@playwright/test';

test('love station', async ({ page }) => {
    //login
    await page.goto('http://localhost:3000/');
    await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('autouat@test.com');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('autouat');
    await page.locator('input[type="password"]').fill('test');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForLoadState('networkidle');

    //Love station
    await page.getByRole('link', { name: 'MRT Stations' }).click({force: true});
    await page.waitForLoadState('networkidle');
    await page.getByText('動物園Line: 文湖線BR01').click();
    await page.waitForLoadState('networkidle');
    await page.locator('div').filter({ hasText: 'Station Name:動物園Line Names:文湖線Track InfoDestination Name: 南港展覽館站' }).getByRole('button').click();
    await page.waitForLoadState('networkidle');

    //click one more time to delove
    await page.locator('body').press('F5');
    await page.getByRole('button', { name: 'My Stations' }).click({force: true});
    await page.getByRole('link', { name: '動物園' }).click();
    await page.locator('div').filter({ hasText: 'Station Name:動物園Line Names:文湖線Track InfoDestination Name: 南港展覽館站' }).getByRole('button').click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'My Stations' }).click({force: true});
    await expect(page.getByRole('link', { name: '動物園' })).toBeHidden();

});