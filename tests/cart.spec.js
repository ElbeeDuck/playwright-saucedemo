const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const dataSet = JSON.parse(JSON.stringify(require("../test-data/loginPageTestData.json")));
const cartDataSet = JSON.parse(JSON.stringify(require("../test-data/cartPageTestData.json")));
const checkoutDataSet = JSON.parse(JSON.stringify(require("../test-data/checkoutTestData.json")));

// 3. Cart Page (https://www.saucedemo.com/cart.html)

// Objective: Test cart functionality and checkout process.
test.describe('Test cart functionality and checkout process', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const url = 'https://www.saucedemo.com/';

        await loginPage.goTo(url);
        await expect(page).toHaveTitle(/Swag Labs/);

        await loginPage.performLogin(dataSet.userName, dataSet.password);
        await expect(page).toHaveURL(/inventory/i);
    });
    //     Scenario 1: Test cart item display.
    test('1. Test cart item display', async ({ page }) => {
        const cartPage = new CartPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(cartDataSet.firstProductName);
        await productPage.addItemToCart(cartDataSet.secondProductName);
        //Step 1 Navigate to the cart page.
        await productPage.goToCart();
        //Step 2 Verify that all items added in the previous steps are visible on the cart page with product names, quantities, and prices.
        const products = await cartPage.extractProductDetails();
        if (!products || products.length === 0) {
            throw new Error('No products found in the checkout overview.');
        }
        expect(products).toContainEqual({
            name: checkoutDataSet.firstProductName,
            price: checkoutDataSet.firstProductPrice,
        });
    });

    //cant do this as the website wont let me change quantity in the cart!!! or add more items from the products page
    // test('Scenario 2: Test cart quantity change', async (page) => {
    //     const cartPage = new CartPage(page);
    //     const productPage = new ProductPage(page);

    //     await productPage.addItemToCart(firstProductName);
    //     await productPage.addItemToCart(secondProductName);
    //     await productPage.goToCart();
    // //Step 1. Change the quantity of a product in the cart.

    // //Step 2. Verify that the total price updates accordingly.

    // });

    test('3. Test proceed to checkout', async ({ page }) => {
        const cartPage = new CartPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(cartDataSet.firstProductName);
        await productPage.addItemToCart(cartDataSet.secondProductName);

        await productPage.goToCart();
        //Step 1. Click on the "Checkout" button.
        const pageTitle = await cartPage.gotToCheckout();
        //Step 2. Verify that the user is redirected to the checkout page.
        expect(pageTitle.trim()).toContain("Checkout: Your Information");
    });

    test('4. Test empty cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        const productPage = new ProductPage(page);

        await productPage.addItemToCart(cartDataSet.firstProductName);
        await productPage.addItemToCart(cartDataSet.secondProductName);

        //Step 1. Remove all items from the cart.
        await cartPage.removeItemsFromCart(cartDataSet.firstProductName);
        await cartPage.removeItemsFromCart(cartDataSet.secondProductName);
        //Step 2. Verify that the cart is empty and displays the appropriate message (e.g., "Your cart is empty").
        //This message isnt present on the website so cannot assert for it

    });
});