'use strict'

export class Form {
    #parent
    constructor(parent) {
        this.#parent = parent;

    }

    get parent() {
        return this.#parent;
    }



    renderTemplate() {
        const template = Handlebars.templates['form.hbs'];  
        this.#parent = template();

    }

}