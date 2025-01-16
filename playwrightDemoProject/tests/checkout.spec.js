const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const ProductPage = require('../pages/ProductPage');
const dataSet = JSON.parse(JSON.stringify(require("../test-data/loginPageTestData.json")));
const checkoutDataSet = JSON.parse(JSON.stringify(require("../test-data/checkoutTestData.json")));

test.describe('Test checkout page form and user flow', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const url = 'https://www.saucedemo.com/';
        await page.goto(url);
        await expect(page).toHaveTitle(/Swag Labs/);
        await loginPage.performLogin(dataSet.userName, dataSet.password);
        await expect(page).toHaveURL(/inventory/i);
    });

    test('1. Test successful checkout process', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(checkoutDataSet.firstProductName);
        await productPage.addItemToCart(checkoutDataSet.secondProductName);
        await productPage.goToCart();
        //Step 1 Navigate to the checkout page with items in the cart.
        try {
            await cartPage.gotToCheckout();


            //Step 2 Enter valid user information (name, address, postal code).
            //Step 3 Click the "Continue" button.
            await checkoutPage.enterValidUserInfo(checkoutDataSet.firstName, checkoutDataSet.lastname, checkoutDataSet.postcode);
            //Step 4 Verify that the user proceeds to the next step (the "Checkout: Overview" page).
            await expect(page.locator('[data-test="title"]')).toBeVisible();
        } catch (error) {
            console.error("Error title not visible:", error);
            throw error;  // Optionally rethrow if you want to fail the test.
        }
    });

    test('2. Test empty form fields.', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(checkoutDataSet.firstProductName);
        await productPage.addItemToCart(checkoutDataSet.secondProductName);
        await productPage.goToCart();
        await cartPage.gotToCheckout();
        try {
            //Step 1. Leave required fields empty (name, address, postal code)
            //Step 2. Click the "Continue" button.
            await checkoutPage.enterInvalidUserInfo(checkoutDataSet.emptyFirstName, checkoutDataSet.emptyLastname, checkoutDataSet.emptyPostcode);
            //Step 3. Verify that an error message is shown for missing fields.
            await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
        } catch (error) {
            console.error("Error during empty form fields test:", error);
            throw error;  // Optionally rethrow if you want to fail the test.
        }
    });

    test('3. Test invalid postal code format.', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(checkoutDataSet.firstProductName);
        await productPage.addItemToCart(checkoutDataSet.secondProductName);
        await productPage.goToCart();
        await cartPage.gotToCheckout();
        //Step 1. Enter a valid name and address but an invalid postal code (e.g., "1234") NOT POSSIBLE AS FIELD WILL ENTER ANYTHING - BUG!.
        const errormessage = await checkoutPage.enterInvalidUserInfo(checkoutDataSet.firstName, checkoutDataSet.lastname, checkoutDataSet.emptyPostcode);
        //Step 2. Verify that an error or warning is displayed.
        expect(errormessage).toContain("Postal Code");
    });
});