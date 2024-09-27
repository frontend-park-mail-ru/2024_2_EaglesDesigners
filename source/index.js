import { App } from "./app/app.js"; 
import { api } from "./shared/api/api.js";

const response = await api.get('auth');

if (response.error != null) {
    const pageManager = new App();
    pageManager.start();
}
// render чата



