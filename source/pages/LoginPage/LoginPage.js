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
        const email = document.getElementsByClassName('login')[0].value.trim();
        const password = document.getElementsByClassName('password')[0].value;

        if (!validateEmail(email) || !validatePassword(password)) {
            const text = document.getElementById('errorMessage');
            const loginInput = document.getElementsByClassName('login')[0];
            loginInput.classList.add('error');
            const passwordInput = document.getElementsByClassName('password')[0];
            passwordInput.classList.add('error');
            text.textContent = "Неверный пароль или логин";
        } else {

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








