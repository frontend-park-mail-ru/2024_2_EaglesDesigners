'use strict'

export class LoginForm {
    #parent
    constructor(parent) {
        this.#parent = parent
    }


    renderTemplate() {
        const template = Handlebars.templates['loginForm.hbs'];  
        
        return template();
    }

}