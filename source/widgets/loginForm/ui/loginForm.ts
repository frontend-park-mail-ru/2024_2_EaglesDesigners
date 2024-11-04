import { API } from "@/shared/api/api.ts";
import { AuthResponse, LoginRequest } from "@/shared/api/types";
import { validateLogin } from "@/shared/validation/loginValidation.ts";
import { validatePassword } from "@/shared/validation/passwordValidation.ts";
import LoginFormTemplate from "./loginForm.hbs";
import { View } from "@/app/View";
import { Router } from "@/shared/Router/Router";
import { UserStorage } from "@/entities/User";
import { wsConn } from "@/shared/api/ws";
/**
 * Class provides Login form
 */
export class LoginForm extends View {
  #parent;
  constructor(parent: Element) {
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

    const handleCreateClick = (e: Event) => {
      e.preventDefault();
      Router.go("/signup");
    };
    this.#parent
      .querySelector("#Create")!
      .addEventListener("click", handleCreateClick);

    const password: HTMLInputElement = this.#parent.querySelector("#password")!;
    const handleTogglePasswordVisibility = () => {
      password.type = password.type === "password" ? "text" : "password";
    };
    this.#parent
      .querySelector("#password-visibility-toggle")!
      .addEventListener("click", handleTogglePasswordVisibility);

    const documentForm = this.#parent.querySelector("form")!;

    const handleFormSubmit = async (e: Event) => {
      e.preventDefault();

      const textPass = this.#parent.querySelector("#errorPassword")!;
      const textLogin = this.#parent.querySelector("#errorLogin")!;

      textLogin.textContent = "";
      textPass.textContent = "";

      const loginInput: HTMLInputElement =
        this.#parent.querySelector("#login")!;
      loginInput.classList.remove("error");

      const passwordInput: HTMLInputElement =
        this.#parent.querySelector("#password")!;
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

      const response = await API.post<AuthResponse, LoginRequest>("/login", {
        username,
        password,
      });
      if (response.error) {
        loginInput.classList.add("error");
        passwordInput.classList.add("error");
        textLogin.textContent = "Неверный логин или пароль";
        return;
      }

      const responseAuth = await API.get<AuthResponse>("/auth");

      if (!responseAuth.error) {
        UserStorage.setUser({
          id: responseAuth.user.id,
          name: responseAuth.user.name,
          username: responseAuth.user.username,
        });
        wsConn.start();
      } else {
        UserStorage.setUser({ id: "", name: "", username: "" });
      }
      Router.go("/");
    };
    documentForm.addEventListener("submit", handleFormSubmit);
  }
}
