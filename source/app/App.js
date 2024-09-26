import { RenderLogin } from "../pages/LoginPage/LoginPage.js";
import { MainPage } from "../pages/MainPage/ui/MainPage.js";

export class App{
    #root = document.getElementById("root");

    start() {
        const login = new RenderLogin(this.#root);
        login.render();
    }

    loadMainPage(){
        const mainPage = new MainPage(this.#root);
        mainPage.render()
    }
}