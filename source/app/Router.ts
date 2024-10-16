import { View } from "./View";
import { Routes } from "@/shared/api/types";

export class Router{
    #routes : Routes; 
    currentURI : string;
    currentPage: any;
    interval: any;
    constructor () {
        this.#routes = {paths: []};
        this.currentURI = '';


        window.onpopstate = (event : Event) =>{ 
            console.log(event);
            this.go(event.state.url, false);
        }
     }

    setRoutes(routes : Routes) {
        this.#routes = routes;
    }
    
    delSlashes(path : string) {
        return path.replace(/^\//, '').replace(/\/$/, '');
    }

    register(path : string, view : View) {
        
    }

    go(url : string, addToHistory = true) {
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


    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

}