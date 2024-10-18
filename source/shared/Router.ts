import { Page404 } from "@/pages/Page404";
import { View } from "../app/View";
import { EmptyResponse, Routes } from "@/shared/api/types";
import { API } from "./api/api";

export class Router{
    #routes : Routes; 
    #strictRoutes : string[];
    constructor () {
        this.#routes = {paths: []};
        this.#strictRoutes = ["/login", "/signup"]

        window.onpopstate = (event : Event) =>{ 
            console.log(history);
            this.go(event.state.url, false);
        }
     }

    setRoutes(routes : Routes) {
        this.#routes = routes;
    }
    
    async loginCheck() {
        const response = await API.get<EmptyResponse>('/auth');
        if (!response.error){
            return true;
        } 
        return false;
    }

    register(path : string, view : View) {
        
    }

    async go(url : string, addToHistory = true) {
        const index = this.#strictRoutes.findIndex((elem) => url === elem);
        const authResult = await this.loginCheck();
        if (index >= 0 && authResult ) {
            this.go('/');
            return;
        } 

        if (url === '/404') {
            history.pushState({url: '/404'}, '', url);
            const page = new Page404();
            page.render();
        } else {
            const currentURL = this.#routes.paths.find( 
                (elem) => elem.path.exec(url) !== null,
            );
            console.log(url);
    
            const state = {
                url: url,
            }
            history.pushState(state, '', url);
            console.log(currentURL);
            currentURL.view.render();
        }
    }


    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

}