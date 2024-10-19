import "./ui/index.scss";
import { RouterObj as Router } from "@/shared/Router/Router.ts";
import { user as User } from "./User";
import { routes } from "@/config";
import { strictRoutes } from "@/config";
import { defaultAuthRoutes } from "@/config";

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
      } else if (User.getUserName() === "") {
        Router.go("/login");
        return;
      }
      Router.go(currentURL);
    } else {
      Router.go("/404");
    }
  }
}
