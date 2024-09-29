import { RenderLogin } from "../pages/LoginPage/LoginPage.js";
import { MainPage } from "../pages/MainPage/ui/MainPage.js";
import { API } from "../shared/api/api.js";

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
      const login = new RenderLogin(root);

      login.render();
    } else {
      const mainPage = new MainPage(this.#root);
      mainPage.render();
    }
  }
}
