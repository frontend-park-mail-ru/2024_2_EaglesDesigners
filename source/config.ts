import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { SignupPage } from "@/pages/SignupPage";

export const routes = {
    paths: [
      {
        path: /^\/login$/,
        view: new LoginPage(),
      },
      {
        path: /^\/signup$/,
        view: new SignupPage(),
      },
      {
        path: /^\/$/,
        view: new MainPage(),
      },
    ],
};

export const strictRoutes = ["/login", "/signup"];
export const defaultAuthRoutes: string[] = [];

export const serverHost = "http://212.233.98.59:8080";
export const localHost = "http://localhost:8080";
