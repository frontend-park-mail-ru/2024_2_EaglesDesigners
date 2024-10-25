import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { ProfilePage } from "@/pages/ProfilePage";
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
    {
      path: /^\/profile$/,
      view: new ProfilePage(),
    },
  ],
};

export const strictRoutes = ["/login", "/signup"];
export const defaultAuthRoutes: string[] = [];

export const localHost = "http://localhost:8080";
export const serverHost = "http://212.233.98.59:8080";