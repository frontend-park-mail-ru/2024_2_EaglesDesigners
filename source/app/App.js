import { MainPage } from "../pages/MainPage/ui/MainPage.js";

export class App{
    #root = document.getElementById("root");

    loadMainPage(){
        const mainPage = new MainPage(this.#root);
        mainPage.render()
    }
}
