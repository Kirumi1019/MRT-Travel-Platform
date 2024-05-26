import { test, expect } from '@playwright/test';
//Please delete the account will be created for testing in the database first if exist

test('register flow', async ({ page }) => {
  //Go to 
  await page.goto('http://localhost:3000');

  //Register
  await page.getByText('Sign Up').click();
  await page.locator('body').press('F5');
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('signup@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('signuptest');
  await page.locator('div').filter({ hasText: /^Password$/ }).getByRole('textbox').fill('1234');
  await page.locator('div').filter({ hasText: /^Confirm Password$/ }).getByRole('textbox').fill('1234');
  await page.getByRole('button', { name: 'Sign Up' }).click({force: true});

  //Turn to info and log out
  await page.getByRole('button', { name: 'Log Out' }).click({force: true});

  //Re-login and test
  await page.locator('div').filter({ hasText: /^Email$/ }).getByRole('textbox').fill('signup@test.com');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByRole('textbox').fill('signuptest');
  await page.locator('input[type="password"]').fill('1234');
  await page.getByRole('button', { name: 'Sign In' }).click({force: true});
  await page.getByRole('button', { name: 'signuptest \'s Profile' }).click({force: true});
  await page.locator('[id="emailsignup\\@test\\.com"]').isVisible();
  await page.getByRole('button', { name: 'Log Out' }).click({force: true});
});
