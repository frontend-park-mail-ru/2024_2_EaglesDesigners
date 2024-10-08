import { ChatList } from "../../../widgets/ChatList/ui/ChatList.js";
import { RenderLogin } from "../../LoginPage/LoginPage.js";
import { API } from "../../../shared/api/api.js";

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
  render() {
    const template = Handlebars.templates.MainPage;
    this.#parent.innerHTML = template({});

    const chatListParent = this.#parent.querySelector("#chat-list-import");

    const chatList = new ChatList(chatListParent);
    chatList.render();

    const exitButton = this.#parent.querySelector(".exit-btn");

    exitButton.addEventListener("click", async () => {
      const response = await API.post("/logout");

      if (!response.error) {
        const login = new RenderLogin(this.#parent);
        login.render();
      }
    });
  }
}
