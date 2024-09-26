'use strict'

export class SignupForm {
    #parent
    constructor(parent) {
        this.#parent = parent;
    }

    renderTemplate() {
        const template = Handlebars.templates['signUpForm.hbs'];  
        return template();
    }
}
