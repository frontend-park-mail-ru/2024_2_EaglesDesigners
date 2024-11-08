import { App } from "./app";
import runtime from "serviceworker-webpack5-plugin/lib/runtime";

if ("serviceWorker" in navigator) {
  runtime.register();
}

const pageManager = new App();
pageManager.start();
