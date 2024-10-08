import { API } from "../../../shared/api/api.js";
import ChatListTemplate from './ChatList.handlebars';

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

    this.#parent.innerHTML = ChatListTemplate({ chats });
  }
}
