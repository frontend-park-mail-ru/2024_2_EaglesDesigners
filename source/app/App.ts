import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { API } from "@/shared/api/api.ts";
import "./ui/index.scss";
import { AuthResponse } from "@/shared/api/types";
import { Router } from "@/app/Router.ts";
import { SignupPage } from "@/pages/SignupPage";

/**
 * Class provides class App, the initial class
 */
export class App {
  #root = document.getElementById("root")!;
  /**
   * start our application
   * @param {}
   * @returns {bool}
   */
  async start() {
    const router = new Router('/');
    router.register('/', MainPage);
    router.register('/login', LoginPage);
    router.register('/signup', SignupPage);

    const response = await API.get<AuthResponse>("/auth");

    if (response.error) {
      const login = new LoginPage(this.#root);

      login.render();
      router.start()
    } else {
      localStorage.setItem('user', response.user.name);
      const mainPage = new MainPage(this.#root);
      mainPage.render();
    }

  }
}
