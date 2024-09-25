export class signupForm {

    constructor() {

    }

    renderTemplate() {
        const template = Handlebars.template['form.hbs'];

        return template();
    }
}
