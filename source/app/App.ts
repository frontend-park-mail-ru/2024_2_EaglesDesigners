import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { API } from "@/shared/api/api.ts";
import "./ui/index.scss";
import { AuthResponse} from "@/shared/api/types";
import { RouterObj as Router } from "@/shared/Router/Router.ts";
import { SignupPage } from "@/pages/SignupPage";

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
    document.addEventListener("DOMContentLoaded", async () => {
      const currentURL = window.location.pathname;

      const response = await API.get<AuthResponse>('/auth');
      const index = routes.paths.find((element) => element.path.exec(currentURL) !== null);
      if (index !== undefined) {
        if (currentURL == '/signup') {
          Router.go(currentURL);
          return;
        } else if (response.error){
          Router.go('/login');
          return;
        } 
        Router.go(currentURL);
      } else {
        Router.go('/404');
      }
      
     

    })
  }
}
