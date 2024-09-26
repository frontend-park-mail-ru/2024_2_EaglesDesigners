import { RenderLogin } from "../pages/LoginPage/LoginPage.js";

export class App{

    constructor() {

    }

    start() {
        const root = document.getElementById('root');
        const login = new RenderLogin(root);
    
        login.render();
    }
    
}