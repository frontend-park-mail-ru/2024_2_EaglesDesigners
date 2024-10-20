import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;

  constructor(parent: Element) {
    this.#parent = parent;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    let chats: TChat[] = [];
    const response = await API.get<ChatsResponse>("/chats");
    if (response.chats) {
      chats = response.chats;
    }

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list")!;
    const chatCard = new ChatCard(chatList);

    chats.map((chat) => {
      chatCard.render(chat);
    });

    const chatCardElements = document.querySelectorAll(".chat-card");
    chatCardElements.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }
}
