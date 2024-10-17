import { ChatList } from "@/widgets/ChatList";
import { LoginPage } from "@/pages/LoginPage";
import { API } from "@/shared/api/api.ts";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  #router
  constructor(router : Router) {
    super();
    this.#router = router;
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  async render() {
    const parent = document.getElementById("root")!;
    const user = localStorage.getItem('user');

    parent.innerHTML = MainPageTemplate({user});

    const chatListParent = parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>("/logout",{});
    
      if (!response.error) {
        this.#router.go('/login')
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
