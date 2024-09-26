export class SignupForm {

    constructor() {

    }

    renderTemplate() {
        const template = Handlebars.template['signUpForm.hbs'];

        return template();
    }
}
