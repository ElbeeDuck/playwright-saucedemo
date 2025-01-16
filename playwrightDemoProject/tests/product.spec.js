const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const dataSet = JSON.parse(JSON.stringify(require("../test-data/loginPageTestData.json")));
const productDataSet = JSON.parse(JSON.stringify(require("../test-data/productTestData.json")));
test.describe('Test product page/element interactions', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        // const userName = 'standard_user';
        // const password = 'secret_sauce';
        const url = 'https://www.saucedemo.com/';

        await page.goto(url);
        await expect(page).toHaveTitle(/Swag Labs/);
        await loginPage.performLogin(dataSet.userName, dataSet.password);
        await expect(page).toHaveURL(/inventory/i);
    });

    test('1. Test product list display', async ({ page }) => {
        const productPage = new ProductPage(page);
        //Step 1: After successful login, verify that the list of products is displayed.
        const extractedProductDetails = await productPage.extractProductDetails();
        //Step 2: Ensure that each product has an image, a title, and a price.

        // Loop through each product in the test data and verify details
        for (const expectedProduct of productDataSet.products) {
            expect(extractedProductDetails).toContainEqual({
                name: expectedProduct.name,
                price: expectedProduct.price,
                hasImage: expectedProduct.hasImage
            });
        }
        //console.log('List of products on product page: ', productDetails);
    });

    test('2. Test product sorting', async ({ page }) => {
        const productPage = new ProductPage(page);
        const sortOptionLowToHigh = "Price (low to high)";
        //Step 1: Use the dropdown to sort products by "Price (low to high)".
        await productPage.sortProducts(sortOptionLowToHigh);
        const lowestProductNameLocator = await page.locator('[data-test="inventory-item-name"]').first();
        //Step 2: Verify that the product list is sorted correctly.
        await expect(lowestProductNameLocator).toHaveText(productDataSet.firstProductName);
        //Step 3: Use the dropdown again to sort by "Price (high to low)".
        const sortOptionHighToLow = "Price (high to low)";
        await productPage.sortProducts(sortOptionHighToLow);
        const highestProductNameLocator = await page.locator('[data-test="inventory-item-name"]').first();
        //Step 4: Verify that the product list is sorted correctly.
        await expect(highestProductNameLocator).toHaveText(productDataSet.secondProductName);
    });

    test('3. Test adding a product to the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        //Step 1: Click on the "Add to cart" button for a product.
        await productPage.addItemToCart(productDataSet.secondProductName);
        const noItems = await productPage.getCartCount();
        expect(Number(noItems)).toBe(1);
    });

    test('4.  Test adding multiple products to the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        //Step 1. Add multiple products to the cart (e.g., two or three).
        const productNames = ['Sauce Labs Fleece Jacket', 'Sauce Labs Onesie', 'Sauce Labs Bolt T-Shirt'];
        await productPage.addItemsToCart(productNames);
        await page.waitForSelector('[data-test="shopping-cart-badge"]', { state: 'visible' });
        const noItems = await productPage.getCartCount();
        //Step 2. Verify that the cart icon reflects the correct number of items.
        expect(Number(noItems)).toBe(3);
    });

    test('5. Test removing a product from the cart', async ({ page }) => {
        const productPage = new ProductPage(page);
        //Step 1: Click on the "Add to cart" button for a product.
        await productPage.addItemToCart();
        let noItems = await productPage.getCartCount();
        expect(Number(noItems)).toBe(1);
        //Step 2. Click the "Remove" button for one product.
        await productPage.removeItemFromCart();
        noItems = await productPage.getCartCount();
        //Step 3. Verify that the product is removed from the cart and the cart icon updates accordingly.
        expect(Number(noItems)).toBe(0);
    });
});