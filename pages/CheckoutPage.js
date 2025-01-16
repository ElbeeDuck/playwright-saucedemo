class CheckoutPage {
    constructor(page){
        this.page = page;
        this.checkoutPageTitle = page.locator('[data-test="title"]');
        this.firstnameInput =  page.locator('[data-test="firstName"]');
        this.lastnameInput = page.locator('[data-test="lastName"]');
        this.postcodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.getByRole('button', {name: "Continue"});
        this.errorMessage = page.locator('[data-test="error"]');
    }
    async enterValidUserInfo(firstName, lastName, postcode) {
        await this.firstnameInput.fill(firstName);
        await this.lastnameInput.fill(lastName);
        await this.postcodeInput.fill(postcode);
        await this.continueButton.click();
    }
    async enterInvalidUserInfo(firstName, lastName, postcode) {
        await this.firstnameInput.fill(firstName);
        await this.lastnameInput.fill(lastName);
        await this.postcodeInput.fill(postcode);
        await this.continueButton.click();
        return this.errorMessage.textContent();
    }
}
module.exports = CheckoutPage;