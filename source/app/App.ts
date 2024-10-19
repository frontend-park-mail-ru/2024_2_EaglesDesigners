import "./ui/index.scss";
import { Router } from "@/shared/Router/Router.ts";
import { UserStorage } from "@/entities/User";
import { routes, strictRoutes, defaultAuthRoutes } from "./config.ts";

/**
 * Class provides class App, the initial class
 */
export class App {
  /**
   * start our application
   * @param {}
   * @returns {bool}
   */
  async start() {
    Router.setRoutes(routes, strictRoutes, defaultAuthRoutes);

    const currentURL = window.location.pathname;

    const index = routes.paths.find(
      (element) => element.path.exec(currentURL) !== null,
    );
    if (index !== undefined) {
      if (currentURL == "/signup") {
        Router.go(currentURL);
        return;
      } else if (UserStorage.getUserName() === "") {
        Router.go("/login");
        return;
      }
      Router.go(currentURL);
    } else {
      Router.go("/404");
    }
  }
}
