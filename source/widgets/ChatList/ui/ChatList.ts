import { API } from "../../../shared/api/api.js";
import { ChatCard } from "../../../entities/ChatCard";
import './ChatList.css'

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
    let chats = [
    ];
    const response = await API.get("/chats");
    if (response.chats) {
      chats = response.chats;
    }

    const template = require('./ChatList.handlebars');
    this.#parent.innerHTML = template({});

    const chatList = this.#parent.querySelector("#chat-list");
    const chatCard = new ChatCard(chatList);

    chats.map(chat => {
      chatCard.render(chat);
    });
    
  }
}
