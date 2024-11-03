import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { SignupPage } from "@/pages/SignupPage";
import { Routes } from "@/shared/Router/RouterTypes";

export const routes:Routes = {
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
      path: /^\/chat\/([a-f0-9\-]{1,36})$/,
      view: new MainPage(), 
    },
    {
      path: /^\/$/,
      view: new MainPage(),
    },
  ],
};

export const strictRoutes = ["/login", "/signup"];
export const defaultAuthRoutes: string[] = [];

export const localHost = "http://localhost:8080";
export const serverHost = "http://212.233.98.59:8080";