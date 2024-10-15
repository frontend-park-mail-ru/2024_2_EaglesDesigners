import { ChatList } from "@/widgets/ChatList";
import { LoginPage } from "@/pages/LoginPage";
import { API } from "@/shared/api/api.ts";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  #parent;
  constructor(parent:Element) {
    super();
    this.#parent = parent;
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  async render() {

    const user = localStorage.getItem('user');

    this.#parent.innerHTML = MainPageTemplate({user});

    const chatListParent = this.#parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = this.#parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>("/logout",{});
    
      if (!response.error) {
        const login = new LoginPage(this.#parent);
        login.render();
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
