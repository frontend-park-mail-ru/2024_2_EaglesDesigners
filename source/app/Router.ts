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
        
    }


    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

}