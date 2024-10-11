import { LoginPage } from "../../../pages/LoginPage/index.js";
import { validateLogin } from "../../../shared/validation/loginValidation.js";
import { validateNickname } from "../../../shared/validation/nicknameValidation.js";
import { validateForm } from "../../../shared/validation/formValidation.js";
import { validatePassword } from "../../../shared/validation/passwordValidation.js";
import { API } from "../../../shared/api/api.js";
import { MainPage } from "../../../pages/MainPage/index.js";
import signUpFormTemplate from "./signUpForm.hbs";
import './signUpForm.css'

/**
 * Class provides signup form
 */
export class SignupForm {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Render signup form
   * @param {}
   * @returns {}
   */
  renderTemplate() {
    this.#parent.innerHTML = signUpFormTemplate();

    const aElement = document.querySelector("#login_href");

    aElement.addEventListener("click", (e) => {
      e.preventDefault();

      const login = new LoginPage(this.#parent);
      login.render();
    });

    const password = this.#parent.querySelector("#password");
    const togglePassword = this.#parent.querySelector(
      "#password-visibility-toggle",
    );
    togglePassword.addEventListener("click", function () {
      if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
    });

    const btnElement = document.querySelector("button");

    btnElement.addEventListener("click", async (e) => {
      e.preventDefault();

      const nick = this.#parent.querySelector("#nickname");
      const log = this.#parent.querySelector("#login");
      const pass = this.#parent.querySelector("#password");
      const pass2 = this.#parent.querySelector("#password2");

      nick.classList.remove("error");
      log.classList.remove("error");
      pass.classList.remove("error");
      pass2.classList.remove("error");

      const nickText = this.#parent.querySelector("#errorNickname");
      const loginText = this.#parent.querySelector("#errorLogin");
      const passText = this.#parent.querySelector("#errorPassword");
      const pass2Text = this.#parent.querySelector("#errorPassword2");

      nickText.textContent = "";
      loginText.textContent = "";
      passText.textContent = "";
      pass2Text.textContent = "";

      const nickname = nick.value;
      const login = log.value.trim();
      const password = pass.value;
      const password2 = pass2.value;
      let flagError = false;

      if (!validateNickname(nickname)) {
        validateForm(
          nick,
          "Допустимы только латинские и русские буквы, пробелы, цифры и нижние подчеркивания.",
          nickText,
        );
        flagError = true;
      }
      if (nickname.length > 20) {
        validateForm(
          nick,
          "Имя пользователя должно состоять максимум из 20 символов",
          nickText,
        );
        flagError = true;
      }
      if (!validateLogin(login)) {
        validateForm(
          log,
          "Логин должен состоять минимум из 6 латинских букв, цифр или нижних подчеркиваний.",
          loginText,
        );
        flagError = true;
      }
      if (login.length > 20) {
        validateForm(
          log,
          "Логин должен состоять максимум из 20 символов",
          loginText,
        );
        flagError = true;
      }
      if (!validatePassword(password)) {
        validateForm(
          pass,
          "Пароль должен состоять минимум из 8 латинских букв, цифр или нижних подчеркиваний.",
          passText,
        );
        flagError = true;
      }
      if (password.length > 20) {
        validateForm(
          pass,
          "Пароль должен состоять максимум из 20 символов",
          passText,
        );
        flagError = true;
      }
      else if (!validatePassword(password2) || password != password2) {
        validateForm(pass2, "Неверный пароль", pass2Text);
        flagError = true;
      }


      if (flagError) {
        return;
      }
      const username = login;
      const name = nickname;
      const response = await API.post("/signup", { name, username, password });

      if (response.error === "A user with that username already exists") {
        log.classList.add("error");
        loginText.textContent = "Такой пользователь уже существует";
        return;
      }
      if (response.error === "Could not fetch") {
        nick.classList.add("error");
        nickText.textContent = "Ошибка сети, попробуйте еще";
        return;
      }
      if (response.error) {
        nick.classList.add("error");
        nickText.textContent = "Ошибка сервера, попробуйте еще";
        return;
      }

      const mainPage = new MainPage(this.#parent);
      mainPage.render(nickname);
    });
  }
}
