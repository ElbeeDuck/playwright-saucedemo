class CheckoutOverviewPage {
    constructor(page) {
        this.page = page;
        this.productContainers = page.locator('[data-test="inventory-item"]');
        this.productText = page.locator(".checkout_summary_container a");
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async extractProductDetails() {
        // Count the total number of product elements on the page
        const productCount = await this.productContainers.count();
        //console.log(`Product text: ${this.productText}`);
        if (productCount === 0) {
            console.log("No products found in the cart list.");
            return [];
        }
        // Initialize an empty array to store the details of each product (name and price)
        const productDetails = [];
        // Loop through each product element based on the count
        for (let i = 0; i < productCount; i++) {
            // For the current product (indexed by 'i'), find the element containing the product name
            const productName = await this.productContainers.nth(i).locator('.inventory_item_name').textContent();
            // For the current product, find the element containing the product price
            const productPrice = await this.productContainers.nth(i).locator('.inventory_item_price').textContent();
            productDetails.push({
                name: productName.trim(),
                price: productPrice.trim()
            });
        }
        return productDetails;
    }
    async finish() {
        // Ensure the finish button is visible and clickable before interacting with it
        await this.finishButton.waitFor({ state: 'visible' });
        await this.finishButton.click();
    }
}
module.exports = CheckoutOverviewPage;