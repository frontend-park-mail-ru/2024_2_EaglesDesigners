import "./ui/index.scss";
import { Router } from "@/shared/Router/Router.ts";
import { UserStorage } from "@/entities/User";
import { routes, strictRoutes } from "@/shared/Router/Routes.ts";
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
    await UserStorage.init();

    Router.setRoutes(routes, strictRoutes);

    const currentURL = window.location.pathname;

    const index = routes.paths?.find(
      (element) => element.path?.exec(currentURL) !== null,
    );
    if (index !== undefined) {
      if (currentURL == "/signup") {
        Router.go(currentURL);
        return;
      } else if (UserStorage.getUser().name === "") {
        Router.go("/login");
        return;
      }
      Router.go(currentURL);
    } else {
      Router.go("/404");
    }
  }
}
