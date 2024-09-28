import { RenderLogin } from "../pages/LoginPage/LoginPage.js";
import { MainPage } from "../pages/MainPage/ui/MainPage.js";
import { API } from "../shared/api/api.js";

export class App{
    #root = document.getElementById("root");


    async start() {
        
        const root = document.getElementById('root');
        const response = await API.get('/auth');
        console.log(response)

        if (response.error) {
            const login = new RenderLogin(root);
    
            login.render();
        } else {
            // рендер чатов
        }

    }

    loadMainPage(){
        const mainPage = new MainPage(this.#root);
        mainPage.render()
    }
}