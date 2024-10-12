import { LoginPage } from "#pages/LoginPage";
import { MainPage } from "#pages/MainPage";
import { API } from "#shared/api/api.ts";
import '#public/index.scss'
/**
 * Class provides class App, the initial class
 */
export class App {
  #root = document.getElementById("root");
  /**
   * start our application
   * @param {}
   * @returns {bool}
   */
  async start() {
    const root = document.getElementById("root");
    const response = await API.get("/auth");

    if (response.error) {
      const login = new LoginPage(root);

      login.render();
    } else {
      const mainPage = new MainPage(this.#root);
      mainPage.render(response.user.name);
    }
  }
}
