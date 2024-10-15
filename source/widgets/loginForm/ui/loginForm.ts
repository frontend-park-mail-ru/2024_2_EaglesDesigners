import { API } from "@/shared/api/api.ts";
import { validateLogin } from "@/shared/validation/loginValidation.ts";
import { validatePassword } from "@/shared/validation/passwordValidation.ts";
import { MainPage } from "@/pages/MainPage";
import { SignupPage } from "@/pages/SignupPage";
import LoginFormTemplate from "./loginForm.hbs";
import { View } from "@/app/View";

/**
 * Class provides Login form
 */
export class LoginForm extends View {
  #parent;
  constructor(parent:Element) {
    super();
    this.#parent = parent;
  }

  /**
   * Render login form
   * @param {}
   * @returns {}
   */
  render() {
    this.#parent.innerHTML = LoginFormTemplate();

    const handleCreateClick = (e:Event) => {
      e.preventDefault();
      const signUp = new SignupPage();
      signUp.render();
    };
    this.#parent.querySelector("#Create")!.addEventListener("click", handleCreateClick);

    const password:HTMLInputElement = this.#parent.querySelector("#password")!;
    const handleTogglePasswordVisibility = () => {
      password.type = password.type === "password" ? "text" : "password";
    };
    this.#parent.querySelector("#password-visibility-toggle")!.addEventListener("click", handleTogglePasswordVisibility);
  
    const documentForm = this.#parent.querySelector("form")!;

    const handleFormSubmit = async (e:Event) => {
      e.preventDefault();
      const textPass = this.#parent.querySelector("#errorPassword")!;
      const textLogin = this.#parent.querySelector("#errorLogin")!;

      textLogin.textContent = "";
      textPass.textContent = "";

      const loginInput:HTMLInputElement = this.#parent.querySelector("#login")!;
      loginInput.classList.remove("error");

      const passwordInput:HTMLInputElement = this.#parent.querySelector("#password")!;
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

      const responseAuth = await API.get("/auth");
      const nickname = responseAuth?.user?.name || "user";

      const mainPage = new MainPage(this.#parent, nickname);
      mainPage.render();
    };
    documentForm.addEventListener("submit", handleFormSubmit);
  }
}
