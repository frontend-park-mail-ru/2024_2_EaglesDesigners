import { ChatList } from "@/widgets/ChatList";
import { LoginPage } from "@/pages/LoginPage";
import { API } from "@/shared/api/api.ts";
import MainPageTemplate from './MainPage.handlebars'
import './MainPage.scss'

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  render(user) {
    this.#parent.innerHTML = MainPageTemplate({user});

    const chatListParent = this.#parent.querySelector("#chat-list-import");

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = this.#parent.querySelector(".exit-btn");

    const handleExitClick = async () => {
      const response = await API.post("/logout");
    
      if (!response.error) {
        const login = new LoginPage(this.#parent);
        login.render();
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
