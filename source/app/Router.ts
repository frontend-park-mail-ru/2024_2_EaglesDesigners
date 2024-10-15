import { View } from "./View";
import { Routes } from "@/shared/api/types";

export class Router{
    routes : Routes[]; 
    root : string;
    constructor (root : string, routes : Routes[] = []) {
        this.root = root;
        this.routes = routes;
    }
    
    delSlashes(path : string) {
        return path.replace(/^\//, '').replace(/\/$/, '');
    }

    register(path : string, view : View) {
        path = this.root + this.delSlashes(path);
        const index = this.routes.findIndex((element) =>{
            return element.path === path; 
        });
    
    }

    start() {

    }

    go(path: string) {

    }

    back() {

    }

    forward() {

    }

}