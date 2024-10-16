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
    document.addEventListener("DOMContentLoaded", async () => {
      const router = new Router();

      const routes = {
        paths: [
          {
            path: /\/login/,
            view: new LoginPage(),
          },
          {
            path: /\/signup/,
            view: new SignupPage(),
          },
          {
            path: /\//,
            view: new MainPage(),
          },
        ],
      };




      router.register('/', MainPage);
      router.register('/login', LoginPage);
      router.register('/signup', SignupPage);

      const response = await API.get<AuthResponse>("/auth");

      if (response.error) {
        const login = new LoginPage();
        login.render();
        
      } else {
        localStorage.setItem('user', response.user.name);
        const mainPage = new MainPage();
        mainPage.render();
      }

    })
  
    
  }
}
