import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { API } from "@/shared/api/api.ts";
import "./ui/index.scss";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router.ts";
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
            view: new LoginPage(router),
          },
          {
            path: /\/signup/,
            view: new SignupPage(router),
          },
          {
            path: /\//,
            view: new MainPage(router),
          },
        ],
      };

      router.setRoutes(routes);

      const currentURL = window.location.pathname;
      const response = await API.get<AuthResponse>("/auth");

      switch (currentURL) {
        case '/signup':
          if (!response.error){
            const responseLogout = await API.post<EmptyResponse, EmptyRequest>("/logout", {});
            if (!responseLogout.error) {
              router.go(currentURL);
            }
            return;
          }
          router.go(currentURL);
          return;
        case '/login':
          console.log(' ятут');
          if (!response.error){
            
            const responseLogout = await API.post<EmptyResponse, EmptyRequest>("/logout", {});
            
            if (!responseLogout.error) {
              router.go(currentURL);
            }
            return;
          }
          router.go(currentURL);
          return;
        case '/':
          if (!response.error){
            localStorage.setItem('user', response.user.name);
            router.go(currentURL);
            return;
          }
          router.go('/login');
          return;
      }

    })
  
    
  }
}
