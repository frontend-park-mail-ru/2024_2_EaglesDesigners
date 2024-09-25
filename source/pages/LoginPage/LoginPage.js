import {Form} from './Form/form.js';
import {ajax} from './api/ajax.js';
import { validateEmail } from '../../shared/validation/EmailValidation.js';
import { validatePassword } from '../../shared/validation/PasswordValidation.js';


export function renderLogin() {
    const formElement = document.createElement('form');
    const form = new Form(formElement);
    const element = document.getElementById('root');

    const elementLeft = document.createElement('div');
    elementLeft.className = 'left';
    const elementRight = document.createElement('div');
    elementRight.className = 'right';
    
    form.renderTemplate();

    const loginForm = form.parent;
    element.appendChild(elementLeft);
    element.appendChild(elementRight);
    elementRight.innerHTML = loginForm;

    const documentForm = document.querySelector('form');
    const btn = document.getElementById('Create');

    documentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('errorPassword');
        const textPass = document.getElementById('errorMessage');

        text.textContent = '';
        textPass.textContent = '';

        const loginInput = document.getElementsByClassName('login')[0];
        loginInput.classList.remove('error');

        const passwordInput = document.getElementsByClassName('password')[0];
        passwordInput.classList.remove('error');
        

        const email = document.getElementsByClassName('login')[0].value.trim();
        const password = document.getElementsByClassName('password')[0].value;

        if (!validateEmail(email)) {
            const loginInput = document.getElementsByClassName('login')[0];
            loginInput.classList.add('error');
            text.textContent = "Неверный логин";
        } 
        if (!validatePassword(password)) {
            const passwordInput = document.getElementsByClassName('password')[0];
            passwordInput.classList.add('error');
            textPass.textContent = "Неверный пароль";
        }


        if  (validateEmail(email) && validatePassword(password)){

            ajax('POST', '/signin', {email, password}, (status, body) => {
                if (status == 200) {
                    element.removeChild(elementRight);
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
                alert('Its okey');
            }
            else {
                alert('bad');
            }
        });
    })
}








