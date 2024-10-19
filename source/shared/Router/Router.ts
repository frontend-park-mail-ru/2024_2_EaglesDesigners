import { Page404 } from "@/pages/Page404";
import { Routes } from "./RouterTypes";
import { User } from "@/entities/User/lib/UserStroage";

class Router {
  #routes: Routes;
  #strictRoutes: string[];
  #defaultAuthRoutes: string[];
  constructor() {
    this.#routes = {};
    this.#strictRoutes = [];
    this.#defaultAuthRoutes = [];

    window.onpopstate = async (event) => {
      const index = this.#strictRoutes.findIndex(
        (element) => element === event.state.url,
      );
      if (User.getUserName() === "" && index === -1) {
        this.go("/login", false);
        return;
      }
      this.go(event.state.url, false);
    };
  }

  setRoutes(
    routes: Routes,
    strictRoutes: string[],
    defaultAuthRoutes: string[],
  ) {
    this.#routes = routes;
    this.#strictRoutes = strictRoutes;
    this.#defaultAuthRoutes = defaultAuthRoutes;
  }

  async go(url: string, addToHistory = true) {
    const index = this.#strictRoutes.findIndex((elem) => url === elem);
    if (index !== -1 && User.getUserName() !== "") {
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
        currentURL.view.render();
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

export const RouterObj = new Router();
