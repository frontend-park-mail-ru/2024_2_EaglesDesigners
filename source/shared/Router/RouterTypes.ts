import { View } from "@/app/View";
import { MainPage } from "@/pages/MainPage";

interface configRoute {
  path: RegExp;
  view: View | MainPage;
}

export interface Routes {
  paths: configRoute[];
}
