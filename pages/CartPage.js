class CartPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator("[data-test='inventory-item']");
        this.productNameLocator = page.locator("[data-test='inventory-item-name']");
        this.productPriceLocator = page.locator('.inventory_item_price');
        this.productQuantityLocator = page.locator("[data-test='item-quantity']");
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.cartPageTitle = page.locator('[data-test="title"]');
    }

    async extractProductDetails() {
        // Count the total number of product elements on the page
        const productsCount = await this.products.count();
        // Initialize an empty array to store the details of each product (name and price)
        const productsDetails = [];
        // Loop through each product element based on the count
        for (let i = 0; i < productsCount; i++) {
            // For the current product (indexed by 'i'), find the element containing the product name
            const productName = await this.products.nth(i).locator('.inventory_item_name').textContent();
            //const productName = await this.products.nth(i).locator('.inventory_item_name').textContent();
            // For the current product, find the element containing the product price
            //const productPrice = await this.products.nth(i).locator('.inventory_item_price').textContent();
            const productPrice = await this.products.nth(i).locator('.inventory_item_price').textContent();
            // Add the extracted product name and price to the 'productDetails' array along with whether the image exists
            // Use .trim() to remove any extra spaces from the extracted text
            debugger;
            productsDetails.push({
                name: productName.trim(),
                price: productPrice.trim(),
            });
        }
        return productsDetails;
    }

    async removeItemsFromCart(productName) {
        const product = await this.products.filter({ hasText: productName });
        // Check if the product exists
        if ((await product.count()) > 0) {
            // Find the "Add to cart" button within the product and click it
            await product.getByRole('button', { name: 'Remove' }).click();
            console.log(`${productName} has been removed from the cart.`);
        } else {
            console.log(`Product "${productName}" not found.`);
        }
    }

    async gotToCheckout() {
        await this.checkoutButton.click();
        return await this.cartPageTitle.textContent(); 
    }
}

module.exports = CartPage;