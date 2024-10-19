import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import "./ui/index.scss";
import { RouterObj as Router } from "@/shared/Router/Router.ts";
import { SignupPage } from "@/pages/SignupPage";
import { user as User } from "./User";

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

    const routes = {
      paths: [
        {
          path: /^\/login$/,
          view: new LoginPage(),
        },
        {
          path: /^\/signup$/,
          view: new SignupPage(),
        },
        {
          path: /^\/$/,
          view: new MainPage(),
        },
      ],
    };

    const strictRoutes = ["/login", "/signup"];
    const defaultAuthRoutes : string[] = [];

    Router.setRoutes(routes, strictRoutes, defaultAuthRoutes);

    const currentURL = window.location.pathname;

    const index = routes.paths.find((element) => element.path.exec(currentURL) !== null);
    if (index !== undefined) {
      if (currentURL == '/signup') {
        Router.go(currentURL);
        return;
      } else if (User.getUserName() === ''){
        Router.go('/login');
        return;
      } 
      Router.go(currentURL);
    } else {
      Router.go('/404');
    }
    
  }
}
