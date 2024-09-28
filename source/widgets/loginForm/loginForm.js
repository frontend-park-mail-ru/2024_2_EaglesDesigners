import {sendLoginRequest} from './api/ajax.js';
import { API } from '../../shared/api/api.js'; 
import { validateEmail } from '../../shared/validation/EmailValidation.js';
import { validatePassword } from '../../shared/validation/PasswordValidation.js';

export class LoginForm {
    #parent
    constructor(parent) {
        this.#parent = parent
        
    }

    

    renderTemplate() {
        const template = Handlebars.templates['loginForm.hbs'];
        this.#parent.innerHTML = template();  
        this.#parent.querySelector('#Create').addEventListener('click', () => {
            // будет рендер регистрации
        })

        const documentForm = this.#parent.querySelector('form');

        documentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textPass = this.#parent.querySelector('#errorPassword');
            const textLogin = this.#parent.querySelector('#errorLogin');

            textLogin.textContent = '';
            textPass.textContent = '';

            const loginInput = this.#parent.querySelector('#login');
            loginInput.classList.remove('error');

            const passwordInput = this.#parent.querySelector('#password');
            passwordInput.classList.remove('error');
            

            const email = loginInput.value.trim();
            const password = passwordInput.value;
            if (!validateEmail(email)) { 
                loginInput.classList.add('error');
                textLogin.textContent = "Неверный логин";
            } 
            if (!validatePassword(password)) {
                passwordInput.classList.add('error');
                textPass.textContent = "Неверный пароль";
            }
            if (!validatePassword(password) || !validateEmail(email)) {
                return;
            }

            const response = await API.post('/signin', {email, password});
            if (response.error) {
                loginInput.classList.add('error');
                passwordInput.classList.add('error');
                textLogin.textContent = 'Неверный логин или пароль';
                return
            }

            const mainPage = new MainPage(this.#parent);
            mainPage.render()
                  
        })
    }

}