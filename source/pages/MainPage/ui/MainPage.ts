import { ChatList } from "@/widgets/ChatList";
import { API } from "@/shared/api/api.ts";
import { EmptyRequest, EmptyResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router/Router";
import { UserStorage } from "@/entities/User";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  constructor() {
    super();
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  async render() {
    const user = localStorage.getItem("user");

    const parent = document.getElementById("root")!;

    parent.innerHTML = MainPageTemplate({ user });

    const chatListParent = parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>(
        "/logout",
        {},
      );

      if (!response.error) {
        UserStorage.setUserName("");
        Router.go("/login");
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
