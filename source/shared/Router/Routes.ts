import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { SignupPage } from "@/pages/SignupPage";
import { Routes } from "@/shared/Router/RouterTypes";

export const routes: Routes = {
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
      path: /^\/chat\/(.+)$/,
      view: new MainPage(),
    },
    {
      path: /^\/$/,
      view: new MainPage(),
    },
  ],
};

export const strictRoutes = ["/login", "/signup"];
