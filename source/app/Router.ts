import { NULL } from "sass";
import { View } from "./View";
import { Routes } from "@/shared/api/types";

export class Router{
    routes : Routes[]; 
    root : string;
    currentURI : string;
    currentPage: any;
    interval: any;
    constructor (root : string, routes : Routes[] = []) {
        this.root = root;
        this.routes = routes;
        this.currentURI = '';
    }
    
    delSlashes(path : string) {
        return path.replace(/^\//, '').replace(/\/$/, '');
    }

    register(path : string, view : View) {
        path = this.root + this.delSlashes(path);
        const index = this.routes.findIndex((element) =>{
            return element.path === path; 
        });
        
        if (index >= 0) {
            this.routes[index] = {
                path,
                view,
            };
            return;
        }

        this.routes.push({path, view});
    }

    async start() {
        if (this.currentURI === window.location.pathname) {
            return null;
        }
        await this.go(window.location.pathname);
    }

    async go(path: string) {
        path = this.delSlashes(path);
        const url = decodeURI(this.root + path);
        const args = [];
        const reqRoute = this.routes.find((route : any) => {
            route = route.path;
            const routeURL = route.split('/');
            const originalURL = url.split('/');
            if (routeURL.length !== originalURL.length) {
                return false;
            }
            for (let i = 0; i < routeURL.length; ++i) {
                routeURL[i] = '/' + routeURL[i];
                originalURL[i] = '/' + originalURL[i];
                if (routeURL[i].match(/\{.*?}/)) {
                    if (originalURL[i][0] === '/') {
                        args.push(originalURL[i].slice(1, originalURL[i].length));
                    }
                    continue;
                }
                if (routeURL[i] !== originalURL[i]) {
                    return false;
                }
            }
            return true;
        });
        console.log(reqRoute);
        this.currentURI = encodeURI(url);
        if (reqRoute) {
            
        } else {
            
        }
        const ev = new Event('pageMovement');
        dispatchEvent(ev);
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

}