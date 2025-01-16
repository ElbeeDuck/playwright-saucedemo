class LoginPage {
    //adds into construct - so when you create the class the variables are initialised automatically
    //catch the page here - passed when you create the object in login.spec.js
    constructor(page) {
        //this page has no life here - but when you create a login page you pass in the page and catch it here
        this.page = page;
        //this. this belongs to current class - store locators in a variable
        this.userNameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goTo(url){
        await this.page.goto(url);
    }
    
    //reusable method to perform a valid login
    async performLogin(userName, password) {
        //current class username variable
        await this.userNameInput.fill(userName);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage(userName, password) {
        return await this.errorMessage.textContent();
    }
}
//export to make available to whole framework
module.exports = LoginPage;