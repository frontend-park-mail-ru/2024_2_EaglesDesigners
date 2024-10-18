import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { API } from "@/shared/api/api.ts";
import "./ui/index.scss";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router.ts";
import { SignupPage } from "@/pages/SignupPage";
import { Page404 } from "@/pages/Page404";

/**
 * Class provides class App, the initial class
 */
export class App {
  #root = document.getElementById("root")!;
  #currentUser = ''
  /**
   * start our application
   * @param {}
   * @returns {bool}
   */
  async start() {
    const router = new Router();

    const routes = {
      paths: [
        {
          path: /^\/login$/,
          view: new LoginPage(router),
        },
        {
          path: /^\/signup$/,
          view: new SignupPage(router),
        },
        {
          path: /^\/$/,
          view: new MainPage(router),
        },
      ],
    };

    router.setRoutes(routes);
    document.addEventListener("DOMContentLoaded", async () => {
      const currentURL = window.location.pathname;

      const response = await API.get<AuthResponse>('/auth');
      const index = routes.paths.find((element) => element.path.exec(currentURL) !== null);
      if (index !== undefined) {
        if (currentURL == '/signup') {
          router.go(currentURL);
          return;
        } else if (response.error){
          router.go('/login');
          return;
        } 
        router.go(currentURL);
      } else {
        router.go('/404');
      }
      
     

    })
  }
}
