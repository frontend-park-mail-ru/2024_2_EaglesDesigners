import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { API } from "@/shared/api/api.ts";
import { AuthResponse } from "@/shared/api/types";
import "./index.scss";
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
    const response = await API.get<AuthResponse>("/auth");

    if (response.error) {
      const login = new LoginPage(this.#root);

      login.render();
    } else {
      const mainPage = new MainPage(this.#root);
      mainPage.render(response.user.name);
    }
  }
}
