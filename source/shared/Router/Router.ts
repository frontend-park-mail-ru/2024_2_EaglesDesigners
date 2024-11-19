import { Page404 } from "@/pages/Page404";
import { Routes } from "./RouterTypes";
import { UserStorage } from "@/entities/User";

class Route {
  #routes: Routes;
  #strictRoutes: string[];
  constructor() {
    this.#routes = { paths: [] };
    this.#strictRoutes = [];

    window.onpopstate = async (event) => {
      if (!event.state) {
        return;
      }
      const index = this.#strictRoutes.findIndex(
        (element) => element === event.state.url,
      );
      if (UserStorage.getUser().name === "" && index === -1) {
        this.go("/login", false);
        return;
      }
      this.go(event.state.url, false);
      
    };
  }

  setRoutes(routes: Routes, strictRoutes: string[]) {
    this.#routes = routes;
    this.#strictRoutes = strictRoutes;
  }

  async go(url: string, addToHistory = true) {
    const index = this.#strictRoutes.findIndex((elem) => url === elem);
    if (index !== -1 && UserStorage.getUser().name !== "") {
      this.go("/");

      return;
    }

    if (url === "/404") {
      if (!addToHistory) {
        history.replaceState({ url: "/404" }, "", url);
      } else {
        history.pushState({ url: "/404" }, "", url);
      }

      const page = new Page404();
      page.render();
    } else {
      let currentURL;
      if (this.#routes.paths!) {
        currentURL = this.#routes.paths.find((elem) => {
          if (elem.path!) {
            return elem.path.exec(url) !== null;
          }
        });
      }

      const state = {
        url: url,
      };
      if (!addToHistory) {
        history.replaceState(state, "", url);
      } else {
        history.pushState(state, "", url);
      }

      if (currentURL?.view) {
        const urlMatch = url.match(currentURL.path!);
        urlMatch?.shift();
        if (urlMatch?.length) {
          currentURL.view.render(urlMatch[0]);
        } else {
          currentURL.view.render();
        }
      }
    }
  }

  back() {
    history.back();
  }

  forward() {
    history.forward();
  }
}

export const Router = new Route();
