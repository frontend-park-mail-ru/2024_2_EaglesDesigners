'use strict'

export class Form {
    #parent
    constructor(parent) {
        this.#parent = parent
    }


    renderTemplate() {
        const template = Handlebars.templates['form.hbs'];  
        
        return template();
    }

}