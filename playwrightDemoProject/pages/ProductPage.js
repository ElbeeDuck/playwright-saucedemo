class ProductPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator("[data-test='inventory-item']");
        this.productSort = page.locator('.product_sort_container');
        this.itemToCart = page.locator('.btn_inventory');
        this.cartButton = page.locator('[data-test="shopping-cart-link"]');
        this.removeButton = page.getByRole('button', { name: "Remove" });
    }

    /**
     * Extracts the details (name, price, and image status) of all products displayed on the page.
     * @returns {Promise<Array<{ name: string, price: string, hasImage: boolean }>>} Array of product details
     */
    async extractProductDetails() {
        // Count the total number of product elements on the page
        const productCount = await this.products.count();
        // Initialize an empty array to store the details of each product (name and price)
        const productDetails = [];
        // Loop through each product element based on the count
        for (let i = 0; i < productCount; i++) {
            // For the current product (indexed by 'i'), find the element containing the product name,price and if has image
            const productName = await this.products.nth(i).locator('.inventory_item_name').textContent();
            const productPrice = await this.products.nth(i).locator('.inventory_item_price').textContent();
            const productImage = await this.products.nth(i).locator('.inventory_item_img').first();
            const imageExists = await productImage.isVisible();
            // Add the extracted product name and price to the 'productDetails' array along with whether the image exists
            // Use .trim() to remove any extra spaces from the extracted text
            productDetails.push({
                name: productName.trim(),
                price: productPrice.trim(),
                hasImage: imageExists
            });
        }
        return productDetails;
    }

    /**
     * Sorts the products on the page based on the given sorting option.
     * @param {string} sortOption - The sorting option to apply (e.g., "Price (low to high)")
     * @returns {Promise<Locator>} Locator for the first product after sorting
     */
    async sortProducts(sortOption) {
        //Select the option to sort low to high
        await this.productSort.selectOption(sortOption);
        //Return the first product on the product page
        return this.products.first();
    }

    /**
     * Adds a specific product to the cart based on its name.
     * @param {string} productName - The name of the product to add to the cart
     */
    async addItemToCart(productName) {
        const product = await this.products.filter({ hasText: productName });
        // Check if the product exists
        if ((await product.count()) > 0) {
            // Find the "Add to cart" button within the product and click it
            const addToCartButton = product.first().locator('.btn_inventory');
            await addToCartButton.click();
        } else {
            console.log(`Product "${productName}" not found.`);
        }
    }

    /**
     * Adds multiple products to the cart based on an array of product names.
     * @param {string[]} productNames - An array of product names to add to the cart
     */
    async addItemsToCart(productNames) {
        for (const productName of productNames) {
            await this.addItemToCart(productName);
        }
    }

    /**
     * Retrieves the number of items currently in the cart.
     * @returns {Promise<string>} The number of items in the cart as a string
     */
    async getCartCount() {
        const cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');
        if (await cartBadge.isVisible()) {
            const countText = await cartBadge.textContent();
            return countText.trim();
        } else {
            console.log('Cart badge not visible. Assuming count is 0.');
            return "0";
        }
    }

    /**
    * Removes the first item from the cart.
    */
    async removeItemFromCart() {
        await this.removeButton.first().click();
    }

    /**
     * Navigates to the cart page by clicking the cart button.
     */
    async goToCart() {
        await this.cartButton.click();
    }
}
module.exports = ProductPage;