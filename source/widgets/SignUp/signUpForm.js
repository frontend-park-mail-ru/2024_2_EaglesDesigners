import { RenderLogin } from "../../pages/LoginPage/LoginPage.js";
import { validateEmail } from "../../shared/validation/emailValidation.js";
import { validateNickname } from "../../shared/validation/nicknameValidation.js";
import { validateForm } from "../../shared/validation/formValidation.js";
import { validatePassword } from "../../shared/validation/passwordValidation.js";
import { API } from "../../shared/api/api.js";
import { MainPage } from "../../pages/MainPage/ui/MainPage.js";

export class SignupForm {

    #parent
    constructor(parent) {
        this.#parent = parent
    }

    renderTemplate() {
        const template = Handlebars.templates['signUpForm.hbs'];
        this.#parent.innerHTML = template();  

        const aElement = document.querySelector('a');

        aElement.addEventListener('click', (e) =>{
            e.preventDefault();

            const login = new RenderLogin(this.#parent);
            login.render();
        })

        const btnElement = document.querySelector('button');

        btnElement.addEventListener('click', async (e) =>  {
            e.preventDefault();

            const nickname = this.#parent.querySelector('#nickname');
            const login = this.#parent.querySelector('#login');
            const password = this.#parent.querySelector('#password');
            const password2 = this.#parent.querySelector('#password2');
            
            nickname.classList.remove('error');
            login.classList.remove('error');
            password.classList.remove('error');
            password2.classList.remove('error');

            const nickText = this.#parent.querySelector('#errorNickname');
            const loginText = this.#parent.querySelector('#errorLogin');
            const passText = this.#parent.querySelector('#errorPassword');
            const pass2Text = this.#parent.querySelector('#errorPassword2');

            nickText.textContent = '';
            loginText.textContent = '';
            passText.textContent = '';
            pass2Text.textContent = '';

            const nickValue = nickname.value;
            const loginValue = nickname.value.trim();
            const passValue = nickname.value;
            const pass2Value = nickname.value;

            if (!validateNickname(nickValue)) {
                validateForm(nickValue, 'Неверный никнейм', nickText);
            }
            if (!validateEmail(loginValue)) {
                validateForm(loginValue, 'Неверный логин', loginText);
            }
            if (!validatePassword(passValue)) {
                validateForm(passValue, 'Пароль должен состоять минимум из 8 символов', passText);
            }
            if (!validatePassword(pass2Value)) {
                validateForm(pass2Value, 'Неверный пароль', pass2Text);
            }

            const response = await API.post('/signup', {nickValue, loginValue, passValue});
            if (response.error) {
                login.classList.add('error');
                nickname.classList.add('error');
                password.classList.add('error');
                password2.classList.add('error');
                nickText.textContent = 'Такой пользователь уже существует';
                return
            }

            const mainPage = new MainPage(this.#parent);
            mainPage.render()
        });
    }
}
