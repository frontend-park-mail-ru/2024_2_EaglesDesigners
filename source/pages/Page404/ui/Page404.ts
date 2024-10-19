import { View } from "@/app/View";
import Page404Template from "./Page404.handlebars";
import "./Page404.scss";

export class Page404 extends View {
  #root = document.getElementById("root")!;
  constructor() {
    super();
  }

  render() {
    this.#root.innerHTML = Page404Template({});
  }
}
