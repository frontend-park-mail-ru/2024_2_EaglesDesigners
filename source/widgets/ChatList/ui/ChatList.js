import { API } from "../../../shared/api/api.js";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
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
