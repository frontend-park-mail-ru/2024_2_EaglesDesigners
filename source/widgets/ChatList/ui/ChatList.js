import { API } from "../../../shared/api/api.js";
import ChatListTemplate from './ChatList.handlebars';
import { ChatCard } from "../../../entities/ChatCard/index.js";
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

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list");
    const chatCard = new ChatCard(chatList);

    chats.map(chat => {
      chatCard.render(chat);
    });
    
  }
}
