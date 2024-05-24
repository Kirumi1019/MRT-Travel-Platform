import { test, expect } from '@playwright/test';
//Please delete the account first if exist

test('has title', async ({ page }) => {
  //Go to 
  await page.goto('http://localhost:3000');

  //Register
  await page.getByText('Sign Up').click();
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('signup@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('signtest');
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill('1234');
  await page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill('1234');
  await page.getByRole('button', { name: 'Sign Up' }).click();

  //Turn to info and log out
  await page.getByRole('button', { name: 'Log out' }).click();

  //Re-login and test
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('signup@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('signuptest');
  await page.locator('input[type="password"]').fill('1234');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'My Info' }).click();
  await page.locator('[id="emailsignup\\@test\\.com"]').isVisible();
  await page.locator('#userNamesigntest').isVisible();
  await page.getByRole('button', { name: 'Log out' }).click();
});
