import { Page404 } from "@/pages/Page404";
import { View } from "../app/View";
import { EmptyResponse, Routes } from "@/shared/api/types";
import { API } from "./api/api";

export class Router{
    #routes : Routes; 
    #strictRoutes : string[];
    constructor () {
        this.#routes = {}
        this.#strictRoutes = ["/login", "/signup"]

        window.onpopstate = (async (event) => {
            const isAuth = await this.isAuth();
            if (!isAuth && event.state.url !== '/signup'){
                this.go('/login', false);
                return;
            }
            this.go(event.state.url, false);
        });
     }

    setRoutes(routes : Routes) {
        this.#routes = routes;
    }
    
    async isAuth() {
        const response = await API.get<EmptyResponse>('/auth');
        if (!response.error){
            return true;
        } 
        return false;
    }


    async go(url : string, addToHistory = true) {

        const index = this.#strictRoutes.findIndex((elem) => url === elem);
        const authResult = await this.isAuth();
        if (index >= 0 && authResult ) {
            this.go('/');
            return;
        } 
        
        if (url === '/404') {
            if (!addToHistory) {
                history.replaceState({url: '/404'}, '', url);
            } else {
                history.pushState({url: '/404'}, '', url);
            }
            
            const page = new Page404();
            page.render();
        } else {
            let currentURL;
            if (this.#routes.paths!) {
                
                currentURL = this.#routes.paths.find( 
                    (elem) => {
                        if (elem.path!) {
                            return elem.path.exec(url) !== null
                        }
                        
                    }
                );
            }
            
    
            const state = {
                url: url,
            }
            if (!addToHistory) {
                history.replaceState(state, '', url);
            } else {
                history.pushState(state, '', url);
            }
            console.log(currentURL);
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