const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CartPage = require('../pages/CartPage');
const ProductPage = require('../pages/ProductPage');
const CheckoutPage = require('../pages/CheckoutPage');
const CheckoutOverviewPage = require('../pages/CheckoutOverviewPage');
const CheckoutCompletePage = require('../pages/CheckoutCompletePage');
const dataSet = JSON.parse(JSON.stringify(require("../test-data/loginPageTestData.json")));
const checkoutDataSet = JSON.parse(JSON.stringify(require("../test-data/checkoutTestData.json")));

test.describe('5. Verify the review process before order completion.', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const url = 'https://www.saucedemo.com/';

        await loginPage.goTo(url);
        await expect(page).toHaveTitle(/Swag Labs/);

        await loginPage.performLogin(dataSet.userName, dataSet.password);
        await expect(page).toHaveURL(/inventory/i);
    });

    test('Test item overview.', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(checkoutDataSet.firstProductName);
        await productPage.addItemToCart(checkoutDataSet.secondProductName);
        await productPage.goToCart();

        await cartPage.gotToCheckout();
        await checkoutPage.enterValidUserInfo(checkoutDataSet.firstName, checkoutDataSet.lastname, checkoutDataSet.postcode);

        // //Step 1. Verify that all items added to the cart are listed in the order review.
        // const products = await page.locator('[data-test="cart-list"]').allTextContents();
        const products = await checkoutOverviewPage.extractProductDetails();
        console.log(products);
        // //Step 2. Verify that the price, quantity, and product name are correctly displayed.
        // Assertions to verify the product details
        expect(products).toContainEqual({
            name: checkoutDataSet.firstProductName,
            price: checkoutDataSet.firstProductPrice
        });
        expect(products).toContainEqual({
            name: checkoutDataSet.secondProductName,
            price: checkoutDataSet.secondProductPrice
        });
    });

    test('Test completing the order.', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        const productPage = new ProductPage(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        await productPage.addItemToCart(checkoutDataSet.firstProductName);
        await productPage.addItemToCart(checkoutDataSet.secondProductName);
        await productPage.goToCart();

        await cartPage.gotToCheckout();
        await checkoutPage.enterValidUserInfo(checkoutDataSet.firstName, checkoutDataSet.lastname, checkoutDataSet.postcode);
        //Step 1. Click the "Finish" button to complete the purchase.
        await checkoutOverviewPage.finish();
        //Step 2.  Verify that the order is successfully completed by checking for a confirmation message (e.g., "THANK YOU FOR YOUR ORDER").
        const titleText = await checkoutCompletePage.getTitleText();
        expect(titleText).toContain("Checkout: Complete!");
    });
});