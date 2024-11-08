import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { ContactsList } from "@/widgets/ContactsList";
import { AddGroupForm } from "@/widgets/AddGroupForm";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    const response = await API.get<ChatsResponse>("/chats");

    const chats: TChat[] = response.chats ?? [];

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list")!;
    const chatCard = new ChatCard(chatList, this.#chat);

    chats.forEach((chat) => {
      chatCard.render(chat);
    });

    const addChat = document.querySelector(".add-chat")!;
    const addChatButton = addChat.querySelector("#addChatButton")!;
    const addIcon = addChat.querySelector(".add-icon")!;
    const cancelIcon = addChat.querySelector(".cancel-icon")!;
    const addChatPopup = addChat.querySelector("#addChatPopUp")!;

    addChatButton.addEventListener("click", (event) => {
      event.stopPropagation();
      addChatPopup.style.display =
        addChatPopup.style.display === "none" ? "flex" : "none";

      cancelIcon.style.display =
        cancelIcon.style.display === "none" ? "inline" : "none";
      addIcon.style.display =
        addIcon.style.display === "none" ? "inline" : "none";
    });

    document.addEventListener("click", () => {
      addChatPopup.style.display = "none";

      if (addIcon.style.display === "none") {
        cancelIcon.style.display = "none";
        addIcon.style.display = "inline";
      }
    });

    addChat
      .querySelector(".create-personal-chat")!
      .addEventListener("click", () => {
        const contactForm = new ContactsList(this.#parent, this.#chat);
        contactForm.render();
      });

    addChat
      .querySelector(".create-group-chat")!
      .addEventListener("click", () => {
        const addGroupForm = new AddGroupForm(this.#parent, this.#chat);
        addGroupForm.render();
      });
  }
}
