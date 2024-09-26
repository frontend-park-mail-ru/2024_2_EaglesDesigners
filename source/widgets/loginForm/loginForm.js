import {sendLoginRequest} from '../../pages/LoginPage/api/ajax.js';
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
            this.#parent.removeChild(this.#parent.querySelector('#left'));
            this.#parent.removeChild(this.#parent.querySelector('#right'));
            // будет рендер
        })

        const documentForm = this.#parent.querySelector('form');

        const btn = this.#parent.querySelector('#Create');

        documentForm.addEventListener('submit', (e) => {
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
                return;
            } 
            if (!validatePassword(password)) {
                passwordInput.classList.add('error');
                textPass.textContent = "Неверный пароль";
                return;
            }

            sendLoginRequest('POST', '/signin', {email, password}, (status, body) => {
                if (status == 200) {
                    this.#parent.removeChild(this.#parent.querySelector('#left'));
                    this.#parent.removeChild(this.#parent.querySelector('#right'));
                    sendLoginRequest('GET', '/auth', null, (status) => {
                        if (status == 200) {
                            alert('я тут');
                        }
                    })
                    return
                } else {
                    const message = JSON.parse(body);
                    loginInput.classList.add('error');
                    passwordInput.classList.add('error');
                    textLogin.textContent = message.error;
                }
                
            });
        })
    }

}