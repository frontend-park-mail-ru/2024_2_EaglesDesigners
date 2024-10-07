import { API } from "../../../shared/api/api.js";
import { ChatCard } from "../../../entities/ChatCard/chatCard.js";

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
    let chats = [];
    const response = await API.get("/chats");
    if (response.chats) {
      chats = response.chats;
    }
    
    chats.map(chat => {
      const chatCard = new ChatCard;
      console.log(chatCard.render(chat));
    });

    const template = Handlebars.templates.ChatList;
    this.#parent.innerHTML = template({ chats });
  }
}
