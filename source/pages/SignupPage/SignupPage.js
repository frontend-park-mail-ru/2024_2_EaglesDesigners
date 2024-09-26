import { SignupForm } from "../../widgets/SignUp/signUpForm.js";
import { RenderLogin } from "../LoginPage/LoginPage.js";
import { validateEmail } from "../../shared/validation/EmailValidation.js";
import { validatePassword } from "../../shared/validation/PasswordValidation.js";
import { validateNickname } from "../../shared/validation/nicknameValidation.js";
import { validateForm } from "../../shared/validation/validateForm.js";
import { ajax } from "../LoginPage/api/ajax.js";

export class RenderSignup {
    #parent
    constructor(parent) {
        this.#parent = parent;
    }

    render() {
        const signup = new SignupForm();
        const signupForm = signup.renderTemplate();
        console.log(this.#parent);
        console.log(signupForm);
        this.#parent.innerHTML = signupForm;

        const aElement = document.querySelector('a');

        aElement.addEventListener('click', (e) =>{
            e.preventDefault();
            this.#parent.innerHTML = '';

            const login = new RenderLogin(this.#parent);
            login.render();
        })

        const btnElement = document.querySelector('button');

        btnElement.addEventListener('click', (e) =>  {
            e.preventDefault();

            const nickname = document.getElementsByClassName('nickname')[0];
            const email = document.getElementsByClassName('login')[0];
            const password = document.getElementsByClassName('password')[0];
            const password2 = document.getElementsByClassName('password2')[0];
            
            nickname.classList.remove('error');
            email.classList.remove('error');
            password.classList.remove('error');
            password2.classList.remove('error');

            const nickText = document.getElementById('errorNickname');
            const emailText = document.getElementById('errorLogin');
            const passText = document.getElementById('errorPassword');
            const pass2Text = document.getElementById('errorPassword2');

            nickText.textContent = '';
            emailText.textContent = '';
            pass2Text.textContent = '';
            passText.textContent = '';

            if (!validateNickname(nickname.value)) {
                validateForm(nickname, 'Неверный никнейм', nickText);
            }
            if (!validateEmail(email.value.trim())) {
                validateForm(email, 'Неверный логин', emailText);
            }
            if (!validatePassword(password.value)) {
                validateForm(password, 'Пароль должен состоять минимум из 8 символов', passText);
            }
            if (!validatePassword(password2.value)) {
                validateForm(password2, 'Неверный пароль', pass2Text);
            }

            if (validateNickname(nickname.value) || validateEmail(email.value.trim()) || validatePassword(password.value) || validatePassword(password2.value)) {
                const nick = nickname.value;
                const login = email.value.trim();
                const pass = password.value;
                const pass2 = password2.value;
                ajax('POST', '/signup', {nick, login, pass, pass2}, (status, body) => {

                })
            }
        })


    }
}

