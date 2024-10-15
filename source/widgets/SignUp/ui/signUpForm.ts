import { LoginPage } from "@/pages/LoginPage";
import { validateLogin } from "@/shared/validation/loginValidation.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation.ts";
import { validateForm } from "@/shared/validation/formValidation.ts";
import { validatePassword } from "@/shared/validation/passwordValidation.ts";
import { API } from "@/shared/api/api.ts";
import { EmptyResponse, SignUpRequest } from "@/shared/api/types";
import { MainPage } from "@/pages/MainPage";
import SignUpFormTemplate from "./signUpForm.hbs";
import "./signUpForm.scss";

/**
 * Class provides signup form
 */
export class SignupForm {
  #parent;
  constructor(parent:Element) {
    this.#parent = parent;
  }

  /**
   * Render signup form
   * @param {}
   * @returns {}
   */
  render() {
    this.#parent.innerHTML = SignUpFormTemplate();

    const aElement = document.querySelector("#login_href")!;

    const handleLoginClick = (e:Event) => {
      e.preventDefault();

      const login = new LoginPage(this.#parent);
      login.render();
    };

    aElement.addEventListener("click", handleLoginClick);

    const password:HTMLInputElement = this.#parent.querySelector("#password")!;
    const handleTogglePasswordVisibility = () => {
      password.type = password.type === "password" ? "text" : "password";
    };
    this.#parent.querySelector("#password-visibility-toggle")!.addEventListener("click", handleTogglePasswordVisibility);

    const btnElement = document.querySelector("button")!;

    const handleButtonClick = async (e:Event) => {
      e.preventDefault();

      const nick: HTMLInputElement = this.#parent.querySelector("#nickname")!;
      const log: HTMLInputElement = this.#parent.querySelector("#login")!;
      const pass: HTMLInputElement = this.#parent.querySelector("#password")!;
      const pass2: HTMLInputElement = this.#parent.querySelector("#password2")!;

      nick.classList.remove("error");
      log.classList.remove("error");
      pass.classList.remove("error");
      pass2.classList.remove("error");

      const nickText: HTMLSpanElement = this.#parent.querySelector("#errorNickname")!;
      const loginText: HTMLSpanElement = this.#parent.querySelector("#errorLogin")!;
      const passText: HTMLSpanElement = this.#parent.querySelector("#errorPassword")!;
      const pass2Text: HTMLSpanElement = this.#parent.querySelector("#errorPassword2")!;

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
      } else if (!validatePassword(password2) || password != password2) {
        validateForm(pass2, "Неверный пароль", pass2Text);
        flagError = true;
      }

      if (flagError) {
        return;
      }
      const username = login;
      const name = nickname;
      const response = await API.post<EmptyResponse,SignUpRequest>("/signup", { name, username, password });

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
    };

    btnElement.addEventListener("click", handleButtonClick);
  }
}
