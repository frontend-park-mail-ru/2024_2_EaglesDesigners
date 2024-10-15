import { ChatList } from "@/widgets/ChatList";
import { LoginPage } from "@/pages/LoginPage";
import { API } from "@/shared/api/api.ts";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  #parent;
  #user;
  constructor(parent:Element, user:string) {
    super();
    this.#parent = parent;
    this.#user = user;
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  render() {
    const user = this.#user;
    this.#parent.innerHTML = MainPageTemplate({user});

    const chatListParent = this.#parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = this.#parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post("/logout",{});
    
      if (!response.error) {
        const login = new LoginPage(this.#parent);
        login.render();
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
