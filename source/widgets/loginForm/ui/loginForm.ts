import { API } from "#shared/api/api.js";
import { validateLogin } from "#shared/validation/loginValidation.ts";
import { validatePassword } from "#shared/validation/passwordValidation.ts";
import { MainPage } from "#pages/MainPage";
import { SignupPage } from "#pages/SignupPage";

/**
 * Class provides Login form
 */
export class LoginForm {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }

  /**
   * Render login form
   * @param {}
   * @returns {}
   */
  render() {
    const template = require('./loginForm.hbs');
    this.#parent.innerHTML = template();

    const handleCreateClick = (e) => {
      e.preventDefault();
      const signUp = new SignupPage();
      signUp.render();
    };
    this.#parent.querySelector("#Create").addEventListener("click", handleCreateClick);

    const password = this.#parent.querySelector("#password");
    const handleTogglePasswordVisibility = () => {
      password.type = password.type === "password" ? "text" : "password";
    };
    this.#parent.querySelector("#password-visibility-toggle").addEventListener("click", handleTogglePasswordVisibility);
  
    const documentForm = this.#parent.querySelector("form");

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      const textPass = this.#parent.querySelector("#errorPassword");
      const textLogin = this.#parent.querySelector("#errorLogin");

      textLogin.textContent = "";
      textPass.textContent = "";

      const loginInput = this.#parent.querySelector("#login");
      loginInput.classList.remove("error");

      const passwordInput = this.#parent.querySelector("#password");
      passwordInput.classList.remove("error");

      const username = loginInput.value.trim();
      const password = passwordInput.value;
      if (!validateLogin(username)) {
        loginInput.classList.add("error");
        textLogin.textContent = "Неверный логин";
      }
      if (!validatePassword(password)) {
        passwordInput.classList.add("error");
        textPass.textContent = "Неверный пароль";
      }
      if (!validatePassword(password) || !validateLogin(username)) {
        return;
      }

      const response = await API.post("/login", { username, password });
      if (response.error) {
        loginInput.classList.add("error");
        passwordInput.classList.add("error");
        textLogin.textContent = "Неверный логин или пароль";
        return;
      }

      const responseAuth = await API.get("/auth", {});
      let nickname;
      if (responseAuth.error) {
        nickname = "user";
      } 
      else {
        nickname = responseAuth.user.name;
      }

      const mainPage = new MainPage(this.#parent);
      mainPage.render(nickname);
    }
    documentForm.addEventListener("submit", handleFormSubmit);
  }
}
