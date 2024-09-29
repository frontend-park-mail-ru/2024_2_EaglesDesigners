import { API } from "../../../shared/api/api.js";

export class ChatList {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  async render() {
    var chats = [];
    const response = await API.get("/chats");
    if (!response.error) {
      chats = response.chats;
    }

    const template = Handlebars.templates.ChatList;
    this.#parent.innerHTML = template({ chats });
  }
}
