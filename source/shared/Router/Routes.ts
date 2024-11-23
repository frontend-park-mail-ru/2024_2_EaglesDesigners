import { LoginPage } from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { SignupPage } from "@/pages/SignupPage";
import { StatisticPage } from "@/pages/StatisticPage/ui/StatisticPage";
import { Routes } from "@/shared/Router/RouterTypes";
import { Survey } from "@/widgets/Survey/ui/Survey";

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
    {
      path: /^\/survey$/,
      view: new Survey(),
    },
    {
      path: /^\/statistic$/,
      view: new StatisticPage(),
    },
  ],
};

export const strictRoutes = ["/login", "/signup"];
