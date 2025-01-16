const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const dataSet = JSON.parse(JSON.stringify(require("../test-data/loginPageTestData.json")));

test.describe('Test login functionality and error handling', function () {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const url = 'https://www.saucedemo.com/';
    await loginPage.goTo(url);
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('1. Test valid login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(dataSet.userName, dataSet.password);
    await expect(page).toHaveURL(/inventory/i);
  });

  test('2. Test invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(dataSet.invalidUserName, dataSet.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('3. Test invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(dataSet.userName, dataSet.invalidPassword);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('4. Test empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(dataSet.emptyUserName, dataSet.emptyPassword);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username is required');
  });

  test('5. Test locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(dataSet.lockedOutUserName, dataSet.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).not.toBe('');
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
  });
});