import { RenderLogin } from "../pages/LoginPage/LoginPage.js";
import { API } from "../shared/api/api.js";

export class App{

    constructor() {

    }

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
    
}
