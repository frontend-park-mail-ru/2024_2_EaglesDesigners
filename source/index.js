// Базовый скрипт для отображения всех остальных страниц

import { RenderLogin } from "./pages/LoginPage/LoginPage.js";

const root = document.getElementById('root');
const login = new RenderLogin(root);

login.render();
