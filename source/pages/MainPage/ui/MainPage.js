import { ChatList } from "../../../widgets/ChatList/ui/ChatList.js";
import { RenderLogin } from "../../LoginPage/LoginPage.js";
import { API } from "../../../shared/api/api.js";

export class MainPage {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }

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
