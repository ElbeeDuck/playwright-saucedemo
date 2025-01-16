class BasePage {
    constructor(page){
        this.page = page;
        this.title = page.locator('[data-test="title"]');
    }

    async verifyPageTitle(expectedText) {
        await expect(this.title).toHaveText(expectedText);
    }
}

module.exports = BasePage;