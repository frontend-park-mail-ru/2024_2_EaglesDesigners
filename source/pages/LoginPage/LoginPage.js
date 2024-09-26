import {LoginForm} from '../../widgets/loginForm/loginForm.js';
import {ajax} from '../../widgets/loginForm/api/ajax.js';
import { validateEmail } from '../../shared/validation/EmailValidation.js';
import { validatePassword } from '../../shared/validation/PasswordValidation.js';
import { RenderSignup } from '../SignupPage/SignupPage.js';
import { validateForm } from '../../shared/validation/validateForm.js';


export class RenderLogin {
    #parent
    constructor(parent) {
        this.#parent = parent;
    }

    render() {
        const form = new LoginForm();
        
        const loginForm = form.renderTemplate();
        this.#parent.innerHTML = loginForm;

        const documentForm = document.querySelector('form');
        const btn = document.getElementById('Create');

        documentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = document.getElementById('errorMessage');
            const textPass = document.getElementById('errorPassword');

            text.textContent = '';
            textPass.textContent = '';

            const loginInput = document.getElementsByClassName('login')[0];
            loginInput.classList.remove('error');

            const passwordInput = document.getElementsByClassName('password')[0];
            passwordInput.classList.remove('error');
            

            const email = document.getElementsByClassName('login')[0].value.trim();
            const password = document.getElementsByClassName('password')[0].value;

            if (!validateEmail(email)) {
                validateForm(loginInput, 'Неверный логин', text);
            } 
            if (!validatePassword(password)) {
                validateForm(passwordInput, 'Пароль должен состоять минимум из 8 символов', textPass);
            }

            if  (validateEmail(email) && validatePassword(password)){

                ajax('POST', '/signin', {email, password}, (status, body) => {
                    if (status == 200) {
                        this.#parent.removeChild(document.getElementById('left'));
                        this.#parent.removeChild(document.getElementById('right'));
                        ajax('GET', '/auth', null, (status) => {
                            if (status == 200) {
                                alert('я тут');
                            }
                        })
                        return
                    } else {
                        const message = JSON.parse(body);
                        const text = document.getElementById('errorMessage');
                        const loginInput = document.getElementsByClassName('login')[0];
                        loginInput.classList.add('error');
                        const passwordInput = document.getElementsByClassName('password')[0];
                        passwordInput.classList.add('error');
                        text.textContent = message.error;
                        
                    }
                    
                });
            }
        })

        btn.addEventListener('click', () => {
            ajax('GET', '/signup', null, (status) => {
                if (status == 200) {
                    this.#parent.innerHTML = '';
                    const signup = new RenderSignup(this.#parent);
                    signup.render();
                }
                else {
                    alert('bad');
                }
            });
        })
    }
    
}








