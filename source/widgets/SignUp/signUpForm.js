import { RenderLogin } from "../../pages/LoginPage/LoginPage.js";
import { validateLogin } from "../../shared/validation/loginValidation.js";
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

            const nick = this.#parent.querySelector('#nickname');
            const log = this.#parent.querySelector('#login');
            const pass = this.#parent.querySelector('#password');
            const pass2 = this.#parent.querySelector('#password2');
            
            nick.classList.remove('error');
            log.classList.remove('error');
            pass.classList.remove('error');
            pass2.classList.remove('error');

            const nickText = this.#parent.querySelector('#errorNickname');
            const loginText = this.#parent.querySelector('#errorLogin');
            const passText = this.#parent.querySelector('#errorPassword');
            const pass2Text = this.#parent.querySelector('#errorPassword2');

            nickText.textContent = '';
            loginText.textContent = '';
            passText.textContent = '';
            pass2Text.textContent = '';

            const nickname = nick.value;
            const login = log.value.trim();
            const password = pass.value;
            const password2 = pass2.value;
            let flagError = false 

            if (!validateNickname(nickname)) {
                validateForm(nick, 'Допустимы только латинские и русские буквы, пробелы, цифры и нижние подчеркивания.', nickText);
                flagError = true;
            }
            if (!validateLogin(login)) {
                validateForm(log, 'Допустимы только латинские буквы, цифры и нижние подчеркивания.', loginText);
                flagError = true;
            }
            if (!validatePassword(password)) {
                validateForm(pass, 'Пароль должен состоять минимум из 8 латинских букв, цифр или нижних подчеркиваний.', passText);
                flagError = true;
            }
            if (!validatePassword(password2) || password != password2) {
                validateForm(pass2, 'Неверный пароль', pass2Text);
                flagError = true;
            }
            
            if (flagError) {
                return
            }
            const username = login
            const name = nickname
            const response = await API.post('/signup', {name, username, password});
            //console.log(response)
            if (response.error === 'A user with that username already exists') {
                nick.classList.add('error');
                nickText.textContent = 'Такой пользователь уже существует';
                return
            }
            if (response.error === 'Could not fetch') {
                nick.classList.add('error');
                nickText.textContent = 'Ошибка сети, попробуйте еще';
                return
            }
            if (response.error) {
                nick.classList.add('error');
                nickText.textContent = 'Ошибка сервера, попробуйте еще';
                return
            }
            
            const mainPage = new MainPage(this.#parent);
            mainPage.render()
        });
    }
}
