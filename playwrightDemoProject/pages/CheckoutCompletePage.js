class CheckoutCompletePage {
    constructor(page) {
        this.page = page;
        this.thankYouText = page.locator('[data-test="complete-header"]');
        this.titleLocator = page.locator('[data-test="title"]');
    }

    async checkoutText(){
        return this.thankYouText.textContent();
    }

    async getTitleText() {
        return await this.titleLocator.textContent();
    }
}
module.exports = CheckoutCompletePage;