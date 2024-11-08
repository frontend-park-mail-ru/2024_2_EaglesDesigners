import { App } from "./app";
import runtime from "serviceworker-webpack5-plugin/lib/runtime";

console.log(navigator,'serviceWorker' in navigator );
if ('serviceWorker' in navigator) {
    console.log("asdasdas");
   runtime.register();
}

const pageManager = new App();
pageManager.start();
