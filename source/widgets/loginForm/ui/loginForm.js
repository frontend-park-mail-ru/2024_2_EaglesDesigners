import { API } from "../../../shared/api/api.js";
import { validateLogin } from "../../../shared/validation/loginValidation.js";
import { validatePassword } from "../../../shared/validation/passwordValidation.js";
import { MainPage } from "../../../pages/MainPage/index.js";
import { SignupPage } from "../../../pages/SignupPage/index.js";

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
    const template = Handlebars.templates["loginForm.hbs"];
    this.#parent.innerHTML = template();
    this.#parent.querySelector("#Create").addEventListener("click", (e) => {
      e.preventDefault();
      const SignUp = new SignupPage();
      SignUp.render();
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

    const documentForm = this.#parent.querySelector("form");

    documentForm.addEventListener("submit", async (e) => {
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

      const mainPage = new MainPage(this.#parent);
      mainPage.render("user");
    });
  }
}
