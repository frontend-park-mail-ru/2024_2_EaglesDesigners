import {LoginForm} from '../../widgets/loginForm/loginForm.js';

export class RenderLogin {
    #parent
    constructor(parent) {
        this.#parent = parent;
    }

    render() {
        const form = new LoginForm(this.#parent);
        
        form.renderTemplate();
        
    }
    
}
